export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer style={{ background: 'var(--bg-1)', borderTop: '1px solid var(--border-1)', padding: '72px 0 36px' }}>
      <div className="container">
        <div className="footer-grid">
          <style>{`
            .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 56px; }
            @media (max-width: 768px) { .footer-grid { grid-template-columns: 1fr 1fr; gap: 32px; } }
            @media (max-width: 480px) { .footer-grid { grid-template-columns: 1fr; gap: 28px; } }
          `}</style>
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              ZIRO MARKET
            </div>
            <p style={{ marginTop: 14, color: 'var(--text-3)', fontSize: '0.85rem', maxWidth: 320 }}>
              Indian markets, without the noise. Built in India for Indian markets.
            </p>
          </div>
          <FooterCol title="Product" links={[
            { label: 'Why', href: '#pain' },
            { label: 'App', href: '#features' },
            { label: 'Waitlist', href: '#waitlist' },
          ]} />
          <FooterCol title="Company" links={[
            { label: 'Manifesto', href: '#pivot' },
            { label: 'Contact',   href: 'mailto:hello@ziromarket.com' },
          ]} />
          <FooterCol title="Legal" links={[
            { label: 'Privacy', href: '/privacy' },
            { label: 'Terms',   href: '/terms' },
          ]} />
        </div>

        <div style={{ height: 1, background: 'var(--border-1)', margin: '56px 0 24px' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
          <p className="caption" style={{ maxWidth: 600 }}>
            Ziro Market is not a SEBI registered advisor. Markets are subject to risk; data shown is for informational purposes only.
          </p>
          <span className="caption">© {year} Ziro Market · made in India</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h4 className="caption" style={{ marginBottom: 16, color: 'var(--text-4)' }}>{title}</h4>
      {links.map((l) => (
        <a key={l.href} href={l.href}
           style={{ display: 'block', fontSize: '0.88rem', color: 'var(--text-3)', padding: '5px 0' }}>
          {l.label}
        </a>
      ))}
    </div>
  );
}
