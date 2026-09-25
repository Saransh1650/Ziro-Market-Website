import { apiGet, apiPost, apiDelete, unwrapKey, unwrapBody } from './client';

/** Paper trading. Mirrors `src/routes/paperTrade.ts`. */

export interface PaperAccount {
  balance?: number;
  available_margin?: number;
  invested?: number;
  total_pnl?: number;
  day_pnl?: number;
  [k: string]: unknown;
}

export interface PaperHolding {
  id?: string;
  symbol: string;
  quantity: number;
  avg_price: number;
  current_price?: number;
  pnl?: number;
  pnl_percent?: number;
  product?: string;
}

export interface PaperOrder {
  id: string;
  symbol: string;
  side: 'BUY' | 'SELL' | string;
  quantity: number;
  price?: number;
  order_type?: string;
  status?: string;
  created_at?: string;
  product?: string;
}

type Ctx = { userId: string; signal?: AbortSignal };

export async function getAccount({ userId, signal }: Ctx) {
  return unwrapBody<PaperAccount>(
    await apiGet<Record<string, unknown>>(`/paper-trade/account?user_id=${encodeURIComponent(userId)}`, { signal }),
  );
}

export async function getPaperHoldings({ userId, signal }: Ctx) {
  return unwrapKey<PaperHolding[]>(
    await apiGet<Record<string, unknown>>(`/paper-trade/holdings?user_id=${encodeURIComponent(userId)}`, { signal }),
    'holdings',
    [],
  );
}

export async function getOrders({ userId, signal }: Ctx) {
  return unwrapKey<PaperOrder[]>(
    await apiGet<Record<string, unknown>>(`/paper-trade/orders?user_id=${encodeURIComponent(userId)}`, { signal }),
    'orders',
    [],
  );
}

export async function placeOrder(
  userId: string,
  order: { symbol: string; quantity: number; price?: number; product?: string; order_type?: string },
  side: 'buy' | 'sell',
) {
  return unwrapBody<Record<string, unknown>>(
    await apiPost<Record<string, unknown>>(`/paper-trade/${side}`, { user_id: userId, ...order }),
  );
}

export async function cancelOrder(userId: string, id: string) {
  return unwrapBody<Record<string, unknown>>(
    await apiDelete<Record<string, unknown>>(`/paper-trade/orders/${encodeURIComponent(id)}?user_id=${encodeURIComponent(userId)}`),
  );
}
