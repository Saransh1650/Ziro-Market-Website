'use client';

export default function FeatureSection() {
  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      background: '#0a0e12',
      padding: '120px 20px',
      position: 'relative'
    }}>
      <div className="container" style={{ maxWidth: '1200px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '100px',
          alignItems: 'center'
        }}>
          {/* Left - Text */}
          <div>
            <h2 style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 700,
              lineHeight: 1.2,
              color: '#fff',
              marginBottom: '24px',
              letterSpacing: '-0.02em'
            }}>
              No More Irrelevant
              <br />
              Discussions, Talk With Like
              <br />
              Minded People
            </h2>
            <p style={{
              fontSize: '1rem',
              color: 'rgba(255,255,255,0.6)',
              lineHeight: 1.6,
              maxWidth: '480px'
            }}>
              Keeping up with the market doesn't have to be such a chore
            </p>
          </div>

          {/* Right - Phone Screenshot Placeholder */}
          <div style={{
            width: '100%',
            maxWidth: '380px',
            height: '800px',
            background: 'var(--bg-2)',
            borderRadius: '40px',
            marginLeft: 'auto',
            boxShadow: '0 40px 100px rgba(0,0,0,0.5)',
            position: 'relative',
            overflow: 'hidden',
            border: '8px solid #1a1e22'
          }}>
            <img 
              src="/screenshots/chat-preview.png" 
              alt="Trade Insights Chat Room"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
