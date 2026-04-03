'use client';

import { useState, useEffect } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

type BaseStock = {
  symbol: string;
  name: string;
  change: number;
  price?: number;
  volume?: string;
  news?: string;
  mentions?: number;
};

type SignalCard = {
  id: string;
  title: string;
  subtitle: string;
  stocks: BaseStock[];
};

const signalCards: SignalCard[] = [
  {
    id: 'topMovers',
    title: 'Top Movers',
    subtitle: 'Stocks with highest momentum',
    stocks: [
      { symbol: 'ADANIENT', name: 'Adani Enterprises', change: 4.2, price: 2847.50 },
      { symbol: 'SBIN', name: 'State Bank of India', change: 3.1, price: 851.20 },
      { symbol: 'ITC', name: 'ITC Ltd', change: 2.4, price: 467.80 },
    ],
  },
  {
    id: 'volumeSpikes',
    title: 'Volume Spikes',
    subtitle: 'Unusual trading activity detected',
    stocks: [
      { symbol: 'HDFCBANK', name: 'HDFC Bank', change: 0.8, volume: '2.3x', price: 1628.40 },
      { symbol: 'ICICIBANK', name: 'ICICI Bank', change: 1.2, volume: '1.8x', price: 1242.15 },
      { symbol: 'AXISBANK', name: 'Axis Bank', change: -0.5, volume: '2.1x', price: 1133.90 },
    ],
  },
  {
    id: 'stocksInNews',
    title: 'Stocks In News',
    subtitle: 'Market-moving headlines',
    stocks: [
      { symbol: 'TCS', name: 'Tata Consultancy Services', change: 1.5, news: 'Q4 results beat estimates' },
      { symbol: 'INFY', name: 'Infosys', change: 0.9, news: 'New $500M deal signed' },
      { symbol: 'RELIANCE', name: 'Reliance Industries', change: 0.4, news: 'Green energy expansion update' },
    ],
  },
  {
    id: 'trending',
    title: 'Trending Stocks',
    subtitle: 'Most discussed today',
    stocks: [
      { symbol: 'TATAMOTORS', name: 'Tata Motors', change: 2.1, mentions: 1456 },
      { symbol: 'ZOMATO', name: 'Zomato Ltd', change: 5.4, mentions: 1284 },
      { symbol: 'PAYTM', name: 'One97 Communications', change: -3.2, mentions: 1102 },
    ],
  },
];

export default function MarketSignals() {
  const [ref, isVisible] = useScrollReveal<HTMLDivElement>({ threshold: 0.2 });
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  return (
    <section className="section" id="signals" style={{ background: 'var(--bg)', paddingTop: '100px', paddingBottom: '120px' }}>
      <div className="container" ref={ref}>
        <div className="section-head" style={{ 
          textAlign: 'center', 
          marginBottom: '64px',
          opacity: isVisible ? 1 : 0, 
          transform: isVisible ? 'translateY(0)' : 'translateY(30px)', 
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)' 
        }}>
          <div className="section-tag">
            <div className="badge">Market Intelligence</div>
          </div>
          <h2>Signals Driving Today&apos;s Market</h2>
          <div className="divider"></div>
          <p style={{ marginTop: '16px', fontSize: '1.05rem', maxWidth: '600px', margin: '16px auto 0' }}>
            A deep dive into the high-conviction signals surfacing across the Indian indices right now.
          </p>
        </div>

        <div className="cards-grid">
          {mounted && signalCards.map((card, index) => (
            <div
              key={card.id}
              className="reveal-card"
              onMouseEnter={() => setExpandedCard(card.id)}
              onMouseLeave={() => setExpandedCard(null)}
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
                transitionDelay: `${index * 0.1}s`,
              }}
            >
              {/* Front Face */}
              <div className="rc-face">
                <div className="rc-icon">
                  {card.id === 'topMovers' && '📈'}
                  {card.id === 'volumeSpikes' && '📊'}
                  {card.id === 'stocksInNews' && '📰'}
                  {card.id === 'trending' && '🔥'}
                </div>
                <div className="rc-title">{card.title}</div>
                <div className="rc-sub">{card.subtitle}</div>
                <div style={{ marginTop: 'auto', fontSize: '0.75rem', color: 'var(--accent-2)', fontWeight: 700 }}>
                  HOVER TO EXPLORE →
                </div>
              </div>

              {/* Back Face / Expanded Details */}
              <div className="rc-back">
                <div className="rc-back-title">{card.title}</div>
                <div className="rc-back-list">
                  {card.stocks.map((stock) => (
                    <li key={stock.symbol}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span className="mono" style={{ fontWeight: 700, fontSize: '0.85rem' }}>{stock.symbol}</span>
                          <span className="mono" style={{ 
                            fontWeight: 700, 
                            fontSize: '0.85rem',
                            color: stock.change >= 0 ? 'var(--green)' : 'var(--red)'
                          }}>
                            {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(1)}%
                          </span>
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-3)' }}>
                          {stock.volume ? `${stock.volume} Volume spike` : stock.news ? stock.news : `Trending in chat`}
                        </div>
                      </div>
                    </li>
                  ))}
                </div>
                <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--border)', fontSize: '0.7rem', color: 'var(--text-4)', textAlign: 'center' }}>
                  Open in app for full analysis
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
