'use client';

import { useEffect, useRef, useState } from 'react';
import { useAuth } from './AuthProvider';
import { askAssistant, type AssistantEvent } from '@/lib/api/assistant';
import { num, pct } from '@/lib/format/number';

/**
 * Ask Ziro.
 *
 * Mobile uses a FAB opening a sheet that covers the screen. Here it is a
 * docked right panel that **pushes** the surface rather than covering
 * it — the point of asking about a stock is to read the answer against
 * the chart, and a sheet over the chart defeats that.
 *
 * Toggled with ⌘J or the header button.
 */

interface Turn {
  question: string;
  answer: string;
  price?: { symbol: string; price: number; changePct: number };
  clarify?: { symbol: string; name: string }[];
  tool?: string | null;
  error?: string;
  done: boolean;
}

/**
 * The backend's error strings are internal ("assistant failed"), which
 * tells a reader nothing about what happened or what to do. Translate
 * the ones we know; pass anything else through rather than inventing a
 * cause.
 */
function humanError(message: string): string {
  if (/assistant failed|internal|timeout/i.test(message)) {
    return 'Ziro could not answer that just now. The live price above is still current — try again in a moment.';
  }
  if (/rate|limit|429/i.test(message)) {
    return 'Too many questions in a short window. Give it a minute.';
  }
  return message;
}

export default function AssistantPanel() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [turns, setTurns] = useState<Turn[]>([]);
  const [busy, setBusy] = useState(false);
  const sessionRef = useRef<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const threadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    const onRequest = () => setOpen(true);

    window.addEventListener('keydown', onKey);
    document.addEventListener('zw:open-assistant', onRequest);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('zw:open-assistant', onRequest);
    };
  }, []);

  useEffect(() => () => abortRef.current?.abort(), []);

  const ask = async (text: string, symbol?: string) => {
    const q = text.trim();
    if (!q || busy) return;

    setQuestion('');
    setBusy(true);
    setTurns((prev) => [...prev, { question: q, answer: '', done: false }]);

    const controller = new AbortController();
    abortRef.current = controller;

    const patch = (fn: (turn: Turn) => Turn) =>
      setTurns((prev) => prev.map((t, i) => (i === prev.length - 1 ? fn(t) : t)));

    await askAssistant(
      { question: q, symbol, userId: user?.id, sessionId: sessionRef.current },
      (event: AssistantEvent) => {
        switch (event.type) {
          case 'meta':
            sessionRef.current = event.sessionId;
            break;
          case 'price':
            patch((t) => ({ ...t, price: { symbol: event.symbol, price: event.price, changePct: event.changePct } }));
            break;
          case 'clarify':
            patch((t) => ({ ...t, clarify: event.candidates, done: true }));
            break;
          case 'tool_start':
            patch((t) => ({ ...t, tool: event.name }));
            break;
          case 'tool_done':
            patch((t) => ({ ...t, tool: null }));
            break;
          case 'token':
            patch((t) => ({ ...t, answer: t.answer + event.text }));
            break;
          case 'final':
            patch((t) => ({ ...t, done: true, tool: null }));
            break;
          case 'error':
            patch((t) => ({ ...t, error: humanError(event.message), done: true, tool: null }));
            break;
        }
      },
      controller.signal,
    ).catch(() => {
      patch((t) => ({ ...t, error: 'The assistant stopped responding.', done: true }));
    });

    setBusy(false);
    patch((t) => ({ ...t, done: true }));
  };

  // Follow the answer as it streams.
  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight });
  }, [turns]);

  if (!open) return null;

  return (
    <aside
      aria-label="Ask Ziro"
      className="zw-assistant"
      style={{
        width: 'var(--panel-w)', flexShrink: 0, borderLeft: '1px solid var(--border-1)',
        display: 'flex', flexDirection: 'column', height: '100dvh', position: 'sticky', top: 0,
        background: 'var(--bg-0)',
      }}
    >
      <header style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-2)', padding: 'var(--s-3)', borderBottom: '1px solid var(--border-1)' }}>
        <h2 className="zw-section" style={{ flex: 1 }}>Ask Ziro</h2>
        <button type="button" className="zw-chip" onClick={() => setOpen(false)} aria-label="Close the assistant">Close</button>
      </header>

      <div ref={threadRef} role="log" aria-live="polite" style={{ flex: 1, overflowY: 'auto', padding: 'var(--s-3)', display: 'flex', flexDirection: 'column', gap: 'var(--s-4)' }}>
        {turns.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-2)' }}>
            <p className="zw-sub">Ask about a stock, a sector or the day&rsquo;s move.</p>
            {['Why did Nifty fall today?', 'How is RELIANCE doing?', 'Which sector led today?'].map((s) => (
              <button key={s} type="button" className="zw-chip" style={{ textAlign: 'left', height: 'auto', padding: '7px 9px' }} onClick={() => ask(s)}>
                {s}
              </button>
            ))}
          </div>
        )}

        {turns.map((turn, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <p style={{ fontSize: 13, fontWeight: 600 }}>{turn.question}</p>

            {turn.price && (
              <p className="zw-sub zw-num">
                {turn.price.symbol} {num(turn.price.price, 2)}{' '}
                <span style={{ color: turn.price.changePct >= 0 ? 'var(--positive)' : 'var(--negative)' }}>
                  {pct(turn.price.changePct)}
                </span>
              </p>
            )}

            {turn.tool && <p className="zw-sub" style={{ color: 'var(--text-3)' }}>Looking up {turn.tool}…</p>}

            {turn.clarify && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <p className="zw-sub">Which one did you mean?</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {turn.clarify.map((c) => (
                    <button key={c.symbol} type="button" className="zw-chip" onClick={() => ask(turn.question, c.symbol)}>
                      {c.symbol}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {turn.answer && (
              <p className="zw-prose" style={{ fontSize: 13, lineHeight: 1.55, whiteSpace: 'pre-wrap' }}>
                {turn.answer}
              </p>
            )}

            {turn.error && (
              <p className="zw-sub" role="alert" style={{ color: 'var(--negative)' }}>{turn.error}</p>
            )}

            {/* Generated text sitting beside exchange data must never be
                mistaken for it. */}
            {turn.done && turn.answer && (
              <p className="zw-sub" style={{ color: 'var(--text-3)' }}>AI generated · check before acting on it</p>
            )}
          </div>
        ))}
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); void ask(question); }}
        style={{ display: 'flex', gap: 'var(--s-2)', padding: 'var(--s-3)', borderTop: '1px solid var(--border-1)' }}
      >
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask about the market…"
          aria-label="Your question"
          style={{
            flex: 1, minWidth: 0, height: 34, padding: '0 8px', background: 'transparent',
            border: '1px solid var(--border-2)', borderRadius: 'var(--r-ctl)', fontSize: 13,
          }}
        />
        <button type="submit" className="zw-chip" aria-label="Send question" disabled={!question.trim() || busy}>
          {busy ? '…' : 'Send'}
        </button>
      </form>

      <style>{`
        @media (max-width: 1279px) {
          /* Below this there is no room to push, so it covers instead. */
          .zw-assistant {
            position: fixed !important;
            inset: 0 !important;
            width: 100% !important;
            z-index: 150;
          }
        }
      `}</style>
    </aside>
  );
}
