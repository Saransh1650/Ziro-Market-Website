const COMMODITIES = [
  { name: 'CRUDE OIL', val: '$78.42', chg:  1.20, unit: 'WTI · per bbl' },
  { name: 'GOLD',      val: '₹71,240', chg: -0.40, unit: 'MCX · 10g' },
  { name: 'SILVER',    val: '₹88,310', chg:  1.85, unit: 'MCX · 1kg' },
  { name: 'COPPER',    val: '₹802.40', chg:  0.65, unit: 'MCX · per kg' },
];

export default function SectorTiles() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
      {COMMODITIES.map((c) => (
        <div key={c.name} style={{ background: 'var(--bg-1)', border: '1px solid var(--border-1)', borderRadius: 8, padding: 18 }}>
          <div className="caption" style={{ marginBottom: 6 }}>{c.name}</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.02em' }}>{c.val}</div>
          <div className={`mono ${c.chg >= 0 ? 'up' : 'down'}`} style={{ fontSize: '0.78rem', fontWeight: 700, marginTop: 4 }}>
            {c.chg >= 0 ? '▲' : '▼'} {Math.abs(c.chg).toFixed(2)}%
          </div>
          <div className="caption" style={{ marginTop: 10 }}>{c.unit}</div>
          <MiniSpark up={c.chg >= 0} />
        </div>
      ))}
    </div>
  );
}

function MiniSpark({ up }: { up: boolean }) {
  const path = up
    ? 'M0 24 L8 20 L16 22 L24 14 L32 16 L40 8 L48 11 L56 5'
    : 'M0 6 L8 9 L16 7 L24 14 L32 12 L40 18 L48 16 L56 22';
  return (
    <svg width="100%" height="28" viewBox="0 0 56 28" style={{ marginTop: 12 }}>
      <path d={path} fill="none" stroke={up ? 'var(--positive)' : 'var(--negative)'} strokeWidth="1.8" />
    </svg>
  );
}
