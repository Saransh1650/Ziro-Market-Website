'use client';

import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { getDiscovery } from '@/lib/api/discovery';
import { useResource } from '@/hooks/useResource';
import DataTable, { type Column } from './DataTable';
import { Delta } from './Delta';
import { num, compact, relativeTime } from '@/lib/format/number';
import type {
  Discovery as DiscoveryData,
  CapTier,
  MoverStock,
  VolumeSurgeStock,
  NewsStock,
  WeekExtremeStock,
  LargeDeal,
} from '@/lib/api/types';

/**
 * Discover — what moved today and why.
 *
 * Mobile stacks these sections and makes you scroll past three to reach
 * the fourth. On a wide screen they sit two-up, so movers and volume
 * surge are readable at the same time.
 *
 * The cap filter is global rather than scoped to the movers section it
 * sits next to. That is what the extra room buys: one control that
 * changes the whole view, instead of a filter per section.
 */

const CAPS: Array<[CapTier, string]> = [
  ['largeCap', 'Large cap'],
  ['midCap', 'Mid cap'],
  ['smallCap', 'Small cap'],
];

export default function Discover() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const requested = params.get('cap') as CapTier | null;
  const cap: CapTier = CAPS.some(([id]) => id === requested) ? requested! : 'largeCap';

  const setCap = useCallback(
    (next: CapTier) => {
      const q = new URLSearchParams(params.toString());
      if (next === 'largeCap') q.delete('cap');
      else q.set('cap', next);
      const qs = q.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [params, pathname, router],
  );

  const { data, loading, error, refetch, updatedAt } = useResource<DiscoveryData>(
    (signal) => getDiscovery({ signal }),
  );

  const movers = data?.topMovers?.[cap];

  return (
    <div style={{ maxWidth: 'var(--max-w)', padding: 'var(--s-4) var(--s-3) var(--s-7)' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--s-3)', flexWrap: 'wrap', paddingBottom: 'var(--s-3)' }}>
        <h1 className="zw-title">Discover</h1>
        <div style={{ display: 'flex', gap: 'var(--s-1)' }}>
          {CAPS.map(([id, label]) => (
            <button key={id} type="button" className="zw-chip" aria-pressed={cap === id} onClick={() => setCap(id)}>
              {label}
            </button>
          ))}
        </div>
        <nav style={{ display: 'flex', gap: 'var(--s-3)', marginLeft: 'var(--s-2)' }}>
          <Link href="/app/discover/etfs" className="zw-sub">ETFs</Link>
          <Link href="/app/discover/funds" className="zw-sub">Mutual funds</Link>
        </nav>
        {updatedAt && (
          <span className="zw-sub" style={{ marginLeft: 'auto', color: 'var(--text-3)' }}>
            Updated {relativeTime(updatedAt)}
          </span>
        )}
      </div>

      <div className="zw-discover">
        <Panel title={`Top gainers · ${labelFor(cap)}`}>
          <MoverTable rows={movers?.gainers ?? []} loading={loading} error={error?.message} onRetry={refetch} />
        </Panel>

        <Panel title={`Top losers · ${labelFor(cap)}`}>
          <MoverTable rows={movers?.losers ?? []} loading={loading} error={error?.message} onRetry={refetch} />
        </Panel>

        <Panel title="Volume surge" hint="Today's volume against the 20-day average">
          <SurgeTable rows={data?.volumeSurge ?? []} loading={loading} error={error?.message} onRetry={refetch} />
        </Panel>

        <Panel title="Most active by value">
          <ActiveTable rows={data?.mostActive?.mainBoard ?? []} loading={loading} error={error?.message} onRetry={refetch} />
        </Panel>

        <Panel title="Stocks in news">
          <NewsList rows={data?.stocksInNews ?? []} loading={loading} />
        </Panel>

        <Panel title="52-week highs">
          <ExtremeTable rows={data?.fiftyTwoWeekHighs ?? []} loading={loading} error={error?.message} onRetry={refetch} extreme="high" />
        </Panel>

        <Panel title="52-week lows">
          <ExtremeTable rows={data?.fiftyTwoWeekLows ?? []} loading={loading} error={error?.message} onRetry={refetch} extreme="low" />
        </Panel>

        <Panel title="Bulk & block deals">
          <DealsTable rows={data?.largeDeals ?? []} loading={loading} error={error?.message} onRetry={refetch} />
        </Panel>
      </div>

      <style>{`
        .zw-discover {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: var(--s-6) var(--s-6);
          align-items: start;
        }
        @media (max-width: 1279px) {
          .zw-discover { grid-template-columns: 1fr; gap: var(--s-5); }
        }
      `}</style>
    </div>
  );
}

const labelFor = (cap: CapTier) => CAPS.find(([id]) => id === cap)![1];

function Panel({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section style={{ minWidth: 0 }}>
      <header style={{ paddingBottom: 'var(--s-2)' }}>
        <h2 className="zw-section">{title}</h2>
        {hint && <p className="zw-sub" style={{ color: 'var(--text-3)' }}>{hint}</p>}
      </header>
      {children}
    </section>
  );
}

/* ── Tables ───────────────────────────────────────────────────── */

const stockHref = (r: { symbol: string }) => `/stocks/${encodeURIComponent(r.symbol)}`;

function symbolCell(r: { symbol: string; name?: string }) {
  return (
    <span style={{ display: 'block', minWidth: 0 }}>
      <span className="zw-sym">{r.symbol}</span>
      {r.name && r.name !== r.symbol && (
        <span className="zw-sub" style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 220 }}>
          {r.name}
        </span>
      )}
    </span>
  );
}

type TableProps<T> = { rows: T[]; loading?: boolean; error?: string; onRetry?: () => void };

function MoverTable({ rows, loading, error, onRetry }: TableProps<MoverStock>) {
  const columns: Column<MoverStock>[] = [
    { key: 'symbol', header: 'Stock', sortable: true, render: symbolCell },
    { key: 'price', header: 'Price', numeric: true, sortable: true, render: (r) => num(r.price, 2) },
    { key: 'changePercent', header: 'Change', numeric: true, sortable: true, render: (r) => <Delta value={r.changePercent} /> },
    { key: 'volume', header: 'Volume', numeric: true, sortable: true, render: (r) => (r.volume ? compact(r.volume, false) : '—') },
  ];
  return (
    <DataTable
      rows={rows} columns={columns} rowKey={(r) => r.symbol} href={stockHref}
      caption="Top movers" loading={loading} error={error} onRetry={onRetry}
      initialSort={{ key: 'changePercent', dir: 'desc' }}
    />
  );
}

function SurgeTable({ rows, loading, error, onRetry }: TableProps<VolumeSurgeStock>) {
  const columns: Column<VolumeSurgeStock>[] = [
    { key: 'symbol', header: 'Stock', sortable: true, render: symbolCell },
    // The multiple is why the row is here, so it leads rather than the price.
    {
      key: 'volumeRatio', header: 'vs 20d avg', numeric: true, sortable: true,
      render: (r) => (r.volumeRatio ? <span style={{ fontWeight: 600 }}>{num(r.volumeRatio, 1)}×</span> : '—'),
    },
    { key: 'price', header: 'Price', numeric: true, sortable: true, render: (r) => num(r.price, 2) },
    { key: 'changePercent', header: 'Change', numeric: true, sortable: true, render: (r) => <Delta value={r.changePercent} /> },
  ];
  return (
    <DataTable
      rows={rows} columns={columns} rowKey={(r) => r.symbol} href={stockHref}
      caption="Volume surge" loading={loading} error={error} onRetry={onRetry}
      initialSort={{ key: 'volumeRatio', dir: 'desc' }}
    />
  );
}

function ActiveTable({ rows, loading, error, onRetry }: TableProps<MoverStock>) {
  const columns: Column<MoverStock>[] = [
    { key: 'symbol', header: 'Stock', sortable: true, render: symbolCell },
    { key: 'value', header: 'Traded value', numeric: true, sortable: true, render: (r) => (r.value ? compact(r.value) : '—') },
    { key: 'price', header: 'Price', numeric: true, sortable: true, render: (r) => num(r.price, 2) },
    { key: 'changePercent', header: 'Change', numeric: true, sortable: true, render: (r) => <Delta value={r.changePercent} /> },
  ];
  return (
    <DataTable
      rows={rows} columns={columns} rowKey={(r) => r.symbol} href={stockHref}
      caption="Most active by traded value" loading={loading} error={error} onRetry={onRetry}
      initialSort={{ key: 'value', dir: 'desc' }} maxRows={20}
    />
  );
}

function ExtremeTable({ rows, loading, error, onRetry, extreme }: TableProps<WeekExtremeStock> & { extreme: 'high' | 'low' }) {
  const columns: Column<WeekExtremeStock>[] = [
    { key: 'symbol', header: 'Stock', sortable: true, render: symbolCell },
    { key: 'price', header: 'Price', numeric: true, sortable: true, render: (r) => num(r.price, 2) },
    {
      key: 'level', header: extreme === 'high' ? '52w high' : '52w low', numeric: true, sortable: true,
      sortValue: (r) => (extreme === 'high' ? r.weekHigh52 ?? 0 : r.weekLow52 ?? 0),
      render: (r) => num(extreme === 'high' ? r.weekHigh52 : r.weekLow52, 2),
    },
    { key: 'changePercent', header: 'Change', numeric: true, sortable: true, render: (r) => <Delta value={r.changePercent} /> },
  ];
  return (
    <DataTable
      rows={rows} columns={columns} rowKey={(r) => r.symbol} href={stockHref}
      caption={extreme === 'high' ? '52-week highs' : '52-week lows'}
      loading={loading} error={error} onRetry={onRetry} maxRows={20}
    />
  );
}

function DealsTable({ rows, loading, error, onRetry }: TableProps<LargeDeal>) {
  const columns: Column<LargeDeal>[] = [
    { key: 'symbol', header: 'Stock', sortable: true, render: symbolCell },
    {
      key: 'tradeType', header: 'Side', sortable: true,
      render: (r) => (
        <span style={{ color: /buy/i.test(r.tradeType) ? 'var(--positive)' : 'var(--negative)', fontWeight: 600 }}>
          {/buy/i.test(r.tradeType) ? 'Buy' : 'Sell'}
        </span>
      ),
    },
    {
      key: 'clientName', header: 'Party', sortable: true,
      render: (r) => (
        <span className="zw-sub" style={{ display: 'block', maxWidth: 230, overflow: 'hidden', textOverflow: 'ellipsis' }} title={r.clientName}>
          {r.clientName}
        </span>
      ),
    },
    { key: 'quantity', header: 'Quantity', numeric: true, sortable: true, render: (r) => compact(r.quantity, false) },
  ];
  return (
    <DataTable
      rows={rows} columns={columns} rowKey={(r) => `${r.symbol}-${r.clientName}-${r.tradeType}-${r.quantity}`}
      href={stockHref} caption="Bulk and block deals" loading={loading} error={error} onRetry={onRetry} maxRows={15}
    />
  );
}

function NewsList({ rows, loading }: { rows: NewsStock[]; loading?: boolean }) {
  if (loading) {
    return (
      <div aria-hidden="true">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} style={{ height: 44, borderBottom: '1px solid var(--border-1)', display: 'flex', alignItems: 'center' }}>
            <span style={{ width: `${70 - i * 5}%`, height: 9, background: 'var(--bg-2)', borderRadius: 2 }} />
          </div>
        ))}
      </div>
    );
  }

  if (!rows.length) return <p className="zw-sub" style={{ color: 'var(--text-3)', padding: 'var(--s-3) 0' }}>No stocks in the news right now.</p>;

  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
      {rows.slice(0, 10).map((r, i) => (
        <li key={`${r.symbol}-${i}`} style={{ borderBottom: '1px solid var(--border-1)', padding: '8px 0' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--s-2)' }}>
            <Link href={stockHref(r)} className="zw-sym">{r.symbol}</Link>
            {r.changePercent != null && <Delta value={r.changePercent} />}
          </div>
          <a
            href={r.link ?? r.url}
            target={r.link || r.url ? '_blank' : undefined}
            rel="noopener noreferrer"
            style={{ display: 'block', fontSize: 13, lineHeight: 1.45, maxWidth: '68ch', color: 'var(--text-2)', marginTop: 2 }}
          >
            {r.headline}
          </a>
        </li>
      ))}
    </ul>
  );
}
