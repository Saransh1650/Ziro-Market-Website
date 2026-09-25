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

export interface WatchlistRow {
  symbol: string;
  name?: string;
  companyName?: string;
  price?: number;
  lastPrice?: number;
  change?: number;
  changePercent?: number;
  pChange?: number;
  volume?: number;
  marketCap?: number;
  dayHigh?: number;
  dayLow?: number;
}

type Auth = { token: string; signal?: AbortSignal };

export async function getWatchlists({ token, signal }: Auth) {
  return unwrap(await apiGet<{ success?: boolean; data?: WatchlistSummary[] }>('/watchlist/list', { token, signal }));
}

export async function getWatchlistOverview({ token, signal }: Auth) {
  return unwrap(await apiGet<{ success?: boolean; data?: unknown }>('/watchlist/overview', { token, signal }));
}

export async function getWatchlistSymbols(id: string, { token, signal }: Auth) {
  return unwrap(
    await apiGet<{ success?: boolean; data?: WatchlistRow[] }>(
      `/watchlist/symbols?watchlistId=${encodeURIComponent(id)}`,
      { token, signal },
    ),
  );
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
