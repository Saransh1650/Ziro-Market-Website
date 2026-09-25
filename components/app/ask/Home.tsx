'use client';

import type { Home as HomeData } from '@/lib/api/assistantHome';
import type { BlockCtx } from '../assistant/blocks/Cards';
import { InsightCard } from './InsightCard';
import { Interview } from './Interview';

const FALLBACK_STARTERS = ['Why did Nifty move today?', 'Which sector led today?', 'What should I know before the market opens?'];

function greeting(name: string | null): string {
  const hour = Number(new Intl.DateTimeFormat('en-IN', { hour: 'numeric', hour12: false, timeZone: 'Asia/Kolkata' }).format(new Date()));
  const part = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  return name ? `${part}, ${name}` : part;
}

/** Everything the workspace offers before the user types a word. */
export function Home({ home, loading, name, ctx, onAsk }: {
  home: HomeData | null; loading: boolean; name: string | null; ctx: BlockCtx; onAsk: (q: string) => void;
}) {
  const starters = home?.starters.length ? home.starters : FALLBACK_STARTERS;
  return (
    <div className="zk-home">
      <h1 className="zk-hello">{greeting(name)}</h1>
      <p className="zk-lede">Here is what Ziro noticed. Tap anything, or ask in your own words.</p>

      {loading && <div className="zk-skel" aria-hidden="true" />}

      {home && home.insights.length > 0 && (
        <div className="zk-grid">
          {home.insights.map((i) => <InsightCard key={i.id} insight={i} ctx={ctx} />)}
        </div>
      )}

      {home?.interview && <Interview key={home.interview.key} q={home.interview} ctx={ctx} />}

      <p className="zk-eyebrow">Try asking</p>
      <div className="zk-starters" role="group" aria-label="Suggested questions">
        {starters.map((s) => (
          <button key={s} type="button" className="zk-starter" onClick={() => onAsk(s)}>{s}</button>
        ))}
      </div>
    </div>
  );
}
