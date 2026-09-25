import { apiGet, unwrapEnvelope as unwrap } from './client';
import type { Envelope } from './types';

export interface CommodityCandle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface CommodityCandles {
  symbol: string;
  candles: CommodityCandle[];
}

export interface CommodityContract {
  commodity: string;
  displayName: string;
  tradingSymbol: string;
  expiry: string;
  unit: string;
  price: number;
  changePercent: number;
}

type Opts = { signal?: AbortSignal };

/** `key` is the commodity key from `/commodities/prices` (`gold`), not the contract symbol. */
export async function getCommodityCandles(key: string, days: number, { signal }: Opts = {}) {
  const res = unwrap(
    await apiGet<Envelope<CommodityCandles>>(`/commodities/${encodeURIComponent(key)}/candles?days=${days}`, { signal }),
  );
  if (!res.ok) return res;
  // The feed is newest-first; charts read left to right.
  return { ok: true as const, data: { ...res.data, candles: [...res.data.candles].sort((a, b) => a.time - b.time) } };
}

export async function getCommodityContracts(key: string, { signal }: Opts = {}) {
  return unwrap(await apiGet<Envelope<CommodityContract[]>>(`/commodities/${encodeURIComponent(key)}/contracts`, { signal }));
}
