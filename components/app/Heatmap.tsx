'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { getAllSectors } from '@/lib/api/market';
import { getSectorDetail } from '@/lib/api/sectors';
import { useResource } from '@/hooks/useResource';
import { squarify } from '@/lib/market/treemap';
import { heatColor, HEAT_GRADIENT, HEAT_RANGE } from '@/lib/market/heat';
import { pct, compact, num } from '@/lib/format/number';
import type { SectorPerformance, SectorStockRow } from '@/lib/api/types';

/**
 * Market heatmap, in the TradingView idiom.
 *
 * Two views over one treemap engine:
 *  - **Stocks** — every large company as a tile sized by market cap and
 *    coloured by today's move, grouped under its sector.
 *  - **Sectors** — the sector tiles alone, with a timeframe switch.
 *
 * Tiles are real links laid out in pixels from the measured container, so
 * each is focusable and readable by a screen reader, and the label on each
 * one is fitted to the room its area allows.
 */

type View = 'stocks' | 'sectors';
type Period = '1d' | '1w' | '1m' | '3m';

const PERIODS: { id: Period; label: string; field: keyof SectorPerformance }[] = [
  { id: '1d', label: '1D', field: 'changePercent' },
  { id: '1w', label: '1W', field: 'change5d' },
  { id: '1m', label: '1M', field: 'change1m' },
  { id: '3m', label: '3M', field: 'change3m' },
];

const SECTOR_COUNT = 14;
const STOCKS_PER_SECTOR = 16;

interface Tile {
  id: string;
  label: string;
  sub?: string;
  value: number;
  change: number;
  href: string;
  detail: { name: string; price?: number; cap?: number; extra?: string };
}
interface Group {
  id: string;
  label: string;
  change: number;
  href: string;
  tiles: Tile[];
}
interface Loaded {
  sectors: SectorPerformance[];
  groups: { sector: SectorPerformance; stocks: SectorStockRow[] }[];
}

export default function Heatmap() {
  const [view, setView] = useState<View>('stocks');
  const [period, setPeriod] = useState<Period>('1d');

  const { data, loading, error, refetch } = useResource<Loaded>(async (signal) => {
    const all = await getAllSectors({ signal });
    if (!all.ok) return all;

    const top = [...all.data]
      .filter((s) => s?.name && (s.marketCap ?? 0) > 0)
      .sort((a, b) => (b.marketCap ?? 0) - (a.marketCap ?? 0))
      .slice(0, SECTOR_COUNT);

    const details = await Promise.all(
      top.map((s) => getSectorDetail(s.name, { limit: STOCKS_PER_SECTOR, sort: 'market_cap', signal })),
    );

    return {
      ok: true as const,
      data: {
        sectors: all.data,
        groups: top.map((sector, i) => {
          const d = details[i];
          return { sector, stocks: d.ok ? d.data.stocks : [] };
        }),
      },
    };
  });

  const field = PERIODS.find((p) => p.id === period)!.field;

  const groups: Group[] = useMemo(() => {
    if (!data) return [];

    if (view === 'sectors') {
      // One tile per sector, no grouping: a sector *is* the tile.
      return [...data.sectors]
        .filter((s) => s?.name && (s.marketCap ?? s.weight ?? 0) > 0)
        .sort((a, b) => (b.marketCap ?? b.weight ?? 0) - (a.marketCap ?? a.weight ?? 0))
        .slice(0, 24)
        .map((s) => {
          const change = (s[field] as number | undefined) ?? s.changePercent;
          return {
            id: s.name,
            label: s.name,
            change,
            href: sectorHref(s.name),
            tiles: [
              {
                id: s.name,
                label: s.name,
                value: s.marketCap ?? s.weight ?? 1,
                change,
                href: sectorHref(s.name),
                detail: {
                  name: s.name,
                  cap: s.marketCap,
                  extra: [s.indexValue != null ? `Index ${num(s.indexValue, 2)}` : '', s.rs != null ? `RS ${s.rs}` : '']
                    .filter(Boolean)
                    .join(' · '),
                },
              },
            ],
          };
        });
    }

    // The feed's sectors overlap — Financial services and NBFC both list
    // HDFCBANK, Diversified and Miscellaneous both list RELIANCE — so a
    // company is drawn once, under the largest sector that claims it.
    const seen = new Set<string>();
    return data.groups
      .map(({ sector, stocks }) => ({
        id: sector.name,
        label: sector.name,
        change: sector.changePercent,
        href: sectorHref(sector.name),
        tiles: stocks
          .filter((s) => {
            if (!(s.marketCap && s.marketCap > 0) || !Number.isFinite(s.changePercent) || seen.has(s.symbol)) return false;
            seen.add(s.symbol);
            return true;
          })
          .map((s) => ({
            id: s.symbol,
            label: s.symbol,
            value: s.marketCap!,
            change: s.changePercent,
            href: `/stocks/${encodeURIComponent(s.symbol)}`,
            detail: { name: s.name || s.symbol, price: s.price, cap: s.marketCap, extra: s.subSector },
          })),
      }))
      .filter((g) => g.tiles.length > 0);
  }, [data, view, field]);

  return (
    <section className="zw-heat" aria-label="Market heatmap">
      <div className="zw-heat-bar">
        <div className="zw-seg" role="group" aria-label="Heatmap view">
          {(['stocks', 'sectors'] as View[]).map((v) => (
            <button key={v} type="button" aria-pressed={view === v} onClick={() => setView(v)}>
              {v === 'stocks' ? 'Stocks' : 'Sectors'}
            </button>
          ))}
        </div>

        {view === 'sectors' && (
          <div className="zw-seg" role="group" aria-label="Timeframe">
            {PERIODS.map((p) => (
              <button key={p.id} type="button" aria-pressed={period === p.id} onClick={() => setPeriod(p.id)}>
                {p.label}
              </button>
            ))}
          </div>
        )}

        <span className="zw-meta zw-heat-note">
          Size: market cap · Colour: {view === 'sectors' ? PERIODS.find((p) => p.id === period)!.label : '1D'} change
        </span>

        <Legend />
      </div>

      <div className="zw-heat-canvas">
        {loading ? (
          <div className="zw-heat-state"><span className="zw-heat-spin" aria-hidden="true" />Loading market…</div>
        ) : error ? (
          <div role="alert" className="zw-heat-state">
            <p className="zw-section">Market data unavailable</p>
            <p className="zw-sub">{error.message}</p>
            <button type="button" className="zw-chip" onClick={refetch}>Try again</button>
          </div>
        ) : (
          <Treemap groups={groups} flat={view === 'sectors'} />
        )}
      </div>
    </section>
  );
}

const sectorHref = (name: string) => `/app/sectors/${encodeURIComponent(name.toLowerCase())}`;

/* ── Legend ───────────────────────────────────────────────────── */

function Legend() {
  return (
    <div className="zw-heat-legend" aria-hidden="true">
      <span>−{HEAT_RANGE}%</span>
      <span className="bar" style={{ background: HEAT_GRADIENT }} />
      <span>+{HEAT_RANGE}%</span>
    </div>
  );
}

/* ── Treemap ──────────────────────────────────────────────────── */

const HEADER_H = 20;
const GROUP_GAP = 1.5;
const TILE_GAP = 0.5;

interface Placed {
  tile: Tile;
  x: number;
  y: number;
  w: number;
  h: number;
}
interface PlacedGroup {
  group: Group;
  x: number;
  y: number;
  w: number;
  h: number;
  headed: boolean;
}

function Treemap({ groups, flat }: { groups: Group[]; flat: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [hover, setHover] = useState<{ tile: Tile; x: number; y: number } | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { tiles, placedGroups } = useMemo(() => {
    if (!size.w || !size.h) return { tiles: [] as Placed[], placedGroups: [] as PlacedGroup[] };

    const byId = new Map(groups.map((g) => [g.id, g]));
    const outer = squarify(
      groups.map((g) => ({ id: g.id, value: g.tiles.reduce((s, t) => s + t.value, 0) })),
      size.w,
      size.h,
    );

    const tiles: Placed[] = [];
    const placedGroups: PlacedGroup[] = [];

    for (const o of outer) {
      const group = byId.get(o.id)!;

      if (flat) {
        placedGroups.push({ group, x: o.x, y: o.y, w: o.w, h: o.h, headed: false });
        tiles.push({ tile: group.tiles[0], x: o.x, y: o.y, w: o.w, h: o.h });
        continue;
      }

      const headed = o.w > 70 && o.h > 56;
      const top = headed ? HEADER_H : 0;
      placedGroups.push({ group, x: o.x, y: o.y, w: o.w, h: o.h, headed });

      const innerW = o.w - GROUP_GAP * 2;
      const innerH = o.h - top - GROUP_GAP * (headed ? 1 : 2);
      if (innerW <= 0 || innerH <= 0) continue;

      const inner = squarify(
        group.tiles.map((t) => ({ id: t.id, value: t.value })),
        innerW,
        innerH,
      );
      const tById = new Map(group.tiles.map((t) => [t.id, t]));
      for (const c of inner) {
        tiles.push({
          tile: tById.get(c.id)!,
          x: o.x + GROUP_GAP + c.x,
          y: o.y + top + (headed ? 0 : GROUP_GAP) + c.y,
          w: c.w,
          h: c.h,
        });
      }
    }
    return { tiles, placedGroups };
  }, [groups, flat, size]);

  return (
    <div
      ref={ref}
      className="zw-treemap"
      onMouseLeave={() => setHover(null)}
      onMouseMove={(e) => {
        const box = e.currentTarget.getBoundingClientRect();
        setHover((h) => (h ? { ...h, x: e.clientX - box.left, y: e.clientY - box.top } : h));
      }}
    >
      {!flat &&
        placedGroups
          .filter((g) => g.headed)
          .map((g) => (
            <Link
              key={g.group.id}
              href={g.group.href}
              className="zw-heat-group"
              style={{ left: g.x + GROUP_GAP, top: g.y, width: g.w - GROUP_GAP * 2, height: HEADER_H }}
              title={`${g.group.label} ${pct(g.group.change)}`}
            >
              <span className="name">{g.group.label}</span>
              <span className={`chg ${g.group.change > 0 ? 'up' : g.group.change < 0 ? 'down' : ''}`}>
                {pct(g.group.change, 2)}
              </span>
            </Link>
          ))}

      {tiles.map((p) => (
        <HeatTile
          key={p.tile.id}
          p={p}
          flat={flat}
          onHover={(tile, cx, cy) => {
            const box = ref.current!.getBoundingClientRect();
            setHover({ tile, x: cx - box.left, y: cy - box.top });
          }}
        />
      ))}

      {hover && <Tip hover={hover} width={size.w} height={size.h} />}
    </div>
  );
}

function HeatTile({
  p,
  flat,
  onHover,
}: {
  p: Placed;
  flat: boolean;
  onHover: (t: Tile, clientX: number, clientY: number) => void;
}) {
  const { tile, x, y, w, h } = p;
  const gap = flat ? GROUP_GAP : TILE_GAP;

  // Fit the label to the tile. The symbol is sized by whichever is
  // tighter — its width or the tile's height — so a wide short tile and a
  // narrow tall one both get type that fills them without clipping.
  const labelLen = Math.max(tile.label.length, 3);
  const byWidth = (w - 10) / (labelLen * 0.76);
  const byHeight = h * 0.34;
  const size = Math.max(0, Math.min(byWidth, byHeight, flat ? 22 : 30));
  const showLabel = size >= 9 && w > 26 && h > 16;
  const showChange = showLabel && h > size * 2.5 + 6 && w > 44;
  const subSize = Math.max(9, Math.min(13, size * 0.55));

  return (
    <Link
      href={tile.href}
      className="zw-heat-tile"
      onMouseEnter={(e) => onHover(tile, e.clientX, e.clientY)}
      onFocus={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        onHover(tile, r.left + r.width / 2, r.top + r.height / 2);
      }}
      aria-label={`${tile.detail.name}, ${pct(tile.change)}`}
      style={{
        left: x + gap,
        top: y + gap,
        width: Math.max(0, w - gap * 2),
        height: Math.max(0, h - gap * 2),
        background: heatColor(tile.change),
      }}
    >
      {showLabel && (
        <span className="zw-heat-sym" style={{ fontSize: size }}>
          {tile.label}
        </span>
      )}
      {showChange && (
        <span className="zw-heat-chg" style={{ fontSize: subSize }}>
          {pct(tile.change, 2)}
        </span>
      )}
    </Link>
  );
}

function Tip({ hover, width, height }: { hover: { tile: Tile; x: number; y: number }; width: number; height: number }) {
  const { tile, x, y } = hover;
  const W = 232;
  const H = 108;
  const left = x + 16 + W > width ? x - W - 12 : x + 16;
  const top = Math.min(Math.max(y - 12, 4), height - H - 4);
  const d = tile.detail;

  return (
    <div className="zw-heat-tip" style={{ left, top, width: W }} role="tooltip">
      <div className="zw-heat-tip-head">
        <span className="sym">{tile.label}</span>
        <span className="chg" style={{ background: heatColor(tile.change) }}>{pct(tile.change)}</span>
      </div>
      {d.name !== tile.label && <p className="name">{d.name}</p>}
      <dl>
        {d.price != null && (<><dt>Price</dt><dd>₹{num(d.price, 2)}</dd></>)}
        {d.cap != null && (<><dt>Market cap</dt><dd>{compact(d.cap)}</dd></>)}
        {d.extra && (<><dt>Group</dt><dd>{d.extra}</dd></>)}
      </dl>
    </div>
  );
}
