const STATS = [
  { value: '1.8M', label: 'ticks per day' },
  { value: '42',   label: 'data sources' },
  { value: '<1s',  label: 'cold-start' },
  { value: '100%', label: 'Indian markets' },
];

export default function StatsStrip() {
  return (
    <section className="section-sm" style={{ borderTop: '1px solid var(--border-1)', borderBottom: '1px solid var(--border-1)' }}>
      <div className="container">
        <div className="stats-grid">
          {STATS.map((s, i) => (
            <div key={s.label} style={{ borderRight: i < STATS.length - 1 ? '1px solid var(--border-1)' : 'none', paddingRight: 16 }}>
              <div style={{ fontSize: '2.4rem', fontWeight: 900, letterSpacing: '-0.04em' }}>{s.value}</div>
              <div className="caption" style={{ marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
        <style>{`
          .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
          @media (max-width: 768px) {
            .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 28px; }
            .stats-grid > div { border-right: none !important; padding-right: 0; }
          }
        `}</style>
      </div>
    </section>
  );
}
