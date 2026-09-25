/**
 * Heatmap colour scale.
 *
 * A fixed diverging scale anchored at ±3%, interpolated in RGB — the same
 * convention TradingView's stock heatmap uses, and the reason traders read
 * it without a legend. A neutral mid-grey at 0%, saturating red below and
 * green above. Because the scale is fixed rather than fitted to the day's
 * range, a +0.5% session looks quiet and a +3% one looks loud.
 *
 * Opaque colours, not alpha over the canvas: the same red at low alpha
 * composites differently on every surface.
 */

const STOPS: [number, [number, number, number]][] = [
  [-3, [246, 53, 56]],
  [-2, [191, 64, 69]],
  [-1, [139, 68, 78]],
  [0, [65, 69, 84]],
  [1, [53, 118, 78]],
  [2, [47, 158, 79]],
  [3, [48, 204, 90]],
];

export const HEAT_RANGE = 3;

export function heatColor(changePercent: number | null | undefined): string {
  const v = Math.max(-HEAT_RANGE, Math.min(HEAT_RANGE, Number.isFinite(changePercent as number) ? (changePercent as number) : 0));
  for (let i = 1; i < STOPS.length; i++) {
    const [b, cb] = STOPS[i];
    const [a, ca] = STOPS[i - 1];
    if (v <= b) {
      const t = (v - a) / (b - a);
      const c = ca.map((x, k) => Math.round(x + (cb[k] - x) * t));
      return `rgb(${c[0]} ${c[1]} ${c[2]})`;
    }
  }
  return 'rgb(48 204 90)';
}

/** The gradient the legend draws, so it is guaranteed to match the tiles. */
export const HEAT_GRADIENT = `linear-gradient(90deg, ${STOPS.map(
  ([, c], i) => `rgb(${c.join(' ')}) ${(i / (STOPS.length - 1)) * 100}%`,
).join(', ')})`;
