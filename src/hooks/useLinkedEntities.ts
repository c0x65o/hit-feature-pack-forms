'use client';

import { useCallback, useEffect, useState } from 'react';

const API_BASE = '/api/forms';

function getAuthHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('hit_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function fetchFormsApi<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.error || err.message || `Request failed: ${res.status}`);
  }
  return res.json();
}

export type LinkedEntityKind = string;

export interface LinkedFormInfo {
  formId: string;
  formName: string;
  formSlug: string;
  entityFieldKey: string;
  count: number;
}

export function useLinkedForms(entity: { kind: LinkedEntityKind; id: string } | null | undefined) {
  const [items, setItems] = useState<LinkedFormInfo[]>([]);
  const [loading, setLoading] = useState(Boolean(entity?.kind && entity?.id));
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(async () => {
    if (!entity?.kind || !entity?.id) {
      setLoading(false);
      setItems([]);
      return;
    }

    try {
      setLoading(true);
      const q = new URLSearchParams({ entityKind: entity.kind, entityId: entity.id });
      const res = await fetchFormsApi<{ items: LinkedFormInfo[] }>(`/linked?${q.toString()}`);
      setItems(res.items || []);
      setError(null);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, [entity?.kind, entity?.id]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { items, loading, error, refresh };
}

export interface LinkedEntriesOptions {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface LinkedEntriesResponse {
  items: Array<{
    id: string;
    formId: string;
    createdByUserId: string;
    updatedByUserId: string | null;
    data: Record<string, unknown>;
    createdAt: string;
    updatedAt: string;
  }>;
  fields: any[];
  listConfig: any;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export function useLinkedFormEntries(
  args:
    | {
        formId: string;
        entity: { kind: LinkedEntityKind; id: string };
        entityFieldKey: string;
        options?: LinkedEntriesOptions;
      }
    | null
    | undefined
) {
  const formId = args?.formId;
  const entityKind = args?.entity?.kind;
  const entityId = args?.entity?.id;
  const entityFieldKey = args?.entityFieldKey;
  const options = args?.options || {};

  const { page = 1, pageSize = 25, search = '', sortBy = 'updatedAt', sortOrder = 'desc' } = options;

  const [data, setData] = useState<LinkedEntriesResponse | null>(null);
  const [loading, setLoading] = useState(Boolean(formId && entityKind && entityId && entityFieldKey));
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(async () => {
    if (!formId || !entityKind || !entityId || !entityFieldKey) {
      setLoading(false);
      setData(null);
      return;
    }

    try {
      setLoading(true);
      const q = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
        sortBy,
        sortOrder,
        linkedEntityKind: entityKind,
        linkedEntityId: entityId,
        linkedFieldKey: entityFieldKey,
      });
      if (search) q.set('search', search);

      const res = await fetchFormsApi<LinkedEntriesResponse>(`/${encodeURIComponent(formId)}/entries?${q.toString()}`);
      setData(res);
      setError(null);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, [formId, entityKind, entityId, entityFieldKey, page, pageSize, search, sortBy, sortOrder]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, error, refresh };
}


