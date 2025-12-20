'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useUi } from '@hit/ui-kit';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

type Bucket = 'none' | 'hour' | 'day' | 'week' | 'month';
type Agg = 'sum' | 'avg' | 'min' | 'max' | 'count' | 'last';

export type MetricsViewMetadata = {
  panels?: Array<{
    title?: string;
    metricKey: string;
    bucket?: Bucket;
    agg?: Agg;
    /**
     * If set, display as a cumulative running total:
     * - range: starts at 0 at the beginning of the selected range
     * - all_time: starts at cumulative total since 2000-01-01 up to the start of range
     */
    cumulative?: 'range' | 'all_time';
    dimensions?: Record<string, string | number | boolean | null>;
  }>;
};

function getAuthHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('hit_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function toDateInput(d: Date): string {
  return d.toISOString();
}

type RangePreset = '30d' | '60d' | '90d' | '6m' | '1y' | 'all' | 'custom';

type MetricCatalogItem = {
  key: string;
  label?: string;
  unit?: string; // e.g. usd, count
};

function formatValue(value: number, unit: string | undefined): string {
  if (!Number.isFinite(value)) return '';
  const u = String(unit || '').toLowerCase();
  if (u === 'usd' || u === '$') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }
  // default numeric
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(value);
}

function formatAxisTick(value: number, unit: string | undefined): string {
  if (!Number.isFinite(value)) return '';
  const u = String(unit || '').toLowerCase();
  if (u === 'usd' || u === '$') {
    // compact on axis for readability
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  }
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2 }).format(value);
}

function isoDateOnly(d: Date): string {
  // YYYY-MM-DD
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function computeRange(preset: RangePreset, customStart?: string, customEnd?: string): { start: Date; end: Date } | null {
  const end = new Date();
  const start = new Date(end);

  if (preset === '30d') start.setDate(start.getDate() - 30);
  else if (preset === '60d') start.setDate(start.getDate() - 60);
  else if (preset === '90d') start.setDate(start.getDate() - 90);
  else if (preset === '6m') start.setDate(start.getDate() - 180);
  else if (preset === '1y') start.setDate(start.getDate() - 365);
  else if (preset === 'all') return { start: new Date('2000-01-01T00:00:00.000Z'), end };
  else {
    // custom
    if (!customStart || !customEnd) return null;
    const s = new Date(`${customStart}T00:00:00.000Z`);
    const e = new Date(`${customEnd}T23:59:59.999Z`);
    if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime()) || e <= s) return null;
    return { start: s, end: e };
  }

  return { start, end };
}

export function MetricsPanel(props: {
  entityKind: string;
  entityId: string;
  metrics: MetricsViewMetadata;
}) {
  const { Card, Select, Button, Alert } = useUi();

  const panels = Array.isArray(props.metrics?.panels) ? props.metrics.panels : [];
  if (panels.length === 0) return null;

  // Global time range selector (default 90d)
  const [preset, setPreset] = useState<RangePreset>('90d');
  const [customStart, setCustomStart] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 90);
    return isoDateOnly(d);
  });
  const [customEnd, setCustomEnd] = useState<string>(() => isoDateOnly(new Date()));
  const [customError, setCustomError] = useState<string | null>(null);

  const range = useMemo(() => computeRange(preset, customStart, customEnd), [preset, customStart, customEnd]);

  const handleApplyCustom = () => {
    const r = computeRange('custom', customStart, customEnd);
    if (!r) {
      setCustomError('Invalid custom range (end must be after start).');
      return;
    }
    setCustomError(null);
    setPreset('custom');
  };

  const [catalogByKey, setCatalogByKey] = useState<Record<string, MetricCatalogItem>>({});
  useEffect(() => {
    let cancelled = false;
    async function loadCatalog() {
      try {
        const res = await fetch('/api/metrics/catalog', { credentials: 'include', headers: { ...getAuthHeaders() } });
        if (!res.ok) return;
        const json = await res.json().catch(() => null);
        const items: any[] = Array.isArray(json?.items) ? json.items : [];
        const map: Record<string, MetricCatalogItem> = {};
        for (const it of items) {
          if (it && typeof it.key === 'string') map[it.key] = it as MetricCatalogItem;
        }
        if (!cancelled) setCatalogByKey(map);
      } catch {
        // ignore
      }
    }
    loadCatalog();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="text-lg font-semibold">Metrics</div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
            <Select
              label="Range"
              value={preset}
              onChange={(v: any) => {
                setCustomError(null);
                setPreset(v as RangePreset);
              }}
              options={[
                { value: '30d', label: '30d' },
                { value: '60d', label: '60d' },
                { value: '90d', label: '90d' },
                { value: '6m', label: '6m' },
                { value: '1y', label: '1y' },
                { value: 'all', label: 'All' },
                { value: 'custom', label: 'Custom' },
              ]}
            />

            {preset === 'custom' && (
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
                <label className="text-sm">
                  <div className="mb-1 text-muted-foreground">Start</div>
                  <input
                    className="h-10 px-3 rounded-md border border-gray-300 bg-white text-sm"
                    type="date"
                    value={customStart}
                    onChange={(e) => setCustomStart(e.target.value)}
                  />
                </label>
                <label className="text-sm">
                  <div className="mb-1 text-muted-foreground">End</div>
                  <input
                    className="h-10 px-3 rounded-md border border-gray-300 bg-white text-sm"
                    type="date"
                    value={customEnd}
                    onChange={(e) => setCustomEnd(e.target.value)}
                  />
                </label>
                <Button variant="secondary" onClick={handleApplyCustom}>
                  Apply
                </Button>
              </div>
            )}
          </div>
        </div>
        {customError && (
          <div className="mt-3">
            <Alert variant="error" title="Range error">
              {customError}
            </Alert>
          </div>
        )}
      </Card>

      {panels.map((p, idx) => (
        <MetricsPanelItem
          key={`${p.metricKey}-${idx}`}
          entityKind={props.entityKind}
          entityId={props.entityId}
          panel={p}
          range={range}
          unit={catalogByKey[p.metricKey]?.unit}
        />
      ))}
    </div>
  );
}

function MetricsPanelItem(props: {
  entityKind: string;
  entityId: string;
  panel: {
    title?: string;
    metricKey: string;
    bucket?: Bucket;
    agg?: Agg;
    cumulative?: 'range' | 'all_time';
    dimensions?: Record<string, string | number | boolean | null>;
  };
  range: { start: Date; end: Date } | null;
  unit?: string;
}) {
  const { Card, Alert } = useUi();
  const title = props.panel.title || props.panel.metricKey;
  const bucket: Bucket = props.panel.bucket || 'day';
  const agg: Agg = props.panel.agg || 'sum';
  const cumulative = props.panel.cumulative;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<any[]>([]);
  const [baseline, setBaseline] = useState<number>(0);

  const start = props.range?.start;
  const end = props.range?.end;

  // For cumulative all-time, compute baseline total before start.
  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!start || !cumulative || cumulative !== 'all_time') {
        setBaseline(0);
        return;
      }
      try {
        const baselineEnd = new Date(start.getTime() - 1);
        const res = await fetch('/api/metrics/query', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
          },
          body: JSON.stringify({
            metricKey: props.panel.metricKey,
            bucket: 'none',
            agg: 'sum',
            start: '2000-01-01T00:00:00.000Z',
            end: toDateInput(baselineEnd),
            entityKind: props.entityKind,
            entityId: props.entityId,
            dimensions: props.panel.dimensions || undefined,
          }),
        });
        if (!res.ok) return;
        const json = await res.json().catch(() => null);
        const v = Array.isArray(json?.data) && json.data[0]?.value != null ? Number(json.data[0].value) : 0;
        if (!cancelled) setBaseline(Number.isFinite(v) ? v : 0);
      } catch {
        if (!cancelled) setBaseline(0);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [props.entityKind, props.entityId, props.panel.metricKey, cumulative, start?.toISOString(), JSON.stringify(props.panel.dimensions || {})]);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      setError(null);
      try {
        if (!start || !end) {
          setRows([]);
          return;
        }
        const res = await fetch('/api/metrics/query', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
          },
          body: JSON.stringify({
            metricKey: props.panel.metricKey,
            bucket,
            agg,
            start: toDateInput(start),
            end: toDateInput(end),
            entityKind: props.entityKind,
            entityId: props.entityId,
            dimensions: props.panel.dimensions || undefined,
          }),
        });
        if (!res.ok) {
          const json = await res.json().catch(() => ({}));
          throw new Error(json?.error || `Query failed (${res.status})`);
        }
        const json = await res.json();
        const data = Array.isArray(json?.data) ? json.data : [];
        if (!cancelled) setRows(data);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Failed to load metrics');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [props.entityKind, props.entityId, props.panel.metricKey, bucket, agg, start?.toISOString(), end?.toISOString(), JSON.stringify(props.panel.dimensions || {})]);

  const chartData = useMemo(() => {
    // Expect rows like { bucket: '2025-01-01T00:00:00.000Z', value: '123.45' }
    const base = rows
      .map((r: any) => ({
        bucket: r.bucket ? String(r.bucket) : '',
        value: r.value === null || r.value === undefined ? null : Number(r.value),
      }))
      .filter((r: any) => r.bucket && Number.isFinite(r.value));
    if (!cumulative) return base;
    let running = cumulative === 'all_time' ? baseline : 0;
    return base.map((r: any) => {
      running += Number(r.value);
      return { ...r, value: running };
    });
  }, [rows, cumulative, baseline]);

  const rangeTotal = useMemo(() => {
    if (!rows || rows.length === 0) return null;
    const s = rows.reduce((acc: number, r: any) => acc + (r?.value == null ? 0 : Number(r.value)), 0);
    return Number.isFinite(s) ? s : null;
  }, [rows]);

  const latestValue = useMemo(() => {
    if (chartData.length === 0) return null;
    return chartData[chartData.length - 1].value as number;
  }, [chartData]);

  return (
    <Card>
      <div className="flex items-baseline justify-between gap-4 mb-3">
        <div className="text-lg font-semibold">{title}</div>
        <div className="text-sm text-muted-foreground">
          {latestValue === null ? '' : formatValue(latestValue, props.unit)}
        </div>
      </div>
      {cumulative && rangeTotal !== null && (
        <div className="text-xs text-muted-foreground mb-2">
          {cumulative === 'range'
            ? `Range total: ${formatValue(rangeTotal, props.unit)}`
            : `Range total: ${formatValue(rangeTotal, props.unit)} · All-time: ${formatValue((baseline || 0) + rangeTotal, props.unit)}`}
        </div>
      )}

      {error ? (
        <Alert variant="error" title="Metrics error">
          {error}
        </Alert>
      ) : loading ? (
        <div className="text-sm text-muted-foreground">Loading…</div>
      ) : chartData.length === 0 ? (
        <div className="text-sm text-muted-foreground">No data</div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="bucket"
              tickFormatter={(v) => {
                try {
                  const d = new Date(String(v));
                  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                } catch {
                  return String(v);
                }
              }}
            />
            <YAxis tickFormatter={(v: any) => formatAxisTick(Number(v), props.unit)} />
            <Tooltip
              formatter={(v: any) => (typeof v === 'number' ? formatValue(v, props.unit) : String(v))}
              labelFormatter={(v) => {
                try {
                  return new Date(String(v)).toLocaleString();
                } catch {
                  return String(v);
                }
              }}
            />
            <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}



