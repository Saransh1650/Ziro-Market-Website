'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { assistantStore, hydrateAssistantStore, useAssistantState } from '@/lib/assistant/store';
import { useAsk } from '@/lib/assistant/useAsk';
import { AssistantStyles } from './assistant/styles';
import { TurnView } from './assistant/TurnView';

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

const OVERLAY_QUERY = '(max-width: 1279px)';

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
  const pathname = usePathname();
  const { open: wantOpen, turns } = useAssistantState();
  const { ask, busy, stop, reset, ctx } = useAsk();
  const overlay = useOverlayMode();
  // The full workspace replaces the panel; the panel would only duplicate it.
  const open = wantOpen && !pathname.startsWith('/app/ask');

  const [question, setQuestion] = useState('');
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

  // Move focus into the panel when it opens, and back to where it came from when it closes.
  useEffect(() => {
    if (!open) return;
    returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    inputRef.current?.focus();
    return () => returnFocusRef.current?.focus?.();
  }, [open]);

  const send = (text: string, symbol?: string) => {
    if (!text.trim()) return;
    setQuestion('');
    stickRef.current = true;
    void ask(text, symbol);
  };

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
          <button type="button" className="zw-chip" onClick={reset}>
            New chat
          </button>
        )}
        <Link href="/app/ask" className="zw-chip" onClick={() => assistantStore.setOpen(false)} aria-label="Open Ziro full screen">Expand</Link>
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
              <button key={s} type="button" className="zw-chip" style={{ textAlign: 'left', height: 'auto', padding: '7px 9px' }} onClick={() => send(s)}>
                {s}
              </button>
            ))}
          </div>
        )}

        {turns.map((turn, i) => (
          <TurnView key={i} turn={turn} ctx={ctx} onClarify={(symbol) => send(turn.question, symbol)} />
        ))}
      </div>

      <form
        className="zw-ask-form"
        onSubmit={(e) => { e.preventDefault(); send(question); }}
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
          <button type="button" className="zw-chip" aria-label="Stop answering" onClick={stop}>Stop</button>
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
