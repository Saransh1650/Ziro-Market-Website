'use client';
import { useState } from 'react';
import { isLaunched } from '@/lib/launchMode';
import LaunchCTA from './LaunchCTA';

type Platform = 'ios' | 'android';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Waitlist() {
  if (isLaunched()) {
    return (
      <section id="waitlist" className="section section-dark">
        <div className="container"><LaunchCTA /></div>
      </section>
    );
  }
  return <WaitlistForm />;
}

function WaitlistForm() {
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ position?: number; error?: string } | null>(null);

  return (
    <section id="waitlist" className="section crosshair section-dark">
      <div className="container" style={{ maxWidth: 560, textAlign: 'center' }}>
        <span className="section-num">№ 08 / Early Access</span>
        <h2 style={{ marginTop: 18 }}>
          Be first.<br /><em style={{ color: 'var(--amber)' }}>Be ready.</em>
        </h2>
        <p style={{ marginTop: 14, color: 'var(--text-2)' }}>
          Get the app the moment it ships. No spam, ever.
        </p>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setResult(null);
            if (!platform) return setResult({ error: 'Pick a platform first' });
            if (!EMAIL_RE.test(email)) return setResult({ error: 'Enter a valid email' });
            setSubmitting(true);
            try {
              const res = await fetch('/api/waitlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, platform }),
              });
              if (!res.ok) throw new Error(`HTTP ${res.status}`);
              const json = (await res.json()) as { position?: number };
              setResult({ position: json.position });
            } catch {
              setResult({ error: 'Could not reach server · retry' });
            } finally {
              setSubmitting(false);
            }
          }}
          style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 10 }}
        >
          {/* Platform selector */}
          <div
            role="radiogroup"
            aria-label="Platform"
            style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6,
              background: 'rgba(255,255,255,0.05)',
              padding: 5, borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.09)',
            }}
          >
            <PlatformButton current={platform} value="ios"     onSelect={setPlatform} label="iOS" />
            <PlatformButton current={platform} value="android" onSelect={setPlatform} label="Android" />
          </div>

          {/* Email */}
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label="Email"
            style={{
              padding: '15px 18px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.16)',
              borderRadius: 6, color: '#ffffff',
              fontSize: '0.95rem', outline: 'none',
              fontFamily: 'var(--sans)',
            }}
          />

          <button className="btn btn-primary btn-lg" type="submit" disabled={submitting}>
            {submitting ? 'Joining…' : 'Join the waitlist →'}
          </button>
        </form>

        <div style={{ marginTop: 16, fontFamily: 'var(--mono)', fontSize: '0.78rem', minHeight: 22, color: 'var(--text-3)' }}>
          {result?.position !== undefined && (
            <span style={{ color: 'var(--positive)' }}>You&apos;re #{result.position.toLocaleString('en-IN')} in line. 🎉</span>
          )}
          {result?.error && <span style={{ color: 'var(--negative)' }}>{result.error}</span>}
        </div>
      </div>
    </section>
  );
}

function PlatformButton({ current, value, onSelect, label }: {
  current: Platform | null; value: Platform; onSelect: (p: Platform) => void; label: string;
}) {
  const active = current === value;
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={() => onSelect(value)}
      aria-label={label}
      style={{
        padding: '11px 18px',
        background: active ? 'rgba(255,255,255,0.10)' : 'transparent',
        border: `1px solid ${active ? 'rgba(255,255,255,0.22)' : 'transparent'}`,
        borderRadius: 7,
        color: active ? '#ffffff' : 'rgba(255,255,255,0.38)',
        fontWeight: 600, cursor: 'pointer',
        fontFamily: 'var(--sans)', fontSize: '0.88rem',
        transition: 'background 0.15s, color 0.15s, border-color 0.15s',
      }}
    >{label}</button>
  );
}
