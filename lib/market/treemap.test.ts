import { describe, it, expect } from 'vitest';
import { squarify, tintStep } from './treemap';

describe('squarify', () => {
  const items = [
    { id: 'a', value: 40 },
    { id: 'b', value: 25 },
    { id: 'c', value: 20 },
    { id: 'd', value: 10 },
    { id: 'e', value: 5 },
  ];

  it('covers the container exactly', () => {
    const cells = squarify(items, 100, 100);
    const covered = cells.reduce((s, c) => s + c.w * c.h, 0);
    expect(covered).toBeCloseTo(10_000, 1);
  });

  it('keeps every cell inside the container', () => {
    for (const c of squarify(items, 100, 100)) {
      expect(c.x).toBeGreaterThanOrEqual(-0.001);
      expect(c.y).toBeGreaterThanOrEqual(-0.001);
      expect(c.x + c.w).toBeLessThanOrEqual(100.001);
      expect(c.y + c.h).toBeLessThanOrEqual(100.001);
    }
  });

  it('gives area in proportion to value', () => {
    const cells = squarify(items, 100, 100);
    const a = cells.find((c) => c.id === 'a')!;
    const e = cells.find((c) => c.id === 'e')!;
    // a is 8x e's value, so it should be ~8x the area.
    expect((a.w * a.h) / (e.w * e.h)).toBeCloseTo(8, 0);
  });

  it('keeps aspect ratios usable — a label has to fit', () => {
    for (const c of squarify(items, 160, 100)) {
      const ratio = Math.max(c.w / c.h, c.h / c.w);
      expect(ratio).toBeLessThan(6);
    }
  });

  it('drops zero and negative weights instead of producing empty cells', () => {
    const cells = squarify([{ id: 'a', value: 10 }, { id: 'b', value: 0 }, { id: 'c', value: -5 }]);
    expect(cells.map((c) => c.id)).toEqual(['a']);
  });

  it('returns nothing for an empty input', () => {
    expect(squarify([])).toEqual([]);
  });
});

describe('tintStep', () => {
  it('separates an ordinary move from a flat one', () => {
    // The reason the ramp is non-linear: most sector days live here.
    expect(tintStep(0.05)).toBe(0);
    expect(tintStep(0.3)).toBe(1);
    expect(tintStep(0.7)).toBe(2);
  });

  it('saturates at the top so a crash still reads as a crash', () => {
    expect(tintStep(3.5)).toBe(5);
    expect(tintStep(11)).toBe(5);
  });

  it('is symmetric — direction is carried by colour, not by step', () => {
    expect(tintStep(-1.2)).toBe(tintStep(1.2));
  });
});
