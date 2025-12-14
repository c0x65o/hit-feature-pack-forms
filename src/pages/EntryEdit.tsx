'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Save, ClipboardList, FileText } from 'lucide-react';
import { useUi, type BreadcrumbItem } from '@hit/ui-kit';
import { useEntry, useEntryMutations, useForm } from '../hooks/useForms';

interface Props {
  id?: string; // formId
  entryId?: string;
  onNavigate?: (path: string) => void;
}

export function EntryEdit({ id, entryId, onNavigate }: Props) {
  const { Page, Card, Button, Input, TextArea, Select, Alert } = useUi();
  const formId = id as string;
  const isNew = !entryId || entryId === 'new';

  const { form, version } = useForm(formId);
  const { entry, loading: loadingEntry, error: loadError } = useEntry(formId, isNew ? undefined : entryId);
  const { createEntry, updateEntry, loading: saving, error: saveError } = useEntryMutations(formId);

  const navigate = (path: string) => {
    if (onNavigate) onNavigate(path);
    else if (typeof window !== 'undefined') window.location.href = path;
  };

  const fields = useMemo(() => {
    return (version?.fields || [])
      .filter((f) => !f.hidden)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [version]);

  const [data, setData] = useState<Record<string, any>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [refPicker, setRefPicker] = useState<{
    open: boolean;
    fieldKey: string | null;
    targetFormId: string | null;
    displayFieldKey: string | null;
    multi: boolean;
  }>({ open: false, fieldKey: null, targetFormId: null, displayFieldKey: null, multi: false });
  const [refSearch, setRefSearch] = useState('');
  const [refLoading, setRefLoading] = useState(false);
  const [refError, setRefError] = useState<string | null>(null);
  const [refItems, setRefItems] = useState<Array<{ id: string; data: any }>>([]);

  useEffect(() => {
    if (entry?.data) setData(entry.data as any);
  }, [entry]);

  useEffect(() => {
    const run = async () => {
      if (!refPicker.open || !refPicker.targetFormId) return;
      try {
        setRefLoading(true);
        setRefError(null);
        const qs = new URLSearchParams({
          page: '1',
          pageSize: '25',
          search: refSearch,
        });
        const res = await fetch(`/api/forms/${refPicker.targetFormId}/entries?${qs.toString()}`, {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || err.message || res.statusText);
        }
        const json = await res.json();
        setRefItems((json.items || []).map((x: any) => ({ id: x.id, data: x.data })));
      } catch (e: any) {
        setRefError(e?.message || 'Failed to load references');
        setRefItems([]);
      } finally {
        setRefLoading(false);
      }
    };
    run();
  }, [refPicker.open, refPicker.targetFormId, refSearch]);

  const validate = () => {
    const errs: Record<string, string> = {};
    for (const f of fields) {
      if (f.required) {
        const v = data[f.key];
        if (v === undefined || v === null || v === '') {
          errs[f.key] = `${f.label} is required`;
        }
      }
    }
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const parseSelectOptions = (f: any): Array<{ value: string; label: string }> => {
    const text = String(f.config?.optionsText || '').trim();
    if (!text) return [];
    return text
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [value, label] = line.split('|');
        return { value: (value || '').trim(), label: (label || value || '').trim() };
      })
      .filter((o) => o.value);
  };

  const renderField = (f: any) => {
    const v = data[f.key] ?? '';
    const err = fieldErrors[f.key];

    switch (f.type) {
      case 'text':
        return (
          <Input
            key={f.key}
            label={f.label}
            value={String(v)}
            onChange={(val: string) => setData((p) => ({ ...p, [f.key]: val }))}
            required={Boolean(f.required)}
            error={err}
          />
        );
      case 'textarea':
        return (
          <TextArea
            key={f.key}
            label={f.label}
            value={String(v)}
            onChange={(val: string) => setData((p) => ({ ...p, [f.key]: val }))}
            rows={6}
          />
        );
      case 'number':
        return (
          <Input
            key={f.key}
            label={f.label}
            value={v === '' ? '' : String(v)}
            onChange={(val: string) => setData((p) => ({ ...p, [f.key]: val === '' ? '' : Number(val) }))}
            required={Boolean(f.required)}
            error={err}
          />
        );
      case 'date':
        return (
          <Input
            key={f.key}
            label={f.label}
            value={String(v)}
            onChange={(val: string) => setData((p) => ({ ...p, [f.key]: val }))}
          />
        );
      case 'checkbox':
        return (
          <label key={f.key} className="text-sm flex items-center gap-2">
            <input
              type="checkbox"
              checked={Boolean(v)}
              onChange={(e) => setData((p) => ({ ...p, [f.key]: e.target.checked }))}
            />
            {f.label}
          </label>
        );
      case 'select':
        return (
          <Select
            key={f.key}
            label={f.label}
            value={String(v)}
            onChange={(val: any) => setData((p) => ({ ...p, [f.key]: val }))}
            options={[{ value: '', label: 'Select…' }, ...parseSelectOptions(f)]}
          />
        );
      case 'reference':
        const refCfg = f.config?.reference || {};
        const targetFormId = String(refCfg.targetFormId || '');
        const displayFieldKey = String(refCfg.displayFieldKey || '');
        const multi = Boolean(refCfg.multi);

        const current = data[f.key];
        const currentList: Array<{ formId: string; entryId: string; label?: string }> = Array.isArray(current)
          ? current
          : current && typeof current === 'object'
            ? [current]
            : [];

        const removeAt = (idx: number) => {
          const next = [...currentList];
          next.splice(idx, 1);
          setData((p) => ({ ...p, [f.key]: multi ? next : (next[0] || null) }));
        };

        return (
          <div key={f.key} className="space-y-2">
            <div className="text-sm text-gray-500">{f.label}</div>
            {!targetFormId ? (
              <Alert variant="warning" title="Reference field not configured">
                Set a target form + display field key in the form builder.
              </Alert>
            ) : (
              <>
                <div className="flex flex-wrap gap-2">
                  {currentList.length === 0 ? (
                    <div className="text-sm text-gray-500">No selection</div>
                  ) : (
                    currentList.map((r, idx) => (
                      <div key={`${r.entryId}-${idx}`} className="flex items-center gap-2 border border-gray-800 rounded px-2 py-1">
                        <a
                          className="text-sm hover:text-blue-500"
                          href={`/forms/${r.formId || targetFormId}/entries/${r.entryId}`}
                          onClick={(e) => {
                            e.preventDefault();
                            navigate(`/forms/${r.formId || targetFormId}/entries/${r.entryId}`);
                          }}
                        >
                          {r.label || r.entryId}
                        </a>
                        <button className="text-xs text-gray-500 hover:text-red-500" onClick={() => removeAt(idx)}>
                          Remove
                        </button>
                      </div>
                    ))
                  )}
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    setRefPicker({
                      open: true,
                      fieldKey: f.key,
                      targetFormId,
                      displayFieldKey,
                      multi,
                    })
                  }
                >
                  Select…
                </Button>
              </>
            )}
          </div>
        );
      default:
        return (
          <Alert key={f.key} variant="warning" title={f.label}>
            Unsupported field type: {String(f.type)}
          </Alert>
        );
    }
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    if (isNew) {
      const created = await createEntry(data);
      navigate(`/forms/${formId}/entries/${created.id}`);
      return;
    }

    if (!entryId) return;
    await updateEntry(entryId, data);
    navigate(`/forms/${formId}/entries/${entryId}`);
  };

  if (!isNew && loadingEntry) {
    return (
      <Page title="Loading...">
        <Card>
          <div className="py-10">Loading…</div>
        </Card>
      </Page>
    );
  }

  if (!isNew && loadError) {
    return (
      <Page
        title="Entry not found"
        actions={
          <Button variant="secondary" onClick={() => navigate(`/forms/${formId}/entries`)}>
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>
        }
      >
        <Alert variant="error" title="Error">
          {loadError.message}
        </Alert>
      </Page>
    );
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Forms', href: '/forms', icon: <ClipboardList size={14} /> },
    ...(form ? [{ label: form.name, href: `/forms/${formId}`, icon: <FileText size={14} /> }] : []),
    { label: 'Entries', href: `/forms/${formId}/entries` },
    ...(!isNew && entryId ? [{ label: `Entry ${entryId.slice(0, 8)}`, href: `/forms/${formId}/entries/${entryId}` }] : []),
    { label: isNew ? 'New' : 'Edit' },
  ];

  return (
    <Page
      title={form?.name ? `${form.name} — ${isNew ? 'New' : 'Edit'} Entry` : isNew ? 'New Entry' : 'Edit Entry'}
      breadcrumbs={breadcrumbs}
      onNavigate={navigate}
      actions={
        <div className="flex items-center gap-2">
          <Button variant="primary" onClick={handleSubmit} disabled={saving}>
            <Save size={16} className="mr-2" />
            {isNew ? 'Create' : 'Save'}
          </Button>
        </div>
      }
    >
      {saveError && (
        <Alert variant="error" title="Error saving">
          {saveError.message}
        </Alert>
      )}

      {/* Reference picker overlay (simple, self-contained) */}
      {refPicker.open && (
        <div
          className="fixed inset-0 z-50"
          style={{ background: 'rgba(0,0,0,0.6)' }}
          onClick={() => setRefPicker((p) => ({ ...p, open: false }))}
        >
          <div
            className="max-w-3xl mx-auto mt-20 bg-black border border-gray-800 rounded-lg p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="text-lg font-semibold">Select reference</div>
              <Button variant="ghost" size="sm" onClick={() => setRefPicker((p) => ({ ...p, open: false }))}>
                Close
              </Button>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <Input
                label="Search"
                value={refSearch}
                onChange={setRefSearch}
                placeholder="Search…"
              />
            </div>

            {refError && (
              <Alert variant="error" title="Error">
                {refError}
              </Alert>
            )}

            <div className="space-y-2">
              {refLoading ? (
                <div className="text-sm text-gray-500">Loading…</div>
              ) : refItems.length === 0 ? (
                <div className="text-sm text-gray-500">No results</div>
              ) : (
                refItems.map((item) => {
                  const label =
                    refPicker.displayFieldKey && item.data
                      ? item.data[refPicker.displayFieldKey]
                      : null;
                  const display = label ? String(label) : item.id;
                  return (
                    <button
                      key={item.id}
                      className="w-full text-left border border-gray-800 rounded px-3 py-2 hover:border-blue-600"
                      onClick={() => {
                        if (!refPicker.fieldKey || !refPicker.targetFormId) return;

                        const refObj = {
                          formId: refPicker.targetFormId,
                          entryId: item.id,
                          label: display,
                        };

                        setData((prev) => {
                          const existing = prev[refPicker.fieldKey as string];
                          if (refPicker.multi) {
                            const arr = Array.isArray(existing) ? existing : [];
                            const next = [...arr, refObj];
                            return { ...prev, [refPicker.fieldKey as string]: next };
                          }
                          return { ...prev, [refPicker.fieldKey as string]: refObj };
                        });

                        setRefPicker((p) => ({ ...p, open: false }));
                      }}
                    >
                      <div className="text-sm font-medium">{display}</div>
                      <div className="text-xs text-gray-500">{item.id}</div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      <Card>
        <div className="space-y-6">
          {fields.length === 0 ? (
            <Alert variant="warning" title="No fields">
              This form has no fields yet. Add fields in the form builder.
            </Alert>
          ) : (
            fields.map(renderField)
          )}
        </div>
      </Card>
    </Page>
  );
}

export default EntryEdit;
