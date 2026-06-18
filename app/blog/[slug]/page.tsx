import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import CategoryChip from '@/components/blog/CategoryChip'
import SummaryBox from '@/components/blog/SummaryBox'
import DownloadCTA from '@/components/blog/DownloadCTA'
import FaqAccordion from '@/components/blog/FaqAccordion'
import { mdxComponents } from '@/components/blog/MdxComponents'
import { getPost, getPostSlugs, getAllPosts } from '@/lib/blog'

export async function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return {}
  // SEO <title> tag follows the "Target keywords | Benefit | Brand" format.
  // The "| Ziro Market" suffix is appended automatically by the root layout's
  // title.template, so we only set the keywords|benefit half here.
  // Falls back to the readable headline if a post has no dedicated seoTitle.
  const seoTitle = post.seoTitle ?? post.title
  return {
    title: seoTitle,
    description: post.excerpt,
    keywords: [...post.tags, 'Indian stock market', 'NSE', 'BSE', 'Ziro Market'],
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.seoTitle ?? post.title,
      description: post.excerpt,
      url: `https://ziromarket.com/blog/${slug}`,
      type: 'article',
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

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  // The FAQ is rendered once as an interactive accordion from frontmatter.
  // Strip any duplicate "## Frequently Asked Questions" section from the body so
  // it is not shown twice.
  const hasFaq = Boolean(post.faq && post.faq.length > 0)
  const body = hasFaq
    ? post.content.split(/\n#{2,3}\s*Frequently Asked Questions[^\n]*\n/i)[0].trimEnd()
    : post.content

  const allPosts = getAllPosts()
  const sameCategory = allPosts.filter((p) => p.slug !== slug && p.category === post.category)
  const others = allPosts.filter((p) => p.slug !== slug && p.category !== post.category)
  const alsoRead = [...sameCategory, ...others].slice(0, 3)

  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    image: {
      '@type': 'ImageObject',
      url: `https://ziromarket.com/blog/${slug}/opengraph-image`,
      width: 1200,
      height: 630,
    },
    author: { '@type': 'Organization', name: 'Ziro Market', url: 'https://ziromarket.com' },
    publisher: {
      '@type': 'Organization',
      name: 'Ziro Market',
      url: 'https://ziromarket.com',
      logo: { '@type': 'ImageObject', url: 'https://ziromarket.com/favicon/android-chrome-192x192.png' },
    },
    url: `https://ziromarket.com/blog/${slug}`,
    mainEntityOfPage: `https://ziromarket.com/blog/${slug}`,
    keywords: post.tags.join(', '),
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ziromarket.com' },
      { '@type': 'ListItem', position: 2, name: 'Learn', item: 'https://ziromarket.com/blog' },
      { '@type': 'ListItem', position: 3, name: post.title, item: `https://ziromarket.com/blog/${slug}` },
    ],
  }

  const faqJsonLd = post.faq && post.faq.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: post.faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  } : null

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <Nav />
      <main>
        <div
          style={{
            maxWidth: 720,
            margin: '0 auto',
            padding: '0 32px',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--mono)',
              fontSize: '0.62rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--text-3)',
              padding: '28px 0 0',
            }}
          >
            <a href="/" style={{ color: 'var(--text-3)' }}>
              Home
            </a>
            <span style={{ margin: '0 6px' }}>/</span>
            <a href="/blog" style={{ color: 'var(--text-3)' }}>
              Learn
            </a>
            <span style={{ margin: '0 6px' }}>/</span>
            {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
          </div>

          <div
            style={{
              padding: '24px 0 32px',
              borderBottom: '1px solid var(--border-1)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <CategoryChip category={post.category} />
              <span
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: '0.62rem',
                  color: 'var(--text-3)',
                }}
              >
                {formattedDate}
              </span>
            </div>
            <h1
              style={{
                fontSize: 'clamp(1.6rem,3.5vw,2.4rem)',
                fontWeight: 800,
                letterSpacing: '-0.025em',
                lineHeight: 1.12,
                marginBottom: 14,
              }}
            >
              {post.title}
            </h1>
            <p style={{ fontSize: '1rem', color: 'var(--text-2)', lineHeight: 1.6, maxWidth: 600 }}>
              {post.excerpt}
            </p>
          </div>

          <SummaryBox summary={post.eli5} />

          <div className="post-body" style={{ padding: '8px 0 32px' }}>
            <MDXRemote
              source={body}
              components={mdxComponents}
              options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
            />
          </div>

          {hasFaq && <FaqAccordion items={post.faq!} />}
        </div>

        {alsoRead.length > 0 && (
          <div
            style={{
              borderTop: '1px solid var(--border-1)',
              padding: '48px 32px 64px',
              maxWidth: 720,
              margin: '0 auto',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--mono)',
                fontSize: '0.6rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--text-3)',
                fontWeight: 600,
                marginBottom: 24,
              }}
            >
              Also Read
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1, border: '1px solid var(--border-1)', borderRadius: 10, overflow: 'hidden' }}>
              {alsoRead.map((related) => (
                <a
                  key={related.slug}
                  href={`/blog/${related.slug}`}
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
                    transition: 'background 0.15s',
                  }}
                  className="also-read-link"
                >
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8, flex: 1, minWidth: 0 }}>
                    <CategoryChip category={related.category} />
                    <span
                      style={{
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        color: 'var(--text-1)',
                        letterSpacing: '-0.01em',
                        lineHeight: 1.4,
                      }}
                    >
                      {related.title}
                    </span>
                  </div>
                  <span style={{ color: 'var(--text-3)', fontSize: '0.85rem', flexShrink: 0 }}>→</span>
                </a>
              ))}
            </div>
          </div>
        )}

        <DownloadCTA />
      </main>

      <Footer />

      <style>{`
        .post-body p { font-size: 0.97rem; line-height: 1.75; color: rgba(11,59,46,0.68); margin-bottom: 20px; }
        .post-body h2 { font-size: 1.35rem; font-weight: 700; color: #0b3b2e; margin: 36px 0 14px; letter-spacing: -0.015em; }
        .post-body h3 { font-size: 1.1rem; font-weight: 700; color: #0b3b2e; margin: 32px 0 12px; letter-spacing: -0.01em; }
        .post-body strong { color: #0b3b2e; font-weight: 600; }
        .post-body a { color: #9b6810; text-decoration: underline; text-underline-offset: 3px; }
        .post-body img { max-width: 100%; height: auto; display: block; margin: 28px auto; border-radius: 12px; border: 1px solid rgba(11,59,46,0.12); }
        .post-body ul, .post-body ol { margin: 0 0 20px; padding-left: 20px; }
        .post-body li { font-size: 0.97rem; line-height: 1.7; color: rgba(11,59,46,0.72); margin-bottom: 6px; }
        .post-body li::marker { color: #9b6810; }
        .key-takeaways ul, .callout-body ul { margin: 0; }
        .key-takeaways li, .callout-body li { color: #0b3b2e; }
        .callout-body p { font-size: 0.92rem; line-height: 1.65; color: rgba(11,59,46,0.78); margin: 0; }
        .post-body blockquote { margin: 24px 0; padding: 4px 0 4px 18px; border-left: 3px solid #9b6810; color: #0b3b2e; font-style: italic; }
        .post-body table { width: 100%; border-collapse: collapse; margin: 26px 0; font-size: 0.86rem; display: block; overflow-x: auto; }
        .post-body th, .post-body td { border: 1px solid rgba(11,59,46,0.14); padding: 9px 12px; text-align: left; vertical-align: top; }
        .post-body th { background: rgba(11,59,46,0.06); font-weight: 700; color: #0b3b2e; }
        .post-body tbody tr:nth-child(even) td { background: rgba(11,59,46,0.025); }
        .faq-accordion { margin: 8px 0 16px; }
        .faq-accordion .faq-title { font-size: 1.35rem; font-weight: 700; color: #0b3b2e; margin: 24px 0 16px; letter-spacing: -0.015em; }
        .faq-item { border: 1px solid rgba(11,59,46,0.12); border-radius: 10px; margin-bottom: 10px; background: #fff; overflow: hidden; }
        .faq-item summary { cursor: pointer; list-style: none; padding: 16px 46px 16px 18px; font-weight: 600; color: #0b3b2e; position: relative; font-size: 0.95rem; line-height: 1.45; transition: background 0.15s; }
        .faq-item summary::-webkit-details-marker { display: none; }
        .faq-item summary:hover { background: rgba(11,59,46,0.03); }
        .faq-item summary::after { content: '+'; position: absolute; right: 18px; top: 14px; font-size: 1.25rem; line-height: 1; color: #9b6810; font-weight: 400; transition: transform 0.2s; }
        .faq-item[open] summary::after { content: '\\2212'; }
        .faq-item[open] summary { background: rgba(11,59,46,0.03); }
        .faq-item .faq-answer { padding: 0 18px 16px; }
        .faq-item .faq-answer p { font-size: 0.92rem; line-height: 1.7; color: rgba(11,59,46,0.72); margin: 0; }
        .also-read-link:hover { background: rgba(11,59,46,0.04) !important; }
        .also-read-link:last-child { border-bottom: none !important; }
      `}</style>
    </>
  )
}
