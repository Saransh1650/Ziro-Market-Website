const stats = [
  { label: 'STOCKS TRACKED', value: '500+' },
  { label: 'LIVE DATA',       value: 'NSE & BSE' },
  { label: 'UPDATES',         value: 'Real-time' },
  { label: 'COST',            value: 'Free' },
];

export default function StatsStrip() {
  return (
    <section
      style={{
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-1)',
        padding: 'clamp(32px, 5vh, 56px) 0',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
        }}
      >
        {stats.map((s, idx) => (
          <div
            key={idx}
            data-reveal="up"
            data-delay={String(idx * 100)}
            style={{
              flex: '1 1 200px',
              padding: 'clamp(20px, 3vw, 36px) clamp(24px, 3vw, 48px)',
              borderRight: idx < stats.length - 1 ? '1px solid var(--border)' : 'none',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--mono)',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                color: 'var(--text-4)',
                textTransform: 'uppercase',
                marginBottom: '10px',
              }}
            >
              {s.label}
            </p>
            <p
              style={{
                fontSize: 'clamp(28px, 4vw, 48px)',
                fontWeight: 800,
                color: 'var(--text-1)',
                letterSpacing: '-0.03em',
                lineHeight: 1,
              }}
            >
              {s.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
