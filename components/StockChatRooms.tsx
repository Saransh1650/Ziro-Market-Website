'use client';

import { useState, useEffect } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const chatMessages = [
  { id: 1, user: 'Arjun_V', message: 'Reliance showing strong momentum today. Breakout imminent?', time: '2m ago', likes: 142 },
  { id: 2, user: 'Siddharth_M', message: 'Volume spike detected on NSE at 2:15 PM. Institutional blocks?', time: '5m ago', likes: 88 },
  { id: 3, user: 'Priya_Trader', message: 'Energy sector looks bullish. Watch for Reliance to lead the NIFTY rally.', time: '8m ago', likes: 156 },
  { id: 4, user: 'Capital_Mind', message: 'Technical breakout above 2950 resistance level confirmed.', time: '12m ago', likes: 64 },
  { id: 5, user: 'MarketLens', message: 'FII data shows consistent accumulation in the oil-to-telecom major.', time: '15m ago', likes: 210 },
  { id: 6, user: 'Rahul_Quant', message: 'Volume is 2.5x the 20-day average. Something is definitely moving here.', time: '18m ago', likes: 45 },
];

export default function StockChatRooms() {
  const [ref, isVisible] = useScrollReveal<HTMLDivElement>({ threshold: 0.15 });
  const [hoveredMessage, setHoveredMessage] = useState<number | null>(null);
  const [visibleMessages, setVisibleMessages] = useState<number>(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  useEffect(() => {
    if (isVisible && mounted) {
      const interval = setInterval(() => {
        setVisibleMessages(prev => {
          if (prev < chatMessages.length) {
            return prev + 1;
          }
          clearInterval(interval);
          return prev;
        });
      }, 800);

      return () => clearInterval(interval);
    }
  }, [isVisible, mounted]);

  return (
    <section className="section" id="community" style={{ background: 'var(--bg-1)', paddingTop: '120px', paddingBottom: '120px' }}>
      <div className="container">
        <div className="section-head" ref={ref} style={{ 
          textAlign: 'center', 
          marginBottom: '80px',
          opacity: isVisible ? 1 : 0, 
          transform: isVisible ? 'translateY(0)' : 'translateY(30px)', 
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)' 
        }}>
          <div className="section-tag">
            <div className="badge">Social Signals</div>
          </div>
          <h2>Voices of the Market</h2>
          <div className="divider"></div>
          <p style={{ marginTop: '16px', fontSize: '1.05rem', maxWidth: '640px', margin: '16px auto 0' }}>
            Tap into the collective intelligence of thousands of verified Indian traders and analysts in real-time.
          </p>
        </div>

        <div style={{ 
          maxWidth: '800px', 
          margin: '0 auto',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s'
        }}>
          {/* Chat Interface */}
          <div style={{
            background: 'var(--bg-2)',
            border: '1px solid var(--border)',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 32px 64px rgba(0,0,0,0.5)',
            position: 'relative'
          }}>
            {/* Chat Header */}
            <div style={{
              background: 'var(--bg-3)',
              padding: '24px 32px',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ 
                  width: '48px', 
                  height: '48px', 
                  background: 'var(--bg-1)', 
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  border: '1px solid var(--border)'
                }}>
                  💬
                </div>
                <div>
                  <div style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-4)' }}>Room</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'var(--mono)' }}>RELIANCE</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="badge-live" style={{ fontSize: '0.65rem' }}>2.8k active</div>
              </div>
            </div>

            {/* Chat Body */}
            <div style={{
              padding: '32px',
              maxHeight: '520px',
              overflowY: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              position: 'relative'
            }}>
              {mounted && chatMessages.slice(0, visibleMessages).map((msg, index) => (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    gap: '16px',
                    opacity: 1,
                    transform: 'translateY(0)',
                    animation: 'messageIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                  }}
                >
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: 'var(--bg-3)',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: 'var(--accent-2)',
                    border: '1px solid var(--border)'
                  }}>
                    {msg.user.charAt(0)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-1)' }}>{msg.user}</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-4)' }}>{msg.time}</span>
                    </div>
                    <div style={{ 
                      fontSize: '0.95rem', 
                      color: 'var(--text-2)', 
                      lineHeight: 1.6,
                      background: 'rgba(255,255,255,0.02)',
                      padding: '12px 16px',
                      borderRadius: '0 12px 12px 12px',
                      border: '1px solid var(--border)'
                    }}>
                      {msg.message}
                    </div>
                    <div style={{ marginTop: '6px', fontSize: '0.7rem', color: 'var(--green)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span>▲</span> {msg.likes} traders liked this
                    </div>
                  </div>
                </div>
              ))}

              {/* Fading bottom mask */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '80px',
                background: 'linear-gradient(to top, var(--bg-2), transparent)',
                pointerEvents: 'none'
              }} />
            </div>

            {/* Input Overlay */}
            <div style={{
              padding: '24px 32px',
              background: 'var(--bg-3)',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}>
              <div style={{ 
                flex: 1, 
                padding: '12px 18px', 
                background: 'var(--bg-1)', 
                borderRadius: '12px', 
                fontSize: '0.85rem', 
                color: 'var(--text-4)',
                border: '1px solid var(--border)'
              }}>
                Jump into the conversation...
              </div>
              <div className="btn btn-primary btn-sm">JOIN ROOM</div>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '48px', opacity: isVisible ? 1 : 0, transition: 'opacity 1s ease 1s' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-4)' }}>
            Community sentiment analysis available for all NSE listed stocks.
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes messageIn {
          from { opacity: 0; transform: translateY(12px) translateX(-4px); }
          to { opacity: 1; transform: translateY(0) translateX(0); }
        }
      `}</style>
    </section>
  );
}
