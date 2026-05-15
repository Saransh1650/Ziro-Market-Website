'use client';

import { useEffect, useState } from 'react';

const floatingCards = [
  { sym: 'RELIANCE', price: '₹2,847', chg: '+2.4%', up: true,  top: '18%',  right: '18%', delay: '0s'    },
  { sym: 'NIFTY 50', price: '22,847', chg: '+0.6%', up: true,  top: '36%',  right: '6%',  delay: '0.4s'  },
  { sym: 'INFY',     price: '₹1,634', chg: '-0.8%', up: false, top: '54%',  right: '22%', delay: '0.8s'  },
  { sym: 'TCS',      price: '₹4,122', chg: '+3.1%', up: true,  top: '68%',  right: '9%',  delay: '1.2s'  },
];

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section
      style={{
        minHeight: '100svh',
        background: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 'clamp(120px, 18vh, 200px) clamp(24px, 5vw, 80px) clamp(60px, 8vh, 100px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Dot grid texture */}
      <div
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.018) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Green ambient glow — behind headline */}
      <div
        style={{
          position: 'absolute',
          top: '30%', left: '-5%',
          width: '50%', height: '40%',
          background: 'radial-gradient(ellipse, rgba(34,197,94,0.07) 0%, transparent 65%)',
          pointerEvents: 'none',
          filter: 'blur(40px)',
        }}
      />

      {/* Layout: text left + cards right */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '40px',
          maxWidth: '1400px',
          width: '100%',
        }}
      >
        {/* Left: headline + CTAs */}
        <div style={{ flex: '0 0 auto', maxWidth: '680px' }}>
          <h1
            style={{
              fontSize: 'clamp(56px, 8.5vw, 120px)',
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
              fontSize: 'clamp(16px, 1.4vw, 19px)',
              color: 'var(--green)',
              fontWeight: 500,
              marginTop: '36px',
              lineHeight: 1.4,
            }}
          >
            There&apos;s a simpler way to watch the market.
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              marginTop: '44px',
              flexWrap: 'wrap',
            }}
          >
            <a
              href="#waitlist"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '15px 34px',
                background: '#ffffff',
                color: '#000000',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.95rem',
                letterSpacing: '-0.01em',
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
                color: 'var(--text-3)',
                fontSize: '0.9rem',
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

        {/* Right: floating market data cards */}
        <div
          className="hero-cards-panel"
          style={{
            flex: '1 1 auto',
            position: 'relative',
            minHeight: '400px',
            maxWidth: '460px',
          }}
        >
          {mounted && floatingCards.map((card, idx) => (
            <div
              key={idx}
              style={{
                position: 'absolute',
                top: card.top,
                right: card.right,
                background: 'rgba(17,17,17,0.85)',
                border: `1px solid ${card.up ? 'rgba(34,197,94,0.18)' : 'rgba(239,68,68,0.18)'}`,
                borderRadius: '12px',
                padding: '14px 18px',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03)`,
                animation: `hero-float-${idx} 6s ease-in-out infinite`,
                animationDelay: card.delay,
                minWidth: '130px',
              }}
            >
              <div style={{
                fontFamily: 'var(--mono)',
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--text-3)',
                letterSpacing: '0.06em',
                marginBottom: '6px',
              }}>
                {card.sym}
              </div>
              <div style={{
                fontSize: '18px',
                fontWeight: 800,
                color: 'var(--text-1)',
                letterSpacing: '-0.02em',
                lineHeight: 1,
                marginBottom: '4px',
              }}>
                {card.price}
              </div>
              <div style={{
                fontFamily: 'var(--mono)',
                fontSize: '12px',
                fontWeight: 700,
                color: card.up ? 'var(--green)' : 'var(--red)',
              }}>
                {card.chg}
              </div>
            </div>
          ))}

          {/* Connecting line decoration */}
          {mounted && (
            <svg
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                opacity: 0.12,
              }}
              viewBox="0 0 460 400"
              fill="none"
            >
              <path
                d="M80 80 L160 144 L120 216 L180 272"
                stroke="#22c55e"
                strokeWidth="1"
                strokeDasharray="4 6"
              />
            </svg>
          )}
        </div>
      </div>

      <style>{`
        @keyframes hero-float-0 { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-10px)} }
        @keyframes hero-float-1 { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-14px)} }
        @keyframes hero-float-2 { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-8px)} }
        @keyframes hero-float-3 { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-12px)} }
        @media (max-width: 900px) {
          .hero-cards-panel { display: none; }
        }
      `}</style>
    </section>
  );
}
