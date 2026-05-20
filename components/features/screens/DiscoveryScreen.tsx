const COMMODITIES = [
  { name: 'CRUDE OIL', val: '$78.42',  chg:  1.20, unit: 'WTI · per bbl', path: 'M0 22 L8 18 L16 20 L24 13 L32 15 L40 9 L48 11 L56 5' },
  { name: 'GOLD',      val: '₹71,240', chg: -0.40, unit: 'MCX · 10g',     path: 'M0 5 L8 8 L16 6 L24 12 L32 10 L40 16 L48 14 L56 20' },
  { name: 'SILVER',    val: '₹88,310', chg:  1.85, unit: 'MCX · 1kg',     path: 'M0 20 L8 16 L16 18 L24 10 L32 12 L40 6 L48 8 L56 3'  },
  { name: 'COPPER',    val: '₹802.40', chg:  0.65, unit: 'MCX · per kg',  path: 'M0 16 L8 14 L16 15 L24 10 L32 12 L40 8 L48 9 L56 6'  },
];

export default function DiscoveryScreen() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 4 }}>
        <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#EDEDED', letterSpacing: '0.06em' }}>DISCOVERY</span>
        <span style={{ fontSize: '0.42rem', color: '#808080', fontFamily: 'var(--mono)' }}>MCX · NSE</span>
      </div>

      {/* Section label */}
      <div style={{ fontSize: '0.38rem', color: '#505050', fontFamily: 'var(--mono)', letterSpacing: '0.08em' }}>COMMODITIES</div>

      {/* Commodity tiles */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, flex: 1 }}>
        {COMMODITIES.map(c => (
          <div key={c.name} style={{ background: '#111', border: '1px solid #1F1F1F', borderRadius: 8, padding: '10px 8px 8px' }}>
            <div style={{ fontSize: '0.4rem', color: '#808080', fontFamily: 'var(--mono)', marginBottom: 3 }}>{c.name}</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 900, letterSpacing: '-0.02em', color: '#EDEDED', lineHeight: 1 }}>{c.val}</div>
            <div style={{ fontSize: '0.48rem', fontWeight: 700, fontFamily: 'var(--mono)', marginTop: 3, color: c.chg >= 0 ? '#22C55E' : '#EF4444' }}>
              {c.chg >= 0 ? '▲' : '▼'} {Math.abs(c.chg).toFixed(2)}%
            </div>
            <svg width="100%" height="22" viewBox="0 0 56 24" style={{ marginTop: 6 }} preserveAspectRatio="none">
              <path d={c.path} fill="none" stroke={c.chg >= 0 ? '#22C55E' : '#EF4444'} strokeWidth="1.5" />
            </svg>
            <div style={{ fontSize: '0.36rem', color: '#505050', fontFamily: 'var(--mono)', marginTop: 3 }}>{c.unit}</div>
          </div>
        ))}
      </div>

      <div style={{ paddingBottom: 6 }} />
    </div>
  );
}
