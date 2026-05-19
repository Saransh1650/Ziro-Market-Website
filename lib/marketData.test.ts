import { describe, it, expect } from 'vitest';
import { STATIC_INDICES, isMarketOpen, formatINR } from './marketData';

describe('marketData', () => {
  it('has 4 indices', () => expect(STATIC_INDICES).toHaveLength(4));
  it('formats Indian numbering', () => expect(formatINR(123456)).toMatch(/1,23,456/));
  it('closed on Sunday', () => expect(isMarketOpen(new Date('2026-05-17T10:00:00+05:30'))).toBe(false));
  it('open Wednesday 10:00 IST', () => expect(isMarketOpen(new Date('2026-05-20T10:00:00+05:30'))).toBe(true));
  it('closed Wednesday 16:00 IST', () => expect(isMarketOpen(new Date('2026-05-20T16:00:00+05:30'))).toBe(false));
});
