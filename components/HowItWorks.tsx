'use client';

import { useScrollReveal } from '@/hooks/useScrollReveal';

const steps = [
  {
    num: '01',
    title: 'Raw Market Data',
    desc: 'We ingest millions of data points every second directly from NSE and BSE, covering price action, volume spikes, and order book depth.',
    icon: '📡',
  },
  {
    num: '02',
    title: 'Signal Intelligence',
    desc: 'Our proprietary engine processes raw data into high-conviction signals,identifying sector rotations and institutional momentum instantly.',
    icon: '⚡',
  },
  {
    num: '03',
    title: 'Actionable Insights',
    desc: 'Signals are transformed into human-readable insights, summaries, and community conversations to help you make informed decisions.',
    icon: '💡',
  },
];

export default function HowItWorks() {
  const [ref, isVisible] = useScrollReveal<HTMLDivElement>({ threshold: 0.15 });

  return (
    <section 
      ref={ref}
      className="section" 
      id="how-it-works"
      style={{ 
        background: 'var(--bg)', 
        borderTop: '1px solid var(--border)',
        paddingTop: '120px', 
        paddingBottom: '120px' 
      }}
    >
      <div className="container">
        <div 
          className="section-head" 
          style={{
            textAlign: 'center',
            marginBottom: '80px',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <div className="section-tag">
            <div className="badge">Our Process</div>
          </div>
          <h2>The Intelligence Pipeline</h2>
          <div className="divider"></div>
          <p style={{ marginTop: '16px', fontSize: '1.05rem', maxWidth: '640px', margin: '16px auto 0' }}>
            From raw exchange feeds to high-conviction trading signals in milliseconds.
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '64px',
          marginTop: '24px'
        }}>
          {steps.map((step, i) => (
            <div 
              key={step.num}
              style={{
                position: 'relative',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
                transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.15}s`
              }}
            >
              <div style={{
                fontSize: '5rem',
                fontWeight: 900,
                lineHeight: 1,
                color: 'var(--bg-2)',
                marginBottom: '-20px',
                fontFamily: 'var(--mono)',
                opacity: 0.8,
                letterSpacing: '-0.05em'
              }}>
                {step.num}
              </div>
              
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  background: 'var(--bg-2)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.8rem',
                  marginBottom: '28px',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
                }}>
                  {step.icon}
                </div>

                <h3 style={{ 
                  fontSize: '1.4rem', 
                  fontWeight: 800, 
                  marginBottom: '16px',
                  color: 'var(--text-1)',
                  letterSpacing: '-0.01em'
                }}>
                  {step.title}
                </h3>
                <p style={{ 
                  fontSize: '1rem', 
                  lineHeight: 1.7, 
                  color: 'var(--text-3)' 
                }}>
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ 
          textAlign: 'center', 
          marginTop: '96px',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.5s'
        }}>
          <div style={{
            display: 'inline-block',
            padding: '32px 48px',
            background: 'var(--bg-2)',
            border: '1px solid var(--border)',
            borderRadius: '24px',
            maxWidth: '600px'
          }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px' }}>Experience the pipeline in real-time.</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-4)', marginBottom: '24px' }}>
              Our engine never sleeps. It continues to process after-market data and pre-market signals to keep you prepared.
            </p>
            <a 
              href="#waitlist" 
              className="btn btn-primary"
            >
              Secure Early Access
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
