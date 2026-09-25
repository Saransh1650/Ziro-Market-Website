'use client';

import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { getDiscovery } from '@/lib/api/discovery';
import { useResource } from '@/hooks/useResource';
import DataTable, { type Column } from './DataTable';
import { Delta } from './Delta';
import { StockCell } from './StockCell';
import InstrumentTabs from './InstrumentTabs';
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
 * The previous version put eight equal-weight panels in a bare
 * two-column grid. Because CSS grid syncs row heights, a 3-row panel
 * beside a 6-row one left a column of dead white space, and nothing
 * told you what to read first. It looked thrown together because,
 * structurally, it was.
 *
 * Three fixes, in order of effect:
 *   1. Every panel shows the same number of rows, so the grid stops
 *      manufacturing voids.
 *   2. Panels are real bordered surfaces on a tinted page, so the gaps
 *      read as space between objects rather than absence.
 *   3. The eight are grouped into three labelled bands with an
 *      explicit reading order: what moved, where the money went, and
 *      where the extremes are.
 */

const CAPS: Array<[CapTier, string]> = [
  ['largeCap', 'Large cap'],
  ['midCap', 'Mid cap'],
  ['smallCap', 'Small cap'],
];

/** One budget for every panel. Equal heights are what kill the voids. */
const PANEL_ROWS = 8;

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
  const shared = { loading, error: error?.message, onRetry: refetch };

  return (
    <div className="zw-page">
      <header className="zw-head">
        <h1 className="zw-title">Discover</h1>
        {updatedAt && <span className="zw-meta zw-headmeta">Updated {relativeTime(updatedAt)}</span>}
      </header>

      <InstrumentTabs current="stocks" />

      <div className="zw-subhead">
        <div className="zw-seg" role="group" aria-label="Market cap">
          {CAPS.map(([id, label]) => (
            <button key={id} type="button" aria-pressed={cap === id} onClick={() => setCap(id)}>
              {label}
            </button>
          ))}
        </div>
        <p className="zw-sub">{labelFor(cap)} stocks, ranked by change</p>
      </div>

      {/* 1 — What moved. The reason anyone opens this page. */}
      <Band title="Today's movers">
        <Panel title="Top gainers" href={`/app/discover?cap=${cap}`}>
          <MoverTable rows={movers?.gainers ?? []} {...shared} />
        </Panel>
        <Panel title="Top losers" href={`/app/discover?cap=${cap}`}>
          <MoverTable rows={movers?.losers ?? []} {...shared} />
        </Panel>
      </Band>

      {/* 2 — Where the money actually went. Volume and value, not price. */}
      <Band title="Where the money went" hint="Activity rather than price">
        <Panel title="Volume surge" hint="Against the 20-day average">
          <SurgeTable rows={data?.volumeSurge ?? []} {...shared} />
        </Panel>
        <Panel title="Most active" hint="By traded value">
          <ActiveTable rows={data?.mostActive?.mainBoard ?? []} {...shared} />
        </Panel>
        <Panel title="Bulk & block deals" hint="Reported to the exchange">
          <DealsTable rows={data?.largeDeals ?? []} {...shared} />
        </Panel>
        <Panel title="Stocks in news">
          <NewsList rows={data?.stocksInNews ?? []} loading={loading} />
        </Panel>
      </Band>

      {/* 3 — The extremes. Context, so it comes last. */}
      <Band title="At their limits" hint="Stocks touching a 52-week boundary">
        <Panel title="52-week highs">
          <ExtremeTable rows={data?.fiftyTwoWeekHighs ?? []} extreme="high" {...shared} />
        </Panel>
        <Panel title="52-week lows">
          <ExtremeTable rows={data?.fiftyTwoWeekLows ?? []} extreme="low" {...shared} />
        </Panel>
      </Band>
    </div>
  );
}

const labelFor = (cap: CapTier) => CAPS.find(([id]) => id === cap)![1];

/* ── Structure ────────────────────────────────────────────────── */

function Band({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="zw-group">
      <header className="zw-group-head">
        <h2 className="zw-section">{title}</h2>
        {hint && <p className="zw-meta">{hint}</p>}
      </header>
      <div className="zw-band">{children}</div>
    </section>
  );
}

function Panel({
  title,
  hint,
  href,
  children,
}: {
  title: string;
  hint?: string;
  href?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="zw-panel">
      <header className="zw-panel-head">
        <h3 className="zw-section">{title}</h3>
        {hint && <p className="zw-meta">{hint}</p>}
        {href && <Link href={href} className="zw-viewall">View all</Link>}
      </header>
      {children}
    </section>
  );
}

/* ── Cells ────────────────────────────────────────────────────── */

const stockHref = (r: { symbol: string }) => `/stocks/${encodeURIComponent(r.symbol)}`;

/** Monogram, symbol and company name. */
function idCell(r: { symbol: string; name?: string }) {
  return <StockCell symbol={r.symbol} name={r.name} />;
}

type TableProps<T> = { rows: T[]; loading?: boolean; error?: string; onRetry?: () => void };

function MoverTable({ rows, loading, error, onRetry }: TableProps<MoverStock>) {
  const columns: Column<MoverStock>[] = [
    { key: 'symbol', header: 'Stock', sortable: true, render: idCell },
    { key: 'price', header: 'Price', numeric: true, sortable: true, render: (r) => num(r.price, 2) },
    { key: 'changePercent', header: 'Change', numeric: true, sortable: true, emphasis: true, render: (r) => <Delta value={r.changePercent} /> },
  ];
  return (
    <DataTable
      rows={rows} columns={columns} rowKey={(r) => r.symbol} href={stockHref}
      caption="Top movers" loading={loading} error={error} onRetry={onRetry}
      initialSort={{ key: 'changePercent', dir: 'desc' }} maxRows={PANEL_ROWS}
    />
  );
}

function SurgeTable({ rows, loading, error, onRetry }: TableProps<VolumeSurgeStock>) {
  const columns: Column<VolumeSurgeStock>[] = [
    { key: 'symbol', header: 'Stock', sortable: true, render: idCell },
    {
      // The multiple is why the row is on screen, so it is emphasised
      // rather than the price.
      key: 'volumeRatio', header: 'vs 20d', numeric: true, sortable: true, emphasis: true,
      render: (r) => (r.volumeRatio ? `${num(r.volumeRatio, 1)}×` : '—'),
    },
    { key: 'changePercent', header: 'Change', numeric: true, sortable: true, render: (r) => <Delta value={r.changePercent} /> },
  ];
  return (
    <DataTable
      rows={rows} columns={columns} rowKey={(r) => r.symbol} href={stockHref}
      caption="Volume surge" loading={loading} error={error} onRetry={onRetry}
      initialSort={{ key: 'volumeRatio', dir: 'desc' }} maxRows={PANEL_ROWS}
    />
  );
}

function ActiveTable({ rows, loading, error, onRetry }: TableProps<MoverStock>) {
  const columns: Column<MoverStock>[] = [
    { key: 'symbol', header: 'Stock', sortable: true, render: idCell },
    { key: 'value', header: 'Traded value', numeric: true, sortable: true, emphasis: true, render: (r) => (r.value ? compact(r.value) : '—') },
    { key: 'changePercent', header: 'Change', numeric: true, sortable: true, render: (r) => <Delta value={r.changePercent} /> },
  ];
  return (
    <DataTable
      rows={rows} columns={columns} rowKey={(r) => r.symbol} href={stockHref}
      caption="Most active by traded value" loading={loading} error={error} onRetry={onRetry}
      initialSort={{ key: 'value', dir: 'desc' }} maxRows={PANEL_ROWS}
    />
  );
}

function ExtremeTable({ rows, loading, error, onRetry, extreme }: TableProps<WeekExtremeStock> & { extreme: 'high' | 'low' }) {
  const columns: Column<WeekExtremeStock>[] = [
    { key: 'symbol', header: 'Stock', sortable: true, render: idCell },
    { key: 'price', header: 'Price', numeric: true, sortable: true, render: (r) => num(r.price, 2) },
    {
      key: 'level', header: extreme === 'high' ? '52w high' : '52w low', numeric: true, sortable: true, emphasis: true,
      sortValue: (r) => (extreme === 'high' ? r.weekHigh52 ?? 0 : r.weekLow52 ?? 0),
      render: (r) => num(extreme === 'high' ? r.weekHigh52 : r.weekLow52, 2),
    },
  ];
  return (
    <DataTable
      rows={rows} columns={columns} rowKey={(r) => r.symbol} href={stockHref}
      caption={extreme === 'high' ? '52-week highs' : '52-week lows'}
      loading={loading} error={error} onRetry={onRetry} maxRows={PANEL_ROWS}
    />
  );
}

function DealsTable({ rows, loading, error, onRetry }: TableProps<LargeDeal>) {
  const columns: Column<LargeDeal>[] = [
    {
      key: 'symbol', header: 'Stock', sortable: true,
      render: (r) => (
        <span className="zw-idcell">
          <span className="zw-sym">{r.symbol}</span>
          <span className="name" title={r.clientName}>{r.clientName || ' '}</span>
        </span>
      ),
    },
    {
      key: 'tradeType', header: 'Side', sortable: true,
      render: (r) => (
        <span className="zw-side" data-side={/buy/i.test(r.tradeType) ? 'buy' : 'sell'}>
          {/buy/i.test(r.tradeType) ? 'Buy' : 'Sell'}
        </span>
      ),
    },
    { key: 'quantity', header: 'Quantity', numeric: true, sortable: true, emphasis: true, render: (r) => compact(r.quantity, false) },
  ];
  return (
    <DataTable
      rows={rows} columns={columns}
      rowKey={(r) => `${r.symbol}-${r.clientName}-${r.tradeType}-${r.quantity}`}
      href={stockHref} caption="Bulk and block deals"
      loading={loading} error={error} onRetry={onRetry} maxRows={PANEL_ROWS}
    />
  );
}

function NewsList({ rows, loading }: { rows: NewsStock[]; loading?: boolean }) {
  if (loading) {
    return (
      <div aria-hidden="true">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="zw-skelrow"><span className="zw-skel" /></div>
        ))}
      </div>
    );
  }

  if (!rows.length) {
    return <div className="zw-state"><p className="zw-sub">No stocks in the news right now.</p></div>;
  }

  return (
    <ul className="zw-newslist">
      {rows.slice(0, 5).map((r, i) => (
        <li key={`${r.symbol}-${i}`}>
          <div className="row">
            <span className="head">
              <Link href={stockHref(r)} className="zw-sym">{r.symbol}</Link>
              {r.changePercent != null && <Delta value={r.changePercent} />}
            </span>
            <a href={r.link ?? r.url} target="_blank" rel="noopener noreferrer" className="zw-sub headline">
              {r.headline}
            </a>
          </div>
        </li>
      ))}
    </ul>
  );
}
