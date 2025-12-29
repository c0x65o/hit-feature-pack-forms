import { z } from "zod";
export declare const postBodySchema: z.ZodObject<{
    data: z.ZodRecord<z.ZodString, z.ZodAny>;
}, "strip", z.ZodTypeAny, {
    data: Record<string, any>;
}, {
    data: Record<string, any>;
}>;
export declare const putBodySchema: z.ZodObject<{
    data: z.ZodRecord<z.ZodString, z.ZodAny>;
}, "strip", z.ZodTypeAny, {
    data: Record<string, any>;
}, {
    data: Record<string, any>;
}>;
//# sourceMappingURL=entries.schema.d.ts.map