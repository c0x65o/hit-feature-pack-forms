// src/server/api/acl.ts
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { formsAcls, forms } from '@/lib/feature-pack-schemas';
import { eq, desc, and } from 'drizzle-orm';
import { getUserId } from '../auth';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
/**
 * GET /api/forms/[id]/acl
 * List ACLs for a form
 */
export async function GET(request) {
    try {
        const db = getDb();
        const userId = getUserId(request);
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const url = new URL(request.url);
        const parts = url.pathname.split('/');
        const formsIndex = parts.indexOf('forms');
        const formId = formsIndex >= 0 && parts.length > formsIndex + 1 ? parts[formsIndex + 1] : null;
        if (!formId) {
            return NextResponse.json({ error: 'Missing form id' }, { status: 400 });
        }
        // Get form and check access
        const [form] = await db
            .select()
            .from(forms)
            .where(eq(forms.id, formId))
            .limit(1);
        if (!form) {
            return NextResponse.json({ error: 'Form not found' }, { status: 404 });
        }
        // Only owner can view ACLs (unless ACL is enabled and they have MANAGE_ACL permission)
        if (form.ownerUserId !== userId && !form.aclEnabled) {
            return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
        }
        // If ACL is enabled, check if user has MANAGE_ACL permission
        if (form.aclEnabled && form.ownerUserId !== userId) {
            // TODO: Implement ACL permission check
            // For now, only owner can view ACLs
        }
        const items = await db
            .select()
            .from(formsAcls)
            .where(and(eq(formsAcls.resourceType, 'form'), eq(formsAcls.resourceId, formId)))
            .orderBy(desc(formsAcls.createdAt));
        return NextResponse.json({ items });
    }
    catch (error) {
        console.error('[forms] List ACL error:', error);
        return NextResponse.json({ error: 'Failed to fetch ACLs' }, { status: 500 });
    }
}
/**
 * POST /api/forms/[id]/acl
 * Create ACL entry for a form
 */
export async function POST(request) {
    try {
        const db = getDb();
        const userId = getUserId(request);
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const url = new URL(request.url);
        const parts = url.pathname.split('/');
        const formsIndex = parts.indexOf('forms');
        const formId = formsIndex >= 0 && parts.length > formsIndex + 1 ? parts[formsIndex + 1] : null;
        if (!formId) {
            return NextResponse.json({ error: 'Missing form id' }, { status: 400 });
        }
        const body = await request.json();
        // Validate required fields
        if (!body.principalType || !body.principalId || !body.permissions) {
            return NextResponse.json({ error: 'Missing required fields: principalType, principalId, permissions' }, { status: 400 });
        }
        // Get form and check access
        const [form] = await db
            .select()
            .from(forms)
            .where(eq(forms.id, formId))
            .limit(1);
        if (!form) {
            return NextResponse.json({ error: 'Form not found' }, { status: 404 });
        }
        // Only owner can manage ACLs (unless ACL is enabled and they have MANAGE_ACL permission)
        if (form.ownerUserId !== userId && !form.aclEnabled) {
            return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
        }
        // If ACL is enabled, check if user has MANAGE_ACL permission
        if (form.aclEnabled && form.ownerUserId !== userId) {
            // TODO: Implement ACL permission check
            // For now, only owner can manage ACLs
        }
        // Check if ACL entry already exists
        const [existing] = await db
            .select()
            .from(formsAcls)
            .where(and(eq(formsAcls.resourceType, 'form'), eq(formsAcls.resourceId, formId), eq(formsAcls.principalType, body.principalType), eq(formsAcls.principalId, body.principalId)))
            .limit(1);
        if (existing) {
            return NextResponse.json({ error: 'ACL entry already exists' }, { status: 400 });
        }
        const result = await db
            .insert(formsAcls)
            .values({
            resourceType: 'form',
            resourceId: formId,
            principalType: body.principalType,
            principalId: body.principalId,
            permissions: Array.isArray(body.permissions) ? body.permissions : [],
            createdBy: userId,
        })
            .returning();
        return NextResponse.json(result[0], { status: 201 });
    }
    catch (error) {
        console.error('[forms] Create ACL error:', error);
        return NextResponse.json({ error: 'Failed to create ACL' }, { status: 500 });
    }
}
/**
 * DELETE /api/forms/[id]/acl/[aclId]
 * Delete ACL entry
 */
export async function DELETE(request) {
    try {
        const db = getDb();
        const userId = getUserId(request);
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const url = new URL(request.url);
        const parts = url.pathname.split('/');
        const formsIndex = parts.indexOf('forms');
        const aclIndex = parts.indexOf('acl');
        const formId = formsIndex >= 0 && parts.length > formsIndex + 1 ? parts[formsIndex + 1] : null;
        const aclId = aclIndex >= 0 && parts.length > aclIndex + 1 ? parts[aclIndex + 1] : null;
        if (!formId || !aclId) {
            return NextResponse.json({ error: 'Missing form or ACL id' }, { status: 400 });
        }
        // Get form and check access
        const [form] = await db
            .select()
            .from(forms)
            .where(eq(forms.id, formId))
            .limit(1);
        if (!form) {
            return NextResponse.json({ error: 'Form not found' }, { status: 404 });
        }
        // Only owner can manage ACLs
        if (form.ownerUserId !== userId) {
            return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
        }
        // Get ACL entry
        const [acl] = await db
            .select()
            .from(formsAcls)
            .where(and(eq(formsAcls.id, aclId), eq(formsAcls.resourceType, 'form'), eq(formsAcls.resourceId, formId)))
            .limit(1);
        if (!acl) {
            return NextResponse.json({ error: 'ACL entry not found' }, { status: 404 });
        }
        await db.delete(formsAcls).where(eq(formsAcls.id, aclId));
        return NextResponse.json({ success: true });
    }
    catch (error) {
        console.error('[forms] Delete ACL error:', error);
        return NextResponse.json({ error: 'Failed to delete ACL' }, { status: 500 });
    }
}
//# sourceMappingURL=acl.js.map