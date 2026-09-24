import { describe, it, expect, vi, afterEach } from 'vitest';
import { num, money, qty, compact, pct, signed, direction, relativeTime } from './number';

describe('Indian digit grouping', () => {
  it('groups in lakhs and crores, not thousands', () => {
    // The whole point of the module. en-US would give "1,234,567.89".
    expect(num(1234567.89)).toBe('12,34,567.89');
    expect(money(1234567.89)).toBe('₹12,34,567.89');
  });

  it('leaves small numbers alone', () => {
    expect(num(999.5)).toBe('999.50');
  });

  it('renders a dash for missing values rather than NaN or 0', () => {
    expect(num(null)).toBe('—');
    expect(num(undefined)).toBe('—');
    expect(num(NaN)).toBe('—');
    expect(money(null)).toBe('—');
    expect(qty(null)).toBe('—');
  });

  it('keeps zero as zero — it is a value, not a missing value', () => {
    expect(num(0)).toBe('0.00');
    expect(qty(0)).toBe('0');
  });
});

describe('compact', () => {
  it('scales by crore and lakh, never by million or billion', () => {
    expect(compact(85_000)).toBe('₹85,000.00');
    expect(compact(1_500_000)).toBe('₹15.00 L');
    expect(compact(50_000_000)).toBe('₹5.00 Cr');
    expect(compact(452_000_000_000)).toBe('₹45.20K Cr');
    expect(compact(1_240_000_000_000)).toBe('₹1.24L Cr');
  });

  it('handles the crore and lakh boundaries exactly', () => {
    expect(compact(1e5)).toBe('₹1.00 L');
    expect(compact(1e7)).toBe('₹1.00 Cr');
    expect(compact(1e10)).toBe('₹1.00K Cr');
    expect(compact(1e12)).toBe('₹1.00L Cr');
  });

  it('keeps the sign outside the currency symbol', () => {
    expect(compact(-50_000_000)).toBe('-₹5.00 Cr');
  });

  it('can drop the currency symbol', () => {
    expect(compact(50_000_000, false)).toBe('5.00 Cr');
  });
});

describe('signed values', () => {
  it('always shows an explicit sign, so colour is never the only signal', () => {
    expect(pct(1.24)).toBe('+1.24%');
    expect(signed(34.2)).toBe('+34.20');
  });

  it('uses a true minus sign, which sets flush with a plus', () => {
    expect(pct(-0.8)).toBe('−0.80%');
    expect(signed(-34.2)).toBe('−34.20');
  });

  it('gives zero no sign at all', () => {
    expect(pct(0)).toBe('0.00%');
    expect(signed(0)).toBe('0.00');
  });
});

describe('direction', () => {
  it('treats zero as flat, not as a gain', () => {
    expect(direction(0)).toBe('flat');
    expect(direction(null)).toBe('flat');
    expect(direction(0.01)).toBe('up');
    expect(direction(-0.01)).toBe('down');
  });
});

describe('relativeTime', () => {
  afterEach(() => vi.useRealTimers());

  it('steps from minutes to hours to a date', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-09-23T12:00:00Z'));

    expect(relativeTime(new Date('2026-09-23T11:58:00Z'))).toBe('2m ago');
    expect(relativeTime(new Date('2026-09-23T09:00:00Z'))).toBe('3h ago');
    expect(relativeTime(new Date('2026-09-22T09:00:00Z'))).toBe('Yesterday');
    expect(relativeTime(new Date('2026-09-10T09:00:00Z'))).toContain('Sep');
  });

  it('handles an unparseable date without throwing', () => {
    expect(relativeTime('not a date')).toBe('—');
    expect(relativeTime(null)).toBe('—');
  });
});
