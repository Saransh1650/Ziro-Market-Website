'use client';

import { useState } from 'react';
import { placeOrder } from '@/lib/api/paperTrade';
import { isMarketOpen } from '@/lib/market/hours';
import { num } from '@/lib/format/number';

/**
 * Paper trade order ticket.
 *
 * Market orders only — `/paper-trade/buy` and `/sell` take a quantity
 * and nothing else. There is no limit price to collect, so the ticket
 * does not pretend to offer one.
 *
 * Outside market hours the backend queues the order to fill at the next
 * open. The ticket says so before submit rather than after, because
 * "this will not execute now" changes whether someone wants to place it.
 */
export default function OrderTicket({
  userId,
  onPlaced,
  presetSymbol,
}: {
  userId: string;
  onPlaced: () => void;
  presetSymbol?: string;
}) {
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [symbol, setSymbol] = useState(presetSymbol ?? '');
  const [quantity, setQuantity] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ tone: 'ok' | 'bad'; text: string } | null>(null);

  const qty = Number(quantity);
  const marketOpen = isMarketOpen();
  const valid = symbol.trim().length > 0 && Number.isInteger(qty) && qty > 0;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid || busy) return;

    const clean = symbol.trim().toUpperCase();
    const verb = side === 'buy' ? 'Buy' : 'Sell';

    // The whole order restated, because a market order has no price to
    // check afterwards — once it is in, it is in.
    const confirmed = window.confirm(
      `${verb} ${qty} ${clean} at market.\n\n` +
        (marketOpen
          ? 'This executes immediately against simulated money.'
          : 'The market is closed, so this queues and fills at the next open.'),
    );
    if (!confirmed) return;

    setBusy(true);
    setMessage(null);

    const result = await placeOrder(userId, { symbol: clean, quantity: qty, product: 'delivery' }, side);
    setBusy(false);

    if (!result.ok) {
      setMessage({ tone: 'bad', text: result.error.message });
      return;
    }

    const pending = (result.data as { pending?: boolean })?.pending;
    setMessage({
      tone: 'ok',
      text: pending
        ? `Queued: ${verb.toLowerCase()} ${qty} ${clean}. It fills at the next open.`
        : `Filled: ${verb.toLowerCase()} ${qty} ${clean}.`,
    });
    setQuantity('');
    onPlaced();
  };

  return (
    <form
      onSubmit={submit}
      aria-label="Place a simulated order"
      style={{
        border: '1px solid var(--line)', borderRadius: 'var(--r-ctl)',
        padding: 'var(--s-3)', display: 'flex', flexDirection: 'column', gap: 'var(--s-3)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 'var(--s-2)' }}>
        <h2 className="zw-section">Place an order</h2>
        <span className="zw-sub" style={{ color: marketOpen ? 'var(--up)' : 'var(--ink-3)' }}>
          {marketOpen ? 'Market open' : 'Market closed — queues to next open'}
        </span>
      </div>

      <div role="group" aria-label="Side" style={{ display: 'flex', gap: 'var(--s-1)' }}>
        {(['buy', 'sell'] as const).map((s) => (
          <button
            key={s}
            type="button"
            className="zw-chip"
            aria-pressed={side === s}
            onClick={() => setSide(s)}
            style={{ flex: 1, height: 32 }}
          >
            {s === 'buy' ? 'Buy' : 'Sell'}
          </button>
        ))}
      </div>

      <label style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <span className="zw-colhead">Stock</span>
        <input
          value={symbol}
          onChange={(e) => { setSymbol(e.target.value.toUpperCase()); setMessage(null); }}
          placeholder="RELIANCE"
          autoComplete="off"
          style={fieldStyle}
        />
      </label>

      <label style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <span className="zw-colhead">Quantity</span>
        <input
          value={quantity}
          onChange={(e) => { setQuantity(e.target.value.replace(/[^0-9]/g, '')); setMessage(null); }}
          inputMode="numeric"
          placeholder="10"
          style={{ ...fieldStyle, fontFamily: 'var(--mono)' }}
        />
      </label>

      <button type="submit" className="zw-chip" disabled={!valid || busy} style={{ height: 36, opacity: valid && !busy ? 1 : 0.5 }}>
        {busy ? 'Placing…' : `${side === 'buy' ? 'Buy' : 'Sell'}${valid ? ` ${num(qty, 0)} ${symbol.trim()}` : ''}`}
      </button>

      {/* A filled order is announced, so it is not something a screen
          reader user has to go looking for. */}
      <p
        aria-live="polite"
        className="zw-sub"
        style={{ minHeight: 18, color: message?.tone === 'bad' ? 'var(--down)' : 'var(--up)' }}
      >
        {message?.text ?? ' '}
      </p>

      <p className="zw-sub" style={{ color: 'var(--ink-3)' }}>
        Simulated only. No real money and no real order reaches an exchange.
      </p>
    </form>
  );
}

const fieldStyle: React.CSSProperties = {
  height: 34, padding: '0 8px', background: 'transparent',
  border: '1px solid var(--line-strong)', borderRadius: 'var(--r-ctl)', fontSize: 13,
};
