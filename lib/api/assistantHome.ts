/** Ziro Companion endpoints. Mirrors `src/routes/assistantHome.ts`. */
import { apiDelete, apiGet, apiPut, unwrapEnvelope } from './client';
import { isObj, objs, str, strs, type ActionItem, type Intent } from '@/lib/assistant/types';

export interface Profile {
  experience: string | null;
  risk: string | null;
  horizon: string | null;
  interests: string[];
}

export interface Insight {
  id: string;
  tone: 'up' | 'down' | 'info';
  title: string;
  body: string;
  actions: ActionItem[];
}

export interface Interview {
  key: string;
  question: string;
  options: { label: string; value: string }[];
}

export interface Home {
  profile: Profile;
  insights: Insight[];
  starters: string[];
  interview: Interview | null;
}

const EMPTY_PROFILE: Profile = { experience: null, risk: null, horizon: null, interests: [] };

const orNull = (v: unknown) => (typeof v === 'string' && v ? v : null);

export function parseProfile(v: unknown): Profile {
  if (!isObj(v)) return EMPTY_PROFILE;
  return { experience: orNull(v.experience), risk: orNull(v.risk), horizon: orNull(v.horizon), interests: strs(v.interests) };
}

function parseInsight(r: Record<string, unknown>): Insight {
  const tone = r.tone === 'up' || r.tone === 'down' ? r.tone : 'info';
  return {
    id: str(r.id), tone, title: str(r.title), body: str(r.body),
    actions: objs(r.actions).map((a, i) => ({
      id: str(a.id) || `a${i}`, label: str(a.label), intent: str(a.intent) as Intent, params: isObj(a.params) ? a.params : {},
    })),
  };
}

/** Lenient like the rest of the assistant client: junk entries are dropped, never thrown on. */
export function parseHome(raw: unknown): Home {
  const r = isObj(raw) ? raw : {};
  const iv = isObj(r.interview) ? r.interview : null;
  const options = iv ? objs(iv.options).map((o) => ({ label: str(o.label), value: str(o.value) })).filter((o) => o.label && o.value) : [];
  return {
    profile: parseProfile(r.profile),
    insights: objs(r.insights).map(parseInsight).filter((i) => i.id && i.title),
    starters: strs(r.starters).filter(Boolean).slice(0, 6),
    interview: iv && str(iv.key) && options.length ? { key: str(iv.key), question: str(iv.question), options } : null,
  };
}

export async function getHome(token: string, signal?: AbortSignal) {
  const res = unwrapEnvelope(await apiGet<{ success?: boolean; data?: unknown }>('/assistant/home', { token, signal, timeout: 20_000 }));
  return res.ok ? { ok: true as const, data: parseHome(res.data) } : res;
}

export async function saveProfileAnswer(key: string, value: string, token: string) {
  return unwrapEnvelope(await apiPut<{ success?: boolean; data?: unknown }>('/assistant/profile', { key, value }, { token }));
}

export async function forgetProfile(token: string) {
  return apiDelete<{ success?: boolean }>('/assistant/profile', { token });
}

export interface SessionSummary { id: number; title: string; updatedAt: string }

export async function getSessions(token: string, userId: string, signal?: AbortSignal) {
  const res = unwrapEnvelope(await apiGet<{ success?: boolean; data?: unknown }>(`/assistant/sessions?userId=${encodeURIComponent(userId)}`, { token, signal }));
  if (!res.ok) return res;
  const data: SessionSummary[] = objs(res.data).map((s) => ({ id: Number(s.id), title: str(s.title, 'Chat'), updatedAt: str(s.updatedAt) })).filter((s) => Number.isInteger(s.id));
  return { ok: true as const, data };
}

export async function getSessionTurns(id: number, token: string, signal?: AbortSignal) {
  const res = unwrapEnvelope(await apiGet<{ success?: boolean; data?: unknown }>(`/assistant/sessions/${id}/messages`, { token, signal }));
  return res.ok ? { ok: true as const, data: objs(res.data).map((m) => ({ role: str(m.role), content: str(m.content) })) } : res;
}
