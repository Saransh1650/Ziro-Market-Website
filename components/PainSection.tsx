'use client';

const painItems = [
  { app: 'NSE website',        note: 'loads in 5 seconds' },
  { app: 'Moneycontrol',       note: '16 ads. you counted.' },
  { app: 'Google Finance',     note: 'shows USD by default' },
  { app: 'Screener.in',        note: 'fundamentals, finally' },
  { app: 'Your broker app',    note: 'no sector data' },
  { app: 'Reddit thread',      note: 'from March 2021' },
  { app: 'That Twitter list',  note: 'person stopped posting' },
];

export default function PainSection() {
  return (
    <section
      id="pain"
      style={{
        background: 'var(--bg)',
        padding: 'clamp(80px, 12vh, 140px) clamp(24px, 5vw, 120px)',
        borderTop: '1px solid var(--border)',
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
          fontSize: 'clamp(28px, 3.5vw, 48px)',
          fontWeight: 800,
          color: 'var(--text-1)',
          letterSpacing: '-0.04em',
          marginBottom: '56px',
          maxWidth: '560px',
          lineHeight: 1.1,
        }}
      >
        The apps most investors<br />have open right now.
      </h2>

      <div style={{ maxWidth: '760px' }}>
        {painItems.map((item, idx) => (
          <div
            key={idx}
            data-reveal="up"
            data-delay={String(idx * 70)}
            className="pain-row"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '20px 0',
              borderBottom: '1px solid var(--border)',
              gap: '16px',
              cursor: 'default',
              transition: 'background 0.2s',
            }}
          >
            <span
              style={{
                fontSize: 'clamp(20px, 3vw, 36px)',
                fontWeight: 700,
                color: 'var(--text-1)',
                letterSpacing: '-0.03em',
                lineHeight: 1,
                opacity: 1 - idx * 0.07,
              }}
            >
              {item.app}
            </span>
            <span
              style={{
                fontFamily: 'var(--mono)',
                fontSize: '12px',
                color: 'var(--text-4)',
                fontStyle: 'italic',
                flexShrink: 0,
                textAlign: 'right',
                paddingLeft: '12px',
                borderLeft: '1px solid var(--border)',
              }}
            >
              {item.note}
            </span>
          </div>
        ))}
      </div>

      <style>{`
        .pain-row:hover span:first-child {
          color: var(--text-3) !important;
        }
        .pain-row:hover span:last-child {
          color: var(--text-3) !important;
        }
      `}</style>
    </section>
  );
}
