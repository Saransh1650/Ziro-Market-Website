import Link from 'next/link'
import CategoryChip from './CategoryChip'
import type { PostMeta } from '@/lib/blog'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function PostCard({ post, featured = false }: { post: PostMeta; featured?: boolean }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      style={{
        background: featured ? 'rgba(11,59,46,0.05)' : 'var(--bg-0)',
        padding: 28,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        textDecoration: 'none',
        color: 'inherit',
        gridColumn: featured ? 'span 2' : undefined,
      }}
      className="post-card"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <CategoryChip category={post.category} />
        <span
          style={{
            fontFamily: 'var(--mono)',
            fontSize: '0.6rem',
            color: 'var(--text-3)',
            letterSpacing: '0.06em',
          }}
        >
          {formatDate(post.date)}
        </span>
      </div>
      <div
        style={{
          fontSize: featured ? '1.35rem' : '1.05rem',
          fontWeight: 700,
          lineHeight: 1.3,
          letterSpacing: '-0.01em',
          color: 'var(--text-1)',
        }}
      >
        {post.title}
      </div>
      <div
        style={{
          fontSize: featured ? '0.9rem' : '0.83rem',
          color: 'var(--text-2)',
          lineHeight: 1.55,
          flex: 1,
        }}
      >
        {post.excerpt}
      </div>
      <div style={{ fontSize: '0.78rem', color: 'var(--text-3)', fontWeight: 500 }}>
        Read →
      </div>
    </Link>
  )
}
