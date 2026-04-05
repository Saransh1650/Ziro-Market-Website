'use client';

import React from 'react';

const screenshots = [
  { src: '/screenshots/sc-1.png', rotate: -12, x: -380, y: 0, z: 10, scale: 0.9, delay: '0s' },
  { src: '/screenshots/sc-2.png', rotate: -6, x: -200, y: -40, z: 20, scale: 1, delay: '0.2s' },
  { src: '/screenshots/sc-3.png', rotate: 0, x: 0, y: 0, z: 30, scale: 1.1, delay: '0.4s' },
  { src: '/screenshots/sc-4.png', rotate: 6, x: 200, y: -40, z: 20, scale: 1, delay: '0.6s' },
  { src: '/screenshots/sc-5.png', rotate: 12, x: 380, y: 0, z: 10, scale: 0.9, delay: '0.8s' },
  { src: '/screenshots/chat-preview.png', rotate: -15, x: -500, y: 120, z: 5, scale: 0.8, delay: '1s' },
  { src: '/screenshots/sc-7.png', rotate: 15, x: 500, y: 120, z: 5, scale: 0.8, delay: '1.2s' },
  { src: '/screenshots/sc-8.png', rotate: -8, x: -100, y: 200, z: 25, scale: 0.95, delay: '1.4s' },
];

export default function AppShowcase() {
  return (
    <section style={{
      background: '#0a0e12',
      padding: '160px 0 240px',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Background radial glow */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '1200px',
        height: '1200px',
        background: 'radial-gradient(circle, rgba(56, 189, 248, 0.08) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div className="container-wide">
        <div style={{ textAlign: 'center', marginBottom: '120px', position: 'relative', zIndex: 50 }}>
          <h2 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: 900,
            letterSpacing: '-0.05em',
            color: '#fff',
            marginBottom: '24px',
            lineHeight: 1
          }}>
            Every Pixel Optimized
            <br />
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>For Alpha Generation</span>
          </h2>
          <p style={{
            fontSize: '1.25rem',
            color: 'rgba(255,255,255,0.5)',
            maxWidth: '640px',
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            From lightning-fast charts to real-time sector analysis, Trade Insights provides 
            the edge you need in today's volatile markets.
          </p>
        </div>

        {/* Collage Container */}
        <div style={{
          position: 'relative',
          height: '600px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          perspective: '1000px'
        }}>
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes float {
              0%, 100% { transform: translateY(0px) rotate(var(--rot)); }
              50% { transform: translateY(-20px) rotate(var(--rot)); }
            }
            .phone-mockup {
              animation: float 6s ease-in-out infinite;
            }
            .phone-mockup:hover {
              z-index: 100 !important;
              transform: scale(1.1) rotate(0deg) !important;
              transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
              box-shadow: 0 50px 100px rgba(0,0,0,0.8), 0 0 40px rgba(56, 189, 248, 0.2);
            }
            @media (max-width: 1024px) {
              .collage-wrap { display: none; }
              .mobile-grid { display: grid !important; }
            }
          `}} />

          <div className="collage-wrap" style={{ position: 'relative', width: '100%', height: '100%' }}>
            {screenshots.map((s, i) => (
              <div
                key={i}
                className="phone-mockup"
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  width: '280px',
                  height: '560px',
                  marginLeft: `${s.x}px`,
                  marginTop: `${s.y - 280}px`,
                  zIndex: s.z,
                  background: '#1a1e22',
                  borderRadius: '32px',
                  border: '6px solid #2a2e32',
                  overflow: 'hidden',
                  boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
                  cursor: 'pointer',
                  transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                  animationDelay: s.delay,
                  '--rot': `${s.rotate}deg`
                } as any}
              >
                <img 
                  src={s.src} 
                  alt={`Screenshot ${i}`} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            ))}
          </div>

          {/* Simple Grid for Mobile */}
          <div className="mobile-grid" style={{ 
            display: 'none', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: '16px',
            width: '100%',
            padding: '0 20px'
          }}>
            {screenshots.slice(0, 4).map((s, i) => (
              <div key={i} style={{
                aspectRatio: '9/19',
                background: '#1a1e22',
                borderRadius: '16px',
                border: '2px solid #2a2e32',
                overflow: 'hidden'
              }}>
                <img src={s.src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
