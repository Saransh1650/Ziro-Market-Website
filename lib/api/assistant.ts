/**
 * Ask Ziro. Mirrors `src/routes/assistant.ts`.
 *
 * `/ask` answers as a Server-Sent Events stream, not JSON, so it is
 * consumed with `fetch` + a reader rather than the shared API client.
 * `EventSource` cannot be used: it only issues GET, and this is a POST.
 */

export type AssistantEvent =
  | { type: 'meta'; sessionId: number; symbol: string | null; category: string; cached: boolean }
  | { type: 'price'; symbol: string; price: number; changePct: number; prevClose: number }
  | { type: 'clarify'; query: string; candidates: { symbol: string; name: string }[]; question: string }
  | { type: 'tool_start'; name: string }
  | { type: 'tool_done'; name: string }
  | { type: 'token'; text: string }
  | { type: 'final'; [k: string]: unknown }
  | { type: 'error'; message: string };

export async function askAssistant(
  body: { question: string; symbol?: string; userId?: string; sessionId?: number | null },
  onEvent: (event: AssistantEvent) => void,
  signal?: AbortSignal,
): Promise<void> {
  const response = await fetch('/api/backend/assistant/ask', {
    method: 'POST',
    headers: { 'content-type': 'application/json', accept: 'text/event-stream' },
    body: JSON.stringify(body),
    signal,
  });

  if (!response.ok || !response.body) {
    onEvent({ type: 'error', message: 'The assistant is not responding.' });
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    // SSE frames are separated by a blank line. A frame can straddle two
    // chunks, so anything after the last separator stays in the buffer.
    const frames = buffer.split('\n\n');
    buffer = frames.pop() ?? '';

    for (const frame of frames) {
      let name = 'message';
      const dataLines: string[] = [];

      for (const line of frame.split('\n')) {
        if (line.startsWith('event:')) name = line.slice(6).trim();
        else if (line.startsWith('data:')) dataLines.push(line.slice(5).trim());
      }
      if (dataLines.length === 0) continue;

      try {
        onEvent({ type: name, ...JSON.parse(dataLines.join('\n')) } as AssistantEvent);
      } catch {
        // A malformed frame is skipped rather than killing the stream.
      }
    }
  }
}
