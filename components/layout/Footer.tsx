export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="section-dark" style={{ padding: '72px 0 40px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="container">
        <div className="footer-grid">
          <div>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <img src="/app_icon/ziro.png" alt="Ziro" style={{ width: 22, height: 22, borderRadius: 4, display: 'block' }} />
              <span style={{
                fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.06em',
                textTransform: 'uppercase', color: '#ffffff', fontFamily: 'var(--sans)',
              }}>Ziro Market</span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.40)', fontSize: '0.85rem', maxWidth: 300, lineHeight: 1.6 }}>
              The Indian market, simplified. Built in India for Indian markets.
            </p>
          </div>

          <FooterCol title="Product" links={[
            { label: 'Why Ziro',    href: '#pain' },
            { label: 'App features', href: '#features' },
            { label: 'Manifesto',   href: '#pivot' },
            { label: 'Early Access', href: '#waitlist' },
          ]} />
          <FooterCol title="Company" links={[
            { label: 'Contact', href: 'mailto:hello@ziromarket.com' },
          ]} />
          <FooterCol title="Legal" links={[
            { label: 'Privacy', href: '/privacy' },
            { label: 'Terms',   href: '/terms' },
          ]} />
        </div>

        <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '56px 0 24px' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
          <p style={{
            fontFamily: 'var(--mono)', fontSize: '0.62rem', letterSpacing: '0.1em',
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.24)',
            maxWidth: 560, lineHeight: 1.6,
          }}>
            Ziro Market is not a SEBI registered advisor. Markets are subject to risk.
            Data shown is for informational purposes only.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <a href="https://x.com/SaaranshSinghal" target="_blank" rel="noopener noreferrer" aria-label="X" style={{ color: 'rgba(255,255,255,0.36)', transition: 'color 0.15s' }} className="social-link">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="https://www.instagram.com/ziro.market" target="_blank" rel="noopener noreferrer" aria-label="Instagram" style={{ color: 'rgba(255,255,255,0.36)', transition: 'color 0.15s' }} className="social-link">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
            </a>
            <a href="https://www.linkedin.com/company/ziro-market/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" style={{ color: 'rgba(255,255,255,0.36)', transition: 'color 0.15s' }} className="social-link">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <span style={{
              fontFamily: 'var(--mono)', fontSize: '0.62rem', letterSpacing: '0.1em',
              textTransform: 'uppercase', color: 'rgba(255,255,255,0.24)',
            }}>
              © {year} Ziro Market · Made in India
            </span>
          </div>
        </div>
      </div>
      <style>{`
        .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 48px; }
        @media (max-width: 768px) { .footer-grid { grid-template-columns: 1fr 1fr; gap: 32px; } }
        @media (max-width: 480px) { .footer-grid { grid-template-columns: 1fr; gap: 28px; } }
        .footer-link { display: block; font-size: 0.88rem; color: rgba(255,255,255,0.52); padding: 5px 0; transition: color 0.15s; }
        .footer-link:hover { color: rgba(255,255,255,0.85); }
        .social-link:hover { color: rgba(255,255,255,0.85) !important; }
      `}</style>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h4 style={{
        fontFamily: 'var(--mono)', fontSize: '0.62rem', letterSpacing: '0.18em',
        textTransform: 'uppercase', color: 'rgba(255,255,255,0.36)',
        marginBottom: 16,
      }}>{title}</h4>
      {links.map((l) => (
        <a
          key={l.href}
          href={l.href}
          className="footer-link"
        >
          {l.label}
        </a>
      ))}
    </div>
  );
}
