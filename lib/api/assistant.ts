/**
 * Ask Ziro. Mirrors `src/routes/assistant.ts`.
 *
 * `/ask` answers as a Server-Sent Events stream, not JSON, so it is
 * consumed with `fetch` + a reader rather than the shared API client.
 * `EventSource` cannot be used: it only issues GET, and this is a POST.
 */
import { SUPPORTED_BLOCKS, SUPPORTED_INTENTS } from '@/lib/assistant/types';

export type AssistantEvent =
  | { type: 'meta'; sessionId: number; symbol: string | null; category: string; cached: boolean }
  | { type: 'price'; symbol: string; price: number; changePct: number; prevClose: number }
  | { type: 'clarify'; query: string; candidates: { symbol: string; name: string }[]; question: string }
  | { type: 'tool_start'; name: string }
  | { type: 'tool_done'; name: string }
  | { type: 'token'; text: string }
  | { type: 'final'; answer?: unknown; blocks?: unknown; references?: unknown }
  | { type: 'usage' }
  | { type: 'error'; message: string };

/**
 * Frames are separated by a blank line and can straddle chunks, so anything
 * after the last separator stays buffered. CRLF is normalised first — a proxy
 * in front of the backend may rewrite line endings.
 */
export async function consumeSse(
  body: ReadableStream<Uint8Array>,
  onEvent: (event: AssistantEvent) => void,
): Promise<void> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  const dispatch = (frame: string) => {
    let name = 'message';
    const dataLines: string[] = [];
    for (const line of frame.split('\n')) {
      if (line.startsWith('event:')) name = line.slice(6).trim();
      else if (line.startsWith('data:')) dataLines.push(line.slice(5).trim());
    }
    if (dataLines.length === 0) return;
    try {
      const data = JSON.parse(dataLines.join('\n'));
      // The event name goes last so a payload field called `type` cannot rename the event.
      if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
        onEvent({ ...data, type: name } as AssistantEvent);
      }
    } catch {
      // A malformed frame is skipped rather than killing the stream.
    }
  };

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true }).replace(/\r\n/g, '\n');
    const frames = buffer.split('\n\n');
    buffer = frames.pop() ?? '';
    frames.forEach(dispatch);
  }
  // A final frame the server closed without a trailing blank line.
  buffer += decoder.decode().replace(/\r\n/g, '\n');
  if (buffer.trim()) dispatch(buffer);
}

export async function askAssistant(
  body: { question: string; symbol?: string; userId?: string; sessionId?: number | null },
  onEvent: (event: AssistantEvent) => void,
  signal?: AbortSignal,
  /** Signed-in users send their token so the server can personalise; guests omit it. */
  token?: string,
): Promise<void> {
  const response = await fetch('/api/backend/assistant/ask', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      accept: 'text/event-stream',
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      ...body,
      // Capability negotiation: the server only sends widgets and actions this build can draw.
      client: { platform: 'web', blocks: SUPPORTED_BLOCKS, intents: SUPPORTED_INTENTS },
    }),
    signal,
  });

  if (!response.ok || !response.body) {
    // The limiter answers 429 with a JSON reason; keep it instead of a generic failure.
    let reason = '';
    try {
      const j = await response.json();
      reason = typeof j?.error === 'string' ? j.error : '';
    } catch {
      /* not JSON */
    }
    onEvent({ type: 'error', message: response.status === 429 ? reason || 'rate limited' : reason || 'The assistant is not responding.' });
    return;
  }

  await consumeSse(response.body, onEvent);
}
