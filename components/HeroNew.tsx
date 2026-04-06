'use client';

import { useState, useEffect } from 'react';

// --- SVGs for Chrome UI ---
const TabShape = ({ active }: { active: boolean }) => (
  <svg 
    viewBox="0 0 240 34" 
    preserveAspectRatio="none"
    style={{ 
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '34px',
      width: '100%',
      zIndex: -1,
      display: active ? 'block' : 'none'
    }}
  >
    <path 
      d="M214 0C214 0 214.5 0 215.5 0C218 0 220 2 220 4.5V26.5C220 30.6421 223.358 34 227.5 34H240H0H12.5C16.6421 34 20 30.6421 20 26.5V4.5C20 2 22 0 24.5 0C25.5 0 26 0 26 0H214Z" 
      fill="#2d2f34" 
    />
  </svg>
);

const Icons = {
  Back: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
  ),
  Forward: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3 }}><path d="m9 18 6-6-6-6"/></svg>
  ),
  Refresh: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
  ),
  Home: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
  ),
  Star: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
  ),
  Search: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
  ),
  More: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
  )
};

export default function HeroNew() {
  const [email, setEmail] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const progress = Math.min(scrollY / 400, 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' });
  };

  const tabs = [
    { title: 'NIFTY50 Index', active: true, icon: '📈' },
    { title: 'How -2% turned into 5% this...', active: false, icon: '𝕏' },
    { title: 'SAP BSE SENSEX/(^BSESN)', active: false, icon: '📊' },
    { title: 'Indian Stocks advance after U...', active: false, icon: '📰' },
    { title: 'What happened to Reliance?', active: false, icon: '💡' },
  ];

  // Mobile-only filter for tabs - Guarded for hydration
  const visibleTabs = (hasMounted && isMobile) ? tabs.slice(0, 3) : tabs;
  const addressUrl = (hasMounted && isMobile) ? 'ziromarket.io' : 'Search Google or type a URL';
  const showControls = (hasMounted && !isMobile);

  return (
    <section style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      background: 'var(--bg)',
      padding: (hasMounted && isMobile) ? '40px 0 10px' : '40px 20px 20px',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'var(--font-inter), sans-serif'
    }}>
      {/* Unified Browser/Hero Container - Synchronized width for perfect alignment */}
      <div style={{
        width: '100%',
        maxWidth: (hasMounted && isMobile) ? '100%' : 'clamp(280px, 96%, 1600px)',
        padding: (hasMounted && isMobile) ? '0 20px' : '0',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        margin: '0 auto', // Extra insurance for centering
      }}>
        {/* Chrome Style Browser Header */}
        <div style={{
          width: '100%',
          background: '#202124',
          borderRadius: '12px 12px 0 0',
          paddingTop: '8px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          zIndex: 10,
          overflow: 'hidden',
          border: 'none',
        }}
        className="browser-header">
          {/* Tabs Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: (hasMounted && isMobile) ? '0 0 0 12px' : '0 12px',
            height: '34px',
            gap: '4px'
          }}>
            {/* Window Controls - Red, Yellow, Green (Hidden on very small screens) */}
            {showControls && (
              <div style={{ display: 'flex', gap: '8px', paddingRight: '12px', paddingLeft: '4px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }} />
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }} />
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }} />
              </div>
            )}

            {/* Tabs List */}
            <div style={{ display: 'flex', flex: 1, height: '100%', alignItems: 'flex-end', overflow: 'hidden' }}>
              {visibleTabs.map((tab, idx) => (
                <div 
                  key={idx}
                  style={{
                    position: 'relative',
                    height: '34px',
                    minWidth: (hasMounted && isMobile) ? '120px' : '140px',
                    maxWidth: (hasMounted && isMobile) ? '160px' : '200px',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 16px',
                    fontSize: '12px',
                    color: tab.active ? '#fff' : 'rgba(255, 255, 255, 0.7)',
                    cursor: 'default',
                    zIndex: tab.active ? 2 : 1,
                    marginLeft: idx === 0 ? '0' : '-12px',
                  }}
                >
                  {/* Tab Shape Background */}
                  <svg 
                    viewBox="0 0 240 34" 
                    preserveAspectRatio="none"
                    style={{ 
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '34px',
                      width: '100%',
                      zIndex: -1,
                      display: tab.active ? 'block' : 'none'
                    }}
                  >
                    <path 
                      d="M214 0C214 0 214.5 0 215.5 0C218 0 220 2 220 4.5V26.5C220 30.6421 223.358 34 227.5 34H240H0H12.5C16.6421 34 20 30.6421 20 26.5V4.5C20 2 22 0 24.5 0C25.5 0 26 0 26 0H214Z" 
                      fill="#2d2f34" 
                    />
                  </svg>

                  {/* Tab Content */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', overflow: 'hidden' }}>
                    <span style={{ fontSize: '14px' }}>{tab.icon}</span>
                    <span style={{ 
                      whiteSpace: 'nowrap', 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis',
                      flex: 1
                    }}>{tab.title}</span>
                    {showControls && <span style={{ opacity: 0.5, fontSize: '14px', cursor: 'pointer' }}>×</span>}
                  </div>
                </div>
              ))}
              
              {/* Add Tab Button */}
              <div style={{
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(255,255,255,0.7)',
                fontSize: '18px',
                marginBottom: '3px',
                marginLeft: '4px',
                cursor: 'pointer'
              }}>+</div>
            </div>

            {/* Window Dropdown */}
            <div style={{ 
              marginLeft: 'auto', 
              padding: (hasMounted && isMobile) ? '8px' : '0 8px', 
              color: 'rgba(255,255,255,0.7)', 
              cursor: 'pointer' 
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>

          {/* Address Bar Row - Simplified for Mobile */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            height: (hasMounted && isMobile) ? '38px' : '44px',
            padding: (hasMounted && isMobile) ? '0 0 0 8px' : '0 8px',
            gap: '8px',
            background: '#2d2f34'
          }}>
            {/* Navigation Controls - Hidden on mobile */}
            {showControls && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fff' }}>
                <div style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', cursor: 'pointer' }}>
                  <Icons.Back />
                </div>
                <div style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', cursor: 'pointer' }}>
                  <Icons.Forward />
                </div>
                <div style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', cursor: 'pointer' }}>
                  <Icons.Refresh />
                </div>
                <div style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', cursor: 'pointer', marginLeft: '4px' }}>
                  <Icons.Home />
                </div>
              </div>
            )}

            {/* URL Input Area - Full width on Mobile */}
            <div style={{
              flex: 1,
              height: '28px',
              background: '#202124',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              padding: '0 12px',
              gap: '8px',
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: (hasMounted && isMobile) ? '12px' : '13px'
            }}>
              <div style={{ color: '#4285f4' }}>
                <Icons.Search />
              </div>
              <span style={{ 
                flex: 1, 
                whiteSpace: 'nowrap', 
                overflow: 'hidden', 
                textOverflow: 'ellipsis' 
              }}>{addressUrl}</span>
              {showControls && (
                <div style={{ cursor: 'pointer' }}>
                  <Icons.Star />
                </div>
              )}
            </div>

            {/* Right Controls - Hidden on mobile */}
            {showControls && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'rgba(255, 255, 255, 0.7)' }}>
                 <div style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', overflow: 'hidden' }}>
                   <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#5f6368' }} />
                 </div>
                 <div style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                   <Icons.More />
                 </div>
              </div>
            )}
          </div>
        </div>

        {/* Hero Content Area with Top Fading Effect */}
        <div className="container-huge" style={{ 
          position: 'relative',
          textAlign: 'center',
          background: '#0a0e12',
          width: '100%',
          padding: (hasMounted && isMobile) ? 'clamp(40px, 6vh, 80px) 20px 40px' : 'clamp(80px, 10vh, 160px) 20px 40px',
          zIndex: 1,
          borderRadius: (hasMounted && isMobile) ? '0 0 24px 24px' : '0 0 32px 32px',
          overflow: 'hidden',
          border: 'none',
        }}>
          {/* Subtle Fade Transition from Browser Header */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '100px',
            background: 'linear-gradient(180deg, #2d2f34 0%, transparent 100%)',
            zIndex: -1,
            opacity: 0.6
          }} />

          {/* Main Headline */}
          <h1 style={{
            fontSize: 'clamp(2.1rem, 7vw, 6rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            color: '#fff',
            marginBottom: 'clamp(24px, 4vh, 48px)',
            letterSpacing: '-0.04em',
            margin: '0 auto clamp(24px, 3vh, 40px)',
            maxWidth: '100%',
          }}>
            Tired Of Juggling
            <br />
            Platforms To Keep Track
            <br />
            Of The Market
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: 'clamp(0.95rem, 1.5vw, 1.25rem)',
            color: 'rgba(255,255,255,0.6)',
            maxWidth: '100%',
            margin: '0 auto clamp(40px, 6vh, 80px)',
            lineHeight: 1.6
          }}>
            Keeping up with the market doesn't have to be such a chore
          </p>

          {/* Single Join Now CTA */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            margin: '0 auto clamp(60px, 8vh, 100px)',
            zIndex: 10
          }}>
            <button
              onClick={() => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                padding: isMobile ? '16px 32px' : 'clamp(14px, 1.8vh, 22px) clamp(32px, 4vw, 64px)',
                background: '#fff',
                color: '#000',
                border: 'none',
                borderRadius: '12px',
                fontSize: isMobile ? '1.1rem' : 'clamp(1.1rem, 1.4vw, 1.3rem)',
                fontWeight: 800,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1)',
                transition: 'transform 0.22s var(--ease-out), background 0.22s ease, box-shadow 0.22s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                e.currentTarget.style.background = '#f8f8f8';
                e.currentTarget.style.boxShadow = '0 30px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.background = '#fff';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1)';
              }}
            >
              Join the Network Now →
            </button>
          </div>

          {/* App Screen Recording Video Container */}
          <div style={{
            width: isMobile ?  '75%': '100%',
            maxWidth: 'clamp(260px, 85vw, 540px)',
            margin: '0 auto',
            position: 'relative',
            borderRadius: isMobile ? '25px' : '75px',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            transform: (hasMounted && isMobile) ? 'none' : `scale(${1 - scrollProgress * 0.15}) translateY(calc(clamp(40px, 6vh, 80px) - ${scrollProgress * 220}px))`, 
            transition: 'transform 0.1s linear, border-radius 0.1s linear',
            zIndex: 5
          }}>
            <video 
              src="/screen_recordings/untitled.webm"
              autoPlay 
              muted 
              loop 
              playsInline
              style={{
                width: '100%',
                height: 'auto',
                display: 'block'
              }}
            />
            {/* Subtle overlay to enhance premium feel */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 100%)',
              pointerEvents: 'none'
            }} />
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .browser-header {
            font-size: 11px;
          }
        }
        
        @media (max-width: 480px) {
          /* Additional mobile specific styles */
        }
      `}</style>
    </section>
  );
}
