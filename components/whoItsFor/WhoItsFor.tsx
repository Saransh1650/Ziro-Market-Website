const PERSONAS = [
  {
    num: '01',
    headline: 'Between meetings',
    desc: 'The investor who checks in during a busy afternoon and wants a quick, honest read of the market. No digging, no noise. Just what matters right now.',
  },
  {
    num: '02',
    headline: 'Still learning',
    desc: 'The beginner still learning what beta or sector rotation actually means. Ziro Market shows you the concept alongside the live data, so it clicks faster.',
  },
  {
    num: '03',
    headline: 'Done with five apps',
    desc: 'The experienced hand tired of juggling Zerodha, Moneycontrol, NSE, TradingView, and a broker app all at once. Everything\'s here. One place.',
  },
];

export default function WhoItsFor() {
  return (
    <section className="section section-dark crosshair">
      <div className="container">
        <span className="section-num">WHO IT&apos;S FOR</span>
        <h2 style={{ marginTop: 18, maxWidth: 640 }}>
          Built for whoever you are
          <em style={{ color: 'var(--amber)' }}> right now.</em>
        </h2>

        <div className="personas-grid">
          {PERSONAS.map((p) => (
            <div key={p.num} className="persona-card">
              <div style={{
                fontFamily: 'var(--sans)', fontWeight: 200,
                fontSize: 'clamp(3rem, 5vw, 4.4rem)',
                color: 'rgba(255,255,255,0.12)',
                lineHeight: 1, marginBottom: 12,
                letterSpacing: '-0.04em',
              }}>{p.num}</div>
              <div style={{
                fontFamily: 'var(--sans)', fontSize: '0.78rem',
                fontWeight: 600, letterSpacing: '0.04em',
                textTransform: 'uppercase', color: 'var(--amber)',
                marginBottom: 10,
              }}>{p.headline}</div>
              <p style={{
                fontSize: '0.96rem', color: 'rgba(255,255,255,0.62)',
                lineHeight: 1.65,
              }}>{p.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 64, paddingTop: 40, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <p style={{
            fontFamily: 'var(--sans)', fontWeight: 300,
            fontSize: 'clamp(1.2rem, 2.2vw, 1.6rem)',
            color: 'rgba(255,255,255,0.50)',
            lineHeight: 1.6, maxWidth: 680,
          }}>
            &ldquo;If you&apos;re curious about markets and want to stay informed without it becoming a second job, Ziro Market was built with you in mind.&rdquo;
          </p>
        </div>
      </div>

      <style>{`
        .personas-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0;
          margin-top: 56px;
        }
        .persona-card {
          padding: 0 40px 0 0;
          border-right: 1px solid rgba(255,255,255,0.08);
        }
        .persona-card:first-child { padding-left: 0; }
        .persona-card:last-child  { border-right: none; padding-right: 0; padding-left: 40px; }
        .persona-card:nth-child(2) { padding-left: 40px; }
        @media (max-width: 900px) {
          .personas-grid { grid-template-columns: 1fr; gap: 40px; }
          .persona-card { border-right: none; border-top: 1px solid rgba(255,255,255,0.08); padding: 32px 0 0 0 !important; }
          .persona-card:first-child { border-top: none; padding-top: 0 !important; }
        }
      `}</style>
    </section>
  );
}
