const ROWS = [
  { sym: 'RELIANCE',   price: '2,914', chg:  2.40, path: 'M0 18 L14 12 L28 15 L42 8 L56 5' },
  { sym: 'TCS',        price: '4,082', chg:  3.10, path: 'M0 16 L14 10 L28 13 L42 6 L56 3'  },
  { sym: 'HDFCBANK',   price: '1,612', chg:  1.20, path: 'M0 20 L14 16 L28 18 L42 11 L56 8' },
  { sym: 'INFY',       price: '1,742', chg: -0.80, path: 'M0 3 L14 8 L28 5 L42 13 L56 17'   },
  { sym: 'BAJFINANCE', price: '6,920', chg:  4.70, path: 'M0 20 L14 13 L28 16 L42 7 L56 2'  },
  { sym: 'ITC',        price:   '436', chg:  0.50, path: 'M0 14 L14 11 L28 13 L42 8 L56 7'  },
];

export default function WatchlistScreen() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ paddingTop: 4, marginBottom: 6 }}>
        <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#EDEDED', letterSpacing: '0.06em' }}>WATCHLIST</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {['LONG-TERM', 'SWING', 'F&O'].map((l, i) => (
              <span key={l} style={{
                fontSize: '0.38rem', fontFamily: 'var(--mono)', padding: '2px 6px', borderRadius: 3,
                background: i === 0 ? 'rgba(245,158,11,0.15)' : '#111',
                color: i === 0 ? 'var(--amber)' : '#505050',
                border: i === 0 ? '1px solid rgba(245,158,11,0.3)' : '1px solid #1A1A1A',
              }}>{l}</span>
            ))}
          </div>
          <span style={{ fontSize: '0.38rem', color: '#505050', fontFamily: 'var(--mono)' }}>6 stocks</span>
        </div>
      </div>

      {/* Ticker rows */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {ROWS.map((r, i) => (
          <div key={r.sym} style={{
            display: 'flex', alignItems: 'center',
            padding: '7px 0',
            borderTop: i > 0 ? '1px solid #141414' : 'none',
            gap: 6,
          }}>
            {/* Symbol + change badge */}
            <div style={{ flex: '0 0 80px' }}>
              <div style={{ fontSize: '0.55rem', fontWeight: 800, color: '#EDEDED' }}>{r.sym}</div>
              <div style={{
                display: 'inline-block', marginTop: 2,
                fontSize: '0.38rem', fontFamily: 'var(--mono)', fontWeight: 700,
                padding: '1px 4px', borderRadius: 3,
                background: r.chg >= 0 ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                color: r.chg >= 0 ? '#22C55E' : '#EF4444',
              }}>
                {r.chg >= 0 ? '+' : ''}{r.chg.toFixed(2)}%
              </div>
            </div>

            {/* Sparkline */}
            <svg width="56" height="22" viewBox="0 0 56 22" style={{ flex: '0 0 56px' }}>
              <path d={r.path} fill="none" stroke={r.chg >= 0 ? '#22C55E' : '#EF4444'} strokeWidth="1.5" />
            </svg>

            {/* Price */}
            <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
              <div style={{ fontSize: '0.58rem', fontWeight: 700, color: '#EDEDED', fontFamily: 'var(--mono)' }}>₹{r.price}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ paddingBottom: 6 }} />
    </div>
  );
}
