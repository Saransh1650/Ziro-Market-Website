'use client';
import { useEffect, useState } from 'react';
import type { IndexQuote } from '@/lib/marketData';

export interface LiveIndicesState {
  data: IndexQuote[];
  stale: boolean;
  lastFetchedAt: number | null;
}

export function useLiveIndices(initial: IndexQuote[], intervalMs = 15_000): LiveIndicesState {
  const [data, setData] = useState<IndexQuote[]>(initial);
  const [lastFetchedAt, setLastFetchedAt] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function tick() {
      try {
        const res = await fetch('/api/indices');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as IndexQuote[];
        if (!cancelled && Array.isArray(json) && json.length > 0) {
          setData(json);
          setLastFetchedAt(Date.now());
        }
      } catch {
        /* keep last good snapshot */
      }
    }
    tick();
    const id = setInterval(tick, intervalMs);
    return () => { cancelled = true; clearInterval(id); };
  }, [intervalMs]);

  const stale = lastFetchedAt !== null && Date.now() - lastFetchedAt > 60_000;
  return { data, stale, lastFetchedAt };
}
