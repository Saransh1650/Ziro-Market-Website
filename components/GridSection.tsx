'use client';

import { useEffect, useState } from 'react';

export default function GridSection() {
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
  const gridColumns = isMobile ? '1fr' : 'repeat(2, 1fr)';
  const gridGap = isMobile ? '16px' : isTablet ? '12px' : '16px';
  const boxHeight = isMobile ? '240px' : isTablet ? '200px' : '280px';

  return (
    <section 
      style={{
        minHeight: (isMobile || isTablet) ? 'auto' : '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0e12',
        padding: sectionPadding,
        position: 'relative'
      }}
    >
      <div style={{ maxWidth: '1100px', width: '100%', padding: '0 20px' }}>
        {/* Grid */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: gridColumns,
            gridTemplateRows: isMobile ? 'auto' : 'repeat(2, 1fr)',
            gap: gridGap,
            width: '100%'
          }}
        >
          {/* Screenshot 1 */}
          <div style={{
            width: '100%',
            height: boxHeight,
            background: '#fff',
            borderRadius: '8px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: '#999',
              fontSize: '0.85rem',
              textAlign: 'center'
            }}>
              Screenshot 1
            </div>
          </div>

          {/* Screenshot 2 */}
          <div style={{
            width: '100%',
            height: boxHeight,
            background: '#fff',
            borderRadius: '8px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: '#999',
              fontSize: '0.85rem',
              textAlign: 'center'
            }}>
              Screenshot 2
            </div>
          </div>

          {/* Screenshot 3 */}
          <div style={{
            width: '100%',
            height: boxHeight,
            background: '#fff',
            borderRadius: '8px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: '#999',
              fontSize: '0.85rem',
              textAlign: 'center'
            }}>
              Screenshot 3
            </div>
          </div>

          {/* Screenshot 4 */}
          <div style={{
            width: '100%',
            height: boxHeight,
            background: '#fff',
            borderRadius: '8px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: '#999',
              fontSize: '0.85rem',
              textAlign: 'center'
            }}>
              Screenshot 4
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
