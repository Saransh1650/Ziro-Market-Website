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
        background: '#0a0e12',
        padding: sectionPadding,
        position: 'relative',
        minHeight: (isMobile || isTablet) ? 'auto' : '100vh'
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
              fontSize: 'clamp(1.8rem, 5vw, 3.5rem)',
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
              fontSize: 'clamp(0.95rem, 1.5vw, 1.1rem)',
              color: 'rgba(255,255,255,0.6)',
              lineHeight: 1.6,
              maxWidth: '480px'
            }}>
              Keeping up with the market doesn't have to be such a chore
            </p>
          </div>

          {/* Right - Phone Screenshot Placeholder */}
          <div 
            style={{
              width: '100%',
              maxWidth: phoneWidth,
              height: phoneHeight,
              background: 'var(--bg-2)',
              borderRadius: phoneBorderRadius,
              margin: phoneMargin,
              boxShadow: '0 40px 100px rgba(0,0,0,0.5)',
              position: 'relative',
              overflow: 'hidden',
              border: `${phoneBorder} solid #1a1e22`
            }}
          >
            <img 
              src="/screenshots/chat-preview.png" 
              alt="Ziro Market Chat Room"
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
