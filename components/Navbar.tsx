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
        <Link href="#" className="nav-logo" aria-label="Trade Insights">
          <div className="logo-icon">▲</div>
          <span className="logo-text">
            TRADE INSIGHTS
          </span>
        </Link>
        <div className="nav-links">
          <a href="#features" className="nav-link">Features</a>
          <a href="#waitlist" className="nav-link">Get Started</a>
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
