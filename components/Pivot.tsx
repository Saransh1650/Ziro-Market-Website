export default function Pivot() {
  return (
    <section
      style={{
        background: 'var(--bg)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        padding: 'clamp(100px, 16vh, 200px) clamp(24px, 5vw, 120px)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle green glow from top */}
      <div
        style={{
          position: 'absolute',
          top: '-20%', left: '50%',
          transform: 'translateX(-50%)',
          width: '60%', height: '60%',
          background: 'radial-gradient(ellipse, rgba(34,197,94,0.06) 0%, transparent 65%)',
          pointerEvents: 'none',
          filter: 'blur(50px)',
        }}
      />

      <p
        data-reveal="up"
        style={{
          fontFamily: 'var(--mono)',
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.14em',
          color: 'var(--text-4)',
          textTransform: 'uppercase',
          marginBottom: '40px',
          position: 'relative',
        }}
      >
        THE BETTER WAY
      </p>

      <h2
        data-reveal="up"
        data-delay="100"
        style={{
          fontSize: 'clamp(40px, 7vw, 96px)',
          fontWeight: 800,
          color: 'var(--text-1)',
          letterSpacing: '-0.05em',
          lineHeight: 1.0,
          maxWidth: '800px',
          margin: '0 auto 64px',
          position: 'relative',
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
          gap: '16px',
          position: 'relative',
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
            flexShrink: 0,
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
            fontSize: 'clamp(40px, 6vw, 72px)',
            fontWeight: 900,
            color: '#ffffff',
            letterSpacing: '0.06em',
            lineHeight: 1,
          }}
        >
          ZIRO
        </span>
      </div>

      {/* Three feature pills below */}
      <div
        data-reveal="up"
        data-delay="350"
        style={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '10px',
          marginTop: '48px',
          position: 'relative',
        }}
      >
        {['Markets', 'Portfolio', 'Watchlist', 'Discovery', 'Commodities'].map((tag) => (
          <span
            key={tag}
            style={{
              padding: '6px 16px',
              borderRadius: '99px',
              border: '1px solid var(--border-2)',
              background: 'var(--bg-2)',
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--text-3)',
              letterSpacing: '0.01em',
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </section>
  );
}
