'use client';

import { useState } from 'react';

/**
 * Symbol and company name beside a monogram.
 *
 * The identity cell for every stock table. The monogram gives each row a
 * fixed left edge to scan down — the job a logo does in Groww or
 * TradingView — without shipping or licensing several thousand logos. Its
 * hue is derived from the symbol and confined to the blue–violet band, so
 * it can never be mistaken for the red and green reserved for data.
 */
export function StockCell({
  symbol,
  name,
  size = 32,
}: {
  symbol: string;
  name?: string;
  size?: number;
}) {
  const title = name && name !== symbol ? name : undefined;
  return (
    <span className="zw-stockcell">
      <StockLogo symbol={symbol} size={size} />
      <span className="zw-idcell">
        <span className="zw-sym">{symbol}</span>
        {title && <span className="name" title={title}>{title}</span>}
      </span>
    </span>
  );
}

export function Monogram({ symbol = '', size = 32 }: { symbol?: string; size?: number }) {
  let h = 0;
  for (let i = 0; i < symbol.length; i++) h = (h * 31 + symbol.charCodeAt(i)) >>> 0;
  const hue = 200 + (h % 80); // 200–280: blue through violet
  return (
    <span
      className="zw-ava"
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * 0.34),
        ['--ava-h' as string]: hue,
      }}
    >
      {symbol.slice(0, 2)}
    </span>
  );
}

/**
 * The company's logo, from the backend's cached `/logos/:symbol`.
 *
 * The monogram renders underneath from the first paint and the image
 * fades in over it, so a slow first fetch (an uncached logo takes ~2s)
 * never leaves a blank square, and a 404 simply leaves the monogram.
 */
export function StockLogo({ symbol, size = 32 }: { symbol: string; size?: number }) {
  const [state, setState] = useState<'loading' | 'ok' | 'failed'>('loading');

  // A server-rendered image can finish loading before React attaches
  // onLoad, in which case the event never arrives. The ref callback runs
  // at attach time and picks up an image that is already complete.
  const attach = (el: HTMLImageElement | null) => {
    if (el?.complete) setState(el.naturalWidth > 0 ? 'ok' : 'failed');
  };

  return (
    <span className="zw-logo" style={{ width: size, height: size }}>
      {state !== 'ok' && <Monogram symbol={symbol} size={size} />}
      {state !== 'failed' && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={attach}
          src={`/api/backend/logos/${encodeURIComponent(symbol)}`}
          alt=""
          loading="lazy"
          decoding="async"
          onLoad={() => setState('ok')}
          onError={() => setState('failed')}
          style={state === 'ok' ? undefined : { position: 'absolute', opacity: 0 }}
        />
      )}
    </span>
  );
}
