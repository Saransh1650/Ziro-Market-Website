import type { ReactNode } from 'react';

export default function FeatureBlock({
  num, tag, headlineTop, headlineHighlight, body, bullets, reverse = false, viz,
}: {
  num: string;
  tag: string;
  headlineTop: string;
  headlineHighlight: string;
  body: string;
  bullets: string[];
  reverse?: boolean;
  viz: ReactNode;
}) {
  return (
    <section className="section crosshair">
      <div className="container">
        <span className="section-num">№ {num} / {tag}</span>
        <div className="fb-grid" data-reverse={reverse ? 'true' : 'false'}>
          <div className="fb-copy">
            <h2>{headlineTop} <span className="amber">{headlineHighlight}</span></h2>
            <p style={{ marginTop: 18, maxWidth: 520 }}>{body}</p>
            <ul style={{ marginTop: 24, listStyle: 'none', padding: 0 }}>
              {bullets.map((b, i) => (
                <li key={i} style={{ padding: '12px 0', borderTop: '1px solid var(--border-1)', display: 'flex', gap: 16, color: 'var(--text-2)', fontSize: '0.92rem' }}>
                  <span className="caption">→</span>{b}
                </li>
              ))}
            </ul>
          </div>
          <div className="fb-viz">{viz}</div>
        </div>
      </div>
      <style>{`
        .fb-grid {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 80px;
          align-items: center;
          margin-top: 28px;
        }
        .fb-viz { display: flex; justify-content: center; width: 300px; }
        .fb-grid[data-reverse="true"] { grid-template-columns: auto 1fr; }
        .fb-grid[data-reverse="true"] .fb-copy { order: 2; }
        .fb-grid[data-reverse="true"] .fb-viz  { order: 1; }
        @media (max-width: 900px) {
          .fb-grid, .fb-grid[data-reverse="true"] { grid-template-columns: 1fr; gap: 40px; }
          .fb-grid[data-reverse="true"] .fb-copy,
          .fb-grid[data-reverse="true"] .fb-viz { order: initial; }
          .fb-viz { width: 100%; max-width: 300px; margin: 0 auto; }
        }
      `}</style>
    </section>
  );
}
