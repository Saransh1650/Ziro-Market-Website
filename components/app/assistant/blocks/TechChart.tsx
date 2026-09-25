'use client';

import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { getStockChart } from '@/lib/api/stocks';
import type { ChartRange } from '@/lib/api/stocks';
import { useResource } from '@/hooks/useResource';
import { bollinger, ema, macd, rsi, sma } from '@/lib/assistant/indicators';
import type { Series } from '@/lib/assistant/indicators';
import { direction, num, pct } from '@/lib/format/number';
import type { OHLCPoint } from '@/lib/api/types';
import { Card } from '../shared';
import { str, strs } from '@/lib/assistant/types';
import type { RawBlock } from '@/lib/assistant/types';

/**
 * Technical chart for an answer. Indicators are computed here from candles
 * (a 50-day average needs 50 prior candles), so the range is fetched wider
 * than it is shown and the warm-up is cut off afterwards — otherwise the
 * average lines would start halfway across the chart.
 */

const FETCH_FOR: Record<string, ChartRange> = { '1W': '1M', '1M': '3M', '3M': '6M', '6M': '1Y', '1Y': '1Y', ALL: 'ALL', '1D': '1D' };
const SHOW_DAYS: Record<string, number> = { '1W': 7, '1M': 31, '3M': 92, '6M': 183, '1Y': 366 };
const W = 1000;
const SCALE_W = 52;
const LEGEND_ITEM = { display: 'inline-flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' } as const;

const ts = (p: OHLCPoint) => (typeof p.time === 'number' ? p.time : new Date(p.time).getTime());

interface Line { key: string; label: string; values: Series; dash?: string; width?: number; color: string }

export default function TechChart({ b }: { b: RawBlock }) {
  const symbol = str(b.symbol);
  const range = (str(b.range) in FETCH_FOR ? str(b.range) : '6M') as ChartRange;
  const wanted = useMemo(() => new Set(strs(b.indicators).map((i) => i.toUpperCase())), [b.indicators]);
  const caption = str(b.caption) || `${symbol} chart`;

  const { data, loading, error } = useResource(
    (signal) => getStockChart(symbol, FETCH_FOR[range] ?? '1Y', { signal }),
    { live: false, deps: [symbol, range] },
  );

  const model = useMemo(() => {
    const all = (data?.ohlc ?? []).filter((p) => Number.isFinite(p.close));
    if (all.length < 2) return null;
    const closes = all.map((p) => p.close);

    const main: Line[] = [];
    if (wanted.has('MA')) {
      main.push({ key: 'ma20', label: 'MA 20', values: sma(closes, 20), color: 'var(--ab-ink-2)' });
      main.push({ key: 'ma50', label: 'MA 50', values: sma(closes, 50), color: 'var(--ab-ink-3)', dash: '5 3' });
    }
    if (wanted.has('EMA')) main.push({ key: 'ema20', label: 'EMA 20', values: ema(closes, 20), color: 'var(--ab-ink)', dash: '1 3', width: 1.8 });
    const bb = wanted.has('BOLL') ? bollinger(closes) : null;
    if (bb) {
      main.push({ key: 'bbu', label: 'Upper band', values: bb.upper, color: 'var(--ab-ink-3)', dash: '2 3' });
      main.push({ key: 'bbl', label: 'Lower band', values: bb.lower, color: 'var(--ab-ink-3)', dash: '2 3' });
    }
    const rsiV = wanted.has('RSI') ? rsi(closes) : null;
    const macdV = wanted.has('MACD') ? macd(closes) : null;

    const days = SHOW_DAYS[range];
    const cutoff = days ? ts(all[all.length - 1]) - days * 86_400_000 : -Infinity;
    let from = all.findIndex((p) => ts(p) >= cutoff);
    if (from < 0) from = 0;
    if (all.length - from < 2) from = Math.max(0, all.length - 2);

    const cut = <T,>(a: T[]) => a.slice(from);
    return {
      pts: cut(all),
      main: main.map((l) => ({ ...l, values: cut(l.values) })),
      rsi: rsiV ? cut(rsiV) : null,
      macd: macdV ? { line: cut(macdV.line), signal: cut(macdV.signal), hist: cut(macdV.hist) } : null,
      vol: wanted.has('VOL'),
    };
  }, [data, wanted, range]);

  if (!model) {
    return (
      <Card b={b} title={caption}>
        <div className="zw-ab-chart-skel" aria-hidden={loading ? 'true' : undefined} style={{ display: 'grid', placeContent: 'center', color: 'var(--ab-ink-3)', fontSize: 12 }}>
          {loading ? null : error ? 'Chart data unavailable right now' : `No ${range} data for ${symbol}`}
        </div>
      </Card>
    );
  }

  const { pts } = model;
  const closes = pts.map((p) => p.close);
  const net = closes[closes.length - 1] - closes[0];
  const changePct = closes[0] ? (net / closes[0]) * 100 : 0;
  const d = direction(net);
  const stroke = d === 'down' ? 'var(--ab-down-chart)' : d === 'up' ? 'var(--ab-up-chart)' : 'var(--ab-ink-3)';
  const x = (i: number) => (i / Math.max(1, pts.length - 1)) * W;

  const path = (vals: Series, y: (v: number) => number) => {
    let out = '', pen = false;
    vals.forEach((v, i) => {
      if (v == null) { pen = false; return; }
      out += `${pen ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)} `;
      pen = true;
    });
    return out.trim();
  };

  // main pane scale covers price and every overlay drawn on it
  const mainVals = [...closes, ...model.main.flatMap((l) => l.values.filter((v): v is number => v != null))];
  const mn = Math.min(...mainVals), mx = Math.max(...mainVals);
  const span = mx - mn || Math.max(mx * 0.01, 1);
  const H = 190;
  const my = (v: number) => H - 6 - ((v - mn) / span) * (H - 12);
  const line = path(closes, my);

  const last = (s: Series | undefined) => (s ? [...s].reverse().find((v) => v != null) ?? null : null);
  const rsiLast = last(model.rsi ?? undefined);
  const rsiState = rsiLast == null ? '' : rsiLast >= 70 ? 'overbought' : rsiLast <= 30 ? 'oversold' : 'neutral';

  const summary = `${symbol} ${range}: ${pct(changePct)} over the period, last ${num(closes[closes.length - 1], 2)}, low ${num(mn, 2)}, high ${num(mx, 2)}${rsiLast != null ? `, RSI ${num(rsiLast, 0)} (${rsiState})` : ''}.`;

  return (
    <Card b={b} title={caption}>
      <ul className="zw-ab-legend" aria-label="Chart legend" style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 12px', margin: '0 0 6px', padding: 0, listStyle: 'none', fontSize: 11, color: 'var(--ab-ink-2)' }}>
        <li className="zw-num" style={LEGEND_ITEM}>
          <svg width="14" height="8" aria-hidden="true"><line x1="0" y1="4" x2="14" y2="4" stroke={stroke} strokeWidth="2" /></svg>
          Price {num(closes[closes.length - 1], 2)}{' '}
          <span style={{ color: d === 'down' ? 'var(--ab-down)' : d === 'up' ? 'var(--ab-up)' : undefined }}>{pct(changePct)}</span>
        </li>
        {model.main.filter((l) => !l.key.startsWith('bb')).map((l) => (
          <li key={l.key} className="zw-num" style={LEGEND_ITEM}>
            <svg width="14" height="8" aria-hidden="true"><line x1="0" y1="4" x2="14" y2="4" stroke={l.color} strokeWidth="1.5" strokeDasharray={l.dash} /></svg>
            {l.label} {num(last(l.values), 2)}
          </li>
        ))}
        {wanted.has('BOLL') && <li style={LEGEND_ITEM}>Bollinger 20, 2</li>}
      </ul>

      <div role="img" aria-label={summary}>
        <Pane height={H} lo={mn} hi={mx}>
          <path d={`${line} L${W},${H} L0,${H} Z`} fill={stroke} opacity=".08" />
          {model.main.map((l) => (
            <path key={l.key} d={path(l.values, my)} fill="none" stroke={l.color} strokeWidth={l.width ?? 1.2} strokeDasharray={l.dash} vectorEffect="non-scaling-stroke" />
          ))}
          <path d={line} fill="none" stroke={stroke} strokeWidth="1.6" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        </Pane>

        {model.vol && (() => {
          const vs = pts.map((p) => p.volume || 0);
          const vmax = Math.max(...vs, 1);
          const bw = Math.max(1, W / pts.length - 1);
          return (
            <Pane height={48} label="Volume" lo={0} hi={vmax} fmt={(v) => (v >= 1e7 ? `${(v / 1e7).toFixed(1)}Cr` : v >= 1e5 ? `${(v / 1e5).toFixed(1)}L` : num(v, 0))}>
              {vs.map((v, i) => (
                <rect key={i} x={x(i) - bw / 2} width={bw} y={48 - (v / vmax) * 44} height={(v / vmax) * 44} fill="var(--ab-ink-3)" opacity=".45" />
              ))}
            </Pane>
          );
        })()}

        {model.rsi && (() => {
          const ry = (v: number) => 56 - 4 - (v / 100) * 48;
          return (
            <Pane height={56} label={`RSI 14${rsiLast != null ? ` · ${num(rsiLast, 0)} ${rsiState}` : ''}`} lo={0} hi={100} fmt={(v) => num(v, 0)}>
              <line x1="0" x2={W} y1={ry(70)} y2={ry(70)} stroke="var(--ab-line-strong)" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />
              <line x1="0" x2={W} y1={ry(30)} y2={ry(30)} stroke="var(--ab-line-strong)" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />
              <path d={path(model.rsi, ry)} fill="none" stroke="var(--ab-ink)" strokeWidth="1.3" vectorEffect="non-scaling-stroke" />
            </Pane>
          );
        })()}

        {model.macd && (() => {
          const all = [...model.macd.line, ...model.macd.signal, ...model.macd.hist].filter((v): v is number => v != null);
          const lim = Math.max(...all.map(Math.abs), 0.0001);
          const yy = (v: number) => 28 - (v / lim) * 24;
          const bw = Math.max(1, W / pts.length - 1);
          return (
            <Pane height={56} label="MACD 12·26·9" lo={-lim} hi={lim} fmt={(v) => num(v, 1)}>
              <line x1="0" x2={W} y1={yy(0)} y2={yy(0)} stroke="var(--ab-line-strong)" vectorEffect="non-scaling-stroke" />
              {model.macd.hist.map((v, i) => v == null ? null : (
                <rect key={i} x={x(i) - bw / 2} width={bw} y={Math.min(yy(0), yy(v))} height={Math.abs(yy(v) - yy(0))} fill={v >= 0 ? 'var(--ab-up-chart)' : 'var(--ab-down-chart)'} opacity=".5" />
              ))}
              <path d={path(model.macd.line, yy)} fill="none" stroke="var(--ab-ink)" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
              <path d={path(model.macd.signal, yy)} fill="none" stroke="var(--ab-ink-3)" strokeWidth="1.2" strokeDasharray="4 3" vectorEffect="non-scaling-stroke" />
            </Pane>
          );
        })()}
      </div>

      <div className="zw-ab-ends zw-num" style={{ marginTop: 4, paddingRight: SCALE_W }} aria-hidden="true">
        <span>{fmtDay(pts[0].time)}</span>
        <span>{fmtDay(pts[pts.length - 1].time)}</span>
      </div>
    </Card>
  );
}

function fmtDay(t: string | number) {
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', timeZone: 'Asia/Kolkata' }).format(new Date(t));
}

/** One stacked pane: stretched SVG plot + HTML scale labels (text inside a stretched viewBox distorts). */
function Pane({ height, lo, hi, label, fmt = (v) => num(v, 2), children }: { height: number; lo: number; hi: number; label?: string; fmt?: (v: number) => string; children: ReactNode }) {
  return (
    <div style={{ position: 'relative', paddingRight: SCALE_W, marginTop: label ? 6 : 0 }}>
      {label && <div style={{ fontSize: 10, color: 'var(--ab-ink-3)', marginBottom: 2 }}>{label}</div>}
      <div style={{ position: 'relative', height }}>
        <svg viewBox={`0 0 ${W} ${height}`} preserveAspectRatio="none" width="100%" height={height} style={{ display: 'block' }} aria-hidden="true">
          {children}
        </svg>
        <span className="zw-num" aria-hidden="true" style={{ position: 'absolute', right: -SCALE_W, top: 0, fontSize: 10, color: 'var(--ab-ink-3)' }}>{fmt(hi)}</span>
        <span className="zw-num" aria-hidden="true" style={{ position: 'absolute', right: -SCALE_W, bottom: 0, fontSize: 10, color: 'var(--ab-ink-3)' }}>{fmt(lo)}</span>
      </div>
    </div>
  );
}
