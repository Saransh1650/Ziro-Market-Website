'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import {
  subscribe,
  subscribeStatus,
  setDepthSymbol,
  getStatus,
  isLiveAvailable,
  type DepthPayload,
  type SocketStatus,
} from '@/lib/live/socket';

/** Connection state is external state — the socket owns it, not React. */
const serverStatus = (): SocketStatus => 'idle';

function useSocketStatus(): SocketStatus {
  return useSyncExternalStore(subscribeStatus, getStatus, serverStatus);
}

/**
 * Whether a socket can be opened at all. Constant for the life of the
 * page, but only knowable in the browser, so it is read through a store
 * with an optimistic server snapshot rather than mirrored into state.
 */
const noopSubscribe = () => () => {};
const availableSnapshot = () => isLiveAvailable();
const availableServerSnapshot = () => true;

/**
 * Order-book depth for one symbol.
 *
 * Depth exists only on the live socket — there is no REST endpoint — so
 * this reports connection state alongside the data. A surface that
 * cannot get depth needs to say why rather than sit on a skeleton.
 */
export function useDepth(symbol: string | null): {
  depth: DepthPayload | null;
  status: SocketStatus;
  available: boolean;
} {
  const status = useSocketStatus();
  const available = useSyncExternalStore(noopSubscribe, availableSnapshot, availableServerSnapshot);

  // Tagged with the symbol it arrived for. Carrying the tag means a
  // symbol change invalidates the old payload by comparison at render,
  // instead of needing a reset written into an effect.
  const [entry, setEntry] = useState<{ symbol: string; payload: DepthPayload } | null>(null);

  useEffect(() => {
    if (!symbol || !isLiveAvailable()) return;

    const off = subscribe((msg) => {
      if (msg.type !== 'depth') return;
      const incoming = String(msg.symbol).toUpperCase();
      // The socket is shared, and the server can still be draining the
      // previous subscription when a new one is set.
      if (incoming !== symbol.toUpperCase()) return;
      setEntry({ symbol: incoming, payload: msg.data as DepthPayload });
    });

    setDepthSymbol(symbol);

    return () => {
      setDepthSymbol(null);
      off();
    };
  }, [symbol]);

  const depth =
    entry && symbol && entry.symbol === symbol.toUpperCase() ? entry.payload : null;

  return { depth, status, available };
}
