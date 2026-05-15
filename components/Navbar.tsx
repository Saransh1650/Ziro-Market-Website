'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} id="navbar">
      <div className="container nav-inner">
        <Link href="/" className="nav-logo" aria-label="Ziro Market">
          <div className="logo-icon">
            <img src="/app_icon/ziro.png" alt="Ziro" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <span className="logo-text">ZIRO MARKET</span>
        </Link>

        <div className="nav-right">
          <a
            href="#waitlist"
            className="btn btn-sm"
            style={{
              background: 'var(--text-1)',
              color: '#000',
              border: 'none',
              fontWeight: 700,
              letterSpacing: '-0.01em',
              fontSize: '0.8rem',
            }}
          >
            Join the waitlist →
          </a>
        </div>
      </div>
    </nav>
  );
}
