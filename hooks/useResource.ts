'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ApiResult, ApiError } from '@/lib/api/client';
import { useMarketTick } from './useMarketClock';

export interface Resource<T> {
  data: T | null;
  error: ApiError | null;
  /** True only on the first load. A refresh keeps the old data on screen. */
  loading: boolean;
  /** True while a background refresh is in flight. */
  refreshing: boolean;
  /** When the data on screen was last successfully fetched. */
  updatedAt: number | null;
  refetch: () => void;
}

/**
 * Fetch, refresh on the market clock, abort on unmount.
 *
 * Refreshing deliberately keeps the previous data visible. Blanking a
 * table back to a skeleton every 30 seconds would make the page unusable
 * — the user is mid-scan when the tick lands.
 */
export function useResource<T>(
  fetcher: (signal: AbortSignal) => Promise<ApiResult<T>>,
  { live = true, deps = [] as unknown[] } = {},
): Resource<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<number | null>(null);

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const controllerRef = useRef<AbortController | null>(null);
  const failuresRef = useRef(0);
  const mountedRef = useRef(true);

  const run = useCallback(async (isRefresh: boolean) => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    if (isRefresh) setRefreshing(true);

    const result = await fetcherRef.current(controller.signal);

    if (!mountedRef.current || controller.signal.aborted) return;

    if (result.ok) {
      failuresRef.current = 0;
      setData(result.data);
      setError(null);
      setUpdatedAt(Date.now());
    } else if (result.error.message !== 'Cancelled.') {
      failuresRef.current += 1;
      // A failed refresh keeps the last good data and stays quiet. Only
      // surface the error when there is nothing to show instead.
      if (!isRefresh) setError(result.error);
    }

    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    setLoading(true);
    run(false);
    return () => {
      mountedRef.current = false;
      controllerRef.current?.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  // Back off after repeated failures rather than hammering a service
  // that is already struggling: skip 1 tick after 3 failures, 3 after 6.
  useMarketTick(() => {
    const f = failuresRef.current;
    if (f >= 6 && Date.now() % 4 !== 0) return;
    if (f >= 3 && Date.now() % 2 !== 0) return;
    run(true);
  }, live);

  const refetch = useCallback(() => {
    failuresRef.current = 0;
    run(true);
  }, [run]);

  return { data, error, loading, refreshing, updatedAt, refetch };
}
