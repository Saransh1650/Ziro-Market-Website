'use client';

import { useState } from 'react';
import { getSnapshot, getAllSectors, getCommodities } from '@/lib/api/market';
import { useResource } from '@/hooks/useResource';
import SectorMosaic, { type MosaicMode } from './SectorMosaic';
import { Delta, Money } from './Delta';
import { compact, num, relativeTime } from '@/lib/format/number';
import type { MarketSnapshot, SectorPerformance, CommodityMap } from '@/lib/api/types';

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
  const [mode, setMode] = useState<MosaicMode>('1d');

  const sectors = useResource<SectorPerformance[]>((signal) => getAllSectors({ signal }));
  const snapshot = useResource<MarketSnapshot>((signal) => getSnapshot({ signal }));
  const commodities = useResource<CommodityMap>((signal) => getCommodities({ signal }));

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100dvh - var(--header-h))',
        maxWidth: 'var(--max-w)',
        padding: '0 var(--s-3) var(--s-2)',
      }}
      className="zw-market"
    >
      <h1 className="zw-sr">Market map</h1>

      <BreadthBar snapshot={snapshot.data} />

      {sectors.loading ? (
        <MosaicSkeleton />
      ) : sectors.error ? (
        <ErrorRegion
          title="Sector data unavailable"
          detail={sectors.error.message}
          onRetry={sectors.refetch}
        />
      ) : (
        <SectorMosaic sectors={sectors.data ?? []} mode={mode} onModeChange={setMode} />
      )}

      <footer
        className="zw-market-foot"
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 300px',
          gap: 'var(--s-4)',
          borderTop: '1px solid var(--border-1)',
          paddingTop: 'var(--s-2)',
          marginTop: 'var(--s-2)',
        }}
      >
        <CommoditiesRibbon data={commodities.data} loading={commodities.loading} />
        <FlowsPanel snapshot={snapshot.data} loading={snapshot.loading} />
      </footer>

      <style>{`
        @media (max-width: 1023px) {
          /* On a phone, filling the viewport with a treemap leaves room
             for nothing else, so the surface scrolls instead. */
          .zw-market { height: auto !important; min-height: calc(100dvh - var(--header-h)); }
          .zw-market-foot { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

/* ── Breadth ──────────────────────────────────────────────────── */

function BreadthBar({ snapshot }: { snapshot: MarketSnapshot | null }) {
  const b = snapshot?.breadth;

  if (!b) {
    return <div style={{ height: 30 }} aria-hidden="true" />;
  }

  const total = b.advancers + b.decliners || 1;
  const advPct = (b.advancers / total) * 100;

  return (
    <div
      style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-3)', height: 30 }}
      aria-label={`Market breadth: ${b.advancers} advancing, ${b.decliners} declining`}
    >
      <span className="zw-colhead">Breadth</span>

      <div
        style={{
          flex: 1,
          maxWidth: 280,
          height: 5,
          display: 'flex',
          overflow: 'hidden',
          borderRadius: 2,
          background: 'var(--bg-2)',
        }}
        aria-hidden="true"
      >
        <span style={{ width: `${advPct}%`, background: 'var(--positive)' }} />
        <span style={{ flex: 1, background: 'var(--negative)' }} />
      </div>

      <span className="zw-num" style={{ fontSize: 11, color: 'var(--positive)' }}>
        {num(b.advancers, 0)} up
      </span>
      <span className="zw-num" style={{ fontSize: 11, color: 'var(--negative)' }}>
        {num(b.decliners, 0)} down
      </span>

      {snapshot?.fetchedAt && (
        <span className="zw-sub" style={{ marginLeft: 'auto', color: 'var(--text-3)' }}>
          {relativeTime(snapshot.fetchedAt)}
        </span>
      )}
    </div>
  );
}

/* ── Commodities ──────────────────────────────────────────────── */

function CommoditiesRibbon({ data, loading }: { data: CommodityMap | null; loading: boolean }) {
  if (loading) {
    return <div style={{ height: 52 }} aria-hidden="true" />;
  }

  const items = Object.values(data ?? {}).filter((c) => c && c.price > 0);
  if (items.length === 0) {
    return (
      <p className="zw-sub" style={{ color: 'var(--text-3)' }}>
        Commodity prices unavailable
      </p>
    );
  }

  return (
    <div className="zw-scroll-x" style={{ display: 'flex', gap: 'var(--s-5)', paddingBottom: 4 }}>
      {items.map((c) => (
        <a
          key={c.symbol}
          href={`/app/commodities/${encodeURIComponent(c.symbol)}`}
          style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <span className="zw-colhead">{c.name}</span>
          <span style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <Money value={c.price} decimals={c.price > 1000 ? 0 : 2} />
            <Delta value={c.changePercent} />
          </span>
        </a>
      ))}
    </div>
  );
}

/* ── FII / DII ────────────────────────────────────────────────── */

function FlowsPanel({ snapshot, loading }: { snapshot: MarketSnapshot | null; loading: boolean }) {
  if (loading) return <div style={{ height: 52 }} aria-hidden="true" />;

  const f = snapshot?.fiiDii;
  if (!f) {
    return (
      <p className="zw-sub" style={{ color: 'var(--text-3)' }}>
        Institutional flows unavailable
      </p>
    );
  }

  // The backend zeroes every field until NSE publishes, which happens
  // after the close. Showing those zeros would assert a flat session
  // that never happened.
  if (f.isAvailable === false) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span className="zw-colhead">Institutional flows</span>
        <p className="zw-sub" style={{ color: 'var(--text-3)' }}>
          Not published yet. NSE releases FII and DII figures after the close.
        </p>
      </div>
    );
  }

  const fiiNet = f.fiiBuy - f.fiiSell;
  const diiNet = f.diiBuy - f.diiSell;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span className="zw-colhead">
        Institutional flows{f.date ? ` \u00b7 ${sessionDate(f.date)}` : ''}
      </span>
      <FlowRow label="FII" net={fiiNet} />
      <FlowRow label="DII" net={diiNet} />
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
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--s-2)' }}>
      <span className="zw-sym" style={{ width: 28 }}>{label}</span>
      <span className="zw-num" style={{ fontSize: 12, color: net >= 0 ? 'var(--positive)' : 'var(--negative)' }}>
        {net >= 0 ? '+' : '−'}{compact(Math.abs(net) * 1e7, true).replace('₹', '₹')}
      </span>
      <span className="zw-sub">{net >= 0 ? 'net buy' : 'net sell'}</span>
    </div>
  );
}

/* ── States ───────────────────────────────────────────────────── */

function MosaicSkeleton() {
  return (
    <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, minHeight: 280 }} aria-hidden="true">
      {Array.from({ length: 12 }).map((_, i) => (
        <span key={i} style={{ background: 'var(--bg-2)' }} />
      ))}
    </div>
  );
}

function ErrorRegion({
  title,
  detail,
  onRetry,
}: {
  title: string;
  detail: string;
  onRetry: () => void;
}) {
  return (
    <div
      role="alert"
      style={{
        flex: 1,
        display: 'grid',
        placeContent: 'center',
        justifyItems: 'center',
        gap: 'var(--s-3)',
        textAlign: 'center',
        minHeight: 280,
      }}
    >
      <p className="zw-section">{title}</p>
      <p className="zw-sub">{detail}</p>
      <button type="button" className="zw-chip" onClick={onRetry}>
        Try again
      </button>
    </div>
  );
}
