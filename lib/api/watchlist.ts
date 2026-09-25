import { apiGet, apiPost, apiDelete, apiPatch, unwrapEnvelope as unwrap } from './client';

/**
 * Watchlists. Mirrors `src/routes/watchlist.ts`.
 *
 * Every route here except `/search` sits behind `requireAuth` on the
 * backend, so each call carries the Supabase access token.
 */

export interface WatchlistSummary {
  id: string;
  name: string;
  symbolCount?: number;
  symbols?: string[];
}

/**
 * One row of `/watchlist/performance`.
 *
 * `/watchlist/symbols` looks like the natural source but returns bare
 * ticker strings, not rows — which is why an earlier build rendered blank
 * symbol cells. Performance carries the price and the return over each
 * horizon, which is what a watchlist table is for.
 */
export interface WatchlistRow {
  symbol: string;
  name?: string;
  price: number;
  return1d: number;
  return3d?: number;
  return1w?: number;
  return1m?: number;
  return3m?: number;
  returnYTD?: number;
  rs?: number;
}

type Auth = { token: string; signal?: AbortSignal };

export async function getWatchlists({ token, signal }: Auth) {
  return unwrap(await apiGet<{ success?: boolean; data?: WatchlistSummary[] }>('/watchlist/list', { token, signal }));
}

export async function getWatchlistOverview({ token, signal }: Auth) {
  return unwrap(await apiGet<{ success?: boolean; data?: unknown }>('/watchlist/overview', { token, signal }));
}

export async function getWatchlistSymbols(id: string, { token, signal }: Auth) {
  const res = unwrap(
    await apiGet<{ success?: boolean; data?: WatchlistRow[] }>(
      `/watchlist/performance?watchlistId=${encodeURIComponent(id)}`,
      { token, signal },
    ),
  );
  // Drop anything without a symbol rather than crash a table on it.
  return res.ok ? { ok: true as const, data: res.data.filter((r) => r?.symbol) } : res;
}

export async function createWatchlist(name: string, { token }: Auth) {
  return unwrap(await apiPost<{ success?: boolean; data?: WatchlistSummary }>('/watchlist/create', { name }, { token }));
}

export async function renameWatchlist(id: string, name: string, { token }: Auth) {
  return unwrap(await apiPatch<{ success?: boolean; data?: unknown }>('/watchlist/rename', { watchlistId: id, name }, { token }));
}

export async function deleteWatchlist(id: string, { token }: Auth) {
  return unwrap(await apiDelete<{ success?: boolean; data?: unknown }>(`/watchlist/delete?watchlistId=${encodeURIComponent(id)}`, { token }));
}

export async function addSymbol(id: string, symbol: string, { token }: Auth) {
  return unwrap(await apiPost<{ success?: boolean; data?: unknown }>('/watchlist/add', { watchlistId: id, symbol }, { token }));
}

export async function removeSymbol(id: string, symbol: string, { token }: Auth) {
  return unwrap(
    await apiDelete<{ success?: boolean; data?: unknown }>(
      `/watchlist/remove?watchlistId=${encodeURIComponent(id)}&symbol=${encodeURIComponent(symbol)}`,
      { token },
    ),
  );
}

export interface WatchlistComparison {
  benchmark: string;
  benchmarkReturn1m: number;
  stocks: WatchlistRow[];
  chartData: {
    timestamps: number[];
    /** Every series is rebased to 100 at the start of the period. */
    series: { name: string; data: number[] }[];
  };
}

export type ComparePeriod = '1W' | '1M' | '1Y';

export async function getWatchlistComparison(
  id: string,
  period: ComparePeriod,
  { token, signal }: Auth,
) {
  return unwrap(
    await apiGet<{ success?: boolean; data?: WatchlistComparison }>(
      `/watchlist/compare?watchlistId=${encodeURIComponent(id)}&period=${period}`,
      { token, signal },
    ),
  );
}
