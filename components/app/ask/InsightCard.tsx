'use client';

import { BlockView } from '../assistant/BlockView';
import type { BlockCtx } from '../assistant/blocks/Cards';
import type { Insight } from '@/lib/api/assistantHome';

/**
 * One "Ziro noticed" card. Its buttons render through the same `actions`
 * block the answers use, so validation, the alert form and status text
 * behave identically and nothing here can run an intent the registry
 * does not allow.
 */
export function InsightCard({ insight, ctx }: { insight: Insight; ctx: BlockCtx }) {
  return (
    <article className="zk-card" data-tone={insight.tone}>
      <h3 className="zk-card-title">{insight.title}</h3>
      <p className="zk-card-body">{insight.body}</p>
      <BlockView block={{ type: 'actions', v: 1, alt: insight.title, items: insight.actions }} ctx={ctx} />
    </article>
  );
}
