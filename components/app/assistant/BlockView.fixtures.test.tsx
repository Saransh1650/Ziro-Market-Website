import fs from 'node:fs';
import path from 'node:path';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { BlockView } from './BlockView';
import type { BlockCtx } from './blocks/Cards';
import { SUPPORTED_INTENTS } from '@/lib/assistant/types';

vi.mock('@/lib/api/stocks', () => {
  const ohlc = Array.from({ length: 160 }, (_, i) => {
    const close = 1300 - i * 0.6 + Math.sin(i / 4) * 6;
    return { time: new Date(Date.UTC(2026, 0, 1) + i * 86_400_000).toISOString(), open: close - 1, high: close + 3, low: close - 3, close, volume: 1_000_000 + i * 1000 };
  });
  return { getStockChart: vi.fn(async () => ({ ok: true, data: { ohlc, chartData: { dates: [], prices: [] } } })) };
});

const ROOT = path.join(__dirname, '..', '..', '..', 'lib', '__fixtures__', 'blocks');

interface Fixture {
  name: string;
  block: Record<string, unknown>;
  expect: {
    render: 'known' | 'fallback' | 'hidden';
    textContains?: string[];
    forbidText?: string[];
    forbidHref?: string[];
    visibleActions?: string[];
    showsDelayed?: boolean;
    skip?: string[];
  };
}

function load(dir: string): { file: string; fx: Fixture }[] {
  const out: { file: string; fx: Fixture }[] = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...load(p));
    else if (e.name.endsWith('.json')) out.push({ file: path.relative(ROOT, p), fx: JSON.parse(fs.readFileSync(p, 'utf8')) });
  }
  return out;
}

const ctx = (over: Partial<BlockCtx> = {}): BlockCtx => ({
  onAsk: vi.fn(),
  onIntent: vi.fn(async () => 'Done.'),
  allowed: new Set<string>(SUPPORTED_INTENTS),
  ...over,
});

describe('answer block fixtures (shared with Flutter + backend schema)', () => {
  const fixtures = load(ROOT);

  it('finds the fixture set', () => {
    expect(fixtures.length).toBeGreaterThanOrEqual(30);
  });

  for (const { file, fx } of fixtures) {
    if (fx.expect.skip?.includes('web')) continue;
    it(`${file} — ${fx.name}`, async () => {
      const { container } = render(<BlockView block={fx.block} ctx={ctx()} />);
      const e = fx.expect;
      // Charts fetch their candles; let the request settle before asserting.
      if (fx.block.type === 'tech_chart') await waitFor(() => expect(container.querySelector('svg')).toBeTruthy());
      const text = container.textContent ?? '';

      if (e.render === 'hidden') {
        expect(text.trim()).toBe('');
      } else {
        for (const t of e.textContains ?? []) expect(text).toContain(t);
      }
      for (const t of e.forbidText ?? []) expect(text).not.toContain(t);
      for (const h of e.forbidHref ?? []) {
        const hrefs = Array.from(container.querySelectorAll('a')).map((a) => a.getAttribute('href') ?? '');
        expect(hrefs.some((x) => x.toLowerCase().startsWith(h))).toBe(false);
      }
      if (e.visibleActions) {
        const labels = Array.from(container.querySelectorAll('button')).map((b) => b.textContent);
        expect(labels).toEqual(e.visibleActions);
      }
      if (e.showsDelayed) expect(text.toLowerCase()).toContain('delayed');
    });
  }
});

describe('BlockView behaviour', () => {
  it('isolates a block that throws while rendering — alt shown, siblings unaffected', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const bad = new Proxy({ type: 'table', v: 1, alt: 'RELIANCE fundamentals: PE 22.10' } as Record<string, unknown>, {
      get: (t, k) => {
        if (k === 'rows') throw new Error('boom');
        return t[k as string];
      },
    });
    render(
      <>
        <BlockView block={bad} ctx={ctx()} />
        <BlockView block={{ type: 'notice', v: 1, tone: 'info', text: 'sibling still renders' }} ctx={ctx()} />
      </>,
    );
    expect(screen.getByText('RELIANCE fundamentals: PE 22.10')).toBeTruthy();
    expect(screen.getByText('sibling still renders')).toBeTruthy();
    spy.mockRestore();
  });

  it('follow-up chip asks its question with the symbol', async () => {
    const c = ctx();
    render(<BlockView block={{ type: 'suggestions', v: 1, items: [{ q: 'Any recent news on TCS?', symbol: 'TCS' }] }} ctx={c} />);
    await userEvent.click(screen.getByRole('button', { name: 'Any recent news on TCS?' }));
    expect(c.onAsk).toHaveBeenCalledWith('Any recent news on TCS?', 'TCS');
  });

  it('watchlist action runs the intent and shows its status', async () => {
    const c = ctx({ onIntent: vi.fn(async () => 'Added RELIANCE to your watchlist.') });
    render(<BlockView block={{ type: 'actions', v: 1, items: [{ id: 'a1', label: 'Add to watchlist', intent: 'watchlist.add', params: { symbol: 'RELIANCE' } }] }} ctx={c} />);
    await userEvent.click(screen.getByRole('button', { name: 'Add to watchlist' }));
    expect(c.onIntent).toHaveBeenCalledWith('watchlist.add', { symbol: 'RELIANCE' });
    expect(await screen.findByRole('status')).toHaveTextContent('Added RELIANCE to your watchlist.');
  });

  it('price alert needs confirmation and passes the edited level', async () => {
    const c = ctx();
    render(<BlockView block={{ type: 'actions', v: 1, items: [{ id: 'a2', label: 'Set price alert', intent: 'alert.create', params: { symbol: 'RELIANCE', price: 1248 } }] }} ctx={c} />);
    await userEvent.click(screen.getByRole('button', { name: 'Set price alert' }));
    expect(c.onIntent).not.toHaveBeenCalled();
    const input = screen.getByLabelText('Target price in rupees');
    expect((input as HTMLInputElement).value).toBe('1248');
    fireEvent.change(input, { target: { value: '1300' } });
    fireEvent.change(screen.getByLabelText(/Alert when RELIANCE goes/), { target: { value: 'below' } });
    await userEvent.click(screen.getByRole('button', { name: 'Create alert' }));
    expect(c.onIntent).toHaveBeenCalledWith('alert.create', { symbol: 'RELIANCE', price: 1300, condition: 'below' });
  });

  it('a non-positive alert price cannot be submitted', async () => {
    const c = ctx();
    render(<BlockView block={{ type: 'actions', v: 1, items: [{ id: 'a2', label: 'Set price alert', intent: 'alert.create', params: { symbol: 'RELIANCE' } }] }} ctx={c} />);
    await userEvent.click(screen.getByRole('button', { name: 'Set price alert' }));
    fireEvent.change(screen.getByLabelText('Target price in rupees'), { target: { value: '-4' } });
    expect((screen.getByRole('button', { name: 'Create alert' }) as HTMLButtonElement).disabled).toBe(true);
  });

  it('actions whose intent this client did not advertise are hidden', () => {
    const c = ctx({ allowed: new Set(['ask.followup']) });
    const { container } = render(<BlockView block={{ type: 'actions', v: 1, items: [{ id: 'a1', label: 'Add to watchlist', intent: 'watchlist.add', params: { symbol: 'RELIANCE' } }] }} ctx={c} />);
    expect(container.textContent).toBe('');
  });
});
