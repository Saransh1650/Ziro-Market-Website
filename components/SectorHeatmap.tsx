'use client';

import { useState, useEffect, useMemo } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const sectors = [
  { name: 'Banking', cols: 2, top: ['HDFCBANK', 'ICICIBANK', 'SBIN'] },
  { name: 'IT Services', cols: 1, top: ['TCS', 'INFY', 'HCLTECH'] },
  { name: 'Energy', cols: 1, top: ['RELIANCE', 'ONGC', 'BPCL'] },
  { name: 'Automobile', cols: 1, top: ['MARUTI', 'TATAMOTORS', 'M&M'] },
  { name: 'FMCG', cols: 2, top: ['ITC', 'HINDUNILVR', 'NESTLEIND'] },
  { name: 'Pharmaceuticals', cols: 1, top: ['SUNPHARMA', 'DRREDDY', 'CIPLA'] },
  { name: 'Metals', cols: 1, top: ['TATASTEEL', 'HINDALCO', 'JSWSTEEL'] },
  { name: 'Infrastructure', cols: 1, top: ['LT', 'ADANIENT', 'GRASIM'] },
];

export default function SectorHeatmap() {
  const [ref, isVisible] = useScrollReveal<HTMLDivElement>({ threshold: 0.15 });
  const [hoveredSector, setHoveredSector] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const sectorData = useMemo(() => {
    return sectors.map((sector, i) => {
      const seed = (i * 0.23) % 1;
      const val = (seed - 0.5) * 5;
      const color = val > 1.5 ? '#1f9d55' : val > 0 ? '#10b981' : val > -1.5 ? '#ef4444' : '#dc2626';
      return { ...sector, val, color };
    });
  }, []);

  useEffect(() => {
    setMounted(true); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  return (
    <section className="section" id="signals" style={{ background: 'var(--bg-1)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <div className="container">
        <div className="section-head" ref={ref} style={{ 
          textAlign: 'center', 
          marginBottom: '72px',
          opacity: isVisible ? 1 : 0, 
          transform: isVisible ? 'translateY(0)' : 'translateY(30px)', 
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)' 
        }}>
          <div className="section-tag">
            <div className="badge">Sector Intelligence</div>
          </div>
          <h2>Detect Sector Momentum</h2>
          <div className="divider"></div>
          <p style={{ marginTop: '16px', fontSize: '1.05rem', maxWidth: '600px', margin: '16px auto 0' }}>
            Identify which parts of the Indian economy are attracting institutional capital in real-time.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '8px',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'scale(1)' : 'scale(0.98)',
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s'
        }}>
          {mounted && sectorData.map((sector) => (
            <div
              key={sector.name}
              onMouseEnter={() => setHoveredSector(sector.name)}
              onMouseLeave={() => setHoveredSector(null)}
              style={{
                gridColumn: `span ${sector.cols}`,
                background: hoveredSector === sector.name ? `${sector.color}25` : 'var(--bg-2)',
                border: `1px solid ${hoveredSector === sector.name ? sector.color : 'var(--border)'}`,
                borderRadius: '14px',
                padding: '28px',
                minHeight: '160px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                transform: hoveredSector === sector.name ? 'translateY(-4px)' : 'translateY(0)',
                boxShadow: hoveredSector === sector.name 
                  ? `0 24px 48px rgba(0,0,0,0.4)`
                  : 'none',
              }}
            >
              <div>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-4)', marginBottom: '10px' }}>
                  {sector.name}
                </div>
                <div style={{ 
                  fontSize: '2rem', 
                  fontWeight: 800,
                  fontFamily: 'var(--mono)',
                  color: sector.val >= 0 ? 'var(--green)' : 'var(--red)',
                  letterSpacing: '-0.02em'
                }}>
                  {sector.val >= 0 ? '+' : ''}{sector.val.toFixed(2)}%
                </div>
              </div>

              <div style={{ height: '40px', display: 'flex', alignItems: 'flex-end' }}>
                {hoveredSector === sector.name ? (
                  <div style={{ animation: 'revealUp 0.3s ease forwards' }}>
                    <div style={{ fontSize: '0.6rem', color: 'var(--text-4)', textTransform: 'uppercase', marginBottom: '4px' }}>Top Weighted</div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {sector.top.map((stock) => (
                        <span key={stock} className="mono" style={{ fontSize: '0.65rem', color: 'var(--text-2)', fontWeight: 600 }}>{stock}</span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div style={{ width: '100%', height: '1px', background: 'var(--border)', opacity: 0.5 }}></div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '48px', opacity: isVisible ? 1 : 0, transition: 'opacity 1s ease 0.5s' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-4)' }}>
            Hover over any sector to reveal its highest weighted constituents.
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes revealUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
