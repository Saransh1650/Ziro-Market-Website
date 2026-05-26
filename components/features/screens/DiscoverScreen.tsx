const MOVERS = [
  { sym: 'ZOMATO',    cap: 'LC', price: '234.80', chg:  8.40, vol: '↑ 4.2x' },
  { sym: 'ADANIGRN',  cap: 'LC', price: '1,820',  chg:  5.60, vol: '↑ 2.8x' },
  { sym: 'TATASTEEL', cap: 'LC', price: '158.30', chg: -4.20, vol: '↑ 3.1x' },
  { sym: 'IRCTC',     cap: 'MC', price: '892.50', chg:  6.80, vol: '↑ 5.6x' },
  { sym: 'DEEPAKNTR', cap: 'MC', price: '2,480',  chg:  9.20, vol: '↑ 8.3x' },
];

export default function DiscoverScreen() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 4 }}>
        <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#EDEDED', letterSpacing: '0.06em' }}>DISCOVER</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#22C55E' }} />
          <span style={{ fontSize: '0.42rem', color: '#22C55E', fontFamily: 'var(--mono)' }}>LIVE</span>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 5 }}>
        {['Top Movers', 'Volume Surge', '52W High'].map((f, i) => (
          <span key={f} style={{
            fontSize: '0.38rem', fontFamily: 'var(--mono)', padding: '3px 7px', borderRadius: 3,
            background: i === 0 ? 'rgba(224,168,76,0.15)' : '#111',
            color: i === 0 ? '#e0a84c' : '#505050',
            border: i === 0 ? '1px solid rgba(224,168,76,0.3)' : '1px solid #1A1A1A',
          }}>{f}</span>
        ))}
      </div>

      {/* Cap filter */}
      <div style={{ fontSize: '0.38rem', color: '#505050', fontFamily: 'var(--mono)', letterSpacing: '0.08em' }}>
        LARGE CAP · MID CAP · SMALL CAP
      </div>

      {/* Stock rows */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {MOVERS.map((r, i) => (
          <div key={r.sym} style={{
            display: 'flex', alignItems: 'center',
            padding: '7px 0',
            borderTop: i > 0 ? '1px solid #141414' : 'none',
            gap: 6,
          }}>
            {/* Cap badge + symbol */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 2 }}>
                <span style={{
                  fontSize: '0.36rem', fontFamily: 'var(--mono)', padding: '1px 4px',
                  borderRadius: 3, background: '#1A1A1A', color: '#606060',
                }}>{r.cap}</span>
                <span style={{ fontSize: '0.55rem', fontWeight: 800, color: '#EDEDED' }}>{r.sym}</span>
              </div>
              <span style={{
                fontSize: '0.38rem', fontFamily: 'var(--mono)',
                color: '#22C55E', background: 'rgba(34,197,94,0.08)',
                padding: '1px 4px', borderRadius: 3,
              }}>{r.vol}</span>
            </div>
            {/* Price + change */}
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.55rem', fontWeight: 700, color: '#EDEDED', fontFamily: 'var(--mono)' }}>₹{r.price}</div>
              <div style={{
                fontSize: '0.42rem', fontFamily: 'var(--mono)', fontWeight: 700,
                color: r.chg >= 0 ? '#22C55E' : '#EF4444',
              }}>{r.chg >= 0 ? '+' : ''}{r.chg.toFixed(2)}%</div>
            </div>
          </div>
        ))}
      </div>

      {/* Index browse */}
      <div style={{
        background: '#111', border: '1px solid #1F1F1F', borderRadius: 7,
        padding: '7px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{ fontSize: '0.38rem', color: '#505050', fontFamily: 'var(--mono)' }}>BROWSE BY INDEX</span>
        <div style={{ display: 'flex', gap: 5 }}>
          {['NIFTY 50', 'NEXT 50', 'BANK'].map(idx => (
            <span key={idx} style={{
              fontSize: '0.36rem', fontFamily: 'var(--mono)', color: '#808080',
              background: '#1A1A1A', padding: '2px 5px', borderRadius: 3,
            }}>{idx}</span>
          ))}
        </div>
      </div>

      <div style={{ paddingBottom: 6 }} />
    </div>
  );
}
