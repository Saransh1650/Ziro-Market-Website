export interface IndexQuote {
  symbol: string;
  name: string;
  value: number;
  change: number;
  changePct: number;
  asOf: string; // ISO timestamp
}

export interface TickerQuote {
  symbol: string;
  changePct: number;
}

export const STATIC_INDICES: IndexQuote[] = [
  { symbol: 'NIFTY50',  name: 'NIFTY 50',    value: 22847.30, change:  141.20, changePct:  0.62, asOf: '2026-05-20T09:30:00+05:30' },
  { symbol: 'BANKNIFTY',name: 'BANK NIFTY',  value: 48920.15, change:  201.40, changePct:  0.41, asOf: '2026-05-20T09:30:00+05:30' },
  { symbol: 'SENSEX',   name: 'SENSEX',      value: 75103.42, change:  -58.30, changePct: -0.08, asOf: '2026-05-20T09:30:00+05:30' },
  { symbol: 'INDIAVIX', name: 'INDIA VIX',   value:    13.82, change:   -0.24, changePct: -1.71, asOf: '2026-05-20T09:30:00+05:30' },
];

export const STATIC_TICKERS: TickerQuote[] = [
  { symbol: 'RELIANCE', changePct:  2.4 },
  { symbol: 'INFY',     changePct: -0.8 },
  { symbol: 'HDFCBANK', changePct:  1.2 },
  { symbol: 'TCS',      changePct:  3.1 },
  { symbol: 'BAJFINANCE',changePct: 4.7 },
  { symbol: 'ICICIBANK',changePct:  0.6 },
  { symbol: 'SBIN',     changePct:  3.1 },
  { symbol: 'WIPRO',    changePct: -1.1 },
  { symbol: 'ITC',      changePct:  0.5 },
  { symbol: 'ADANIENT', changePct:  1.8 },
  { symbol: 'MARUTI',   changePct: -0.4 },
  { symbol: 'TATAMOTORS',changePct: 2.0 },
  { symbol: 'LT',       changePct:  0.9 },
  { symbol: 'KOTAKBANK',changePct: -0.6 },
  { symbol: 'AXISBANK', changePct:  1.5 },
  { symbol: 'HINDUNILVR',changePct:-0.3 },
];

export function isMarketOpen(now: Date = new Date()): boolean {
  const ist = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  const day = ist.getDay();
  if (day === 0 || day === 6) return false;
  const minutes = ist.getHours() * 60 + ist.getMinutes();
  return minutes >= 9 * 60 + 15 && minutes <= 15 * 60 + 30;
}

export function formatINR(n: number): string {
  return n.toLocaleString('en-IN', { maximumFractionDigits: 2 });
}
