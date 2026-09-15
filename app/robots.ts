import { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

// One rule for every crawler. `User-agent: *` already covers Googlebot,
// Bingbot and every AI crawler (GPTBot, PerplexityBot, ClaudeBot,
// Google-Extended, Applebot-Extended), so naming them separately with the
// same Allow/Disallow adds lines without changing behaviour.
// Only /api/ is blocked; it also carries an X-Robots-Tag: noindex header
// from next.config.ts.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/api/' },
    // /sitemap.xml already contains every blog and regional URL, so the
    // per-section sitemaps do not need a second listing here.
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
