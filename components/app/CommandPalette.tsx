'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { search, type SearchHit } from '@/lib/api/search';

/**
 * Global search on ⌘K.
 *
 * The mobile app opens a full search screen. On web this is a palette —
 * the control every user of a desktop tool already reaches for.
 *
 * One of the three places in the product allowed a shadow, because it
 * genuinely floats above the page.
 */

const RECENTS_KEY = 'zw-recent-searches';
const GROUP_ORDER = ['stock', 'etf', 'mutual_fund', 'index', 'commodity'] as const;
const GROUP_LABEL: Record<string, string> = {
  stock: 'Stocks',
  etf: 'ETFs',
  mutual_fund: 'Mutual funds',
  index: 'Indices',
  commodity: 'Commodities',
};

function hrefFor(hit: SearchHit): string {
  if (hit.type === 'mutual_fund') return `/app/discover/funds?code=${encodeURIComponent(hit.id)}`;
  if (hit.type === 'commodity') return `/app/commodities/${encodeURIComponent(hit.symbol)}`;
  return `/stocks/${encodeURIComponent(hit.symbol)}`;
}

function readRecents(): SearchHit[] {
  try {
    const raw = localStorage.getItem(RECENTS_KEY);
    return raw ? (JSON.parse(raw) as SearchHit[]).slice(0, 6) : [];
  } catch {
    // Private mode. An empty recents list is a fine default.
    return [];
  }
}

export default function CommandPalette() {
  const router = useRouter();
  const listId = useId();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  // Tagged with the query it answers. Deriving `hits` and `loading` from
  // that tag avoids resetting state from inside an effect, which
  // cascades renders and races the in-flight request.
  const [result, setResult] = useState<{ q: string; hits: SearchHit[] } | null>(null);
  const [recents, setRecents] = useState<SearchHit[]>([]);
  const [active, setActive] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<Element | null>(null);

  /* Open / close ------------------------------------------------ */

  // Opening is always driven by an event, so recents are loaded there
  // rather than mirrored in from an effect.
  const openPalette = useCallback(() => {
    triggerRef.current = document.activeElement;
    setRecents(readRecents());
    setOpen(true);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement;
      const typing =
        el instanceof HTMLInputElement ||
        el instanceof HTMLTextAreaElement ||
        (el instanceof HTMLElement && el.isContentEditable);

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => {
          if (v) return false;
          triggerRef.current = document.activeElement;
          setRecents(readRecents());
          return true;
        });
        return;
      }
      // `/` is a search shortcut only when it would not be a character
      // someone is trying to type.
      if (e.key === '/' && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        openPalette();
      }
    };

    const onOpenRequest = () => openPalette();

    window.addEventListener('keydown', onKey);
    document.addEventListener('zw:open-palette', onOpenRequest);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('zw:open-palette', onOpenRequest);
    };
  }, [openPalette]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    setResult(null);
    setActive(0);
    // Focus goes back where it came from, or the user is stranded.
    if (triggerRef.current instanceof HTMLElement) triggerRef.current.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();

    // Lock body scroll, compensating for the scrollbar so the page
    // behind does not jump sideways as the palette opens.
    const { body, documentElement } = document;
    const gap = window.innerWidth - documentElement.clientWidth;
    const prevOverflow = body.style.overflow;
    const prevPad = body.style.paddingRight;
    body.style.overflow = 'hidden';
    if (gap > 0) body.style.paddingRight = `${gap}px`;

    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPad;
    };
  }, [open]);

  /* Query ------------------------------------------------------- */

  const q = query.trim();
  const ready = q.length >= 2;
  const hits = ready && result?.q === q ? result.hits : [];
  const loading = ready && result?.q !== q;

  useEffect(() => {
    if (!open || q.length < 2) return;

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      const found = await search(q, { signal: controller.signal });
      if (controller.signal.aborted) return;
      setResult({ q, hits: found.ok ? found.data : [] });
      setActive(0);
    }, 150);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [q, open]);

  /* Selection --------------------------------------------------- */

  const shown = ready ? hits : recents;

  const choose = useCallback(
    (hit: SearchHit) => {
      try {
        const next = [hit, ...readRecents().filter((r) => r.id !== hit.id)].slice(0, 6);
        localStorage.setItem(RECENTS_KEY, JSON.stringify(next));
      } catch {
        // Not remembering a search is survivable.
      }
      close();
      router.push(hrefFor(hit));
    },
    [close, router],
  );

  if (!open) return null;

  const grouped = GROUP_ORDER.map((type) => [type, shown.filter((h) => h.type === type)] as const).filter(
    ([, items]) => items.length > 0,
  );
  const other = shown.filter((h) => !GROUP_ORDER.includes(h.type as (typeof GROUP_ORDER)[number]));
  if (other.length) grouped.push(['other' as (typeof GROUP_ORDER)[number], other]);

  const flat = grouped.flatMap(([, items]) => items);

  return (
    <div
      className="zw"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: 'rgba(11,59,46,0.28)',
        display: 'grid',
        placeItems: 'start center',
        paddingTop: '12vh',
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search stocks, ETFs and funds"
        style={{
          width: 'min(560px, calc(100vw - 32px))',
          background: 'var(--bg-0)',
          border: '1px solid var(--border-2)',
          borderRadius: 'var(--r-overlay)',
          boxShadow: '0 20px 60px rgba(11,59,46,0.22)',
          overflow: 'hidden',
        }}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            e.preventDefault();
            close();
          } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActive((i) => Math.min(flat.length - 1, i + 1));
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActive((i) => Math.max(0, i - 1));
          } else if (e.key === 'Enter' && flat[active]) {
            e.preventDefault();
            choose(flat[active]);
          }
        }}
      >
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search a stock, ETF or fund…"
          aria-controls={listId}
          aria-activedescendant={flat[active] ? `${listId}-${flat[active].id}` : undefined}
          aria-expanded="true"
          role="combobox"
          autoComplete="off"
          style={{
            width: '100%',
            padding: 'var(--s-4)',
            border: 0,
            borderBottom: '1px solid var(--border-1)',
            background: 'transparent',
            fontSize: 15,
            outline: 'none',
          }}
        />

        <div id={listId} role="listbox" aria-label="Results" style={{ maxHeight: '52vh', overflowY: 'auto' }}>
          {/* Height is reserved so a slow network does not collapse the
              palette to a sliver and then snap it open again. */}
          {loading && flat.length === 0 && (
            <p className="zw-sub" style={{ padding: 'var(--s-4)', color: 'var(--text-3)', minHeight: 72 }}>Searching…</p>
          )}

          {!loading && ready && flat.length === 0 && (
            <p className="zw-sub" style={{ padding: 'var(--s-4)', color: 'var(--text-3)', minHeight: 72 }}>
              Nothing matches “{q}”.
            </p>
          )}

          {!ready && flat.length === 0 && (
            <p className="zw-sub" style={{ padding: 'var(--s-4)', color: 'var(--text-3)', minHeight: 72 }}>
              Type at least two characters.
            </p>
          )}

          {grouped.map(([type, items]) => (
            <div key={type} role="group" aria-labelledby={`${listId}-${type}`}>
              <p id={`${listId}-${type}`} className="zw-colhead" style={{ padding: 'var(--s-3) var(--s-4) 4px' }}>
                {!ready ? 'Recent' : (GROUP_LABEL[type] ?? 'Other')}
              </p>
              {items.map((hit) => {
                const index = flat.indexOf(hit);
                const selected = index === active;
                return (
                  <div
                    key={hit.id}
                    id={`${listId}-${hit.id}`}
                    role="option"
                    aria-selected={selected}
                    onMouseEnter={() => setActive(index)}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      choose(hit);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: 'var(--s-3)',
                      padding: '9px var(--s-4)',
                      cursor: 'pointer',
                      background: selected ? 'var(--bg-2)' : 'transparent',
                    }}
                  >
                    <span className="zw-sym" style={{ minWidth: 84 }}>{hit.symbol}</span>
                    <span className="zw-sub" style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {hit.name}
                    </span>
                    {hit.subLabel && (
                      <span className="zw-sub" style={{ color: 'var(--text-3)', flexShrink: 0 }}>{hit.subLabel}</span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <footer
          style={{
            display: 'flex',
            gap: 'var(--s-4)',
            padding: '8px var(--s-4)',
            borderTop: '1px solid var(--border-1)',
          }}
        >
          <Hint keys="↑↓" label="Navigate" />
          <Hint keys="↵" label="Open" />
          <Hint keys="Esc" label="Close" />
        </footer>
      </div>
    </div>
  );
}

function Hint({ keys, label }: { keys: string; label: string }) {
  return (
    <span className="zw-sub" style={{ display: 'flex', gap: 5, alignItems: 'center', color: 'var(--text-3)' }}>
      <kbd className="zw-num" style={{ fontSize: 10, border: '1px solid var(--border-1)', borderRadius: 3, padding: '1px 4px' }}>{keys}</kbd>
      {label}
    </span>
  );
}
