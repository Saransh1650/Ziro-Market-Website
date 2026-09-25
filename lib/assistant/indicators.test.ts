import { describe, expect, it } from 'vitest';
import { bollinger, ema, macd, rsi, sma } from './indicators';

describe('sma', () => {
  it('is null until warmed up, then the rolling mean', () => {
    expect(sma([1, 2, 3, 4, 5], 3)).toEqual([null, null, 2, 3, 4]);
  });
  it('returns all-null when the series is shorter than the period', () => {
    expect(sma([1, 2], 5)).toEqual([null, null]);
  });
});

describe('ema', () => {
  it('seeds with the simple average then smooths', () => {
    const e = ema([1, 2, 3, 4, 5], 3);
    expect(e.slice(0, 2)).toEqual([null, null]);
    expect(e[2]).toBeCloseTo(2, 10);      // seed = mean(1,2,3)
    expect(e[3]).toBeCloseTo(3, 10);      // 4*0.5 + 2*0.5
    expect(e[4]).toBeCloseTo(4, 10);
  });
});

describe('bollinger', () => {
  it('collapses to the mean when volatility is zero', () => {
    const b = bollinger([10, 10, 10, 10], 3);
    expect(b.mid[3]).toBe(10);
    expect(b.upper[3]).toBe(10);
    expect(b.lower[3]).toBe(10);
  });
  it('bands straddle the mean symmetrically', () => {
    const b = bollinger([1, 2, 3, 4, 5, 6], 3);
    const i = 5;
    expect((b.upper[i] as number) - (b.mid[i] as number)).toBeCloseTo((b.mid[i] as number) - (b.lower[i] as number), 10);
  });
});

describe('rsi', () => {
  it('is 100 for a monotonically rising series and 0 for a falling one', () => {
    const up = Array.from({ length: 30 }, (_, i) => 100 + i);
    const down = Array.from({ length: 30 }, (_, i) => 200 - i);
    expect(rsi(up, 14).at(-1)).toBe(100);
    expect(rsi(down, 14).at(-1)).toBeCloseTo(0, 10);
  });
  it('stays within 0-100 and is null during warm-up', () => {
    const v = Array.from({ length: 60 }, (_, i) => 100 + Math.sin(i / 3) * 5);
    const r = rsi(v, 14);
    expect(r.slice(0, 14).every((x) => x === null)).toBe(true);
    for (const x of r.slice(14)) { expect(x).toBeGreaterThanOrEqual(0); expect(x).toBeLessThanOrEqual(100); }
  });
});

describe('macd', () => {
  it('produces line, signal and histogram aligned to the input', () => {
    const v = Array.from({ length: 80 }, (_, i) => 100 + i * 0.5 + Math.sin(i / 4) * 3);
    const m = macd(v);
    expect(m.line).toHaveLength(80);
    expect(m.signal).toHaveLength(80);
    const i = 79;
    expect(m.hist[i]).toBeCloseTo((m.line[i] as number) - (m.signal[i] as number), 10);
    expect(m.line[24]).toBeNull();           // slow EMA (26) not ready yet
    expect(m.line[25]).not.toBeNull();
  });
});
