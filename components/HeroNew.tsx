'use client';

import { useState } from 'react';

export default function HeroNew() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Scroll to waitlist section for full form
    document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0a0e12',
      padding: '120px 20px 80px',
      position: 'relative'
    }}>
      <div className="container" style={{ maxWidth: '900px', textAlign: 'center' }}>
        {/* Main Headline */}
        <h1 style={{
          fontSize: 'clamp(2.5rem, 7vw, 4.5rem)',
          fontWeight: 700,
          lineHeight: 1.2,
          color: '#fff',
          marginBottom: '24px',
          letterSpacing: '-0.02em'
        }}>
          Tired Of Juggling
          <br />
          Platforms To Keep Track
          <br />
          Of The Market
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: '1rem',
          color: 'rgba(255,255,255,0.6)',
          marginBottom: '48px',
          maxWidth: '500px',
          margin: '0 auto 48px'
        }}>
          Keeping up with the market doesn't have to be such a chore
        </p>

        {/* Email Input + CTA */}
        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          gap: '12px',
          maxWidth: '480px',
          margin: '0 auto 80px',
          alignItems: 'center'
        }}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              flex: 1,
              padding: '16px 24px',
              background: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '0.95rem',
              outline: 'none',
              color: '#000'
            }}
          />
          <button
            type="submit"
            style={{
              padding: '16px 32px',
              background: '#1a1f26',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '0.95rem',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            Get Started
          </button>
        </form>

        {/* Large Phone Screenshot Placeholder */}
        <div style={{
          width: '100%',
          maxWidth: '320px',
          height: '680px',
          background: '#fff',
          borderRadius: '8px',
          margin: '0 auto',
          boxShadow: '0 40px 100px rgba(0,0,0,0.5)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* This will be replaced with actual app screenshot */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#999',
            fontSize: '0.9rem',
            textAlign: 'center'
          }}>
            App Screenshot
            <br />
            320 x 680
          </div>
        </div>
      </div>
    </section>
  );
}
