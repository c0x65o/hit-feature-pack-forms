import { requireEntityAuthz } from '@hit/feature-pack-auth-core/server/lib/schema-authz';
export async function requireFormCoreEntityAuthz(request, args) {
    return requireEntityAuthz(request, {
        entityKey: args.entityKey,
        op: args.op,
        logPrefix: 'Form-Core',
    });
}
//# sourceMappingURL=authz.js.map