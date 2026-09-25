import { apiGet, apiPost, unwrapKey, unwrapBody } from './client';

/**
 * Portfolio. Mirrors `src/routes/portfolio.ts`.
 *
 * These routes identify the user with a `user_id` query/body parameter
 * rather than the bearer token the watchlist routes use. See the
 * security note in the Linear issue — the id is taken from the signed-in
 * session here and never from anything a visitor controls.
 */

export interface Holding {
  id: string;
  symbol: string;
  name?: string;
  asset_type?: string;
  quantity: number;
  avg_price: number;
  sector?: string;
  current_price?: number;
  invested_amount?: number;
  current_value?: number;
  returns_percent?: number;
  scheme_code?: string | number;
}

type Ctx = { userId: string; signal?: AbortSignal };

export async function getHoldings({ userId, signal }: Ctx) {
  return unwrapKey<Holding[]>(
    await apiGet<Record<string, unknown>>(
      `/portfolio/holdings?user_id=${encodeURIComponent(userId)}`,
      { signal },
    ),
    'holdings',
    [],
  );
}

export async function addHolding(
  userId: string,
  holding: { symbol: string; name?: string; asset_type?: string; quantity: number; avg_price: number; sector?: string },
) {
  return unwrapKey<unknown>(
    await apiPost<Record<string, unknown>>('/portfolio/holdings', { user_id: userId, ...holding }),
    'holding',
    null,
  );
}

export async function deleteHolding(userId: string, id: string) {
  return unwrapKey<unknown>(
    await apiPost<Record<string, unknown>>(`/portfolio/holdings/${encodeURIComponent(id)}/delete`, { user_id: userId }),
    'success',
    true,
  );
}

/* ── Analysis ─────────────────────────────────────────────────── */

export interface StockRisk {
  symbol: string;
  beta: number;
  volatility: number;
  maxDrawdown: number;
}

export interface PortfolioRisk {
  portfolioBeta: number;
  portfolioVolatility: number;
  sharpeRatio: number;
  stressTest?: { niftyDrop10Pct?: number; niftyDrop20Pct?: number };
  stockRisk: StockRisk[];
}

export interface PortfolioCorrelation {
  matrix: number[][];
  symbols: string[];
  insights?: string[];
}

export interface NavCurve {
  timestamps: number[];
  portfolioNav: number[];
  benchmarkNav: number[];
  investedLine: number[];
}

/** These three spread their payload at the top level, not under `data`. */
export async function getRisk(symbols: string[], holdings: unknown[], signal?: AbortSignal) {
  return unwrapBody<PortfolioRisk>(
    await apiPost<Record<string, unknown>>('/portfolio/risk', { symbols, holdings }, { signal, timeout: 30_000 }),
  );
}

export async function getCorrelation(symbols: string[], period = '1Y', signal?: AbortSignal) {
  return unwrapBody<PortfolioCorrelation>(
    await apiPost<Record<string, unknown>>('/portfolio/correlation', { symbols, period }, { signal, timeout: 40_000 }),
  );
}

export async function getNavCurve(holdings: unknown[], period = '1Y', signal?: AbortSignal) {
  return unwrapBody<NavCurve>(
    await apiPost<Record<string, unknown>>('/portfolio/nav-curve', { holdings, period }, { signal, timeout: 40_000 }),
  );
}
