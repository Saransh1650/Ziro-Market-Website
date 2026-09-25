'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from './AuthProvider';
import { supabaseBrowser } from '@/lib/supabase/client';
import SignedOut from './SignedOut';

/**
 * Username onboarding — the web equivalent of the mobile app's
 * `username_onboarding_screen`.
 *
 * Writes straight to the `profiles` table via Supabase rather than
 * through the backend, which is what the mobile app does and what RLS is
 * there to guard.
 */

const USERNAME_RE = /^[a-z0-9_]{3,20}$/;

export default function Onboarding() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useSearchParams();

  const raw = params.get('next') ?? '/app/market';
  const next = raw.startsWith('/') && !raw.startsWith('//') ? raw : '/app/market';

  const [username, setUsername] = useState('');
  const [status, setStatus] = useState<'idle' | 'checking' | 'saving'>('idle');
  const [error, setError] = useState<string | null>(null);

  const normalised = username.trim().toLowerCase();
  const valid = USERNAME_RE.test(normalised);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid || !user) return;

    setError(null);
    setStatus('checking');
    const supabase = supabaseBrowser();

    // Check before writing: the insert would fail on the unique index
    // anyway, but "that one's taken" is a better answer than a
    // constraint violation.
    const { data: taken } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', normalised)
      .maybeSingle();

    if (taken) {
      setStatus('idle');
      setError(`“${normalised}” is taken. Try another.`);
      return;
    }

    setStatus('saving');
    const { error: saveError } = await supabase
      .from('profiles')
      .upsert({ id: user.id, username: normalised });

    if (saveError) {
      setStatus('idle');
      setError(saveError.message);
      return;
    }

    router.replace(next);
  };

  if (loading) return <div style={{ height: 300 }} aria-hidden="true" />;
  if (!user) {
    return <SignedOut title="Sign in first" detail="Pick a username once you have an account." next="/app/onboarding" />;
  }

  return (
    <section
      style={{ display: 'grid', placeContent: 'center', minHeight: '70dvh', padding: 'var(--s-5)' }}
      aria-labelledby="onboarding-heading"
    >
      <form onSubmit={submit} style={{ width: 'min(380px, 90vw)', display: 'flex', flexDirection: 'column', gap: 'var(--s-3)' }}>
        <div>
          <h1 id="onboarding-heading" className="zw-title">Pick a username</h1>
          <p className="zw-sub" style={{ marginTop: 4 }}>
            This is how you appear in stock discussions. Lowercase letters, numbers and underscores, 3–20 characters.
          </p>
        </div>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span className="zw-colhead">Username</span>
          <input
            value={username}
            onChange={(e) => { setUsername(e.target.value); setError(null); }}
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            aria-describedby="username-hint"
            aria-invalid={username.length > 0 && !valid}
            style={{
              height: 40, padding: '0 10px', background: 'transparent',
              border: `1px solid ${username.length > 0 && !valid ? 'var(--negative)' : 'var(--border-2)'}`,
              borderRadius: 'var(--r-ctl)', fontSize: 14,
            }}
          />
        </label>

        <p id="username-hint" className="zw-sub" style={{ color: error ? 'var(--negative)' : 'var(--text-3)', minHeight: 18 }} role={error ? 'alert' : undefined}>
          {error ?? (username.length > 0 && !valid ? 'Use 3–20 lowercase letters, numbers or underscores.' : ' ')}
        </p>

        <button
          type="submit"
          disabled={!valid || status !== 'idle'}
          className="zw-chip"
          style={{ height: 40, opacity: !valid || status !== 'idle' ? 0.5 : 1 }}
        >
          {status === 'checking' ? 'Checking…' : status === 'saving' ? 'Saving…' : 'Continue'}
        </button>
      </form>
    </section>
  );
}
