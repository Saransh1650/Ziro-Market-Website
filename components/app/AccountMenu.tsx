'use client';

import { useEffect, useRef, useState } from 'react';
import { useAuth } from './AuthProvider';

/**
 * Account control in the header: sign in when signed out, and a menu
 * with the account's identity and sign-out when signed in.
 */
export default function AccountMenu() {
  const { user, session, loading, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointer = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      // Focus goes back to the control that opened it, not to the page.
      triggerRef.current?.focus();
    };

    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // A fixed-width slot, so the header does not reflow when the session
  // resolves and the control changes from "Sign in" to an avatar.
  if (loading) return <span style={{ width: 26, flexShrink: 0 }} aria-hidden="true" />;

  if (!user) {
    return (
      <a
        className="zw-btn zw-btn-sm"
        href="/app/login"
        style={{ flexShrink: 0, textDecoration: 'none' }}
      >
        Sign in
      </a>
    );
  }

  const email = user.email ?? '';
  const name = (user.user_metadata?.full_name as string | undefined) ?? email.split('@')[0] ?? 'Account';
  const initial = (name[0] ?? '?').toUpperCase();

  return (
    <div ref={wrapRef} style={{ position: 'relative', flexShrink: 0 }}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Account: ${name}`}
        style={{
          width: 26, height: 26, borderRadius: '50%',
          border: '1px solid var(--line-strong)', background: 'var(--surface-hover)',
          color: 'var(--ink)', fontSize: 11, fontWeight: 700, cursor: 'pointer',
          display: 'grid', placeItems: 'center',
        }}
      >
        {initial}
      </button>

      {open && (
        <div
          role="menu"
          style={{
            position: 'absolute', right: 0, top: 32, zIndex: 120, minWidth: 210,
            background: 'var(--surface)', border: '1px solid var(--line-strong)',
            borderRadius: 'var(--r-overlay)', boxShadow: 'var(--shadow-overlay)',
            padding: 'var(--s-2)',
          }}
        >
          <div style={{ padding: '6px 8px 8px', borderBottom: '1px solid var(--line)', marginBottom: 4 }}>
            <p className="zw-sym" style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</p>
            {email && (
              <p className="zw-sub" style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{email}</p>
            )}
          </div>

          <MenuLink href="/app/watchlist">Watchlist</MenuLink>
          <MenuLink href="/app/portfolio">Portfolio</MenuLink>
          <MenuLink href="/app/paper">Paper trade</MenuLink>
          <MenuLink href="/app/alerts">Price alerts</MenuLink>
          <MenuLink href="/app/onboarding">Change username</MenuLink>

          <button
            type="button"
            role="menuitem"
            onClick={async () => {
              setOpen(false);
              await signOut();
            }}
            style={{
              display: 'block', width: '100%', textAlign: 'left', padding: '7px 8px',
              background: 'none', border: 0, cursor: 'pointer', fontSize: 12,
              color: 'var(--ink)', borderTop: '1px solid var(--line)', marginTop: 4,
            }}
          >
            Sign out
          </button>

          <button
            type="button"
            role="menuitem"
            disabled={deleting}
            onClick={async () => {
              // Irreversible and it takes the data with it, so it asks
              // twice and names exactly what goes.
              if (!window.confirm('Delete your Ziro account?\n\nThis removes your watchlists, portfolio and paper trades permanently, on web and in the app. It cannot be undone.')) return;
              if (!window.confirm('Last check — permanently delete the account and all of its data?')) return;

              setDeleting(true);
              const res = await fetch('/api/backend/user/account', {
                method: 'DELETE',
                headers: session?.access_token ? { authorization: `Bearer ${session.access_token}` } : {},
              });
              setDeleting(false);

              if (!res.ok) {
                window.alert('The account could not be deleted. Nothing has changed — try again, or contact support.');
                return;
              }
              await signOut();
              window.location.href = '/';
            }}
            style={{
              display: 'block', width: '100%', textAlign: 'left', padding: '7px 8px',
              background: 'none', border: 0, cursor: deleting ? 'progress' : 'pointer', fontSize: 12,
              color: 'var(--down)',
            }}
          >
            {deleting ? 'Deleting…' : 'Delete account'}
          </button>
        </div>
      )}
    </div>
  );
}

function MenuLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      role="menuitem"
      href={href}
      style={{ display: 'block', padding: '7px 8px', fontSize: 12, color: 'var(--ink)', borderRadius: 'var(--r-ctl)' }}
    >
      {children}
    </a>
  );
}
