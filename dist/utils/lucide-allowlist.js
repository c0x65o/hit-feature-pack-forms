/**
 * Lucide icon resolver using wildcard import.
 */
'use client';
import * as LucideIcons from 'lucide-react';
function toPascalFromKebab(name) {
    return String(name || '')
        .trim()
        .split(/[-_\s]+/)
        .filter(Boolean)
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
        .join('');
}
function normalizeKey(name) {
    const raw = String(name || '').trim();
    if (!raw)
        return '';
    const val = raw.includes(':') ? raw.split(':', 2)[1] : raw;
    if (!val)
        return '';
    return val.includes('-') || val.includes('_') || val.includes(' ') ? toPascalFromKebab(val) : val;
}
export function resolveLucideIconStrict(name) {
    const key = normalizeKey(String(name || '').trim());
    if (!key) {
        throw new Error(`[hit-feature-pack-forms] Lucide icon name is empty`);
    }
    const Icon = LucideIcons[key];
    if (!Icon) {
        throw new Error(`[hit-feature-pack-forms] Unknown Lucide icon "${name}" (normalized: "${key}"). ` +
            `Check that the icon name is correct.`);
    }
    return Icon;
}
//# sourceMappingURL=lucide-allowlist.js.map