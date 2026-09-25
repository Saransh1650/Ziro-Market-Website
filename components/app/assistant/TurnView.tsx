import { num, pct } from '@/lib/format/number';
import { str } from '@/lib/assistant/types';
import type { Turn } from '@/lib/assistant/types';
import { AnswerBody } from './AnswerBody';
import { BlockView } from './BlockView';
import { References } from './References';
import type { BlockCtx } from './blocks/Cards';

const TOOL_LABEL: Record<string, string> = {
  get_live_price: 'Checking live price',
  get_historical_summary: 'Pulling price history',
  get_fundamentals: 'Reading fundamentals',
  get_stock_news: 'Scanning news',
  get_corporate_actions: 'Checking announcements',
  get_fii_dii: 'Checking FII / DII flows',
  get_index_levels: 'Checking index levels',
  get_sector_performance: 'Checking sector moves',
  get_global_cues: 'Checking global markets',
  web_search: 'Searching the web',
};

export function TurnView({ turn, ctx, onClarify, hideBlocks }: { turn: Turn; ctx: BlockCtx; onClarify: (symbol: string) => void; hideBlocks?: (type: string) => boolean }) {
  // A `stat` widget repeats the price line already shown above the answer.
  const blocks = turn.blocks.filter((b) => !(turn.price && b.type === 'stat') && !hideBlocks?.(str(b.type)));
  const toolLabel = turn.tool ? TOOL_LABEL[turn.tool] ?? 'Working' : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <p style={{ fontSize: 13, fontWeight: 600 }}>{turn.question}</p>

      {turn.price && (
        <p className="zw-sub zw-num">
          {turn.price.symbol} {num(turn.price.price, 2)}{' '}
          <span style={{ color: turn.price.changePct >= 0 ? 'var(--up)' : 'var(--down)' }}>
            {pct(turn.price.changePct)}
          </span>
        </p>
      )}

      {toolLabel && <p className="zw-sub" style={{ color: 'var(--ink-3)' }}>{toolLabel}…</p>}

      {turn.clarify && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <p className="zw-sub">Which one did you mean?</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {turn.clarify.map((c) => (
              <button key={c.symbol} type="button" className="zw-chip" onClick={() => onClarify(c.symbol)}>
                {c.name ? `${c.symbol} · ${c.name}` : c.symbol}
              </button>
            ))}
          </div>
        </div>
      )}

      {turn.answer && (
        <p className="zw-ab-prose">
          <AnswerBody text={turn.answer} />
        </p>
      )}

      {blocks.map((b, i) => (
        <BlockView key={str(b.id) || i} block={b} ctx={ctx} />
      ))}

      <References items={turn.references} />

      {turn.error && (
        <p className="zw-sub" role="alert" style={{ color: 'var(--down)' }}>{turn.error}</p>
      )}

      {/* Generated text sitting beside exchange data must never be
          mistaken for it. */}
      {turn.done && turn.answer && (
        <p className="zw-sub" style={{ color: 'var(--ink-3)' }}>AI generated · check before acting on it</p>
      )}
    </div>
  );
}
