'use client';

import { useEffect, useRef, useState } from 'react';
import { pollInterval, sessionLabel, isMarketOpen } from '@/lib/market/hours';

/**
 * One polling clock for the whole app.
 *
 * A market page runs a ticker, a mosaic, a breadth bar and a flows panel.
 * If each owned its own interval that is four timers drifting against
 * each other — four times the requests, and an update that visibly
 * staggers across the screen instead of landing at once.
 *
 * Instead a single clock ticks and every subscriber refetches together.
 *
 * The clock pauses while the tab is hidden. A backgrounded tab polling
 * every 30 seconds for an hour is pure backend load for nobody.
 */

type Subscriber = () => void;

const subscribers = new Set<Subscriber>();
let timer: ReturnType<typeof setTimeout> | null = null;
let visibilityBound = false;

function tick() {
  if (typeof document !== 'undefined' && document.hidden) {
    schedule();
    return;
  }
  for (const fn of subscribers) {
    try {
      fn();
    } catch {
      // One bad subscriber must not stop the clock for the rest.
    }
  }
  schedule();
}

function schedule() {
  if (timer) clearTimeout(timer);
  // Re-read the cadence each tick, so crossing 15:30 IST backs the clock
  // off without anyone restarting it.
  timer = setTimeout(tick, pollInterval());
}

function start() {
  if (timer) return;
  schedule();

  if (!visibilityBound && typeof document !== 'undefined') {
    visibilityBound = true;
    document.addEventListener('visibilitychange', () => {
      // Coming back to a stale tab should feel immediate, not like a
      // wait for the next scheduled tick.
      if (!document.hidden && subscribers.size > 0) tick();
    });
  }
}

function stop() {
  if (timer) clearTimeout(timer);
  timer = null;
}

/** Run `fn` on every market tick. */
export function useMarketTick(fn: () => void, enabled = true) {
  const ref = useRef(fn);

  // Kept in an effect, not assigned during render: mutating a ref while
  // rendering is unsafe under concurrent React. The tick is always
  // asynchronous, so by the time it fires the ref is current.
  useEffect(() => {
    ref.current = fn;
  });

  useEffect(() => {
    if (!enabled) return;
    const sub = () => ref.current();
    subscribers.add(sub);
    start();
    return () => {
      subscribers.delete(sub);
      if (subscribers.size === 0) stop();
    };
  }, [enabled]);
}

/** Session label and open state, kept current without its own timer. */
export function useSessionState() {
  const [state, setState] = useState(() => ({
    label: sessionLabel(),
    open: isMarketOpen(),
  }));

  useMarketTick(() => {
    const next = { label: sessionLabel(), open: isMarketOpen() };
    // Only re-render when the session actually changes — this fires on
    // every tick, and the state is identical almost every time.
    setState((prev) =>
      prev.label === next.label && prev.open === next.open ? prev : next,
    );
  });

  return state;
}
