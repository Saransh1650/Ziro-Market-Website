'use client';
import { useEffect, useState } from 'react';
import { isLaunched } from '@/lib/launchMode';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const launched = isLaunched();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className="nav"
      style={{
        position: 'sticky', top: 0, zIndex: 500,
        height: 60, display: 'flex', alignItems: 'center',
        background: scrolled ? 'rgba(10,10,10,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border-1)' : '1px solid transparent',
        transition: 'background 0.25s ease, border-color 0.25s ease',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="#top" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span aria-hidden style={{
            width: 22, height: 22, background: 'var(--text-1)', color: '#000',
            display: 'grid', placeItems: 'center', borderRadius: 3,
            fontFamily: 'var(--mono)', fontSize: '0.7rem', fontWeight: 900,
          }}>Z</span>
          <span style={{ fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            ZIRO MARKET
          </span>
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <a href="#features" className="caption" style={{ display: 'none' }} data-show-md>App</a>
          <a href="#pain" className="caption" style={{ display: 'none' }} data-show-md>Why</a>
          <a href="#pivot" className="caption" style={{ display: 'none' }} data-show-md>Manifesto</a>
          <a
            href={launched ? '#download' : '#waitlist'}
            className="btn btn-amber btn-sm"
            aria-label={launched ? 'Download Ziro Market' : 'Get early access to Ziro Market'}
          >
            {launched ? 'Download →' : 'Get Early Access →'}
          </a>
        </div>
      </div>
      <style>{`
        @media (min-width: 768px) { [data-show-md] { display: inline-block !important; } }
      `}</style>
    </nav>
  );
}
