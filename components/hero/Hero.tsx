import LiveIndices from './LiveIndices';
import Image from 'next/image';

const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.ziro.market';
const APP_STORE_URL = 'https://apps.apple.com/in/app/ziro-market-stock-trends/id6761326539';

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
  return (
    <section id="top" className="crosshair hero-section">
      <div className="hero-inner">
        <div className="container hero-stage">
          <div className="hero-layout">
            {/* ── Left column ── */}
            <div className="hero-text-col">
              <h1 className="display hero-title">
                The Indian market,<br />
                <span className="amber">simplified.</span>
              </h1>

              <p className="hero-sub">
                Track what's moving and understand why it's moving, without spending your day glued to finance apps.
              </p>

              {/* CTAs */}
              <div className="hero-ctas">
                <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" className="btn btn-amber btn-lg">
                  Download →
                </a>
                <a href="#features" className="btn btn-ghost btn-lg">See the app →</a>
              </div>

              {/* Platform badges */}
              <div className="hero-badges">
                <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer" className="hero-badge">
                  <AppleIcon />
                  <div>
                    <div className="hero-badge-top">AVAILABLE ON</div>
                    <div className="hero-badge-name">App Store</div>
                  </div>
                </a>
                <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" className="hero-badge">
                  <PlayIcon />
                  <div>
                    <div className="hero-badge-top">GET IT ON</div>
                    <div className="hero-badge-name">Google Play</div>
                  </div>
                </a>
              </div>

            </div>

            {/* ── Right column: phone mockup ── */}
            <div className="hero-phone-col" aria-hidden>
              <Image
                src="/screenshots/3D_mockup_trim.png"
                alt="App screens"
                width={1600}
                height={1261}
                priority
                sizes="(max-width: 820px) 90vw, 45vw"
                className="hero-phone-img"
              />
            </div>
          </div>
        </div>

        <LiveIndices />
      </div>

      <style>{`
        .hero-section { border-bottom: 1px solid var(--border-1); }

        /* Hero owns the first screen: content block flexes, the index strip
           sits on the fold line so nothing below it peeks through. */
        .hero-inner {
          min-height: calc(100svh - 60px);
          display: flex;
          flex-direction: column;
        }
        .hero-stage {
          flex: 1;
          display: flex;
          align-items: center;
          padding-top: 40px;
          padding-bottom: 40px;
        }
        .hero-layout {
          width: 100%;
          display: grid;
          /* minmax(0,…) stops the oversized display type from blowing the
             column out and squeezing the mockup */
          grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
          gap: 48px;
          align-items: center;
        }
        .hero-text-col { min-width: 0; }
        .hero-title {
          font-size: clamp(2.7rem, 5vw, 4.9rem);
          line-height: 0.98;
        }
        .hero-sub {
          margin-top: 22px;
          max-width: 44ch;
          color: var(--text-2);
          font-size: 1.02rem;
          line-height: 1.65;
        }
        .hero-ctas {
          display: flex;
          gap: 12px;
          margin-top: 30px;
          flex-wrap: wrap;
          align-items: center;
        }
        .hero-badges { display: flex; gap: 10px; margin-top: 22px; }
        .hero-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--bg-2);
          border: 1px solid var(--border-1);
          padding: 8px 14px;
          border-radius: 8px;
          color: var(--text-1);
          transition: border-color 0.15s, background 0.15s;
        }
        .hero-badge:hover { border-color: var(--border-2); background: var(--bg-3); }
        .hero-badge-top {
          font-size: 0.42rem;
          color: var(--text-3);
          letter-spacing: 0.06em;
          font-family: var(--mono);
        }
        .hero-badge-name { font-size: 0.72rem; font-weight: 700; line-height: 1.1; }

        .hero-phone-col {
          min-width: 0;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .hero-phone-img { width: 100%; max-width: 660px; height: auto; }

        @media (max-width: 1100px) {
          .hero-layout { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 32px; }
        }
        @media (max-width: 820px) {
          .hero-inner { min-height: 0; }
          .hero-stage { padding-top: 48px; padding-bottom: 56px; }
          .hero-layout { grid-template-columns: 1fr; gap: 36px; }
          .hero-title { font-size: clamp(2.6rem, 10vw, 3.8rem); }
          .hero-phone-img { max-width: 460px; }
        }
        @media (max-width: 480px) {
          .hero-stage { padding-top: 32px; padding-bottom: 36px; }
          .hero-layout { gap: 24px; }
          .hero-sub { margin-top: 18px; font-size: 0.96rem; }
          .hero-ctas { margin-top: 24px; }
          .hero-phone-img { max-width: 300px; }
        }
      `}</style>
    </section>
  );
}
