'use client';

import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import DepthLadder from './DepthLadder';
import { getStockNews, getSectorStocks } from '@/lib/api/stocks';
import { useResource } from '@/hooks/useResource';
import { relativeTime, num } from '@/lib/format/number';
import { Delta } from './Delta';
import type { StockNewsItem, SectorStock } from '@/lib/api/types';

/**
 * Secondary content under the chart. Genuinely secondary — the price,
 * the chart and the fundamentals are all visible without touching
 * these — so tabs are the right container here.
 */

type TabId = 'depth' | 'news' | 'related';

export default function StockTabs({ symbol, sector }: { symbol: string; sector?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const tabs: Array<[TabId, string]> = [
    ['depth', 'Order book'],
    ['news', 'News'],
    ...(sector ? ([['related', 'Related stocks']] as Array<[TabId, string]>) : []),
  ];

  const requested = params.get('tab') as TabId | null;
  const tab: TabId = tabs.some(([id]) => id === requested) ? requested! : 'news';

  // Tab state lives in the URL, so a view of the order book is a link
  // someone can send. `scroll: false` keeps the page from jumping to the
  // top on every switch.
  const setTab = useCallback(
    (next: TabId) => {
      const q = new URLSearchParams(params.toString());
      if (next === 'news') q.delete('tab');
      else q.set('tab', next);
      const qs = q.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [params, pathname, router],
  );

  return (
    <section style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <div role="tablist" aria-label="More about this stock" className="zw-tabs zw-tabs-inset">
        {tabs.map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            id={`tab-${id}`}
            aria-selected={tab === id}
            aria-controls={`panel-${id}`}
            onClick={() => setTab(id)}
            className="zw-tab"
          >
            {label}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`panel-${tab}`}
        aria-labelledby={`tab-${tab}`}
        tabIndex={0}
        className="zw-tabpanel"
      >
        {tab === 'depth' ? (
          <DepthLadder symbol={symbol} />
        ) : tab === 'news' ? (
          <NewsPanel symbol={symbol} />
        ) : (
          <RelatedPanel symbol={symbol} sector={sector!} />
        )}
      </div>
    </section>
  );
}

/* ── News ─────────────────────────────────────────────────────── */

function NewsPanel({ symbol }: { symbol: string }) {
  const { data, loading, error, refetch } = useResource<StockNewsItem[]>(
    (signal) => getStockNews(symbol, 12, { signal }),
    { deps: [symbol], live: false },
  );

  if (loading) return <ListSkeleton rows={5} />;
  if (error) return <Failed message="News is unavailable right now." onRetry={refetch} />;
  if (!data?.length) return <Empty>No recent news mentioning {symbol}.</Empty>;

  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
      {data.map((item, i) => {
        const href = item.link ?? item.url;
        const when = item.publishedAt ?? item.pubDate;
        return (
          <li key={`${item.title}-${i}`} style={{ borderBottom: '1px solid var(--line)' }}>
            {/* No thumbnails. Indian financial feeds return stock photos
                and logos, which make a list of headlines slower to scan,
                not faster. */}
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'block', padding: '10px 0' }}
            >
              <p style={{ fontSize: 14, lineHeight: 1.45, maxWidth: '68ch', color: 'var(--ink)' }}>
                {item.title}
              </p>
              <p className="zw-sub" style={{ marginTop: 3 }}>
                {item.source ?? 'Source unknown'}
                {when ? ` · ${relativeTime(when)}` : ''}
              </p>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

/* ── Related ──────────────────────────────────────────────────── */

function RelatedPanel({ symbol, sector }: { symbol: string; sector: string }) {
  const { data, loading, error, refetch } = useResource<SectorStock[]>(
    (signal) => getSectorStocks(sector, { signal }),
    { deps: [sector] },
  );

  if (loading) return <ListSkeleton rows={6} />;
  if (error) return <Failed message={`Couldn't load other ${sector} stocks.`} onRetry={refetch} />;

  const peers = (data ?? [])
    .filter((s) => s.symbol?.toUpperCase() !== symbol.toUpperCase())
    .slice(0, 12);

  if (!peers.length) return <Empty>No other stocks listed under {sector}.</Empty>;

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <caption className="zw-sr">Other stocks in {sector}</caption>
      <thead>
        <tr>
          <th scope="col" className="zw-colhead" style={{ textAlign: 'left', paddingBottom: 6 }}>Symbol</th>
          <th scope="col" className="zw-colhead" style={{ textAlign: 'right', paddingBottom: 6 }}>Price</th>
          <th scope="col" className="zw-colhead" style={{ textAlign: 'right', paddingBottom: 6 }}>Change</th>
        </tr>
      </thead>
      <tbody>
        {peers.map((s) => {
          const price = s.lastPrice ?? s.price;
          const change = s.pChange ?? s.changePercent;
          return (
            <tr key={s.symbol} style={{ borderTop: '1px solid var(--line)' }}>
              <th scope="row" style={{ textAlign: 'left', padding: '7px 0', fontWeight: 400 }}>
                <Link href={`/stocks/${encodeURIComponent(s.symbol)}`} style={{ color: 'var(--ink)' }}>
                  <span className="zw-sym">{s.symbol}</span>
                  {(s.name ?? s.companyName) && (
                    <span className="zw-sub" style={{ display: 'block' }}>{s.name ?? s.companyName}</span>
                  )}
                </Link>
              </th>
              <td className="zw-num" style={{ textAlign: 'right', padding: '7px 0', fontSize: 12 }}>
                {price != null ? num(price, 2) : '—'}
              </td>
              <td style={{ textAlign: 'right', padding: '7px 0', fontSize: 12 }}>
                <Delta value={change} />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

/* ── Shared states ────────────────────────────────────────────── */

function ListSkeleton({ rows }: { rows: number }) {
  return (
    <div aria-hidden="true">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{ height: 36, borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center' }}>
          <span style={{ width: `${60 - i * 4}%`, height: 9, background: 'var(--surface-hover)', borderRadius: 2 }} />
        </div>
      ))}
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="zw-sub" style={{ padding: 'var(--s-4) 0', color: 'var(--ink-3)' }}>{children}</p>;
}

function Failed({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div role="alert" style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-3)', padding: 'var(--s-4) 0' }}>
      <p className="zw-sub">{message}</p>
      <button type="button" className="zw-chip" onClick={onRetry}>Try again</button>
    </div>
  );
}
