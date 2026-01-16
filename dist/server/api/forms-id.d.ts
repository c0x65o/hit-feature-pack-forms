import { NextRequest } from 'next/server';
export declare const dynamic = "force-dynamic";
export declare const runtime = "nodejs";
/**
 * GET /api/forms/[id]
 * Get a form with its current draft version and fields
 * Requires: admin role OR READ ACL
 */
export declare function GET(request: NextRequest): Promise<Response>;
/**
 * PUT /api/forms/[id]
 * Update form metadata and fields
 * Requires: admin role (for form definitions)
 */
export declare function PUT(request: NextRequest): Promise<Response>;
/**
 * DELETE /api/forms/[id]
 * Delete form and all related data (versions, fields, entries, history, ACLs)
 * Requires: admin role
 */
export declare function DELETE(request: NextRequest): Promise<Response>;
//# sourceMappingURL=forms-id.d.ts.map