import { isLaunched } from '@/lib/launchMode';
import LiveIndices from './LiveIndices';
import Image from 'next/image';

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
            <h1 className="display" style={{ marginTop: 20 }}>
              The Indian market,<br />
              <em>finally</em> <span className="amber">simplified.</span>
            </h1>

            <p style={{ marginTop: 20, maxWidth: 460, color: 'var(--text-2)', lineHeight: 1.65 }}>
              Track what's moving, understand why it's moving, and make sense of it all, without spending your day glued to finance apps.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap', alignItems: 'center' }}>
              <a href={launched ? '#download' : '#waitlist'} className="btn btn-amber btn-lg">
                {launched ? 'Download →' : 'Join the waitlist →'}
              </a>
              <a href="#features" className="btn btn-ghost btn-lg">See the app →</a>
            </div>

            {/* Platform badges */}
            <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
              {[
                { icon: <AppleIcon />, sup: 'AVAILABLE ON', label: 'App Store' },
                { icon: <PlayIcon />,  sup: 'GET IT ON',    label: 'Google Play' },
              ].map(b => (
                <div key={b.label} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: 'var(--bg-2)', border: '1px solid var(--border-1)',
                  padding: '8px 14px', borderRadius: 8, cursor: 'default',
                  color: 'var(--text-1)',
                }}>
                  {b.icon}
                  <div>
                    <div style={{ fontSize: '0.42rem', color: 'var(--text-3)', letterSpacing: '0.06em', fontFamily: 'var(--mono)' }}>{b.sup}</div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, lineHeight: 1.1 }}>{b.label}</div>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* ── Right column: phone mockup ── */}
          <div className="hero-phone-col" aria-hidden>
            <Image
              src="/screenshots/3D_mockup.png"
              alt="App screens"
              width={720}
              height={480}
              priority
              style={{ width: '100%', height: 'auto' }}
            />
          </div>
        </div>
      </div>

      <LiveIndices />

      <style>{`
        .hero-layout {
          display: grid;
          grid-template-columns: 2fr 3fr;
          gap: 24px;
          align-items: center;
          padding-bottom: 72px;
        }
        .hero-phone-col {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          overflow: hidden;
        }
        @media (max-width: 1100px) {
          .hero-layout { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 820px) {
          .hero-layout {
            grid-template-columns: 1fr;
            gap: 32px;
            padding-bottom: 56px;
          }
          .hero-phone-col {
            justify-content: center;
            max-height: 360px;
          }
        }
        @media (max-width: 480px) {
          .hero-layout { padding-bottom: 48px; gap: 24px; }
          .hero-phone-col { max-height: 280px; }
        }
      `}</style>
    </section>
  );
}
