const SECTORS = [
  { name: 'IT',       pct:  2.4 },
  { name: 'BANK',     pct:  1.1 },
  { name: 'AUTO',     pct: -0.6 },
  { name: 'PHARMA',   pct:  0.8 },
  { name: 'FMCG',     pct: -0.2 },
  { name: 'METALS',   pct:  3.2 },
  { name: 'REALTY',   pct: -1.4 },
  { name: 'ENERGY',   pct:  1.7 },
  { name: 'INFRA',    pct:  0.4 },
  { name: 'CHEMICAL', pct: -0.9 },
  { name: 'TELECOM',  pct:  2.0 },
];

function tint(pct: number) {
  const abs = Math.min(Math.abs(pct), 4) / 4;
  if (pct >= 0) return `rgba(34,197,94,${0.12 + abs * 0.38})`;
  return `rgba(239,68,68,${0.12 + abs * 0.38})`;
}

export default function MarketMapScreen() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 4 }}>
        <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#EDEDED', letterSpacing: '0.06em' }}>MARKET MAP</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#22C55E' }} />
          <span style={{ fontSize: '0.42rem', color: '#22C55E', fontFamily: 'var(--mono)' }}>LIVE</span>
        </div>
      </div>

      {/* Index strip */}
      <div style={{ display: 'flex', gap: 5 }}>
        {[{ n: 'NIFTY', v: '24,857', c: '+0.4%', up: true }, { n: 'SENSEX', v: '81,340', c: '+0.5%', up: true }, { n: 'MIDCAP', v: '14,210', c: '-0.2%', up: false }].map(ix => (
          <div key={ix.n} style={{ flex: 1, background: '#111', border: '1px solid #1F1F1F', borderRadius: 6, padding: '4px 5px' }}>
            <div style={{ fontSize: '0.38rem', color: '#808080', fontFamily: 'var(--mono)' }}>{ix.n}</div>
            <div style={{ fontSize: '0.52rem', fontWeight: 700, color: '#EDEDED' }}>{ix.v}</div>
            <div style={{ fontSize: '0.42rem', color: ix.up ? '#22C55E' : '#EF4444', fontFamily: 'var(--mono)', fontWeight: 700 }}>{ix.c}</div>
          </div>
        ))}
      </div>

      {/* Sector heatmap */}
      <div style={{ fontSize: '0.38rem', color: '#505050', fontFamily: 'var(--mono)', letterSpacing: '0.08em' }}>SECTORS</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3, flex: 1 }}>
        {SECTORS.map(s => (
          <div key={s.name} style={{
            background: tint(s.pct),
            borderRadius: 5, padding: '7px 5px',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          }}>
            <div style={{ fontSize: '0.42rem', fontWeight: 700, color: '#EDEDED', lineHeight: 1.2 }}>{s.name}</div>
            <div style={{ fontSize: '0.48rem', fontWeight: 800, color: s.pct >= 0 ? '#22C55E' : '#EF4444', fontFamily: 'var(--mono)', marginTop: 4 }}>
              {s.pct >= 0 ? '+' : ''}{s.pct.toFixed(1)}%
            </div>
          </div>
        ))}
      </div>

      <div style={{ paddingBottom: 6 }} />
    </div>
  );
}
