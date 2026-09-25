'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from './AuthProvider';
import SignedOut from './SignedOut';
import LineChart from './LineChart';
import DataTable, { type Column } from './DataTable';
import { StockCell } from './StockCell';
import { Delta } from './Delta';
import { useResource } from '@/hooks/useResource';
import {
  getWatchlists,
  getWatchlistComparison,
  type ComparePeriod,
  type WatchlistRow,
  type WatchlistSummary,
} from '@/lib/api/watchlist';
import { num } from '@/lib/format/number';

const PERIODS: { id: ComparePeriod; label: string }[] = [
  { id: '1W', label: '1W' },
  { id: '1M', label: '1M' },
  { id: '1Y', label: '1Y' },
];

/**
 * Every stock in a list rebased to 100 at the start of the period, with
 * Nifty 50 alongside. A ₹3,000 stock and an ₹80 one cannot share an
 * absolute axis; rebased, the lines answer "which of these actually beat
 * the market".
 */
export default function CompareView() {
  const { session, loading: authLoading } = useAuth();
  const token = session?.access_token ?? null;

  const [period, setPeriod] = useState<ComparePeriod>('1M');
  const [picked, setPicked] = useState<string | null>(null);

  const lists = useResource<WatchlistSummary[]>(
    (signal) =>
      token
        ? getWatchlists({ token, signal })
        : Promise.resolve({ ok: true as const, data: [] as WatchlistSummary[] }),
    { deps: [token], live: false },
  );
  const activeId = picked ?? lists.data?.[0]?.id ?? null;

  const cmp = useResource(
    (signal) =>
      token && activeId
        ? getWatchlistComparison(activeId, period, { token, signal })
        : Promise.resolve({ ok: true as const, data: null }),
    { deps: [token, activeId, period], live: false },
  );

  if (authLoading) return <div style={{ height: 300 }} aria-hidden="true" />;
  if (!session) {
    return <SignedOut title="Sign in to compare your watchlist" detail="Your lists are the same here as in the app." next="/app/watchlist/compare" />;
  }

  const data = cmp.data;
  const fmtDate = (t: number) =>
    new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', timeZone: 'Asia/Kolkata' }).format(new Date(t));

  const columns: Column<WatchlistRow>[] = [
    { key: 'symbol', header: 'Stock', sortable: true, render: (r) => <StockCell symbol={r.symbol} name={r.name} /> },
    { key: 'price', header: 'Price', numeric: true, sortable: true, render: (r) => num(r.price, 2) },
    { key: 'return1w', header: '1W', numeric: true, sortable: true, render: (r) => <Delta value={r.return1w} /> },
    { key: 'return1m', header: '1M', numeric: true, sortable: true, emphasis: true, render: (r) => <Delta value={r.return1m} /> },
    { key: 'return3m', header: '3M', numeric: true, sortable: true, render: (r) => <Delta value={r.return3m} /> },
    { key: 'rs', header: 'RS', numeric: true, sortable: true, render: (r) => (r.rs != null ? num(r.rs, 0) : '—') },
  ];

  return (
    <div className="zw-page">
      <header className="zw-head">
        <div>
          <h1 className="zw-title">Compare</h1>
          <p className="zw-sub">Relative performance, rebased to 100 at the start of the period.</p>
        </div>
        <Link href="/app/watchlist" className="zw-link zw-headmeta">← Back to watchlists</Link>
      </header>

      <div className="zw-subhead">
        {lists.data && lists.data.length > 1 && (
          <select className="zw-select" value={activeId ?? ''} onChange={(e) => setPicked(e.target.value)} aria-label="Watchlist">
            {lists.data.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
          </select>
        )}
        <div className="zw-seg" role="group" aria-label="Period">
          {PERIODS.map((p) => (
            <button key={p.id} type="button" aria-pressed={period === p.id} onClick={() => setPeriod(p.id)}>{p.label}</button>
          ))}
        </div>
      </div>

      <section className="zw-panel" style={{ padding: 'var(--s-5)' }}>
        {cmp.loading ? (
          <div className="zw-state"><span className="zw-heat-spin" aria-hidden="true" /></div>
        ) : cmp.error ? (
          <div role="alert" className="zw-state">
            <p className="zw-sub">{cmp.error.message}</p>
            <button type="button" className="zw-chip" onClick={cmp.refetch}>Try again</button>
          </div>
        ) : !data ? (
          <p className="zw-sub">Add stocks to a watchlist to compare them.</p>
        ) : (
          <LineChart
            baseline={100}
            height={360}
            series={data.chartData.series.map((s) => ({ name: s.name, values: s.data }))}
            labels={data.chartData.timestamps.map(fmtDate)}
            format={(v) => v.toFixed(1)}
          />
        )}
      </section>

      {data && (
        <section className="zw-panel" style={{ marginTop: 'var(--s-4)' }}>
          <header className="zw-panel-head">
            <h2 className="zw-section">Returns</h2>
            <p className="zw-meta">Nifty 50 is {data.benchmarkReturn1m >= 0 ? 'up' : 'down'} {Math.abs(data.benchmarkReturn1m).toFixed(2)}% over 1M</p>
          </header>
          <DataTable
            rows={data.stocks}
            columns={columns}
            rowKey={(r) => r.symbol}
            href={(r) => `/stocks/${encodeURIComponent(r.symbol)}`}
            caption="Returns by stock"
            initialSort={{ key: 'return1m', dir: 'desc' }}
          />
        </section>
      )}
    </div>
  );
}
