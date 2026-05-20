import { isLaunched } from '@/lib/launchMode';
import LiveIndices from './LiveIndices';
import PhoneMockup from './PhoneMockup';

function AppleIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M3.18 23.59c.28.15.57.22.87.22.37 0 .74-.11 1.07-.32l16.59-9.59c.64-.37 1.04-1.05 1.04-1.79 0-.74-.4-1.42-1.04-1.79L5.12.73C4.49.36 3.72.33 3.06.65 2.41.97 2 1.64 2 2.38v19.24c0 .75.41 1.41 1.06 1.73.04.02.08.03.12.24z"/>
    </svg>
  );
}

export default function Hero() {
  const launched = isLaunched();
  return (
    <section id="top" className="crosshair" style={{ paddingTop: 72, paddingBottom: 0, borderBottom: '1px solid var(--border-1)' }}>
      <div className="container">
        <div className="hero-layout">
          {/* ── Left column ── */}
          <div className="hero-text-col">
            <div className="section-num">
              <span className="live-dot" aria-hidden /> LIVE · NSE · BSE · MCX · {launched ? '50,000+ users' : '2,847 on waitlist'}
            </div>

            {/* Mobile app badge */}
            <div style={{ display: 'flex', gap: 8, marginTop: 16, alignItems: 'center' }}>
              <span style={{
                fontSize: '0.6rem', fontFamily: 'var(--mono)', fontWeight: 700,
                letterSpacing: '0.1em', color: 'var(--amber)',
                background: 'var(--amber-dim)', border: '1px solid rgba(245,158,11,0.2)',
                padding: '3px 8px', borderRadius: 4,
              }}>MOBILE APP</span>
              <span style={{ fontSize: '0.6rem', color: 'var(--text-3)', fontFamily: 'var(--mono)' }}>iOS + Android</span>
            </div>

            <h1 className="display" style={{ marginTop: 20 }}>
              Indian markets,<br />
              <em>without the</em> <span className="amber">noise.</span>
            </h1>

            <p style={{ marginTop: 20, maxWidth: 460, color: 'var(--text-2)', lineHeight: 1.65 }}>
              Heatmaps, live indices, portfolio analytics — built for India, in one app that loads in under a second. No autoplay ads. No USD defaults.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap', alignItems: 'center' }}>
              <a href={launched ? '#download' : '#waitlist'} className="btn btn-amber btn-lg">
                {launched ? 'Download →' : 'Join the waitlist →'}
              </a>
              <a href="#features" className="btn btn-ghost">See the app →</a>
            </div>

            {/* Platform badges */}
            <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 7,
                background: '#111', border: '1px solid var(--border-2)',
                padding: '8px 14px', borderRadius: 8, cursor: 'default',
              }}>
                <AppleIcon />
                <div>
                  <div style={{ fontSize: '0.42rem', color: 'var(--text-3)', letterSpacing: '0.06em' }}>AVAILABLE ON</div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-1)', lineHeight: 1.1 }}>App Store</div>
                </div>
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 7,
                background: '#111', border: '1px solid var(--border-2)',
                padding: '8px 14px', borderRadius: 8, cursor: 'default',
              }}>
                <PlayIcon />
                <div>
                  <div style={{ fontSize: '0.42rem', color: 'var(--text-3)', letterSpacing: '0.06em' }}>GET IT ON</div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-1)', lineHeight: 1.1 }}>Google Play</div>
                </div>
              </div>
            </div>

            {/* Stat */}
            <div style={{ marginTop: 36, paddingTop: 24, borderTop: '1px solid var(--border-1)' }}>
              <div style={{ fontSize: '2.6rem', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1 }}>&lt; 1s</div>
              <div className="caption" style={{ marginTop: 6 }}>Cold-start to live data</div>
            </div>
          </div>

          {/* ── Right column: phone mockup ── */}
          <div className="hero-phone-col" aria-hidden>
            <PhoneMockup />
          </div>
        </div>
      </div>

      <LiveIndices />

      <style>{`
        .hero-layout {
          display: grid;
          grid-template-columns: 1fr 280px;
          gap: 60px;
          align-items: center;
          padding-bottom: 64px;
        }
        .hero-phone-col {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 24px 0 48px;
        }
        @media (max-width: 900px) {
          .hero-layout {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .hero-phone-col {
            order: -1;
            padding: 0 0 8px;
          }
        }
      `}</style>
    </section>
  );
}
