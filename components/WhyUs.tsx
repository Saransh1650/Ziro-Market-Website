'use client';

import { useCardTilt } from '@/hooks/useCardTilt';

const cards = [
  {
    icon: '🗺️',
    title: 'Sector Intelligence',
    sub: 'Real-time NSE sector rotation mapped visually. Know exactly where institutional money is flowing.',
    badges: ['34 Sectors', 'FII Tracked'],
    backTitle: 'What you get',
    features: [
      'Live heatmap of all 34 NSE sectors',
      'FII & DII flow by sector breakdown',
      'Daily sector momentum score',
      'Intraday & weekly rotation alerts',
    ],
    delay: 0,
  },
  {
    icon: '⚡',
    title: 'Volume Intelligence',
    sub: 'Detect institutional accumulation before it shows up on the news. Volume anomalies surfaced instantly.',
    badges: ['5x Vol Alerts', 'Real-time'],
    backTitle: 'Volume features',
    features: [
      'Multi-threshold alerts: 2x, 3x, 5x avg vol',
      'Delivery volume vs. intraday split',
      'Block deal & bulk deal live feed',
      'OI surge + vol surge combined signals',
    ],
    delay: 100,
  },
  {
    icon: '📱',
    title: 'Mobile-First Design',
    sub: 'Designed for the phone screen. All the power of a trading terminal, in your pocket. Fast, smooth, beautiful.',
    badges: ['iOS & Android', '60fps'],
    backTitle: 'App experience',
    features: [
      'Native iOS & Android apps',
      'Smooth 60fps animations throughout',
      'Widget support for home screen',
      'Dark mode — built for all-day use',
    ],
    delay: 200,
  },
  {
    icon: '📊',
    title: 'Smart Watchlist',
    sub: 'Multi-list watchlists with comparison mode. Side-by-side stock analysis with portfolio-grade metrics.',
    badges: ['Multi-list', 'Compare Mode'],
    backTitle: 'Watchlist power',
    features: [
      'Unlimited watchlists & folders',
      'Side-by-side comparison view',
      'Custom columns: P/E, EPS, beta, OI',
      'Shared watchlists with team/friends',
    ],
    delay: 100,
  },
  {
    icon: '🔔',
    title: 'Signal Alerts',
    sub: 'Institutional-grade alerts delivered instantly. Price, volume, news, technicals — all customisable.',
    badges: ['Push Alerts', 'Smart Filters'],
    backTitle: 'Alert types',
    features: [
      'Price breakout & breakdown alerts',
      'News-driven price impact signals',
      'Circuit breaker & delivery spike alerts',
      'Scheduled morning/evening digests',
    ],
    delay: 200,
  },
  {
    icon: '🏦',
    title: 'FII & DII Tracker',
    sub: 'Track foreign and domestic institutional money flows in real time — across indices, sectors, and individual stocks.',
    badges: ['FII Flow', 'DII Net'],
    backTitle: 'Institutional data',
    features: [
      'Daily FII / DII net buy/sell',
      'Provisional data during market hours',
      'NSE & BSE category-wise breakdown',
      'Historical trends & momentum charts',
    ],
    delay: 300,
  },
];

function RevealCard({ card }: { card: typeof cards[0] }) {
  const cardRef = useCardTilt<HTMLDivElement>({ maxTilt: 10, scale: 1.03 });

  return (
    <div className="reveal-card" data-reveal="up" data-delay={card.delay.toString()} ref={cardRef}>
      <div className="rc-face">
        <div className="rc-icon">{card.icon}</div>
        <div className="rc-title">{card.title}</div>
        <div className="rc-sub">{card.sub}</div>
        <div style={{ marginTop: 'auto', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {card.badges.map((badge) => (
            <span key={badge} className="badge" style={{ fontSize: '.6rem' }}>
              {badge}
            </span>
          ))}
        </div>
      </div>
      <div className="rc-back">
        <div className="rc-back-title">{card.backTitle}</div>
        <ul className="rc-back-list">
          {card.features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function WhyUs() {
  return (
    <section
      className="section"
      id="why"
      style={{
        background: 'var(--bg-1)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div className="container">
        <div className="section-head" data-reveal="up">
          <div className="section-tag">
            <div className="badge">Why Smart Money Tracker</div>
          </div>
          <h2>Built for the serious Indian investor.</h2>
          <div className="divider"></div>
          <p style={{ fontSize: '.85rem', color: 'var(--text-3)' }}>
            Hover the cards to reveal more.
          </p>
        </div>
        <div className="cards-grid">
          {cards.map((card) => (
            <RevealCard key={card.title} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
