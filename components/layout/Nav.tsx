'use client';
import { useEffect, useState } from 'react';
import { isLaunched } from '@/lib/launchMode';

const LINKS = [
  { href: '#features', label: 'App' },
  { href: '#pain',     label: 'Why' },
  { href: '#pivot',    label: 'Manifesto' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const launched = isLaunched();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  return (
    <nav
      className="nav"
      style={{
        position: 'sticky', top: 0, zIndex: 500,
        height: 60, display: 'flex', alignItems: 'center',
        background: 'rgba(255,255,255,0.94)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: scrolled ? '1px solid rgba(11,59,46,0.12)' : '1px solid rgba(11,59,46,0.06)',
        transition: 'background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease',
        boxShadow: scrolled ? '0 1px 24px rgba(11,59,46,0.06)' : 'none',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        {/* Logo */}
        <a href="#top" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/app_icon/ziro.png" alt="Ziro" style={{ width: 24, height: 24, borderRadius: 4, display: 'block' }} />
          <span style={{
            fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.06em',
            textTransform: 'uppercase', color: '#0b3b2e', fontFamily: 'var(--sans)',
          }}>
            Ziro Market
          </span>
        </a>

        {/* Desktop nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {LINKS.map((l) => (
            <a
              key={l.href} href={l.href}
              className="nav-link-md"
              style={{
                fontSize: '0.82rem', color: 'rgba(11,59,46,0.60)',
                fontWeight: 500, letterSpacing: '0.01em',
                transition: 'color 0.15s',
              }}
            >{l.label}</a>
          ))}
          <a
            href={launched ? '#download' : '#waitlist'}
            className="btn btn-primary btn-sm nav-cta-md"
            aria-label={launched ? 'Download Ziro Market' : 'Get early access to Ziro Market'}
          >
            {launched ? 'Download' : 'Early Access'}
          </a>
          <button
            type="button"
            className="nav-burger"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="nav-sheet"
            onClick={() => setMenuOpen((o) => !o)}
            style={{
              background: 'transparent', border: '1px solid rgba(11,59,46,0.20)',
              borderRadius: 4, width: 36, height: 36, cursor: 'pointer',
              color: '#0b3b2e', display: 'none', alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column', gap: 4, padding: '0 10px',
            }}
          >
            <span style={{ display: 'block', width: '100%', height: '1.5px', background: 'currentColor', transition: 'transform 0.2s, opacity 0.2s' }} />
            <span style={{ display: 'block', width: '100%', height: '1.5px', background: 'currentColor', transition: 'transform 0.2s, opacity 0.2s' }} />
            <span style={{ display: 'block', width: '70%', height: '1.5px', background: 'currentColor' }} />
          </button>
        </div>
      </div>

      {/* Mobile sheet */}
      {menuOpen && (
        <div
          id="nav-sheet"
          role="dialog"
          aria-label="Navigation menu"
          style={{
            position: 'absolute', top: 60, left: 0, right: 0,
            background: 'rgba(239, 233, 221, 0.98)',
            borderBottom: '1px solid rgba(11,59,46,0.12)',
            padding: '24px 28px 32px',
            display: 'flex', flexDirection: 'column', gap: 0,
            backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          {LINKS.map((l) => (
            <a
              key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
              style={{
                fontSize: '1.2rem', fontFamily: 'var(--sans)', fontWeight: 600,
                color: '#0b3b2e', padding: '14px 0',
                borderBottom: '1px solid rgba(11,59,46,0.10)',
              }}
            >
              {l.label}
            </a>
          ))}
          <a
            href={launched ? '#download' : '#waitlist'}
            onClick={() => setMenuOpen(false)}
            className="btn btn-primary"
            style={{ marginTop: 24, alignSelf: 'flex-start' }}
          >
            {launched ? 'Download →' : 'Get Early Access →'}
          </a>
        </div>
      )}

      <style>{`
        .nav-link-md { display: none !important; }
        .nav-cta-md  { display: none !important; }
        @media (min-width: 768px) {
          .nav-link-md { display: inline !important; }
          .nav-cta-md  { display: inline-flex !important; }
          .nav-burger  { display: none !important; }
        }
        @media (max-width: 767px) {
          .nav-burger { display: inline-flex !important; }
        }
        .nav-link-md:hover { color: #0b3b2e !important; }
      `}</style>
    </nav>
  );
}
