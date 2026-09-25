'use client';

import { forgetProfile, type Profile } from '@/lib/api/assistantHome';
import type { Turn } from '@/lib/assistant/types';
import { str } from '@/lib/assistant/types';
import { BlockView } from '../assistant/BlockView';
import type { BlockCtx } from '../assistant/blocks/Cards';
import { PROFILE_CHANGED } from '../assistant/intents';

/** Data blocks live in the canvas beside the chat, like the map beside a trip plan. */
export const CANVAS_TYPES = new Set([
  'snapshot', 'line_chart', 'tech_chart', 'range_bar', 'compare_table', 'table', 'kpi', 'sector_perf', 'market_pulse', 'news_timeline', 'signals',
]);

const LABEL: Record<string, string> = {
  beginner: 'Just starting', intermediate: 'A few years in', advanced: 'Seasoned',
  low: 'Prefers steady', medium: 'Moderate risk', high: 'Growth-seeking',
  short: 'Under a year', long: '5+ years',
};

function Known({ profile, token }: { profile: Profile; token: string }) {
  const facts = [
    profile.experience && LABEL[profile.experience],
    profile.risk && LABEL[profile.risk],
    profile.horizon && (profile.horizon === 'medium' ? '1 to 5 years' : LABEL[profile.horizon]),
    ...profile.interests,
  ].filter((f): f is string => Boolean(f));

  return (
    <section className="zk-card" aria-label="What Ziro knows about you">
      <p className="zk-eyebrow">What Ziro knows</p>
      {facts.length === 0 ? (
        <p className="zk-card-body">Nothing yet. Answer a question or two and Ziro will tailor what it shows you.</p>
      ) : (
        <>
          <ul className="zk-facts">{facts.map((f) => <li key={f}>{f}</li>)}</ul>
          <button type="button" className="zk-link" onClick={() => void forgetProfile(token).then(() => document.dispatchEvent(new CustomEvent(PROFILE_CHANGED)))}>
            Forget all of this
          </button>
        </>
      )}
    </section>
  );
}

export function Canvas({ turn, profile, token, ctx }: { turn: Turn | undefined; profile: Profile | null; token: string; ctx: BlockCtx }) {
  const blocks = (turn?.blocks ?? []).filter((b) => CANVAS_TYPES.has(str(b.type)));
  return (
    <aside className="zk-canvas" aria-label="Details">
      {blocks.length === 0 && (
        <p className="zk-quiet">Charts and numbers from Ziro&rsquo;s answers appear here, beside the conversation.</p>
      )}
      {blocks.map((b, i) => <BlockView key={str(b.id) || i} block={b} ctx={ctx} />)}
      {profile && <Known profile={profile} token={token} />}
    </aside>
  );
}
