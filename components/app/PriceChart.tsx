'use client';

import { useMemo, useState, useId } from 'react';
import { getStockChart, type ChartRange } from '@/lib/api/stocks';
import { useResource } from '@/hooks/useResource';
import { num, pct, direction, relativeTime } from '@/lib/format/number';
import type { OHLCPoint } from '@/lib/api/types';

/**
 * Price chart, drawn as inline SVG.
 *
 * No charting library. The whole product's first-load budget is 180KB
 * and a chart library would spend most of it on features this needs none
 * of — a line, candles, and a crosshair are a few dozen lines of path
 * maths. It also keeps the drawing in the DOM, where the theme tokens
 * already work.
 */

const RANGES: ChartRange[] = ['1D', '1W', '1M', '3M', '6M', '1Y'];

const VB_W = 1000;
const VB_H = 300;

export default function PriceChart({
  symbol,
  initialOhlc,
  previousClose,
}: {
  symbol: string;
  initialOhlc: OHLCPoint[];
  previousClose?: number;
}) {
  const [range, setRange] = useState<ChartRange>('1D');
  const [mode, setMode] = useState<'line' | 'candle'>('line');

  const { data, loading, error } = useResource(
    (signal) => getStockChart(symbol, range, { signal }),
    { deps: [symbol, range] },
  );

  // The server already sent 1D candles with the page, so the default
  // range paints immediately instead of flashing a skeleton.
  const points: OHLCPoint[] =
    data?.ohlc?.length ? data.ohlc : range === '1D' ? initialOhlc : [];

  return (
    <section aria-label="Price chart" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-2)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-2)', flexWrap: 'wrap' }}>
        {RANGES.map((r) => (
          <button
            key={r}
            type="button"
            className="zw-chip"
            aria-pressed={range === r}
            onClick={() => setRange(r)}
          >
            {r}
          </button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 'var(--s-1)' }}>
          <button
            type="button"
            className="zw-chip"
            aria-pressed={mode === 'line'}
            onClick={() => setMode('line')}
          >
            Line
          </button>
          <button
            type="button"
            className="zw-chip"
            aria-pressed={mode === 'candle'}
            onClick={() => setMode('candle')}
          >
            Candles
          </button>
        </div>
      </div>

      {/*
        Fixed height across every state. A chart that resizes between
        skeleton, data and error shifts everything below it on each
        range change.
      */}
      <div style={{ height: 300, position: 'relative' }}>
        {points.length >= 2 ? (
          <Plot points={points} mode={mode} previousClose={range === '1D' ? previousClose : undefined} />
        ) : loading ? (
          <div style={{ height: '100%', background: 'var(--surface-hover)' }} aria-hidden="true" />
        ) : (
          <p
            className="zw-sub"
            style={{ height: '100%', display: 'grid', placeContent: 'center', color: 'var(--ink-3)' }}
          >
            {error ? 'Chart data unavailable' : `No ${range} data for ${symbol}`}
          </p>
        )}
      </div>
    </section>
  );
}

/* ── Plot ─────────────────────────────────────────────────────── */

function Plot({
  points,
  mode,
  previousClose,
}: {
  points: OHLCPoint[];
  mode: 'line' | 'candle';
  previousClose?: number;
}) {
  const gradId = useId();
  const [hover, setHover] = useState<number | null>(null);

  const geom = useMemo(() => {
    const closes = points.map((p) => p.close);
    const highs = mode === 'candle' ? points.map((p) => p.high) : closes;
    const lows = mode === 'candle' ? points.map((p) => p.low) : closes;

    let min = Math.min(...lows);
    let max = Math.max(...highs);
    if (previousClose != null && Number.isFinite(previousClose)) {
      min = Math.min(min, previousClose);
      max = Math.max(max, previousClose);
    }

    // A flat series would divide by zero. Give it a nominal band so the
    // line renders through the middle instead of vanishing.
    const span = max - min || Math.max(max * 0.01, 1);
    const pad = span * 0.08;
    const lo = min - pad;
    const hi = max + pad;

    const x = (i: number) => (i / Math.max(1, points.length - 1)) * VB_W;
    const y = (v: number) => VB_H - ((v - lo) / (hi - lo)) * VB_H;

    const net = closes[closes.length - 1] - closes[0];

    return { x, y, lo, hi, net, first: closes[0], last: closes[closes.length - 1], min, max };
  }, [points, mode, previousClose]);

  const dir = direction(geom.net);
  const stroke = dir === 'down' ? 'var(--down)' : dir === 'up' ? 'var(--up)' : 'var(--ink-3)';

  const linePath = useMemo(
    () => points.map((p, i) => `${i === 0 ? 'M' : 'L'}${geom.x(i).toFixed(2)},${geom.y(p.close).toFixed(2)}`).join(' '),
    [points, geom],
  );

  const areaPath = `${linePath} L${VB_W},${VB_H} L0,${VB_H} Z`;

  const changePct = geom.first ? ((geom.last - geom.first) / geom.first) * 100 : 0;
  const active = hover != null ? points[hover] : null;

  const ticks = useMemo(() => {
    // Three levels is enough to read a value off the chart without
    // turning the plot into graph paper.
    const mid = (geom.lo + geom.hi) / 2;
    return [geom.hi, mid, geom.lo].map((v) => ({ v, pct: ((geom.hi - v) / (geom.hi - geom.lo)) * 100 }));
  }, [geom]);

  const timeLabels = useMemo(() => {
    const at = (i: number) => points[Math.min(points.length - 1, Math.max(0, i))];
    return [at(0), at(Math.floor(points.length / 2)), at(points.length - 1)].map((p) =>
      new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        ...(points.length > 400 || spansDays(points)
          ? { day: 'numeric', month: 'short' }
          : { hour: 'numeric', minute: '2-digit', hour12: false }),
      }).format(new Date(p.time)),
    );
  }, [points]);

  return (
    <div style={{ position: 'relative', height: '100%', paddingRight: 52, paddingBottom: 16 }}>
      {/* Price scale. Rendered as HTML beside the SVG rather than inside
          it — the plot is stretched to fit its container, and text in a
          stretched viewBox is distorted with it. */}
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 16, width: 48 }} aria-hidden="true">
        {ticks.map(({ v, pct: top }, i) => (
          <span
            key={i}
            className="zw-num"
            style={{
              position: 'absolute',
              top: `${top}%`,
              right: 0,
              transform: i === 0 ? 'translateY(0)' : i === ticks.length - 1 ? 'translateY(-100%)' : 'translateY(-50%)',
              fontSize: 10,
              color: 'var(--ink-3)',
            }}
          >
            {num(v, 2)}
          </span>
        ))}
      </div>

      {/* Time axis */}
      <div
        style={{
          position: 'absolute', left: 0, right: 52, bottom: 0,
          display: 'flex', justifyContent: 'space-between',
        }}
        aria-hidden="true"
      >
        {timeLabels.map((t, i) => (
          <span key={i} className="zw-num" style={{ fontSize: 10, color: 'var(--ink-3)' }}>{t}</span>
        ))}
      </div>

      {/* Read-out sits above the plot in a fixed slot, so following the
          crosshair never means chasing a tooltip around the chart. */}
      <div
        style={{ position: 'absolute', top: 0, left: 0, zIndex: 1, display: 'flex', gap: 'var(--s-3)', alignItems: 'baseline' }}
        aria-live="off"
      >
        {active ? (
          <>
            <span className="zw-num" style={{ fontSize: 13, fontWeight: 500 }}>{num(active.close, 2)}</span>
            <span className="zw-sub">{relativeTime(active.time)}</span>
            {mode === 'candle' && (
              <span className="zw-sub zw-num">
                O {num(active.open, 2)} · H {num(active.high, 2)} · L {num(active.low, 2)}
              </span>
            )}
          </>
        ) : (
          <span className="zw-sub zw-num" style={{ color: stroke }}>{pct(changePct)} over period</span>
        )}
      </div>

      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="none"
        width="100%"
        height="100%"
        role="img"
        aria-label={`Price chart. Opened at ${num(geom.first, 2)}, last ${num(geom.last, 2)}, ${pct(changePct)} over the period. Low ${num(geom.min, 2)}, high ${num(geom.max, 2)}.`}
        onMouseLeave={() => setHover(null)}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const ratio = (e.clientX - rect.left) / rect.width;
          setHover(Math.min(points.length - 1, Math.max(0, Math.round(ratio * (points.length - 1)))));
        }}
        style={{ display: 'block', cursor: 'crosshair' }}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={stroke} stopOpacity="0.18" />
            <stop offset="100%" stopColor={stroke} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Horizontal guides at the three labelled levels. */}
        {ticks.map(({ v }, i) => (
          <line
            key={i}
            x1={0}
            x2={VB_W}
            y1={geom.y(v)}
            y2={geom.y(v)}
            stroke="var(--line)"
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          />
        ))}

        {/* Previous close, so an intraday line is read against the level
            that decides whether the day is green or red. */}
        {previousClose != null && Number.isFinite(previousClose) && (
          <line
            x1={0}
            x2={VB_W}
            y1={geom.y(previousClose)}
            y2={geom.y(previousClose)}
            stroke="var(--line-strong)"
            strokeWidth={1}
            strokeDasharray="4 4"
            vectorEffect="non-scaling-stroke"
          />
        )}

        {mode === 'line' ? (
          <>
            <path d={areaPath} fill={`url(#${gradId})`} />
            <path
              d={linePath}
              fill="none"
              stroke={stroke}
              strokeWidth={1.5}
              strokeLinejoin="round"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </>
        ) : (
          <Candles points={points} geom={geom} />
        )}

        {active && (
          <line
            x1={geom.x(hover!)}
            x2={geom.x(hover!)}
            y1={0}
            y2={VB_H}
            stroke="var(--ink-3)"
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          />
        )}
      </svg>
    </div>
  );
}

/** True when the series covers more than one calendar day. */
function spansDays(points: OHLCPoint[]): boolean {
  if (points.length < 2) return false;
  const a = new Date(points[0].time);
  const b = new Date(points[points.length - 1].time);
  return b.getTime() - a.getTime() > 26 * 60 * 60 * 1000;
}

function Candles({
  points,
  geom,
}: {
  points: OHLCPoint[];
  geom: { x: (i: number) => number; y: (v: number) => number };
}) {
  // Leave a gap between candles, but never let the body vanish: below
  // ~1 unit wide a candle stops reading as a candle at all.
  const slot = VB_W / points.length;
  const bodyW = Math.max(1, slot * 0.62);

  return (
    <g>
      {points.map((p, i) => {
        const up = p.close >= p.open;
        const colour = up ? 'var(--up)' : 'var(--down)';
        const cx = geom.x(i);
        const yOpen = geom.y(p.open);
        const yClose = geom.y(p.close);
        const top = Math.min(yOpen, yClose);
        // A doji has open === close, so the body would be 0px tall and
        // invisible. Floor it at a hairline.
        const height = Math.max(1, Math.abs(yClose - yOpen));

        return (
          <g key={i}>
            <line
              x1={cx}
              x2={cx}
              y1={geom.y(p.high)}
              y2={geom.y(p.low)}
              stroke={colour}
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
            />
            <rect x={cx - bodyW / 2} y={top} width={bodyW} height={height} fill={colour} />
          </g>
        );
      })}
    </g>
  );
}
