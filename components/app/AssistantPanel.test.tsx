import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { AssistantEvent } from '@/lib/api/assistant';
import { assistantStore } from '@/lib/assistant/store';

const push = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));
vi.mock('./AuthProvider', () => ({ useAuth: () => ({ user: null, session: null, loading: false }) }));
vi.mock('@/lib/api/stocks', () => ({ getStockChart: vi.fn(async () => ({ ok: true, data: { ohlc: [] } })) }));

let script: (emit: (e: AssistantEvent) => void, body: Record<string, unknown>) => Promise<void> | void = () => {};
const askAssistant = vi.fn(async (body: Record<string, unknown>, emit: (e: AssistantEvent) => void) => script(emit, body));
vi.mock('@/lib/api/assistant', () => ({ askAssistant: (...a: [Record<string, unknown>, (e: AssistantEvent) => void]) => askAssistant(...a) }));

const { default: AssistantPanel } = await import('./AssistantPanel');

function setViewport(overlay: boolean) {
  window.matchMedia = ((q: string) => ({
    matches: overlay && q.includes('max-width'),
    media: q,
    addEventListener: () => {},
    removeEventListener: () => {},
  })) as unknown as typeof window.matchMedia;
}

const finalEvent: AssistantEvent = {
  type: 'final',
  answer: 'RELIANCE looks **fairly valued**; compare with [TCS](stock:TCS).',
  references: [{ title: 'Exchange filing', url: 'https://example.com/f' }, { title: 'bad', url: 'javascript:alert(1)' }],
  blocks: [
    { id: 'b1', type: 'table', v: 1, alt: 'RELIANCE fundamentals: PE 22.10', title: 'RELIANCE fundamentals', rows: [{ label: 'PE', value: '22.10' }] },
    { id: 'b2', type: 'holo_widget', v: 1, alt: 'A widget this build cannot draw' },
    { id: 'b3', type: 'suggestions', v: 1, alt: 's', items: [{ q: 'Any recent news on RELIANCE?', symbol: 'RELIANCE' }] },
  ],
};

beforeEach(() => {
  assistantStore._reset();
  window.sessionStorage.clear();
  assistantStore.setOpen(true);
  setViewport(false);
  push.mockClear();
  askAssistant.mockClear();
});
afterEach(() => vi.restoreAllMocks());

describe('AssistantPanel', () => {
  it('shows the finished answer with stock links, widgets, fallbacks and only https sources', async () => {
    script = (emit) => {
      emit({ type: 'meta', sessionId: 5, symbol: 'RELIANCE', category: 'fundamentals', cached: false });
      emit({ type: 'token', text: 'RELIANCE looks fairly valued.' });
      emit(finalEvent);
    };
    render(<AssistantPanel />);
    await userEvent.type(screen.getByLabelText('Your question'), 'How is RELIANCE?');
    await userEvent.click(screen.getByRole('button', { name: 'Send question' }));

    expect(await screen.findByText('fairly valued')).toBeTruthy();
    // the final (linkified) text replaced the streamed draft
    const link = screen.getByRole('link', { name: 'TCS' });
    expect(link.getAttribute('href')).toBe('/stocks/TCS');
    expect(screen.getByText('RELIANCE fundamentals')).toBeTruthy();
    expect(screen.getByText('A widget this build cannot draw')).toBeTruthy();
    const refs = screen.getByRole('navigation', { name: 'Sources' });
    expect(refs.querySelectorAll('a')).toHaveLength(1);
    expect(assistantStore.getState().sessionId).toBe(5);
  });

  it('a follow-up chip asks its question', async () => {
    script = (emit, body) => {
      if (body.question === 'Any recent news on RELIANCE?') emit({ type: 'final', answer: 'No major news.', blocks: [], references: [] });
      else emit(finalEvent);
    };
    render(<AssistantPanel />);
    await userEvent.type(screen.getByLabelText('Your question'), 'How is RELIANCE?');
    await userEvent.click(screen.getByRole('button', { name: 'Send question' }));
    await userEvent.click(await screen.findByRole('button', { name: 'Any recent news on RELIANCE?' }));
    expect(await screen.findByText('No major news.')).toBeTruthy();
    expect(askAssistant).toHaveBeenCalledTimes(2);
    expect(askAssistant.mock.calls[1][0]).toMatchObject({ question: 'Any recent news on RELIANCE?', symbol: 'RELIANCE' });
  });

  it('keeps the conversation when the panel unmounts and remounts (navigating to a stock page)', async () => {
    script = (emit) => emit(finalEvent);
    const first = render(<AssistantPanel />);
    await userEvent.type(screen.getByLabelText('Your question'), 'How is RELIANCE?');
    await userEvent.click(screen.getByRole('button', { name: 'Send question' }));
    await screen.findByText('fairly valued');
    first.unmount();

    render(<AssistantPanel />);
    expect(screen.getByText('How is RELIANCE?')).toBeTruthy();
    expect(screen.getByText('fairly valued')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'TCS' })).toBeTruthy();
  });

  it('translates errors instead of showing internals', async () => {
    script = (emit) => emit({ type: 'error', message: 'assistant failed' });
    render(<AssistantPanel />);
    await userEvent.type(screen.getByLabelText('Your question'), 'hi');
    await userEvent.click(screen.getByRole('button', { name: 'Send question' }));
    expect((await screen.findByRole('alert')).textContent).toMatch(/could not answer/i);
  });

  it('rate limiting gets its own message', async () => {
    script = (emit) => emit({ type: 'error', message: 'Too many questions — slow down a moment.' });
    render(<AssistantPanel />);
    await userEvent.type(screen.getByLabelText('Your question'), 'hi');
    await userEvent.click(screen.getByRole('button', { name: 'Send question' }));
    expect((await screen.findByRole('alert')).textContent).toMatch(/too many questions/i);
  });

  it('shows a readable activity label, never the raw tool name', async () => {
    let release!: () => void;
    script = async (emit) => {
      emit({ type: 'tool_start', name: 'get_fundamentals' });
      await new Promise<void>((r) => { release = r; });
      emit({ type: 'final', answer: 'ok', blocks: [], references: [] });
    };
    render(<AssistantPanel />);
    await userEvent.type(screen.getByLabelText('Your question'), 'pe?');
    await userEvent.click(screen.getByRole('button', { name: 'Send question' }));
    expect(await screen.findByText('Reading fundamentals…')).toBeTruthy();
    expect(screen.queryByText(/get_fundamentals/)).toBeNull();
    expect(screen.getByRole('button', { name: 'Stop answering' })).toBeTruthy();
    await act(async () => release());
    await waitFor(() => expect(screen.getByRole('button', { name: 'Send question' })).toBeTruthy());
  });

  it('narrow screens: dialog semantics, Escape closes', async () => {
    setViewport(true);
    render(<AssistantPanel />);
    expect(screen.getByRole('dialog', { name: 'Ask Ziro' })).toBeTruthy();
    await userEvent.keyboard('{Escape}');
    expect(assistantStore.getState().open).toBe(false);
  });

  it('wide screens: docked complementary region, not a modal', () => {
    render(<AssistantPanel />);
    expect(screen.getByRole('complementary', { name: 'Ask Ziro' })).toBeTruthy();
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('New chat clears the conversation', async () => {
    script = (emit) => emit(finalEvent);
    render(<AssistantPanel />);
    await userEvent.type(screen.getByLabelText('Your question'), 'How is RELIANCE?');
    await userEvent.click(screen.getByRole('button', { name: 'Send question' }));
    await screen.findByText('fairly valued');
    await userEvent.click(screen.getByRole('button', { name: 'New chat' }));
    expect(screen.queryByText('fairly valued')).toBeNull();
    expect(assistantStore.getState().turns).toHaveLength(0);
  });
});
