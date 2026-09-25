/**
 * Answer text → tokens. Pure and dependency-free so it is trivially testable
 * and can never produce HTML: the caller maps tokens to React nodes.
 *
 * Grammar (all the backend prompt allows): **bold**, [Name](stock:SYMBOL),
 * [label](https://…) and bare https:// links. Only the `stock:` and `https:`
 * schemes are ever turned into links — `javascript:`, `data:` and friends fall
 * through as plain text. Anything unclosed (a `**` still streaming in) stays text.
 */
import { SYMBOL_RE } from './types';

export type Token =
  | { kind: 'text'; text: string }
  | { kind: 'bold'; text: string }
  | { kind: 'stock'; label: string; symbol: string }
  | { kind: 'link'; label: string; url: string };

const PATTERN = /\*\*([^*\n]+?)\*\*|\[([^\]\n]+)\]\((stock:[^\s)]+|https:\/\/[^\s)]+)\)|(https:\/\/[^\s<>()]+)/g;
const TRAILING = /[.,;:!?]+$/;

export function tokenize(input: string): Token[] {
  const out: Token[] = [];
  let last = 0;
  const push = (t: Token) => {
    const prev = out[out.length - 1];
    if (t.kind === 'text' && prev?.kind === 'text') prev.text += t.text;
    else out.push(t);
  };

  for (const m of input.matchAll(PATTERN)) {
    const start = m.index ?? 0;
    if (start > last) push({ kind: 'text', text: input.slice(last, start) });
    last = start + m[0].length;

    if (m[1] !== undefined) {
      push({ kind: 'bold', text: m[1] });
    } else if (m[2] !== undefined && m[3] !== undefined) {
      if (m[3].startsWith('stock:')) {
        const symbol = m[3].slice(6);
        if (SYMBOL_RE.test(symbol)) push({ kind: 'stock', label: m[2], symbol });
        else push({ kind: 'text', text: m[0] });
      } else {
        push({ kind: 'link', label: m[2], url: m[3] });
      }
    } else if (m[4] !== undefined) {
      const trail = TRAILING.exec(m[4])?.[0] ?? '';
      const url = trail ? m[4].slice(0, -trail.length) : m[4];
      push({ kind: 'link', label: url, url });
      if (trail) push({ kind: 'text', text: trail });
    }
  }
  if (last < input.length) push({ kind: 'text', text: input.slice(last) });
  return out;
}
