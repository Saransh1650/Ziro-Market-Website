/**
 * Squarified treemap layout.
 *
 * Bruls, Huizing & van Wijk (2000). The algorithm packs rectangles so
 * their aspect ratios stay as close to 1 as it can — which matters here
 * because a 20:1 sliver cannot hold a sector name and a percentage, and
 * a mosaic whose labels don't fit is just a coloured rectangle.
 *
 * Returns percentages, so the result drops straight into CSS without
 * needing a measured container.
 */

export interface TreemapInput {
  id: string;
  /** Relative area. Must be > 0; zero-weight items are dropped. */
  value: number;
}

export interface TreemapCell extends TreemapInput {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface Rect { x: number; y: number; w: number; h: number }

export function squarify(
  items: TreemapInput[],
  width = 100,
  height = 100,
): TreemapCell[] {
  const valid = items.filter((i) => i.value > 0 && Number.isFinite(i.value));
  if (valid.length === 0) return [];

  const total = valid.reduce((s, i) => s + i.value, 0);
  const area = width * height;

  // Scale to the target area up front, so every comparison below is in
  // the same units as the rectangle being filled.
  const scaled = [...valid]
    .sort((a, b) => b.value - a.value)
    .map((i) => ({ ...i, area: (i.value / total) * area }));

  const out: TreemapCell[] = [];
  let rect: Rect = { x: 0, y: 0, w: width, h: height };
  let row: typeof scaled = [];

  const shortest = (r: Rect) => Math.min(r.w, r.h);

  /** Worst aspect ratio in `row` if `extra` joins it. */
  function worst(r: typeof scaled, side: number): number {
    if (r.length === 0) return Infinity;
    const sum = r.reduce((s, i) => s + i.area, 0);
    if (sum === 0) return Infinity;
    const max = Math.max(...r.map((i) => i.area));
    const min = Math.min(...r.map((i) => i.area));
    const s2 = side * side;
    const sum2 = sum * sum;
    return Math.max((s2 * max) / sum2, sum2 / (s2 * min));
  }

  function layoutRow(r: typeof scaled, container: Rect): Rect {
    const sum = r.reduce((s, i) => s + i.area, 0);
    const horizontal = container.w >= container.h;

    if (horizontal) {
      // Row runs down the left edge; it consumes a vertical strip.
      const stripW = sum / container.h;
      let y = container.y;
      for (const item of r) {
        const h = (item.area / sum) * container.h;
        out.push({ id: item.id, value: item.value, x: container.x, y, w: stripW, h });
        y += h;
      }
      return { x: container.x + stripW, y: container.y, w: container.w - stripW, h: container.h };
    }

    const stripH = sum / container.w;
    let x = container.x;
    for (const item of r) {
      const w = (item.area / sum) * container.w;
      out.push({ id: item.id, value: item.value, x, y: container.y, w, h: stripH });
      x += w;
    }
    return { x: container.x, y: container.y + stripH, w: container.w, h: container.h - stripH };
  }

  for (const item of scaled) {
    const side = shortest(rect);
    const next = [...row, item];

    // Keep adding to the row while it makes the worst rectangle in it
    // squarer. The moment it gets worse, close the row and start again.
    if (row.length === 0 || worst(next, side) <= worst(row, side)) {
      row = next;
    } else {
      rect = layoutRow(row, rect);
      row = [item];
    }
  }

  if (row.length > 0) layoutRow(row, rect);

  return out;
}

/**
 * Tint step for a percentage change, 0–5.
 *
 * Non-linear on purpose: most sector moves on an ordinary day land under
 * 1%, so a linear ramp would render a whole normal session in the palest
 * step and throw away the distinctions that matter.
 */
export function tintStep(changePercent: number): 0 | 1 | 2 | 3 | 4 | 5 {
  const a = Math.abs(changePercent);
  if (a < 0.1) return 0;
  if (a < 0.4) return 1;
  if (a < 0.9) return 2;
  if (a < 1.8) return 3;
  if (a < 3.0) return 4;
  return 5;
}
