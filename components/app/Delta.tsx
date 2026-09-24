import { pct, signed, direction, money, compact, num } from '@/lib/format/number';

/**
 * A signed change.
 *
 * Owns the sign column — the +/− sits in its own fixed-width cell before
 * the digits, so scanning a table shows a clean run of signs before a
 * single digit is read. The glyph is always rendered: colour alone is not
 * a signal roughly 8% of Indian men can read.
 */
export function Delta({
  value,
  mode = 'percent',
  decimals = 2,
  className = '',
}: {
  value: number | null | undefined;
  mode?: 'percent' | 'absolute';
  decimals?: number;
  className?: string;
}) {
  const dir = direction(value);
  const text = mode === 'percent' ? pct(value, decimals) : signed(value, decimals);

  // The sign is split out so it can occupy its own grid cell. A missing
  // value renders as a dash with no sign at all.
  const sign = text.startsWith('+') ? '+' : text.startsWith('−') ? '−' : '';
  const body = sign ? text.slice(1) : text;

  return (
    <span
      className={`zw-delta ${className}`}
      data-dir={dir}
      aria-label={
        value == null
          ? 'No data'
          : `${dir === 'up' ? 'up' : dir === 'down' ? 'down' : 'unchanged'} ${body}`
      }
    >
      <span className="sign" aria-hidden="true">{sign}</span>
      <span>{body}</span>
    </span>
  );
}

/**
 * A rupee value with Indian digit grouping.
 *
 * `compact` abbreviates by crore and lakh; the full value stays available
 * in the title, so precision is never actually lost.
 */
export function Money({
  value,
  compact: useCompact = false,
  decimals = 2,
  currency = true,
  className = '',
}: {
  value: number | null | undefined;
  compact?: boolean;
  decimals?: number;
  currency?: boolean;
  className?: string;
}) {
  const display = useCompact
    ? compact(value, currency)
    : currency
      ? money(value, decimals)
      : num(value, decimals);

  return (
    <span
      className={`zw-num ${className}`}
      title={useCompact && value != null ? money(value, decimals) : undefined}
    >
      {display}
    </span>
  );
}
