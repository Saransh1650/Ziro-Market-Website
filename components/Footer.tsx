'use client';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer style={{ background: 'var(--bg)', borderTop: '1px solid var(--border)', padding: '100px 0 60px' }}>
      <div className="container">
        <div className="footer-layout" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '80px', marginBottom: '80px' }}>
          <div className="footer-brand">
            <div className="nav-logo" style={{ marginBottom: '24px' }}>
              <div className="logo-icon">
                <img src="/app_icon/ziro.png" alt="Ziro" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <span className="logo-text" style={{ fontSize: '1.1rem', fontWeight: 900 }}>
                ZIRO MARKET
              </span>
            </div>
            <p style={{ color: 'var(--text-3)', lineHeight: 1.6, fontSize: '0.95rem', maxWidth: '320px' }}>
              The future of market intelligence designed for the modern investor. Real signals, zero noise.
            </p>
            <div className="social-links" style={{ marginTop: '24px', display: 'flex', gap: '16px' }}>
              {/* X / Twitter */}
              <a href="#" className="social-link" style={{ color: 'var(--text-4)', transition: 'all 0.3s ease' }} aria-label="Follow us on X">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              {/* LinkedIn */}
              <a href="https://www.linkedin.com/company/ziro-market/" target="_blank" rel="noopener noreferrer" className="social-link" style={{ color: 'var(--text-4)', transition: 'all 0.3s ease' }} aria-label="Connect on LinkedIn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.2225 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          <div className="footer-col" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-1)', marginBottom: '8px' }}>Support</h4>
            <a href="mailto:hello@ziromarket.com" className="footer-link">Contact Support</a>
            <a href="#" className="footer-link">Documentation</a>
            <a href="#" className="footer-link">Privacy Policy</a>
            <a href="#" className="footer-link">Terms of Service</a>
          </div>
        </div>

        <div className="divider" style={{ width: '100%', marginBottom: '40px', opacity: 0.5 }}></div>

        <div className="footer-bottom" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '40px' }}>
          <div className="footer-disclaimer" style={{ fontSize: '0.75rem', color: 'var(--text-4)', lineHeight: 1.6, maxWidth: '800px' }}>
            Ziro Market is an educational and analytical platform providing market data for informational purposes only. We do not provide investment advice or recommendations. SEBI Registration: Not Applicable. Stock market investments are subject to market risks; read all scheme related documents carefully before investing.
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-4)', marginBottom: '8px' }}>© 2026 Ziro Market Pvt. Ltd.</div>
            <button onClick={scrollToTop} style={{ background: 'none', border: 'none', color: 'var(--accent-2)', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', padding: 0 }}>BACK TO TOP ↑</button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .footer-link {
          color: var(--text-3);
          text-decoration: none;
          font-size: 0.9rem;
          transition: all 0.2s ease;
        }
        .footer-link:hover {
          color: var(--text-1);
          transform: translateX(4px);
        }
        .social-link:hover {
          color: var(--text-1) !important;
        }
      `}</style>
    </footer>
  );
}
