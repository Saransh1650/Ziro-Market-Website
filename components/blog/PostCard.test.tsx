import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import PostCard from './PostCard'
import type { PostMeta } from '@/lib/blog'

const mockPost: PostMeta = {
  title: 'What is PE Ratio',
  slug: 'what-is-pe-ratio',
  date: '2026-06-05',
  category: 'terminology',
  excerpt: 'The most quoted number explained.',
  summary5yr: 'Some summary',
  tags: ['valuation'],
}

describe('PostCard', () => {
  it('renders title, excerpt, category and date', () => {
    render(<PostCard post={mockPost} />)
    expect(screen.getByText('What is PE Ratio')).toBeInTheDocument()
    expect(screen.getByText('The most quoted number explained.')).toBeInTheDocument()
    expect(screen.getByText('Terminology')).toBeInTheDocument()
    expect(screen.getByText(/June 5, 2026/)).toBeInTheDocument()
  })

  it('links to the correct slug', () => {
    render(<PostCard post={mockPost} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/blog/what-is-pe-ratio')
  })
})
