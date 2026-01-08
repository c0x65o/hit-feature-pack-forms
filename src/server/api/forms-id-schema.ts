import { NextRequest, NextResponse } from 'next/server';
import { and, desc, eq, or } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { forms, formVersions, formFields, formsAcls } from '@/lib/feature-pack-schemas';
import { extractUserFromRequest } from '../auth';
import { FORM_PERMISSIONS } from '../../schema/forms';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type FormSchemaField = {
  key: string;
  label: string;
  type: string;
  order: number;
  hidden: boolean;
  required: boolean;
  showInTable: boolean;
  config: unknown;
  defaultValue: unknown;
};

type FormSchemaResponse = {
  schemaVersion: 1;
  form: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    isPublished: boolean;
    aclEnabled: boolean;
  };
  version: { id: string; version: number; status: 'draft' | 'published' } | null;
  fields: FormSchemaField[];
  endpoints: {
    entries: {
      list: { method: 'GET'; path: string };
      create: { method: 'POST'; path: string };
      detail: { method: 'GET'; pathTemplate: string };
      update: { method: 'PUT'; pathTemplate: string };
      delete: { method: 'DELETE'; pathTemplate: string };
    };
  };
};

function extractFormId(request: NextRequest): string | null {
  // /api/forms/{id}/schema -> id is the second-to-last segment
  const url = new URL(request.url);
  const parts = url.pathname.split('/').filter(Boolean);
  if (parts.length < 4) return null;
  if (parts[parts.length - 1] !== 'schema') return null;
  return parts[parts.length - 2] || null;
}

function isAdmin(roles: string[]): boolean {
  return roles.includes('admin') || roles.includes('Admin');
}

async function hasFormPermission(args: {
  db: ReturnType<typeof getDb>;
  formId: string;
  userId: string;
  roles: string[];
  permission: string;
}): Promise<boolean> {
  const { db, formId, userId, roles, permission } = args;
  const principalIds = [userId, ...(roles || [])].filter(Boolean);
  if (principalIds.length === 0) return false;

  const aclEntries = await db
    .select()
    .from(formsAcls)
    .where(
      and(
        eq(formsAcls.formId, formId),
        or(...principalIds.map((id) => eq(formsAcls.principalId, id)))
      )
    );
  if (aclEntries.length === 0) return false;

  const allPermissions = aclEntries.flatMap((e: { permissions: string[] | null }) => e.permissions || []);
  return allPermissions.includes(permission);
}

async function getBestVisibleVersion(args: {
  db: ReturnType<typeof getDb>;
  formId: string;
  isAdminUser: boolean;
}): Promise<{ id: string; formId: string; version: number; status: 'draft' | 'published' } | null> {
  const { db, formId, isAdminUser } = args;

  // Prefer published for non-admin users; admins prefer draft.
  const preferred = isAdminUser ? 'draft' : 'published';
  const fallback = isAdminUser ? 'published' : 'draft';

  const [v1] = await db
    .select()
    .from(formVersions)
    .where(and(eq(formVersions.formId, formId), eq(formVersions.status, preferred)))
    .orderBy(desc(formVersions.version))
    .limit(1);
  if (v1) return v1 as any;

  const [v2] = await db
    .select()
    .from(formVersions)
    .where(and(eq(formVersions.formId, formId), eq(formVersions.status, fallback)))
    .orderBy(desc(formVersions.version))
    .limit(1);
  return (v2 as any) || null;
}

/**
 * GET /api/forms/[id]/schema
 *
 * Purpose: Return a platform-agnostic schema for a form so non-React clients (mobile, etc)
 * can render forms and validate payloads without importing React components.
 *
 * Access: admin OR READ ACL (same intent as reading entries).
 */
export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const formId = extractFormId(request);
    if (!formId) return NextResponse.json({ error: 'Missing form id' }, { status: 400 });

    const user = extractUserFromRequest(request);
    if (!user?.sub) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const roles = Array.isArray(user.roles) ? user.roles : [];
    const admin = isAdmin(roles);

    const canAccess =
      admin ||
      (await hasFormPermission({
        db,
        formId,
        userId: user.sub,
        roles,
        permission: FORM_PERMISSIONS.READ,
      }));
    if (!canAccess) return NextResponse.json({ error: 'Form not found' }, { status: 404 });

    const [form] = await db.select().from(forms).where(eq(forms.id, formId)).limit(1);
    if (!form) return NextResponse.json({ error: 'Form not found' }, { status: 404 });

    const version = await getBestVisibleVersion({ db, formId, isAdminUser: admin });

    const fieldsRaw = version
      ? await db
          .select()
          .from(formFields)
          .where(eq(formFields.versionId, (version as any).id))
          .orderBy(formFields.order)
      : [];

    const fields: FormSchemaField[] = (fieldsRaw as any[]).map((f: any) => ({
      key: String(f.key),
      label: String(f.label),
      type: String(f.type),
      order: Number(f.order ?? 0) || 0,
      hidden: Boolean(f.hidden),
      required: Boolean(f.required),
      showInTable: Boolean(f.showInTable),
      config: f.config ?? null,
      defaultValue: f.defaultValue ?? null,
    }));

    const base = `/api/forms/${encodeURIComponent(formId)}`;
    const response: FormSchemaResponse = {
      schemaVersion: 1,
      form: {
        id: String((form as any).id),
        name: String((form as any).name),
        slug: String((form as any).slug),
        description: ((form as any).description ?? null) as any,
        isPublished: Boolean((form as any).isPublished),
        aclEnabled: Boolean((form as any).aclEnabled),
      },
      version: version
        ? {
            id: String((version as any).id),
            version: Number((version as any).version ?? 0) || 0,
            status: (((version as any).status || 'draft') as 'draft' | 'published') ?? 'draft',
          }
        : null,
      fields,
      endpoints: {
        entries: {
          list: { method: 'GET', path: `${base}/entries` },
          create: { method: 'POST', path: `${base}/entries` },
          detail: { method: 'GET', pathTemplate: `${base}/entries/{entryId}` },
          update: { method: 'PUT', pathTemplate: `${base}/entries/{entryId}` },
          delete: { method: 'DELETE', pathTemplate: `${base}/entries/{entryId}` },
        },
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('[forms] Get form schema error:', error);
    return NextResponse.json({ error: 'Failed to fetch form schema' }, { status: 500 });
  }
}

