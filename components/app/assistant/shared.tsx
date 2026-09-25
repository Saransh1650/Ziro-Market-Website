import type { ReactNode } from 'react';
import { Component } from 'react';
import { str } from '@/lib/assistant/types';
import type { RawBlock } from '@/lib/assistant/types';

/** A block that intentionally renders nothing (vs `null` = "can't draw this → show its alt text"). */
export const HIDDEN = Symbol('hidden');
export type Rendered = ReactNode | typeof HIDDEN;

const IN = 'en-IN';

/** "3:29 pm" today, "23 Sep" otherwise. */
export function fmtAsof(iso: unknown): string | null {
  if (typeof iso !== 'string') return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const now = new Date();
  const same = d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
  return same
    ? new Intl.DateTimeFormat(IN, { hour: 'numeric', minute: '2-digit', hour12: true }).format(d).toLowerCase()
    : new Intl.DateTimeFormat(IN, { day: 'numeric', month: 'short' }).format(d);
}

/** "Yahoo Finance · Upstox · 3:29 pm · delayed" — where a number came from, and when. */
export function Provenance({ b }: { b: RawBlock }) {
  const src = str(b.src);
  const when = fmtAsof(b.asof);
  const delayed = b.delayed === true;
  if (!src && !when && !delayed) return null;
  const parts = [src, when].filter(Boolean).join(' · ');
  return (
    <p className="zw-ab-foot">
      {parts && <span>{parts}</span>}
      {delayed && <span data-delayed>{parts ? '· ' : ''}delayed</span>}
    </p>
  );
}

/** Standard data card: optional title, body, provenance footer. */
export function Card({ b, title, children }: { b: RawBlock; title?: string; children: ReactNode }) {
  const alt = str(b.alt);
  return (
    <section className="zw-ab" role="group" aria-label={alt || undefined}>
      {title ? <p className="zw-ab-title" role="heading" aria-level={4}>{title}</p> : null}
      {children}
      <Provenance b={b} />
    </section>
  );
}

export function Fallback({ alt }: { alt: string }) {
  return alt ? <p className="zw-ab-fallback">{alt}</p> : null;
}

/**
 * One malformed block must never take the answer down (per-block error
 * isolation). If a block throws while rendering, only that block degrades
 * to its plain-text alt.
 */
export class BlockBoundary extends Component<{ alt: string; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <Fallback alt={this.props.alt} /> : this.props.children;
  }
}
