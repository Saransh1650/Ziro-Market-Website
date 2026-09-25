import { Money } from './Delta';
import { num, compact } from '@/lib/format/number';
import type { StockDetail } from '@/lib/api/types';

/**
 * Fundamentals as a ruled definition list, always visible.
 *
 * The mobile app hides these behind an INFO tab. On a 1440px screen
 * there is no reason to — the chart and the numbers fit side by side,
 * and reading one against the other is the point.
 */
export default function StatGrid({ detail }: { detail: StockDetail }) {
  const f = detail.fundamentals;

  const rows: Array<[string, React.ReactNode]> = [
    ['Open', <Money key="o" value={detail.open} currency={false} />],
    ['Previous close', <Money key="p" value={detail.previousClose} currency={false} />],
    ['Day high', <Money key="h" value={detail.dayHigh} currency={false} />],
    ['Day low', <Money key="l" value={detail.dayLow} currency={false} />],
    ['Volume', <span key="v" className="zw-num">{detail.volume ? num(detail.volume, 0) : '—'}</span>],
    // The top-level `marketCap` string is formatted in trillions and
    // billions by the backend. The numeric one gets crore scaling.
    ['Market cap', <span key="mc" className="zw-num" title={f.marketCap ? `₹${num(f.marketCap, 0)}` : undefined}>{f.marketCap ? compact(f.marketCap) : '—'}</span>],
    ['P/E', <Stat key="pe" value={f.pe} />],
    ['Industry P/E', <Stat key="ipe" value={f.industryPe} />],
    ['P/B', <Stat key="pb" value={f.pb} />],
    ['EPS', <Stat key="eps" value={f.eps} />],
    ['Book value', <Stat key="bv" value={f.bookValue} />],
    ['Dividend yield', <Stat key="dy" value={f.divYield} suffix="%" />],
    ['ROE', <Stat key="roe" value={f.roe} suffix="%" />],
    ['Debt / equity', <Stat key="de" value={f.debtToEquity} />],
    ['Face value', <Stat key="fv" value={f.faceValue} />],
    ['52-week high', <Money key="yh" value={detail.yearHigh} currency={false} />],
    ['52-week low', <Money key="yl" value={detail.yearLow} currency={false} />],
  ];

  return (
    <section aria-label="Key statistics">
      <header className="zw-panel-head">
        <h2 className="zw-section">Key statistics</h2>
      </header>
      <dl className="zw-statgrid">
        {rows.map(([label, value]) => (
          <div key={label} className="zw-statrow">
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/**
 * A fundamental. Zero means "not reported" for every one of these — a
 * P/E of 0.00 or a face value of 0.00 is never a real figure — so it
 * renders as a dash rather than a number nobody should act on.
 */
function Stat({ value, suffix = '' }: { value: number | null | undefined; suffix?: string }) {
  if (value == null || !Number.isFinite(value) || value === 0) {
    return <span className="zw-muted">—</span>;
  }
  return <span className="zw-num">{num(value, 2)}{suffix}</span>;
}
