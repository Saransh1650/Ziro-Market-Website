import { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

// AI answer engines (ChatGPT, Perplexity, Claude, Gemini/AI Overviews, Copilot,
// Apple Intelligence) only cite pages their crawlers are allowed to fetch, so we
// explicitly allow the major AI/GEO crawlers alongside normal search bots.
// Crawler access is the precondition for being cited in AI answers.
const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'PerplexityBot',
  'Perplexity-User',
  'ClaudeBot',
  'anthropic-ai',
  'Claude-Web',
  'Google-Extended',
  'Applebot-Extended',
  'Amazonbot',
  'Bingbot',
  'CCBot',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: '/api/' },
      { userAgent: AI_CRAWLERS, allow: '/', disallow: '/api/' },
    ],
    sitemap: [
      `${SITE_URL}/sitemap.xml`,
      `${SITE_URL}/blog/sitemap.xml`,
      `${SITE_URL}/regional/sitemap.xml`,
    ],
    host: SITE_URL,
  }
}
