'use client';

import { useState } from 'react';
import { useAuth } from './AuthProvider';
import { useResource } from '@/hooks/useResource';
import {
  getWatchlists,
  getWatchlistSymbols,
  createWatchlist,
  deleteWatchlist,
  removeSymbol,
  type WatchlistSummary,
  type WatchlistRow,
} from '@/lib/api/watchlist';
import DataTable, { type Column } from './DataTable';
import { Delta } from './Delta';
import { num, compact } from '@/lib/format/number';
import type { ApiError } from '@/lib/api/client';

/**
 * Watchlists.
 *
 * Mobile puts each list behind a tab. On web the lists live in a left
 * sub-rail: switching is one click with no tab row to scan, and the rows
 * get the full width for the extra columns the space allows.
 */
export default function WatchlistView() {
  const { session, loading: authLoading } = useAuth();
  const token = session?.access_token ?? null;

  // Both loads go through useResource, which already owns abort-on-
  // unmount, the shared market tick and the loading/error shape. Hand
  // -rolling the same thing in an effect only re-invents its bugs.
  const listsResource = useResource<WatchlistSummary[]>(
    (signal) =>
      token
        ? getWatchlists({ token, signal })
        : Promise.resolve({ ok: true as const, data: [] as WatchlistSummary[] }),
    { deps: [token], live: false },
  );

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const lists = listsResource.data;
  // Falls back to the first list rather than storing a default, so a
  // freshly created list can be selected without an effect syncing it.
  const activeId = selectedId ?? lists?.[0]?.id ?? null;

  const rowsResource = useResource<WatchlistRow[]>(
    (signal) =>
      token && activeId
        ? getWatchlistSymbols(activeId, { token, signal })
        : Promise.resolve({ ok: true as const, data: [] as WatchlistRow[] }),
    { deps: [token, activeId] },
  );

  const rows = rowsResource.data;
  const error: ApiError | null = listsResource.error ?? rowsResource.error;
  const [busy, setBusy] = useState(false);

  const loadLists = listsResource.refetch;
  const loadRows = rowsResource.refetch;
  const setActiveId = setSelectedId;

  const onCreate = async () => {
    const name = window.prompt('Name this watchlist');
    if (!name?.trim() || !token) return;
    setBusy(true);
    await createWatchlist(name.trim(), { token });
    loadLists();
    setBusy(false);
  };

  const onDelete = async (list: WatchlistSummary) => {
    if (!token) return;
    // Deleting a list is not recoverable, so it asks first.
    if (!window.confirm(`Delete “${list.name}”? This cannot be undone.`)) return;
    setBusy(true);
    await deleteWatchlist(list.id, { token });
    setActiveId(null);
    loadLists();
    setBusy(false);
  };

  const onRemoveSymbol = async (symbol: string) => {
    if (!token || !activeId) return;
    setBusy(true);
    await removeSymbol(activeId, symbol, { token });
    loadRows();
    setBusy(false);
  };

  if (authLoading) return <div style={{ height: 300 }} aria-hidden="true" />;

  if (!session) {
    return (
      <Centered>
        <p className="zw-section">Sign in to use watchlists</p>
        <p className="zw-sub">Your lists are the same here as in the app.</p>
        <a className="zw-chip" href="/app/login?next=/app/watchlist">Sign in</a>
      </Centered>
    );
  }

  const columns: Column<WatchlistRow>[] = [
    {
      key: 'symbol', header: 'Stock', sortable: true,
      render: (r) => (
        <span style={{ display: 'block', minWidth: 0 }}>
          <span className="zw-sym">{r.symbol}</span>
          {(r.name ?? r.companyName) && (
            <span className="zw-sub" style={{ display: 'block', maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {r.name ?? r.companyName}
            </span>
          )}
        </span>
      ),
    },
    {
      key: 'price', header: 'Price', numeric: true, sortable: true,
      sortValue: (r) => r.lastPrice ?? r.price ?? 0,
      render: (r) => num(r.lastPrice ?? r.price, 2),
    },
    {
      key: 'change', header: 'Change', numeric: true, sortable: true,
      sortValue: (r) => r.changePercent ?? r.pChange ?? 0,
      render: (r) => <Delta value={r.changePercent ?? r.pChange} />,
    },
    { key: 'dayLow', header: 'Day low', numeric: true, sortable: true, render: (r) => (r.dayLow ? num(r.dayLow, 2) : '—') },
    { key: 'dayHigh', header: 'Day high', numeric: true, sortable: true, render: (r) => (r.dayHigh ? num(r.dayHigh, 2) : '—') },
    { key: 'volume', header: 'Volume', numeric: true, sortable: true, render: (r) => (r.volume ? compact(r.volume, false) : '—') },
    { key: 'marketCap', header: 'Market cap', numeric: true, sortable: true, render: (r) => (r.marketCap ? compact(r.marketCap) : '—') },
    {
      key: 'remove', header: '', render: (r) => (
        <button
          type="button"
          className="zw-chip"
          aria-label={`Remove ${r.symbol} from this watchlist`}
          onClick={(e) => { e.stopPropagation(); void onRemoveSymbol(r.symbol); }}
        >
          Remove
        </button>
      ),
    },
  ];

  const active = lists?.find((l) => l.id === activeId);

  return (
    <div className="zw-wl" style={{ maxWidth: 'var(--max-w)', padding: 'var(--s-4) var(--s-3) var(--s-7)' }}>
      <aside style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', paddingBottom: 'var(--s-2)' }}>
          <h1 className="zw-section">Lists</h1>
          <button type="button" className="zw-chip" onClick={onCreate} disabled={busy}>New</button>
        </div>

        {listsResource.loading ? (
          <div aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ height: 34, borderBottom: '1px solid var(--border-1)', display: 'flex', alignItems: 'center' }}>
                <span style={{ width: '60%', height: 9, background: 'var(--bg-2)', borderRadius: 2 }} />
              </div>
            ))}
          </div>
        ) : !lists?.length ? (
          <p className="zw-sub" style={{ color: 'var(--text-3)' }}>No lists yet. Create your first one.</p>
        ) : (
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {lists!.map((l) => (
              <li key={l.id} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <button
                  type="button"
                  onClick={() => setActiveId(l.id)}
                  aria-current={l.id === activeId ? 'true' : undefined}
                  style={{
                    flex: 1, textAlign: 'left', background: l.id === activeId ? 'var(--bg-2)' : 'none',
                    border: 0, padding: '8px', cursor: 'pointer', fontSize: 12,
                    fontWeight: l.id === activeId ? 600 : 400, color: 'var(--text-1)',
                    borderRadius: 'var(--r-ctl)',
                  }}
                >
                  {l.name}
                  {l.symbolCount != null && <span className="zw-sub" style={{ marginLeft: 6 }}>{l.symbolCount}</span>}
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(l)}
                  aria-label={`Delete ${l.name}`}
                  className="zw-chip"
                  style={{ width: 26, padding: 0 }}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </aside>

      <section style={{ minWidth: 0 }}>
        <header style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--s-3)', paddingBottom: 'var(--s-2)' }}>
          <h2 className="zw-title">{active?.name ?? 'Watchlist'}</h2>
          <p className="zw-sub" style={{ color: 'var(--text-3)' }}>Press ⌘K to find a stock to add</p>
        </header>

        <DataTable
          rows={rows ?? []}
          columns={columns}
          rowKey={(r) => r.symbol}
          href={(r) => `/stocks/${encodeURIComponent(r.symbol)}`}
          caption={active?.name ?? 'Watchlist'}
          loading={rowsResource.loading}
          error={error?.message ?? null}
          onRetry={loadRows}
          empty={<p className="zw-sub" style={{ color: 'var(--text-3)' }}>This list is empty. Find a stock with ⌘K and add it.</p>}
        />
      </section>

      <style>{`
        .zw-wl { display: grid; grid-template-columns: 220px minmax(0, 1fr); gap: var(--s-6); align-items: start; }
        @media (max-width: 899px) {
          .zw-wl { grid-template-columns: 1fr; gap: var(--s-4); }
        }
      `}</style>
    </div>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', placeContent: 'center', justifyItems: 'center', gap: 'var(--s-3)', minHeight: '60dvh', textAlign: 'center' }}>
      {children}
    </div>
  );
}
