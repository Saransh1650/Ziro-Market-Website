export default function Pivot() {
  return (
    <section
      style={{
        background: 'var(--bg)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        padding: 'clamp(80px, 14vh, 160px) clamp(24px, 5vw, 120px)',
        textAlign: 'center',
      }}
    >
      <h2
        data-reveal="up"
        style={{
          fontSize: 'clamp(40px, 7vw, 88px)',
          fontWeight: 800,
          color: 'var(--text-1)',
          letterSpacing: '-0.05em',
          lineHeight: 1.0,
          maxWidth: '800px',
          margin: '0 auto 56px',
        }}
      >
        What if one app<br />had all of it?
      </h2>

      <div
        data-reveal="up"
        data-delay="200"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '14px',
        }}
      >
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <img
            src="/app_icon/ziro.png"
            alt="Ziro"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>
        <span
          style={{
            fontSize: 'clamp(32px, 5vw, 56px)',
            fontWeight: 900,
            color: '#ffffff',
            letterSpacing: '0.06em',
          }}
        >
          ZIRO
        </span>
      </div>
    </section>
  );
}
