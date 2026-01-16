import { NextRequest } from 'next/server';
export declare const dynamic = "force-dynamic";
export declare const runtime = "nodejs";
/**
 * GET /api/forms/[id]/entries
 * List entries for a form with pagination, sorting, and search
 * Requires: READ ACL
 */
export declare function GET(request: NextRequest): Promise<Response>;
/**
 * POST /api/forms/[id]/entries
 * Create a new entry
 * Requires: WRITE ACL
 */
export declare function POST(request: NextRequest): Promise<Response>;
//# sourceMappingURL=entries.d.ts.map