'use client';

import { useState } from 'react';

const painData = [
  {
    app: 'NSE website',
    note: 'loads in 5 seconds',
    rating: 'SLOW',
    ratingColor: '#ef4444',
    headline: "Built in 2003.\nStill feels like it.",
    stat: { value: '5+', unit: 'seconds to load' },
    points: [
      'Data buried under multiple page reloads',
      'No live prices — everything is delayed',
      'Circuit breaker info? Three clicks deep.',
    ],
  },
  {
    app: 'Moneycontrol',
    note: '16 ads. you counted.',
    rating: 'NOISY',
    ratingColor: '#f97316',
    headline: "The ads load\nfaster than the data.",
    stat: { value: '16', unit: 'ads per page' },
    points: [
      'Autoplay video in the corner, always',
      'The analysis you need is behind a paywall',
      'Four different loading spinners at once',
    ],
  },
  {
    app: 'Google Finance',
    note: 'shows USD by default',
    rating: 'WRONG MARKET',
    ratingColor: '#eab308',
    headline: "Defaults to Wall Street.\nYou trade Dalal Street.",
    stat: { value: 'USD', unit: 'default currency' },
    points: [
      'NIFTY data is buried, US stocks up front',
      'Sector data for Indian markets is missing',
      'Searches default to US companies first',
    ],
  },
  {
    app: 'Screener.in',
    note: 'fundamentals, finally',
    rating: 'INCOMPLETE',
    ratingColor: '#a78bfa',
    headline: "Great fundamentals.\nZero live data.",
    stat: { value: '0', unit: 'live price updates' },
    points: [
      'No real-time prices or market overview',
      'No sector heatmap or top movers',
      'Screener for stocks, not for markets',
    ],
  },
  {
    app: 'Your broker app',
    note: 'no sector data',
    rating: 'BLIND SPOTS',
    ratingColor: '#ef4444',
    headline: "Good for trades.\nUseless for decisions.",
    stat: { value: 'Ø', unit: 'sector context' },
    points: [
      'No idea why a sector is actually moving',
      'Portfolio view with zero benchmarking',
      'News is generic, not stock-specific',
    ],
  },
  {
    app: 'Reddit thread',
    note: 'from March 2021',
    rating: 'OUTDATED',
    ratingColor: '#f97316',
    headline: "Up 400 votes.\nFrom three years ago.",
    stat: { value: '2021', unit: 'last relevant post' },
    points: [
      'Bull-market advice in a bear market',
      'Anonymous accounts, no track record',
      'No way to know if the thesis still holds',
    ],
  },
  {
    app: 'That Twitter list',
    note: 'person stopped posting',
    rating: 'ABANDONED',
    ratingColor: '#6b7280',
    headline: "Your best source\nstopped posting in June.",
    stat: { value: '6mo', unit: 'since last post' },
    points: [
      'No alert when accounts go silent',
      'Thread context lost in the feed',
      'Algorithm buries signal under noise',
    ],
  },
];

export default function PainSection() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const active = hoveredIdx !== null ? painData[hoveredIdx] : null;

  return (
    <section
      id="pain"
      style={{
        background: 'var(--bg)',
        padding: 'clamp(80px, 12vh, 140px) clamp(24px, 5vw, 120px)',
        borderTop: '1px solid var(--border)',
      }}
    >
      <p style={{
        fontFamily: 'var(--mono)', fontSize: '11px', fontWeight: 700,
        letterSpacing: '0.12em', color: 'var(--text-4)',
        textTransform: 'uppercase', marginBottom: '32px',
      }}>
        YOUR CURRENT SETUP
      </p>

      <h2
        data-reveal="up"
        style={{
          fontSize: 'clamp(28px, 3.5vw, 48px)', fontWeight: 800,
          color: 'var(--text-1)', letterSpacing: '-0.04em',
          marginBottom: '56px', maxWidth: '560px', lineHeight: 1.1,
        }}
      >
        The apps most investors<br />have open right now.
      </h2>

      {/* Two-column layout */}
      <div style={{ display: 'flex', gap: 'clamp(40px, 6vw, 100px)', alignItems: 'flex-start' }}>

        {/* Left: list */}
        <div style={{ flex: '0 0 auto', width: 'min(480px, 100%)' }}>
          {painData.map((item, idx) => (
            <div
              key={idx}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              data-reveal="up"
              data-delay={String(idx * 60)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '18px 16px',
                borderBottom: '1px solid var(--border)',
                gap: '16px',
                cursor: 'default',
                borderRadius: '8px',
                transition: 'background 0.15s, border-color 0.15s',
                background: hoveredIdx === idx ? 'rgba(255,255,255,0.03)' : 'transparent',
                marginBottom: '2px',
              }}
            >
              <span style={{
                fontSize: 'clamp(18px, 2.5vw, 32px)',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                lineHeight: 1,
                color: hoveredIdx === idx ? '#fff' : `rgba(255,255,255,${1 - idx * 0.07})`,
                transition: 'color 0.15s',
              }}>
                {item.app}
              </span>
              <span style={{
                fontFamily: 'var(--mono)', fontSize: '11px',
                color: hoveredIdx === idx ? 'var(--text-3)' : 'var(--text-4)',
                fontStyle: 'italic', flexShrink: 0,
                transition: 'color 0.15s',
              }}>
                {item.note}
              </span>
            </div>
          ))}
        </div>

        {/* Right: detail panel */}
        <div
          style={{
            flex: 1,
            position: 'sticky',
            top: '120px',
            minHeight: '320px',
          }}
        >
          {/* Default state */}
          <div style={{
            opacity: active ? 0 : 1,
            transition: 'opacity 0.2s',
            position: active ? 'absolute' : 'relative',
            pointerEvents: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            height: '320px',
            gap: '12px',
          }}>
            <p style={{
              fontFamily: 'var(--mono)', fontSize: '12px',
              color: 'var(--text-4)', letterSpacing: '0.08em',
            }}>
              ← hover a row
            </p>
          </div>

          {/* Active state */}
          {active && (
            <div
              key={active.app}
              style={{
                background: 'var(--bg-1)',
                border: `1px solid ${active.ratingColor}22`,
                borderRadius: '20px',
                padding: 'clamp(28px, 3vw, 40px)',
                position: 'relative',
                overflow: 'hidden',
                animation: 'pain-panel-in 0.2s cubic-bezier(0.16,1,0.3,1) both',
              }}
            >
              {/* Top accent line */}
              <div style={{
                position: 'absolute', top: 0, left: '10%', right: '10%', height: '1px',
                background: `linear-gradient(90deg, transparent, ${active.ratingColor}55, transparent)`,
              }} />

              {/* Rating badge */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '4px 12px', borderRadius: '99px',
                background: `${active.ratingColor}14`,
                border: `1px solid ${active.ratingColor}30`,
                marginBottom: '24px',
              }}>
                <span style={{
                  width: 5, height: 5, borderRadius: '50%',
                  background: active.ratingColor, display: 'inline-block',
                }} />
                <span style={{
                  fontFamily: 'var(--mono)', fontSize: '10px', fontWeight: 700,
                  letterSpacing: '0.1em', color: active.ratingColor,
                  textTransform: 'uppercase',
                }}>
                  {active.rating}
                </span>
              </div>

              {/* Big stat */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{
                  fontSize: 'clamp(48px, 5vw, 72px)',
                  fontWeight: 900, color: active.ratingColor,
                  letterSpacing: '-0.04em', lineHeight: 1,
                  fontFamily: 'var(--mono)',
                }}>
                  {active.stat.value}
                </div>
                <div style={{
                  fontFamily: 'var(--mono)', fontSize: '12px',
                  color: 'var(--text-4)', marginTop: '4px',
                  letterSpacing: '0.04em',
                }}>
                  {active.stat.unit}
                </div>
              </div>

              {/* Headline */}
              <h3 style={{
                fontSize: 'clamp(20px, 2.2vw, 28px)',
                fontWeight: 800, color: 'var(--text-1)',
                letterSpacing: '-0.03em', lineHeight: 1.15,
                whiteSpace: 'pre-line', marginBottom: '24px',
              }}>
                {active.headline}
              </h3>

              {/* Pain points */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {active.points.map((pt, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <span style={{
                      width: '5px', height: '5px', borderRadius: '50%',
                      background: 'var(--text-4)', marginTop: '7px', flexShrink: 0,
                    }} />
                    <span style={{
                      fontSize: '14px', color: 'var(--text-2)', lineHeight: 1.6,
                    }}>
                      {pt}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes pain-panel-in {
          from { opacity: 0; transform: translateY(10px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @media (max-width: 860px) {
          #pain > div:last-child > div:last-child {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}
