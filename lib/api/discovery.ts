/**
 * Discover surfaces. Mirrors `src/routes/discovery.ts`, `etfs.ts` and
 * `mutualFunds.ts`.
 */

import { apiGet, unwrapEnvelope as unwrap } from './client';
import type { Envelope, Discovery, Etf, MutualFund } from './types';

type Opts = { signal?: AbortSignal; revalidate?: number };

export async function getDiscovery(opts?: Opts) {
  return unwrap(await apiGet<Envelope<Discovery>>('/discovery', opts));
}

export async function getEtfs(opts?: Opts) {
  return unwrap(await apiGet<Envelope<Etf[]>>('/etfs', opts));
}

export async function getMutualFunds(opts?: Opts) {
  return unwrap(await apiGet<Envelope<MutualFund[]>>('/mutual-funds', opts));
}
