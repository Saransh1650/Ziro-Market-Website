'use client';

import { getSnapshot, getCommodities } from '@/lib/api/market';
import { useResource } from '@/hooks/useResource';
import Heatmap from './Heatmap';
import SectorTable from './SectorTable';
import SummaryStrip from './SummaryStrip';
import { Delta, Money } from './Delta';
import { compact } from '@/lib/format/number';
import type { MarketSnapshot, CommodityMap } from '@/lib/api/types';

/**
 * Market Map.
 *
 * Nothing on this surface scrolls at desktop width. That rule comes from
 * the mobile app and it is the right one: a market map answers "what is
 * happening" at a glance, and a glance does not include scrolling. Web
 * has more room, so the rule survives with the pieces laid out rather
 * than stacked.
 */
export default function MarketMap() {
  const snapshot = useResource<MarketSnapshot>((signal) => getSnapshot({ signal }));
  const commodities = useResource<CommodityMap>((signal) => getCommodities({ signal }));

  return (
    <div className="zw-page zw-page-wide">
      <header className="zw-head">
        <div>
          <h1 className="zw-title">Market map</h1>
          <p className="zw-sub">Every large NSE stock at a glance. Size is market cap, colour is today&apos;s move.</p>
        </div>
      </header>

      <SummaryStrip snapshot={snapshot.data} />

      <Heatmap />

      <SectorTable />

      <div className="zw-band" style={{ marginTop: 'var(--s-4)', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)' }}>
        <section className="zw-panel">
          <div className="zw-panel-head"><h2 className="zw-section">Commodities</h2></div>
          <CommoditiesRibbon data={commodities.data} loading={commodities.loading} />
        </section>
        <section className="zw-panel">
          <div className="zw-panel-head"><h2 className="zw-section">Institutional flows</h2></div>
          <FlowsPanel snapshot={snapshot.data} loading={snapshot.loading} />
        </section>
      </div>
    </div>
  );
}

/* ── Commodities ──────────────────────────────────────────────── */

function CommoditiesRibbon({ data, loading }: { data: CommodityMap | null; loading: boolean }) {
  if (loading) return <div className="zw-state"><span className="zw-skel" style={{ width: '60%' }} /></div>;

  const items = Object.entries(data ?? {}).filter(([, c]) => c && c.price > 0);
  if (items.length === 0) {
    return <p className="zw-sub zw-panel-body">Commodity prices unavailable</p>;
  }

  return (
    <div className="zw-commodities">
      {items.map(([key, c]) => (
        <a key={key} href={`/app/commodities/${encodeURIComponent(key)}`} className="zw-commodity">
          <span className="zw-colhead">{c.name}</span>
          <Money value={c.price} decimals={c.price > 1000 ? 0 : 2} />
          <Delta value={c.changePercent} />
        </a>
      ))}
    </div>
  );
}

/* ── FII / DII ────────────────────────────────────────────────── */

function FlowsPanel({ snapshot, loading }: { snapshot: MarketSnapshot | null; loading: boolean }) {
  if (loading) return <div className="zw-state"><span className="zw-skel" style={{ width: '60%' }} /></div>;

  const f = snapshot?.fiiDii;
  if (!f) return <p className="zw-sub zw-panel-body">Institutional flows unavailable</p>;

  // The backend zeroes every field until NSE publishes, which happens
  // after the close. Showing those zeros would assert a flat session
  // that never happened.
  if (f.isAvailable === false) {
    return (
      <p className="zw-sub zw-panel-body">
        Not published yet. NSE releases FII and DII figures after the close.
      </p>
    );
  }

  return (
    <div className="zw-panel-body" style={{ display: 'grid', gap: 'var(--s-2)' }}>
      <FlowRow label="FII" net={f.fiiBuy - f.fiiSell} />
      <FlowRow label="DII" net={f.diiBuy - f.diiSell} />
      {f.date && <p className="zw-meta">Session of {sessionDate(f.date)}</p>}
    </div>
  );
}

/** The backend sends a full ISO timestamp; only the date is meaningful. */
function sessionDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', timeZone: 'Asia/Kolkata' }).format(d);
}

function FlowRow({ label, net }: { label: string; net: number }) {
  return (
    <div className="zw-flow">
      <span className="zw-sym">{label}</span>
      <span className="zw-num" style={{ color: net >= 0 ? 'var(--up)' : 'var(--down)', fontWeight: 600 }}>
        {net >= 0 ? '+' : '−'}{compact(Math.abs(net) * 1e7, true)}
      </span>
      <span className="zw-sub">{net >= 0 ? 'net buy' : 'net sell'}</span>
    </div>
  );
}
