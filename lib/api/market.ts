/**
 * Market-wide data: indices, sectors, breadth, flows, commodities.
 * Mirrors `src/routes/market.ts` and `src/routes/commodities.ts`.
 */

import { apiGet, unwrapEnvelope as unwrap } from './client';
import type {
  Envelope,
  NiftyIndex,
  SectorPerformance,
  MarketSnapshot,
  FiiDii,
  GlobalMarket,
  CommodityMap,
} from './types';

/**
 * Unwrap the backend's `{ success, data }` envelope.
 *
 * `success: false` arrives with HTTP 200 on some routes, so an envelope
 * check is not optional — without it a failed call renders as empty data
 * rather than as an error.
 */
type Opts = { signal?: AbortSignal; revalidate?: number };

export async function getIndices(opts?: Opts) {
  return unwrap(await apiGet<Envelope<NiftyIndex[]>>('/market/indices', opts));
}

export async function getSectors(opts?: Opts) {
  return unwrap(await apiGet<Envelope<SectorPerformance[]>>('/market/sectors', opts));
}

/** Richer than `/sectors`: carries multi-period changes and RS scores. */
export async function getAllSectors(opts?: Opts) {
  return unwrap(await apiGet<Envelope<SectorPerformance[]>>('/market/sectors/all', opts));
}

export async function getSnapshot(opts?: Opts) {
  return unwrap(await apiGet<Envelope<MarketSnapshot>>('/market/snapshot', opts));
}

export async function getFiiDii(opts?: Opts) {
  return unwrap(await apiGet<Envelope<FiiDii>>('/market/fii-dii', opts));
}

export async function getGlobal(opts?: Opts) {
  return unwrap(await apiGet<Envelope<GlobalMarket>>('/market/global', opts));
}

export async function getCommodities(opts?: Opts) {
  return unwrap(await apiGet<Envelope<CommodityMap>>('/commodities/prices', opts));
}

export async function getIndexConstituents(symbol: string, opts?: Opts) {
  return unwrap(
    await apiGet<Envelope<unknown[]>>(`/market/index/${encodeURIComponent(symbol)}/constituents`, opts),
  );
}
