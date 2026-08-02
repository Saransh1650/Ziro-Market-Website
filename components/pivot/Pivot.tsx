export default function Pivot() {
  return (
    <section id="pivot" className="section-dark pivot-section" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Decorative large circle */}
      <div aria-hidden style={{
        position: 'absolute',
        width: 'clamp(400px, 70vw, 800px)',
        height: 'clamp(400px, 70vw, 800px)',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: '50%',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
      }} />
      <div aria-hidden style={{
        position: 'absolute',
        width: 'clamp(240px, 45vw, 520px)',
        height: 'clamp(240px, 45vw, 520px)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '50%',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <span className="section-num" style={{ justifyContent: 'center', marginBottom: 36 }}>Manifesto</span>

        {/* "But" — the pivot word */}
        <p style={{
          fontFamily: 'var(--sans)',
          fontWeight: 200,
          fontSize: 'clamp(1.8rem, 4vw, 3.2rem)',
          letterSpacing: '-0.02em',
          color: 'rgba(255,255,255,0.30)',
          marginBottom: 12,
          lineHeight: 1,
        }}>
          But...
        </p>

        {/* Main headline — maximum impact */}
        <h2 style={{
          fontSize: 'clamp(3rem, 7.5vw, 7rem)',
          fontWeight: 800,
          letterSpacing: '-0.035em',
          lineHeight: 0.94,
          maxWidth: 800,
          margin: '0 auto',
          color: '#ffffff',
        }}>
          We built<br />
          <em style={{ fontWeight: 200, color: 'rgba(255,255,255,0.55)' }}>something</em>
          {' '}<em style={{ fontStyle: 'normal', color: 'var(--amber)' }}>else.</em>
        </h2>

        <p style={{
          marginTop: 36,
          maxWidth: 480,
          margin: '36px auto 0',
          fontSize: '1.08rem',
          lineHeight: 1.72,
          color: 'rgba(255,255,255,0.52)',
        }}>
          Live. Indian. Ad-free. Every market in one place that makes sense.
        </p>

        {/* Tags */}
        <div style={{ marginTop: 52, display: 'flex', gap: 0, justifyContent: 'center', flexWrap: 'wrap' }}>
          {['NSE & BSE', '32 Sectors', 'MCX Futures', 'No ads. Ever.'].map((tag, i, arr) => (
            <span key={tag} style={{
              fontFamily: 'var(--mono)', fontSize: '0.64rem', letterSpacing: '0.18em',
              textTransform: 'uppercase', color: 'rgba(255,255,255,0.36)',
              padding: '0 24px',
              borderRight: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.12)' : 'none',
              lineHeight: 1,
            }}>{tag}</span>
          ))}
        </div>
      </div>

      <style>{`
        .pivot-section { padding: 128px 0; }
        @media (max-width: 768px) { .pivot-section { padding: 92px 0; } }
        @media (max-width: 480px) { .pivot-section { padding: 76px 0; } }
      `}</style>
    </section>
  );
}
