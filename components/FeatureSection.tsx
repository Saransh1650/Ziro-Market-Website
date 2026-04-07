'use client';

import { useEffect, useState } from 'react';

export default function FeatureSection() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkSize = () => {
      setIsMobile(window.innerWidth <= 480);
      setIsTablet(window.innerWidth > 480 && window.innerWidth <= 768);
    };
    
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  const sectionPadding = isMobile ? '60px 20px' : isTablet ? '80px 20px' : '120px 20px';
  const gridColumns = (isMobile || isTablet) ? '1fr' : '1fr 1fr';
  const gridGap = isMobile ? '40px' : isTablet ? '50px' : '100px';
  const phoneWidth = isMobile ? '260px' : isTablet ? '300px' : '380px';
  const phoneHeight = isMobile ? '520px' : isTablet ? '640px' : '800px';
  const phoneBorder = isMobile ? '6px' : '8px';
  const phoneBorderRadius = isMobile ? '32px' : '40px';
  const textAlign = (isMobile || isTablet) ? 'center' : 'left';
  const phoneMargin = (isMobile || isTablet) ? '0 auto' : '0 0 0 auto';

  return (
    <section 
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
        padding: sectionPadding,
        position: 'relative',
        minHeight: (isMobile || isTablet) ? 'auto' : '100vh',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)'
      }}
    >
      <div style={{ maxWidth: '1200px', width: '100%', padding: '0 20px' }}>
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: gridColumns,
            gap: gridGap,
            alignItems: 'center'
          }}
        >
          {/* Left - Text */}
          <div style={{
            textAlign: textAlign,
            display: 'flex',
            flexDirection: 'column',
            alignItems: (isMobile || isTablet) ? 'center' : 'flex-start'
          }}>
            <h2 style={{
              fontSize: 'clamp(2.2rem, 6vw, 3.8rem)',
              fontWeight: 900,
              lineHeight: 1.1,
              color: 'var(--text-1)',
              marginBottom: '28px',
              letterSpacing: '-0.05em'
            }}>
              Trade With
              <br />
              Like Minded People,
              <br />
              Together.
            </h2>
            <p style={{
              fontSize: 'clamp(1rem, 1.5vw, 1.2rem)',
              color: 'var(--text-3)',
              lineHeight: 1.6,
              maxWidth: '520px',
              margin: '0'
            }}>
              Ziro brings the conversation and the market insights into one unified app. No more switching between apps to stay updated.
            </p>
          </div>

          {/* Right - Phone Screenshot Placeholder */}
          <div 
            style={{
              width: '100%',
              maxWidth: phoneWidth,
              height: phoneHeight,
              background: 'var(--bg-1)',
              borderRadius: phoneBorderRadius,
              margin: phoneMargin,
              boxShadow: '0 60px 120px rgba(0,0,0,0.8), 0 0 0 1px var(--border)',
              position: 'relative',
              overflow: 'hidden',
              border: `${phoneBorder} solid var(--bg-2)`
            }}
          >
            <img 
              src="/screenshots/chat-preview.png" 
              alt="Ziro Market Chat Room"
              style={{
                width: '100%',
                height: '105%',
                objectFit: 'cover',
                objectPosition: 'center 38%'
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
