import { apiGet, unwrapEnvelope as unwrap } from './client';
import type { Envelope, SectorDetail } from './types';

/**
 * Constituents of one sector. Mirrors `src/routes/sectors.ts`.
 *
 * The route paginates (10 a page by default) and reports a total, so the
 * page asks for a full screen's worth rather than the default.
 */
export async function getSectorDetail(
  sector: string,
  { limit = 100, page = 1, sort, signal, revalidate }: { limit?: number; page?: number; sort?: 'default' | 'gainers' | 'losers' | 'volume_desc' | 'volume_asc' | 'market_cap'; signal?: AbortSignal; revalidate?: number } = {},
) {
  return unwrap(
    await apiGet<Envelope<SectorDetail>>(
      `/sectors/${encodeURIComponent(sector)}/stocks?limit=${limit}&page=${page}${sort ? `&sort=${sort}` : ''}`,
      { signal, revalidate },
    ),
  );
}
