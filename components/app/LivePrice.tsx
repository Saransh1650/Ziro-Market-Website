'use client';

import { useEffect, useRef } from 'react';
import { getStockDetail } from '@/lib/api/stocks';
import { useResource } from '@/hooks/useResource';
import { useSessionState } from '@/hooks/useMarketClock';
import { Delta, Money } from './Delta';
import type { StockDetail } from '@/lib/api/types';

/**
 * The live price line.
 *
 * Only this piece hydrates. The name, fundamentals and ranges around it
 * are server-rendered and stay that way — they are what a crawler reads
 * and they do not change minute to minute.
 *
 * The server's figures render until the first client fetch lands, so
 * there is no empty frame and no layout shift.
 */
export default function LivePrice({
  symbol,
  initialPrice,
  initialChange,
  initialPChange,
}: {
  symbol: string;
  initialPrice: number;
  initialChange: number;
  initialPChange: number;
}) {
  const session = useSessionState();

  // Outside market hours the price cannot move, so there is nothing to
  // poll for — the server's closing figures are already correct.
  const { data } = useResource<StockDetail>(
    (signal) => getStockDetail(symbol, '1D', { signal }),
    { deps: [symbol], live: session.open },
  );

  const price = data?.lastPrice ?? initialPrice;
  const change = data?.change ?? initialChange;
  const pChange = data?.pChange ?? initialPChange;

  const ref = useRef<HTMLDivElement>(null);
  const prev = useRef(price);

  useEffect(() => {
    const el = ref.current;
    if (!el || prev.current === price) return;
    const cls = price > prev.current ? 'zw-flash-up' : 'zw-flash-down';
    el.classList.remove('zw-flash-up', 'zw-flash-down');
    void el.offsetWidth; // restart the animation
    el.classList.add(cls);
    prev.current = price;
  }, [price]);

  return (
    <div
      ref={ref}
      style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--s-3)', padding: '0 4px' }}
    >
      <Money value={price} className="zw-num-lg" />
      <span style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--s-2)' }}>
        <Delta value={change} mode="absolute" />
        <Delta value={pChange} />
      </span>
      {!session.open && (
        <span className="zw-sub" style={{ color: 'var(--text-3)' }}>at close</span>
      )}
    </div>
  );
}
