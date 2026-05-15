const painItems = [
  { app: 'NSE website',        note: 'loads in 5 seconds' },
  { app: 'Moneycontrol',       note: '16 ads. you counted.' },
  { app: 'Google Finance',     note: 'shows USD by default' },
  { app: 'Screener.in',        note: 'fundamentals, finally' },
  { app: 'Your broker app',    note: 'no sector data' },
  { app: 'Reddit thread',      note: 'from March 2021' },
  { app: 'That Twitter list',  note: 'person stopped posting' },
];

const opacities = [1, 0.8, 0.9, 0.7, 0.85, 0.65, 0.6];

export default function PainSection() {
  return (
    <section
      id="pain"
      style={{
        background: 'var(--bg)',
        padding: 'clamp(80px, 12vh, 140px) clamp(24px, 5vw, 120px)',
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
          marginBottom: '32px',
        }}
      >
        YOUR CURRENT SETUP
      </p>

      <h2
        data-reveal="up"
        style={{
          fontSize: 'clamp(28px, 4vw, 48px)',
          fontWeight: 800,
          color: 'var(--text-1)',
          letterSpacing: '-0.04em',
          marginBottom: '64px',
          maxWidth: '600px',
          lineHeight: 1.1,
        }}
      >
        The apps most investors<br />have open right now.
      </h2>

      <div style={{ maxWidth: '860px' }}>
        {painItems.map((item, idx) => (
          <div
            key={idx}
            data-reveal="up"
            data-delay={String(idx * 80)}
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              padding: '22px 0',
              borderBottom: '1px solid var(--border)',
              opacity: opacities[idx],
              gap: '24px',
            }}
          >
            <span
              style={{
                fontSize: 'clamp(22px, 3.5vw, 40px)',
                fontWeight: 700,
                color: 'var(--text-1)',
                letterSpacing: '-0.03em',
                lineHeight: 1,
              }}
            >
              {item.app}
            </span>
            <span
              style={{
                fontFamily: 'var(--mono)',
                fontSize: '13px',
                color: 'var(--text-4)',
                fontStyle: 'italic',
                flexShrink: 0,
                textAlign: 'right',
              }}
            >
              — {item.note}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
