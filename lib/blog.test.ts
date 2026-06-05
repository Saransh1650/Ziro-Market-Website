import { describe, it, expect } from 'vitest'
import path from 'path'
import { getAllPosts, getPost, getPostSlugs } from './blog'

const FIXTURES_DIR = path.resolve(__dirname, '__fixtures__/blog')

describe('getPostSlugs', () => {
  it('returns slugs for all mdx files in dir', () => {
    const slugs = getPostSlugs(FIXTURES_DIR)
    expect(slugs).toContain('sample-post')
    expect(slugs).toContain('second-post')
    expect(slugs.every((s) => !s.endsWith('.mdx'))).toBe(true)
  })
})

describe('getAllPosts', () => {
  it('returns posts sorted newest first', () => {
    const posts = getAllPosts(FIXTURES_DIR)
    expect(posts.length).toBe(2)
    expect(posts[0].date >= posts[1].date).toBe(true)
  })

  it('parses frontmatter fields correctly', () => {
    const posts = getAllPosts(FIXTURES_DIR)
    const pe = posts.find((p) => p.slug === 'sample-post')!
    expect(pe.title).toBe('What is PE Ratio')
    expect(pe.category).toBe('terminology')
    expect(pe.excerpt).toMatch(/most quoted/)
    expect(pe.summary5yr).toMatch(/Zomato/)
    expect(pe.tags).toContain('valuation')
  })
})

describe('getPost', () => {
  it('returns post with content for valid slug', () => {
    const post = getPost('sample-post', FIXTURES_DIR)
    expect(post).not.toBeNull()
    expect(post!.title).toBe('What is PE Ratio')
    expect(post!.content).toMatch(/PE ratio/)
  })

  it('returns null for unknown slug', () => {
    const post = getPost('does-not-exist', FIXTURES_DIR)
    expect(post).toBeNull()
  })
})
