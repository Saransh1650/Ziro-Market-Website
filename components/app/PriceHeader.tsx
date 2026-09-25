import { num } from '@/lib/format/number';
import LivePrice from './LivePrice';

/**
 * Symbol, name, price, change, and the day's range with the current
 * price marked on it.
 *
 * Server-rendered: the numbers here are the ones a crawler should see.
 * `LivePrice` swaps in the live figure on the client.
 */
export default function PriceHeader({
  symbol,
  companyName,
  sector,
  lastPrice,
  change,
  pChange,
  dayLow,
  dayHigh,
  yearLow,
  yearHigh,
}: {
  symbol: string;
  companyName: string;
  sector?: string;
  lastPrice: number;
  change: number;
  pChange: number;
  dayLow: number;
  dayHigh: number;
  yearLow?: number;
  yearHigh?: number;
}) {
  return (
    <header style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-2)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--s-3)', flexWrap: 'wrap' }}>
        <div style={{ minWidth: 0 }}>
          <h1 style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--s-2)', flexWrap: 'wrap' }}>
            <span className="zw-title">{companyName}</span>
            <span className="zw-num" style={{ fontSize: 13, color: 'var(--text-3)' }}>{symbol}</span>
          </h1>
          {sector && (
            <p className="zw-sub" style={{ marginTop: 2 }}>
              NSE · {sector}
            </p>
          )}
        </div>

        <div style={{ marginLeft: 'auto' }}>
          <LivePrice
            symbol={symbol}
            initialPrice={lastPrice}
            initialChange={change}
            initialPChange={pChange}
          />
        </div>
      </div>

      <RangeBar
        label="Day range"
        low={dayLow}
        high={dayHigh}
        current={lastPrice}
      />
      {yearLow != null && yearHigh != null && yearHigh > 0 && (
        <RangeBar label="52-week range" low={yearLow} high={yearHigh} current={lastPrice} />
      )}
    </header>
  );
}

/**
 * Where the price sits between the low and the high.
 *
 * The position is the information — "near the top of its day" is a fact
 * two bare numbers make you compute yourself.
 */
function RangeBar({
  label,
  low,
  high,
  current,
}: {
  label: string;
  low: number;
  high: number;
  current: number;
}) {
  const span = high - low;
  // A zero span means the instrument hasn't moved, or the data is
  // missing. Either way the marker goes in the middle rather than
  // dividing by zero.
  const position = span > 0 ? Math.min(100, Math.max(0, ((current - low) / span) * 100)) : 50;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-3)', maxWidth: 520 }}>
      <span className="zw-colhead" style={{ width: 96, flexShrink: 0 }}>{label}</span>
      <span className="zw-num" style={{ fontSize: 11, color: 'var(--text-2)', width: 68, textAlign: 'right' }}>
        {num(low, 2)}
      </span>
      <span
        style={{ position: 'relative', flex: 1, height: 3, background: 'var(--bg-3)', borderRadius: 2 }}
        role="img"
        aria-label={`${label}: ${num(low, 2)} to ${num(high, 2)}, currently ${num(current, 2)}`}
      >
        <span
          style={{
            position: 'absolute',
            left: `${position}%`,
            top: -3,
            width: 2,
            height: 9,
            background: 'var(--text-1)',
            transform: 'translateX(-1px)',
          }}
        />
      </span>
      <span className="zw-num" style={{ fontSize: 11, color: 'var(--text-2)', width: 68 }}>
        {num(high, 2)}
      </span>
    </div>
  );
}
