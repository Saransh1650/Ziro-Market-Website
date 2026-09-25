'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/app/AuthProvider';
import { askAssistant, type AssistantEvent } from '@/lib/api/assistant';
import { assistantStore } from './store';
import { SUPPORTED_INTENTS, parseBlocks, parseReferences, str } from './types';
import type { Intent, Turn } from './types';
import { runIntent } from '@/components/app/assistant/intents';
import type { BlockCtx } from '@/components/app/assistant/blocks/Cards';

const ALLOWED = new Set<string>(SUPPORTED_INTENTS);

/**
 * The backend's error strings are internal ("assistant failed"), which
 * tells a reader nothing about what happened or what to do. Translate
 * the ones we know; pass anything else through rather than inventing a
 * cause.
 */
export function humanError(message: string): string {
  if (/too many|rate|limit|429/i.test(message)) {
    return 'Too many questions in a short window. Give it a minute.';
  }
  if (/assistant failed|internal|timeout/i.test(message)) {
    return 'Ziro could not answer that just now. The live price above is still current — try again in a moment.';
  }
  return message;
}

/**
 * One conversation engine shared by the docked panel and the /app/ask
 * workspace, so both read and write the same store and a chat started in
 * one continues in the other.
 */
export function useAsk() {
  const { user, session } = useAuth();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  const ask = useCallback(async (text: string, symbol?: string) => {
    const q = text.trim();
    if (!q || busy) return;

    setBusy(true);
    assistantStore.addTurn({ question: q, answer: '', done: false, blocks: [], references: [] });

    const controller = new AbortController();
    abortRef.current = controller;
    const patch = (fn: (t: Turn) => Turn) => assistantStore.patchLast(fn);

    await askAssistant(
      { question: q, symbol, userId: user?.id, sessionId: assistantStore.getState().sessionId },
      (event: AssistantEvent) => {
        switch (event.type) {
          case 'meta': assistantStore.setSession(event.sessionId); break;
          case 'price': patch((t) => ({ ...t, price: { symbol: event.symbol, price: event.price, changePct: event.changePct } })); break;
          case 'clarify': patch((t) => ({ ...t, clarify: event.candidates, done: true })); break;
          case 'tool_start': patch((t) => ({ ...t, tool: event.name })); break;
          case 'tool_done': patch((t) => ({ ...t, tool: null })); break;
          case 'token': patch((t) => ({ ...t, answer: t.answer + event.text })); break;
          case 'final':
            // `final.answer` is the finished text with stock links added, so it replaces the streamed draft.
            patch((t) => ({
              ...t, answer: str(event.answer) || t.answer, blocks: parseBlocks(event.blocks),
              references: parseReferences(event.references), done: true, tool: null,
            }));
            break;
          case 'error': patch((t) => ({ ...t, error: humanError(event.message), done: true, tool: null })); break;
        }
      },
      controller.signal,
      session?.access_token,
    ).catch((e: unknown) => {
      if (e instanceof DOMException && e.name === 'AbortError') return;
      patch((t) => ({ ...t, error: 'The assistant stopped responding.', done: true }));
    });

    // "New chat" replaces the controller; a superseded request must not touch the new conversation.
    if (abortRef.current !== controller) return;
    setBusy(false);
    patch((t) => ({ ...t, done: true, tool: null }));
  }, [busy, user?.id, session?.access_token]);

  const stop = useCallback(() => abortRef.current?.abort(), []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    assistantStore.clear();
    setBusy(false);
  }, []);

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

  return { ask, busy, stop, reset, ctx, token, user };
}
