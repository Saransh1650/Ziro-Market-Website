'use client';
import { useState, type FormEvent } from 'react';
import { isLaunched } from '@/lib/launchMode';
import LaunchCTA from './LaunchCTA';

type Platform = 'ios' | 'android';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Waitlist() {
  if (isLaunched()) {
    return (
      <section id="waitlist" className="section">
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

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setResult(null);
    if (!platform) return setResult({ error: 'Pick a platform' });
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
  }

  return (
    <section id="waitlist" className="section crosshair" style={{ background: 'var(--bg-1)' }}>
      <div className="container" style={{ maxWidth: 600, textAlign: 'center' }}>
        <span className="section-num">№ 14 / WAITLIST</span>
        <h2 style={{ marginTop: 18, fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)' }}>
          Be early. <span className="amber">Be ready.</span>
        </h2>
        <p style={{ marginTop: 12, color: 'var(--text-3)' }}>
          Get the app the moment it ships. No spam, ever.
        </p>

        <form onSubmit={onSubmit} style={{ marginTop: 36, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div role="radiogroup" aria-label="Platform" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, background: 'var(--bg-2)', padding: 5, borderRadius: 12 }}>
            <PlatformButton current={platform} value="ios"     onSelect={setPlatform} label="iOS" />
            <PlatformButton current={platform} value="android" onSelect={setPlatform} label="Android" />
          </div>
          <input
            type="email" placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)}
            aria-label="Email"
            style={{
              padding: '16px 18px', background: 'var(--bg-2)', border: '1px solid var(--border-2)',
              borderRadius: 8, color: 'var(--text-1)', fontSize: '0.95rem', outline: 'none',
            }}
          />
          <button
            className="btn btn-amber btn-lg" type="submit" disabled={submitting}
          >
            {submitting ? 'Submitting…' : 'Join the waitlist →'}
          </button>
        </form>

        <div className="mono" style={{ marginTop: 16, fontSize: '0.78rem', minHeight: 22 }}>
          {result?.position !== undefined && (
            <span className="up">You&apos;re #{result.position.toLocaleString('en-IN')} in line.</span>
          )}
          {result?.error && <span className="down">{result.error}</span>}
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
      type="button" role="radio" aria-checked={active}
      onClick={() => onSelect(value)}
      aria-label={label}
      style={{
        padding: '11px 18px',
        background: active ? 'var(--bg-3)' : 'transparent',
        border: `1px solid ${active ? 'var(--border-2)' : 'transparent'}`,
        borderRadius: 8, color: active ? 'var(--text-1)' : 'var(--text-3)',
        fontWeight: 600, cursor: 'pointer',
      }}
    >{label}</button>
  );
}
