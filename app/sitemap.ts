import { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/blog'
import { LANGUAGES, getLanguages, getRegionalPostsForLang } from '@/lib/regional'

const BASE = 'https://ziromarket.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts()

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'daily',
    priority: 0.7,
  }))

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
