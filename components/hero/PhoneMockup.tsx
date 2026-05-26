export default function PhoneMockup() {
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {/* Subtle glow behind phone — blends with cream background */}
      <div aria-hidden style={{
        position: 'absolute', inset: '-24px',
        borderRadius: 60,
        background: 'radial-gradient(ellipse at 50% 60%, rgba(11,59,46,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Phone shell */}
      <div style={{
        width: 248, height: 506,
        background: '#0C0C0C',
        border: '1.5px solid #252525',
        borderRadius: 42,
        padding: '14px 10px 10px',
        position: 'relative',
        boxShadow: '0 32px 72px rgba(11,59,46,0.18), 0 8px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.04)',
        overflow: 'hidden',
      }}>
        {/* Dynamic island */}
        <div style={{
          width: 82, height: 23, background: '#000',
          borderRadius: 13, margin: '0 auto 10px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#1A1A1A' }} />
          <div style={{ width: 15, height: 6, borderRadius: 3, background: '#1A1A1A' }} />
        </div>

        {/* Screen */}
        <div style={{ background: '#080808', borderRadius: 28, height: 'calc(100% - 38px)', overflow: 'hidden', padding: '12px 10px 8px' }}>

          {/* Status bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, padding: '0 2px' }}>
            <span style={{ fontSize: '0.52rem', fontFamily: 'var(--mono)', color: '#555', fontWeight: 600 }}>9:41</span>
            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              {[3,4,5,6].map(h => (
                <div key={h} style={{ width: 2, height: h, background: '#555', borderRadius: 1 }} />
              ))}
              <div style={{ width: 10, height: 5, border: '1px solid #555', borderRadius: 2, marginLeft: 2, position: 'relative' }}>
                <div style={{ position: 'absolute', left: 1, top: 1, bottom: 1, width: '70%', background: '#22C55E', borderRadius: 1 }} />
              </div>
            </div>
          </div>

          {/* App header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.12em', color: '#EDEDED', fontFamily: 'var(--mono)' }}>ZIRO</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#22C55E' }} />
              <span style={{ fontSize: '0.44rem', color: '#22C55E', fontFamily: 'var(--mono)', letterSpacing: '0.08em' }}>LIVE</span>
            </div>
          </div>

          {/* Portfolio card */}
          <div style={{
            background: '#101410', border: '1px solid #1A2A1A',
            borderRadius: 12, padding: '11px 10px 9px', marginBottom: 10,
          }}>
            <div style={{ fontSize: '0.44rem', color: '#606060', marginBottom: 4, fontFamily: 'var(--mono)', letterSpacing: '0.06em' }}>PORTFOLIO VALUE</div>
            <div style={{ fontSize: '1.18rem', fontWeight: 900, letterSpacing: '-0.03em', color: '#EDEDED', lineHeight: 1 }}>₹4,28,350</div>
            <div style={{ display: 'flex', gap: 6, marginTop: 5, alignItems: 'center' }}>
              <span style={{ fontSize: '0.48rem', color: '#22C55E', fontFamily: 'var(--mono)', fontWeight: 700 }}>+₹6,240</span>
              <span style={{ fontSize: '0.44rem', color: '#22C55E', background: 'rgba(34,197,94,0.12)', padding: '1px 4px', borderRadius: 3, fontFamily: 'var(--mono)' }}>+1.48%</span>
              <span style={{ fontSize: '0.4rem', color: '#555', marginLeft: 'auto' }}>today</span>
            </div>
            <svg width="100%" height="28" style={{ marginTop: 8 }} viewBox="0 0 200 28" preserveAspectRatio="none">
              <defs>
                <linearGradient id="spark-g" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22C55E" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#22C55E" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0,22 L20,20 L40,18 L60,16 L80,19 L100,14 L120,10 L140,8 L160,5 L180,7 L200,4" fill="none" stroke="#22C55E" strokeWidth="1.2" />
              <path d="M0,22 L20,20 L40,18 L60,16 L80,19 L100,14 L120,10 L140,8 L160,5 L180,7 L200,4 L200,28 L0,28Z" fill="url(#spark-g)" />
            </svg>
          </div>

          {/* Index chips */}
          <div style={{ display: 'flex', gap: 5, marginBottom: 10 }}>
            {[
              { label: 'NIFTY', val: '24,857', chg: '+0.4%', pos: true },
              { label: 'BANK', val: '52,340', chg: '-0.1%', pos: false },
            ].map(ix => (
              <div key={ix.label} style={{ flex: 1, background: '#0E0E0E', border: '1px solid #1A1A1A', borderRadius: 8, padding: '6px 7px' }}>
                <div style={{ fontSize: '0.4rem', color: '#606060', fontFamily: 'var(--mono)', marginBottom: 2 }}>{ix.label}</div>
                <div style={{ fontSize: '0.62rem', fontWeight: 700, color: '#EDEDED', lineHeight: 1 }}>{ix.val}</div>
                <div style={{ fontSize: '0.45rem', color: ix.pos ? '#22C55E' : '#EF4444', fontFamily: 'var(--mono)', marginTop: 2 }}>{ix.chg}</div>
              </div>
            ))}
          </div>

          {/* Watchlist */}
          <div style={{ fontSize: '0.42rem', color: '#555', fontFamily: 'var(--mono)', marginBottom: 5, letterSpacing: '0.1em' }}>WATCHLIST</div>
          {[
            { sym: 'RELIANCE', price: '2,948', chg: '+1.2%', pos: true },
            { sym: 'INFY',     price: '1,567', chg: '-0.4%', pos: false },
            { sym: 'HDFC',     price: '1,743', chg: '+0.8%', pos: true },
          ].map((tk, i) => (
            <div key={tk.sym} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '5px 0',
              borderTop: `1px solid ${i === 0 ? '#1A1A1A' : '#141414'}`,
            }}>
              <span style={{ fontSize: '0.5rem', fontWeight: 700, color: '#BEBEBE', fontFamily: 'var(--mono)' }}>{tk.sym}</span>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.5rem', fontWeight: 700, color: '#EDEDED' }}>₹{tk.price}</div>
                <div style={{ fontSize: '0.42rem', color: tk.pos ? '#22C55E' : '#EF4444', fontFamily: 'var(--mono)' }}>{tk.chg}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Home bar */}
      <div style={{
        position: 'absolute', bottom: -16, left: '50%', transform: 'translateX(-50%)',
        width: 88, height: 4, background: '#252525', borderRadius: 2,
      }} />
    </div>
  );
}
