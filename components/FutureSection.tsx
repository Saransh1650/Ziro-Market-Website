'use client';

import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function FutureSection() {
  const [ref, isVisible] = useScrollReveal<HTMLDivElement>({ threshold: 0.25 });

  const features = [
    { icon: '⚡', label: 'Ultra-Realtime', desc: 'Direct NSE/BSE feeds' },
    { icon: '🎯', label: 'Hyper-Focused', desc: '100% Indian Equities' },
    { icon: '🤝', label: 'Collective', desc: 'Verified Community' },
    { icon: '📱', label: 'Seamless', desc: 'Optimized for Mobile' }
  ];

  return (
    <section 
      ref={ref}
      className="section" 
      style={{ 
        background: 'var(--bg)', 
        padding: '160px 0',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid var(--border)'
      }}
    >
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ 
          textAlign: 'center', 
          maxWidth: '840px', 
          margin: '0 auto'
        }}>
          <div 
            className="section-tag" 
            style={{ 
              justifyContent: 'center', 
              marginBottom: '32px',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            <div className="badge">The Evolution</div>
          </div>

          <h2 
            style={{ 
              fontSize: 'clamp(2.4rem, 5vw, 4rem)',
              fontWeight: 900,
              letterSpacing: '-0.04em',
              lineHeight: 1,
              marginBottom: '32px',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s'
            }}
          >
            Moving the Market
            <br />
            <span style={{ color: 'var(--accent-2)' }}>to your Pocket</span>
          </h2>

          <div className="divider" style={{ margin: '0 auto 40px' }}></div>

          <p 
            style={{ 
              fontSize: '1.2rem', 
              lineHeight: 1.8, 
              color: 'var(--text-2)',
              maxWidth: '680px',
              margin: '0 auto 80px',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s'
            }}
          >
            While others build complex desktop terminals, we&apos;re reimagining market intelligence
            for the way modern Indian investors actually work—on the move, always connected, instantly informed.
          </p>

          <div 
            className="cards-grid"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
              transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s'
            }}
          >
            {features.map((item) => (
              <div 
                key={item.label}
                style={{
                  padding: '32px 24px',
                  background: 'var(--bg-2)',
                  border: '1px solid var(--border)',
                  borderRadius: '24px',
                  textAlign: 'center',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  cursor: 'default'
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>{item.icon}</div>
                <div style={{ 
                  fontSize: '1rem', 
                  fontWeight: 800, 
                  color: 'var(--text-1)', 
                  marginBottom: '8px',
                  letterSpacing: '-0.01em'
                }}>
                  {item.label}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-4)' }}>
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
