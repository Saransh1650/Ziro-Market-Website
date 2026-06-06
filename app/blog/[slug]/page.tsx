import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import CategoryChip from '@/components/blog/CategoryChip'
import SummaryBox from '@/components/blog/SummaryBox'
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
  return {
    title: `${post.title} — Ziro Market`,
    description: post.excerpt,
    keywords: [...post.tags, 'Indian stock market', 'NSE', 'BSE', 'Ziro Market'],
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://ziromarket.com/blog/${slug}`,
      type: 'article',
      publishedTime: post.date,
      tags: post.tags,
      siteName: 'Ziro Market',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
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

  const allPosts = getAllPosts()
  const sameCategory = allPosts.filter((p) => p.slug !== slug && p.category === post.category)
  const others = allPosts.filter((p) => p.slug !== slug && p.category !== post.category)
  const alsoRead = [...sameCategory, ...others].slice(0, 3)

  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { '@type': 'Organization', name: 'Ziro Market', url: 'https://ziromarket.com' },
    publisher: { '@type': 'Organization', name: 'Ziro Market', url: 'https://ziromarket.com' },
    url: `https://ziromarket.com/blog/${slug}`,
    mainEntityOfPage: `https://ziromarket.com/blog/${slug}`,
    keywords: post.tags.join(', '),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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

          <div className="post-body" style={{ padding: '8px 0 48px' }}>
            <MDXRemote source={post.content} />
          </div>
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
                    padding: '16px 20px',
                    background: 'var(--bg-0)',
                    borderBottom: '1px solid var(--border-1)',
                    textDecoration: 'none',
                    color: 'inherit',
                    gap: 16,
                    transition: 'background 0.15s',
                  }}
                  className="also-read-link"
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flex: 1, minWidth: 0 }}>
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
      </main>

      <Footer />

      <style>{`
        .post-body p { font-size: 0.97rem; line-height: 1.75; color: rgba(11,59,46,0.68); margin-bottom: 20px; }
        .post-body h2 { font-size: 1.35rem; font-weight: 700; color: #0b3b2e; margin: 36px 0 14px; letter-spacing: -0.015em; }
        .post-body h3 { font-size: 1.1rem; font-weight: 700; color: #0b3b2e; margin: 32px 0 12px; letter-spacing: -0.01em; }
        .post-body strong { color: #0b3b2e; font-weight: 600; }
        .post-body a { color: #9b6810; text-decoration: underline; text-underline-offset: 3px; }
        .also-read-link:hover { background: rgba(11,59,46,0.04) !important; }
        .also-read-link:last-child { border-bottom: none !important; }
      `}</style>
    </>
  )
}
