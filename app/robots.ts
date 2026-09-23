import { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

// Search engines and AI answer engines (ChatGPT, Perplexity, Claude, Gemini,
// Copilot, Apple Intelligence) are named explicitly so each one sees an
// unambiguous Allow. Only /api/ is blocked; it also carries an
// X-Robots-Tag: noindex header from next.config.ts.
const CRAWLERS = [
  'Googlebot', 'Googlebot-Image', 'Googlebot-News', 'Google-Extended', 'Bingbot', 'DuckDuckBot', 'Slurp', 'YandexBot',
  'GPTBot', 'ChatGPT-User', 'OAI-SearchBot', 'PerplexityBot', 'Perplexity-User', 'ClaudeBot', 'Claude-User',
  'Claude-SearchBot', 'anthropic-ai', 'Applebot', 'Applebot-Extended', 'CCBot', 'Meta-ExternalAgent', 'Amazonbot',
  'cohere-ai', 'MistralAI-User',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: CRAWLERS, allow: '/', disallow: '/api/' },
      { userAgent: '*', allow: '/', disallow: '/api/' },
    ],
    sitemap: [`${SITE_URL}/sitemap.xml`, `${SITE_URL}/blog/sitemap.xml`, `${SITE_URL}/regional/sitemap.xml`],
    host: SITE_URL,
  }
}
