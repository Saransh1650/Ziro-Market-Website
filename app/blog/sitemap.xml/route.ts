import { getAllPosts } from '@/lib/blog'
import { SITE_URL as BASE } from '@/lib/site'

export function GET() {
  const posts = getAllPosts()

  // Only the true daily price pages get changefreq=daily. Dated articles are
  // monthly: claiming daily change on every post wastes crawl budget and makes
  // the signal meaningless for the pages that actually do update every day.
  const DAILY_EVERGREEN = new Set([
    'indian-stock-market-today',
    'gold-rate-today-india',
    'gold-price-today',
    'silver-rate-today-india',
    'rupee-dollar-today',
    'crude-oil-price-today',
    'bitcoin-price-today',
    'petrol-diesel-price-today',
  ])

  const urls = posts
    .map((post) => {
      const isDaily = DAILY_EVERGREEN.has(post.slug)
      return `  <url>
    <loc>${BASE}/blog/${post.slug}</loc>
    <lastmod>${new Date(post.date).toISOString()}</lastmod>
    <changefreq>${isDaily ? 'daily' : 'monthly'}</changefreq>
    <priority>${isDaily ? '0.8' : '0.6'}</priority>
  </url>`
    })
    .join('\n')

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE}/blog</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
${urls}
</urlset>`

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  })
}
