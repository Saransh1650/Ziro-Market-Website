import { isLaunched } from '@/lib/launchMode';
import LiveIndices from './LiveIndices';

export default function Hero() {
  const launched = isLaunched();
  return (
    <section id="top" className="crosshair" style={{ paddingTop: 72, paddingBottom: 0, borderBottom: '1px solid var(--border-1)' }}>
      <div className="container" style={{ paddingBottom: 56 }}>
        <div className="section-num">
          <span className="live-dot" aria-hidden /> LIVE · NSE · BSE · MCX · {launched ? '50,000+ users' : '2,847 on waitlist'}
        </div>

        <h1 className="display" style={{ marginTop: 28 }}>
          Indian markets,<br />
          <em>without the</em> <span className="amber">noise.</span>
        </h1>

        <div className="hero-sub-grid">
          <p style={{ maxWidth: 520 }}>
            Heatmaps, live indices, portfolio analytics and sector intelligence — built for India, in one app that loads in under a second. No autoplay ads. No buried buttons. No USD defaults.
          </p>
          <div className="hero-stat">
            <div style={{ fontSize: '2.6rem', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1 }}>&lt; 1s</div>
            <div className="caption" style={{ marginTop: 6 }}>Cold-start to live data</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 14, marginTop: 32, alignItems: 'center', flexWrap: 'wrap' }}>
          <a href={launched ? '#download' : '#waitlist'} className="btn btn-amber btn-lg">
            {launched ? 'Download Ziro Market →' : 'Join the waitlist →'}
          </a>
          <a href="#pivot" className="btn btn-ghost">Read the manifesto</a>
          <span className="caption">No spam · iOS &amp; Android · India-first</span>
        </div>
      </div>

      <LiveIndices />

      <style>{`
        .hero-sub-grid {
          display: grid; grid-template-columns: 2fr 1fr; gap: 40px;
          align-items: end; border-top: 1px solid var(--border-1);
          padding-top: 28px; margin-top: 28px;
        }
        .hero-stat { text-align: right; }
        @media (max-width: 768px) {
          .hero-sub-grid { grid-template-columns: 1fr; gap: 24px; }
          .hero-stat { text-align: left; }
        }
      `}</style>
    </section>
  );
}
