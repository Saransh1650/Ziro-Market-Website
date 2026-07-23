import type { Metadata } from 'next';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: "About Ziro Market's Editorial Standards",
  description: "Who writes Ziro Market's market coverage, how every number gets verified, and what the app behind it actually does.",
};

export default function About() {
  const sectionStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 12 };
  const h2Style: React.CSSProperties = { fontSize: '1.3rem', letterSpacing: '-0.01em', fontWeight: 700, color: 'var(--text-1)' };
  const pStyle: React.CSSProperties = { color: 'var(--text-2)', lineHeight: 1.65 };
  const ulStyle: React.CSSProperties = { listStyle: 'disc', marginLeft: 18, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 };
  const liStyle: React.CSSProperties = { color: 'var(--text-2)', lineHeight: 1.65 };
  const boxStyle: React.CSSProperties = { background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '24px' };

  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: "About Ziro Market's Editorial Standards",
    url: 'https://www.ziromarket.com/about',
    mainEntity: {
      '@type': 'Organization',
      name: 'Ziro Market',
      url: 'https://www.ziromarket.com',
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      <Nav />
      <main className="container" style={{ paddingTop: 80, paddingBottom: 120 }}>
        <span className="section-num">01 / ABOUT</span>
        <h1 className="display" style={{ marginTop: 18, fontSize: 'clamp(2.4rem, 5vw, 4.2rem)' }}>
          Who writes <span className="amber">this.</span>
        </h1>
        <p className="caption" style={{ marginTop: 12, maxWidth: 620 }}>
          Ziro Market publishes explainers and market coverage alongside the app it&apos;s named after. This page is the honest version of &quot;who&apos;s behind this and why should you trust a number on this site.&quot;
        </p>

        <article style={{ marginTop: 56, maxWidth: 760, display: 'flex', flexDirection: 'column', gap: 28 }}>

          <section style={sectionStyle}>
            <h2 style={h2Style}>What Ziro Market is</h2>
            <p style={pStyle}>
              Ziro Market is a free Indian stock-market tracking app (iOS and Android) built by a small India-based team. The website you&apos;re reading carries the same name because it does two jobs: it&apos;s the app&apos;s home online, and it&apos;s where we publish explainers, market terminology guides, and coverage of things like FII/DII flows, earnings, and RBI decisions.
            </p>
            <p style={pStyle}>
              There is no separate newsroom. Posts are written and fact-checked by the Ziro Market team, the same people who build the app, which is also why articles link back to app features that show the same data live.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={h2Style}>How every number gets verified</h2>
            <p style={pStyle}>
              Every specific figure in a post — a share price, a P/E ratio, a dividend, a GDP print — is checked against a current source before it&apos;s published, not pulled from memory or estimated. Where a number can move (a market cap, a valuation ratio, a yield), the post says <strong>&quot;as of [month, year]&quot;</strong> next to it, so a figure read six months later doesn&apos;t look like it was claimed as current.
            </p>
            <ul style={ulStyle}>
              <li style={liStyle}>Numbers we can&apos;t verify against a live source are described directionally (&quot;roughly halved,&quot; &quot;between 12 and 15 percent&quot;) instead of guessed as an exact figure.</li>
              <li style={liStyle}>Recurring pages — the daily market wrap, gold and silver rates, the rupee, crude oil — live at one fixed URL and get updated in place, rather than a new near-duplicate post each time the number changes.</li>
              <li style={liStyle}>Event coverage (earnings, IPOs, rate decisions) states facts and explains what they mean. It does not tell you to buy, sell, or hold anything.</li>
            </ul>
          </section>

          <section style={sectionStyle}>
            <h2 style={h2Style}>What we&apos;re not</h2>
            <p style={pStyle}>
              Ziro Market is not a SEBI-registered investment advisor, and nothing on this site or in the app is personalized investment advice. We track and explain what&apos;s happening in Indian markets; what you do with that is your call, ideally with your own research or a licensed advisor.
            </p>
          </section>

          <section style={boxStyle}>
            <h2 style={{ ...h2Style, marginBottom: 8 }}>Get in touch</h2>
            <p style={pStyle}>
              Spotted a number that&apos;s wrong or out of date? Tell us and we&apos;ll fix it. <span style={{ fontWeight: 600, color: 'var(--accent)' }}>hello@ziromarket.com</span>
            </p>
          </section>

        </article>
      </main>
      <Footer />
    </>
  );
}
