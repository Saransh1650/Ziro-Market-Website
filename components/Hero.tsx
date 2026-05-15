'use client';

import { useEffect, useState } from 'react';

const floatingCards = [
  { sym: 'NIFTY 50',   price: '22,847', chg: '+0.62%', up: true,  top: '12%', left: '12%',  delay: '0s'   },
  { sym: 'RELIANCE',   price: '₹2,847', chg: '+2.4%',  up: true,  top: '28%', left: '44%',  delay: '0.5s' },
  { sym: 'HDFCBANK',   price: '₹1,687', chg: '+1.2%',  up: true,  top: '48%', left: '8%',   delay: '1.1s' },
  { sym: 'INFY',       price: '₹1,634', chg: '-0.8%',  up: false, top: '63%', left: '40%',  delay: '0.8s' },
  { sym: 'TCS',        price: '₹4,122', chg: '+3.1%',  up: true,  top: '80%', left: '18%',  delay: '1.4s' },
];

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section
      style={{
        minHeight: '100svh',
        background: 'var(--bg)',
        position: 'relative',
        overflow: 'hidden',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
      }}
      className="hero-section"
    >
      {/* Dot grid */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.018) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
        zIndex: 0,
      }} />

      {/* Green glow — behind headline */}
      <div style={{
        position: 'absolute',
        top: '20%', left: '-10%',
        width: '55%', height: '50%',
        background: 'radial-gradient(ellipse, rgba(34,197,94,0.07) 0%, transparent 60%)',
        pointerEvents: 'none',
        filter: 'blur(60px)',
        zIndex: 0,
      }} />

      {/* ── LEFT: headline + CTAs ── */}
      <div
        style={{
          position: 'relative', zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 'clamp(100px, 14vh, 180px) clamp(24px, 5vw, 80px) clamp(60px, 8vh, 100px) clamp(24px, 5vw, 80px)',
        }}
      >
        <h1 style={{
          fontSize: 'clamp(52px, 7.5vw, 108px)',
          fontWeight: 900,
          color: '#ffffff',
          letterSpacing: '-0.055em',
          lineHeight: 0.95,
          margin: 0,
        }}>
          8 apps.<br />
          3 browser<br />tabs.<br />
          1 trade you<br />almost<br />missed.
        </h1>

        <p style={{
          fontSize: 'clamp(15px, 1.3vw, 18px)',
          color: 'var(--green)',
          fontWeight: 500,
          marginTop: '36px',
          lineHeight: 1.5,
        }}>
          There&apos;s a simpler way to watch the market.
        </p>

        <div style={{
          display: 'flex', alignItems: 'center',
          gap: '20px', marginTop: '40px', flexWrap: 'wrap',
        }}>
          <a
            href="#waitlist"
            style={{
              display: 'inline-flex', alignItems: 'center',
              padding: '14px 32px',
              background: '#ffffff', color: '#000000',
              borderRadius: '10px', fontWeight: 700,
              fontSize: '0.92rem', letterSpacing: '-0.01em',
              textDecoration: 'none',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(255,255,255,0.14)';
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
              color: 'var(--text-3)', fontSize: '0.88rem',
              fontWeight: 500, textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-1)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-3)')}
          >
            See what&apos;s inside ↓
          </a>
        </div>
      </div>

      {/* ── RIGHT: floating cards panel ── */}
      <div
        className="hero-cards-panel"
        style={{
          position: 'relative', zIndex: 1,
          minHeight: '100svh',
        }}
      >
        {/* Vertical dashed connector */}
        {mounted && (
          <svg
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              pointerEvents: 'none', opacity: 0.08,
            }}
            viewBox="0 0 400 800"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d="M160 96 C200 96, 220 224, 260 224 C300 224, 260 384, 200 384 C140 384, 180 504, 220 504 C260 504, 240 640, 180 640"
              stroke="#22c55e"
              strokeWidth="1.5"
              strokeDasharray="5 8"
            />
          </svg>
        )}

        {mounted && floatingCards.map((card, idx) => (
          <div
            key={idx}
            style={{
              position: 'absolute',
              top: card.top,
              left: card.left,
              background: 'rgba(15,15,15,0.9)',
              border: `1px solid ${card.up ? 'rgba(34,197,94,0.22)' : 'rgba(239,68,68,0.22)'}`,
              borderRadius: '14px',
              padding: '16px 20px',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              boxShadow: `0 12px 40px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04)`,
              animation: `hero-float-${idx} ${5.5 + idx * 0.4}s ease-in-out infinite`,
              animationDelay: card.delay,
              minWidth: '140px',
            }}
          >
            <div style={{
              fontFamily: 'var(--mono)', fontSize: '10px', fontWeight: 700,
              color: 'var(--text-4)', letterSpacing: '0.08em',
              textTransform: 'uppercase', marginBottom: '8px',
            }}>
              {card.sym}
            </div>
            <div style={{
              fontSize: '20px', fontWeight: 800,
              color: 'var(--text-1)', letterSpacing: '-0.02em',
              lineHeight: 1, marginBottom: '6px',
            }}>
              {card.price}
            </div>
            <div style={{
              fontFamily: 'var(--mono)', fontSize: '12px', fontWeight: 700,
              color: card.up ? 'var(--green)' : 'var(--red)',
            }}>
              {card.chg}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes hero-float-0 { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-12px)} }
        @keyframes hero-float-1 { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-16px)} }
        @keyframes hero-float-2 { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-10px)} }
        @keyframes hero-float-3 { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-14px)} }
        @keyframes hero-float-4 { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-9px)} }
        @media (max-width: 860px) {
          .hero-section { grid-template-columns: 1fr !important; }
          .hero-cards-panel { display: none; }
        }
      `}</style>
    </section>
  );
}
