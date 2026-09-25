import { apiGet, apiPost, apiDelete, apiPatch, unwrapKey, unwrapBody } from './client';

/** Price alerts. Mirrors `src/routes/priceAlerts.ts`. */

export type AlertCondition = 'above' | 'below' | 'equals';

export interface PriceAlert {
  id: string;
  symbol: string;
  target_price: number;
  condition: AlertCondition;
  note?: string | null;
  is_repeating?: boolean;
  is_active?: boolean;
  triggered_at?: string | null;
  created_at?: string;
}

export async function getAlerts(userId: string, signal?: AbortSignal) {
  return unwrapKey<PriceAlert[]>(
    await apiGet<Record<string, unknown>>(`/alerts?user_id=${encodeURIComponent(userId)}`, { signal }),
    'alerts',
    [],
  );
}

export async function createAlert(input: {
  userId: string;
  symbol: string;
  targetPrice: number;
  condition: AlertCondition;
  note?: string;
  isRepeating?: boolean;
}) {
  return unwrapBody<Record<string, unknown>>(
    await apiPost<Record<string, unknown>>('/alerts', {
      user_id: input.userId,
      symbol: input.symbol,
      target_price: input.targetPrice,
      condition: input.condition,
      note: input.note ?? null,
      is_repeating: input.isRepeating ?? false,
    }),
  );
}

export async function toggleAlert(id: string) {
  return unwrapBody<Record<string, unknown>>(
    await apiPatch<Record<string, unknown>>(`/alerts/${encodeURIComponent(id)}/toggle`),
  );
}

export async function deleteAlert(id: string) {
  return unwrapBody<Record<string, unknown>>(
    await apiDelete<Record<string, unknown>>(`/alerts/${encodeURIComponent(id)}`),
  );
}
