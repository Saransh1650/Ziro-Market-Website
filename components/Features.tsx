'use client';

import { useState, useMemo, useEffect } from 'react';
import { SECTORS } from '@/lib/data';

const features = [
  {
    id: 'heatmap',
    num: '01',
    title: 'Sector Heatmap',
    desc: 'Visualise all 34+ NSE sectors in real time. Instantly see which sectors are gaining institutional flow and which are bleeding — colour-coded by performance and volume.',
  },
  {
    id: 'watchlist',
    num: '02',
    title: 'Smart Watchlist',
    desc: 'Build multiple watchlists and compare stocks side-by-side. Set alerts on price, volume, or % change. Sort by any column instantly.',
  },
  {
    id: 'volume',
    num: '03',
    title: 'Volume Surge Alerts',
    desc: 'Catch institutional accumulation before it\'s priced in. Get notified when any stock\'s volume crosses 2x, 3x, or 5x its 10-day average.',
  },
  {
    id: 'movers',
    num: '04',
    title: 'Top Movers & Gainers',
    desc: 'Live ranked list of NSE & BSE top gainers, losers, and most active stocks. Filter by index: NIFTY 50, NIFTY 500, MIDCAP, SMALLCAP.',
  },
];

export default function Features() {
  const [activeFeature, setActiveFeature] = useState('heatmap');
  const [mounted, setMounted] = useState(false);

  // Generate sector data once to avoid hydration mismatch
  const sectorData = useMemo(() => {
    return SECTORS.map((sector, i) => {
      const seed = (i * 0.17) % 1;
      const val = (seed - 0.5) * 4;
      const color = val > 1.5 ? '#22c55e' : val > 0 ? '#10b981' : val > -1.5 ? '#ef4444' : '#dc2626';
      return { ...sector, val, color };
    });
  }, []);

  useEffect(() => {
    setMounted(true); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  return (
    <section className="section features-pinned-section" id="features" style={{ padding: 0 }}>
      <div className="container" style={{ paddingTop: '120px', paddingBottom: '120px' }}>
        <div className="section-head" data-reveal="up">
          <div className="section-tag">
            <div className="badge">Core Features</div>
          </div>
          <h2>Everything the Indian investor needs — in one app.</h2>
          <div className="divider"></div>
          <p>From NIFTY sector heatmaps to real-time FII/DII data — built specifically for NSE &amp; BSE.</p>
        </div>

        <div className="features-sticky-wrap" id="features-sticky">
          {/* Feature list */}
          <div className="features-list" id="features-list">
            {features.map((feature) => (
              <div
                key={feature.id}
                className={`feature-item ${activeFeature === feature.id ? 'active' : ''}`}
                data-feature={feature.id}
                onClick={() => setActiveFeature(feature.id)}
                onMouseEnter={() => setActiveFeature(feature.id)}
              >
                <div className="fi-num">{feature.num}</div>
                <div className="fi-title">{feature.title}</div>
                <div className="fi-desc">{feature.desc}</div>
              </div>
            ))}
          </div>

          {/* Preview panel */}
          <div className="feature-preview-panel" id="feature-panel">
            <div className="fpp-topbar">
              <div className="fpp-dot" style={{ background: '#ef4444' }}></div>
              <div className="fpp-dot" style={{ background: '#f59e0b' }}></div>
              <div className="fpp-dot" style={{ background: '#22c55e' }}></div>
              <span className="fpp-title" id="fpp-title">
                SMART_MONEY_TRACKER · {activeFeature.toUpperCase()}
              </span>
            </div>
            <div className="fpp-content">
              {/* Heatmap pane */}
              <div className={`fp-pane ${activeFeature === 'heatmap' ? 'active' : ''}`}>
                <div className="db-section-label" style={{ fontSize: '.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--text-4)', marginBottom: '14px' }}>
                  NSE SECTOR HEATMAP — LIVE
                </div>
                <div className="preview-heatmap">
                  {mounted && sectorData.map((sector) => (
                    <div
                      key={sector.name}
                      className="hm-tile"
                      style={{ background: sector.color, gridColumn: `span ${sector.cols}` }}
                    >
                      <div className="hm-name">{sector.name}</div>
                      <div className="hm-val">{sector.val.toFixed(2)}%</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Watchlist pane */}
              <div className={`fp-pane ${activeFeature === 'watchlist' ? 'active' : ''}`}>
                <div className="db-section-label">MY WATCHLIST · 8 STOCKS</div>
                <div className="preview-watchlist">
                  <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-3)' }}>
                    Smart watchlist with custom alerts and sorting
                  </div>
                </div>
              </div>

              {/* Volume pane */}
              <div className={`fp-pane ${activeFeature === 'volume' ? 'active' : ''}`}>
                <div className="db-section-label">VOLUME SURGE ALERTS · TODAY</div>
                <div className="preview-volume">
                  <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-3)' }}>
                    Real-time volume anomaly detection
                  </div>
                </div>
              </div>

              {/* Movers pane */}
              <div className={`fp-pane ${activeFeature === 'movers' ? 'active' : ''}`}>
                <div className="db-section-label">TOP GAINERS — NSE · LIVE</div>
                <div className="preview-movers">
                  <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-3)' }}>
                    Live top gainers, losers & most active stocks
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
