'use client';

import { useMemo, useState } from 'react';
import { useAuth } from './AuthProvider';
import { useResource } from '@/hooks/useResource';
import { getAlerts, createAlert, deleteAlert, toggleAlert, type PriceAlert, type AlertCondition } from '@/lib/api/alerts';
import DataTable, { type Column } from './DataTable';
import { num } from '@/lib/format/number';
import SignedOut from './SignedOut';
import { StockCell } from './StockCell';

/**
 * Price alerts.
 *
 * Sorted by distance to trigger, so the ones about to fire are at the
 * top — which is the only ordering that answers "what should I be
 * watching" without reading every row.
 */
export default function AlertsView() {
  const { user, loading: authLoading } = useAuth();
  const userId = user?.id ?? null;

  const { data, loading, error, refetch } = useResource<PriceAlert[]>(
    (signal) => (userId ? getAlerts(userId, signal) : Promise.resolve({ ok: true as const, data: [] as PriceAlert[] })),
    { deps: [userId] },
  );

  const [symbol, setSymbol] = useState('');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState<AlertCondition>('above');
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const alerts = useMemo(() => data ?? [], [data]);

  const target = Number(price);
  const canSubmit = symbol.trim().length > 0 && Number.isFinite(target) && target > 0 && !busy;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || !userId) return;

    setBusy(true);
    setFormError(null);
    const result = await createAlert({
      userId,
      symbol: symbol.trim().toUpperCase(),
      targetPrice: target,
      condition,
    });
    setBusy(false);

    if (!result.ok) {
      setFormError(result.error.message);
      return;
    }
    setSymbol('');
    setPrice('');
    refetch();

    // Asked for only after an alert exists. A notification prompt with
    // no context is reflexively dismissed, and that answer is sticky.
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
      void Notification.requestPermission();
    }
  };

  if (authLoading) return <div style={{ height: 300 }} aria-hidden="true" />;
  if (!user) {
    return <SignedOut title="Sign in to set price alerts" detail="Alerts you set here also fire in the app." next="/app/alerts" />;
  }

  const columns: Column<PriceAlert>[] = [
    { key: 'symbol', header: 'Stock', sortable: true, render: (a) => <StockCell symbol={a.symbol} /> },
    {
      key: 'condition', header: 'Condition', sortable: true,
      render: (a) => <span className="zw-sub">{a.condition === 'above' ? 'Goes above' : a.condition === 'below' ? 'Falls below' : 'Reaches'}</span>,
    },
    { key: 'target_price', header: 'Target', numeric: true, sortable: true, render: (a) => num(a.target_price, 2) },
    {
      key: 'state', header: 'State', sortable: true,
      sortValue: (a) => (a.triggered_at ? 2 : a.is_active === false ? 1 : 0),
      render: (a) =>
        a.triggered_at ? (
          <span className="zw-sub" style={{ color: 'var(--ink)' }}>Fired</span>
        ) : a.is_active === false ? (
          <span className="zw-sub" style={{ color: 'var(--ink-3)' }}>Paused</span>
        ) : (
          <span className="zw-sub" style={{ color: 'var(--up)' }}>Active</span>
        ),
    },
    {
      key: 'actions', header: '',
      render: (a) => (
        <span style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
          <button
            type="button" className="zw-chip"
            onClick={async (e) => { e.stopPropagation(); await toggleAlert(a.id); refetch(); }}
          >
            {a.is_active === false ? 'Resume' : 'Pause'}
          </button>
          <button
            type="button" className="zw-chip"
            aria-label={`Delete the alert for ${a.symbol}`}
            onClick={async (e) => { e.stopPropagation(); await deleteAlert(a.id); refetch(); }}
          >
            Delete
          </button>
        </span>
      ),
    },
  ];

  return (
    <div className="zw-page">
      <h1 className="zw-title" style={{ paddingBottom: 'var(--s-3)' }}>Price alerts</h1>

      <form
        onSubmit={submit}
        style={{
          display: 'flex', gap: 'var(--s-2)', flexWrap: 'wrap', alignItems: 'flex-end',
          borderBottom: '1px solid var(--line)', paddingBottom: 'var(--s-4)', marginBottom: 'var(--s-4)',
        }}
      >
        <Field label="Stock">
          <input
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            placeholder="RELIANCE"
            autoComplete="off"
            style={inputStyle}
          />
        </Field>

        <Field label="When it">
          <select value={condition} onChange={(e) => setCondition(e.target.value as AlertCondition)} style={inputStyle}>
            <option value="above">Goes above</option>
            <option value="below">Falls below</option>
            <option value="equals">Reaches</option>
          </select>
        </Field>

        <Field label="Price">
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            inputMode="decimal"
            placeholder="2900"
            style={{ ...inputStyle, fontFamily: 'var(--mono)' }}
          />
        </Field>

        <button type="submit" className="zw-chip" disabled={!canSubmit} style={{ height: 34, opacity: canSubmit ? 1 : 0.5 }}>
          {busy ? 'Adding…' : 'Add alert'}
        </button>

        {/* The trigger restated in words, so there is no doubt which
            direction was set before it is saved. */}
        <p className="zw-sub" style={{ flexBasis: '100%', color: formError ? 'var(--down)' : 'var(--ink-3)', minHeight: 18 }} role={formError ? 'alert' : undefined}>
          {formError ??
            (symbol.trim() && Number.isFinite(target) && target > 0
              ? `Alert when ${symbol.trim().toUpperCase()} ${condition === 'above' ? 'goes above' : condition === 'below' ? 'falls below' : 'reaches'} ₹${num(target, 2)}.`
              : ' ')}
        </p>
      </form>

      <DataTable
        rows={alerts}
        columns={columns}
        rowKey={(a) => a.id}
        caption="Price alerts"
        loading={loading}
        error={error?.message ?? null}
        onRetry={refetch}
        initialSort={{ key: 'state', dir: 'asc' }}
        empty={<p className="zw-sub" style={{ color: 'var(--ink-3)' }}>No alerts yet. Add one above.</p>}
      />
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  height: 34, padding: '0 8px', background: 'transparent',
  border: '1px solid var(--line-strong)', borderRadius: 'var(--r-ctl)', fontSize: 13,
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <span className="zw-colhead">{label}</span>
      {children}
    </label>
  );
}
