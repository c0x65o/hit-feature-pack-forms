import React from 'react';
export type LinkedEntityTabsExtraSpec = {
    kind: 'linkedEntityTabs';
    entityKind?: string;
    entityIdField?: string;
    overviewLabel?: string;
    includeZeroCountTabs?: boolean;
    pageSize?: number;
};
export declare function entityKeyToFormsEntityKind(entityKey: string): string;
export declare function splitLinkedEntityTabsExtra(extrasAny: unknown): {
    linkedEntityTabs: LinkedEntityTabsExtraSpec | null;
    extras: any[];
};
export declare function wrapWithLinkedEntityTabsIfConfigured(args: {
    linkedEntityTabs: LinkedEntityTabsExtraSpec | null;
    entityKey: string;
    record: any;
    navigate?: (path: string) => void;
    overview: React.ReactNode;
}): React.ReactNode;
//# sourceMappingURL=linkedEntityTabsExtra.d.ts.map