import { NextRequest, NextResponse } from 'next/server';
export declare const dynamic = "force-dynamic";
export declare const runtime = "nodejs";
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
    version: {
        id: string;
        version: number;
        status: 'draft' | 'published';
    } | null;
    fields: FormSchemaField[];
    endpoints: {
        entries: {
            list: {
                method: 'GET';
                path: string;
            };
            create: {
                method: 'POST';
                path: string;
            };
            detail: {
                method: 'GET';
                pathTemplate: string;
            };
            update: {
                method: 'PUT';
                pathTemplate: string;
            };
            delete: {
                method: 'DELETE';
                pathTemplate: string;
            };
        };
    };
};
/**
 * GET /api/forms/[id]/schema
 *
 * Purpose: Return a platform-agnostic schema for a form so non-React clients (mobile, etc)
 * can render forms and validate payloads without importing React components.
 *
 * Access: admin OR READ ACL (same intent as reading entries).
 */
export declare function GET(request: NextRequest): Promise<NextResponse<{
    error: string;
}> | NextResponse<FormSchemaResponse>>;
export {};
//# sourceMappingURL=forms-id-schema.d.ts.map