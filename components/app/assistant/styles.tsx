/**
 * Styles for answer widgets, scoped under `.zw-ab`.
 *
 * Colour policy follows the product's position: monochrome chrome, colour
 * reserved for DATA. The only hues here are up/down (gain/loss); warnings,
 * notices and "delayed" are carried by ink weight and glyphs, never a new
 * hue. Every colour goes through a `--ab-*` alias with a fallback so these
 * widgets survive token renames while the product theme is in flux.
 */
export function AssistantStyles() {
  return (
    <style>{`
      .zw-ab, .zw-ab-notice, .zw-ab-chips, .zw-ab-prose, .zw-ab-refs, .zw-ab-fallback, .zw-ab-disclaimer, .zw-ab-actions {
        --ab-bg: var(--surface, #fff);
        --ab-sunken: var(--surface-sunken, #fafbfb);
        --ab-hover: var(--surface-hover, rgba(17,20,24,.035));
        --ab-line: var(--line, #e6e8ea);
        --ab-line-strong: var(--line-strong, #d4d8dc);
        --ab-ink: var(--ink, #16191d);
        --ab-ink-2: var(--ink-2, #5b636e);
        --ab-ink-3: var(--ink-3, #868f9b);
        --ab-up: var(--up, #06806b);
        --ab-down: var(--down, #c8322e);
        --ab-up-chart: var(--up-chart, #089981);
        --ab-down-chart: var(--down-chart, #f23645);
        --ab-r: var(--r-card, 12px);
      }
      .zw-ab { border: 1px solid var(--ab-line); border-radius: var(--ab-r); background: var(--ab-bg); padding: 12px; min-width: 0; }
      .zw-ab-title { margin: 0 0 8px; font-size: 11px; line-height: 16px; font-weight: 600; color: var(--ab-ink-2); letter-spacing: .01em; }
      .zw-ab-foot { display: flex; align-items: center; gap: 6px; margin-top: 10px; font-size: 10px; line-height: 14px; color: var(--ab-ink-3); }
      .zw-ab-foot [data-delayed] { color: var(--ab-ink); font-weight: 600; }
      .zw-ab-dl { margin: 0; }
      .zw-ab-row { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; padding: 6px 0; border-top: 1px solid var(--ab-line); font-size: 12px; line-height: 16px; }
      .zw-ab-dl > .zw-ab-row:first-child, .zw-ab-first { border-top: 0; }
      .zw-ab-k { margin: 0; min-width: 0; color: var(--ab-ink-2); }
      .zw-ab-v { margin: 0; min-width: 0; text-align: right; color: var(--ab-ink); font-weight: 600; overflow-wrap: anywhere; font-variant-numeric: tabular-nums lining-nums; }
      .zw-ab-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px 16px; margin: 0; }
      .zw-ab-cell dt { margin: 0; font-size: 10px; line-height: 14px; color: var(--ab-ink-3); }
      .zw-ab-cell dd { margin: 2px 0 0; font-size: 13px; line-height: 18px; font-weight: 600; color: var(--ab-ink); overflow-wrap: anywhere; font-variant-numeric: tabular-nums lining-nums; }
      .zw-ab-head { display: flex; align-items: baseline; gap: 8px; margin-bottom: 10px; min-width: 0; }
      .zw-ab-head strong { font-size: 13px; color: var(--ab-ink); }
      .zw-ab-head span { font-size: 11px; color: var(--ab-ink-3); min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .zw-ab-bar { position: relative; height: 6px; border-radius: 3px; background: var(--ab-hover); }
      .zw-ab-bar > i { position: absolute; left: 0; top: 0; bottom: 0; border-radius: 3px; }
      .zw-ab-sector { display: grid; grid-template-columns: minmax(70px, 110px) 1fr auto; align-items: center; gap: 10px; padding: 4px 0; font-size: 12px; }
      .zw-ab-range { position: relative; height: 18px; margin: 4px 0; }
      .zw-ab-range .track { position: absolute; left: 0; right: 0; top: 7px; height: 4px; border-radius: 2px; background: var(--ab-line-strong); }
      .zw-ab-range .mark { position: absolute; top: 2px; width: 4px; height: 14px; margin-left: -2px; border-radius: 2px; background: var(--ab-ink); }
      .zw-ab-ends { display: flex; justify-content: space-between; font-size: 11px; color: var(--ab-ink-3); font-variant-numeric: tabular-nums; }
      .zw-ab-ends strong { color: var(--ab-ink); font-size: 12px; }
      .zw-ab-signal { display: grid; grid-template-columns: 14px minmax(80px, 108px) 1fr; gap: 8px; padding: 5px 0; font-size: 12px; line-height: 16px; }
      .zw-ab-signal .glyph { text-align: center; font-weight: 700; }
      .zw-ab-scroll { overflow-x: auto; }
      .zw-ab-table { width: 100%; border-collapse: collapse; font-size: 12px; }
      .zw-ab-table th, .zw-ab-table td { padding: 6px 8px 6px 0; text-align: right; border-top: 1px solid var(--ab-line); font-variant-numeric: tabular-nums lining-nums; }
      .zw-ab-table thead th { border-top: 0; color: var(--ab-ink); font-weight: 700; }
      .zw-ab-table tbody th { text-align: left; font-weight: 400; color: var(--ab-ink-2); position: sticky; left: 0; background: var(--ab-bg); }
      .zw-ab-table td { color: var(--ab-ink); font-weight: 600; }
      .zw-ab-news { list-style: none; margin: 0; padding: 0; }
      .zw-ab-news li { padding: 8px 0; border-top: 1px solid var(--ab-line); }
      .zw-ab-news li:first-child { border-top: 0; padding-top: 0; }
      .zw-ab-news a, .zw-ab-news .t { display: block; font-size: 12px; line-height: 17px; font-weight: 500; color: var(--ab-ink); text-decoration: none; }
      .zw-ab-news a:hover { text-decoration: underline; }
      .zw-ab-news .m { display: block; margin-top: 2px; font-size: 10px; color: var(--ab-ink-3); }
      .zw-ab-pulse-label { margin: 10px 0 6px; font-size: 10px; letter-spacing: .02em; color: var(--ab-ink-3); }
      .zw-ab-pulse { display: grid; grid-template-columns: repeat(auto-fill, minmax(96px, 1fr)); gap: 10px 14px; margin: 0; }
      .zw-ab-pulse dt { margin: 0; font-size: 10px; color: var(--ab-ink-3); }
      .zw-ab-pulse dd { margin: 2px 0 0; font-size: 13px; font-weight: 700; color: var(--ab-ink); font-variant-numeric: tabular-nums lining-nums; }
      .zw-ab-notice { display: flex; gap: 8px; padding: 10px 12px; border: 1px solid var(--ab-line-strong); border-radius: 8px; background: var(--ab-sunken); font-size: 12px; line-height: 17px; color: var(--ab-ink); }
      .zw-ab-notice .glyph { font-weight: 700; flex: none; }
      .zw-ab-notice[data-tone="warn"] { border-color: var(--ab-ink-2); }
      .zw-ab-notice[data-tone="warn"] .glyph { color: var(--ab-ink); }
      .zw-ab-chips, .zw-ab-actions { display: flex; flex-wrap: wrap; gap: 6px; }
      .zw-ab-chips .zw-chip, .zw-ab-actions .zw-chip { height: auto; min-height: 32px; padding: 7px 10px; text-align: left; white-space: normal; }
      .zw-ab-status { margin: 6px 0 0; font-size: 11px; color: var(--ab-ink-2); }
      .zw-ab-alert { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; margin-top: 8px; font-size: 12px; color: var(--ab-ink-2); }
      .zw-ab-alert input, .zw-ab-alert select { height: 30px; padding: 0 8px; background: transparent; color: var(--ab-ink); border: 1px solid var(--ab-line-strong); border-radius: 6px; font-size: 12px; }
      .zw-ab-alert input { width: 92px; font-variant-numeric: tabular-nums; }
      .zw-ab-disclaimer { display: flex; gap: 5px; margin: 6px 0 0; font-size: 10px; line-height: 14px; color: var(--ab-ink-3); }
      .zw-ab-fallback { margin: 0; padding: 10px; border: 1px solid var(--ab-line); border-radius: 10px; font-size: 12px; line-height: 17px; color: var(--ab-ink-2); }
      .zw-ab-prose { margin: 0; font-size: 13px; line-height: 1.55; color: var(--ab-ink); white-space: pre-wrap; overflow-wrap: anywhere; }
      .zw-ab-prose + .zw-ab-prose { margin-top: 8px; }
      .zw-ab-prose a { color: var(--ab-ink); text-decoration: underline; text-underline-offset: 2px; text-decoration-color: var(--ab-ink-3); }
      .zw-ab-prose a:hover { text-decoration-color: var(--ab-ink); }
      .zw-ab-refs { display: flex; flex-wrap: wrap; gap: 6px; }
      .zw-ab-refs a { display: inline-flex; max-width: 100%; padding: 4px 8px; border: 1px solid var(--ab-line); border-radius: 999px; font-size: 11px; color: var(--ab-ink-2); text-decoration: none; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .zw-ab-refs a:hover { background: var(--ab-hover); color: var(--ab-ink); }
      .zw-ab-chart { display: block; width: 100%; height: auto; }
      .zw-ab-chart-skel { height: 200px; border-radius: 8px; background: var(--ab-hover); }
    `}</style>
  );
}
