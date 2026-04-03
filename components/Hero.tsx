'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { useMagneticButton } from '@/hooks/useMagneticButton';
import { STOCKS, SECTORS, formatChange } from '@/lib/data';

export default function Hero() {
  const primaryBtnRef = useMagneticButton<HTMLAnchorElement>();
  const ghostBtnRef = useMagneticButton<HTMLAnchorElement>();
  const phoneWrapRef = useRef<HTMLDivElement>(null);
  const phoneFrameRef = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState('09:15:32');
  const [mounted, setMounted] = useState(false);

  // Generate sector data once on mount to avoid hydration mismatch
  const sectorData = useMemo(() => {
    return SECTORS.slice(0, 10).map((sector, i) => {
      // Use deterministic mock values for landing page to avoid hydration mismatch
      const seed = (i * 0.13) % 1;
      const val = (seed - 0.5) * 4;
      const color =
        val > 1.5
          ? '#22c55e'
          : val > 0
          ? '#10b981'
          : val > -1.5
          ? '#ef4444'
          : '#dc2626';
      return { ...sector, val, color };
    });
  }, []);

  useEffect(() => {
    setMounted(true); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  useEffect(() => {
    // Update phone time
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Idle gentle float animation for phone wrap
    let floatT = 0;
    const phoneWrap = phoneWrapRef.current;

    function floatPhone() {
      floatT += 0.015;
      if (phoneWrap) {
        phoneWrap.style.transform = `translateY(${Math.sin(floatT) * 8}px)`;
      }
      requestAnimationFrame(floatPhone);
    }

    floatPhone();
  }, []);

  useEffect(() => {
    // Phone frame 3D tilt on mouse move
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

      phoneFrame.style.transform = `perspective(1000px) rotateY(${dx * 8}deg) rotateX(${-dy * 6}deg) translateY(-6px)`;
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

  // Generate top movers with animation
  const topMovers = STOCKS.slice(0, 5).map((stock) => {
    const change = ((stock.price - stock.base) / stock.base) * 100;
    return { ...stock, change };
  });

  // Animated stock rows
  useEffect(() => {
    if (!mounted) return;
    
    const rows = document.querySelectorAll('.pm-row');
    rows.forEach((row, i) => {
      setTimeout(() => {
        row.classList.add('animate-in');
      }, i * 150);
    });
  }, [mounted]);

  return (
    <section className="hero" id="hero">
      <div className="hero-bg-grid"></div>
      <div className="container hero-content">
        <div className="hero-layout">
          {/* Left */}
          <div className="hero-left">
            <div className="hero-eyebrow" data-reveal="up">
              <div className="badge badge-live">Mobile Intelligence</div>
            </div>
            <h1 className="hero-title" data-reveal="up" data-delay="100" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)' }}>
              Understand What&apos;s
              <br />
              Moving the
              <br />
              <span style={{ color: 'var(--accent-2)' }}>Indian Market</span>
            </h1>
            <p className="hero-sub" data-reveal="up" data-delay="200" style={{ fontSize: '1.05rem', maxWidth: '540px' }}>
              A mobile intelligence platform that reveals market signals, sector momentum, and stock conversations.
            </p>
            <div className="hero-cta" data-reveal="up" data-delay="300">
              <a
                href="#waitlist"
                className="btn btn-primary btn-lg"
                ref={primaryBtnRef}
              >
                Join Early Access
              </a>
              <a
                href="#features"
                className="btn btn-ghost btn-lg"
                ref={ghostBtnRef}
              >
                Explore Signals
              </a>
            </div>
            <div className="store-badges" data-reveal="up" data-delay="400">
              <div className="store-badge">
                <span className="sb-icon">📱</span>
                <div className="sb-text">
                  <small>Available on</small>
                  <strong>App Store</strong>
                </div>
              </div>
              <div className="store-badge">
                <span className="sb-icon">🤖</span>
                <div className="sb-text">
                  <small>Available on</small>
                  <strong>Google Play</strong>
                </div>
              </div>
            </div>
            <p className="hero-note" data-reveal="up" data-delay="500">
              100% free early access. Secure your spot on the waitlist.
            </p>
          </div>

          {/* Right: Phone Mockup */}
          <div
            className="phone-wrap"
            data-reveal="scale"
            data-delay="200"
            ref={phoneWrapRef}
          >
            <div className="phone-glow"></div>
            
            {/* Floating App Notifications */}
            <div className="floating-notifs">
              <div className="f-notif fn-1" style={{ top: '10%', left: '-80px', animationDelay: '0s' }}>
                <div className="fn-icon">📈</div>
                <div className="fn-content">
                  <strong>NIFTY 50</strong>
                  <span>Crossing 22,850</span>
                </div>
              </div>
              <div className="f-notif fn-2" style={{ top: '60%', right: '-90px', animationDelay: '1s' }}>
                <div className="fn-icon">⚡</div>
                <div className="fn-content">
                  <strong>Volume Spike</strong>
                  <span>TATA MOTORS 8x</span>
                </div>
              </div>
              <div className="f-notif fn-3" style={{ bottom: '20%', left: '-100px', animationDelay: '2s' }}>
                <div className="fn-icon">🔔</div>
                <div className="fn-content">
                  <strong>Alert Hit</strong>
                  <span>SBIN Above ₹790</span>
                </div>
              </div>
            </div>

            <div className="phone-frame" ref={phoneFrameRef}>
              <div className="phone-screen" style={{ padding: 0, overflow: 'hidden' }}>
                <img 
                  src="/screenshots/dashboard.png" 
                  alt="Trade Insights App Dashboard" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                
                {/* Floating Alert Overlay */}
                <div className="phone-overlay-alert">
                  <div className="poa-tag">VOLUME SURGE</div>
                  <div className="poa-title">ADANIENT +4.2%</div>
                  <div className="poa-sub">5.2x relative volume detected</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
