import { beforeEach, describe, expect, it, vi } from 'vitest';
import { assistantStore, hydrateAssistantStore } from './store';
import type { Turn } from './types';

const turn = (q: string, extra: Partial<Turn> = {}): Turn => ({
  question: q, answer: '', done: true, blocks: [], references: [], ...extra,
});

describe('assistant store', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    window.sessionStorage.clear();
    assistantStore._reset();
  });

  it('keeps turns and session across a simulated unmount (module state)', () => {
    assistantStore.addTurn(turn('why did it fall?'));
    assistantStore.setSession(42);
    expect(assistantStore.getState().turns).toHaveLength(1);
    expect(assistantStore.getState().sessionId).toBe(42);
  });

  it('patchLast updates only the newest turn', () => {
    assistantStore.addTurn(turn('a'));
    assistantStore.addTurn(turn('b'));
    assistantStore.patchLast((t) => ({ ...t, answer: 'done' }));
    expect(assistantStore.getState().turns.map((t) => t.answer)).toEqual(['', 'done']);
  });

  it('persists to sessionStorage and restores after a refresh', () => {
    hydrateAssistantStore();
    assistantStore.addTurn(turn('q1', { answer: 'A1', blocks: [{ type: 'notice', tone: 'info', text: 'x' }] }));
    assistantStore.setOpen(true);
    vi.advanceTimersByTime(300);

    assistantStore._reset();
    hydrateAssistantStore();
    const s = assistantStore.getState();
    expect(s.open).toBe(true);
    expect(s.turns[0].question).toBe('q1');
    expect(s.turns[0].blocks).toHaveLength(1);
  });

  it('never trusts stored data: junk is dropped, unfinished turns are closed, unsafe references removed', () => {
    window.sessionStorage.setItem('zw:assistant:v1', JSON.stringify({
      open: 'yes',
      sessionId: 'nope',
      turns: [
        'garbage',
        { question: '', answer: 'no question' },
        { question: 'ok', answer: 'a', done: false, blocks: ['x', { type: 'table' }], references: [{ title: 't', url: 'javascript:alert(1)' }, { title: 'g', url: 'https://example.com' }] },
      ],
    }));
    hydrateAssistantStore();
    const s = assistantStore.getState();
    expect(s.open).toBe(false);
    expect(s.sessionId).toBeNull();
    expect(s.turns).toHaveLength(1);
    expect(s.turns[0].done).toBe(true);
    expect(s.turns[0].blocks).toEqual([{ type: 'table' }]);
    expect(s.turns[0].references).toEqual([{ title: 'g', url: 'https://example.com' }]);
  });

  it('survives corrupt JSON', () => {
    window.sessionStorage.setItem('zw:assistant:v1', '{not json');
    expect(() => hydrateAssistantStore()).not.toThrow();
    expect(assistantStore.getState().turns).toEqual([]);
  });
});
