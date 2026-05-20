const SECTORS: { name: string; pct: number }[] = [
  { name: 'IT',         pct:  2.4 },
  { name: 'BANKING',    pct:  1.1 },
  { name: 'AUTO',       pct: -0.6 },
  { name: 'PHARMA',     pct:  0.8 },
  { name: 'FMCG',       pct: -0.2 },
  { name: 'METALS',     pct:  3.2 },
  { name: 'REALTY',     pct: -1.4 },
  { name: 'ENERGY',     pct:  1.7 },
  { name: 'INFRA',      pct:  0.4 },
  { name: 'CHEMICAL',   pct: -0.9 },
  { name: 'TELECOM',    pct:  2.0 },
];

function tint(pct: number): string {
  const abs = Math.min(Math.abs(pct), 4) / 4;
  if (pct >= 0) return `rgba(34, 197, 94, ${0.15 + abs * 0.65})`;
  return `rgba(239, 68, 68, ${0.15 + abs * 0.65})`;
}

export default function HeatmapViz() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4, background: 'var(--bg-1)', padding: 4, border: '1px solid var(--border-1)', borderRadius: 8 }}>
      {SECTORS.map((s) => (
        <div key={s.name} style={{
          background: tint(s.pct), padding: '20px 14px', minHeight: 90,
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: 0.5, color: 'var(--text-1)' }}>{s.name}</div>
          <div className={`mono ${s.pct >= 0 ? 'up' : 'down'}`} style={{ fontSize: '0.78rem', fontWeight: 700 }}>
            {s.pct >= 0 ? '+' : ''}{s.pct.toFixed(2)}%
          </div>
        </div>
      ))}
    </div>
  );
}
