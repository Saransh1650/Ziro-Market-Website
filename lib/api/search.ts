import { apiGet } from './client';

/**
 * Global search. Mirrors `src/routes/search.ts`.
 *
 * Note this route does **not** use the `{ success, data }` envelope every
 * other route uses — it returns `{ results: [...] }` directly.
 */

export interface SearchHit {
  id: string;
  symbol: string;
  name: string;
  type: 'stock' | 'etf' | 'mutual_fund' | 'index' | 'commodity' | string;
  subLabel?: string;
}

export async function search(query: string, opts?: { signal?: AbortSignal }) {
  const result = await apiGet<{ results?: SearchHit[] }>(
    `/search?q=${encodeURIComponent(query)}`,
    opts,
  );
  if (!result.ok) return result;
  return { ok: true as const, data: result.data?.results ?? [] };
}
