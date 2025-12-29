import { z } from "zod";
// Schema-only module for:
// - POST /api/forms/[id]/acl
export const postBodySchema = z.object({
    principalType: z.string().min(1),
    principalId: z.string().min(1),
    permissions: z.array(z.string()).min(1),
});
//# sourceMappingURL=acl.schema.js.map