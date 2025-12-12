'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { ArrowLeft, Plus, Save, UploadCloud } from 'lucide-react';
import { useUi } from '@hit/ui-kit';
import { useForms, useForm, useFormMutations, } from '../hooks/useForms';
function slugify(input) {
    return input
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}
export function FormBuilder({ id, onNavigate }) {
    const { Page, Card, Button, Input, TextArea, Select, Alert } = useUi();
    const isNew = !id || id === 'new';
    const { form, version, loading: loadingForm, error: loadError, refresh } = useForm(isNew ? undefined : id);
    const { createForm, publishForm, unpublishForm, saveForm, loading: saving, error: saveError } = useFormMutations();
    const { data: allForms } = useForms({ page: 1, pageSize: 200 });
    const navigate = (path) => {
        if (onNavigate)
            onNavigate(path);
        else if (typeof window !== 'undefined')
            window.location.href = path;
    };
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');
    const [scope, setScope] = useState('private');
    // Nav config
    const [navShow, setNavShow] = useState(true);
    const [navPlacement, setNavPlacement] = useState('under_forms');
    const [navGroup, setNavGroup] = useState('main');
    const [navWeight, setNavWeight] = useState(500);
    const [navLabel, setNavLabel] = useState('');
    const [navIcon, setNavIcon] = useState('');
    const [fields, setFields] = useState([]);
    const [localError, setLocalError] = useState(null);
    useEffect(() => {
        if (form) {
            setName(form.name);
            setSlug(form.slug);
            setDescription(form.description || '');
            setScope(form.scope);
            setNavShow(form.navShow ?? true);
            setNavPlacement(form.navPlacement || 'under_forms');
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
                type: 'text',
                order: nextOrder,
                required: false,
                hidden: false,
                config: {},
                defaultValue: null,
            },
        ]);
    };
    const moveField = (idx, dir) => {
        const next = [...fields];
        const swapIdx = idx + dir;
        if (swapIdx < 0 || swapIdx >= next.length)
            return;
        const a = next[idx];
        const b = next[swapIdx];
        next[idx] = b;
        next[swapIdx] = a;
        // normalize order
        next.forEach((f, i) => (f.order = (i + 1) * 10));
        setFields(next);
    };
    const removeField = (idx) => {
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
            }
            catch (e) {
                setLocalError(e?.message || 'Failed to create form');
                return;
            }
        }
        if (!id)
            return;
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
            });
            await refresh();
        }
        catch (e) {
            setLocalError(e?.message || 'Failed to save form');
        }
    };
    const handlePublish = async () => {
        if (!id)
            return;
        if (!confirm('Publish this form? Changes will become visible to users.'))
            return;
        try {
            await publishForm(id);
            await refresh();
        }
        catch (e) {
            setLocalError(e?.message || 'Failed to publish');
        }
    };
    const handleUnpublish = async () => {
        if (!id)
            return;
        if (!confirm('Unpublish this form? It will be removed from navigation for other users.'))
            return;
        try {
            await unpublishForm(id);
            await refresh();
        }
        catch (e) {
            setLocalError(e?.message || 'Failed to unpublish');
        }
    };
    if (!isNew && loadingForm) {
        return (_jsx(Page, { title: "Loading...", children: _jsx(Card, { children: _jsx("div", { className: "py-10", children: "Loading\u2026" }) }) }));
    }
    if (!isNew && loadError) {
        return (_jsx(Page, { title: "Form not found", actions: _jsxs(Button, { variant: "secondary", onClick: () => navigate('/forms'), children: [_jsx(ArrowLeft, { size: 16, className: "mr-2" }), "Back"] }), children: _jsx(Alert, { variant: "error", title: "Error", children: loadError.message }) }));
    }
    return (_jsxs(Page, { title: isNew ? 'New Form' : `Edit Form`, description: isNew ? 'Create a new runtime form' : form?.isPublished ? 'Published form' : 'Draft form', actions: _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs(Button, { variant: "secondary", onClick: () => navigate('/forms'), children: [_jsx(ArrowLeft, { size: 16, className: "mr-2" }), "Back"] }), !isNew && (_jsx(Button, { variant: "secondary", onClick: () => navigate(`/forms/${id}/entries`), children: "View Entries" })), !isNew && (form?.isPublished ? (_jsx(Button, { variant: "secondary", onClick: handleUnpublish, disabled: saving, children: "Unpublish" })) : (_jsxs(Button, { variant: "secondary", onClick: handlePublish, disabled: saving, children: [_jsx(UploadCloud, { size: 16, className: "mr-2" }), "Publish"] }))), _jsxs(Button, { variant: "primary", onClick: () => handleSave(), disabled: saving, children: [_jsx(Save, { size: 16, className: "mr-2" }), "Save"] })] }), children: [(saveError || localError) && (_jsx(Alert, { variant: "error", title: "Error saving", children: localError || saveError?.message })), _jsx(Card, { children: _jsxs("div", { className: "space-y-6", children: [_jsx(Input, { label: "Name", value: name, onChange: setName, placeholder: "e.g. Customer Intake", required: true }), _jsx(Input, { label: "Slug", value: slug, onChange: setSlug, placeholder: "e.g. customer-intake" }), _jsx(TextArea, { label: "Description", value: description, onChange: setDescription, rows: 3 }), _jsx(Select, { label: "Scope", value: scope, onChange: (v) => setScope(v), options: [
                                { value: 'private', label: 'Private (owner only)' },
                                { value: 'project', label: 'Project (all authenticated users)' },
                            ] })] }) }), _jsx(Card, { children: _jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "text-lg font-semibold", children: "Navigation" }), _jsxs("label", { className: "text-sm flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: navShow, onChange: (e) => setNavShow(e.target.checked) }), "Show in navigation when published"] }), _jsx(Select, { label: "Placement", value: navPlacement, onChange: (v) => setNavPlacement(v), options: [
                                { value: 'under_forms', label: 'Inside Forms section' },
                                { value: 'top_level', label: 'Top-level item' },
                            ] }), _jsx(Select, { label: "Group", value: navGroup, onChange: (v) => setNavGroup(String(v)), options: [
                                { value: 'main', label: 'Main' },
                                { value: 'system', label: 'System' },
                            ] }), _jsx(Input, { label: "Weight", value: String(navWeight), onChange: (v) => setNavWeight(Number(v) || 500), placeholder: "Lower shows higher (default 500)" }), _jsx(Input, { label: "Nav label override", value: navLabel, onChange: setNavLabel, placeholder: "Leave empty to use form name" }), _jsx(Input, { label: "Icon (Lucide name)", value: navIcon, onChange: setNavIcon, placeholder: "e.g. FileText (optional)" })] }) }), _jsxs(Card, { children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("div", { children: [_jsx("div", { className: "text-lg font-semibold", children: "Fields" }), _jsx("div", { className: "text-sm text-gray-500", children: "Order is applied to list/detail/edit screens" })] }), _jsxs(Button, { variant: "secondary", onClick: addField, children: [_jsx(Plus, { size: 16, className: "mr-2" }), "Add Field"] })] }), _jsxs("div", { className: "space-y-4", children: [fields.length === 0 && (_jsx("div", { className: "text-sm text-gray-500", children: "No fields yet. Add your first field." })), fields.map((f, idx) => (_jsxs("div", { className: "border border-gray-800 rounded-lg p-4 space-y-3", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Input, { label: "Key", value: f.key, onChange: (v) => {
                                                    const next = [...fields];
                                                    next[idx] = { ...next[idx], key: v };
                                                    setFields(next);
                                                } }), _jsx(Input, { label: "Label", value: f.label, onChange: (v) => {
                                                    const next = [...fields];
                                                    next[idx] = { ...next[idx], label: v };
                                                    setFields(next);
                                                } }), _jsx(Select, { label: "Type", value: f.type, onChange: (v) => {
                                                    const next = [...fields];
                                                    next[idx] = { ...next[idx], type: v };
                                                    setFields(next);
                                                }, options: [
                                                    { value: 'text', label: 'Text' },
                                                    { value: 'textarea', label: 'Textarea' },
                                                    { value: 'number', label: 'Number' },
                                                    { value: 'date', label: 'Date' },
                                                    { value: 'select', label: 'Select' },
                                                    { value: 'checkbox', label: 'Checkbox' },
                                                    { value: 'reference', label: 'Reference' },
                                                ] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("label", { className: "text-sm flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: Boolean(f.required), onChange: (e) => {
                                                            const next = [...fields];
                                                            next[idx] = { ...next[idx], required: e.target.checked };
                                                            setFields(next);
                                                        } }), "Required"] }), _jsxs("label", { className: "text-sm flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: Boolean(f.hidden), onChange: (e) => {
                                                            const next = [...fields];
                                                            next[idx] = { ...next[idx], hidden: e.target.checked };
                                                            setFields(next);
                                                        } }), "Hidden"] }), _jsx("div", { className: "flex-1" }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => moveField(idx, -1), children: "Up" }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => moveField(idx, 1), children: "Down" }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => removeField(idx), children: "Remove" })] }), f.type === 'select' && (_jsx(TextArea, { label: "Select options (one per line: value|label)", value: String(f.config?.optionsText || ''), onChange: (v) => {
                                            const next = [...fields];
                                            next[idx] = { ...next[idx], config: { ...(next[idx].config || {}), optionsText: v } };
                                            setFields(next);
                                        }, rows: 3 })), f.type === 'reference' && (_jsxs("div", { className: "space-y-3", children: [_jsx(Select, { label: "Target form", value: String(f.config?.reference?.targetFormId || ''), onChange: (v) => {
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
                                                }, options: [
                                                    { value: '', label: 'Select target form…' },
                                                    ...(allForms?.items || [])
                                                        .filter((x) => !id || x.id !== id)
                                                        .map((x) => ({
                                                        value: x.id,
                                                        label: `${x.name} (${x.slug})`,
                                                    })),
                                                ] }), _jsx(Input, { label: "Display field key", value: String(f.config?.reference?.displayFieldKey || ''), onChange: (v) => {
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
                                                }, placeholder: "e.g. name" }), _jsxs("label", { className: "text-sm flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: Boolean(f.config?.reference?.multi), onChange: (e) => {
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
                                                        } }), "Allow multiple selections"] }), _jsxs("div", { className: "text-xs text-gray-500", children: ["Stored as ", _jsx("code", { children: '{ formId, entryId, label }' }), " (or an array if multi)."] })] }))] }, f.id)))] })] })] }));
}
export default FormBuilder;
//# sourceMappingURL=FormBuilder.js.map