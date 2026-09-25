'use client';

import { useDepth } from '@/hooks/useDepth';
import { num, qty } from '@/lib/format/number';

/**
 * The five best bids and asks.
 *
 * Each row carries a proportional bar sized to its quantity, because the
 * *shape* of the book is the information — where the size is sitting is
 * what a trader reads, and a plain table of numbers hides it.
 */
export default function DepthLadder({ symbol }: { symbol: string }) {
  const { depth, status, available } = useDepth(symbol);

  if (!available) {
    return (
      <p className="zw-sub" style={{ padding: 'var(--s-4) 0', color: 'var(--ink-3)', maxWidth: '68ch' }}>
        Live depth needs a secure connection to the market feed, which this
        site cannot open yet. It works in local development and will work
        here once the data service is served over TLS.
      </p>
    );
  }

  if (!depth) {
    return (
      <p className="zw-sub" style={{ padding: 'var(--s-4) 0', color: 'var(--ink-3)' }}>
        {status === 'reconnecting'
          ? 'Reconnecting to the market feed…'
          : `Waiting for ${symbol} order book…`}
      </p>
    );
  }

  const buy = depth.buy ?? [];
  const sell = depth.sell ?? [];

  // Both sides scale against one maximum, so a 10,000-lot bid and a
  // 10,000-lot ask draw the same width. Scaling each side to its own max
  // would make a thin side look as deep as a heavy one.
  const peak = Math.max(1, ...buy.map((l) => l.quantity), ...sell.map((l) => l.quantity));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-3)' }}>
      <div className="zw-depth">
        <Side title="Bids" levels={buy} peak={peak} side="buy" />
        <Side title="Asks" levels={sell} peak={peak} side="sell" />
      </div>

      <dl
        style={{
          display: 'flex',
          gap: 'var(--s-5)',
          borderTop: '1px solid var(--line)',
          paddingTop: 'var(--s-2)',
          margin: 0,
        }}
      >
        <Total label="Total bid qty" value={depth.totalBuyQty} tone="var(--up)" />
        <Total label="Total ask qty" value={depth.totalSellQty} tone="var(--down)" />
      </dl>

      <style>{`
        .zw-depth { display: grid; grid-template-columns: 1fr 1fr; gap: var(--s-5); }
        @media (max-width: 639px) {
          .zw-depth { grid-template-columns: 1fr; gap: var(--s-4); }
        }
      `}</style>
    </div>
  );
}

function Side({
  title,
  levels,
  peak,
  side,
}: {
  title: string;
  levels: { price: number; quantity: number }[];
  peak: number;
  side: 'buy' | 'sell';
}) {
  const colour = side === 'buy' ? 'var(--up)' : 'var(--down)';

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <caption className="zw-colhead" style={{ textAlign: 'left', paddingBottom: 6 }}>{title}</caption>
      <thead>
        <tr>
          <th scope="col" className="zw-colhead" style={{ textAlign: 'left' }}>Price</th>
          <th scope="col" className="zw-colhead" style={{ textAlign: 'right' }}>Quantity</th>
        </tr>
      </thead>
      <tbody>
        {levels.length === 0 ? (
          <tr>
            <td colSpan={2} className="zw-sub" style={{ padding: '8px 0', color: 'var(--ink-3)' }}>
              {/* Routine outside market hours, and real information
                  during them: one side of the book is genuinely empty. */}
              No {side === 'buy' ? 'bids' : 'asks'} on the book
            </td>
          </tr>
        ) : (
          levels.map((level, i) => (
            <tr key={`${level.price}-${i}`} style={{ position: 'relative' }}>
              <td
                className="zw-num"
                style={{ padding: '6px 0', fontSize: 12, color: colour, position: 'relative' }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    inset: '2px auto 2px 0',
                    width: `${(level.quantity / peak) * 100}%`,
                    background: colour,
                    opacity: 0.12,
                    pointerEvents: 'none',
                  }}
                />
                <span style={{ position: 'relative' }}>{num(level.price, 2)}</span>
              </td>
              <td className="zw-num" style={{ padding: '6px 0', fontSize: 12, textAlign: 'right' }}>
                {qty(level.quantity)}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

function Total({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'baseline' }}>
      <dt className="zw-colhead">{label}</dt>
      <dd className="zw-num" style={{ margin: 0, fontSize: 12, color: tone }}>{qty(value)}</dd>
    </div>
  );
}
