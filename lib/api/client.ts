/**
 * The only way the product talks to the backend.
 *
 * Every call goes through the `/api/backend/:path*` rewrite in
 * next.config.ts. That is not a convenience — the backend answers on
 * plain HTTP at a bare IP, so a browser on an HTTPS page cannot reach it
 * directly at all. Routing through Next also keeps the origin out of the
 * client bundle and sidesteps CORS.
 */

const BASE_PATH = '/api/backend';
const DEFAULT_TIMEOUT = 12_000;

/**
 * A failed call is a value to render an error state from, not an
 * exception to catch at some distant boundary. Every caller handles both
 * arms, and the type system makes sure of it.
 */
export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: ApiError };

export interface ApiError {
  kind: 'network' | 'timeout' | 'http' | 'parse';
  status?: number;
  /** Safe to show a user. Says what happened, never apologises. */
  message: string;
}

/**
 * Where a request actually goes, which differs by environment.
 *
 * **Browser** → the relative `/api/backend/*` rewrite. It has to: the page
 * is HTTPS and the backend is plain HTTP on a bare IP, so a direct call
 * is blocked as mixed content. The rewrite also keeps the origin out of
 * the client bundle and sidesteps CORS.
 *
 * **Server** (RSC, route handlers, `next build`) → the backend directly.
 * None of those problems exist server-side, and the extra hop through
 * our own rewrite would be pure latency.
 *
 * The server path must never guess an origin for itself. An earlier
 * version fell back to `http://localhost:3000`, and during a build that
 * reached an unrelated app someone had running on that port, which
 * answered 404 — silently prerendering every stock page as "gone".
 */
function resolve(path: string): string {
  if (typeof window !== 'undefined') return `${BASE_PATH}${path}`;

  const backend = process.env.BACKEND_URL ?? 'http://52.90.228.120:3000';
  return `${backend}/api${path}`;
}

interface RequestOptions {
  signal?: AbortSignal;
  timeout?: number;
  /** Seconds. Server-side only; ignored in the browser. */
  revalidate?: number;
  token?: string;
  retries?: number;
}

async function request<T>(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  path: string,
  body?: unknown,
  opts: RequestOptions = {},
): Promise<ApiResult<T>> {
  const { timeout = DEFAULT_TIMEOUT, retries = method === 'GET' ? 1 : 0 } = opts;

  // One controller per attempt, chained to the caller's signal so an
  // unmount aborts whichever attempt is in flight.
  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    const onAbort = () => controller.abort();
    opts.signal?.addEventListener('abort', onAbort);

    try {
      const res = await fetch(resolve(path), {
        method,
        signal: controller.signal,
        headers: {
          accept: 'application/json',
          ...(body ? { 'content-type': 'application/json' } : {}),
          ...(opts.token ? { authorization: `Bearer ${opts.token}` } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
        ...(opts.revalidate != null ? { next: { revalidate: opts.revalidate } } : {}),
      });

      if (!res.ok) {
        // 5xx is worth one more try; 4xx will fail identically.
        if (res.status >= 500 && attempt < retries) {
          await sleep(300 * 2 ** attempt);
          continue;
        }
        return {
          ok: false,
          error: {
            kind: 'http',
            status: res.status,
            message:
              res.status === 404
                ? 'Not found.'
                : res.status >= 500
                  ? 'The market data service is not responding.'
                  : 'That request was rejected.',
          },
        };
      }

      try {
        return { ok: true, data: (await res.json()) as T };
      } catch {
        return { ok: false, error: { kind: 'parse', message: 'The response could not be read.' } };
      }
    } catch (err) {
      const aborted = err instanceof Error && err.name === 'AbortError';

      // A caller-initiated abort is not a failure to report — the
      // component asking for the data is already gone.
      if (aborted && opts.signal?.aborted) {
        return { ok: false, error: { kind: 'timeout', message: 'Cancelled.' } };
      }
      if (attempt < retries) {
        await sleep(300 * 2 ** attempt);
        continue;
      }
      return {
        ok: false,
        error: aborted
          ? { kind: 'timeout', message: 'The request took too long.' }
          : { kind: 'network', message: 'No connection to the market data service.' },
      };
    } finally {
      clearTimeout(timer);
      opts.signal?.removeEventListener('abort', onAbort);
    }
  }

  return { ok: false, error: { kind: 'network', message: 'No connection to the market data service.' } };
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const apiGet = <T>(path: string, opts?: RequestOptions) =>
  request<T>('GET', path, undefined, opts);

export const apiPost = <T>(path: string, body?: unknown, opts?: RequestOptions) =>
  request<T>('POST', path, body, opts);

export const apiPut = <T>(path: string, body?: unknown, opts?: RequestOptions) =>
  request<T>('PUT', path, body, opts);

export const apiPatch = <T>(path: string, body?: unknown, opts?: RequestOptions) =>
  request<T>('PATCH', path, body, opts);

export const apiDelete = <T>(path: string, opts?: RequestOptions) =>
  request<T>('DELETE', path, undefined, opts);

/** Unwrap with a fallback, for surfaces that degrade rather than error. */
export function or<T>(result: ApiResult<T>, fallback: T): T {
  return result.ok ? result.data : fallback;
}

/**
 * Unwrap the backend's response envelope.
 *
 * The backend is not consistent about this, so the check has to be
 * tolerant of all three shapes it actually returns:
 *
 * - `{ success: true, data }`  — most routes
 * - `{ data }`                 — /etfs, /mutual-funds (no success field)
 * - `{ results }`              — /search (handled separately)
 *
 * Only an explicit `success: false` counts as a failure. Requiring
 * `success === true` silently turned every ETF and fund response into an
 * error state and rendered an empty table.
 */
export function unwrapEnvelope<T>(
  result: ApiResult<{ success?: boolean; data?: T; error?: string }>,
): ApiResult<T> {
  if (!result.ok) return result;

  const body = result.data;
  if (body?.success === false) {
    return { ok: false, error: { kind: 'http', message: body.error ?? 'The service returned no data.' } };
  }
  if (body?.data === undefined) {
    return { ok: false, error: { kind: 'parse', message: 'The response was missing its data.' } };
  }
  return { ok: true, data: body.data };
}

/**
 * Unwrap an envelope that names its payload instead of calling it
 * `data` — `{ success, holdings }`, `{ success, orders }`.
 *
 * The portfolio and paper-trade routes do this. A fourth envelope shape
 * in one backend, so the client absorbs the inconsistency rather than
 * letting it leak into every surface.
 */
export function unwrapKey<T>(
  result: ApiResult<Record<string, unknown>>,
  key: string,
  fallback?: T,
): ApiResult<T> {
  if (!result.ok) return result;

  const body = result.data;
  if (body?.success === false) {
    return {
      ok: false,
      error: { kind: 'http', message: String(body.error ?? 'The service returned no data.') },
    };
  }

  const value = body?.[key];
  if (value === undefined) {
    if (fallback !== undefined) return { ok: true, data: fallback };
    return { ok: false, error: { kind: 'parse', message: 'The response was missing its data.' } };
  }
  return { ok: true, data: value as T };
}

/** Whole-body unwrap, for `{ success, ...fields }` responses. */
export function unwrapBody<T>(result: ApiResult<Record<string, unknown>>): ApiResult<T> {
  if (!result.ok) return result;
  const body = result.data;
  if (body?.success === false) {
    return {
      ok: false,
      error: { kind: 'http', message: String(body.error ?? 'The service returned no data.') },
    };
  }
  return { ok: true, data: body as T };
}
