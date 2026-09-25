import { num } from '@/lib/format/number';
import LivePrice from './LivePrice';
import { StockLogo } from './StockCell';

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
    <header className="zw-panel zw-pricehead">
      <div className="id">
        <StockLogo symbol={symbol} size={56} />
        <div style={{ minWidth: 0 }}>
          <h1 className="zw-title">{companyName}</h1>
          <p className="zw-sub">
            <span className="tag">{symbol}</span>
            <span className="tag">NSE</span>
            {sector && <span>{sector}</span>}
          </p>
        </div>
      </div>

      <LivePrice
        symbol={symbol}
        initialPrice={lastPrice}
        initialChange={change}
        initialPChange={pChange}
      />

      <div className="ranges">
        <RangeBar label="Day range" low={dayLow} high={dayHigh} current={lastPrice} />
        {yearLow != null && yearHigh != null && yearHigh > 0 && (
          <RangeBar label="52-week range" low={yearLow} high={yearHigh} current={lastPrice} />
        )}
      </div>
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
    <div className="zw-range">
      <div className="lbl">
        <span className="zw-colhead">{label}</span>
      </div>
      <span
        className="track"
        style={{ ['--pos' as string]: `${position}%` }}
        role="img"
        aria-label={`${label}: ${num(low, 2)} to ${num(high, 2)}, currently ${num(current, 2)}`}
      >
        <span className="dot" style={{ left: `${position}%` }} />
      </span>
      <div className="ends">
        <span className="zw-num">{num(low, 2)}</span>
        <span className="zw-num">{num(high, 2)}</span>
      </div>
    </div>
  );
}
