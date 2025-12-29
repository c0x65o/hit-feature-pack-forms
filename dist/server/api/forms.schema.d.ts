import { z } from "zod";
export declare const postBodySchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    navShow: z.ZodOptional<z.ZodBoolean>;
    navPlacement: z.ZodOptional<z.ZodString>;
    navGroup: z.ZodOptional<z.ZodString>;
    navWeight: z.ZodOptional<z.ZodNumber>;
    navLabel: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    navIcon: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    navParentPath: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    description?: string | null | undefined;
    navShow?: boolean | undefined;
    navPlacement?: string | undefined;
    navGroup?: string | undefined;
    navWeight?: number | undefined;
    navLabel?: string | null | undefined;
    navIcon?: string | null | undefined;
    navParentPath?: string | null | undefined;
}, {
    name: string;
    description?: string | null | undefined;
    navShow?: boolean | undefined;
    navPlacement?: string | undefined;
    navGroup?: string | undefined;
    navWeight?: number | undefined;
    navLabel?: string | null | undefined;
    navIcon?: string | null | undefined;
    navParentPath?: string | null | undefined;
}>;
export declare const putBodySchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    navShow: z.ZodOptional<z.ZodBoolean>;
    navPlacement: z.ZodOptional<z.ZodString>;
    navGroup: z.ZodOptional<z.ZodString>;
    navWeight: z.ZodOptional<z.ZodNumber>;
    navLabel: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    navIcon: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    navParentPath: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    fields: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        key: z.ZodString;
        label: z.ZodString;
        type: z.ZodString;
        order: z.ZodOptional<z.ZodNumber>;
        hidden: z.ZodOptional<z.ZodBoolean>;
        required: z.ZodOptional<z.ZodBoolean>;
        config: z.ZodOptional<z.ZodNullable<z.ZodAny>>;
        defaultValue: z.ZodOptional<z.ZodNullable<z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
        type: string;
        key: string;
        label: string;
        id?: string | undefined;
        order?: number | undefined;
        hidden?: boolean | undefined;
        required?: boolean | undefined;
        config?: any;
        defaultValue?: any;
    }, {
        type: string;
        key: string;
        label: string;
        id?: string | undefined;
        order?: number | undefined;
        hidden?: boolean | undefined;
        required?: boolean | undefined;
        config?: any;
        defaultValue?: any;
    }>, "many">>;
    draft: z.ZodOptional<z.ZodObject<{
        fields: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            key: z.ZodString;
            label: z.ZodString;
            type: z.ZodString;
            order: z.ZodOptional<z.ZodNumber>;
            hidden: z.ZodOptional<z.ZodBoolean>;
            required: z.ZodOptional<z.ZodBoolean>;
            config: z.ZodOptional<z.ZodNullable<z.ZodAny>>;
            defaultValue: z.ZodOptional<z.ZodNullable<z.ZodAny>>;
        }, "strip", z.ZodTypeAny, {
            type: string;
            key: string;
            label: string;
            id?: string | undefined;
            order?: number | undefined;
            hidden?: boolean | undefined;
            required?: boolean | undefined;
            config?: any;
            defaultValue?: any;
        }, {
            type: string;
            key: string;
            label: string;
            id?: string | undefined;
            order?: number | undefined;
            hidden?: boolean | undefined;
            required?: boolean | undefined;
            config?: any;
            defaultValue?: any;
        }>, "many">>;
        listConfig: z.ZodOptional<z.ZodAny>;
    }, "strip", z.ZodTypeAny, {
        listConfig?: any;
        fields?: {
            type: string;
            key: string;
            label: string;
            id?: string | undefined;
            order?: number | undefined;
            hidden?: boolean | undefined;
            required?: boolean | undefined;
            config?: any;
            defaultValue?: any;
        }[] | undefined;
    }, {
        listConfig?: any;
        fields?: {
            type: string;
            key: string;
            label: string;
            id?: string | undefined;
            order?: number | undefined;
            hidden?: boolean | undefined;
            required?: boolean | undefined;
            config?: any;
            defaultValue?: any;
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
            id?: string | undefined;
            order?: number | undefined;
            hidden?: boolean | undefined;
            required?: boolean | undefined;
            config?: any;
            defaultValue?: any;
        }[] | undefined;
    } | undefined;
    description?: string | null | undefined;
    name?: string | undefined;
    navShow?: boolean | undefined;
    navPlacement?: string | undefined;
    navGroup?: string | undefined;
    navWeight?: number | undefined;
    navLabel?: string | null | undefined;
    navIcon?: string | null | undefined;
    navParentPath?: string | null | undefined;
    listConfig?: any;
    fields?: {
        type: string;
        key: string;
        label: string;
        id?: string | undefined;
        order?: number | undefined;
        hidden?: boolean | undefined;
        required?: boolean | undefined;
        config?: any;
        defaultValue?: any;
    }[] | undefined;
}, {
    draft?: {
        listConfig?: any;
        fields?: {
            type: string;
            key: string;
            label: string;
            id?: string | undefined;
            order?: number | undefined;
            hidden?: boolean | undefined;
            required?: boolean | undefined;
            config?: any;
            defaultValue?: any;
        }[] | undefined;
    } | undefined;
    description?: string | null | undefined;
    name?: string | undefined;
    navShow?: boolean | undefined;
    navPlacement?: string | undefined;
    navGroup?: string | undefined;
    navWeight?: number | undefined;
    navLabel?: string | null | undefined;
    navIcon?: string | null | undefined;
    navParentPath?: string | null | undefined;
    listConfig?: any;
    fields?: {
        type: string;
        key: string;
        label: string;
        id?: string | undefined;
        order?: number | undefined;
        hidden?: boolean | undefined;
        required?: boolean | undefined;
        config?: any;
        defaultValue?: any;
    }[] | undefined;
}>;
//# sourceMappingURL=forms.schema.d.ts.map