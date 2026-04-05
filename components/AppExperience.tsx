'use client';

import { useScrollReveal } from '@/hooks/useScrollReveal';
import { STOCKS, SECTORS } from '@/lib/data';

const experiences = [
  {
    id: 'heatmap',
    title: 'Market Heatmap',
    description: 'Visual overview of sector performance at a glance.',
    side: 'left'
  },
  {
    id: 'watchlist',
    title: 'Watchlist Intelligence',
    description: 'Track your stocks with simple visual signals.',
    side: 'right'
  },
  {
    id: 'chat',
    title: 'Stock Chat Rooms',
    description: 'Discuss market movements with traders.',
    side: 'left'
  }
];

export default function AppExperience() {
  const [ref, isVisible] = useScrollReveal<HTMLDivElement>({ threshold: 0.1 });

  return (
    <section 
      ref={ref}
      style={{ 
        padding: '160px 0',
        background: 'var(--bg)',
        position: 'relative'
      }}
    >
      <div className="container-wide">
        {experiences.map((exp, index) => (
          <div
            key={exp.id}
            className="responsive-grid"
            style={{
              marginBottom: index < experiences.length - 1 ? '200px' : '0',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(60px)',
              transition: `all 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.2}s`
            }}
          >
            {/* Text Side */}
            <div style={{ order: exp.side === 'left' ? 2 : 1 }} className="app-exp-text">
              <h2 style={{
                fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
                fontWeight: 900,
                lineHeight: 1.1,
                letterSpacing: '-0.04em',
                marginBottom: '24px',
                color: 'var(--text-1)'
              }}>
                {exp.title}
              </h2>
              <p style={{
                fontSize: '1.2rem',
                lineHeight: 1.7,
                color: 'var(--text-2)',
                maxWidth: '480px'
              }}>
                {exp.description}
              </p>
            </div>

            {/* Phone Mockup Side */}
            <div style={{ order: exp.side === 'left' ? 1 : 2, display: 'flex', justifyContent: 'center' }}>
              <PhoneMockup type={exp.id} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function PhoneMockup({ type }: { type: string }) {
  return (
    <div style={{
      width: '320px',
      minHeight: '640px',
      background: 'var(--bg-2)',
      border: '2px solid var(--border-2)',
      borderRadius: '48px',
      overflow: 'hidden',
      boxShadow: '0 30px 80px rgba(0,0,0,0.7)',
      transition: 'transform 0.3s ease'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-8px)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
    }}
    >
      {/* Content based on type */}
      <div style={{ 
        padding: type === 'chat' ? '0' : '28px 24px',
        height: '100%',
        width: '100%'
      }}>
        {type === 'heatmap' && (
          <>
            {/* Notch */}
            <div style={{
              height: '44px',
              background: 'var(--bg-1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{
                width: '130px',
                height: '6px',
                background: 'var(--bg-3)',
                borderRadius: '99px'
              }}></div>
            </div>
            <HeatmapContent />
          </>
        )}
        {type === 'watchlist' && (
          <>
            {/* Notch */}
            <div style={{
              height: '44px',
              background: 'var(--bg-1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{
                width: '130px',
                height: '6px',
                background: 'var(--bg-3)',
                borderRadius: '99px'
              }}></div>
            </div>
            <WatchlistContent />
          </>
        )}
        {type === 'chat' && (
          <img 
            src="/screenshots/chat-preview.png" 
            alt="Stock Chat Room"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        )}
      </div>
    </div>
  );
}

function HeatmapContent() {
  const sectors = SECTORS.slice(0, 6).map((s, i) => {
    const val = (Math.sin(i) * 3).toFixed(1);
    const color = parseFloat(val) > 0 ? '#22c55e' : '#ef4444';
    return { name: s.name, val, color };
  });

  return (
    <>
      <h3 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '12px', color: 'var(--text-1)' }}>
        Sectors
      </h3>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-3)', marginBottom: '32px' }}>
        Today's performance
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
        {sectors.map((sector) => (
          <div
            key={sector.name}
            style={{
              background: sector.color,
              borderRadius: '18px',
              padding: '28px 22px',
              minHeight: '100px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.95)', textTransform: 'uppercase' }}>
              {sector.name}
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff', fontFamily: 'var(--mono)' }}>
              {parseFloat(sector.val) > 0 ? '+' : ''}{sector.val}%
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function WatchlistContent() {
  const stocks = STOCKS.slice(0, 4);

  return (
    <>
      <h3 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '12px', color: 'var(--text-1)' }}>
        My Watchlist
      </h3>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-3)', marginBottom: '32px' }}>
        4 stocks tracked
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {stocks.map((stock, i) => {
          const change = ((Math.sin(i) * 3)).toFixed(1);
          const isPositive = parseFloat(change) > 0;
          return (
            <div
              key={stock.sym}
              style={{
                background: 'var(--bg-3)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                padding: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <div style={{ fontSize: '1rem', fontWeight: 700, fontFamily: 'var(--mono)', marginBottom: '4px' }}>
                  {stock.sym}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-4)' }}>
                  {stock.name}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '4px' }}>
                  ₹{stock.price.toLocaleString('en-IN')}
                </div>
                <div style={{ 
                  fontSize: '0.85rem', 
                  fontWeight: 700, 
                  color: isPositive ? 'var(--green)' : 'var(--red)',
                  fontFamily: 'var(--mono)'
                }}>
                  {isPositive ? '+' : ''}{change}%
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

function ChatContent() {
  return null; // No longer used, replaced by image
}
