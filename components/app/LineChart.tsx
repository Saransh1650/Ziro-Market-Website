'use client';

import { useId, useMemo, useState } from 'react';

/**
 * A multi-series line chart in inline SVG, with a crosshair readout.
 *
 * Shared by the commodity page (one series, filled) and watchlist
 * compare (many series rebased to 100). No charting library, for the same
 * reason as PriceChart: the first-load budget.
 */

export interface Series {
  name: string;
  values: number[];
  /** CSS colour. Defaults come from a fixed categorical set, never up/down hues. */
  color?: string;
}

// Categorical, deliberately not red or green — those are reserved for
// signed change, and a line for "TCS" must never read as "down".
const PALETTE = ['#4f6bed', '#d9822b', '#8a5cc4', '#1f9fb5', '#c2437f', '#7a8794', '#a3892b', '#3f7f5f'];

const W = 1000;
const PAD = { l: 8, r: 64, t: 12, b: 26 };

export default function LineChart({
  series,
  labels,
  fill = false,
  format = (v: number) => v.toFixed(2),
  baseline,
  height = 320,
}: {
  series: Series[];
  /** One label per x position, shared by all series. */
  labels: string[];
  fill?: boolean;
  format?: (v: number) => string;
  /** Horizontal reference line, e.g. 100 for rebased series. */
  baseline?: number;
  height?: number;
}) {
  const H = Math.round((height / 1216) * W);
  const id = useId();
  const [hover, setHover] = useState<number | null>(null);

  const n = Math.max(...series.map((s) => s.values.length), 0);

  const { min, max } = useMemo(() => {
    const all = series.flatMap((s) => s.values).filter(Number.isFinite);
    if (baseline != null) all.push(baseline);
    const lo = Math.min(...all);
    const hi = Math.max(...all);
    const pad = (hi - lo || 1) * 0.08;
    return { min: lo - pad, max: hi + pad };
  }, [series, baseline]);

  if (n < 2) return <p className="zw-sub">Not enough data to draw a chart.</p>;

  const x = (i: number) => PAD.l + (i / (n - 1)) * (W - PAD.l - PAD.r);
  const y = (v: number) => PAD.t + (1 - (v - min) / (max - min)) * (H - PAD.t - PAD.b);

  const path = (vals: number[]) => vals.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');

  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => min + (max - min) * t);
  const xTicks = [0, Math.floor((n - 1) / 2), n - 1];

  const colored = series.map((s, i) => ({ ...s, color: s.color ?? PALETTE[i % PALETTE.length] }));

  return (
    <figure style={{ margin: 0 }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: '100%', height: 'auto', display: 'block' }}
        role="img"
        aria-label={`Line chart of ${series.map((s) => s.name).join(', ')}`}
        onMouseLeave={() => setHover(null)}
        onMouseMove={(e) => {
          const box = e.currentTarget.getBoundingClientRect();
          const px = ((e.clientX - box.left) / box.width) * W;
          setHover(Math.max(0, Math.min(n - 1, Math.round(((px - PAD.l) / (W - PAD.l - PAD.r)) * (n - 1)))));
        }}
      >
        {ticks.map((t) => (
          <g key={t}>
            <line x1={PAD.l} x2={W - PAD.r} y1={y(t)} y2={y(t)} style={{ stroke: 'var(--line)' }} strokeWidth="1" />
            <text x={W - PAD.r + 8} y={y(t) + 4} fontSize="12" style={{ fill: 'var(--ink-3)' }}>{format(t)}</text>
          </g>
        ))}

        {baseline != null && (
          <line x1={PAD.l} x2={W - PAD.r} y1={y(baseline)} y2={y(baseline)} style={{ stroke: 'var(--ink-3)' }} strokeDasharray="4 4" strokeWidth="1" />
        )}

        {fill && colored[0] && (
          <>
            <defs>
              <linearGradient id={`${id}-f`} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" style={{ stopColor: colored[0].color }} stopOpacity="0.22" />
                <stop offset="1" style={{ stopColor: colored[0].color }} stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={`${path(colored[0].values)} L${x(colored[0].values.length - 1)} ${H - PAD.b} L${x(0)} ${H - PAD.b} Z`} style={{ fill: `url(#${id}-f)` }} />
          </>
        )}

        {colored.map((s) => (
          <path key={s.name} d={path(s.values)} fill="none" style={{ stroke: s.color }} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        ))}

        {xTicks.map((i) => (
          <text key={i} x={x(i)} y={H - 6} fontSize="12" style={{ fill: 'var(--ink-3)' }} textAnchor={i === 0 ? 'start' : i === n - 1 ? 'end' : 'middle'}>
            {labels[i]}
          </text>
        ))}

        {hover != null && (
          <g>
            <line x1={x(hover)} x2={x(hover)} y1={PAD.t} y2={H - PAD.b} style={{ stroke: 'var(--ink-3)' }} strokeWidth="1" />
            {colored.map((s) => s.values[hover] != null && (
              <circle key={s.name} cx={x(hover)} cy={y(s.values[hover])} r="4" style={{ fill: s.color, stroke: 'var(--surface)' }} strokeWidth="2" />
            ))}
          </g>
        )}
      </svg>

      <figcaption className="zw-chartkey">
        {hover != null && <span className="zw-meta">{labels[hover]}</span>}
        {colored.map((s) => (
          <span key={s.name} className="key">
            <i style={{ background: s.color }} />
            {s.name}
            {hover != null && s.values[hover] != null && <b className="zw-num">{format(s.values[hover])}</b>}
          </span>
        ))}
      </figcaption>
    </figure>
  );
}
