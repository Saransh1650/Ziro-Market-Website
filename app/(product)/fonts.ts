import { Inter } from 'next/font/google';

/**
 * The product's typeface.
 *
 * Inter, not the marketing site's Manrope, and no monospace at all.
 * Every comparable product — Zerodha, Screener, Upstox — sets prices in a
 * proportional UI face with tabular figures switched on, not in a mono
 * face. Mono numerals are what made these tables read as a code listing.
 *
 * `tnum` (tabular) keeps columns aligned; `lnum` (lining) stops figures
 * dropping below the baseline. Both are enabled globally in product.css.
 */
export const productFont = Inter({
  subsets: ['latin'],
  variable: '--font-product',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});
