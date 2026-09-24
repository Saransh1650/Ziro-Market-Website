/**
 * Number formatting for the product surface.
 *
 * Everything here exists because Indian market data is not formatted the
 * way `Intl` defaults format it. Lakh/crore grouping and crore-scaled
 * abbreviations are not cosmetic — `1,23,456` and `123,456` are the same
 * number written in two conventions, and showing the wrong one is the
 * fastest way for the product to read as foreign.
 */

const IN = 'en-IN';

/** `12,34,567.89` — Indian digit grouping, no currency symbol. */
export function num(value: number | null | undefined, decimals = 2): string {
  if (value == null || !Number.isFinite(value)) return '—';
  return new Intl.NumberFormat(IN, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/** `₹12,34,567.89` */
export function money(value: number | null | undefined, decimals = 2): string {
  if (value == null || !Number.isFinite(value)) return '—';
  return `₹${num(value, decimals)}`;
}

/** Integer grouping, no currency. Share counts, volumes. */
export function qty(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) return '—';
  return new Intl.NumberFormat(IN, { maximumFractionDigits: 0 }).format(value);
}

/**
 * `₹1.24L Cr`, `₹45.20K Cr`, `₹8.40 Cr`, `₹12.30 L`.
 *
 * Crore and lakh, never M/B. An Indian market cap quoted in billions is
 * a number the reader has to convert in their head before it means
 * anything.
 */
export function compact(value: number | null | undefined, currency = true): string {
  if (value == null || !Number.isFinite(value)) return '—';

  const sign = value < 0 ? '-' : '';
  const n = Math.abs(value);
  const prefix = currency ? '₹' : '';

  const CRORE = 1e7;
  const LAKH = 1e5;

  let body: string;
  if (n >= CRORE * 1e5) body = `${(n / (CRORE * 1e5)).toFixed(2)}L Cr`;
  else if (n >= CRORE * 1e3) body = `${(n / (CRORE * 1e3)).toFixed(2)}K Cr`;
  else if (n >= CRORE) body = `${(n / CRORE).toFixed(2)} Cr`;
  else if (n >= LAKH) body = `${(n / LAKH).toFixed(2)} L`;
  else body = num(n, 2);

  return `${sign}${prefix}${body}`;
}

/**
 * `+1.24%` / `−0.80%` / `0.00%`.
 *
 * The sign is always explicit and always uses U+2212 for negatives — a
 * hyphen is narrower than a plus, so a column of mixed signs sets
 * ragged with one and flush with the other.
 */
export function pct(value: number | null | undefined, decimals = 2): string {
  if (value == null || !Number.isFinite(value)) return '—';
  const sign = value > 0 ? '+' : value < 0 ? '−' : '';
  return `${sign}${Math.abs(value).toFixed(decimals)}%`;
}

/** Signed absolute change, for the "+34.20" beside a "+1.22%". */
export function signed(value: number | null | undefined, decimals = 2): string {
  if (value == null || !Number.isFinite(value)) return '—';
  const sign = value > 0 ? '+' : value < 0 ? '−' : '';
  return `${sign}${num(Math.abs(value), decimals)}`;
}

export type Direction = 'up' | 'down' | 'flat';

/**
 * Direction of a change. Zero is flat, not up — a 0.00% move rendered
 * in green reads as a gain that isn't there.
 */
export function direction(value: number | null | undefined): Direction {
  if (value == null || !Number.isFinite(value) || value === 0) return 'flat';
  return value > 0 ? 'up' : 'down';
}

/** `2m ago`, `3h ago`, `Yesterday`, `12 Sep`, `12 Sep 2025`. */
export function relativeTime(input: Date | string | number | null | undefined): string {
  if (input == null) return '—';
  const d = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(d.getTime())) return '—';

  const diffMs = Date.now() - d.getTime();
  const mins = Math.floor(diffMs / 60_000);

  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;

  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  if (hours < 48) return 'Yesterday';

  const sameYear = d.getFullYear() === new Date().getFullYear();
  return new Intl.DateTimeFormat(IN, {
    day: 'numeric',
    month: 'short',
    ...(sameYear ? {} : { year: 'numeric' }),
  }).format(d);
}
