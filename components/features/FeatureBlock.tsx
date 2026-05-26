import type { ReactNode } from 'react';

export default function FeatureBlock({
  num, tag, headlineTop, headlineHighlight, body, bullets, subFeatures, reverse = false, dark = false, viz,
}: {
  num: string;
  tag: string;
  headlineTop: string;
  headlineHighlight: string;
  body: string;
  bullets: string[];
  subFeatures?: string[];
  reverse?: boolean;
  dark?: boolean;
  viz: ReactNode;
}) {
  return (
    <section id="features" className={`fb-section crosshair${dark ? ' section-dark' : ''}`} style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Decorative background number */}
      <div aria-hidden className="fb-bg-num">{num}</div>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <span className="section-num">№ {num} / {tag}</span>
        <div className="fb-grid" data-reverse={reverse ? 'true' : 'false'}>
          <div className="fb-copy">
            <h2 style={{ marginTop: 20 }}>
              {headlineTop}{' '}
              <em style={{ color: 'var(--amber)' }}>{headlineHighlight}</em>
            </h2>
            <p style={{ marginTop: 20, maxWidth: 500, fontSize: '1rem', lineHeight: 1.72 }}>{body}</p>

            {bullets.length > 0 && (
              <ul style={{ marginTop: 28, listStyle: 'none', padding: 0 }}>
                {bullets.map((b, i) => (
                  <li key={i} style={{
                    padding: '13px 0',
                    borderTop: '1px solid var(--border-1)',
                    display: 'flex', gap: 16, alignItems: 'flex-start',
                    color: 'var(--text-2)', fontSize: '0.96rem', lineHeight: 1.5,
                  }}>
                    <span style={{
                      fontFamily: 'var(--mono)', fontSize: '0.56rem',
                      letterSpacing: '0.06em', color: 'var(--text-4)',
                      flexShrink: 0, paddingTop: 5,
                    }}>→</span>
                    {b}
                  </li>
                ))}
              </ul>
            )}

            {subFeatures && subFeatures.length > 0 && (
              <div style={{ marginTop: 20 }}>
                <div style={{
                  fontFamily: 'var(--mono)', fontSize: '0.6rem',
                  letterSpacing: '0.16em', textTransform: 'uppercase',
                  color: 'var(--text-3)', marginBottom: 10,
                }}>Then go deeper</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                  {subFeatures.map((sf) => (
                    <span key={sf} style={{
                      fontFamily: 'var(--mono)', fontSize: '0.66rem',
                      fontWeight: 600, letterSpacing: '0.04em',
                      color: 'var(--text-2)',
                      background: 'var(--bg-2)',
                      border: '1px solid var(--border-1)',
                      padding: '5px 11px', borderRadius: 4,
                      whiteSpace: 'nowrap',
                    }}>{sf}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="fb-viz">{viz}</div>
        </div>
      </div>

      <style>{`
        .fb-section { padding: 120px 0; }
        .fb-bg-num {
          position: absolute;
          font-family: var(--sans);
          font-weight: 800;
          font-size: clamp(10rem, 22vw, 20rem);
          line-height: 1;
          letter-spacing: -0.06em;
          color: var(--text-1);
          opacity: 0.028;
          pointer-events: none;
          user-select: none;
          right: -2%;
          bottom: -8%;
          z-index: 0;
        }
        .fb-grid {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 80px;
          align-items: center;
          margin-top: 16px;
        }
        .fb-viz {
          display: flex;
          justify-content: center;
          width: 360px;
          flex-shrink: 0;
        }
        .fb-grid[data-reverse="true"] { grid-template-columns: auto 1fr; }
        .fb-grid[data-reverse="true"] .fb-copy { order: 2; }
        .fb-grid[data-reverse="true"] .fb-viz  { order: 1; }
        .section-dark .fb-bg-num { opacity: 0.04; }
        @media (max-width: 960px) {
          .fb-grid, .fb-grid[data-reverse="true"] { grid-template-columns: 1fr; gap: 40px; }
          .fb-grid[data-reverse="true"] .fb-copy,
          .fb-grid[data-reverse="true"] .fb-viz { order: initial; }
          .fb-viz { width: 100%; max-width: 300px; margin: 0 auto; }
          .fb-bg-num { font-size: clamp(7rem, 28vw, 14rem); right: -4%; bottom: -4%; }
        }
        @media (max-width: 600px) {
          .fb-section { padding: 72px 0; }
        }
      `}</style>
    </section>
  );
}
