'use client';

import { useEffect, useRef, useState } from 'react';
import { hydrateAssistantStore, useAssistantState } from '@/lib/assistant/store';
import { useAsk } from '@/lib/assistant/useAsk';
import { useMedia } from '@/lib/assistant/useMedia';
import { useAuth } from '../AuthProvider';
import SignedOut from '../SignedOut';
import { AssistantStyles } from '../assistant/styles';
import { TurnView } from '../assistant/TurnView';
import { AskStyles } from './askStyles';
import { Canvas, CANVAS_TYPES } from './Canvas';
import { HistoryRail } from './HistoryRail';
import { Home } from './Home';
import { Interview } from './Interview';
import { useHome } from './useHome';

const CANVAS_QUERY = '(min-width: 1100px)';

function firstName(full: unknown): string | null {
  return typeof full === 'string' && full.trim() ? full.trim().split(/\s+/)[0] : null;
}

/**
 * The full-page Ziro workspace: chats on the left, the conversation in the
 * middle, and a canvas on the right for the charts and numbers behind an
 * answer. Before the first question it offers what Ziro noticed and asks
 * one getting-to-know-you question at a time, so nobody starts from a
 * blank prompt box.
 */
export default function AskWorkspace() {
  const { user, session, loading: authLoading } = useAuth();
  const { turns } = useAssistantState();
  const { ask, busy, stop, reset, ctx, token } = useAsk();
  const { home, loading } = useHome(token);
  const canvasVisible = useMedia(CANVAS_QUERY);
  const [question, setQuestion] = useState('');
  const [chatsOpen, setChatsOpen] = useState(false);
  const threadRef = useRef<HTMLDivElement>(null);

  useEffect(() => { hydrateAssistantStore(); }, []);
  useEffect(() => {
    const el = threadRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [turns]);

  if (!authLoading && !session) {
    return <SignedOut title="Meet Ziro" detail="Sign in and Ziro learns what you follow, tells you what moved, and helps you act on it." next="/app/ask" />;
  }

  const send = (text: string, symbol?: string) => {
    if (!text.trim() || busy) return;
    setQuestion('');
    void ask(text, symbol);
  };

  const last = turns[turns.length - 1];
  const hideVisuals = (i: number) => (t: string) => canvasVisible && i === turns.length - 1 && CANVAS_TYPES.has(t);
  const nudge = turns.length === 1 && last?.done && home?.interview;

  return (
    <div className="zk zw-ab" data-chats={chatsOpen ? 'open' : 'closed'}>
      <AskStyles />
      <AssistantStyles />
      {session && user && (
        <HistoryRail token={session.access_token} userId={user.id} onNew={() => { reset(); setChatsOpen(false); }} />
      )}

      <section className="zk-main" aria-label="Ziro conversation">
        <button type="button" className="zw-chip zk-chats-toggle" aria-expanded={chatsOpen} onClick={() => setChatsOpen((o) => !o)}>Chats</button>
        <div ref={threadRef} className="zk-thread" role="log" aria-label="Conversation" aria-busy={busy}>
          {turns.length === 0 ? (
            <Home home={home} loading={loading} name={firstName(user?.user_metadata?.full_name ?? user?.user_metadata?.name)} ctx={ctx} onAsk={send} />
          ) : (
            <div className="zk-col">
              {turns.map((t, i) => (
                <TurnView key={i} turn={t} ctx={ctx} hideBlocks={hideVisuals(i)} onClarify={(s) => send(t.question, s)} />
              ))}
              {nudge && home.interview && <Interview key={home.interview.key} q={home.interview} ctx={ctx} />}
            </div>
          )}
        </div>

        <div className="zk-composer">
          <form onSubmit={(e) => { e.preventDefault(); send(question); }}>
            <input
              className="zk-input" value={question} onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask Ziro anything about the market…" aria-label="Your question" maxLength={500} enterKeyHint="send"
            />
            {busy
              ? <button type="button" className="zw-btn" onClick={stop}>Stop</button>
              : <button type="submit" className="zw-btn" disabled={!question.trim()}>Send</button>}
          </form>
        </div>
      </section>

      {canvasVisible && session && <Canvas turn={last} profile={home?.profile ?? null} token={session.access_token} ctx={ctx} />}
    </div>
  );
}
