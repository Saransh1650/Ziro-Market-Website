import { describe, expect, it, vi } from 'vitest';
import { consumeSse } from './assistant';
import type { AssistantEvent } from './assistant';

function stream(chunks: string[]): ReadableStream<Uint8Array> {
  const enc = new TextEncoder();
  return new ReadableStream({
    start(c) {
      chunks.forEach((s) => c.enqueue(enc.encode(s)));
      c.close();
    },
  });
}

async function run(chunks: string[]): Promise<AssistantEvent[]> {
  const out: AssistantEvent[] = [];
  await consumeSse(stream(chunks), (e) => out.push(e));
  return out;
}

describe('consumeSse', () => {
  it('parses frames split across chunks, even mid-line', async () => {
    const ev = await run(['event: token\ndata: {"te', 'xt":"Hel"}\n\nevent: token\ndata: {"text":"lo"}\n\n']);
    expect(ev).toEqual([{ type: 'token', text: 'Hel' }, { type: 'token', text: 'lo' }]);
  });

  it('handles CRLF line endings', async () => {
    const ev = await run(['event: meta\r\ndata: {"sessionId":7}\r\n\r\n']);
    expect(ev).toEqual([{ type: 'meta', sessionId: 7 }]);
  });

  it('a payload field named "type" cannot rename the event', async () => {
    const ev = await run(['event: final\ndata: {"type":"error","answer":"x"}\n\n']);
    expect(ev[0].type).toBe('final');
  });

  it('skips malformed and non-object frames and keeps going', async () => {
    const ev = await run(['event: token\ndata: {oops\n\n', 'event: token\ndata: "str"\n\n', ': keep-alive\n\n', 'event: token\ndata: {"text":"ok"}\n\n']);
    expect(ev).toEqual([{ type: 'token', text: 'ok' }]);
  });

  it('flushes a last frame that has no trailing blank line', async () => {
    const ev = await run(['event: final\ndata: {"answer":"done"}']);
    expect(ev).toEqual([{ type: 'final', answer: 'done' }]);
  });

  it('a multi-byte character split across chunks survives', async () => {
    const enc = new TextEncoder().encode('event: token\ndata: {"text":"₹"}\n\n');
    const cut = enc.indexOf(0xe2) + 1; // inside the 3-byte ₹
    const s = new ReadableStream<Uint8Array>({ start(c) { c.enqueue(enc.slice(0, cut)); c.enqueue(enc.slice(cut)); c.close(); } });
    const out: AssistantEvent[] = [];
    await consumeSse(s, (e) => out.push(e));
    expect(out).toEqual([{ type: 'token', text: '₹' }]);
  });
});

describe('askAssistant request', () => {
  const sse = (s: string) => new Response(new TextEncoder().encode(s), { status: 200, headers: { 'content-type': 'text/event-stream' } });

  it('advertises web capabilities so the server never sends widgets or actions this build cannot draw', async () => {
    const fetchMock = vi.fn(async () => sse('event: final\ndata: {"answer":"ok"}\n\n'));
    vi.stubGlobal('fetch', fetchMock);
    const { askAssistant } = await import('./assistant');
    const events: AssistantEvent[] = [];
    await askAssistant({ question: 'hi', symbol: 'TCS' }, (e) => events.push(e));
    const sent = JSON.parse((fetchMock.mock.calls[0] as unknown as [string, RequestInit])[1].body as string);
    expect(sent.client.platform).toBe('web');
    expect(sent.client.blocks.snapshot).toBe(1);
    expect(sent.client.intents).toEqual(['watchlist.add', 'alert.create', 'navigate.symbol', 'ask.followup']);
    expect(sent.question).toBe('hi');
    expect(events).toEqual([{ type: 'final', answer: 'ok' }]);
    vi.unstubAllGlobals();
  });

  it('keeps the server reason on a 429 instead of a generic failure', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ success: false, error: 'Too many questions — slow down a moment.' }), { status: 429 })));
    const { askAssistant } = await import('./assistant');
    const events: AssistantEvent[] = [];
    await askAssistant({ question: 'hi' }, (e) => events.push(e));
    expect(events).toEqual([{ type: 'error', message: 'Too many questions — slow down a moment.' }]);
    vi.unstubAllGlobals();
  });

  it('falls back to a plain message when the failure body is not JSON', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('<html>bad gateway</html>', { status: 502 })));
    const { askAssistant } = await import('./assistant');
    const events: AssistantEvent[] = [];
    await askAssistant({ question: 'hi' }, (e) => events.push(e));
    expect(events).toEqual([{ type: 'error', message: 'The assistant is not responding.' }]);
    vi.unstubAllGlobals();
  });
});
