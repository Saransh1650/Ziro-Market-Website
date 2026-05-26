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
          <span style={{
            fontFamily: 'var(--mono)', fontSize: '0.62rem', letterSpacing: '0.1em',
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.24)',
          }}>
            © {year} Ziro Market · Made in India
          </span>
        </div>
      </div>
      <style>{`
        .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 48px; }
        @media (max-width: 768px) { .footer-grid { grid-template-columns: 1fr 1fr; gap: 32px; } }
        @media (max-width: 480px) { .footer-grid { grid-template-columns: 1fr; gap: 28px; } }
        .footer-link { display: block; font-size: 0.88rem; color: rgba(255,255,255,0.52); padding: 5px 0; transition: color 0.15s; }
        .footer-link:hover { color: rgba(255,255,255,0.85); }
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
