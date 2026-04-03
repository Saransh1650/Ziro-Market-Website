'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Trigger blur slightly after ticker scrolls away (ticker is ~38px)
      setScrolled(window.scrollY > 38);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} id="navbar">
      <div className="container nav-inner">
        <Link href="#" className="nav-logo" aria-label="Smart Money Tracker">
          <div className="logo-icon">▲</div>
          <span className="logo-text">
            SMART MONEY <span>TRACKER</span>
          </span>
        </Link>
        <div className="nav-links">
          <a href="#features" className="nav-link">Product</a>
          <a href="#signals" className="nav-link">Signals</a>
          <a href="#community" className="nav-link">Community</a>
          <a href="#how-it-works" className="nav-link">How It Works</a>
        </div>
        <div className="nav-right">
          <a href="#waitlist" className="btn btn-primary btn-sm">
            Join Waitlist →
          </a>
        </div>
      </div>
    </nav>
  );
}
