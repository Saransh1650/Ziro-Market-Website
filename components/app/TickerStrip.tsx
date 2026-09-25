'use client';

import { useEffect, useRef } from 'react';
import { getIndices } from '@/lib/api/market';
import { useResource } from '@/hooks/useResource';
import { useSessionState } from '@/hooks/useMarketClock';
import { num, pct, direction } from '@/lib/format/number';
import type { NiftyIndex } from '@/lib/api/types';

/**
 * Live indices, persistent in the app shell header.
 *
 * Scrolls horizontally, never wraps, and is never a marquee. An
 * auto-scrolling ticker cannot be read at a glance and cannot be clicked
 * — the target moves out from under the cursor.
 */
export default function TickerStrip() {
  const { data, loading, error } = useResource<NiftyIndex[]>(
    (signal) => getIndices({ signal }),
  );
  const session = useSessionState();

  if (loading) return <TickerSkeleton />;

  if (error || !data?.length) {
    return (
      <div
        className="zw-sub"
        style={{ flex: 1, minWidth: 0, color: 'var(--ink-3)' }}
      >
        Index data unavailable
      </div>
    );
  }

  return (
    <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 'var(--s-3)', paddingLeft: 'var(--s-1)' }}>
      <SessionDot open={session.open} label={session.label} />
      <div
        className="zw-scroll-x"
        style={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          alignItems: 'center',
          height: 'var(--ticker-h)',
        }}
        // Not a live region. It would never stop talking.
        aria-live="off"
        /* The strip overflows at narrow widths. A scroll container with
           nothing focusable inside is unreachable by keyboard, so it
           takes focus itself and scrolls with the arrow keys. Index
           links land with the constituents page. */
        tabIndex={0}
        role="group"
        aria-label="Index levels"
      >
        {data.map((idx) => (
          <TickerItem key={idx.symbol} index={idx} />
        ))}
      </div>
    </div>
  );
}

function TickerItem({ index }: { index: NiftyIndex }) {
  const ref = useRef<HTMLDivElement>(null);
  const prev = useRef(index.price);

  // The one piece of ambient motion in the product: a changed value
  // flashes so the eye knows which of seven numbers just moved.
  useEffect(() => {
    const el = ref.current;
    if (!el || prev.current === index.price) return;
    const cls = index.price > prev.current ? 'zw-flash-up' : 'zw-flash-down';
    el.classList.remove('zw-flash-up', 'zw-flash-down');
    void el.offsetWidth; // restart the animation
    el.classList.add(cls);
    prev.current = index.price;
  }, [index.price]);

  const dir = direction(index.changePercent);

  return (
    <div
      ref={ref}
      className="zw-tick"
    >
      <span className="lbl">{index.displayName}</span>
      <span className="zw-num val">
        {num(index.price, 2)}
      </span>
      <span
        className="zw-delta"
        data-dir={dir}
        aria-label={`${index.displayName} ${dir === 'up' ? 'up' : dir === 'down' ? 'down' : 'unchanged'} ${Math.abs(index.changePercent).toFixed(2)} percent`}
      >
        <span className="sign" aria-hidden="true">
          {index.changePercent > 0 ? '+' : index.changePercent < 0 ? '−' : ''}
        </span>
        <span>{pct(index.changePercent).replace(/^[+−]/, '')}</span>
      </span>
    </div>
  );
}

function SessionDot({ open, label }: { open: boolean; label: string }) {
  return (
    <div
      style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}
      title={open ? 'Market open — 09:15 to 15:30 IST' : 'Market closed'}
    >
      <span
        aria-hidden="true"
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: open ? 'var(--up)' : 'var(--ink-3)',
        }}
      />
      <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--ink-3)' }}>{label}</span>
    </div>
  );
}

function TickerSkeleton() {
  return (
    <div
      style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 'var(--s-4)', height: 'var(--ticker-h)' }}
      aria-hidden="true"
    >
      {[110, 96, 104, 88].map((w, i) => (
        <span
          key={i}
          style={{ width: w, height: 10, background: 'var(--surface-hover)', borderRadius: 2, flexShrink: 0 }}
        />
      ))}
    </div>
  );
}
