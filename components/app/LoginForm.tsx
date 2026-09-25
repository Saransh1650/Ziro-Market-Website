'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
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
    <section className="zw-authwrap" aria-labelledby="login-heading">
      <div className="zw-authcard">
        <Image src="/app_icon/ziro.png" alt="" width={44} height={44} className="mark" />
        <header>
          <h1 id="login-heading" className="zw-title">Welcome to Ziro</h1>
          <p className="zw-sub">
            Your watchlists, portfolio and paper trades are the same here as in the app.
          </p>
        </header>

        <div className="stack">
          <ProviderButton
            label="Continue with Google"
            icon={<GoogleMark />}
            busy={busy === 'google'}
            disabled={busy !== null}
            onClick={() => signIn('google')}
          />
          <ProviderButton
            label="Continue with Apple"
            icon={<AppleMark />}
            busy={busy === 'apple'}
            disabled={busy !== null}
            onClick={() => signIn('apple')}
          />
        </div>

        {error && (
          <p role="alert" className="zw-sub" style={{ color: 'var(--down)' }}>
            {error}
          </p>
        )}

        <p className="zw-meta foot">
          Market data, stock pages and Discover stay open without signing in.
        </p>
      </div>
    </section>
  );
}

function ProviderButton({
  label,
  icon,
  busy,
  disabled,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  busy: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button type="button" className="zw-provider" onClick={onClick} disabled={disabled}>
      {icon}
      {busy ? 'Redirecting…' : label}
    </button>
  );
}

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8z" />
      <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.3v3.1A12 12 0 0 0 12 24z" />
      <path fill="#FBBC05" d="M5.3 14.3a7.2 7.2 0 0 1 0-4.6V6.6H1.3a12 12 0 0 0 0 10.8l4-3.1z" />
      <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.3 6.6l4 3.1c.9-2.8 3.6-4.9 6.7-4.9z" />
    </svg>
  );
}

function AppleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
    </svg>
  );
}
