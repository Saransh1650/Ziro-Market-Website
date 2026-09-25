import { addSymbol, createWatchlist, getWatchlists } from '@/lib/api/watchlist';
import { createAlert } from '@/lib/api/alerts';
import { money } from '@/lib/format/number';
import { numOf, str } from '@/lib/assistant/types';
import type { Intent } from '@/lib/assistant/types';

export interface IntentDeps {
  token: string | null;
  userId: string | null;
  navigate: (path: string) => void;
  ask: (question: string, symbol?: string) => void;
}

const DEFAULT_LIST = 'My Watchlist';

/**
 * Carries out one whitelisted intent from an answer and returns a short
 * status line. The server only ever names an intent and its parameters —
 * what actually happens (which list, which API) is decided here.
 * Never throws: every failure becomes a sentence the reader can act on.
 */
export async function runIntent(intent: Intent, params: Record<string, unknown>, d: IntentDeps): Promise<string> {
  const symbol = str(params.symbol);

  switch (intent) {
    case 'navigate.symbol':
      d.navigate(`/stocks/${encodeURIComponent(symbol)}`);
      return `Opening ${symbol}…`;

    case 'ask.followup':
      d.ask(str(params.q), symbol || undefined);
      return '';

    case 'watchlist.add': {
      if (!d.token) return 'Sign in to save stocks to a watchlist.';
      const auth = { token: d.token };
      const lists = await getWatchlists(auth);
      if (!lists.ok) return 'Could not reach your watchlists. Try again in a moment.';
      let target = lists.data[0];
      if (!target) {
        const made = await createWatchlist(DEFAULT_LIST, auth);
        if (!made.ok || !made.data?.id) return 'Could not create a watchlist. Try again in a moment.';
        target = made.data;
      }
      if (target.symbols?.includes(symbol)) return `${symbol} is already in ${target.name}.`;
      const added = await addSymbol(target.id, symbol, auth);
      return added.ok ? `Added ${symbol} to ${target.name}.` : `Could not add ${symbol}. Try again in a moment.`;
    }

    case 'alert.create': {
      if (!d.userId) return 'Sign in to set price alerts.';
      const price = numOf(params.price);
      if (price == null || price <= 0) return 'Enter a valid target price.';
      const condition = str(params.condition) === 'below' ? 'below' : 'above';
      const r = await createAlert({ userId: d.userId, symbol, targetPrice: price, condition });
      return r.ok ? `Alert set: ${symbol} ${condition} ${money(price, 2)}.` : 'Could not create the alert. Try again in a moment.';
    }
  }
}
