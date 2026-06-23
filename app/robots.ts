import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/',
    },
    host: 'https://ziromarket.com',
    sitemap: [
      'https://ziromarket.com/sitemap.xml',
      'https://ziromarket.com/blog/sitemap.xml',
      'https://ziromarket.com/regional/sitemap.xml',
    ],
  }
}
