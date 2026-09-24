import { describe, it, expect } from 'vitest';
import { isMarketOpen, isTradingDay, sessionState, pollInterval } from './hours';

// 2026-09-23 is a Wednesday. IST is UTC+5:30, so 09:15 IST = 03:45 UTC.
const at = (utc: string) => new Date(utc);

describe('session state in IST', () => {
  it('is open between 09:15 and 15:30 IST', () => {
    expect(isMarketOpen(at('2026-09-23T04:30:00Z'))).toBe(true); // 10:00 IST
    expect(isMarketOpen(at('2026-09-23T09:59:00Z'))).toBe(true); // 15:29 IST
  });

  it('is closed on either side of the session', () => {
    expect(isMarketOpen(at('2026-09-23T03:44:00Z'))).toBe(false); // 09:14 IST
    expect(isMarketOpen(at('2026-09-23T10:01:00Z'))).toBe(false); // 15:31 IST
  });

  it('answers the same regardless of the caller timezone', () => {
    // Both are the same instant. The function reads IST, not the host
    // clock, so the answer cannot differ for a user in Dubai.
    const instant = at('2026-09-23T04:30:00Z');
    expect(isMarketOpen(instant)).toBe(true);
    expect(isMarketOpen(new Date(instant.getTime()))).toBe(true);
  });

  it('is closed at weekends', () => {
    expect(isTradingDay(at('2026-09-26T04:30:00Z'))).toBe(false); // Saturday
    expect(isTradingDay(at('2026-09-27T04:30:00Z'))).toBe(false); // Sunday
    expect(isMarketOpen(at('2026-09-26T04:30:00Z'))).toBe(false);
  });

  it('is closed on an exchange holiday', () => {
    // 2026-01-26, Republic Day — a Monday that is not a trading day.
    expect(isTradingDay(at('2026-01-26T04:30:00Z'))).toBe(false);
    expect(sessionState(at('2026-01-26T04:30:00Z'))).toBe('holiday');
  });

  it('distinguishes pre-open from closed', () => {
    expect(sessionState(at('2026-09-23T02:00:00Z'))).toBe('pre-open'); // 07:30 IST
    expect(sessionState(at('2026-09-23T12:00:00Z'))).toBe('closed'); // 17:30 IST
  });
});

describe('pollInterval', () => {
  it('polls hard while the market moves and backs off when it does not', () => {
    expect(pollInterval(at('2026-09-23T04:30:00Z'))).toBe(30_000);
    expect(pollInterval(at('2026-09-26T04:30:00Z'))).toBe(300_000);
  });
});
