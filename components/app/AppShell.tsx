'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useSyncExternalStore } from 'react';
import { useTheme } from './ThemeProvider';
import TickerStrip from './TickerStrip';
import CommandPalette from './CommandPalette';
import AccountMenu from './AccountMenu';
import AssistantPanel from './AssistantPanel';

/**
 * The frame every product surface renders inside.
 *
 * A 72px icon rail at ≥1024px, a five-slot bottom bar below that. The
 * rail has no collapse toggle: it would buy 30px and cost a stored
 * preference, a control to design, and a decision the user has to make.
 */

const NAV = [
  { href: '/app/market', label: 'Market', key: 'm', icon: IconGrid },
  { href: '/app/watchlist', label: 'Watchlist', key: 'w', icon: IconList },
  { href: '/app/discover', label: 'Discover', key: 'd', icon: IconCompass },
  { href: '/app/portfolio', label: 'Portfolio', key: 'p', icon: IconPie },
  { href: '/app/paper', label: 'Paper', key: 't', icon: IconTicket },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  useGoToShortcut(router);

  return (
    <div className="zw" style={{ display: 'flex', minHeight: '100dvh' }}>
      <a href="#surface" className="zw-skip">Skip to content</a>

      <Rail pathname={pathname} />

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <Header />
        <main
          id="surface"
          tabIndex={-1}
          style={{ flex: 1, minWidth: 0, paddingBottom: 'var(--bottom-pad, 0px)' }}
        >
          {children}
        </main>
      </div>

      <AssistantPanel />

      <BottomBar pathname={pathname} />
      <CommandPalette />

      <style>{`
        @media (max-width: 1023px) {
          .zw-rail { display: none !important; }
          .zw-bottombar { display: grid !important; }
          #surface { --bottom-pad: 56px; }
        }
      `}</style>
    </div>
  );
}

/* ── Rail ─────────────────────────────────────────────────────── */

function Rail({ pathname }: { pathname: string }) {
  return (
    <nav
      className="zw-rail"
      aria-label="Product sections"
      style={{
        width: 'var(--rail-w)',
        flexShrink: 0,
        borderRight: '1px solid var(--border-1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--s-1)',
        paddingTop: 'var(--s-2)',
        position: 'sticky',
        top: 0,
        height: '100dvh',
      }}
    >
      <Link
        href="/"
        aria-label="Ziro Market home"
        style={{ padding: 'var(--s-2)', marginBottom: 'var(--s-1)' }}
      >
        <Image src="/app_icon/ziro.png" alt="" width={22} height={22} style={{ borderRadius: 3 }} />
      </Link>

      {NAV.map((item) => (
        <RailItem key={item.href} item={item} active={pathname.startsWith(item.href)} />
      ))}
    </nav>
  );
}

function RailItem({
  item,
  active,
}: {
  item: (typeof NAV)[number];
  active: boolean;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      aria-current={active ? 'page' : undefined}
      title={`${item.label}  (g ${item.key})`}
      style={{
        width: 56,
        height: 48,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
        borderRadius: 'var(--r-ctl)',
        color: active ? 'var(--text-1)' : 'var(--text-3)',
        background: active ? 'var(--bg-2)' : 'transparent',
      }}
    >
      <Icon />
      <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '-0.01em' }}>{item.label}</span>
    </Link>
  );
}

/* ── Header ───────────────────────────────────────────────────── */

function Header() {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        background: 'var(--bg-0)',
        borderBottom: '1px solid var(--border-1)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--s-3)',
        height: 'var(--header-h)',
        padding: '0 var(--s-3)',
      }}
    >
      <TickerStrip />
      <SearchTrigger />
      <AssistantTrigger />
      <ThemeToggle />
      <AccountMenu />
    </header>
  );
}

/**
 * Whether to label the palette shortcut ⌘K or Ctrl K.
 *
 * The platform is browser state that never changes, so it is read
 * through an external store rather than mirrored into React with an
 * effect. The server snapshot is `false`, matching what the pre-paint
 * HTML says, so hydration stays consistent.
 */
const subscribePlatform = () => () => {};
const isMacSnapshot = () => /Mac|iPhone|iPad/.test(navigator.userAgent);
const isMacServerSnapshot = () => false;

function SearchTrigger() {
  const mac = useSyncExternalStore(subscribePlatform, isMacSnapshot, isMacServerSnapshot);

  return (
    <button
      type="button"
      className="zw-chip"
      style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6 }}
      onClick={() => document.dispatchEvent(new CustomEvent('zw:open-palette'))}
    >
      <IconSearch />
      <span style={{ fontFamily: 'var(--mono)', fontSize: 10 }}>{mac ? '⌘K' : 'Ctrl K'}</span>
    </button>
  );
}

function AssistantTrigger() {
  return (
    <button
      type="button"
      className="zw-chip"
      style={{ flexShrink: 0 }}
      onClick={() => document.dispatchEvent(new CustomEvent('zw:open-assistant'))}
      title="Ask Ziro  (⌘J)"
    >
      Ask Ziro
    </button>
  );
}

function ThemeToggle() {
  const { setting, resolved, setTheme } = useTheme();

  return (
    <button
      type="button"
      className="zw-chip"
      style={{ flexShrink: 0, width: 26, padding: 0, display: 'grid', placeItems: 'center' }}
      aria-label={`Theme: ${setting}. Switch to ${resolved === 'dark' ? 'light' : 'dark'}.`}
      onClick={() => setTheme(resolved === 'dark' ? 'light' : 'dark')}
    >
      {resolved === 'dark' ? <IconSun /> : <IconMoon />}
    </button>
  );
}

/* ── Bottom bar ───────────────────────────────────────────────── */

function BottomBar({ pathname }: { pathname: string }) {
  return (
    <nav
      className="zw-bottombar"
      aria-label="Product sections"
      style={{
        display: 'none',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        gridTemplateColumns: `repeat(${NAV.length}, 1fr)`,
        height: 56,
        background: 'var(--bg-0)',
        borderTop: '1px solid var(--border-1)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {NAV.map((item) => {
        const Icon = item.icon;
        const active = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
              color: active ? 'var(--text-1)' : 'var(--text-3)',
            }}
          >
            <Icon />
            <span style={{ fontSize: 10, fontWeight: 600 }}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

/* ── Keyboard ─────────────────────────────────────────────────── */

/**
 * `g` then a letter jumps between surfaces, the way every keyboard-driven
 * tool does it. Inert while a text field has focus, or someone typing
 * "Godrej" into search would be thrown to another page mid-word.
 */
function useGoToShortcut(router: ReturnType<typeof useRouter>) {
  useEffect(() => {
    let armed = false;
    let armedAt = 0;

    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement;
      const typing =
        el instanceof HTMLInputElement ||
        el instanceof HTMLTextAreaElement ||
        (el instanceof HTMLElement && el.isContentEditable);
      if (typing || e.metaKey || e.ctrlKey || e.altKey) return;

      if (armed && Date.now() - armedAt < 1500) {
        const target = NAV.find((n) => n.key === e.key.toLowerCase());
        if (target) {
          e.preventDefault();
          router.push(target.href);
        }
        armed = false;
        return;
      }

      if (e.key.toLowerCase() === 'g') {
        armed = true;
        armedAt = Date.now();
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [router]);
}

/* ── Icons ────────────────────────────────────────────────────── */
/* Inline so the shell has no icon-library dependency in its bundle. */

const S = { width: 17, height: 17, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true };

function IconGrid() {
  return <svg {...S}><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>;
}
function IconList() {
  return <svg {...S}><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>;
}
function IconCompass() {
  return <svg {...S}><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2 5-5 2 2-5z" /></svg>;
}
function IconPie() {
  return <svg {...S}><path d="M21 15.5A9 9 0 1 1 8.5 3" /><path d="M21 12A9 9 0 0 0 12 3v9z" /></svg>;
}
function IconTicket() {
  return <svg {...S}><path d="M3 9V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 6v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-6z" /></svg>;
}
function IconSearch() {
  return <svg {...S} width={13} height={13}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>;
}
function IconSun() {
  return <svg {...S} width={14} height={14}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>;
}
function IconMoon() {
  return <svg {...S} width={14} height={14}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>;
}
