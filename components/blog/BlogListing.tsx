'use client'
import { useState } from 'react'
import PostCard from './PostCard'
import type { PostMeta, Category } from '@/lib/blog'

type Filter = 'all' | Category

const CHIPS: { label: string; value: Filter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Terminology', value: 'terminology' },
  { label: 'Events', value: 'event' },
  { label: 'Concepts', value: 'concept' },
]

export default function BlogListing({ posts }: { posts: PostMeta[] }) {
  const [filter, setFilter] = useState<Filter>('all')
  const visible = filter === 'all' ? posts : posts.filter((p) => p.category === filter)

  return (
    <div>
      <div
        style={{
          display: 'flex',
          gap: 8,
          padding: '28px 0 32px',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--mono)',
            fontSize: '0.6rem',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--text-3)',
            marginRight: 4,
          }}
        >
          Filter
        </span>
        {CHIPS.map((chip) => (
          <button
            key={chip.value}
            onClick={() => setFilter(chip.value)}
            style={{
              padding: '5px 12px',
              borderRadius: 20,
              fontSize: '0.75rem',
              fontWeight: 500,
              border: '1px solid var(--border-2)',
              color: filter === chip.value ? '#fff' : 'var(--text-2)',
              background: filter === chip.value ? 'var(--text-1)' : 'transparent',
              cursor: 'pointer',
            }}
          >
            {chip.label}
          </button>
        ))}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1px',
          background: 'var(--border-1)',
          border: '1px solid var(--border-1)',
          borderRadius: 12,
          overflow: 'hidden',
          marginBottom: 64,
        }}
      >
        {visible.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
        {visible.length % 3 !== 0 &&
          Array.from({ length: 3 - (visible.length % 3) }).map((_, i) => (
            <div key={`empty-${i}`} style={{ background: 'var(--bg-0)' }} />
          ))}
      </div>

      <style>{`
        .post-card { transition: background 0.15s; }
        .post-card:hover { background: rgba(11,59,46,0.05) !important; }
        @media (max-width: 768px) {
          [style*="repeat(3"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
