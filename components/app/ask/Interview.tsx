'use client';

import { BlockView } from '../assistant/BlockView';
import type { BlockCtx } from '../assistant/blocks/Cards';
import type { Interview as InterviewQ } from '@/lib/api/assistantHome';

/** One get-to-know-you question, answered with a tap. Answers are saved through `profile.set`. */
export function Interview({ q, ctx }: { q: InterviewQ; ctx: BlockCtx }) {
  const items = q.options.map((o, i) => ({
    id: `o${i}`, label: o.label, intent: 'profile.set', params: { key: q.key, value: o.value },
  }));
  return (
    <section className="zk-card zk-interview" aria-label="Help Ziro get to know you">
      <p className="zk-eyebrow">So Ziro can tailor answers</p>
      <h3 className="zk-card-title">{q.question}</h3>
      <BlockView block={{ type: 'actions', v: 1, alt: q.question, items }} ctx={ctx} />
    </section>
  );
}
