// src/server/api/linked.ts
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { forms, formVersions, formFields, formEntries, formsAcls } from '@/lib/feature-pack-schemas';
import { and, desc, eq, inArray, or, sql } from 'drizzle-orm';
import { extractUserFromRequest } from '../auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type AccessibleForm = { id: string; name: string; slug: string };

function isSafeKey(v: string): boolean {
  // allow: project, company, contact, platform_steam, uuid-ish, etc.
  return /^[a-zA-Z0-9_-]+$/.test(v);
}

/**
 * GET /api/forms/linked?entityKind=project&entityId=...
 *
 * Returns all published forms the user can READ which contain an entity_reference field
 * targeting entityKind, along with a per-field linked-entry count for entityId.
 *
 * This is intended to power "dynamic tabs" across any entity page (projects/companies/etc).
 */
export async function GET(request: NextRequest) {
  try {
    const user = extractUserFromRequest(request);
    if (!user?.sub) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const entityKindRaw = (searchParams.get('entityKind') || '').trim();
    const entityIdRaw = (searchParams.get('entityId') || '').trim();

    if (!entityKindRaw || !entityIdRaw) {
      return NextResponse.json({ error: 'Missing entityKind or entityId' }, { status: 400 });
    }
    if (!isSafeKey(entityKindRaw) || !isSafeKey(entityIdRaw)) {
      return NextResponse.json({ error: 'Invalid entityKind or entityId' }, { status: 400 });
    }

    const entityKind = entityKindRaw;
    const entityId = entityIdRaw;

    const db = getDb();

    const roles = user.roles || [];
    const principalIds: string[] = [user.sub, ...roles].filter((x): x is string => Boolean(x));

    // Forms user can READ via ACL
    const aclReadableFormIds: string[] = [];
    if (principalIds.length > 0) {
      const aclEntries = await db
        .select({ formId: formsAcls.formId, permissions: formsAcls.permissions })
        .from(formsAcls)
        .where(or(...principalIds.map((id: string) => eq(formsAcls.principalId, id)))!);

      for (const entry of aclEntries) {
        const perms = entry.permissions || [];
        if (perms.includes('READ')) {
          aclReadableFormIds.push(entry.formId);
        }
      }
    }

    // Accessible forms: (has READ via ACL) OR (published + ACL disabled)
    const accessOr = or(
      ...(aclReadableFormIds.length > 0 ? [inArray(forms.id, Array.from(new Set(aclReadableFormIds)))] : []),
      and(eq(forms.isPublished, true), eq(forms.aclEnabled, false))!
    );

    // Only consider published forms for entity tabs
    const accessibleForms = (await db
      .select({ id: forms.id, name: forms.name, slug: forms.slug })
      .from(forms)
      .where(and(eq(forms.isPublished, true), accessOr!))) as AccessibleForm[];

    if (accessibleForms.length === 0) {
      return NextResponse.json({ items: [] });
    }

    const accessibleFormIds = accessibleForms.map((f: AccessibleForm) => f.id);

    // Latest published version per form
    const publishedVersions = await db
      .select({ id: formVersions.id, formId: formVersions.formId, version: formVersions.version })
      .from(formVersions)
      .where(and(eq(formVersions.status, 'published'), inArray(formVersions.formId, accessibleFormIds)))
      .orderBy(desc(formVersions.version));

    const latestPublishedVersionByFormId = new Map<string, string>();
    for (const v of publishedVersions) {
      if (!latestPublishedVersionByFormId.has(v.formId)) {
        latestPublishedVersionByFormId.set(v.formId, v.id);
      }
    }

    const latestVersionIds = Array.from(latestPublishedVersionByFormId.values());
    if (latestVersionIds.length === 0) {
      return NextResponse.json({ items: [] });
    }

    const fields = await db
      .select()
      .from(formFields)
      .where(inArray(formFields.versionId, latestVersionIds));

    const formById = new Map<string, AccessibleForm>(accessibleForms.map((f: AccessibleForm) => [f.id, f]));

    const results: Array<{
      formId: string;
      formName: string;
      formSlug: string;
      entityFieldKey: string;
      count: number;
    }> = [];

    for (const [formId, versionId] of latestPublishedVersionByFormId.entries()) {
      const form = formById.get(formId);
      if (!form) continue;

      const fieldsForForm = fields.filter((f: any) => f.versionId === versionId);
      const entityFields = fieldsForForm.filter((f: any) => {
        if (f.type !== 'entity_reference') return false;
        const cfg = f.config && typeof f.config === 'object' ? (f.config as any) : null;
        const kind = String(cfg?.entity?.kind || '');
        return kind === entityKind;
      });

      for (const field of entityFields) {
        if (!field?.key || typeof field.key !== 'string' || !isSafeKey(field.key)) continue;

        const countResult = await db
          .select({ count: sql<number>`count(*)` })
          .from(formEntries)
          .where(
            and(
              eq(formEntries.formId, formId),
              sql`(
                ${formEntries.data}->${sql.raw(`'${field.key}'`)} @> ${sql.raw(`'{"entityKind":"${entityKind}","entityId":"${entityId}"}'`)}::jsonb
                OR ${formEntries.data}->${sql.raw(`'${field.key}'`)} @> ${sql.raw(`'[{"entityKind":"${entityKind}","entityId":"${entityId}"}]'`)}::jsonb
              )`
            )
          );

        results.push({
          formId: form.id,
          formName: form.name,
          formSlug: form.slug,
          entityFieldKey: field.key,
          count: Number(countResult[0]?.count || 0),
        });
      }
    }

    // Stable ordering
    results.sort((a, b) => a.formName.localeCompare(b.formName) || a.entityFieldKey.localeCompare(b.entityFieldKey));

    return NextResponse.json({ items: results });
  } catch (error) {
    console.error('[forms] Linked forms error:', error);
    return NextResponse.json({ error: 'Failed to fetch linked forms' }, { status: 500 });
  }
}


