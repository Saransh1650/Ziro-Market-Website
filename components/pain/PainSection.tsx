'use client';
import { useState } from 'react';
import PainCard, { type Pain } from './PainCard';

const PAINS: Pain[] = [
  {
    app: 'NSE WEBSITE',
    ratingLabel: 'SLOW',
    ratingColor: 'var(--negative)',
    headlineTop: 'Built in 2003.',
    headlineHighlight: 'Still feels like it.',
    stat: { value: '5+', unit: 'seconds to load' },
    bullets: [
      'Data buried under multiple page reloads',
      'No live prices — everything is delayed',
      'Circuit breaker info? Three clicks deep.',
    ],
    fauxFrame: 'nse',
  },
  {
    app: 'MONEYCONTROL',
    ratingLabel: 'NOISY',
    ratingColor: 'var(--amber)',
    headlineTop: 'The ads load',
    headlineHighlight: 'faster than the data.',
    stat: { value: '16', unit: 'ads per page' },
    bullets: [
      'Autoplay video in the corner, always',
      'The analysis you need is behind a paywall',
      'Four different loading spinners at once',
    ],
    fauxFrame: 'mc',
  },
  {
    app: 'GOOGLE FINANCE',
    ratingLabel: 'WRONG MARKET',
    ratingColor: 'var(--gold)',
    headlineTop: 'Defaults to Wall Street.',
    headlineHighlight: 'You trade Dalal Street.',
    stat: { value: 'USD', unit: 'default currency' },
    bullets: [
      'NIFTY data is buried, US stocks up front',
      'No NSE intraday — only daily snapshots',
      'No sector heatmap, no India-specific data',
    ],
    fauxFrame: 'gfin',
  },
];

export default function PainSection() {
  const [idx, setIdx] = useState(0);
  return (
    <section id="pain" className="section crosshair">
      <div className="container">
        <div className="section-num">№ 04 / PAIN</div>
        <h2 style={{ marginTop: 18, maxWidth: 720 }}>
          What you <span className="amber">put up with</span> today.
        </h2>
        <p style={{ marginTop: 14, maxWidth: 620 }}>
          Three of the most-visited finance products in India. None of them built for the way you actually use them.
        </p>

        <div role="tablist" aria-label="Pain points" style={{ marginTop: 40, display: 'flex', gap: 0, borderTop: '1px solid var(--border-1)', borderBottom: '1px solid var(--border-1)' }}>
          {PAINS.map((p, i) => (
            <button
              key={p.app}
              role="tab"
              aria-selected={i === idx}
              tabIndex={i === idx ? 0 : -1}
              onClick={() => setIdx(i)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowRight') { e.preventDefault(); setIdx((idx + 1) % PAINS.length); }
                else if (e.key === 'ArrowLeft') { e.preventDefault(); setIdx((idx - 1 + PAINS.length) % PAINS.length); }
                else if (e.key === 'Home') { e.preventDefault(); setIdx(0); }
                else if (e.key === 'End') { e.preventDefault(); setIdx(PAINS.length - 1); }
              }}
              style={{
                flex: 1, padding: '18px 16px', background: i === idx ? 'var(--bg-1)' : 'transparent',
                borderRight: i < PAINS.length - 1 ? '1px solid var(--border-1)' : 'none',
                borderTop: 'none', borderBottom: 'none', borderLeft: 'none',
                color: i === idx ? 'var(--text-1)' : 'var(--text-3)',
                fontFamily: 'var(--mono)', fontSize: '0.7rem', letterSpacing: '0.14em', textTransform: 'uppercase',
                cursor: 'pointer', textAlign: 'left',
              }}
            >
              <span style={{ color: 'var(--text-4)' }}>{String(i + 1).padStart(2, '0')} </span>{p.app}
              <span style={{ marginLeft: 'auto', color: p.ratingColor, float: 'right' }}>{p.ratingLabel}</span>
            </button>
          ))}
        </div>

        <PainCard pain={PAINS[idx]} />
      </div>
    </section>
  );
}
