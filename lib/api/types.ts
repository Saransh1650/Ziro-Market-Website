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
  /**
   * False until NSE publishes the session's figures, which happens after
   * the close. Every number above is 0 while this is false — rendering
   * them would state a flat day that did not happen.
   */
  isAvailable?: boolean;
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

/* ── Stock detail ─────────────────────────────────────────────── */

export interface OHLCPoint {
  time: string | number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface StockFundamentals {
  pe: number;
  pb: number;
  divYield: number;
  eps: number;
  faceValue: number;
  roe: number;
  bookValue: number;
  debtToEquity: number;
  industryPe: number;
  /** Absolute rupees. Prefer this over the top-level `marketCap` string. */
  marketCap?: number;
}

export interface StockDetail {
  symbol: string;
  companyName: string;
  lastPrice: number;
  change: number;
  pChange: number;
  open: number;
  previousClose: number;
  dayHigh: number;
  dayLow: number;
  yearHigh: number;
  yearLow: number;
  volume: number;
  /**
   * Pre-formatted by the backend as `T` / `B` / `Cr` / `L`, i.e. partly in
   * trillions and billions. Don't render it — read
   * `fundamentals.marketCap` (absolute rupees) and format with
   * `compact()`, which is crore-scaled.
   */
  marketCap?: string;
  pd: string;
  sector: string;
  industry: string;
  fundamentals: StockFundamentals;
  chartData: { dates: string[]; prices: number[] };
  ohlc: OHLCPoint[];
  currency: string;
  insight?: string;
  optionChain?: { expiryDates?: string[]; strikes?: unknown[]; underlyingValue?: number };
  announcements?: unknown[];
}

export interface StockNewsItem {
  title: string;
  link?: string;
  url?: string;
  source?: string;
  publishedAt?: string;
  pubDate?: string;
  summary?: string;
}

export interface SectorStock {
  symbol: string;
  name?: string;
  companyName?: string;
  lastPrice?: number;
  price?: number;
  pChange?: number;
  changePercent?: number;
  volume?: number;
  marketCap?: number;
}

/* ── Discovery ────────────────────────────────────────────────── */

export interface MoverStock {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
  volume?: number;
  value?: number;
  indexGroup?: string;
}

export interface VolumeSurgeStock extends MoverStock {
  avgVolume?: number;
  /** Today's volume as a multiple of the 20-day average. */
  volumeRatio?: number;
  currentVolume?: number;
}

export interface NewsStock {
  symbol: string;
  name: string;
  headline: string;
  link?: string;
  url?: string;
  price?: number;
  changePercent?: number;
  publishedAt?: string;
}

export interface WeekExtremeStock extends MoverStock {
  weekHigh52?: number;
  weekLow52?: number;
}

export interface LargeDeal {
  symbol: string;
  name: string;
  clientName: string;
  tradeType: string;
  quantity: number;
  price?: number;
  date?: string;
}

export type CapTier = 'largeCap' | 'midCap' | 'smallCap';

export interface Discovery {
  topMovers: Record<CapTier, { gainers: MoverStock[]; losers: MoverStock[] }>;
  mostActive: {
    mainBoard: MoverStock[];
    sme: MoverStock[];
    etf: MoverStock[];
    priceSpurts: MoverStock[];
    volumeSpurts: MoverStock[];
  };
  volumeSurge: VolumeSurgeStock[];
  stocksInNews: NewsStock[];
  fiftyTwoWeekHighs: WeekExtremeStock[];
  fiftyTwoWeekLows: WeekExtremeStock[];
  largeDeals: LargeDeal[];
  fetchedAt: string;
}

/** The ETF and fund tables come back in snake_case, unlike the rest. */
export interface Etf {
  symbol: string;
  name: string;
  exchange?: string;
  category?: string;
  underlying?: string | null;
  price?: number;
  nav?: number;
  expense_ratio?: number | null;
  avg_volume_10d?: number | null;
  last_updated?: string;
}

export interface MutualFund {
  scheme_code: number | string;
  scheme_name: string;
  fund_house?: string;
  scheme_type?: string;
  scheme_category?: string;
  nav?: number;
  nav_date?: string;
  return_1y?: number | null;
  return_3y?: number | null;
  return_5y?: number | null;
  expense_ratio?: number | null;
}

/* ── Sector detail ────────────────────────────────────────────── */

export interface SectorStockRow {
  symbol: string;
  name: string;
  price: number;
  change?: number;
  changePercent: number;
  volume?: number;
  tradedValue?: number;
  marketCap?: number;
  subSector?: string;
  pe?: number;
  pb?: number;
  divYield?: number;
  roe?: number;
}

export interface SectorDetail {
  sectorName: string;
  subSectors: string[];
  stocks: SectorStockRow[];
  topGainers?: SectorStockRow[];
  topLosers?: SectorStockRow[];
  lastUpdated?: string;
  pagination?: { total: number; page: number; limit: number; hasMore: boolean };
}
