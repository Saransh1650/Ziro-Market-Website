import { addSymbol, createWatchlist, getWatchlists, removeSymbol } from '@/lib/api/watchlist';
import { saveProfileAnswer } from '@/lib/api/assistantHome';
import { createAlert } from '@/lib/api/alerts';
import { money } from '@/lib/format/number';
import { APP_PAGES, numOf, str } from '@/lib/assistant/types';
import type { Intent } from '@/lib/assistant/types';

export interface IntentDeps {
  token: string | null;
  userId: string | null;
  navigate: (path: string) => void;
  ask: (question: string, symbol?: string) => void;
}

const DEFAULT_LIST = 'My Watchlist';

/** Fired after Ziro learns something about the user, so open surfaces can refresh. */
export const PROFILE_CHANGED = 'zw:profile-changed';

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

    case 'navigate.page': {
      const path = APP_PAGES[str(params.page)];
      if (!path) return '';
      d.navigate(path);
      return 'Opening…';
    }

    case 'profile.set': {
      if (!d.token) return 'Sign in so Ziro can remember this.';
      const r = await saveProfileAnswer(str(params.key), str(params.value), d.token);
      if (!r.ok) return 'Could not save that. Try again in a moment.';
      document.dispatchEvent(new CustomEvent(PROFILE_CHANGED));
      return 'Got it — Ziro will tailor answers to this.';
    }

    case 'watchlist.remove': {
      if (!d.token) return 'Sign in to edit your watchlist.';
      const auth = { token: d.token };
      const lists = await getWatchlists(auth);
      const owner = lists.ok ? lists.data.find((l) => l.symbols?.includes(symbol)) : undefined;
      if (!owner) return `${symbol} is not on your watchlist.`;
      const r = await removeSymbol(owner.id, symbol, auth);
      return r.ok ? `Removed ${symbol} from ${owner.name}.` : `Could not remove ${symbol}. Try again in a moment.`;
    }

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
