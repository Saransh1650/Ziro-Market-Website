import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import BlogListing from './BlogListing'
import type { PostMeta } from '@/lib/blog'

const posts: PostMeta[] = [
  {
    title: 'What is PE Ratio',
    slug: 'pe-ratio',
    date: '2026-06-05',
    category: 'terminology',
    excerpt: 'PE explained.',
    eli5: '',
    tags: [],
  },
  {
    title: 'RBI Rate Cut',
    slug: 'rbi-rate-cut',
    date: '2026-06-04',
    category: 'event',
    excerpt: 'Rate cut explained.',
    eli5: '',
    tags: [],
  },
  {
    title: 'How Circuit Breakers Work',
    slug: 'circuit-breakers',
    date: '2026-06-03',
    category: 'concept',
    excerpt: 'Circuit breakers explained.',
    eli5: '',
    tags: [],
  },
]

describe('BlogListing', () => {
  it('shows all posts when All is selected', () => {
    render(<BlogListing posts={posts} />)
    expect(screen.getByText('What is PE Ratio')).toBeInTheDocument()
    expect(screen.getByText('RBI Rate Cut')).toBeInTheDocument()
    expect(screen.getByText('How Circuit Breakers Work')).toBeInTheDocument()
  })

  it('filters to only terminology posts when chip clicked', async () => {
    render(<BlogListing posts={posts} />)
    await userEvent.click(screen.getByRole('button', { name: /terminology/i }))
    expect(screen.getByText('What is PE Ratio')).toBeInTheDocument()
    expect(screen.queryByText('RBI Rate Cut')).not.toBeInTheDocument()
    expect(screen.queryByText('How Circuit Breakers Work')).not.toBeInTheDocument()
  })

  it('clicking All restores all posts', async () => {
    render(<BlogListing posts={posts} />)
    await userEvent.click(screen.getByRole('button', { name: /terminology/i }))
    await userEvent.click(screen.getByRole('button', { name: /^all$/i }))
    expect(screen.getByText('RBI Rate Cut')).toBeInTheDocument()
  })
})
