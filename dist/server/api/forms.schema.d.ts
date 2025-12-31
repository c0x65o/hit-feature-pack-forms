import { z } from "zod";
export declare const postBodySchema: z.ZodObject<Omit<{
    id: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    slug: z.ZodString;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    isPublished: z.ZodOptional<z.ZodBoolean>;
    navShow: z.ZodOptional<z.ZodBoolean>;
    navPlacement: z.ZodOptional<z.ZodString>;
    navGroup: z.ZodOptional<z.ZodString>;
    navWeight: z.ZodOptional<z.ZodNumber>;
    navLabel: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    navIcon: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    navParentPath: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    aclEnabled: z.ZodOptional<z.ZodBoolean>;
    ownerUserId: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodOptional<z.ZodAny>;
    updatedAt: z.ZodOptional<z.ZodAny>;
}, "updatedAt" | "id" | "ownerUserId" | "createdAt">, "strip", z.ZodTypeAny, {
    name: string;
    slug: string;
    description?: string | null | undefined;
    isPublished?: boolean | undefined;
    navShow?: boolean | undefined;
    navPlacement?: string | undefined;
    navGroup?: string | undefined;
    navWeight?: number | undefined;
    navLabel?: string | null | undefined;
    navIcon?: string | null | undefined;
    navParentPath?: string | null | undefined;
    aclEnabled?: boolean | undefined;
}, {
    name: string;
    slug: string;
    description?: string | null | undefined;
    isPublished?: boolean | undefined;
    navShow?: boolean | undefined;
    navPlacement?: string | undefined;
    navGroup?: string | undefined;
    navWeight?: number | undefined;
    navLabel?: string | null | undefined;
    navIcon?: string | null | undefined;
    navParentPath?: string | null | undefined;
    aclEnabled?: boolean | undefined;
}>;
export declare const putBodySchema: z.ZodObject<{
    description: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    name: z.ZodOptional<z.ZodString>;
    slug: z.ZodOptional<z.ZodString>;
    isPublished: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
    navShow: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
    navPlacement: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    navGroup: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    navWeight: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    navLabel: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    navIcon: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    navParentPath: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    aclEnabled: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
} & {
    fields: z.ZodOptional<z.ZodArray<z.ZodObject<Omit<{
        id: z.ZodOptional<z.ZodString>;
        formId: z.ZodOptional<z.ZodString>;
        versionId: z.ZodOptional<z.ZodString>;
        key: z.ZodString;
        label: z.ZodString;
        type: z.ZodString;
        order: z.ZodOptional<z.ZodNumber>;
        hidden: z.ZodOptional<z.ZodBoolean>;
        required: z.ZodOptional<z.ZodBoolean>;
        showInTable: z.ZodOptional<z.ZodBoolean>;
        config: z.ZodOptional<z.ZodNullable<z.ZodType<import("drizzle-zod").Json, z.ZodTypeDef, import("drizzle-zod").Json>>>;
        defaultValue: z.ZodOptional<z.ZodNullable<z.ZodType<import("drizzle-zod").Json, z.ZodTypeDef, import("drizzle-zod").Json>>>;
        createdAt: z.ZodOptional<z.ZodAny>;
        updatedAt: z.ZodOptional<z.ZodAny>;
    }, "formId" | "updatedAt" | "id" | "createdAt" | "versionId">, "strip", z.ZodTypeAny, {
        type: string;
        key: string;
        label: string;
        defaultValue?: import("drizzle-zod").Json | undefined;
        hidden?: boolean | undefined;
        order?: number | undefined;
        required?: boolean | undefined;
        showInTable?: boolean | undefined;
        config?: import("drizzle-zod").Json | undefined;
    }, {
        type: string;
        key: string;
        label: string;
        defaultValue?: import("drizzle-zod").Json | undefined;
        hidden?: boolean | undefined;
        order?: number | undefined;
        required?: boolean | undefined;
        showInTable?: boolean | undefined;
        config?: import("drizzle-zod").Json | undefined;
    }>, "many">>;
    draft: z.ZodOptional<z.ZodObject<{
        fields: z.ZodOptional<z.ZodArray<z.ZodObject<Omit<{
            id: z.ZodOptional<z.ZodString>;
            formId: z.ZodOptional<z.ZodString>;
            versionId: z.ZodOptional<z.ZodString>;
            key: z.ZodString;
            label: z.ZodString;
            type: z.ZodString;
            order: z.ZodOptional<z.ZodNumber>;
            hidden: z.ZodOptional<z.ZodBoolean>;
            required: z.ZodOptional<z.ZodBoolean>;
            showInTable: z.ZodOptional<z.ZodBoolean>;
            config: z.ZodOptional<z.ZodNullable<z.ZodType<import("drizzle-zod").Json, z.ZodTypeDef, import("drizzle-zod").Json>>>;
            defaultValue: z.ZodOptional<z.ZodNullable<z.ZodType<import("drizzle-zod").Json, z.ZodTypeDef, import("drizzle-zod").Json>>>;
            createdAt: z.ZodOptional<z.ZodAny>;
            updatedAt: z.ZodOptional<z.ZodAny>;
        }, "formId" | "updatedAt" | "id" | "createdAt" | "versionId">, "strip", z.ZodTypeAny, {
            type: string;
            key: string;
            label: string;
            defaultValue?: import("drizzle-zod").Json | undefined;
            hidden?: boolean | undefined;
            order?: number | undefined;
            required?: boolean | undefined;
            showInTable?: boolean | undefined;
            config?: import("drizzle-zod").Json | undefined;
        }, {
            type: string;
            key: string;
            label: string;
            defaultValue?: import("drizzle-zod").Json | undefined;
            hidden?: boolean | undefined;
            order?: number | undefined;
            required?: boolean | undefined;
            showInTable?: boolean | undefined;
            config?: import("drizzle-zod").Json | undefined;
        }>, "many">>;
        listConfig: z.ZodOptional<z.ZodAny>;
    }, "strip", z.ZodTypeAny, {
        listConfig?: any;
        fields?: {
            type: string;
            key: string;
            label: string;
            defaultValue?: import("drizzle-zod").Json | undefined;
            hidden?: boolean | undefined;
            order?: number | undefined;
            required?: boolean | undefined;
            showInTable?: boolean | undefined;
            config?: import("drizzle-zod").Json | undefined;
        }[] | undefined;
    }, {
        listConfig?: any;
        fields?: {
            type: string;
            key: string;
            label: string;
            defaultValue?: import("drizzle-zod").Json | undefined;
            hidden?: boolean | undefined;
            order?: number | undefined;
            required?: boolean | undefined;
            showInTable?: boolean | undefined;
            config?: import("drizzle-zod").Json | undefined;
        }[] | undefined;
    }>>;
    listConfig: z.ZodOptional<z.ZodAny>;
}, "strip", z.ZodTypeAny, {
    draft?: {
        listConfig?: any;
        fields?: {
            type: string;
            key: string;
            label: string;
            defaultValue?: import("drizzle-zod").Json | undefined;
            hidden?: boolean | undefined;
            order?: number | undefined;
            required?: boolean | undefined;
            showInTable?: boolean | undefined;
            config?: import("drizzle-zod").Json | undefined;
        }[] | undefined;
    } | undefined;
    description?: string | null | undefined;
    name?: string | undefined;
    slug?: string | undefined;
    isPublished?: boolean | undefined;
    navShow?: boolean | undefined;
    navPlacement?: string | undefined;
    navGroup?: string | undefined;
    navWeight?: number | undefined;
    navLabel?: string | null | undefined;
    navIcon?: string | null | undefined;
    navParentPath?: string | null | undefined;
    aclEnabled?: boolean | undefined;
    listConfig?: any;
    fields?: {
        type: string;
        key: string;
        label: string;
        defaultValue?: import("drizzle-zod").Json | undefined;
        hidden?: boolean | undefined;
        order?: number | undefined;
        required?: boolean | undefined;
        showInTable?: boolean | undefined;
        config?: import("drizzle-zod").Json | undefined;
    }[] | undefined;
}, {
    draft?: {
        listConfig?: any;
        fields?: {
            type: string;
            key: string;
            label: string;
            defaultValue?: import("drizzle-zod").Json | undefined;
            hidden?: boolean | undefined;
            order?: number | undefined;
            required?: boolean | undefined;
            showInTable?: boolean | undefined;
            config?: import("drizzle-zod").Json | undefined;
        }[] | undefined;
    } | undefined;
    description?: string | null | undefined;
    name?: string | undefined;
    slug?: string | undefined;
    isPublished?: boolean | undefined;
    navShow?: boolean | undefined;
    navPlacement?: string | undefined;
    navGroup?: string | undefined;
    navWeight?: number | undefined;
    navLabel?: string | null | undefined;
    navIcon?: string | null | undefined;
    navParentPath?: string | null | undefined;
    aclEnabled?: boolean | undefined;
    listConfig?: any;
    fields?: {
        type: string;
        key: string;
        label: string;
        defaultValue?: import("drizzle-zod").Json | undefined;
        hidden?: boolean | undefined;
        order?: number | undefined;
        required?: boolean | undefined;
        showInTable?: boolean | undefined;
        config?: import("drizzle-zod").Json | undefined;
    }[] | undefined;
}>;
//# sourceMappingURL=forms.schema.d.ts.map