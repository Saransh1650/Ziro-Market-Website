'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useAuth } from './AuthProvider';
import { useResource } from '@/hooks/useResource';
import { getHoldings, type Holding } from '@/lib/api/portfolio';
import DataTable, { type Column } from './DataTable';
import { Delta, Money } from './Delta';
import { num, compact } from '@/lib/format/number';
import SignedOut from './SignedOut';
import { StockCell } from './StockCell';

/**
 * Holdings, totals and allocation.
 *
 * The summary band answers "how am I doing" before any row is read; the
 * table answers "because of what".
 */
export default function PortfolioView() {
  const { user, loading: authLoading } = useAuth();
  const userId = user?.id ?? null;

  const { data, loading, error, refetch } = useResource<Holding[]>(
    (signal) =>
      userId
        ? getHoldings({ userId, signal })
        : Promise.resolve({ ok: true as const, data: [] as Holding[] }),
    { deps: [userId] },
  );

  const holdings = useMemo(() => data ?? [], [data]);

  const totals = useMemo(() => {
    let invested = 0;
    let current = 0;
    for (const h of holdings) {
      const inv = h.invested_amount ?? h.quantity * h.avg_price;
      const cur = h.current_value ?? h.quantity * (h.current_price ?? h.avg_price);
      invested += inv;
      current += cur;
    }
    const pnl = current - invested;
    return { invested, current, pnl, pnlPct: invested > 0 ? (pnl / invested) * 100 : 0 };
  }, [holdings]);

  const bySector = useMemo(() => {
    const map = new Map<string, number>();
    for (const h of holdings) {
      const value = h.current_value ?? h.quantity * (h.current_price ?? h.avg_price);
      const key = h.sector?.trim() && h.sector !== 'N/A' ? h.sector : 'Unclassified';
      map.set(key, (map.get(key) ?? 0) + value);
    }
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [holdings]);

  if (authLoading) return <div style={{ height: 300 }} aria-hidden="true" />;
  if (!user) {
    return (
      <SignedOut
        title="Sign in to see your portfolio"
        detail="Holdings you added in the app appear here, with the same totals."
        next="/app/portfolio"
      />
    );
  }

  const columns: Column<Holding>[] = [
    {
      key: 'symbol', header: 'Holding', sortable: true,
      render: (h) => <StockCell symbol={h.symbol} name={h.name} />,
    },
    { key: 'quantity', header: 'Qty', numeric: true, sortable: true, render: (h) => num(h.quantity, 0) },
    { key: 'avg_price', header: 'Avg cost', numeric: true, sortable: true, render: (h) => num(h.avg_price, 2) },
    { key: 'current_price', header: 'LTP', numeric: true, sortable: true, render: (h) => (h.current_price ? num(h.current_price, 2) : '—') },
    {
      key: 'invested', header: 'Invested', numeric: true, sortable: true,
      sortValue: (h) => h.invested_amount ?? h.quantity * h.avg_price,
      render: (h) => <Money value={h.invested_amount ?? h.quantity * h.avg_price} compact />,
    },
    {
      key: 'current', header: 'Current', numeric: true, sortable: true,
      sortValue: (h) => h.current_value ?? h.quantity * (h.current_price ?? h.avg_price),
      render: (h) => <Money value={h.current_value ?? h.quantity * (h.current_price ?? h.avg_price)} compact />,
    },
    {
      key: 'pnl', header: 'P&L', numeric: true, sortable: true,
      sortValue: (h) => pnlOf(h),
      render: (h) => <Money value={pnlOf(h)} compact />,
    },
    {
      key: 'returns_percent', header: 'Return', numeric: true, sortable: true,
      sortValue: (h) => returnOf(h),
      render: (h) => <Delta value={returnOf(h)} />,
    },
  ];

  return (
    <div className="zw-page">
      <header className="zw-head">
        <h1 className="zw-title">Portfolio</h1>
        <Link href="/app/portfolio/analysis" className="zw-sub">Risk &amp; analysis</Link>
      </header>

      <dl
        style={{
          display: 'flex', flexWrap: 'wrap', gap: 'var(--s-6)', margin: 0,
          borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)',
          padding: 'var(--s-3) 0', marginBottom: 'var(--s-4)',
        }}
      >
        <Stat label="Invested" value={<Money value={totals.invested} compact />} />
        <Stat label="Current" value={<Money value={totals.current} compact />} />
        <Stat label="Total P&L" value={<Money value={totals.pnl} compact />} tone={totals.pnl} />
        <Stat label="Return" value={<Delta value={totals.pnlPct} />} />
        <Stat label="Holdings" value={<span className="zw-num">{holdings.length}</span>} />
      </dl>

      <DataTable
        rows={holdings}
        columns={columns}
        rowKey={(h) => h.id ?? h.symbol}
        href={(h) => `/stocks/${encodeURIComponent(h.symbol)}`}
        caption="Holdings"
        loading={loading}
        error={error?.message ?? null}
        onRetry={refetch}
        empty={<p className="zw-sub" style={{ color: 'var(--ink-3)' }}>No holdings yet. Add them in the app and they appear here.</p>}
      />

      {bySector.length > 0 && (
        <section style={{ paddingTop: 'var(--s-6)' }}>
          <h2 className="zw-section" style={{ paddingBottom: 'var(--s-2)' }}>Allocation by sector</h2>
          <AllocationBar entries={bySector} total={totals.current} />
        </section>
      )}
    </div>
  );
}

const pnlOf = (h: Holding) =>
  (h.current_value ?? h.quantity * (h.current_price ?? h.avg_price)) -
  (h.invested_amount ?? h.quantity * h.avg_price);

function returnOf(h: Holding): number {
  if (h.returns_percent != null) return h.returns_percent;
  const invested = h.invested_amount ?? h.quantity * h.avg_price;
  return invested > 0 ? (pnlOf(h) / invested) * 100 : 0;
}

function Stat({ label, value, tone }: { label: string; value: React.ReactNode; tone?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <dt className="zw-colhead">{label}</dt>
      <dd
        className="zw-num-lg"
        style={{ margin: 0, color: tone == null ? undefined : tone >= 0 ? 'var(--up)' : 'var(--down)' }}
      >
        {value}
      </dd>
    </div>
  );
}

/**
 * Stacked proportional bar. Categorical colours, never the P&L pair —
 * these segments are identities, not directions, and green/red here
 * would read as profit and loss.
 */
function AllocationBar({ entries, total }: { entries: [string, number][]; total: number }) {
  const sum = total || entries.reduce((s, [, v]) => s + v, 0) || 1;
  const shades = ['#3d4b5c', '#5b7f96', '#7fa8bd', '#a8c4d4', '#8a7fa8', '#b0a3c9', '#c9a86b', '#d9c79a'];

  return (
    <>
      <div style={{ display: 'flex', height: 10, overflow: 'hidden', borderRadius: 2 }} aria-hidden="true">
        {entries.map(([name, value], i) => (
          <span key={name} style={{ width: `${(value / sum) * 100}%`, background: shades[i % shades.length] }} />
        ))}
      </div>
      <ul style={{ listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: 'var(--s-4)', padding: 'var(--s-3) 0 0', margin: 0 }}>
        {entries.map(([name, value], i) => (
          <li key={name} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span aria-hidden="true" style={{ width: 8, height: 8, background: shades[i % shades.length], borderRadius: 2 }} />
            <span className="zw-sub">{name}</span>
            <span className="zw-num" style={{ fontSize: 11, color: 'var(--ink-3)' }}>
              {((value / sum) * 100).toFixed(1)}% · {compact(value)}
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}
