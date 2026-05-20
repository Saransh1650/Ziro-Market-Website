const ROWS = [
  { sym: 'RELIANCE',  price: '2,914.20', chg:  2.40 },
  { sym: 'TCS',       price: '4,082.15', chg:  3.10 },
  { sym: 'HDFCBANK',  price: '1,612.40', chg:  1.20 },
  { sym: 'INFY',      price: '1,742.65', chg: -0.80 },
  { sym: 'BAJFINANCE',price: '6,920.00', chg:  4.70 },
  { sym: 'ITC',       price:   '436.85', chg:  0.50 },
];

export default function WatchlistRows() {
  return (
    <div style={{ background: 'var(--bg-1)', border: '1px solid var(--border-1)', borderRadius: 8, overflow: 'hidden' }}>
      <div className="caption" style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-1)', display: 'flex', justifyContent: 'space-between' }}>
        <span>WATCHLIST · LONG-TERM</span><span>6 stocks · live</span>
      </div>
      {ROWS.map((r, i) => (
        <div key={r.sym} style={{
          display: 'grid', gridTemplateColumns: '110px 1fr 90px 90px',
          alignItems: 'center', padding: '14px 16px',
          borderTop: i === 0 ? 'none' : '1px solid var(--border-1)',
        }}>
          <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>{r.sym}</span>
          <Spark up={r.chg >= 0} />
          <span className="mono" style={{ fontSize: '0.82rem', textAlign: 'right' }}>₹{r.price}</span>
          <span className={`mono ${r.chg >= 0 ? 'up' : 'down'}`} style={{ fontSize: '0.78rem', fontWeight: 700, textAlign: 'right' }}>
            {r.chg >= 0 ? '+' : ''}{r.chg.toFixed(2)}%
          </span>
        </div>
      ))}
    </div>
  );
}

function Spark({ up }: { up: boolean }) {
  const path = up
    ? 'M0 18 L10 14 L20 16 L30 10 L40 12 L50 6 L60 8 L70 3'
    : 'M0 3 L10 7 L20 5 L30 11 L40 9 L50 14 L60 12 L70 18';
  return (
    <svg width="80" height="22" viewBox="0 0 70 22" style={{ marginLeft: 14 }}>
      <path d={path} fill="none" stroke={up ? 'var(--positive)' : 'var(--negative)'} strokeWidth="1.5" />
    </svg>
  );
}
