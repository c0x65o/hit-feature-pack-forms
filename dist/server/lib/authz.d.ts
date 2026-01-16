import { type EntityAuthzOp } from '@hit/feature-pack-auth-core/server/lib/schema-authz';
export declare function requireFormCoreEntityAuthz(request: Request, args: {
    entityKey: string;
    op: EntityAuthzOp;
}): Promise<Response | import("@hit/feature-pack-auth-core/server/lib/schema-authz").EntityAuthzResult>;
//# sourceMappingURL=authz.d.ts.map