'use client';

export default function Hero() {
  return (
    <section
      style={{
        minHeight: '100svh',
        background: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 'clamp(120px, 18vh, 200px) clamp(24px, 5vw, 120px) clamp(60px, 8vh, 100px)',
        position: 'relative',
      }}
    >
      {/* Dot grid texture */}
      <div
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.015) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div style={{ maxWidth: '900px', position: 'relative' }}>
        <h1
          style={{
            fontSize: 'clamp(56px, 11vw, 140px)',
            fontWeight: 900,
            color: '#ffffff',
            letterSpacing: '-0.055em',
            lineHeight: 0.95,
            margin: 0,
          }}
        >
          8 apps.<br />
          3 browser tabs.<br />
          1 trade you<br />almost missed.
        </h1>

        <p
          style={{
            fontSize: 'clamp(16px, 1.6vw, 20px)',
            color: 'var(--green)',
            fontWeight: 500,
            marginTop: '32px',
            lineHeight: 1.4,
          }}
        >
          There&apos;s a simpler way to watch the market.
        </p>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            marginTop: '48px',
            flexWrap: 'wrap',
          }}
        >
          <a
            href="#waitlist"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '16px 36px',
              background: '#ffffff',
              color: '#000000',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '1rem',
              letterSpacing: '-0.01em',
              textDecoration: 'none',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(255,255,255,0.12)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Join the waitlist →
          </a>
          <a
            href="#pain"
            style={{
              color: 'var(--text-3)',
              fontSize: '0.95rem',
              fontWeight: 500,
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-1)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-3)')}
          >
            See what&apos;s inside ↓
          </a>
        </div>
      </div>
    </section>
  );
}
