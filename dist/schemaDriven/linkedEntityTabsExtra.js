'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { LinkedEntityTabs } from '../components/LinkedEntityTabs';
function asRecord(v) {
    return v && typeof v === 'object' && !Array.isArray(v) ? v : null;
}
export function entityKeyToFormsEntityKind(entityKey) {
    return String(entityKey || '').trim().replace(/\./g, '_');
}
export function splitLinkedEntityTabsExtra(extrasAny) {
    const extras = Array.isArray(extrasAny) ? extrasAny : [];
    let linked = null;
    const rest = [];
    for (const x of extras) {
        const r = asRecord(x);
        const kind = String(r?.kind || '');
        if (!linked && kind === 'linkedEntityTabs') {
            linked = r;
            continue;
        }
        rest.push(x);
    }
    return { linkedEntityTabs: linked, extras: rest };
}
export function wrapWithLinkedEntityTabsIfConfigured(args) {
    const spec = args.linkedEntityTabs;
    if (!spec)
        return args.overview;
    if (!args.navigate)
        return args.overview; // LinkedEntityTabs requires onNavigate
    const entityKind = String(spec.entityKind || entityKeyToFormsEntityKind(args.entityKey) || 'project').trim();
    const entityIdField = String(spec.entityIdField || 'id').trim() || 'id';
    const entityId = String(args.record?.[entityIdField] ?? args.record?.id ?? '').trim();
    if (!entityKind || !entityId)
        return args.overview;
    const overviewLabel = spec.overviewLabel ? String(spec.overviewLabel) : undefined;
    const includeZeroCountTabs = typeof spec.includeZeroCountTabs === 'boolean' ? Boolean(spec.includeZeroCountTabs) : undefined;
    const pageSize = Number.isFinite(Number(spec.pageSize)) ? Number(spec.pageSize) : undefined;
    return (_jsx(LinkedEntityTabs, { entity: { kind: entityKind, id: entityId }, overview: args.overview, overviewLabel: overviewLabel, includeZeroCountTabs: includeZeroCountTabs, pageSize: pageSize, onNavigate: args.navigate }));
}
//# sourceMappingURL=linkedEntityTabsExtra.js.map