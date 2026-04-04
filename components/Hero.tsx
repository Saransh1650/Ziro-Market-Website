'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { SECTORS } from '@/lib/data';

export default function Hero() {
  const phoneWrapRef = useRef<HTMLDivElement>(null);
  const phoneFrameRef = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState('09:15');
  const [mounted, setMounted] = useState(false);

  // Generate sector data - clean and minimal
  const sectorData = useMemo(() => {
    return SECTORS.slice(0, 6).map((sector, i) => {
      const seed = (i * 0.13) % 1;
      const val = (seed - 0.5) * 4;
      const color =
        val > 1
          ? '#22c55e'
          : val > 0
          ? '#10b981'
          : val > -1
          ? '#ef4444'
          : '#dc2626';
      return { ...sector, val, color };
    });
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Gentle float animation
    let floatT = 0;
    const phoneWrap = phoneWrapRef.current;

    function floatPhone() {
      floatT += 0.012;
      if (phoneWrap) {
        phoneWrap.style.transform = `translateY(${Math.sin(floatT) * 12}px)`;
      }
      requestAnimationFrame(floatPhone);
    }

    floatPhone();
  }, []);

  useEffect(() => {
    // 3D tilt on mouse move
    const phoneFrame = phoneFrameRef.current;
    if (!phoneFrame) return;

    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!hasFinePointer) return;

    const handleMouseMove = (e: MouseEvent) => {
      const bounds = phoneFrame.getBoundingClientRect();
      const cx = bounds.left + bounds.width / 2;
      const cy = bounds.top + bounds.height / 2;
      const dx = (e.clientX - cx) / window.innerWidth;
      const dy = (e.clientY - cy) / window.innerHeight;

      phoneFrame.style.transform = `perspective(1200px) rotateY(${dx * 12}deg) rotateX(${-dy * 10}deg)`;
    };

    const handleMouseLeave = () => {
      phoneFrame.style.transform = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <section className="hero" id="hero" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: '80px', paddingBottom: '60px' }}>
      <div className="container hero-content">
        <div className="hero-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
          {/* Left Side */}
          <div className="hero-left">
            <h1 style={{ 
              fontSize: 'clamp(3rem, 6vw, 5.5rem)', 
              fontWeight: 900, 
              lineHeight: 1.05, 
              letterSpacing: '-0.04em',
              marginBottom: '28px',
              color: 'var(--text-1)'
            }}>
              Understand the
              <br />
              Market Faster
            </h1>
            <p style={{ 
              fontSize: '1.3rem', 
              lineHeight: 1.6, 
              color: 'var(--text-2)', 
              maxWidth: '500px', 
              marginBottom: '52px' 
            }}>
              Real-time insights on Indian stocks, sectors, and market trends — all in one beautiful mobile app.
            </p>
            <div>
              <a
                href="#waitlist"
                className="btn btn-primary btn-lg"
                style={{ fontSize: '1.15rem', padding: '20px 48px', display: 'inline-flex' }}
              >
                Join Early Access
              </a>
            </div>
          </div>

          {/* Right Side - Large Phone Mockup */}
          <div
            className="phone-wrap"
            ref={phoneWrapRef}
            style={{ 
              position: 'relative', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center'
            }}
          >
            {/* Glow effect */}
            <div style={{
              position: 'absolute',
              width: '320px',
              height: '520px',
              borderRadius: '40%',
              background: 'radial-gradient(ellipse, rgba(58,110,165,0.25) 0%, transparent 70%)',
              filter: 'blur(60px)',
              pointerEvents: 'none'
            }}></div>

            {/* Phone Frame */}
            <div 
              ref={phoneFrameRef}
              style={{
                width: '300px',
                minHeight: '600px',
                background: 'var(--bg-2)',
                border: '2px solid var(--border-2)',
                borderRadius: '48px',
                overflow: 'hidden',
                position: 'relative',
                boxShadow: '0 40px 100px rgba(0,0,0,0.8), 0 0 0 0.5px rgba(255,255,255,0.06) inset',
                transition: 'transform 0.3s ease'
              }}
            >
              {/* Notch */}
              <div style={{
                height: '40px',
                background: 'var(--bg-1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderBottom: '1px solid var(--border)'
              }}>
                <div style={{
                  width: '120px',
                  height: '6px',
                  background: 'var(--bg-3)',
                  borderRadius: '99px'
                }}></div>
              </div>

              {/* Screen Content */}
              <div style={{ padding: '24px 20px' }}>
                {/* Time */}
                <div style={{ 
                  textAlign: 'center', 
                  fontSize: '0.7rem', 
                  fontFamily: 'var(--mono)', 
                  color: 'var(--text-4)',
                  marginBottom: '32px'
                }}>
                  {time}
                </div>

                {/* Title */}
                <h2 style={{ 
                  fontSize: '1.8rem', 
                  fontWeight: 900, 
                  color: 'var(--text-1)',
                  marginBottom: '10px',
                  letterSpacing: '-0.02em'
                }}>
                  Market Overview
                </h2>
                <p style={{ 
                  fontSize: '0.75rem', 
                  color: 'var(--text-3)',
                  marginBottom: '32px'
                }}>
                  Live sector performance
                </p>

                {/* Heatmap Grid */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(2, 1fr)', 
                  gap: '12px'
                }}>
                  {mounted && sectorData.map((sector) => (
                    <div
                      key={sector.name}
                      style={{
                        background: sector.color,
                        borderRadius: '16px',
                        padding: '24px 20px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        minHeight: '95px',
                        justifyContent: 'center',
                        transition: 'transform 0.2s ease',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      <div style={{ 
                        fontSize: '0.7rem', 
                        fontWeight: 700, 
                        color: 'rgba(255,255,255,0.95)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.03em'
                      }}>
                        {sector.name}
                      </div>
                      <div style={{ 
                        fontSize: '1.3rem', 
                        fontWeight: 900, 
                        color: '#fff',
                        fontFamily: 'var(--mono)'
                      }}>
                        {sector.val > 0 ? '+' : ''}{sector.val.toFixed(1)}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
