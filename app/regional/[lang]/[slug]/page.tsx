import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import SummaryBox from '@/components/blog/SummaryBox'
import FaqAccordion from '@/components/blog/FaqAccordion'
import { mdxComponents } from '@/components/blog/MdxComponents'
import AppDownloadPopup from '@/components/blog/AppDownloadPopup'
import RegionalDownloadCTA from '@/components/regional/RegionalDownloadCTA'
import {
  LANGUAGES,
  getAllRegionalParams,
  getRegionalPost,
  getRegionalPostsForLang,
} from '@/lib/regional'

const BASE = 'https://ziromarket.com'

export async function generateStaticParams() {
  return getAllRegionalParams()
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}): Promise<Metadata> {
  const { lang, slug } = await params
  const cfg = LANGUAGES[lang]
  const post = cfg ? getRegionalPost(lang, slug) : null
  if (!post || !cfg) return {}

  const url = `${BASE}/regional/${lang}/${slug}`
  const languages: Record<string, string> = { [cfg.locale]: url }
  if (post.enSlug) languages['en-IN'] = `${BASE}/blog/${post.enSlug}`

  return {
    title: post.seoTitle ?? post.title,
    description: post.excerpt,
    keywords: [...post.tags, cfg.englishName, 'Ziro Market'],
    alternates: { canonical: url, languages },
    openGraph: {
      title: post.seoTitle ?? post.title,
      description: post.excerpt,
      url,
      type: 'article',
      locale: cfg.locale.replace('-', '_'),
      publishedTime: post.date,
      tags: post.tags,
      siteName: 'Ziro Market',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seoTitle ?? post.title,
      description: post.excerpt,
    },
  }
}

export default async function RegionalPostPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { lang, slug } = await params
  const cfg = LANGUAGES[lang]
  if (!cfg) notFound()
  const post = getRegionalPost(lang, slug)
  if (!post) notFound()

  const { ui } = cfg

  const hasFaq = Boolean(post.faq && post.faq.length > 0)
  const body = hasFaq
    ? post.content.split(/\n#{2,3}\s*(Frequently Asked Questions|अक्सर पूछे जाने वाले सवाल)[^\n]*\n/i)[0].trimEnd()
    : post.content

  const others = getRegionalPostsForLang(lang).filter((p) => p.slug !== slug)
  const alsoRead = others.slice(0, 3)

  const url = `${BASE}/regional/${lang}/${slug}`
  const formattedDate = new Date(post.date).toLocaleDateString(cfg.locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    inLanguage: cfg.locale,
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    image: {
      '@type': 'ImageObject',
      url: `${url}/opengraph-image`,
      width: 1200,
      height: 630,
    },
    author: { '@type': 'Organization', name: 'Ziro Market', url: BASE },
    publisher: {
      '@type': 'Organization',
      name: 'Ziro Market',
      url: BASE,
      logo: { '@type': 'ImageObject', url: `${BASE}/favicon/android-chrome-192x192.png` },
    },
    url,
    mainEntityOfPage: url,
    keywords: post.tags.join(', '),
  }

  const faqJsonLd = hasFaq
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        inLanguage: cfg.locale,
        mainEntity: post.faq!.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      }
    : null

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      {faqJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      )}
      <Nav />
      <main lang={cfg.code}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 32px' }}>
          <div
            style={{
              fontFamily: 'var(--mono)',
              fontSize: '0.62rem',
              letterSpacing: '0.12em',
              color: 'var(--text-3)',
              padding: '28px 0 0',
            }}
          >
            <a href="/" style={{ color: 'var(--text-3)' }}>
              {ui.home}
            </a>
            <span style={{ margin: '0 6px' }}>/</span>
            <span>{cfg.name}</span>
          </div>

          <div style={{ padding: '24px 0 32px', borderBottom: '1px solid var(--border-1)' }}>
            <div
              style={{
                fontFamily: 'var(--mono)',
                fontSize: '0.62rem',
                color: 'var(--text-3)',
                marginBottom: 14,
              }}
            >
              {ui.updatedOn} {formattedDate}
              {post.enSlug && (
                <>
                  <span style={{ margin: '0 8px' }}>·</span>
                  <a href={`/blog/${post.enSlug}`} style={{ color: 'var(--text-3)', textDecoration: 'underline' }}>
                    {ui.readInEnglish}
                  </a>
                </>
              )}
            </div>
            <h1
              style={{
                fontSize: 'clamp(1.6rem,3.5vw,2.4rem)',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                lineHeight: 1.18,
                marginBottom: 14,
              }}
            >
              {post.title}
            </h1>
            <p style={{ fontSize: '1rem', color: 'var(--text-2)', lineHeight: 1.7, maxWidth: 600 }}>
              {post.excerpt}
            </p>
          </div>

          <SummaryBox summary={post.eli5} label={ui.eli5Label} description={ui.eli5Desc} />

          <div className="post-body" style={{ padding: '8px 0 32px' }}>
            <MDXRemote
              source={body}
              components={mdxComponents}
              options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
            />
          </div>

          {hasFaq && <FaqAccordion items={post.faq!} title={ui.faqTitle} />}
        </div>

        {alsoRead.length > 0 && (
          <div style={{ borderTop: '1px solid var(--border-1)', padding: '48px 32px 64px', maxWidth: 720, margin: '0 auto' }}>
            <div
              style={{
                fontFamily: 'var(--mono)',
                fontSize: '0.7rem',
                letterSpacing: '0.1em',
                color: 'var(--text-3)',
                fontWeight: 600,
                marginBottom: 24,
              }}
            >
              {ui.alsoRead}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid var(--border-1)', borderRadius: 10, overflow: 'hidden' }}>
              {alsoRead.map((related) => (
                <a
                  key={related.slug}
                  href={`/regional/${lang}/${related.slug}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '18px 20px',
                    background: 'var(--bg-0)',
                    borderBottom: '1px solid var(--border-1)',
                    textDecoration: 'none',
                    color: 'inherit',
                    gap: 16,
                  }}
                  className="also-read-link"
                >
                  <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-1)', lineHeight: 1.5 }}>
                    {related.title}
                  </span>
                  <span style={{ color: 'var(--text-3)', fontSize: '0.85rem', flexShrink: 0 }}>→</span>
                </a>
              ))}
            </div>
          </div>
        )}

        <RegionalDownloadCTA ui={ui} />
      </main>

      <Footer />

      <AppDownloadPopup
        title={ui.popupTitle}
        body={ui.popupBody}
        cta={ui.popupCta}
        dismiss={ui.popupDismiss}
      />

      <style>{`
        .post-body p { font-size: 1rem; line-height: 1.85; color: rgba(11,59,46,0.72); margin-bottom: 20px; }
        .post-body h2 { font-size: 1.4rem; font-weight: 700; color: #0b3b2e; margin: 36px 0 14px; letter-spacing: -0.01em; }
        .post-body h3 { font-size: 1.12rem; font-weight: 700; color: #0b3b2e; margin: 32px 0 12px; }
        .post-body strong { color: #0b3b2e; font-weight: 700; }
        .post-body a { color: #9b6810; text-decoration: underline; text-underline-offset: 3px; }
        .post-body img { max-width: 100%; height: auto; display: block; margin: 28px auto; border-radius: 12px; border: 1px solid rgba(11,59,46,0.12); }
        .post-body ul, .post-body ol { margin: 0 0 20px; padding-left: 20px; }
        .post-body li { font-size: 1rem; line-height: 1.8; color: rgba(11,59,46,0.74); margin-bottom: 6px; }
        .post-body li::marker { color: #9b6810; }
        .key-takeaways li, .callout-body li { color: #0b3b2e; }
        .callout-body p { font-size: 0.95rem; line-height: 1.75; color: rgba(11,59,46,0.8); margin: 0; }
        .post-body table { width: 100%; border-collapse: collapse; margin: 26px 0; font-size: 0.9rem; display: block; overflow-x: auto; }
        .post-body th, .post-body td { border: 1px solid rgba(11,59,46,0.14); padding: 9px 12px; text-align: left; vertical-align: top; }
        .post-body th { background: rgba(11,59,46,0.06); font-weight: 700; color: #0b3b2e; }
        .post-body tbody tr:nth-child(even) td { background: rgba(11,59,46,0.025); }
        .faq-accordion .faq-title { font-size: 1.4rem; font-weight: 700; color: #0b3b2e; margin: 24px 0 16px; }
        .faq-item { border: 1px solid rgba(11,59,46,0.12); border-radius: 10px; margin-bottom: 10px; background: #fff; overflow: hidden; }
        .faq-item .faq-summary { cursor: pointer; display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 16px 18px; font-weight: 600; color: #0b3b2e; font-size: 0.97rem; line-height: 1.5; width: 100%; text-align: left; border: none; background: none; }
        .faq-item .faq-summary:hover { background: rgba(11,59,46,0.03); }
        .faq-item[data-open] .faq-summary { background: rgba(11,59,46,0.03); }
        .faq-item .faq-question { flex: 1; }
        .faq-item .faq-icon { flex-shrink: 0; font-size: 1.25rem; line-height: 1; color: #9b6810; display: flex; align-items: center; }
        .faq-item .faq-answer-inner { padding: 16px 18px; }
        .faq-item .faq-answer-inner p { font-size: 0.95rem; line-height: 1.8; color: rgba(11,59,46,0.74); margin: 0; }
        .also-read-link:hover { background: rgba(11,59,46,0.04) !important; }
        .also-read-link:last-child { border-bottom: none !important; }
      `}</style>
    </>
  )
}
