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
        background: scrolled || menuOpen ? 'rgba(10,10,10,0.92)' : 'transparent',
        backdropFilter: scrolled || menuOpen ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: scrolled || menuOpen ? 'blur(20px)' : 'none',
        borderBottom: scrolled || menuOpen ? '1px solid var(--border-1)' : '1px solid transparent',
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
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="caption nav-link-md">{l.label}</a>
          ))}
          <a
            href={launched ? '#download' : '#waitlist'}
            className="btn btn-amber btn-sm"
            aria-label={launched ? 'Download Ziro Market' : 'Get early access to Ziro Market'}
          >
            {launched ? 'Download →' : 'Get Early Access →'}
          </a>
          <button
            type="button"
            className="nav-burger"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="nav-sheet"
            onClick={() => setMenuOpen((o) => !o)}
            style={{
              background: 'transparent', border: '1px solid var(--border-2)', borderRadius: 4,
              width: 36, height: 36, cursor: 'pointer', color: 'var(--text-1)',
              display: 'none', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <span aria-hidden style={{ display: 'inline-block', width: 16, height: 2, background: 'currentColor', position: 'relative', transition: 'transform 0.2s' }}>
              <span style={{ position: 'absolute', left: 0, right: 0, top: -5, height: 2, background: 'currentColor' }} />
              <span style={{ position: 'absolute', left: 0, right: 0, top: 5,  height: 2, background: 'currentColor' }} />
            </span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          id="nav-sheet"
          role="dialog"
          aria-label="Navigation menu"
          style={{
            position: 'absolute', top: 60, left: 0, right: 0,
            background: 'rgba(10,10,10,0.98)', borderBottom: '1px solid var(--border-1)',
            padding: '20px 28px 28px', display: 'flex', flexDirection: 'column', gap: 16,
          }}
        >
          {LINKS.map((l) => (
            <a
              key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
              style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-1)', padding: '8px 0', borderBottom: '1px solid var(--border-1)' }}
            >
              {l.label}
            </a>
          ))}
        </div>
      )}

      <style>{`
        .nav-link-md { display: none; }
        @media (min-width: 768px) {
          .nav-link-md { display: inline-block !important; }
          .nav-burger { display: none !important; }
        }
        @media (max-width: 767px) {
          .nav-burger { display: inline-flex !important; }
        }
      `}</style>
    </nav>
  );
}
