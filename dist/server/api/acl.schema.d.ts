import { z } from "zod";
export declare const postBodySchema: z.ZodObject<{
    principalType: z.ZodString;
    principalId: z.ZodString;
    permissions: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    principalType: string;
    principalId: string;
    permissions: string[];
}, {
    principalType: string;
    principalId: string;
    permissions: string[];
}>;
//# sourceMappingURL=acl.schema.d.ts.map