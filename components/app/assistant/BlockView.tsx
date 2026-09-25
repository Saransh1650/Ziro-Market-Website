'use client';

import { SUPPORTED_BLOCKS, numOf as num, str } from '@/lib/assistant/types';
import { RENDERERS } from './blocks/Cards';
import type { BlockCtx } from './blocks/Cards';
import TechChart from './blocks/TechChart';
import { BlockBoundary, Fallback, HIDDEN } from './shared';
import type { RawBlock } from '@/lib/assistant/types';

/**
 * One answer block.
 *
 *   unknown type / newer version / payload we can't draw  →  the block's plain-text `alt`
 *   intentionally empty (no items, no valid actions)      →  nothing
 *   anything that throws while rendering                  →  `alt`, and only for this block
 *
 * So a server that ships a widget this build has never seen still gets its
 * message across, and one bad block never takes the whole answer down.
 */
export function BlockView({ block, ctx }: { block: RawBlock; ctx: BlockCtx }) {
  const type = str(block.type);
  const alt = str(block.alt);
  const version = num(block.v) ?? 1;
  const supported = SUPPORTED_BLOCKS[type];

  if (supported === undefined || version > supported) return <Fallback alt={alt} />;

  return (
    <BlockBoundary alt={alt}>
      <Inner block={block} ctx={ctx} type={type} alt={alt} />
    </BlockBoundary>
  );
}

function Inner({ block, ctx, type, alt }: { block: RawBlock; ctx: BlockCtx; type: string; alt: string }) {
  if (type === 'tech_chart') {
    return str(block.symbol) ? <TechChart b={block} /> : <Fallback alt={alt} />;
  }
  const render = RENDERERS[type];
  if (!render) return <Fallback alt={alt} />;
  const out = render(block, ctx);
  if (out === HIDDEN) return null;
  if (out === null) return <Fallback alt={alt} />;
  return <>{out}</>;
}
