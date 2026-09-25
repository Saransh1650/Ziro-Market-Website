import { beforeEach, describe, expect, it, vi } from 'vitest';

const getWatchlists = vi.fn();
const createWatchlist = vi.fn();
const addSymbol = vi.fn();
const createAlert = vi.fn();
vi.mock('@/lib/api/watchlist', () => ({ getWatchlists, createWatchlist, addSymbol }));
vi.mock('@/lib/api/alerts', () => ({ createAlert }));

const { runIntent } = await import('./intents');

const deps = () => ({ token: 't', userId: 'u1', navigate: vi.fn(), ask: vi.fn() });
const ok = <T,>(data: T) => ({ ok: true as const, data });
const fail = { ok: false as const, error: { message: 'x' } };

beforeEach(() => vi.clearAllMocks());

describe('runIntent', () => {
  it('watchlist.add without a session asks the reader to sign in and calls nothing', async () => {
    const d = { ...deps(), token: null };
    expect(await runIntent('watchlist.add', { symbol: 'TCS' }, d)).toMatch(/sign in/i);
    expect(getWatchlists).not.toHaveBeenCalled();
  });

  it('adds to the first list', async () => {
    getWatchlists.mockResolvedValue(ok([{ id: 'w1', name: 'Core', symbols: ['INFY'] }]));
    addSymbol.mockResolvedValue(ok({}));
    expect(await runIntent('watchlist.add', { symbol: 'TCS' }, deps())).toBe('Added TCS to Core.');
    expect(addSymbol).toHaveBeenCalledWith('w1', 'TCS', { token: 't' });
  });

  it('creates a list when the user has none', async () => {
    getWatchlists.mockResolvedValue(ok([]));
    createWatchlist.mockResolvedValue(ok({ id: 'w9', name: 'My Watchlist' }));
    addSymbol.mockResolvedValue(ok({}));
    expect(await runIntent('watchlist.add', { symbol: 'TCS' }, deps())).toBe('Added TCS to My Watchlist.');
  });

  it('does not add a duplicate', async () => {
    getWatchlists.mockResolvedValue(ok([{ id: 'w1', name: 'Core', symbols: ['TCS'] }]));
    expect(await runIntent('watchlist.add', { symbol: 'TCS' }, deps())).toBe('TCS is already in Core.');
    expect(addSymbol).not.toHaveBeenCalled();
  });

  it('turns API failures into a sentence, never a throw', async () => {
    getWatchlists.mockResolvedValue(fail);
    expect(await runIntent('watchlist.add', { symbol: 'TCS' }, deps())).toMatch(/could not/i);
  });

  it('alert.create passes the confirmed level and direction', async () => {
    createAlert.mockResolvedValue(ok({}));
    const msg = await runIntent('alert.create', { symbol: 'TCS', price: 3500, condition: 'below' }, deps());
    expect(createAlert).toHaveBeenCalledWith({ userId: 'u1', symbol: 'TCS', targetPrice: 3500, condition: 'below' });
    expect(msg).toContain('TCS below ₹3,500.00');
  });

  it('alert.create refuses a bad price and a signed-out user', async () => {
    expect(await runIntent('alert.create', { symbol: 'TCS', price: -1 }, deps())).toMatch(/valid/i);
    expect(await runIntent('alert.create', { symbol: 'TCS', price: 10 }, { ...deps(), userId: null })).toMatch(/sign in/i);
    expect(createAlert).not.toHaveBeenCalled();
  });

  it('navigate.symbol goes to the stock page; ask.followup asks', async () => {
    const d = deps();
    await runIntent('navigate.symbol', { symbol: 'M&M' }, d);
    expect(d.navigate).toHaveBeenCalledWith('/stocks/M%26M');
    await runIntent('ask.followup', { q: 'why?', symbol: 'TCS' }, d);
    expect(d.ask).toHaveBeenCalledWith('why?', 'TCS');
  });
});
