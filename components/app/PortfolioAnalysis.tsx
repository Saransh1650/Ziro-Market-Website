'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { useResource } from '@/hooks/useResource';
import {
  getHoldings, getRisk, getCorrelation, getNavCurve,
  type Holding, type PortfolioRisk, type PortfolioCorrelation, type NavCurve,
} from '@/lib/api/portfolio';
import { num, pct, direction } from '@/lib/format/number';
import SignedOut from './SignedOut';

/**
 * Risk, correlation and the NAV curve.
 *
 * Views of one portfolio rather than separate destinations, so they are
 * tabs on a single surface — the mobile app's seven screens collapse
 * here.
 */

type ViewId = 'risk' | 'correlation' | 'nav';

const VIEWS: Array<[ViewId, string]> = [
  ['risk', 'Risk'],
  ['correlation', 'Correlation'],
  ['nav', 'NAV curve'],
];

export default function PortfolioAnalysis() {
  const { user, loading: authLoading } = useAuth();
  const userId = user?.id ?? null;
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const requested = params.get('view') as ViewId | null;
  const view: ViewId = VIEWS.some(([id]) => id === requested) ? requested! : 'risk';

  const setView = (next: ViewId) => {
    const q = new URLSearchParams(params.toString());
    if (next === 'risk') q.delete('view');
    else q.set('view', next);
    const qs = q.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const holdingsResource = useResource<Holding[]>(
    (signal) => (userId ? getHoldings({ userId, signal }) : Promise.resolve({ ok: true as const, data: [] as Holding[] })),
    { deps: [userId], live: false },
  );

  const holdings = useMemo(() => holdingsResource.data ?? [], [holdingsResource.data]);
  // Only equities carry a tradeable symbol; funds are excluded from the
  // symbol-based analyses rather than sent as invalid tickers.
  const symbols = useMemo(
    () => holdings.filter((h) => (h.asset_type ?? 'stock') === 'stock' && h.symbol).map((h) => h.symbol),
    [holdings],
  );

  if (authLoading || holdingsResource.loading) return <div style={{ height: 320 }} aria-hidden="true" />;
  if (!user) {
    return <SignedOut title="Sign in to analyse your portfolio" detail="Risk, correlation and performance against Nifty." next="/app/portfolio/analysis" />;
  }

  return (
    <div className="zw-page">
      <header className="zw-head">
        <h1 className="zw-title">Portfolio analysis</h1>
        <Link href="/app/portfolio" className="zw-sub">Back to holdings</Link>
      </header>

      {symbols.length < 2 ? (
        // Not an error. Beta, correlation and volatility are undefined or
        // meaningless below two positions, so the surface says why
        // instead of rendering confident nonsense.
        <p className="zw-sub" style={{ color: 'var(--ink-3)', maxWidth: '60ch' }}>
          Analysis needs at least two equity holdings. Correlation compares positions against each other, and beta and
          volatility are not meaningful for a single stock.
        </p>
      ) : (
        <>
          <div role="tablist" aria-label="Analysis views" style={{ display: 'flex', gap: 'var(--s-4)', borderBottom: '1px solid var(--line)' }}>
            {VIEWS.map(([id, label]) => (
              <button
                key={id} type="button" role="tab" aria-selected={view === id} onClick={() => setView(id)}
                style={{
                  background: 'none', border: 0, padding: '8px 0', cursor: 'pointer', fontSize: 12, fontWeight: 600,
                  color: view === id ? 'var(--ink)' : 'var(--ink-3)',
                  borderBottom: `2px solid ${view === id ? 'var(--ink)' : 'transparent'}`, marginBottom: -1,
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <div role="tabpanel" style={{ paddingTop: 'var(--s-4)' }}>
            {view === 'risk' && <RiskPanel symbols={symbols} holdings={holdings} />}
            {view === 'correlation' && <CorrelationPanel symbols={symbols} />}
            {view === 'nav' && <NavPanel holdings={holdings} />}
          </div>
        </>
      )}
    </div>
  );
}

/* ── Risk ─────────────────────────────────────────────────────── */

function RiskPanel({ symbols, holdings }: { symbols: string[]; holdings: Holding[] }) {
  const { data, loading, error, refetch } = useResource<PortfolioRisk>(
    (signal) => getRisk(symbols, holdings, signal),
    { deps: [symbols.join(','), holdings.length], live: false },
  );

  if (loading) return <Loading label="Measuring risk across a year of prices…" />;
  if (error || !data) return <Failed message={error?.message ?? 'Risk could not be measured.'} onRetry={refetch} />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-5)' }}>
      <dl style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--s-6)', margin: 0 }}>
        <Metric label="Portfolio beta" value={num(data.portfolioBeta, 2)} note="vs Nifty 50, 1 year" />
        <Metric label="Volatility" value={`${num(data.portfolioVolatility, 1)}%`} note="annualised, 1 year" />
        <Metric label="Sharpe ratio" value={num(data.sharpeRatio, 2)} note="1 year" />
      </dl>

      {data.stressTest && (
        <section>
          <h2 className="zw-section" style={{ paddingBottom: 'var(--s-2)' }}>If the Nifty fell</h2>
          <dl style={{ display: 'flex', gap: 'var(--s-6)', margin: 0 }}>
            <Metric label="Nifty −10%" value={`${num(data.stressTest.niftyDrop10Pct, 1)}%`} note="estimated portfolio move" />
            <Metric label="Nifty −20%" value={`${num(data.stressTest.niftyDrop20Pct, 1)}%`} note="estimated portfolio move" />
          </dl>
        </section>
      )}

      <section>
        <h2 className="zw-section" style={{ paddingBottom: 'var(--s-2)' }}>By holding</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <caption className="zw-sr">Risk by holding</caption>
          <thead>
            <tr>
              <th scope="col" className="zw-colhead" style={{ textAlign: 'left', paddingBottom: 6 }}>Stock</th>
              <th scope="col" className="zw-colhead" style={{ textAlign: 'right', paddingBottom: 6 }}>Beta</th>
              <th scope="col" className="zw-colhead" style={{ textAlign: 'right', paddingBottom: 6 }}>Volatility</th>
              <th scope="col" className="zw-colhead" style={{ textAlign: 'right', paddingBottom: 6 }}>Max drawdown</th>
            </tr>
          </thead>
          <tbody>
            {(data.stockRisk ?? []).map((r) => (
              <tr key={r.symbol} style={{ borderTop: '1px solid var(--line)' }}>
                <th scope="row" style={{ textAlign: 'left', padding: '7px 0', fontWeight: 400 }}>
                  <Link href={`/stocks/${encodeURIComponent(r.symbol)}`} className="zw-sym" style={{ color: 'var(--ink)' }}>{r.symbol}</Link>
                </th>
                <td className="zw-num" style={{ textAlign: 'right', padding: '7px 0', fontSize: 12 }}>{num(r.beta, 2)}</td>
                <td className="zw-num" style={{ textAlign: 'right', padding: '7px 0', fontSize: 12 }}>{num(r.volatility, 1)}%</td>
                <td className="zw-num" style={{ textAlign: 'right', padding: '7px 0', fontSize: 12 }}>{num(r.maxDrawdown, 1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

/* ── Correlation ──────────────────────────────────────────────── */

function CorrelationPanel({ symbols }: { symbols: string[] }) {
  const { data, loading, error, refetch } = useResource<PortfolioCorrelation>(
    (signal) => getCorrelation(symbols, '1Y', signal),
    { deps: [symbols.join(',')], live: false },
  );

  if (loading) return <Loading label="Comparing a year of returns…" />;
  if (error || !data?.matrix?.length) return <Failed message={error?.message ?? 'Correlation could not be computed.'} onRetry={refetch} />;

  const labels = data.symbols ?? symbols;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-3)' }}>
      <p className="zw-sub" style={{ maxWidth: '68ch' }}>
        How closely each pair has moved together over the past year. 1.0 is lockstep, 0 is unrelated, negative means they
        tend to move opposite ways — which is what actually diversifies a portfolio.
      </p>

      <div className="zw-scroll-x">
        <table style={{ borderCollapse: 'collapse' }}>
          <caption className="zw-sr">Correlation matrix</caption>
          <thead>
            <tr>
              <th scope="col" className="zw-colhead" style={{ padding: '0 6px 6px 0' }} />
              {labels.map((s) => (
                <th key={s} scope="col" className="zw-colhead" style={{ padding: '0 6px 6px', textAlign: 'center' }}>{s}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.matrix.map((row, i) => (
              <tr key={labels[i] ?? i}>
                <th scope="row" className="zw-sym" style={{ textAlign: 'left', padding: '0 8px 0 0', whiteSpace: 'nowrap' }}>
                  {labels[i]}
                </th>
                {row.map((v, j) => (
                  <td
                    key={j}
                    title={`${labels[i]} vs ${labels[j]}: ${num(v, 2)}`}
                    style={{
                      width: 56, height: 34, textAlign: 'center', fontSize: 11,
                      fontFamily: 'var(--mono)', border: '1px solid var(--surface)',
                      background: divergingFill(v),
                      color: Math.abs(v) > 0.6 ? 'var(--tint-ink-strong)' : 'var(--ink)',
                    }}
                  >
                    {num(v, 2)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * Diverging scale, blue through neutral to warm.
 *
 * Correlation has a meaningful midpoint at 0, so a sequential ramp would
 * hide the sign. Deliberately **not** the positive/negative pair: this
 * is not direction, and green/red here would be read as profit and loss.
 */
function divergingFill(v: number): string {
  const a = Math.min(1, Math.abs(v));
  if (a < 0.08) return 'var(--surface-hover)';
  const alpha = 0.12 + a * 0.68;
  return v > 0 ? `rgba(155, 104, 16, ${alpha})` : `rgba(49, 102, 138, ${alpha})`;
}

/* ── NAV curve ────────────────────────────────────────────────── */

function NavPanel({ holdings }: { holdings: Holding[] }) {
  const { data, loading, error, refetch } = useResource<NavCurve>(
    (signal) => getNavCurve(holdings, '1Y', signal),
    { deps: [holdings.length], live: false },
  );

  if (loading) return <Loading label="Rebuilding a year of portfolio value…" />;
  if (error || !data?.portfolioNav?.length) return <Failed message={error?.message ?? 'The NAV curve could not be built.'} onRetry={refetch} />;

  const series = [
    { name: 'Portfolio', values: data.portfolioNav, colour: 'var(--ink)', width: 1.8 },
    { name: 'Nifty 50', values: data.benchmarkNav, colour: 'var(--ink)', width: 1.3 },
    { name: 'Invested', values: data.investedLine, colour: 'var(--ink-3)', width: 1 },
  ].filter((s) => s.values?.length);

  const all = series.flatMap((s) => s.values);
  const lo = Math.min(...all);
  const hi = Math.max(...all);
  const span = hi - lo || 1;

  const W = 1000;
  const H = 300;
  const path = (values: number[]) =>
    values
      .map((v, i) => `${i === 0 ? 'M' : 'L'}${((i / Math.max(1, values.length - 1)) * W).toFixed(2)},${(H - ((v - lo) / span) * H).toFixed(2)}`)
      .join(' ');

  const last = (values: number[]) => values[values.length - 1];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-3)' }}>
      <p className="zw-sub" style={{ maxWidth: '68ch' }}>
        Everything rebased to 100 at the start of the year, so the lines answer which grew faster rather than which
        started larger.
      </p>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        width="100%"
        height={300}
        role="img"
        aria-label={series.map((s) => `${s.name} ended at ${num(last(s.values), 1)}`).join('. ')}
        style={{ display: 'block' }}
      >
        {series.map((s) => (
          <path
            key={s.name}
            d={path(s.values)}
            fill="none"
            stroke={s.colour}
            strokeWidth={s.width}
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            strokeDasharray={s.name === 'Invested' ? '4 4' : undefined}
          />
        ))}
      </svg>

      {/* The legend carries each line's return, so it is also the
          summary table. */}
      <ul style={{ listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: 'var(--s-5)', padding: 0, margin: 0 }}>
        {series.map((s) => {
          const change = last(s.values) - s.values[0];
          return (
            <li key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span aria-hidden="true" style={{ width: 14, height: 2, background: s.colour }} />
              <span className="zw-sub">{s.name}</span>
              <span className="zw-num" style={{ fontSize: 11, color: `var(--${direction(change) === 'down' ? 'negative' : direction(change) === 'up' ? 'positive' : 'flat'})` }}>
                {pct((change / (s.values[0] || 1)) * 100)}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ── Shared ───────────────────────────────────────────────────── */

function Metric({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <dt className="zw-colhead">{label}</dt>
      <dd className="zw-num-lg" style={{ margin: 0 }}>{value}</dd>
      {/* Every metric names its lookback. A Sharpe ratio with no period
          is not a number anyone can act on. */}
      {note && <p className="zw-sub" style={{ color: 'var(--ink-3)' }}>{note}</p>}
    </div>
  );
}

function Loading({ label }: { label: string }) {
  return <p className="zw-sub" style={{ color: 'var(--ink-3)', padding: 'var(--s-4) 0' }}>{label}</p>;
}

function Failed({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div role="alert" style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-3)', padding: 'var(--s-4) 0' }}>
      <p className="zw-sub">{message}</p>
      <button type="button" className="zw-chip" onClick={onRetry}>Try again</button>
    </div>
  );
}
