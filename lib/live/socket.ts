/**
 * Live market socket — one connection per tab.
 *
 * The backend pushes ticks, sector and index updates, commodities and
 * order-book depth over a single `/live` WebSocket. Depth is only
 * available here; there is no REST equivalent.
 *
 * Every surface shares one socket. A page with a watchlist, a ticker and
 * a depth ladder opening three connections would triple the server's
 * subscriber bookkeeping for no gain.
 */

export type LiveMessage =
  | { type: 'connected' }
  | { type: 'ping' }
  | { type: 'stocks'; data: unknown }
  | { type: 'indices'; data: unknown }
  | { type: 'sectors'; data: unknown }
  | { type: 'commodities'; data: unknown }
  | { type: 'depth'; symbol: string; data: DepthPayload; marketOpen?: boolean }
  | { type: string; [k: string]: unknown };

export interface DepthLevel {
  price: number;
  quantity: number;
}

export interface DepthPayload {
  buy: DepthLevel[];
  sell: DepthLevel[];
  totalBuyQty: number;
  totalSellQty: number;
  ltp: number;
}

export type SocketStatus = 'idle' | 'connecting' | 'open' | 'reconnecting' | 'unavailable';

type Listener = (msg: LiveMessage) => void;

const listeners = new Set<Listener>();
const statusListeners = new Set<(s: SocketStatus) => void>();

let socket: WebSocket | null = null;
let status: SocketStatus = 'idle';
let attempts = 0;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
let keepAlive: ReturnType<typeof setInterval> | null = null;

/** Subscriptions are replayed on every reconnect. */
const subscribedSymbols = new Set<string>();
let depthSymbol: string | null = null;

/**
 * Whether a socket can be opened from this page at all.
 *
 * A page served over HTTPS may not open a `ws://` connection — the
 * browser blocks it as mixed content, with no way around it from the
 * client. Until the backend has TLS and a hostname, live streaming works
 * in local development and not in production, and surfaces that depend
 * on it have to say so rather than spin forever.
 */
export function socketUrl(): string | null {
  if (typeof window === 'undefined') return null;

  const configured = process.env.NEXT_PUBLIC_WS_URL?.trim();
  const pageIsSecure = window.location.protocol === 'https:';

  if (configured) {
    if (pageIsSecure && configured.startsWith('ws://')) return null;
    return configured;
  }

  // No explicit override: derive from the backend origin, which is plain
  // HTTP. That is only usable from an insecure page.
  if (pageIsSecure) return null;
  return 'ws://52.90.228.120:3000/live';
}

export const isLiveAvailable = (): boolean => socketUrl() !== null;

function setStatus(next: SocketStatus): void {
  if (status === next) return;
  status = next;
  for (const l of statusListeners) l(next);
}

export const getStatus = (): SocketStatus => status;

function send(payload: unknown): void {
  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(payload));
  }
}

function replaySubscriptions(): void {
  if (subscribedSymbols.size > 0) {
    send({ type: 'subscribe_symbols', symbols: [...subscribedSymbols] });
  }
  if (depthSymbol) {
    send({ type: 'subscribe_depth', symbol: depthSymbol });
  }
}

function connect(): void {
  if (socket || typeof window === 'undefined') return;

  const url = socketUrl();
  if (!url) {
    setStatus('unavailable');
    return;
  }

  setStatus(attempts === 0 ? 'connecting' : 'reconnecting');

  try {
    socket = new WebSocket(url);
  } catch {
    socket = null;
    scheduleReconnect();
    return;
  }

  socket.onopen = () => {
    attempts = 0;
    setStatus('open');
    replaySubscriptions();
    // The server sends its own pings; this keeps intermediaries from
    // dropping an idle connection.
    keepAlive = setInterval(() => send({ type: 'ping' }), 25_000);
  };

  socket.onmessage = (event) => {
    let msg: LiveMessage;
    try {
      msg = JSON.parse(event.data as string) as LiveMessage;
    } catch {
      return;
    }
    for (const l of listeners) {
      try {
        l(msg);
      } catch {
        // One bad listener must not kill the stream for the rest.
      }
    }
  };

  socket.onclose = () => {
    teardown();
    // Only chase a reconnect while something is actually listening.
    if (listeners.size > 0) scheduleReconnect();
    else setStatus('idle');
  };

  socket.onerror = () => {
    // `onclose` always follows, which is where reconnection is handled.
  };
}

function teardown(): void {
  if (keepAlive) clearInterval(keepAlive);
  keepAlive = null;
  socket = null;
}

function scheduleReconnect(): void {
  if (reconnectTimer) return;
  attempts += 1;
  // 2s, 4s, 8s … capped at 30s. An unreachable backend should not be
  // hammered once a second for the life of the tab.
  const delay = Math.min(30_000, 2000 * 2 ** (attempts - 1));
  setStatus('reconnecting');
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    connect();
  }, delay);
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  connect();

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      if (reconnectTimer) clearTimeout(reconnectTimer);
      reconnectTimer = null;
      socket?.close();
      teardown();
      setStatus('idle');
    }
  };
}

export function subscribeStatus(listener: (s: SocketStatus) => void): () => void {
  statusListeners.add(listener);
  return () => statusListeners.delete(listener);
}

export function addSymbols(symbols: string[]): void {
  let added = false;
  for (const s of symbols) {
    const up = s.toUpperCase();
    if (!subscribedSymbols.has(up)) {
      subscribedSymbols.add(up);
      added = true;
    }
  }
  if (added) send({ type: 'subscribe_symbols', symbols: [...subscribedSymbols] });
}

/**
 * The server tracks one depth subscription per connection, so this
 * replaces rather than adds.
 */
export function setDepthSymbol(symbol: string | null): void {
  const next = symbol ? symbol.toUpperCase() : null;
  if (next === depthSymbol) return;
  depthSymbol = next;
  if (next) send({ type: 'subscribe_depth', symbol: next });
  else send({ type: 'unsubscribe_depth' });
}
