'use client';

import { useState, useEffect, useMemo } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function ChartExperience() {
  const [ref, isVisible] = useScrollReveal<HTMLDivElement>({ threshold: 0.2 });
  const [expanded, setExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const chartData = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      height: 40 + Math.sin(i * 0.5) * 30 + Math.abs(Math.cos(i * 0.8)) * 20,
      isUp: Math.sin(i * 0.5) > 0
    }));
  }, []);

  return (
    <section 
      ref={ref}
      style={{ 
        padding: '160px 0',
        background: 'linear-gradient(180deg, var(--bg) 0%, var(--bg-1) 100%)',
        position: 'relative'
      }}
    >
      <div className="container" style={{ maxWidth: '1000px' }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h2 style={{
            fontSize: 'clamp(2.5rem, 4vw, 4rem)',
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: '-0.04em',
            marginBottom: '24px',
            color: 'var(--text-1)',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            Chart Experience
          </h2>
          <p style={{
            fontSize: '1.3rem',
            lineHeight: 1.7,
            color: 'var(--text-2)',
            maxWidth: '560px',
            margin: '0 auto',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s'
          }}>
            From quick glance to deep analysis with a single tap.
          </p>
        </div>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'center',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'scale(1)' : 'scale(0.95)',
          transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.3s'
        }}>
          <div 
            style={{
              width: expanded ? 'min(900px, 92vw)' : '340px',
              minHeight: expanded ? '500px' : '680px',
              background: 'var(--bg-2)',
              border: '2px solid var(--border-2)',
              borderRadius: expanded ? '24px' : '48px',
              overflow: 'hidden',
              boxShadow: '0 40px 120px rgba(0,0,0,0.8)',
              transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
              cursor: 'pointer',
              position: 'relative',
              margin: '0 auto'
            }}
            onClick={() => setExpanded(!expanded)}
          >
            {/* Notch (only in compact mode) */}
            {!expanded && (
              <div style={{
                height: '44px',
                background: 'var(--bg-1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{
                  width: '130px',
                  height: '6px',
                  background: 'var(--bg-3)',
                  borderRadius: '99px'
                }}></div>
              </div>
            )}

            {/* Chart Content */}
            <div style={{ padding: expanded ? '40px' : '28px 24px' }}>
              {/* Header */}
              <div style={{ marginBottom: '28px' }}>
                <div style={{ 
                  fontSize: expanded ? '2.5rem' : '2rem', 
                  fontWeight: 900, 
                  fontFamily: 'var(--mono)', 
                  color: 'var(--text-1)',
                  marginBottom: '8px',
                  transition: 'font-size 0.6s ease'
                }}>
                  RELIANCE
                </div>
                <div style={{ 
                  fontSize: expanded ? '1.5rem' : '1.2rem', 
                  fontWeight: 700,
                  color: 'var(--green)',
                  transition: 'font-size 0.6s ease'
                }}>
                  ₹2,945.60 <span style={{ fontSize: '0.85em', marginLeft: '8px' }}>+1.8%</span>
                </div>
              </div>

              {/* Simple Chart */}
              <div style={{ 
                height: expanded ? '360px' : '280px', 
                background: 'var(--bg-3)',
                borderRadius: '20px',
                padding: '20px',
                display: 'flex',
                alignItems: 'flex-end',
                gap: expanded ? '12px' : '6px',
                marginBottom: '24px',
                transition: 'all 0.6s ease'
              }}>
                {mounted && (expanded ? chartData : chartData.slice(0, 20)).map((d, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: `${Math.round(d.height)}%`,
                      background: d.isUp ? 'var(--green)' : 'var(--red)',
                      borderRadius: '4px',
                      opacity: 0.85,
                      transition: 'all 0.6s ease',
                      minWidth: expanded ? '16px' : '10px'
                    }}
                  ></div>
                ))}
              </div>

              {/* Expanded Details */}
              {expanded && (
                <div 
                  className="exp-stats-grid"
                  style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', 
                    gap: '12px',
                    animation: 'fadeIn 0.6s ease 0.3s both'
                  }}
                >
                  {[
                    { label: 'Open', value: '₹2,890' },
                    { label: 'High', value: '₹2,967' },
                    { label: 'Low', value: '₹2,885' },
                    { label: 'Volume', value: '12.4M' }
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      style={{
                        background: 'var(--bg-3)',
                        padding: '20px',
                        borderRadius: '16px',
                        border: '1px solid var(--border)'
                      }}
                    >
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginBottom: '6px', textTransform: 'uppercase' }}>
                        {stat.label}
                      </div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-1)', fontFamily: 'var(--mono)' }}>
                        {stat.value}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tap to expand hint */}
              {!expanded && (
                <div style={{ 
                  textAlign: 'center', 
                  fontSize: '0.85rem', 
                  color: 'var(--text-4)',
                  marginTop: '32px'
                }}>
                  Tap to expand →
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
