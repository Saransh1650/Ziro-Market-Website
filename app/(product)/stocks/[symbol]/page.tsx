import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense, cache } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { getStockDetail } from '@/lib/api/stocks';
import { SEED_SYMBOLS, seededName } from '@/lib/stocks/seed';
import { SITE_URL } from '@/lib/site';
import { num, pct } from '@/lib/format/number';
import PriceHeader from '@/components/app/PriceHeader';
import StatGrid from '@/components/app/StatGrid';
import StockTabs from '@/components/app/StockTabs';
import type { StockDetail } from '@/lib/api/types';

/**
 * Public, indexable instrument page.
 *
 * Deliberately outside `/app`: `ziromarket.com/stocks/RELIANCE` is a
 * clean, linkable URL a crawler will take seriously, and burying it
 * under a signed-in path would waste the whole surface.
 *
 * ISR — the server renders name, sector, fundamentals and the previous
 * session's figures into the HTML, which is what gets indexed. Only the
 * live price hydrates.
 */

export const revalidate = 300;
export const dynamicParams = true;

/**
 * Pre-render the seeded index constituents; everything else on demand.
 *
 * Gated on the backend actually answering. Prerendering is how a bad
 * deploy becomes permanent: if the backend is down mid-build, every one
 * of these pages bakes as an error or a 404 and gets served from the
 * cache for the full revalidate window. Returning an empty list instead
 * means the build still succeeds and each page renders on demand, from a
 * healthy backend, the first time it is asked for.
 */
export async function generateStaticParams() {
  const probe = await getStockDetail('RELIANCE', '1D');

  if (!probe.ok) {
    console.warn(
      `[stocks] Backend unavailable at build (${probe.error.message}). ` +
        'Skipping prerender; pages will render on demand.',
    );
    return [];
  }

  // The backend rate-limits /api to 300 requests a minute. Prerendering
  // every seeded symbol exceeded that and killed the build on a 429, so
  // only the largest names are baked; the rest render on demand and are
  // cached by ISR from then on. `dynamicParams` keeps them reachable.
  return SEED_SYMBOLS.slice(0, PRERENDER_LIMIT).map(([symbol]) => ({ symbol }));
}

const PRERENDER_LIMIT = 60;

const SYMBOL_RE = /^[A-Z0-9&.\-]{1,20}$/;

/**
 * One fetch per symbol per render.
 *
 * `generateMetadata` and the page body both need the detail. Without
 * `cache()` that is two backend calls for every page, and a full build
 * went over the backend's 300-requests-per-minute limit and died on a
 * 429 partway through.
 */
const loadCached = cache((symbol: string) => getStockDetail(symbol, '1D', { revalidate }));

/** Values the backend uses to mean "we don't have this". */
function real(value: string | undefined | null): string | undefined {
  if (!value) return undefined;
  const v = value.trim();
  return v && v.toUpperCase() !== 'N/A' ? v : undefined;
}

/**
 * The name to show.
 *
 * `companyName` often comes back as the ticker itself ("RELIANCE"), which
 * makes for a title like "RELIANCE (RELIANCE) share price" and a page
 * that never ranks for the company's actual name. The seeded list has
 * the proper names, so it wins whenever the API just echoes the symbol.
 */
function displayName(symbol: string, companyName?: string): string {
  const seeded = seededName(symbol);
  const api = real(companyName);
  if (!api || api.toUpperCase() === symbol.toUpperCase()) return seeded ?? symbol;
  return api;
}

function normalise(raw: string): string {
  return decodeURIComponent(raw).toUpperCase().replace(/\.NS$/, '');
}

/**
 * Whether the response is a real instrument or an empty shell.
 *
 * The backend answers **200 with every field zeroed** for a symbol it has
 * never heard of, rather than 404. Rendering that produces a plausible
 * page of zeros for any string at all — on a programmatic surface this
 * size, that is an unlimited supply of thin pages for Google to crawl
 * and index. A listed stock always has a price and a previous close,
 * even when suspended, so an all-zero response means the symbol is not
 * real.
 */
function isEmptyShell(d: StockDetail): boolean {
  return (
    !d.lastPrice &&
    !d.previousClose &&
    !d.dayHigh &&
    !d.volume &&
    !(d.ohlc?.length)
  );
}

/**
 * Fetch, distinguishing "this stock does not exist" from "the service is
 * having a bad day".
 *
 * That distinction is the whole ballgame for an indexed surface: a 404
 * tells Google to drop the page, a 500 tells it to come back later.
 * Returning 404 during an outage would quietly deindex every stock page
 * on the site.
 */
async function loadDetail(symbol: string): Promise<StockDetail> {
  const result = await loadCached(symbol);

  if (result.ok) {
    if (isEmptyShell(result.data)) notFound();
    return result.data;
  }

  if (result.error.status === 404 || result.error.status === 400) notFound();

  // Anything else is transient. Throwing yields a 500, which keeps the
  // page indexed.
  throw new Error(`Stock detail unavailable for ${symbol}: ${result.error.message}`);
}

export async function generateMetadata(
  { params }: { params: Promise<{ symbol: string }> },
): Promise<Metadata> {
  const { symbol: raw } = await params;
  const symbol = normalise(raw);

  if (!SYMBOL_RE.test(symbol)) return { title: 'Stock not found' };

  const result = await loadCached(symbol);
  const known = result.ok && !isEmptyShell(result.data);

  // An unknown symbol is about to 404, so it gets no indexable metadata.
  if (result.ok && !known) return { title: 'Stock not found', robots: { index: false, follow: false } };

  const name = displayName(symbol, result.ok ? result.data.companyName : undefined);
  const canonical = `/stocks/${symbol}`;

  const description = result.ok
    ? `${name} (${symbol}) share price ₹${num(result.data.lastPrice, 2)}, ${pct(result.data.pChange)} today. Live NSE price, P/E, market cap, 52-week range, fundamentals and news.`
    : `${name} (${symbol}) share price, fundamentals, 52-week range and latest news on NSE.`;

  return {
    title: `${name} (${symbol}) share price, fundamentals & news`,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${name} (${symbol}) share price`,
      description,
      url: `${SITE_URL}${canonical}`,
      type: 'website',
      locale: 'en_IN',
    },
    robots: { index: true, follow: true },
  };
}

export default async function StockPage(
  { params }: { params: Promise<{ symbol: string }> },
) {
  const { symbol: raw } = await params;
  const symbol = normalise(raw);

  // A malformed symbol is not worth a backend round trip.
  if (!SYMBOL_RE.test(symbol)) notFound();

  const detail = await loadDetail(symbol);
  const name = displayName(symbol, detail.companyName);
  const sector = real(detail.sector);

  return (
    <div className="zw-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(detail, symbol, name, sector)) }}
      />

      <Breadcrumbs name={name} sector={sector} />

      <PriceHeader
        symbol={symbol}
        companyName={name}
        sector={sector}
        lastPrice={detail.lastPrice}
        change={detail.change}
        pChange={detail.pChange}
        dayLow={detail.dayLow}
        dayHigh={detail.dayHigh}
        yearLow={detail.yearLow}
        yearHigh={detail.yearHigh}
      />

      <nav className="zw-pagenav" aria-label="On this page">
        <a href="#chart">Overview</a>
        <a href="#stats">Key statistics</a>
        <a href="#details">News &amp; order book</a>
      </nav>

      <div className="zw-stock-grid">
        <div className="zw-stock-main">
          <section id="chart" className="zw-panel zw-chartpanel">
            <PriceChart
              symbol={symbol}
              initialOhlc={detail.ohlc ?? []}
              previousClose={detail.previousClose}
            />
          </section>
          {/* StockTabs reads the `tab` query param, which is not known
              at prerender time. The boundary lets the rest of the page
              stay static while this part resolves on the client. */}
          <section id="details" className="zw-panel">
            <Suspense fallback={<div style={{ height: 240 }} aria-hidden="true" />}>
              <StockTabs symbol={symbol} sector={sector} />
            </Suspense>
          </section>
        </div>

        <aside className="zw-panel">
          <StatGrid detail={detail} />
        </aside>
      </div>


    </div>
  );
}

/* The chart is the heaviest thing on the page and no other surface
   needs it, so its JS is fetched only once this page renders. */
const PriceChart = dynamic(() => import('@/components/app/PriceChart'));

function Breadcrumbs({ name, sector }: { name: string; sector?: string }) {
  return (
    <nav aria-label="Breadcrumb" style={{ paddingBottom: 'var(--s-3)' }}>
      <ol style={{ display: 'flex', gap: 6, listStyle: 'none', margin: 0, padding: 0, flexWrap: 'wrap' }}>
        <li className="zw-sub"><Link href="/">Ziro Market</Link></li>
        <li className="zw-sub" aria-hidden="true">/</li>
        <li className="zw-sub"><Link href="/app/discover">Stocks</Link></li>
        {sector && (
          <>
            <li className="zw-sub" aria-hidden="true">/</li>
            <li className="zw-sub">
              <Link href={`/app/sectors/${encodeURIComponent(sector)}`}>{sector}</Link>
            </li>
          </>
        )}
        <li className="zw-sub" aria-hidden="true">/</li>
        <li className="zw-sub" aria-current="page" style={{ color: 'var(--ink)' }}>{name}</li>
      </ol>
    </nav>
  );
}

function jsonLd(detail: StockDetail, symbol: string, name: string, sector?: string) {
  const url = `${SITE_URL}/stocks/${symbol}`;
  const industry = real(detail.industry) ?? sector;

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Corporation',
      name,
      tickerSymbol: symbol,
      url,
      // Only emitted when it is a real value. Publishing `industry: "N/A"`
      // is worse than publishing no industry at all.
      ...(industry ? { industry } : {}),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FinancialProduct',
      name: `${name} (${symbol})`,
      url,
      category: 'Equity',
      provider: { '@type': 'Organization', name: 'National Stock Exchange of India' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Ziro Market', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Stocks', item: `${SITE_URL}/app/discover` },
        { '@type': 'ListItem', position: 3, name, item: url },
      ],
    },
  ];
}
