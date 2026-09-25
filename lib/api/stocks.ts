/**
 * Single-instrument data. Mirrors `src/routes/discovery.ts`.
 */

import { apiGet, unwrapEnvelope as unwrap } from './client';
import type { Envelope, StockDetail, OHLCPoint, StockNewsItem, SectorStock } from './types';

export type ChartRange = '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | 'ALL';

type Opts = { signal?: AbortSignal; revalidate?: number };

export async function getStockDetail(symbol: string, range: ChartRange = '1D', opts?: Opts) {
  return unwrap(
    await apiGet<Envelope<StockDetail>>(
      `/discovery/stock/${encodeURIComponent(symbol.toUpperCase())}?range=${range}`,
      opts,
    ),
  );
}

export async function getStockChart(symbol: string, range: ChartRange, opts?: Opts) {
  return unwrap(
    await apiGet<Envelope<{ ohlc: OHLCPoint[]; chartData: { dates: string[]; prices: number[] } }>>(
      `/discovery/stock/${encodeURIComponent(symbol.toUpperCase())}/chart?range=${range}`,
      opts,
    ),
  );
}

export async function getStockNews(symbol: string, limit = 12, opts?: Opts) {
  return unwrap(
    await apiGet<Envelope<StockNewsItem[]>>(
      `/discovery/stock/${encodeURIComponent(symbol.toUpperCase())}/news?limit=${limit}`,
      opts,
    ),
  );
}

/**
 * Peers for the "related stocks" list.
 *
 * The detail response carries no related-stocks field, so peers come from
 * the stock's own sector. This doubles as real internal linking between
 * the programmatic pages.
 */
export async function getSectorStocks(sector: string, opts?: Opts) {
  return unwrap(
    await apiGet<Envelope<SectorStock[]>>(
      `/sectors/${encodeURIComponent(sector)}/stocks`,
      opts,
    ),
  );
}
