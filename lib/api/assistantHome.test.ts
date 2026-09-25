import { describe, expect, it } from 'vitest';
import { parseHome } from './assistantHome';
import { validAction } from '@/lib/assistant/types';

const ALLOWED = new Set(['profile.set', 'navigate.page', 'watchlist.remove', 'ask.followup']);

describe('parseHome', () => {
  it('survives junk without throwing', () => {
    const h = parseHome({ insights: [null, 3, { id: '', title: '' }], starters: [1, 'a'], interview: { key: 'risk', options: [] } });
    expect(h.insights).toEqual([]);
    expect(h.interview).toBeNull();
    expect(h.profile.interests).toEqual([]);
    expect(parseHome('nope').starters).toEqual([]);
  });

  it('keeps a valid insight with its actions and an interview with options', () => {
    const h = parseHome({
      profile: { risk: 'low', interests: ['IT'] },
      insights: [{ id: 'i1', tone: 'down', title: 'TCS −3%', body: 'b', actions: [{ id: 'a1', label: 'Why?', intent: 'ask.followup', params: { q: 'x' } }] }],
      interview: { key: 'risk', question: 'q', options: [{ label: 'Steady', value: 'low' }] },
    });
    expect(h.insights[0].tone).toBe('down');
    expect(h.insights[0].actions[0].intent).toBe('ask.followup');
    expect(h.interview?.options).toHaveLength(1);
    expect(h.profile.risk).toBe('low');
  });
});

describe('new intents validate', () => {
  it('accepts known pages and profile keys, rejects others', () => {
    expect(validAction({ intent: 'navigate.page', params: { page: 'portfolio' } }, ALLOWED)).toBe(true);
    expect(validAction({ intent: 'navigate.page', params: { page: 'https://evil.test' } }, ALLOWED)).toBe(false);
    expect(validAction({ intent: 'profile.set', params: { key: 'risk', value: 'low' } }, ALLOWED)).toBe(true);
    expect(validAction({ intent: 'profile.set', params: { key: 'admin', value: 'x' } }, ALLOWED)).toBe(false);
    expect(validAction({ intent: 'watchlist.remove', params: { symbol: 'TCS' } }, ALLOWED)).toBe(true);
    expect(validAction({ intent: 'watchlist.remove', params: { symbol: '<b>' } }, ALLOWED)).toBe(false);
  });
});
