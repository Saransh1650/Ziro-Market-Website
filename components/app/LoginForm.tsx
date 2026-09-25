'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase/client';

/**
 * Sign in with the same providers as the mobile app, against the same
 * Supabase project — so a watchlist built on the phone is the watchlist
 * that appears here.
 */
export default function LoginForm() {
  const params = useSearchParams();
  const [busy, setBusy] = useState<'google' | 'apple' | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Where the user was heading before they were asked to sign in.
  // Only a relative path is accepted: an absolute URL here would be an
  // open redirect, handing an attacker a trusted link to anywhere.
  const raw = params.get('next') ?? '/app/market';
  const next = raw.startsWith('/') && !raw.startsWith('//') ? raw : '/app/market';

  const signIn = async (provider: 'google' | 'apple') => {
    setBusy(provider);
    setError(null);

    const { error: authError } = await supabaseBrowser().auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });

    if (authError) {
      setBusy(null);
      setError(authError.message);
    }
    // On success the browser is already navigating to the provider.
  };

  return (
    // A plain section, not a <main>: AppShell already renders the
    // page's main landmark, and two of them is an accessibility fault.
    <section
      style={{ display: 'grid', placeContent: 'center', minHeight: '70dvh', padding: 'var(--s-5)' }}
      aria-labelledby="login-heading"
    >
      <div style={{ width: 'min(360px, 90vw)', display: 'flex', flexDirection: 'column', gap: 'var(--s-4)' }}>
        <header>
          <h1 id="login-heading" className="zw-title">Sign in to Ziro</h1>
          <p className="zw-sub" style={{ marginTop: 4 }}>
            Your watchlists, portfolio and paper trades are the same here as in the app.
          </p>
        </header>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-2)' }}>
          <ProviderButton
            label="Continue with Google"
            busy={busy === 'google'}
            disabled={busy !== null}
            onClick={() => signIn('google')}
          />
          <ProviderButton
            label="Continue with Apple"
            busy={busy === 'apple'}
            disabled={busy !== null}
            onClick={() => signIn('apple')}
          />
        </div>

        {error && (
          <p role="alert" className="zw-sub" style={{ color: 'var(--negative)' }}>
            {error}
          </p>
        )}

        <p className="zw-sub" style={{ color: 'var(--text-3)' }}>
          Market data, stock pages and Discover stay open without signing in.
        </p>
      </div>
    </section>
  );
}

function ProviderButton({
  label,
  busy,
  disabled,
  onClick,
}: {
  label: string;
  busy: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        height: 42,
        border: '1px solid var(--border-2)',
        borderRadius: 'var(--r-ctl)',
        background: 'transparent',
        color: 'var(--text-1)',
        fontSize: 13,
        fontWeight: 600,
        cursor: disabled ? 'progress' : 'pointer',
        opacity: disabled && !busy ? 0.5 : 1,
      }}
    >
      {busy ? 'Redirecting…' : label}
    </button>
  );
}
