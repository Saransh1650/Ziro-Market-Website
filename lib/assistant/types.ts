/**
 * Answer blocks (Answer Experience spec v1). Mirrors the backend's
 * `contracts/blocks/blocks.schema.json`; the shared fixtures in
 * `lib/__fixtures__/blocks` are the executable form of these rules.
 *
 * The server sends flat JSON. This client is deliberately lenient:
 * unknown fields are ignored, unknown enum values fall back to a default,
 * and a payload that can't be drawn falls back to the block's plain-text
 * `alt`. Nothing here throws on malformed data.
 */

export type RawBlock = Record<string, unknown>;

/** Block types this build can render, with the highest schema version of each. Sent on every request. */
export const SUPPORTED_BLOCKS: Record<string, number> = {
  text: 1, stat: 1, line_chart: 1, tech_chart: 1, table: 1, kpi: 1, sector_perf: 1,
  range_bar: 1, signals: 1, compare_table: 1, suggestions: 1, disclaimer: 1,
  snapshot: 1, news_timeline: 1, market_pulse: 1, notice: 1, actions: 1,
};

/** Closed intent registry — never URLs or code from the server. */
export const SUPPORTED_INTENTS = [
  'watchlist.add', 'watchlist.remove', 'alert.create', 'navigate.symbol', 'navigate.page', 'ask.followup', 'profile.set',
] as const;
export type Intent = (typeof SUPPORTED_INTENTS)[number];

/** Product pages an answer may send the reader to. Paths are ours; the server only names one. */
export const APP_PAGES: Record<string, string> = {
  market: '/app/market', watchlist: '/app/watchlist', discover: '/app/discover',
  portfolio: '/app/portfolio', paper: '/app/paper', alerts: '/app/alerts',
};

export const PROFILE_KEYS = ['experience', 'risk', 'horizon', 'interest'] as const;

export const SYMBOL_RE = /^[A-Z0-9&.\-]{1,20}$/;

// ── shape-safe accessors ─────────────────────────────────────────────────────
export const isObj = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

export const str = (v: unknown, fallback = ''): string =>
  typeof v === 'string' ? v : v == null ? fallback : String(v);

export const numOf = (v: unknown): number | null =>
  typeof v === 'number' && Number.isFinite(v) ? v : null;

export const objs = (v: unknown): Record<string, unknown>[] => (Array.isArray(v) ? v.filter(isObj) : []);

export const strs = (v: unknown): string[] => (Array.isArray(v) ? v.map((e) => str(e)) : []);

/** Keeps only object entries, so one junk element can't break the list. */
export function parseBlocks(v: unknown): RawBlock[] {
  return Array.isArray(v) ? v.filter(isObj) : [];
}

export function parseReferences(v: unknown): { title: string; url: string }[] {
  return objs(v)
    .map((r) => ({ title: str(r.title), url: str(r.url) }))
    .filter((r) => /^https:\/\//i.test(r.url));
}

export interface ActionItem {
  id: string;
  label: string;
  intent: Intent;
  params: Record<string, unknown>;
}

/** Visible only if the intent is known AND its params validate; anything else is hidden, never repaired. */
export function validAction(a: Record<string, unknown>, allowed: ReadonlySet<string>): a is Record<string, unknown> & ActionItem {
  const intent = str(a.intent);
  if (!allowed.has(intent)) return false;
  const p = isObj(a.params) ? a.params : {};
  switch (intent) {
    case 'watchlist.add':
    case 'watchlist.remove':
    case 'navigate.symbol':
      return SYMBOL_RE.test(str(p.symbol));
    case 'alert.create': {
      const price = p.price;
      return SYMBOL_RE.test(str(p.symbol)) && (price === undefined || (typeof price === 'number' && price > 0 && Number.isFinite(price)));
    }
    case 'navigate.page':
      return str(p.page) in APP_PAGES;
    case 'profile.set':
      return (PROFILE_KEYS as readonly string[]).includes(str(p.key)) && str(p.value).length > 0 && str(p.value).length <= 25;
    case 'ask.followup': {
      const q = str(p.q);
      return q.length > 0 && q.length <= 200;
    }
    default:
      return false;
  }
}

export interface Turn {
  question: string;
  answer: string;
  price?: { symbol: string; price: number; changePct: number };
  clarify?: { symbol: string; name: string }[];
  tool?: string | null;
  error?: string;
  done: boolean;
  blocks: RawBlock[];
  references: { title: string; url: string }[];
}
