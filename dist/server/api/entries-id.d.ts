import { NextRequest } from 'next/server';
export declare const dynamic = "force-dynamic";
export declare const runtime = "nodejs";
/**
 * GET /api/forms/[id]/entries/[entryId]
 * Get a single entry
 * Requires: READ ACL
 */
export declare function GET(request: NextRequest): Promise<Response>;
/**
 * PUT /api/forms/[id]/entries/[entryId]
 * Update an entry (with history tracking)
 * Requires: WRITE ACL
 */
export declare function PUT(request: NextRequest): Promise<Response>;
/**
 * DELETE /api/forms/[id]/entries/[entryId]
 * Delete an entry (with history tracking)
 * Requires: DELETE ACL
 */
export declare function DELETE(request: NextRequest): Promise<Response>;
//# sourceMappingURL=entries-id.d.ts.map