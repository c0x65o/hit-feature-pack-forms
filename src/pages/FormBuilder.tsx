'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Plus, Save, UploadCloud } from 'lucide-react';
import { useUi } from '@hit/ui-kit';
import {
  FieldType,
  FormScope,
  useForms,
  useForm,
  useFormMutations,
} from '../hooks/useForms';

interface Props {
  id?: string;
  onNavigate?: (path: string) => void;
}

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function FormBuilder({ id, onNavigate }: Props) {
  const { Page, Card, Button, Input, TextArea, Select, Alert } = useUi();
  const isNew = !id || id === 'new';

  const { form, version, loading: loadingForm, error: loadError, refresh } = useForm(isNew ? undefined : id);
  const { createForm, publishForm, unpublishForm, saveForm, loading: saving, error: saveError } = useFormMutations();
  const { data: allForms } = useForms({ page: 1, pageSize: 200 });

  const navigate = (path: string) => {
    if (onNavigate) onNavigate(path);
    else if (typeof window !== 'undefined') window.location.href = path;
  };

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [scope, setScope] = useState<FormScope>('private');

  // Nav config
  const [navShow, setNavShow] = useState(true);
  const [navPlacement, setNavPlacement] = useState<'under_forms' | 'top_level'>('under_forms');
  const [navGroup, setNavGroup] = useState('main');
  const [navWeight, setNavWeight] = useState<number>(500);
  const [navLabel, setNavLabel] = useState('');
  const [navIcon, setNavIcon] = useState('');

  const [fields, setFields] = useState<any[]>([]);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (form) {
      setName(form.name);
      setSlug(form.slug);
      setDescription(form.description || '');
      setScope(form.scope);
      setNavShow(form.navShow ?? true);
      setNavPlacement((form.navPlacement as any) || 'under_forms');
      setNavGroup(form.navGroup || 'main');
      setNavWeight(typeof form.navWeight === 'number' ? form.navWeight : 500);
      setNavLabel(form.navLabel || '');
      setNavIcon(form.navIcon || '');
    }
    if (version?.fields) {
      const sorted = [...version.fields].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      setFields(sorted);
    }
  }, [form, version]);

  const addField = () => {
    const nextOrder = fields.length > 0 ? Math.max(...fields.map((f) => f.order || 0)) + 10 : 10;
    setFields((prev) => [
      ...prev,
      {
        id: `tmp_${Math.random().toString(16).slice(2)}`,
        key: `field_${prev.length + 1}`,
        label: `Field ${prev.length + 1}`,
        type: 'text' as FieldType,
        order: nextOrder,
        required: false,
        hidden: false,
        config: {},
        defaultValue: null,
      },
    ]);
  };

  const moveField = (idx: number, dir: -1 | 1) => {
    const next = [...fields];
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= next.length) return;
    const a = next[idx];
    const b = next[swapIdx];
    next[idx] = b;
    next[swapIdx] = a;
    // normalize order
    next.forEach((f, i) => (f.order = (i + 1) * 10));
    setFields(next);
  };

  const removeField = (idx: number) => {
    const next = [...fields];
    next.splice(idx, 1);
    next.forEach((f, i) => (f.order = (i + 1) * 10));
    setFields(next);
  };

  const handleSave = async () => {
    setLocalError(null);
    if (!name.trim()) {
      setLocalError('Name is required');
      return;
    }

    if (isNew) {
      try {
        const created = await createForm({
          name: name.trim(),
          slug: slug.trim() || slugify(name),
          description: description.trim() || undefined,
          scope,
          navShow,
          navPlacement,
          navGroup,
          navWeight,
          navLabel: navLabel.trim() || undefined,
          navIcon: navIcon.trim() || undefined,
        });
        navigate(`/forms/${created.id}`);
        return;
      } catch (e: any) {
        setLocalError(e?.message || 'Failed to create form');
        return;
      }
    }

    if (!id) return;

    try {
      await saveForm(id, {
        name: name.trim(),
        description: description.trim() || undefined,
        scope,
        navShow,
        navPlacement,
        navGroup,
        navWeight,
        navLabel: navLabel.trim() || undefined,
        navIcon: navIcon.trim() || undefined,
        draft: { fields },
      } as any);
      await refresh();
    } catch (e: any) {
      setLocalError(e?.message || 'Failed to save form');
    }
  };

  const handlePublish = async () => {
    if (!id) return;
    if (!confirm('Publish this form? Changes will become visible to users.')) return;
    try {
      await publishForm(id);
      await refresh();
    } catch (e: any) {
      setLocalError(e?.message || 'Failed to publish');
    }
  };

  const handleUnpublish = async () => {
    if (!id) return;
    if (!confirm('Unpublish this form? It will be removed from navigation for other users.')) return;
    try {
      await unpublishForm(id);
      await refresh();
    } catch (e: any) {
      setLocalError(e?.message || 'Failed to unpublish');
    }
  };

  if (!isNew && loadingForm) {
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
        title="Form not found"
        actions={
          <Button variant="secondary" onClick={() => navigate('/forms')}>
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

  return (
    <Page
      title={isNew ? 'New Form' : `Edit Form`}
      description={isNew ? 'Create a new runtime form' : form?.isPublished ? 'Published form' : 'Draft form'}
      actions={
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => navigate('/forms')}>
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>
          {!isNew && (
            <Button variant="secondary" onClick={() => navigate(`/forms/${id}/entries`)}>
              View Entries
            </Button>
          )}
          {!isNew && (
            form?.isPublished ? (
              <Button variant="secondary" onClick={handleUnpublish} disabled={saving}>
                Unpublish
              </Button>
            ) : (
              <Button variant="secondary" onClick={handlePublish} disabled={saving}>
                <UploadCloud size={16} className="mr-2" />
                Publish
              </Button>
            )
          )}
          <Button variant="primary" onClick={() => handleSave()} disabled={saving}>
            <Save size={16} className="mr-2" />
            Save
          </Button>
        </div>
      }
    >
      {(saveError || localError) && (
        <Alert variant="error" title="Error saving">
          {localError || saveError?.message}
        </Alert>
      )}

      <Card>
        <div className="space-y-6">
          <Input label="Name" value={name} onChange={setName} placeholder="e.g. Customer Intake" required />
          <Input label="Slug" value={slug} onChange={setSlug} placeholder="e.g. customer-intake" />
          <TextArea label="Description" value={description} onChange={setDescription} rows={3} />
          <Select
            label="Scope"
            value={scope}
            onChange={(v: any) => setScope(v as FormScope)}
            options={[
              { value: 'private', label: 'Private (owner only)' },
              { value: 'project', label: 'Project (all authenticated users)' },
            ]}
          />
        </div>
      </Card>

      <Card>
        <div className="space-y-6">
          <div className="text-lg font-semibold">Navigation</div>
          <label className="text-sm flex items-center gap-2">
            <input
              type="checkbox"
              checked={navShow}
              onChange={(e) => setNavShow(e.target.checked)}
            />
            Show in navigation when published
          </label>
          <Select
            label="Placement"
            value={navPlacement}
            onChange={(v: any) => setNavPlacement(v)}
            options={[
              { value: 'under_forms', label: 'Inside Forms section' },
              { value: 'top_level', label: 'Top-level item' },
            ]}
          />
          <Select
            label="Group"
            value={navGroup}
            onChange={(v: any) => setNavGroup(String(v))}
            options={[
              { value: 'main', label: 'Main' },
              { value: 'system', label: 'System' },
            ]}
          />
          <Input
            label="Weight"
            value={String(navWeight)}
            onChange={(v: string) => setNavWeight(Number(v) || 500)}
            placeholder="Lower shows higher (default 500)"
          />
          <Input
            label="Nav label override"
            value={navLabel}
            onChange={setNavLabel}
            placeholder="Leave empty to use form name"
          />
          <Input
            label="Icon (Lucide name)"
            value={navIcon}
            onChange={setNavIcon}
            placeholder="e.g. FileText (optional)"
          />
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-lg font-semibold">Fields</div>
            <div className="text-sm text-gray-500">Order is applied to list/detail/edit screens</div>
          </div>
          <Button variant="secondary" onClick={addField}>
            <Plus size={16} className="mr-2" />
            Add Field
          </Button>
        </div>

        <div className="space-y-4">
          {fields.length === 0 && (
            <div className="text-sm text-gray-500">No fields yet. Add your first field.</div>
          )}

          {fields.map((f, idx) => (
            <div key={f.id} className="border border-gray-800 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Input label="Key" value={f.key} onChange={(v: string) => {
                  const next = [...fields];
                  next[idx] = { ...next[idx], key: v };
                  setFields(next);
                }} />
                <Input label="Label" value={f.label} onChange={(v: string) => {
                  const next = [...fields];
                  next[idx] = { ...next[idx], label: v };
                  setFields(next);
                }} />
                <Select
                  label="Type"
                  value={f.type}
                  onChange={(v: any) => {
                    const next = [...fields];
                    next[idx] = { ...next[idx], type: v };
                    setFields(next);
                  }}
                  options={[
                    { value: 'text', label: 'Text' },
                    { value: 'textarea', label: 'Textarea' },
                    { value: 'number', label: 'Number' },
                    { value: 'date', label: 'Date' },
                    { value: 'select', label: 'Select' },
                    { value: 'checkbox', label: 'Checkbox' },
                    { value: 'reference', label: 'Reference' },
                  ]}
                />
              </div>

              <div className="flex items-center gap-3">
                <label className="text-sm flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={Boolean(f.required)}
                    onChange={(e) => {
                      const next = [...fields];
                      next[idx] = { ...next[idx], required: e.target.checked };
                      setFields(next);
                    }}
                  />
                  Required
                </label>
                <label className="text-sm flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={Boolean(f.hidden)}
                    onChange={(e) => {
                      const next = [...fields];
                      next[idx] = { ...next[idx], hidden: e.target.checked };
                      setFields(next);
                    }}
                  />
                  Hidden
                </label>

                <div className="flex-1" />

                <Button variant="ghost" size="sm" onClick={() => moveField(idx, -1)}>
                  Up
                </Button>
                <Button variant="ghost" size="sm" onClick={() => moveField(idx, 1)}>
                  Down
                </Button>
                <Button variant="ghost" size="sm" onClick={() => removeField(idx)}>
                  Remove
                </Button>
              </div>

              {f.type === 'select' && (
                <TextArea
                  label="Select options (one per line: value|label)"
                  value={String(f.config?.optionsText || '')}
                  onChange={(v: string) => {
                    const next = [...fields];
                    next[idx] = { ...next[idx], config: { ...(next[idx].config || {}), optionsText: v } };
                    setFields(next);
                  }}
                  rows={3}
                />
              )}

              {f.type === 'reference' && (
                <div className="space-y-3">
                  <Select
                    label="Target form"
                    value={String(f.config?.reference?.targetFormId || '')}
                    onChange={(v: any) => {
                      const next = [...fields];
                      const prevCfg = next[idx].config || {};
                      next[idx] = {
                        ...next[idx],
                        config: {
                          ...prevCfg,
                          reference: {
                            ...(prevCfg.reference || {}),
                            targetFormId: v,
                          },
                        },
                      };
                      setFields(next);
                    }}
                    options={[
                      { value: '', label: 'Select target form…' },
                      ...(allForms?.items || [])
                        .filter((x: any) => !id || x.id !== id)
                        .map((x: any) => ({
                          value: x.id,
                          label: `${x.name} (${x.slug})`,
                        })),
                    ]}
                  />
                  <Input
                    label="Display field key"
                    value={String(f.config?.reference?.displayFieldKey || '')}
                    onChange={(v: string) => {
                      const next = [...fields];
                      const prevCfg = next[idx].config || {};
                      next[idx] = {
                        ...next[idx],
                        config: {
                          ...prevCfg,
                          reference: {
                            ...(prevCfg.reference || {}),
                            displayFieldKey: v,
                          },
                        },
                      };
                      setFields(next);
                    }}
                    placeholder="e.g. name"
                  />
                  <label className="text-sm flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={Boolean(f.config?.reference?.multi)}
                      onChange={(e) => {
                        const next = [...fields];
                        const prevCfg = next[idx].config || {};
                        next[idx] = {
                          ...next[idx],
                          config: {
                            ...prevCfg,
                            reference: {
                              ...(prevCfg.reference || {}),
                              multi: e.target.checked,
                            },
                          },
                        };
                        setFields(next);
                      }}
                    />
                    Allow multiple selections
                  </label>
                  <div className="text-xs text-gray-500">
                    Stored as <code>{'{ formId, entryId, label }'}</code> (or an array if multi).
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </Page>
  );
}

export default FormBuilder;
