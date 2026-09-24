/**
 * NSE cash-market session state.
 *
 * Computed in IST regardless of the browser's timezone. A user in Dubai
 * and a user in Mumbai must see the same "market open" state — deriving
 * it from the local clock would give them different answers, and the
 * polling cadence and the live dot both read from this.
 */

const OPEN_MINUTES = 9 * 60 + 15; // 09:15 IST
const CLOSE_MINUTES = 15 * 60 + 30; // 15:30 IST

/**
 * NSE trading holidays. Published yearly by the exchange — this list
 * needs updating each January, and a stale list means the product shows
 * "open" on a day nothing trades.
 */
const HOLIDAYS_2026 = new Set([
  '2026-01-26',
  '2026-03-04',
  '2026-03-21',
  '2026-03-31',
  '2026-04-03',
  '2026-04-14',
  '2026-05-01',
  '2026-08-15',
  '2026-09-14',
  '2026-10-02',
  '2026-10-21',
  '2026-11-09',
  '2026-12-25',
]);

/** Wall-clock parts of `date` as they read in IST. */
function istParts(date: Date): { y: number; m: number; d: number; minutes: number; weekday: number } {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    weekday: 'short',
    hour12: false,
  });

  const parts = Object.fromEntries(fmt.formatToParts(date).map((p) => [p.type, p.value]));

  const weekdayIndex: Record<string, number> = {
    Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
  };

  return {
    y: Number(parts.year),
    m: Number(parts.month),
    d: Number(parts.day),
    // Intl renders midnight as "24" under hour12:false in some engines.
    minutes: (Number(parts.hour) % 24) * 60 + Number(parts.minute),
    weekday: weekdayIndex[parts.weekday as string] ?? 0,
  };
}

function isoDate(p: { y: number; m: number; d: number }): string {
  return `${p.y}-${String(p.m).padStart(2, '0')}-${String(p.d).padStart(2, '0')}`;
}

export function isTradingDay(date: Date = new Date()): boolean {
  const p = istParts(date);
  if (p.weekday === 0 || p.weekday === 6) return false;
  return !HOLIDAYS_2026.has(isoDate(p));
}

export function isMarketOpen(date: Date = new Date()): boolean {
  if (!isTradingDay(date)) return false;
  const { minutes } = istParts(date);
  return minutes >= OPEN_MINUTES && minutes <= CLOSE_MINUTES;
}

export type SessionState = 'pre-open' | 'open' | 'closed' | 'holiday';

export function sessionState(date: Date = new Date()): SessionState {
  const p = istParts(date);
  if (p.weekday === 0 || p.weekday === 6) return 'closed';
  if (HOLIDAYS_2026.has(isoDate(p))) return 'holiday';
  if (p.minutes < OPEN_MINUTES) return 'pre-open';
  if (p.minutes > CLOSE_MINUTES) return 'closed';
  return 'open';
}

/**
 * How often to refetch, in milliseconds.
 *
 * 30s while the market moves; 5m when it doesn't. Polling a closed
 * market every 30 seconds is pure load for a number that cannot change.
 */
export function pollInterval(date: Date = new Date()): number {
  return isMarketOpen(date) ? 30_000 : 300_000;
}

/** Short label for the session indicator in the ticker strip. */
export function sessionLabel(date: Date = new Date()): string {
  switch (sessionState(date)) {
    case 'open': return 'Live';
    case 'pre-open': return 'Pre-open';
    case 'holiday': return 'Holiday';
    default: return 'Closed';
  }
}
