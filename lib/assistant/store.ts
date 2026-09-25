/**
 * Assistant conversation store.
 *
 * Stock links go to /stocks/[symbol], which lives OUTSIDE the layout that
 * mounts the panel — following one unmounts AssistantPanel and would wipe
 * local component state (turns, session id, open). A module-level store
 * survives client-side navigation, and sessionStorage carries it across a
 * refresh, so the conversation is still there when the reader comes back.
 *
 * External-store shape (useSyncExternalStore) with an empty server snapshot,
 * so nothing here can cause a hydration mismatch. Restored data is
 * re-validated: storage is user-controlled input.
 */
import { useSyncExternalStore } from 'react';
import { parseBlocks, parseReferences, isObj, str, numOf, type Turn } from './types';

interface State {
  open: boolean;
  turns: Turn[];
  sessionId: number | null;
}

const KEY = 'zw:assistant:v1';
const MAX_TURNS = 20;
const MAX_BYTES = 300_000;
const EMPTY: State = { open: false, turns: [], sessionId: null };

let state: State = EMPTY;
let hydrated = false;
let persistTimer: ReturnType<typeof setTimeout> | null = null;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
  schedulePersist();
}

function set(next: State) {
  state = next;
  emit();
}

function schedulePersist() {
  if (typeof window === 'undefined' || !hydrated) return;
  if (persistTimer) clearTimeout(persistTimer);
  persistTimer = setTimeout(() => {
    try {
      const payload = JSON.stringify({ ...state, turns: state.turns.slice(-MAX_TURNS) });
      if (payload.length <= MAX_BYTES) window.sessionStorage.setItem(KEY, payload);
    } catch {
      /* private mode / quota — the store still works in memory */
    }
  }, 250);
}

function restoreTurn(raw: unknown): Turn | null {
  if (!isObj(raw)) return null;
  const price = isObj(raw.price) ? raw.price : null;
  return {
    question: str(raw.question),
    answer: str(raw.answer),
    price: price && numOf(price.price) !== null
      ? { symbol: str(price.symbol), price: numOf(price.price) as number, changePct: numOf(price.changePct) ?? 0 }
      : undefined,
    error: raw.error ? str(raw.error) : undefined,
    // Anything still streaming when the page went away can never finish.
    done: true,
    tool: null,
    blocks: parseBlocks(raw.blocks),
    references: parseReferences(raw.references),
  };
}

/** Call once on the client (e.g. in an effect). Safe to call repeatedly. */
export function hydrateAssistantStore() {
  if (hydrated || typeof window === 'undefined') return;
  hydrated = true;
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (!raw) return;
    const parsed: unknown = JSON.parse(raw);
    if (!isObj(parsed)) return;
    const turns = (Array.isArray(parsed.turns) ? parsed.turns : [])
      .map(restoreTurn)
      .filter((t): t is Turn => t !== null && t.question.length > 0)
      .slice(-MAX_TURNS);
    state = { open: parsed.open === true, turns, sessionId: numOf(parsed.sessionId) };
    for (const l of listeners) l();
  } catch {
    /* corrupt storage is ignored */
  }
}

export const assistantStore = {
  getState: () => state,
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  },
  setOpen(open: boolean) { set({ ...state, open }); },
  toggle() { set({ ...state, open: !state.open }); },
  addTurn(turn: Turn) { set({ ...state, turns: [...state.turns, turn] }); },
  patchLast(fn: (t: Turn) => Turn) {
    if (state.turns.length === 0) return;
    const turns = state.turns.slice();
    turns[turns.length - 1] = fn(turns[turns.length - 1]);
    set({ ...state, turns });
  },
  setSession(sessionId: number | null) { set({ ...state, sessionId }); },
  clear() { set({ ...state, turns: [], sessionId: null }); },
  /** Test helper. */
  _reset() { hydrated = false; state = EMPTY; },
};

export function useAssistantState(): State {
  return useSyncExternalStore(assistantStore.subscribe, assistantStore.getState, () => EMPTY);
}
