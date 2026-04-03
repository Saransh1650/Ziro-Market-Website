'use client';

import { useScrollReveal } from '@/hooks/useScrollReveal';

const messages = [
  { user: 'Rahul K.', avatar: '👨‍💼', text: 'Massive volume spike in banking sector today', time: '2m', color: '#3a6ea5' },
  { user: 'Priya S.', avatar: '👩‍💻', text: 'RELIANCE breaking out! 🚀', time: '5m', color: '#22c55e' },
  { user: 'Amit P.', avatar: '👨‍🎓', text: 'Added 100 shares to my position', time: '8m', color: '#f59e0b' },
  { user: 'Neha M.', avatar: '👩‍💼', text: 'Watch the resistance at 2950', time: '12m', color: '#d64545' },
  { user: 'Vikram R.', avatar: '🧑‍💻', text: 'Strong support at current levels', time: '15m', color: '#8b5cf6' },
];

export default function StockChatRooms() {
  const [ref, isVisible] = useScrollReveal<HTMLDivElement>({ threshold: 0.2 });

  return (
    <section 
      ref={ref}
      style={{ 
        padding: '160px 0',
        background: 'var(--bg)',
        position: 'relative'
      }}
    >
      <div className="container" style={{ maxWidth: '1100px' }}>
        {/* Text on left, Chat on right */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1.2fr', 
          gap: '100px', 
          alignItems: 'center' 
        }}>
          {/* Left - Text */}
          <div style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateX(0)' : 'translateX(-40px)',
            transition: 'all 0.9s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            <h2 style={{
              fontSize: 'clamp(2.5rem, 4vw, 4rem)',
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: '-0.04em',
              marginBottom: '24px',
              color: 'var(--text-1)'
            }}>
              Trade Together
            </h2>
            <p style={{
              fontSize: '1.3rem',
              lineHeight: 1.7,
              color: 'var(--text-2)',
              marginBottom: '32px'
            }}>
              Join live discussions with thousands of traders. Share insights, learn strategies, and stay updated on market movements.
            </p>
            <div style={{ 
              display: 'flex', 
              gap: '32px', 
              fontSize: '1rem', 
              color: 'var(--text-3)' 
            }}>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-1)', marginBottom: '6px' }}>
                  50K+
                </div>
                <div>Active traders</div>
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-1)', marginBottom: '6px' }}>
                  500+
                </div>
                <div>Stock rooms</div>
              </div>
            </div>
          </div>

          {/* Right - Chat Interface */}
          <div style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateX(0)' : 'translateX(40px)',
            transition: 'all 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.15s'
          }}>
            <div style={{
              background: 'var(--bg-2)',
              border: '2px solid var(--border-2)',
              borderRadius: '32px',
              overflow: 'hidden',
              boxShadow: '0 30px 80px rgba(0,0,0,0.6)'
            }}>
              {/* Chat Header */}
              <div style={{
                padding: '28px 32px',
                borderBottom: '1px solid var(--border)',
                background: 'var(--bg-3)'
              }}>
                <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: '8px', letterSpacing: '0.05em' }}>
                  Stock Discussion
                </div>
                <div style={{ 
                  fontSize: '2rem', 
                  fontWeight: 900, 
                  fontFamily: 'var(--mono)', 
                  color: 'var(--text-1)',
                  marginBottom: '12px'
                }}>
                  RELIANCE
                </div>
                <div style={{ display: 'flex', gap: '24px', fontSize: '0.85rem', color: 'var(--text-3)' }}>
                  <span>👥 2,847 online</span>
                  <span>💬 1,234 messages today</span>
                </div>
              </div>

              {/* Chat Messages */}
              <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px', minHeight: '400px' }}>
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    style={{
                      background: 'var(--bg-3)',
                      border: '1px solid var(--border)',
                      borderRadius: '16px',
                      padding: '20px 24px',
                      opacity: isVisible ? 1 : 0,
                      transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                      transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${0.4 + i * 0.1}s`
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: msg.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.2rem'
                      }}>
                        {msg.avatar}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-1)' }}>
                          {msg.user}
                        </div>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-4)' }}>
                        {msg.time}
                      </div>
                    </div>
                    <div style={{ fontSize: '0.95rem', color: 'var(--text-2)', lineHeight: 1.6, paddingLeft: '48px' }}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
