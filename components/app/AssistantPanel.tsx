'use client';

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { askAssistant, type AssistantEvent } from '@/lib/api/assistant';
import { num, pct } from '@/lib/format/number';
import { assistantStore, hydrateAssistantStore, useAssistantState } from '@/lib/assistant/store';
import { SUPPORTED_INTENTS, parseBlocks, parseReferences, str } from '@/lib/assistant/types';
import type { Intent, Turn } from '@/lib/assistant/types';
import { AnswerBody } from './assistant/AnswerBody';
import { BlockView } from './assistant/BlockView';
import { References } from './assistant/References';
import { AssistantStyles } from './assistant/styles';
import { runIntent } from './assistant/intents';
import type { BlockCtx } from './assistant/blocks/Cards';

/**
 * Ask Ziro.
 *
 * Wide screens: a docked right panel that **pushes** the surface, because
 * the point of asking about a stock is to read the answer against the
 * chart, and a sheet over the chart defeats that. Narrow screens: a full
 * overlay with the conversation held to a readable column.
 *
 * Conversation state lives in a module store (see lib/assistant/store.ts),
 * not here: following a stock link leaves the layout that mounts this
 * panel, and local state would be wiped with it.
 *
 * Toggled with ⌘J or the header button.
 */

const ALLOWED = new Set<string>(SUPPORTED_INTENTS);
const OVERLAY_QUERY = '(max-width: 1279px)';

const TOOL_LABEL: Record<string, string> = {
  get_live_price: 'Checking live price',
  get_historical_summary: 'Pulling price history',
  get_fundamentals: 'Reading fundamentals',
  get_stock_news: 'Scanning news',
  get_corporate_actions: 'Checking announcements',
  get_fii_dii: 'Checking FII / DII flows',
  get_index_levels: 'Checking index levels',
  get_sector_performance: 'Checking sector moves',
  get_global_cues: 'Checking global markets',
  web_search: 'Searching the web',
};

/**
 * The backend's error strings are internal ("assistant failed"), which
 * tells a reader nothing about what happened or what to do. Translate
 * the ones we know; pass anything else through rather than inventing a
 * cause.
 */
function humanError(message: string): string {
  if (/too many|rate|limit|429/i.test(message)) {
    return 'Too many questions in a short window. Give it a minute.';
  }
  if (/assistant failed|internal|timeout/i.test(message)) {
    return 'Ziro could not answer that just now. The live price above is still current — try again in a moment.';
  }
  return message;
}

function useOverlayMode(): boolean {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(OVERLAY_QUERY);
      mq.addEventListener('change', cb);
      return () => mq.removeEventListener('change', cb);
    },
    () => window.matchMedia(OVERLAY_QUERY).matches,
    () => false,
  );
}

export default function AssistantPanel() {
  const { user, session } = useAuth();
  const router = useRouter();
  const { open, turns } = useAssistantState();
  const overlay = useOverlayMode();

  const [question, setQuestion] = useState('');
  const [busy, setBusy] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const threadRef = useRef<HTMLDivElement>(null);
  const asideRef = useRef<HTMLElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const stickRef = useRef(true);

  useEffect(() => {
    hydrateAssistantStore();
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        assistantStore.toggle();
      }
    };
    const onRequest = () => assistantStore.setOpen(true);
    window.addEventListener('keydown', onKey);
    document.addEventListener('zw:open-assistant', onRequest);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('zw:open-assistant', onRequest);
    };
  }, []);

  useEffect(() => () => abortRef.current?.abort(), []);

  // Move focus into the panel when it opens, and back to where it came from when it closes.
  useEffect(() => {
    if (!open) return;
    returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    inputRef.current?.focus();
    return () => returnFocusRef.current?.focus?.();
  }, [open]);

  const ask = useCallback(async (text: string, symbol?: string) => {
    const q = text.trim();
    if (!q || busy) return;

    setQuestion('');
    setBusy(true);
    stickRef.current = true;
    assistantStore.addTurn({ question: q, answer: '', done: false, blocks: [], references: [] });

    const controller = new AbortController();
    abortRef.current = controller;
    const patch = (fn: (t: Turn) => Turn) => assistantStore.patchLast(fn);

    await askAssistant(
      { question: q, symbol, userId: user?.id, sessionId: assistantStore.getState().sessionId },
      (event: AssistantEvent) => {
        switch (event.type) {
          case 'meta':
            assistantStore.setSession(event.sessionId);
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
            // `final.answer` is the finished text with stock links added, so it replaces the streamed draft.
            patch((t) => ({
              ...t,
              answer: str(event.answer) || t.answer,
              blocks: parseBlocks(event.blocks),
              references: parseReferences(event.references),
              done: true,
              tool: null,
            }));
            break;
          case 'error':
            patch((t) => ({ ...t, error: humanError(event.message), done: true, tool: null }));
            break;
        }
      },
      controller.signal,
    ).catch((e: unknown) => {
      if (e instanceof DOMException && e.name === 'AbortError') return;
      patch((t) => ({ ...t, error: 'The assistant stopped responding.', done: true }));
    });

    // "New chat" replaces the controller; a superseded request must not touch the new conversation.
    if (abortRef.current !== controller) return;
    setBusy(false);
    patch((t) => ({ ...t, done: true, tool: null }));
  }, [busy, user?.id]);

  const token = session?.access_token ?? null;
  const ctx: BlockCtx = useMemo(
    () => ({
      onAsk: (q, symbol) => void ask(q, symbol),
      onIntent: (intent: Intent, params) =>
        runIntent(intent, params, { token, userId: user?.id ?? null, navigate: (p) => router.push(p), ask: (q, s) => void ask(q, s) }),
      allowed: ALLOWED,
    }),
    [ask, token, user?.id, router],
  );

  // Follow the answer as it streams, unless the reader has scrolled up to read.
  useEffect(() => {
    const el = threadRef.current;
    if (el && stickRef.current) el.scrollTop = el.scrollHeight;
  }, [turns]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      assistantStore.setOpen(false);
      return;
    }
    // In overlay mode the page behind is unreachable, so keep Tab inside the panel.
    if (overlay && e.key === 'Tab' && asideRef.current) {
      const f = Array.from(asideRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), input, select, a[href], [tabindex]:not([tabindex="-1"])'));
      if (f.length === 0) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  };

  if (!open) return null;

  const lastTurn = turns[turns.length - 1];
  const announce = busy ? 'Ziro is answering' : lastTurn?.done && lastTurn.answer ? 'Answer ready' : '';

  return (
    <aside
      ref={asideRef}
      aria-label="Ask Ziro"
      role={overlay ? 'dialog' : 'complementary'}
      aria-modal={overlay ? true : undefined}
      onKeyDown={onKeyDown}
      className="zw-assistant"
      style={{
        width: 'var(--panel-w)', flexShrink: 0, borderLeft: '1px solid var(--line)',
        display: 'flex', flexDirection: 'column', height: '100dvh', position: 'sticky', top: 0,
        background: 'var(--surface)',
      }}
    >
      <AssistantStyles />

      <header className="zw-ask-head" style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-2)', padding: 'var(--s-3)', borderBottom: '1px solid var(--line)' }}>
        <h2 className="zw-section" style={{ flex: 1 }}>Ask Ziro</h2>
        {turns.length > 0 && (
          <button type="button" className="zw-chip" onClick={() => { abortRef.current?.abort(); abortRef.current = null; assistantStore.clear(); setBusy(false); }}>
            New chat
          </button>
        )}
        <button type="button" className="zw-chip" onClick={() => assistantStore.setOpen(false)} aria-label="Close the assistant">Close</button>
      </header>

      <p role="status" aria-live="polite" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>{announce}</p>

      <div
        ref={threadRef}
        role="log"
        aria-live="off"
        aria-busy={busy}
        aria-label="Conversation"
        onScroll={(e) => {
          const el = e.currentTarget;
          stickRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
        }}
        className="zw-ask-thread"
        style={{ flex: 1, overflowY: 'auto', padding: 'var(--s-3)', display: 'flex', flexDirection: 'column', gap: 'var(--s-5, 20px)' }}
      >
        {turns.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-2)' }}>
            <p className="zw-sub">Ask about a stock, a sector or the day&rsquo;s move.</p>
            {['Why did Nifty fall today?', 'How is RELIANCE doing?', 'Which sector led today?', 'Compare TCS and INFY'].map((s) => (
              <button key={s} type="button" className="zw-chip" style={{ textAlign: 'left', height: 'auto', padding: '7px 9px' }} onClick={() => void ask(s)}>
                {s}
              </button>
            ))}
          </div>
        )}

        {turns.map((turn, i) => (
          <TurnView key={i} turn={turn} ctx={ctx} onClarify={(symbol) => void ask(turn.question, symbol)} />
        ))}
      </div>

      <form
        className="zw-ask-form"
        onSubmit={(e) => { e.preventDefault(); void ask(question); }}
        style={{ display: 'flex', gap: 'var(--s-2)', padding: 'var(--s-3)', borderTop: '1px solid var(--line)' }}
      >
        <input
          ref={inputRef}
          className="zw-ask-input"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask about the market…"
          aria-label="Your question"
          maxLength={500}
          enterKeyHint="send"
          style={{
            flex: 1, minWidth: 0, height: 34, padding: '0 8px', background: 'transparent',
            border: '1px solid var(--line-strong)', borderRadius: 'var(--r-ctl)',
          }}
        />
        {busy ? (
          <button type="button" className="zw-chip" aria-label="Stop answering" onClick={() => abortRef.current?.abort()}>Stop</button>
        ) : (
          <button type="submit" className="zw-chip" aria-label="Send question" disabled={!question.trim()}>Send</button>
        )}
      </form>

      <style>{`
        .zw-ask-input { font-size: 13px; }
        @media (max-width: 1279px) {
          /* Below this there is no room to push, so it covers instead. */
          .zw-assistant {
            position: fixed !important;
            inset: 0 !important;
            width: 100% !important;
            z-index: 150;
          }
          /* Hold the conversation to a readable column on tablets and small laptops. */
          .zw-ask-head, .zw-ask-thread, .zw-ask-form {
            padding-left: max(var(--s-3), calc((100% - 680px) / 2)) !important;
            padding-right: max(var(--s-3), calc((100% - 680px) / 2)) !important;
          }
          .zw-ask-head { padding-top: max(var(--s-3), env(safe-area-inset-top)) !important; }
          .zw-ask-form { padding-bottom: max(var(--s-3), env(safe-area-inset-bottom)) !important; }
          /* 16px stops iOS Safari zooming the page when the field is focused. */
          .zw-ask-input { font-size: 16px; height: 40px !important; }
        }
      `}</style>
    </aside>
  );
}

function TurnView({ turn, ctx, onClarify }: { turn: Turn; ctx: BlockCtx; onClarify: (symbol: string) => void }) {
  // A `stat` widget repeats the price line already shown above the answer.
  const blocks = turn.price ? turn.blocks.filter((b) => b.type !== 'stat') : turn.blocks;
  const toolLabel = turn.tool ? TOOL_LABEL[turn.tool] ?? 'Working' : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <p style={{ fontSize: 13, fontWeight: 600 }}>{turn.question}</p>

      {turn.price && (
        <p className="zw-sub zw-num">
          {turn.price.symbol} {num(turn.price.price, 2)}{' '}
          <span style={{ color: turn.price.changePct >= 0 ? 'var(--up)' : 'var(--down)' }}>
            {pct(turn.price.changePct)}
          </span>
        </p>
      )}

      {toolLabel && <p className="zw-sub" style={{ color: 'var(--ink-3)' }}>{toolLabel}…</p>}

      {turn.clarify && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <p className="zw-sub">Which one did you mean?</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {turn.clarify.map((c) => (
              <button key={c.symbol} type="button" className="zw-chip" onClick={() => onClarify(c.symbol)}>
                {c.name ? `${c.symbol} · ${c.name}` : c.symbol}
              </button>
            ))}
          </div>
        </div>
      )}

      {turn.answer && (
        <p className="zw-ab-prose">
          <AnswerBody text={turn.answer} />
        </p>
      )}

      {blocks.map((b, i) => (
        <BlockView key={str(b.id) || i} block={b} ctx={ctx} />
      ))}

      <References items={turn.references} />

      {turn.error && (
        <p className="zw-sub" role="alert" style={{ color: 'var(--down)' }}>{turn.error}</p>
      )}

      {/* Generated text sitting beside exchange data must never be
          mistaken for it. */}
      {turn.done && turn.answer && (
        <p className="zw-sub" style={{ color: 'var(--ink-3)' }}>AI generated · check before acting on it</p>
      )}
    </div>
  );
}
