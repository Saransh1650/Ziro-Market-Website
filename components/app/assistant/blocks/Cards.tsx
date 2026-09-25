'use client';

import { useId, useMemo, useState } from 'react';
import { direction, num, pct } from '@/lib/format/number';
import { isObj, numOf, objs, str, strs, validAction } from '@/lib/assistant/types';
import type { Intent, RawBlock } from '@/lib/assistant/types';
import { Card, HIDDEN } from '../shared';
import type { Rendered } from '../shared';
import { AnswerBody } from '../AnswerBody';

export interface BlockCtx {
  onAsk: (question: string, symbol?: string) => void;
  /** Runs a whitelisted intent; resolves to a short status line for the user. */
  onIntent: (intent: Intent, params: Record<string, unknown>) => Promise<string>;
  allowed: ReadonlySet<string>;
}

const dirOf = (v: number | null) => direction(v);
const colorOf = (d: 'up' | 'down' | 'flat') => (d === 'up' ? 'var(--ab-up)' : d === 'down' ? 'var(--ab-down)' : 'var(--ab-ink)');
const GLYPH = { up: '▲', down: '▼', flat: '' } as const;

/** A value with a direction glyph, so colour is never the only signal. */
function Move({ value, text }: { value: number | null; text: string }) {
  const d = dirOf(value);
  return (
    <span style={{ color: colorOf(d) }}>
      {GLYPH[d] && (
        <>
          <span aria-hidden="true" style={{ fontSize: 8, marginRight: 3 }}>{GLYPH[d]}</span>
          <span style={SR}>{d === 'up' ? 'up ' : 'down '}</span>
        </>
      )}
      {text}
    </span>
  );
}
const SR = { position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' } as const;

/* ── simple blocks ────────────────────────────────────────────── */

function text(b: RawBlock): Rendered {
  const t = str(b.text);
  return t ? <p className="zw-ab-prose" style={{ margin: 0 }}><AnswerBody text={t} /></p> : HIDDEN;
}

function disclaimer(b: RawBlock): Rendered {
  const t = str(b.text);
  if (!t) return HIDDEN;
  return (
    <p className="zw-ab-disclaimer">
      <span aria-hidden="true">ⓘ</span>
      <span>{t}</span>
    </p>
  );
}

function notice(b: RawBlock): Rendered {
  const t = str(b.text);
  if (!t) return HIDDEN;
  const tone = str(b.tone) === 'warn' ? 'warn' : 'info';
  return (
    <div className="zw-ab-notice" data-tone={tone} role={tone === 'warn' ? 'status' : undefined}>
      <span className="glyph" aria-hidden="true">{tone === 'warn' ? '!' : 'i'}</span>
      <span>{t}</span>
    </div>
  );
}

function stat(b: RawBlock): Rendered {
  const symbol = str(b.symbol);
  const price = numOf(b.price);
  if (!symbol || price == null) return null;
  const ch = numOf(b.changePct);
  return (
    <Card b={b}>
      <div className="zw-ab-head" style={{ marginBottom: 0 }}>
        <strong>{symbol}</strong>
        <span className="zw-num" style={{ color: 'var(--ab-ink)', fontSize: 15, fontWeight: 600 }}>₹{num(price, 2)}</span>
        {ch != null && <span className="zw-num" style={{ fontSize: 12 }}><Move value={ch} text={pct(ch)} /></span>}
      </div>
    </Card>
  );
}

function table(b: RawBlock): Rendered {
  if (!Array.isArray(b.rows)) return null;
  const rows = objs(b.rows);
  if (rows.length === 0) return null;
  return (
    <Card b={b} title={str(b.title)}>
      <dl className="zw-ab-dl">
        {rows.map((r, i) => (
          <div className="zw-ab-row" key={i}>
            <dt className="zw-ab-k">{str(r.label)}</dt>
            <dd className="zw-ab-v">{str(r.value)}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}

function kpi(b: RawBlock): Rendered {
  const items = objs(b.items);
  if (items.length === 0) return null;
  return (
    <Card b={b} title={str(b.title)}>
      <dl className="zw-ab-grid">
        {items.map((it, i) => {
          const d = numOf(it.delta);
          return (
            <div className="zw-ab-cell" key={i}>
              <dt>{str(it.label)}</dt>
              <dd className="zw-num">{d == null ? str(it.value) : <Move value={d} text={str(it.value)} />}</dd>
            </div>
          );
        })}
      </dl>
    </Card>
  );
}

function sectorPerf(b: RawBlock): Rendered {
  const items = objs(b.items).filter((i) => numOf(i.changePct) != null);
  if (items.length === 0) return null;
  const max = Math.max(...items.map((i) => Math.abs(numOf(i.changePct)!)), 0.01);
  return (
    <Card b={b} title={str(b.title)}>
      <div role="list">
        {items.map((it, i) => {
          const v = numOf(it.changePct)!;
          const d = dirOf(v);
          return (
            <div className="zw-ab-sector" role="listitem" key={i}>
              <span style={{ color: 'var(--ab-ink-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{str(it.label)}</span>
              <span className="zw-ab-bar" aria-hidden="true">
                <i style={{ width: `${Math.max(3, (Math.abs(v) / max) * 100)}%`, background: d === 'up' ? 'var(--ab-up-chart)' : d === 'down' ? 'var(--ab-down-chart)' : 'var(--ab-line-strong)' }} />
              </span>
              <span className="zw-num" style={{ fontWeight: 600, fontSize: 12 }}><Move value={v} text={pct(v)} /></span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function rangeBar(b: RawBlock): Rendered {
  const low = numOf(b.low), high = numOf(b.high), price = numOf(b.price);
  if (low == null || high == null || price == null || high <= low) return null;
  const at = Math.min(100, Math.max(0, ((price - low) / (high - low)) * 100));
  return (
    <Card b={b} title={str(b.label) || 'Range'}>
      <div className="zw-ab-range" role="img" aria-label={str(b.alt) || `${num(price, 2)} within ${num(low, 2)} to ${num(high, 2)}`}>
        <div className="track" />
        <div className="mark" style={{ left: `${at}%` }} />
      </div>
      <div className="zw-ab-ends zw-num">
        <span>₹{num(low, 2)}</span>
        <strong>₹{num(price, 2)}</strong>
        <span>₹{num(high, 2)}</span>
      </div>
    </Card>
  );
}

const TONE_GLYPH: Record<string, string> = { good: '▲', bad: '▼', warn: '!', neutral: '–' };
function signals(b: RawBlock): Rendered {
  const items = objs(b.items);
  if (items.length === 0) return null;
  return (
    <Card b={b} title={str(b.title)}>
      <div role="list">
        {items.map((it, i) => {
          const raw = str(it.tone);
          const tone = raw in TONE_GLYPH ? raw : 'neutral';
          const col = tone === 'good' ? 'var(--ab-up)' : tone === 'bad' ? 'var(--ab-down)' : 'var(--ab-ink-2)';
          return (
            <div className="zw-ab-signal" role="listitem" key={i}>
              <span className="glyph" aria-hidden="true" style={{ color: col }}>{TONE_GLYPH[tone]}</span>
              <span style={{ color: 'var(--ab-ink-2)' }}>{str(it.label)}</span>
              <span style={{ color: 'var(--ab-ink)' }}>
                <span style={SR}>{tone === 'good' ? 'Positive. ' : tone === 'bad' ? 'Negative. ' : tone === 'warn' ? 'Caution. ' : ''}</span>
                {str(it.value)}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function compareTable(b: RawBlock): Rendered {
  const columns = strs(b.columns);
  const rows = objs(b.rows);
  if (columns.length === 0 || rows.length === 0) return null;
  return (
    <Card b={b} title={str(b.title)}>
      <div className="zw-ab-scroll">
        <table className="zw-ab-table">
          <thead>
            <tr>
              <th scope="col" style={{ textAlign: 'left' }}><span style={SR}>Metric</span></th>
              {columns.map((c, i) => <th scope="col" key={i}>{c}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const vals = strs(r.values);
              return (
                <tr key={i}>
                  <th scope="row">{str(r.label)}</th>
                  {columns.map((_, j) => <td key={j}>{vals[j] || '—'}</td>)}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function snapshot(b: RawBlock): Rendered {
  const symbol = str(b.symbol);
  const stats = objs(b.stats);
  if (!symbol || stats.length === 0) return null;
  const name = str(b.name);
  return (
    <Card b={b}>
      <div className="zw-ab-head">
        <strong>{symbol}</strong>
        {name && name !== symbol && <span>{name}</span>}
      </div>
      <dl className="zw-ab-grid">
        {stats.map((s, i) => (
          <div className="zw-ab-cell" key={i}>
            <dt>{str(s.label)}</dt>
            <dd>{str(s.value)}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}

function newsTimeline(b: RawBlock): Rendered {
  const items = objs(b.items).filter((i) => str(i.title));
  if (items.length === 0) return null;
  return (
    <Card b={b} title={str(b.title)}>
      <ul className="zw-ab-news">
        {items.map((it, i) => {
          const url = str(it.url);
          const safe = /^https:\/\//i.test(url);
          const when = new Date(str(it.at));
          const meta = [str(it.source), Number.isNaN(when.getTime()) ? '' : new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short' }).format(when)].filter(Boolean).join(' · ');
          return (
            <li key={i}>
              {safe ? <a href={url} target="_blank" rel="noopener noreferrer nofollow">{str(it.title)}</a> : <span className="t">{str(it.title)}</span>}
              {meta && <span className="m">{meta}</span>}
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

function marketPulse(b: RawBlock): Rendered {
  const groups = objs(b.groups).map((g) => ({ label: str(g.label), items: objs(g.items) })).filter((g) => g.items.length > 0);
  if (groups.length === 0) return null;
  return (
    <Card b={b} title={str(b.title)}>
      {groups.map((g, gi) => (
        <div key={gi}>
          {g.label && <p className="zw-ab-pulse-label">{g.label}</p>}
          <dl className="zw-ab-pulse">
            {g.items.map((it, i) => {
              const ch = numOf(it.changePct);
              return (
                <div key={i}>
                  <dt>{str(it.label)}</dt>
                  <dd className="zw-num">
                    {str(it.value)}
                    {ch != null && <span style={{ display: 'block', fontSize: 11, fontWeight: 500 }}><Move value={ch} text={pct(ch)} /></span>}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      ))}
    </Card>
  );
}

/* ── line chart (server-supplied series) ──────────────────────── */

function lineChart(b: RawBlock): Rendered {
  const pts = objs(b.series).map((p) => numOf(p.v)).filter((v): v is number => v != null);
  if (pts.length < 2) return null;
  return <Sparkline b={b} values={pts} />;
}

function Sparkline({ b, values }: { b: RawBlock; values: number[] }) {
  const gid = useId();
  const W = 320, H = 96;
  const { path, area, d, first, last } = useMemo(() => {
    const min = Math.min(...values), max = Math.max(...values);
    const span = max - min || Math.max(Math.abs(max) * 0.01, 1);
    const x = (i: number) => (i / (values.length - 1)) * W;
    const y = (v: number) => H - 4 - ((v - min) / span) * (H - 8);
    const p = values.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
    return { path: p, area: `${p} L${W},${H} L0,${H} Z`, d: direction(values[values.length - 1] - values[0]), first: values[0], last: values[values.length - 1] };
  }, [values]);
  const stroke = d === 'down' ? 'var(--ab-down-chart)' : d === 'up' ? 'var(--ab-up-chart)' : 'var(--ab-ink-3)';
  const change = first ? ((last - first) / first) * 100 : 0;
  return (
    <Card b={b} title={str(b.title)}>
      <svg className="zw-ab-chart" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" role="img" aria-label={str(b.alt) || `Price trend, ${pct(change)} over the period`}>
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={stroke} stopOpacity=".16" />
            <stop offset="100%" stopColor={stroke} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill={`url(#${gid})`} />
        <path d={path} fill="none" stroke={stroke} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="zw-ab-ends zw-num" style={{ marginTop: 4 }}>
        <span>₹{num(first, 2)}</span>
        <strong><Move value={change} text={`${pct(change)} over period`} /></strong>
        <span>₹{num(last, 2)}</span>
      </div>
    </Card>
  );
}

/* ── suggestions + actions (interactive) ──────────────────────── */

function suggestions(b: RawBlock, ctx: BlockCtx): Rendered {
  const items = objs(b.items).filter((i) => str(i.q));
  if (items.length === 0) return HIDDEN;
  return (
    <div className="zw-ab-chips" role="group" aria-label="Suggested follow-up questions">
      {items.map((it, i) => (
        <button key={i} type="button" className="zw-chip" onClick={() => ctx.onAsk(str(it.q), str(it.symbol) || undefined)}>
          {str(it.q)}
        </button>
      ))}
    </div>
  );
}

function actions(b: RawBlock, ctx: BlockCtx): Rendered {
  const items = objs(b.items).filter((a) => str(a.label) && validAction(a, ctx.allowed));
  if (items.length === 0) return HIDDEN;
  return <ActionRow items={items} ctx={ctx} />;
}

function ActionRow({ items, ctx }: { items: RawBlock[]; ctx: BlockCtx }) {
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [alertFor, setAlertFor] = useState<string | null>(null);

  const run = async (id: string, intent: Intent, params: Record<string, unknown>) => {
    setBusy(id);
    try {
      setStatus(await ctx.onIntent(intent, params));
    } catch {
      setStatus('That did not work. Try again in a moment.');
    } finally {
      setBusy(null);
      setAlertFor(null);
    }
  };

  return (
    <div>
      <div className="zw-ab-actions" role="group" aria-label="Actions">
        {items.map((a, i) => {
          const id = str(a.id) || `a${i}`;
          const intent = str(a.intent) as Intent;
          const params = isObj(a.params) ? a.params : {};
          return (
            <button
              key={id}
              type="button"
              className="zw-chip"
              disabled={busy !== null}
              aria-expanded={intent === 'alert.create' ? alertFor === id : undefined}
              onClick={() => (intent === 'alert.create' ? setAlertFor(alertFor === id ? null : id) : run(id, intent, params))}
            >
              {str(a.label)}
            </button>
          );
        })}
      </div>
      {items.map((a, i) => {
        const id = str(a.id) || `a${i}`;
        return alertFor === id ? (
          <AlertForm key={id} params={isObj(a.params) ? a.params : {}} busy={busy === id} onConfirm={(p) => run(id, 'alert.create', p)} onCancel={() => setAlertFor(null)} />
        ) : null;
      })}
      {status && <p className="zw-ab-status" role="status">{status}</p>}
    </div>
  );
}

/** Alerts fire real notifications, so the user confirms the level rather than one tap creating it. */
function AlertForm({ params, busy, onConfirm, onCancel }: { params: Record<string, unknown>; busy: boolean; onConfirm: (p: Record<string, unknown>) => void; onCancel: () => void }) {
  const symbol = str(params.symbol);
  const [price, setPrice] = useState(numOf(params.price) != null ? String(params.price) : '');
  const [cond, setCond] = useState<'above' | 'below'>(str(params.condition) === 'below' ? 'below' : 'above');
  const id = useId();
  const value = Number(price);
  const ok = price.trim() !== '' && Number.isFinite(value) && value > 0;
  return (
    <form className="zw-ab-alert" onSubmit={(e) => { e.preventDefault(); if (ok) onConfirm({ symbol, price: value, condition: cond }); }}>
      <label htmlFor={`${id}-c`}>Alert when {symbol} goes</label>
      <select id={`${id}-c`} value={cond} onChange={(e) => setCond(e.target.value === 'below' ? 'below' : 'above')}>
        <option value="above">above</option>
        <option value="below">below</option>
      </select>
      <label htmlFor={`${id}-p`} style={SR}>Target price in rupees</label>
      <span aria-hidden="true">₹</span>
      <input id={`${id}-p`} inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" style={{ fontSize: 16 }} />
      <button type="submit" className="zw-chip" disabled={!ok || busy}>Create alert</button>
      <button type="button" className="zw-chip" onClick={onCancel}>Cancel</button>
    </form>
  );
}

/* ── dispatcher ───────────────────────────────────────────────── */

type Renderer = (b: RawBlock, ctx: BlockCtx) => Rendered;

/** Each entry returns HIDDEN (nothing to show on purpose), null (can't draw → alt text) or a node. */
export const RENDERERS: Record<string, Renderer> = {
  text, stat, line_chart: lineChart, table, kpi, sector_perf: sectorPerf, range_bar: rangeBar,
  signals, compare_table: compareTable, snapshot, news_timeline: newsTimeline,
  market_pulse: marketPulse, notice, actions, suggestions, disclaimer,
};

