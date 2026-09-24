/**
 * Response shapes from the Express backend.
 *
 * Derived from the handlers in `src/routes/` and the Dart models in the
 * mobile app's `lib/models/`, which are the two existing sources of
 * truth. Optional fields are optional because the backend genuinely omits
 * them — usually when a scheduler snapshot is cold and a live fetch fills
 * in less.
 */

/** Every backend route answers in this envelope. */
export interface Envelope<T> {
  success: boolean;
  data: T;
  source?: 'cache' | 'live';
  error?: string;
}

export interface SectorPerformance {
  name: string;
  changePercent: number;
  trend: string;
  indexValue?: number;
  weight?: number;
  volume?: number;
  marketCap?: number;
  /** Relative strength against peers, 0–100. */
  rs?: number;
  change3d?: number;
  change5d?: number;
  change1m?: number;
  change3m?: number;
  change6m?: number;
  changeYtd?: number;
  tradedValue3d?: number;
  tradedValue5d?: number;
  tradedValue1m?: number;
  tradedValue3m?: number;
  tradedValue6m?: number;
  tradedValueYtd?: number;
}

export interface NiftyIndex {
  symbol: string;
  displayName: string;
  price: number;
  change: number;
  changePercent: number;
  isPositive: boolean;
  logoUrl?: string;
}

export interface FiiDii {
  fiiBuy: number;
  fiiSell: number;
  diiBuy: number;
  diiSell: number;
  date: string;
  fii5dAvg?: number;
  fiiCumNet?: number;
}

export interface GlobalMarket {
  goldPrice: number;
  goldChange: number;
  silverPrice: number;
  silverChange: number;
  crudePrice: number;
  crudeChange: number;
  dxy: number;
  dxyChange: number;
  usBondYield: number;
  usBondYieldChange: number;
  indiavix: number;
  indiavixChange: number;
  lastUpdated: string;
}

export interface MarketBreadth {
  advancers: number;
  decliners: number;
  breadthRatio: number;
}

export interface NewsHeadline {
  title: string;
  link?: string;
  source?: string;
  pubDate?: string;
  summary?: string;
}

export interface MarketSnapshot {
  fiiDii: FiiDii;
  global: GlobalMarket;
  sectors: SectorPerformance[];
  news: NewsHeadline[];
  breadth?: MarketBreadth;
  fetchedAt: string;
}

export interface Commodity {
  symbol: string;
  name: string;
  emoji?: string;
  price: number;
  change: number;
  changePercent: number;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  isLive?: boolean;
  expiry?: string;
}

/** `/api/commodities/prices` returns an object keyed by commodity name. */
export type CommodityMap = Record<string, Commodity>;

export interface SearchResult {
  symbol: string;
  name: string;
  exchange?: string;
  type?: 'stock' | 'etf' | 'mutual_fund' | 'index' | 'commodity';
  price?: number;
  changePercent?: number;
}
