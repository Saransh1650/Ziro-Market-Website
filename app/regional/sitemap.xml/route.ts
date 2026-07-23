import { getLanguages, getRegionalPostsForLang, LANGUAGES } from '@/lib/regional'
import { SITE_URL as BASE } from '@/lib/site'

// Regional pages are kept out of the main /blog sitemap on purpose. They get
// their own sitemap with an hreflang alternate pointing back to the English
// original, so search engines serve the right language without the regional
// URLs competing with the canonical English ones.
export function GET() {
  const urls = getLanguages()
    .flatMap((lang) => {
      const cfg = LANGUAGES[lang]
      return getRegionalPostsForLang(lang).map((post) => {
        const loc = `${BASE}/regional/${lang}/${post.slug}`
        const alt = post.enSlug
          ? `\n    <xhtml:link rel="alternate" hreflang="en-IN" href="${BASE}/blog/${post.enSlug}" />`
          : ''
        return `  <url>
    <loc>${loc}</loc>
    <lastmod>${new Date(post.date).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
    <xhtml:link rel="alternate" hreflang="${cfg.locale}" href="${loc}" />${alt}
  </url>`
      })
    })
    .join('\n')

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>`

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  })
}
