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
              <div className="logo-icon">▲</div>
              <span className="logo-text" style={{ fontSize: '1.1rem', fontWeight: 900 }}>
                ZIRO MARKET
              </span>
            </div>
            <p style={{ color: 'var(--text-3)', lineHeight: 1.6, fontSize: '0.95rem', maxWidth: '320px' }}>
              The future of market intelligence designed for the modern investor. Real signals, zero noise.
            </p>
            <div className="social-links" style={{ marginTop: '24px', display: 'flex', gap: '20px' }}>
              <a href="#" className="social-link" style={{ fontSize: '1.2rem', color: 'var(--text-4)', transition: 'color 0.3s ease' }}>𝕏</a>
              <a href="#" className="social-link" style={{ fontSize: '1.2rem', color: 'var(--text-4)', transition: 'color 0.3s ease' }}>📸</a>
              <a href="#" className="social-link" style={{ fontSize: '1.2rem', color: 'var(--text-4)', transition: 'color 0.3s ease' }}>in</a>
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
