import { requireEntityAuthz, type EntityAuthzOp } from '@hit/feature-pack-auth-core/server/lib/schema-authz';

export async function requireFormCoreEntityAuthz(
  request: Request,
  args: { entityKey: string; op: EntityAuthzOp }
) {
  return requireEntityAuthz(request, {
    entityKey: args.entityKey,
    op: args.op,
    logPrefix: 'Form-Core',
  });
}
