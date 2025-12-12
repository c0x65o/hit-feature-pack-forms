'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { useUi } from '@hit/ui-kit';
import { useEntry, useEntryMutations, useForm } from '../hooks/useForms';
export function EntryEdit({ id, entryId, onNavigate }) {
    const { Page, Card, Button, Input, TextArea, Select, Alert } = useUi();
    const formId = id;
    const isNew = !entryId || entryId === 'new';
    const { form, version } = useForm(formId);
    const { entry, loading: loadingEntry, error: loadError } = useEntry(formId, isNew ? undefined : entryId);
    const { createEntry, updateEntry, loading: saving, error: saveError } = useEntryMutations(formId);
    const navigate = (path) => {
        if (onNavigate)
            onNavigate(path);
        else if (typeof window !== 'undefined')
            window.location.href = path;
    };
    const fields = useMemo(() => {
        return (version?.fields || [])
            .filter((f) => !f.hidden)
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    }, [version]);
    const [data, setData] = useState({});
    const [fieldErrors, setFieldErrors] = useState({});
    const [refPicker, setRefPicker] = useState({ open: false, fieldKey: null, targetFormId: null, displayFieldKey: null, multi: false });
    const [refSearch, setRefSearch] = useState('');
    const [refLoading, setRefLoading] = useState(false);
    const [refError, setRefError] = useState(null);
    const [refItems, setRefItems] = useState([]);
    useEffect(() => {
        if (entry?.data)
            setData(entry.data);
    }, [entry]);
    useEffect(() => {
        const run = async () => {
            if (!refPicker.open || !refPicker.targetFormId)
                return;
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
                setRefItems((json.items || []).map((x) => ({ id: x.id, data: x.data })));
            }
            catch (e) {
                setRefError(e?.message || 'Failed to load references');
                setRefItems([]);
            }
            finally {
                setRefLoading(false);
            }
        };
        run();
    }, [refPicker.open, refPicker.targetFormId, refSearch]);
    const validate = () => {
        const errs = {};
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
    const parseSelectOptions = (f) => {
        const text = String(f.config?.optionsText || '').trim();
        if (!text)
            return [];
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
    const renderField = (f) => {
        const v = data[f.key] ?? '';
        const err = fieldErrors[f.key];
        switch (f.type) {
            case 'text':
                return (_jsx(Input, { label: f.label, value: String(v), onChange: (val) => setData((p) => ({ ...p, [f.key]: val })), required: Boolean(f.required), error: err }, f.key));
            case 'textarea':
                return (_jsx(TextArea, { label: f.label, value: String(v), onChange: (val) => setData((p) => ({ ...p, [f.key]: val })), rows: 6 }, f.key));
            case 'number':
                return (_jsx(Input, { label: f.label, value: v === '' ? '' : String(v), onChange: (val) => setData((p) => ({ ...p, [f.key]: val === '' ? '' : Number(val) })), required: Boolean(f.required), error: err }, f.key));
            case 'date':
                return (_jsx(Input, { label: f.label, value: String(v), onChange: (val) => setData((p) => ({ ...p, [f.key]: val })) }, f.key));
            case 'checkbox':
                return (_jsxs("label", { className: "text-sm flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: Boolean(v), onChange: (e) => setData((p) => ({ ...p, [f.key]: e.target.checked })) }), f.label] }, f.key));
            case 'select':
                return (_jsx(Select, { label: f.label, value: String(v), onChange: (val) => setData((p) => ({ ...p, [f.key]: val })), options: [{ value: '', label: 'Select…' }, ...parseSelectOptions(f)] }, f.key));
            case 'reference':
                const refCfg = f.config?.reference || {};
                const targetFormId = String(refCfg.targetFormId || '');
                const displayFieldKey = String(refCfg.displayFieldKey || '');
                const multi = Boolean(refCfg.multi);
                const current = data[f.key];
                const currentList = Array.isArray(current)
                    ? current
                    : current && typeof current === 'object'
                        ? [current]
                        : [];
                const removeAt = (idx) => {
                    const next = [...currentList];
                    next.splice(idx, 1);
                    setData((p) => ({ ...p, [f.key]: multi ? next : (next[0] || null) }));
                };
                return (_jsxs("div", { className: "space-y-2", children: [_jsx("div", { className: "text-sm text-gray-500", children: f.label }), !targetFormId ? (_jsx(Alert, { variant: "warning", title: "Reference field not configured", children: "Set a target form + display field key in the form builder." })) : (_jsxs(_Fragment, { children: [_jsx("div", { className: "flex flex-wrap gap-2", children: currentList.length === 0 ? (_jsx("div", { className: "text-sm text-gray-500", children: "No selection" })) : (currentList.map((r, idx) => (_jsxs("div", { className: "flex items-center gap-2 border border-gray-800 rounded px-2 py-1", children: [_jsx("a", { className: "text-sm hover:text-blue-500", href: `/forms/${r.formId || targetFormId}/entries/${r.entryId}`, onClick: (e) => {
                                                    e.preventDefault();
                                                    navigate(`/forms/${r.formId || targetFormId}/entries/${r.entryId}`);
                                                }, children: r.label || r.entryId }), _jsx("button", { className: "text-xs text-gray-500 hover:text-red-500", onClick: () => removeAt(idx), children: "Remove" })] }, `${r.entryId}-${idx}`)))) }), _jsx(Button, { variant: "secondary", size: "sm", onClick: () => setRefPicker({
                                        open: true,
                                        fieldKey: f.key,
                                        targetFormId,
                                        displayFieldKey,
                                        multi,
                                    }), children: "Select\u2026" })] }))] }, f.key));
            default:
                return (_jsxs(Alert, { variant: "warning", title: f.label, children: ["Unsupported field type: ", String(f.type)] }, f.key));
        }
    };
    const handleSubmit = async () => {
        if (!validate())
            return;
        if (isNew) {
            const created = await createEntry(data);
            navigate(`/forms/${formId}/entries/${created.id}`);
            return;
        }
        if (!entryId)
            return;
        await updateEntry(entryId, data);
        navigate(`/forms/${formId}/entries/${entryId}`);
    };
    if (!isNew && loadingEntry) {
        return (_jsx(Page, { title: "Loading...", children: _jsx(Card, { children: _jsx("div", { className: "py-10", children: "Loading\u2026" }) }) }));
    }
    if (!isNew && loadError) {
        return (_jsx(Page, { title: "Entry not found", actions: _jsxs(Button, { variant: "secondary", onClick: () => navigate(`/forms/${formId}/entries`), children: [_jsx(ArrowLeft, { size: 16, className: "mr-2" }), "Back"] }), children: _jsx(Alert, { variant: "error", title: "Error", children: loadError.message }) }));
    }
    return (_jsxs(Page, { title: form?.name ? `${form.name} — ${isNew ? 'New' : 'Edit'} Entry` : isNew ? 'New Entry' : 'Edit Entry', actions: _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs(Button, { variant: "secondary", onClick: () => navigate(`/forms/${formId}/entries`), children: [_jsx(ArrowLeft, { size: 16, className: "mr-2" }), "Back"] }), _jsxs(Button, { variant: "primary", onClick: handleSubmit, disabled: saving, children: [_jsx(Save, { size: 16, className: "mr-2" }), isNew ? 'Create' : 'Save'] })] }), children: [saveError && (_jsx(Alert, { variant: "error", title: "Error saving", children: saveError.message })), refPicker.open && (_jsx("div", { className: "fixed inset-0 z-50", style: { background: 'rgba(0,0,0,0.6)' }, onClick: () => setRefPicker((p) => ({ ...p, open: false })), children: _jsxs("div", { className: "max-w-3xl mx-auto mt-20 bg-black border border-gray-800 rounded-lg p-4", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("div", { className: "text-lg font-semibold", children: "Select reference" }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => setRefPicker((p) => ({ ...p, open: false })), children: "Close" })] }), _jsx("div", { className: "flex items-center gap-2 mb-3", children: _jsx(Input, { label: "Search", value: refSearch, onChange: setRefSearch, placeholder: "Search\u2026" }) }), refError && (_jsx(Alert, { variant: "error", title: "Error", children: refError })), _jsx("div", { className: "space-y-2", children: refLoading ? (_jsx("div", { className: "text-sm text-gray-500", children: "Loading\u2026" })) : refItems.length === 0 ? (_jsx("div", { className: "text-sm text-gray-500", children: "No results" })) : (refItems.map((item) => {
                                const label = refPicker.displayFieldKey && item.data
                                    ? item.data[refPicker.displayFieldKey]
                                    : null;
                                const display = label ? String(label) : item.id;
                                return (_jsxs("button", { className: "w-full text-left border border-gray-800 rounded px-3 py-2 hover:border-blue-600", onClick: () => {
                                        if (!refPicker.fieldKey || !refPicker.targetFormId)
                                            return;
                                        const refObj = {
                                            formId: refPicker.targetFormId,
                                            entryId: item.id,
                                            label: display,
                                        };
                                        setData((prev) => {
                                            const existing = prev[refPicker.fieldKey];
                                            if (refPicker.multi) {
                                                const arr = Array.isArray(existing) ? existing : [];
                                                const next = [...arr, refObj];
                                                return { ...prev, [refPicker.fieldKey]: next };
                                            }
                                            return { ...prev, [refPicker.fieldKey]: refObj };
                                        });
                                        setRefPicker((p) => ({ ...p, open: false }));
                                    }, children: [_jsx("div", { className: "text-sm font-medium", children: display }), _jsx("div", { className: "text-xs text-gray-500", children: item.id })] }, item.id));
                            })) })] }) })), _jsx(Card, { children: _jsx("div", { className: "space-y-6", children: fields.length === 0 ? (_jsx(Alert, { variant: "warning", title: "No fields", children: "This form has no fields yet. Add fields in the form builder." })) : (fields.map(renderField)) }) })] }));
}
export default EntryEdit;
//# sourceMappingURL=EntryEdit.js.map