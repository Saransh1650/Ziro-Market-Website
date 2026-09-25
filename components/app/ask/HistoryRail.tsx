'use client';

import { useEffect, useState } from 'react';
import { assistantStore, useAssistantState } from '@/lib/assistant/store';
import { getSessions, getSessionTurns, type SessionSummary } from '@/lib/api/assistantHome';
import type { Turn } from '@/lib/assistant/types';

/** Pairs saved messages back into turns. Widgets are not stored, so a resumed chat shows text only. */
function toTurns(messages: { role: string; content: string }[]): Turn[] {
  const turns: Turn[] = [];
  for (const m of messages) {
    if (m.role === 'user') turns.push({ question: m.content, answer: '', done: true, blocks: [], references: [] });
    else if (turns.length) turns[turns.length - 1].answer = m.content;
  }
  return turns;
}

export function HistoryRail({ token, userId, onNew }: { token: string; userId: string; onNew: () => void }) {
  const { sessionId, turns } = useAssistantState();
  const [sessions, setSessions] = useState<SessionSummary[]>([]);

  // Refetch when a chat is created or a turn finishes, so the list is never a turn behind.
  const settled = turns.filter((t) => t.done).length;
  useEffect(() => {
    const controller = new AbortController();
    void getSessions(token, userId, controller.signal).then((r) => { if (r.ok && !controller.signal.aborted) setSessions(r.data); });
    return () => controller.abort();
  }, [token, userId, sessionId, settled]);

  const resume = async (id: number) => {
    const r = await getSessionTurns(id, token);
    if (r.ok) assistantStore.load(toTurns(r.data), id);
  };

  return (
    <nav className="zk-history" aria-label="Your chats">
      <button type="button" className="zk-new" onClick={onNew}>+ New chat</button>
      <ul>
        {sessions.map((s) => (
          <li key={s.id}>
            <button type="button" className="zk-session" aria-current={s.id === sessionId ? 'true' : undefined} onClick={() => void resume(s.id)}>
              {s.title}
            </button>
          </li>
        ))}
      </ul>
      {sessions.length === 0 && <p className="zk-quiet">Your chats will show up here.</p>}
    </nav>
  );
}
