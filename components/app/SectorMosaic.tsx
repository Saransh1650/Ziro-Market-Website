'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { squarify, tintStep } from '@/lib/market/treemap';
import { pct, direction, compact } from '@/lib/format/number';
import type { SectorPerformance } from '@/lib/api/types';

/**
 * The one loud element in the product.
 *
 * Built from CSS-positioned links rather than a canvas chart, which is
 * what lets each cell be focusable, linkable and readable by a screen
 * reader. A canvas treemap is a picture of data; this one is the data.
 */

export type MosaicMode = '1d' | '1w' | '1m' | '3m';

const MODES: { id: MosaicMode; label: string; field: keyof SectorPerformance }[] = [
  { id: '1d', label: '1D', field: 'changePercent' },
  { id: '1w', label: '1W', field: 'change5d' },
  { id: '1m', label: '1M', field: 'change1m' },
  { id: '3m', label: '3M', field: 'change3m' },
];

export default function SectorMosaic({
  sectors,
  mode,
  onModeChange,
}: {
  sectors: SectorPerformance[];
  mode: MosaicMode;
  onModeChange: (m: MosaicMode) => void;
}) {
  const [hovered, setHovered] = useState<SectorPerformance | null>(null);
  const field = MODES.find((m) => m.id === mode)!.field;

  const cells = useMemo(() => {
    const laid = squarify(
      sectors.map((s) => ({
        id: s.name,
        // Weight drives area. Market cap is the honest measure; weight
        // and a flat fallback keep the mosaic whole when it is missing.
        value: s.marketCap ?? s.weight ?? 1,
      })),
    );
    const bySector = new Map(sectors.map((s) => [s.name, s]));
    return laid
      .map((c) => ({ ...c, sector: bySector.get(c.id)! }))
      .filter((c) => c.sector);
  }, [sectors]);

  return (
    <section
      className="zw-mosaic-section"
      style={{ display: 'flex', flexDirection: 'column', minHeight: 0, flex: 1 }}
      aria-label="Sector performance map"
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--s-2)',
          padding: 'var(--s-2) var(--s-1)',
          minHeight: 34,
        }}
      >
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            className="zw-chip"
            aria-pressed={mode === m.id}
            onClick={() => onModeChange(m.id)}
          >
            {m.label}
          </button>
        ))}

        {/*
          Hover detail lands here, in a fixed slot, rather than in a
          floating tooltip. On a dense mosaic a tooltip permanently covers
          the cell next to the one being read.
        */}
        <div aria-live="polite" style={{ marginLeft: 'auto', minWidth: 0 }}>
          {hovered && (
            <span className="zw-sub" style={{ whiteSpace: 'nowrap' }}>
              <strong style={{ color: 'var(--text-1)' }}>{hovered.name}</strong>
              {hovered.indexValue != null && <> · {hovered.indexValue.toFixed(2)}</>}
              {hovered.marketCap != null && <> · {compact(hovered.marketCap)}</>}
              {hovered.rs != null && <> · RS {hovered.rs}</>}
            </span>
          )}
        </div>
      </div>

      <div
        className="zw-mosaic"
        style={{ position: 'relative', flex: 1, minHeight: 280 }}
        onMouseLeave={() => setHovered(null)}
      >
        {cells.map(({ sector, x, y, w, h }) => {
          const change = (sector[field] as number | undefined) ?? sector.changePercent;
          return (
            <MosaicCell
              key={sector.name}
              sector={sector}
              change={change}
              rect={{ x, y, w, h }}
              onHover={setHovered}
            />
          );
        })}
      </div>

      <style>{`
        /* Below 640px a treemap stops being readable — the cells that
           matter get too small to label. It becomes a ranked list, which
           answers the same question with the room available. */
        @media (max-width: 639px) {
          /* The list is as tall as its rows. Letting the section keep
             flex:1 here strands a block of empty canvas under it. */
          .zw-mosaic-section { flex: 0 0 auto !important; }
          .zw-mosaic { display: flex; flex-direction: column; flex: 0 0 auto !important; min-height: 0 !important; }
          .zw-mosaic > a {
            position: static !important;
            width: auto !important;
            height: 34px !important;
            flex-direction: row !important;
            align-items: center !important;
            justify-content: space-between !important;
          }
        }
      `}</style>
    </section>
  );
}

function MosaicCell({
  sector,
  change,
  rect,
  onHover,
}: {
  sector: SectorPerformance;
  change: number;
  rect: { x: number; y: number; w: number; h: number };
  onHover: (s: SectorPerformance | null) => void;
}) {
  const dir = direction(change);
  const step = tintStep(change);

  const fill =
    step === 0
      ? 'var(--bg-2)'
      : `var(--${dir === 'up' ? 'pos' : 'neg'}-${step})`;

  // At the strongest tints the fill is dark enough that forest ink drops
  // below 4.5:1. Above that threshold the label flips to the inverse.
  const ink = step >= 4 ? 'var(--tint-ink-strong)' : 'var(--tint-ink)';

  // A sliver cannot hold two lines of type. Below these thresholds the
  // cell shows the name alone, and the number moves to the title.
  const roomy = rect.w > 9 && rect.h > 11;

  return (
    <Link
      href={`/app/sectors/${encodeURIComponent(sector.name.toLowerCase())}`}
      onMouseEnter={() => onHover(sector)}
      onFocus={() => onHover(sector)}
      title={`${sector.name} ${pct(change)}`}
      aria-label={`${sector.name}, ${dir === 'up' ? 'up' : dir === 'down' ? 'down' : 'unchanged'} ${Math.abs(change).toFixed(2)} percent`}
      style={{
        position: 'absolute',
        left: `${rect.x}%`,
        top: `${rect.y}%`,
        width: `${rect.w}%`,
        height: `${rect.h}%`,
        background: fill,
        color: ink,
        border: '1px solid var(--bg-0)',
        borderRadius: 'var(--r-data)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2,
        padding: 4,
        overflow: 'hidden',
        textAlign: 'center',
      }}
    >
      <span
        style={{
          fontSize: roomy ? 12 : 10,
          fontWeight: 700,
          letterSpacing: '-0.01em',
          lineHeight: 1.1,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '100%',
        }}
      >
        {sector.name}
      </span>
      {roomy && (
        <span
          className="zw-num"
          /* No opacity here: knocking the label back to 92% cost enough
             contrast at the mid tint steps to fail 4.5:1. */
          style={{ fontSize: 11, fontWeight: 500 }}
        >
          {pct(change)}
        </span>
      )}
    </Link>
  );
}
