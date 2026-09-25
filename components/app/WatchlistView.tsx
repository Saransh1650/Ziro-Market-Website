'use client';

import Link from 'next/link';
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
import SignedOut from './SignedOut';
import DataTable, { type Column } from './DataTable';
import { Delta } from './Delta';
import { StockCell } from './StockCell';
import { num } from '@/lib/format/number';
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

  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState('');
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const onCreate = async () => {
    const name = draft.trim();
    if (!name || !token) return;
    setBusy(true);
    await createWatchlist(name, { token });
    setDraft('');
    setCreating(false);
    loadLists();
    setBusy(false);
  };

  const onDelete = async (list: WatchlistSummary) => {
    if (!token) return;
    setBusy(true);
    await deleteWatchlist(list.id, { token });
    setConfirmId(null);
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
      <SignedOut title="Sign in to use watchlists" detail="Your lists are the same here as in the app." next="/app/watchlist" />
    );
  }

  const columns: Column<WatchlistRow>[] = [
    {
      key: 'symbol', header: 'Stock', sortable: true,
      render: (r) => <StockCell symbol={r.symbol} name={r.name} />,
    },
    { key: 'price', header: 'Price', numeric: true, sortable: true, render: (r) => num(r.price, 2) },
    { key: 'return1d', header: '1D', numeric: true, sortable: true, emphasis: true, render: (r) => <Delta value={r.return1d} /> },
    { key: 'return1w', header: '1W', numeric: true, sortable: true, render: (r) => <Delta value={r.return1w} /> },
    { key: 'return1m', header: '1M', numeric: true, sortable: true, render: (r) => <Delta value={r.return1m} /> },
    { key: 'return3m', header: '3M', numeric: true, sortable: true, render: (r) => <Delta value={r.return3m} /> },
    { key: 'rs', header: 'RS', numeric: true, sortable: true, render: (r) => (r.rs != null ? num(r.rs, 0) : '—') },
    {
      key: 'remove', header: '', render: (r) => (
        <button
          type="button"
          className="zw-chip zw-chip-quiet"
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
    <div className="zw-page zw-wl">
      <aside className="zw-panel zw-wl-lists">
        <div className="zw-panel-head">
          <h1 className="zw-section">Watchlists</h1>
          <button type="button" className="zw-chip" onClick={() => setCreating((c) => !c)} disabled={busy}>
            {creating ? 'Cancel' : '+ New'}
          </button>
        </div>

        {creating && (
          <form
            className="zw-wl-new"
            onSubmit={(e) => { e.preventDefault(); void onCreate(); }}
          >
            <input
              className="zw-field"
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="List name"
              aria-label="Watchlist name"
              maxLength={40}
            />
            <button type="submit" className="zw-btn zw-btn-sm" disabled={busy || !draft.trim()}>Create</button>
          </form>
        )}

        {listsResource.loading ? (
          <div aria-hidden="true">
            {[0, 1, 2].map((i) => <div key={i} className="zw-skelrow"><span className="zw-skel" style={{ maxWidth: '60%' }} /></div>)}
          </div>
        ) : !lists?.length ? (
          <p className="zw-sub zw-panel-body">No lists yet. Create your first one.</p>
        ) : (
          <ul className="zw-wl-items">
            {lists!.map((l) => (
              <li key={l.id} data-active={l.id === activeId || undefined}>
                <button
                  type="button"
                  className="pick"
                  onClick={() => setActiveId(l.id)}
                  aria-current={l.id === activeId ? 'true' : undefined}
                >
                  <span className="nm">{l.name}</span>
                  {l.symbolCount != null && <span className="ct">{l.symbolCount}</span>}
                </button>
                {confirmId === l.id ? (
                  <button type="button" className="zw-chip zw-chip-danger" onClick={() => onDelete(l)} disabled={busy}>
                    Delete?
                  </button>
                ) : (
                  <button
                    type="button"
                    className="del"
                    onClick={() => setConfirmId(l.id)}
                    onBlur={() => setConfirmId((c) => (c === l.id ? null : c))}
                    aria-label={`Delete ${l.name}`}
                  >
                    ×
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </aside>

      <section className="zw-panel" style={{ minWidth: 0 }}>
        <header className="zw-panel-head">
          <h2 className="zw-section">{active?.name ?? 'Watchlist'}</h2>
          <p className="zw-meta">Press ⌘K to find a stock to add</p>
          <Link href="/app/watchlist/compare" className="zw-viewall">Compare</Link>
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
          empty={<p className="zw-sub">This list is empty. Find a stock with ⌘K and add it.</p>}
        />
      </section>
    </div>
  );
}
