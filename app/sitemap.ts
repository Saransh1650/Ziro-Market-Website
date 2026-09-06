import { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/blog'
import { LANGUAGES, getLanguages, getRegionalPostsForLang } from '@/lib/regional'
import { SITE_URL as BASE } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts()

  // Evergreen pages that genuinely change often (daily price pages). Everything
  // else is a dated article: telling Google it changes "daily" when it does not
  // burns crawl budget on trivial diffs and devalues the signal for the pages
  // that really do update. Priority is also differentiated, because marking all
  // 179 posts 0.7 tells Google nothing about what matters.
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

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => {
    const isDaily = DAILY_EVERGREEN.has(post.slug)
    return {
      url: `${BASE}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: isDaily ? ('daily' as const) : ('monthly' as const),
      priority: isDaily ? 0.8 : 0.6,
    }
  })

  // Regional-language pages. Each carries an hreflang alternate back to its
  // English original so Google serves the right language per searcher.
  const regionalEntries: MetadataRoute.Sitemap = getLanguages().flatMap((lang) =>
    getRegionalPostsForLang(lang).map((post) => ({
      url: `${BASE}/regional/${lang}/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
      alternates: post.enSlug
        ? {
            languages: {
              [LANGUAGES[lang].locale]: `${BASE}/regional/${lang}/${post.slug}`,
              'en-IN': `${BASE}/blog/${post.enSlug}`,
            },
          }
        : undefined,
    })),
  )

  return [
    {
      url: BASE,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${BASE}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...postEntries,
    ...regionalEntries,
    {
      url: `${BASE}/about`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${BASE}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]
}
