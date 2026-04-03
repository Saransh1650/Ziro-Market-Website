'use client';

import { useState, useEffect } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const watchlistA = [
  { symbol: 'HDFCBANK', name: 'HDFC Bank', price: 1628.40, change: 0.8, chart: [45, 48, 46, 52, 50, 55, 58] },
  { symbol: 'ICICIBANK', name: 'ICICI Bank', price: 1242.15, change: 1.2, chart: [38, 40, 42, 41, 45, 47, 49] },
  { symbol: 'SBIN', name: 'State Bank of India', price: 851.20, change: 3.1, chart: [28, 30, 32, 35, 38, 42, 46] },
  { symbol: 'AXISBANK', name: 'Axis Bank', price: 1133.90, change: -0.5, chart: [42, 44, 43, 40, 39, 38, 40] },
];

const watchlistB = [
  { symbol: 'TCS', name: 'Tata Consultancy Services', price: 3848.20, change: 1.5, chart: [52, 55, 58, 60, 62, 65, 68] },
  { symbol: 'INFY', name: 'Infosys Ltd', price: 1743.90, change: 0.9, chart: [45, 47, 48, 50, 51, 52, 54] },
  { symbol: 'WIPRO', name: 'Wipro Limited', price: 465.30, change: -1.2, chart: [35, 36, 34, 32, 31, 30, 29] },
  { symbol: 'HCLTECH', name: 'HCL Technologies', price: 1488.50, change: 0.4, chart: [40, 41, 42, 43, 42, 43, 44] },
];

function MiniChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 80 - ((val - min) / range) * 60; // Leave space for line width
    return `${x},${y}`;
  }).join(' ');

  const fillPoints = `0,100 ${points} 100,100`;

  return (
    <svg width="100%" height="40" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id={`grad-${color.replace('#','')}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      <polygon
        points={fillPoints}
        fill={`url(#grad-${color.replace('#','')})`}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export default function WatchlistIntelligence() {
  const [ref, isVisible] = useScrollReveal<HTMLDivElement>({ threshold: 0.15 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  return (
    <section className="section" id="watchlist" style={{ background: 'var(--bg)', paddingTop: '120px', paddingBottom: '120px' }}>
      <div className="container">
        <div className="section-head" ref={ref} style={{ 
          textAlign: 'center', 
          marginBottom: '80px',
          opacity: isVisible ? 1 : 0, 
          transform: isVisible ? 'translateY(0)' : 'translateY(30px)', 
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)' 
        }}>
          <div className="section-tag">
            <div className="badge">Data Comparison</div>
          </div>
          <h2>Intelligence in Every Watchlist</h2>
          <div className="divider"></div>
          <p style={{ marginTop: '16px', fontSize: '1.05rem', maxWidth: '640px', margin: '16px auto 0' }}>
            Compare indices, sectors, or custom themes side-by-side with institutional-grade charting tools.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '40px',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s'
        }}>
          {/* Watchlist A - Banking */}
          <div className="phone-mockup-frame" style={{
            background: 'var(--bg-2)',
            border: '1px solid var(--border)',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
            position: 'relative'
          }}>
            <div style={{
              padding: '24px 28px',
              borderBottom: '1px solid var(--border)',
              background: 'var(--bg-3)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-4)' }}>Watchlist</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>Banking</div>
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--green)', background: 'var(--green-dim)', padding: '4px 10px', borderRadius: '6px' }}>
                +1.42%
              </div>
            </div>

            <div style={{ padding: '12px' }}>
              {mounted && watchlistA.map((stock, i) => (
                <div
                  key={stock.symbol}
                  className="wl-item-hover"
                  style={{
                    padding: '16px 20px',
                    borderRadius: '12px',
                    marginBottom: i < watchlistA.length - 1 ? '8px' : 0,
                    background: 'rgba(255,255,255,0.02)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div>
                      <div className="mono" style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-1)' }}>{stock.symbol}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-4)' }}>{stock.name}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div className="mono" style={{ fontSize: '0.9rem', fontWeight: 700 }}>₹{stock.price.toLocaleString('en-IN')}</div>
                      <div className="mono" style={{ fontSize: '0.75rem', fontWeight: 700, color: stock.change >= 0 ? 'var(--green)' : 'var(--red)' }}>
                        {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                  <MiniChart data={stock.chart} color={stock.change >= 0 ? '#1f9d55' : '#d64545'} />
                </div>
              ))}
            </div>
          </div>

          {/* Watchlist B - IT */}
          <div className="phone-mockup-frame" style={{
            background: 'var(--bg-2)',
            border: '1px solid var(--border)',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
            position: 'relative'
          }}>
            <div style={{
              padding: '24px 28px',
              borderBottom: '1px solid var(--border)',
              background: 'var(--bg-3)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-4)' }}>Watchlist</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>IT Services</div>
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--green)', background: 'var(--green-dim)', padding: '4px 10px', borderRadius: '6px' }}>
                +0.38%
              </div>
            </div>

            <div style={{ padding: '12px' }}>
              {mounted && watchlistB.map((stock, i) => (
                <div
                  key={stock.symbol}
                  className="wl-item-hover"
                  style={{
                    padding: '16px 20px',
                    borderRadius: '12px',
                    marginBottom: i < watchlistB.length - 1 ? '8px' : 0,
                    background: 'rgba(255,255,255,0.02)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div>
                      <div className="mono" style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-1)' }}>{stock.symbol}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-4)' }}>{stock.name}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div className="mono" style={{ fontSize: '0.9rem', fontWeight: 700 }}>₹{stock.price.toLocaleString('en-IN')}</div>
                      <div className="mono" style={{ fontSize: '0.75rem', fontWeight: 700, color: stock.change >= 0 ? 'var(--green)' : 'var(--red)' }}>
                        {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                  <MiniChart data={stock.chart} color={stock.change >= 0 ? '#1f9d55' : '#d64545'} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '56px', opacity: isVisible ? 1 : 0, transition: 'opacity 1s ease 0.5s' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-4)' }}>
            All charts animate in real-time within the mobile application.
          </p>
        </div>
      </div>

      <style jsx>{`
        .wl-item-hover:hover {
          background: rgba(255,255,255,0.05) !important;
          transform: scale(1.02);
        }
      `}</style>
    </section>
  );
}
