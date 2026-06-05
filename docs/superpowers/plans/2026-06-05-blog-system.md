# Blog System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a fully-automated daily blog to ziromarket.com — MDX posts written by a Claude cron agent, statically rendered by Next.js, deployed by Vercel on every push.

**Architecture:** MDX files in `content/blog/` are parsed at build time by `lib/blog.ts` (gray-matter for frontmatter, next-mdx-remote/rsc for rendering). The listing page is a server component that passes posts to a client component for category filtering. Individual post pages use `generateStaticParams` for static export. A daily Claude cron agent reads `content/blog/RULES.md` and `content/blog/TOPICS.md`, writes 2 new MDX files, updates TOPICS.md, commits, and pushes — triggering Vercel rebuild.

**Tech Stack:** Next.js 16 (App Router), gray-matter, next-mdx-remote, Vitest + @testing-library/react, Vercel (deploy on push)

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `content/blog/RULES.md` | Create | Writing rules the cron agent reads every run |
| `content/blog/TOPICS.md` | Create | Queue + done list, updated by agent after each run |
| `content/blog/what-is-pe-ratio.mdx` | Create | Sample post (also used for dev/test) |
| `content/blog/fii-vs-dii.mdx` | Create | Second sample post |
| `lib/blog.ts` | Create | `getAllPosts()`, `getPost()`, `getPostSlugs()` |
| `lib/__fixtures__/blog/sample-post.mdx` | Create | Test fixture only |
| `lib/blog.test.ts` | Create | Unit tests for lib/blog.ts |
| `components/blog/CategoryChip.tsx` | Create | Badge: Terminology / Event / Concept |
| `components/blog/PostCard.tsx` | Create | Card rendered on listing page |
| `components/blog/PostCard.test.tsx` | Create | Renders title, excerpt, category, date |
| `components/blog/BlogListing.tsx` | Create | `'use client'` — filter state + grid render |
| `components/blog/BlogListing.test.tsx` | Create | Filter chips show correct posts |
| `components/blog/SummaryBox.tsx` | Create | `'use client'` — 5-year toggle + amber box |
| `components/blog/SummaryBox.test.tsx` | Create | Toggle shows/hides summary content |
| `app/blog/page.tsx` | Create | Server component, listing page |
| `app/blog/[slug]/page.tsx` | Create | Server component, individual post |
| `components/layout/Nav.tsx` | Modify | Add "Learn" link → `/blog` |
| `app/sitemap.ts` | Modify | Add all blog post URLs |
| `.claude/blog/agent-prompt.md` | Create | Instructions the cron agent follows each run |

---

## Task 1: Install packages + scaffold

**Files:**
- No code files yet — just package installs and directory creation

- [ ] **Step 1: Install dependencies**

```bash
cd "/Users/saransh/Dev/Websites/Trade Insights Website"
npm install gray-matter next-mdx-remote
npm install --save-dev @types/gray-matter
```

Expected: `added N packages` with no errors.

- [ ] **Step 2: Create directories**

```bash
mkdir -p content/blog
mkdir -p lib/__fixtures__/blog
mkdir -p components/blog
mkdir -p app/blog
mkdir -p .claude/blog
```

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: install gray-matter and next-mdx-remote for blog"
```

---

## Task 2: Test fixture + `lib/blog.ts`

**Files:**
- Create: `lib/__fixtures__/blog/sample-post.mdx`
- Create: `lib/__fixtures__/blog/second-post.mdx`
- Create: `lib/blog.ts`
- Create: `lib/blog.test.ts`

- [ ] **Step 1: Create fixture MDX files**

Create `lib/__fixtures__/blog/sample-post.mdx`:

```mdx
---
title: "What is PE Ratio"
slug: "sample-post"
date: "2026-06-05"
category: "terminology"
excerpt: "The most quoted number in stock analysis, explained."
summary5yr: "PE ratio is how many rupees you pay per rupee earned. Zomato listed in 2021 with no earnings at all — effectively infinite PE. By 2024 it turned profitable."
tags: ["valuation", "fundamentals"]
---

Walk into any conversation about stocks and within thirty seconds someone will mention PE ratio.
```

Create `lib/__fixtures__/blog/second-post.mdx`:

```mdx
---
title: "FII vs DII"
slug: "second-post"
date: "2026-06-04"
category: "concept"
excerpt: "Foreign and domestic institutions have very different motivations."
summary5yr: "FIIs pulled Rs 1.5 lakh crore out of Indian equities in 2022 as US rates rose. DIIs absorbed most of it. Nifty fell 17% peak to trough but recovered within a year."
tags: ["institutions", "market-structure"]
---

Walk into any market discussion and someone will blame FIIs for the fall.
```

- [ ] **Step 2: Write the failing tests**

Create `lib/blog.test.ts`:

```typescript
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
```

- [ ] **Step 3: Run tests — expect failure**

```bash
npm test -- lib/blog.test.ts
```

Expected: FAIL — `Cannot find module './blog'`

- [ ] **Step 4: Implement `lib/blog.ts`**

Create `lib/blog.ts`:

```typescript
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog')

export type Category = 'terminology' | 'event' | 'concept'

export interface PostMeta {
  title: string
  slug: string
  date: string
  category: Category
  excerpt: string
  summary5yr: string
  tags: string[]
}

export interface Post extends PostMeta {
  content: string
}

export function getPostSlugs(dir = BLOG_DIR): string[] {
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''))
}

export function getAllPosts(dir = BLOG_DIR): PostMeta[] {
  return getPostSlugs(dir)
    .map((slug) => {
      const raw = fs.readFileSync(path.join(dir, `${slug}.mdx`), 'utf8')
      const { data } = matter(raw)
      return { ...(data as Omit<PostMeta, 'slug'>), slug }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPost(slug: string, dir = BLOG_DIR): Post | null {
  const filePath = path.join(dir, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null
  const raw = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(raw)
  return { ...(data as Omit<PostMeta, 'slug'>), slug, content }
}
```

- [ ] **Step 5: Run tests — expect pass**

```bash
npm test -- lib/blog.test.ts
```

Expected: 5 passing tests.

- [ ] **Step 6: Commit**

```bash
git add lib/blog.ts lib/blog.test.ts lib/__fixtures__/
git commit -m "feat: add lib/blog.ts with getAllPosts, getPost, getPostSlugs"
```

---

## Task 3: `CategoryChip` component

**Files:**
- Create: `components/blog/CategoryChip.tsx`

No separate test — purely presentational, covered by PostCard test.

- [ ] **Step 1: Create `components/blog/CategoryChip.tsx`**

```tsx
import type { Category } from '@/lib/blog'

const STYLES: Record<Category, { bg: string; color: string; label: string }> = {
  terminology: {
    bg: 'rgba(26,107,60,0.12)',
    color: '#1a6b3c',
    label: 'Terminology',
  },
  event: {
    bg: 'rgba(155,104,16,0.10)',
    color: '#9b6810',
    label: 'Event',
  },
  concept: {
    bg: 'rgba(11,59,46,0.08)',
    color: 'rgba(11,59,46,0.60)',
    label: 'Concept',
  },
}

export default function CategoryChip({ category }: { category: Category }) {
  const { bg, color, label } = STYLES[category]
  return (
    <span
      style={{
        fontFamily: 'var(--mono)',
        fontSize: '0.55rem',
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        padding: '3px 8px',
        borderRadius: 4,
        fontWeight: 600,
        background: bg,
        color,
      }}
    >
      {label}
    </span>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/blog/CategoryChip.tsx
git commit -m "feat: add CategoryChip component"
```

---

## Task 4: `PostCard` component

**Files:**
- Create: `components/blog/PostCard.tsx`
- Create: `components/blog/PostCard.test.tsx`

- [ ] **Step 1: Write failing test**

Create `components/blog/PostCard.test.tsx`:

```tsx
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
```

- [ ] **Step 2: Run — expect failure**

```bash
npm test -- components/blog/PostCard.test.tsx
```

Expected: FAIL — `Cannot find module './PostCard'`

- [ ] **Step 3: Implement `components/blog/PostCard.tsx`**

```tsx
import Link from 'next/link'
import CategoryChip from './CategoryChip'
import type { PostMeta } from '@/lib/blog'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
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
```

- [ ] **Step 4: Run — expect pass**

```bash
npm test -- components/blog/PostCard.test.tsx
```

Expected: 2 passing.

- [ ] **Step 5: Commit**

```bash
git add components/blog/PostCard.tsx components/blog/PostCard.test.tsx
git commit -m "feat: add PostCard component"
```

---

## Task 5: `BlogListing` component (client, filter state)

**Files:**
- Create: `components/blog/BlogListing.tsx`
- Create: `components/blog/BlogListing.test.tsx`

- [ ] **Step 1: Write failing test**

Create `components/blog/BlogListing.test.tsx`:

```tsx
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
    summary5yr: '',
    tags: [],
  },
  {
    title: 'RBI Rate Cut',
    slug: 'rbi-rate-cut',
    date: '2026-06-04',
    category: 'event',
    excerpt: 'Rate cut explained.',
    summary5yr: '',
    tags: [],
  },
  {
    title: 'How Circuit Breakers Work',
    slug: 'circuit-breakers',
    date: '2026-06-03',
    category: 'concept',
    excerpt: 'Circuit breakers explained.',
    summary5yr: '',
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
```

- [ ] **Step 2: Run — expect failure**

```bash
npm test -- components/blog/BlogListing.test.tsx
```

Expected: FAIL — `Cannot find module './BlogListing'`

- [ ] **Step 3: Implement `components/blog/BlogListing.tsx`**

```tsx
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
        {visible.map((post, i) => (
          <PostCard key={post.slug} post={post} featured={i === 0} />
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
```

- [ ] **Step 4: Run — expect pass**

```bash
npm test -- components/blog/BlogListing.test.tsx
```

Expected: 3 passing.

- [ ] **Step 5: Commit**

```bash
git add components/blog/BlogListing.tsx components/blog/BlogListing.test.tsx
git commit -m "feat: add BlogListing with category filter"
```

---

## Task 6: `SummaryBox` component (client, 5-year toggle)

**Files:**
- Create: `components/blog/SummaryBox.tsx`
- Create: `components/blog/SummaryBox.test.tsx`

- [ ] **Step 1: Write failing test**

Create `components/blog/SummaryBox.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import SummaryBox from './SummaryBox'

const summary = 'Zomato listed in 2021 with no earnings at all.'

describe('SummaryBox', () => {
  it('hides summary content by default', () => {
    render(<SummaryBox summary={summary} />)
    expect(screen.queryByText(summary)).not.toBeInTheDocument()
  })

  it('shows summary content after toggle is switched on', async () => {
    render(<SummaryBox summary={summary} />)
    await userEvent.click(screen.getByRole('checkbox'))
    expect(screen.getByText(summary)).toBeInTheDocument()
  })

  it('hides summary again after toggling off', async () => {
    render(<SummaryBox summary={summary} />)
    await userEvent.click(screen.getByRole('checkbox'))
    await userEvent.click(screen.getByRole('checkbox'))
    expect(screen.queryByText(summary)).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run — expect failure**

```bash
npm test -- components/blog/SummaryBox.test.tsx
```

Expected: FAIL — `Cannot find module './SummaryBox'`

- [ ] **Step 3: Implement `components/blog/SummaryBox.tsx`**

```tsx
'use client'
import { useState } from 'react'

export default function SummaryBox({ summary }: { summary: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 18px',
          background: 'rgba(11,59,46,0.05)',
          borderRadius: 8,
          margin: '28px 0',
          border: '1px solid rgba(11,59,46,0.10)',
        }}
      >
        <span style={{ fontSize: '0.82rem', color: 'var(--text-2)', fontWeight: 500 }}>
          <strong style={{ color: 'var(--text-1)' }}>5-year view</strong> — plain English
          summary with a recent Indian market example
        </span>
        <label style={{ position: 'relative', width: 42, height: 24, cursor: 'pointer', flexShrink: 0 }}>
          <input
            type="checkbox"
            checked={open}
            onChange={(e) => setOpen(e.target.checked)}
            style={{ opacity: 0, width: 0, height: 0 }}
            aria-label="Toggle 5-year view"
          />
          <span
            style={{
              position: 'absolute',
              inset: 0,
              background: open ? '#9b6810' : 'rgba(11,59,46,0.10)',
              borderRadius: 12,
              border: '1px solid rgba(11,59,46,0.20)',
              transition: 'background 0.2s',
            }}
          />
          <span
            style={{
              position: 'absolute',
              top: 3,
              left: open ? 21 : 3,
              width: 16,
              height: 16,
              borderRadius: '50%',
              background: '#fff',
              transition: 'left 0.2s',
              boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
            }}
          />
        </label>
      </div>

      {open && (
        <div
          style={{
            background: 'rgba(155,104,16,0.06)',
            border: '1px solid rgba(155,104,16,0.25)',
            borderRadius: 10,
            padding: '22px 24px',
            marginBottom: 32,
          }}
        >
          <div
            style={{
              fontFamily: 'var(--mono)',
              fontSize: '0.58rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#9b6810',
              fontWeight: 600,
              marginBottom: 10,
            }}
          >
            5-year view
          </div>
          <p style={{ fontSize: '0.9rem', lineHeight: 1.65, color: 'var(--text-1)', margin: 0 }}>
            {summary}
          </p>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Run — expect pass**

```bash
npm test -- components/blog/SummaryBox.test.tsx
```

Expected: 3 passing.

- [ ] **Step 5: Commit**

```bash
git add components/blog/SummaryBox.tsx components/blog/SummaryBox.test.tsx
git commit -m "feat: add SummaryBox with 5-year toggle"
```

---

## Task 7: Blog listing page — `app/blog/page.tsx`

**Files:**
- Create: `app/blog/page.tsx`

Server component — passes posts to `BlogListing`. No component test (integration tested via PostCard + BlogListing tests).

- [ ] **Step 1: Create `app/blog/page.tsx`**

```tsx
import type { Metadata } from 'next'
import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import BlogListing from '@/components/blog/BlogListing'
import { getAllPosts } from '@/lib/blog'

export const metadata: Metadata = {
  title: 'Learn — Ziro Market',
  description: 'Indian stock market concepts, events, and terminology explained in plain English. Two posts a day.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Learn — Ziro Market',
    description: 'Indian stock market explained in plain English. Two posts a day.',
    url: 'https://ziromarket.com/blog',
  },
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <>
      <Nav />
      <main>
        <section style={{ paddingTop: 72, borderBottom: '1px solid var(--border-1)' }}>
          <div className="container">
            <div style={{ paddingBottom: 48 }}>
              <div
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: '0.62rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--text-3)',
                  fontWeight: 600,
                  marginBottom: 16,
                }}
              >
                Ziro Market / Learn
              </div>
              <h1
                style={{
                  fontSize: 'clamp(2rem,4vw,3rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.025em',
                  lineHeight: 1.08,
                }}
              >
                Markets, <em style={{ fontStyle: 'normal', fontWeight: 300 }}>explained</em>
                <br />without the jargon.
              </h1>
              <p style={{ marginTop: 12, color: 'var(--text-2)', maxWidth: 480 }}>
                Two posts a day. Plain English. Real examples from the Indian market.
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="container">
            {posts.length === 0 ? (
              <p style={{ padding: '64px 0', color: 'var(--text-3)' }}>Posts coming soon.</p>
            ) : (
              <BlogListing posts={posts} />
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/blog/page.tsx
git commit -m "feat: add /blog listing page"
```

---

## Task 8: Individual post page — `app/blog/[slug]/page.tsx`

**Files:**
- Create: `app/blog/[slug]/page.tsx`

- [ ] **Step 1: Create `app/blog/[slug]/page.tsx`**

```tsx
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import CategoryChip from '@/components/blog/CategoryChip'
import SummaryBox from '@/components/blog/SummaryBox'
import { getPost, getPostSlugs } from '@/lib/blog'

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
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://ziromarket.com/blog/${slug}`,
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

  const formattedDate = new Date(post.date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <>
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

          <SummaryBox summary={post.summary5yr} />

          <div className="post-body" style={{ padding: '8px 0 64px' }}>
            <MDXRemote source={post.content} />
          </div>
        </div>
      </main>

      <Footer />

      <style>{`
        .post-body p { font-size: 0.97rem; line-height: 1.75; color: rgba(11,59,46,0.68); margin-bottom: 20px; }
        .post-body h2 { font-size: 1.35rem; font-weight: 700; color: #0b3b2e; margin: 36px 0 14px; letter-spacing: -0.015em; }
        .post-body h3 { font-size: 1.1rem; font-weight: 700; color: #0b3b2e; margin: 32px 0 12px; letter-spacing: -0.01em; }
        .post-body strong { color: #0b3b2e; font-weight: 600; }
        .post-body a { color: #9b6810; text-decoration: underline; text-underline-offset: 3px; }
      `}</style>
    </>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add "app/blog/[slug]/page.tsx"
git commit -m "feat: add /blog/[slug] individual post page"
```

---

## Task 9: Add "Learn" link to Nav

**Files:**
- Modify: `components/layout/Nav.tsx:6`

- [ ] **Step 1: Add Learn to LINKS array**

In `components/layout/Nav.tsx`, change the `LINKS` array from:

```typescript
const LINKS = [
  { href: '#features', label: 'App' },
  { href: '#pain',     label: 'Why' },
  { href: '#pivot',    label: 'Manifesto' },
];
```

To:

```typescript
const LINKS = [
  { href: '/#features',  label: 'App' },
  { href: '/#pain',      label: 'Why' },
  { href: '/#pivot',     label: 'Manifesto' },
  { href: '/blog',       label: 'Learn' },
];
```

Note: hash links prefixed with `/` so they work from the `/blog` route too.

- [ ] **Step 2: Run existing Nav test to verify no regression**

```bash
npm test -- components/layout/Nav.test.tsx
```

Expected: all passing.

- [ ] **Step 3: Commit**

```bash
git add components/layout/Nav.tsx
git commit -m "feat: add Learn nav link to /blog"
```

---

## Task 10: Update sitemap

**Files:**
- Modify: `app/sitemap.ts`

- [ ] **Step 1: Update `app/sitemap.ts`**

Replace the entire file:

```typescript
import { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/blog'

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts()

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `https://ziromarket.com/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [
    {
      url: 'https://ziromarket.com',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://ziromarket.com/blog',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...postEntries,
  ]
}
```

- [ ] **Step 2: Commit**

```bash
git add app/sitemap.ts
git commit -m "feat: add blog posts to sitemap"
```

---

## Task 11: Content files — RULES.md, TOPICS.md, and 2 real posts

**Files:**
- Create: `content/blog/RULES.md`
- Create: `content/blog/TOPICS.md`
- Create: `content/blog/what-is-pe-ratio.mdx`
- Create: `content/blog/fii-vs-dii.mdx`

- [ ] **Step 1: Create `content/blog/RULES.md`**

```markdown
# Blog Writing Rules

Read this file before writing every post. These rules exist to keep posts from reading like AI output.

## Voice

Write like a smart friend explaining the market over coffee. Not a textbook. Not a financial press release. Assume the reader is a curious 25-year-old who works in tech and invests but never studied finance formally.

## Structure rules

- No bullet point lists in the post body. Prose only. Section headings (## or ###) are fine.
- No conclusion section. End on a thought, not a summary of what you just said.
- Length: 700-900 words for the main body (not counting frontmatter).
- One blank line between paragraphs.

## Titles must be specific

Bad: "Understanding PE Ratio"
Good: "What is PE Ratio — and why did Zomato's 800x PE not scare everyone away?"

The title should name a real company, a real event, or pose a real question that a curious person would actually search for.

## Excerpts

One punchy sentence. Maximum 20 words. This appears on the listing card. Write it last.

## Banned punctuation

No em-dashes. Not a single one. If you wrote one, replace it with a comma or a period or rewrite the sentence.

## Banned phrases

Remove any of these on your quality check pass:

- "It's worth noting" / "it should be noted" / "it is important to note"
- "delve into" / "dive into"
- "comprehensive" / "leverage" / "utilize"
- "in conclusion" / "to summarize" / "in summary"
- "furthermore" / "moreover" / "additionally" / "importantly"
- "navigate" / "seamlessly" / "robust" / "game-changer" / "game changer"
- "landscape" / "realm" / "crucial" / "vital" / "pivotal"
- "in the world of" / "when it comes to"
- Passive: "it can be seen that" / "it is known that" / "it has been observed"

## Examples must be specific

Every factual claim needs a real anchor:
- Real company name (Zomato, HDFC Bank, Infosys — not "a major IT company" or "a large bank")
- Real numbers (Rs 76 IPO price, 25 bps rate cut — not "significant" or "substantial")
- Real dates or date ranges (July 2021, Q3 FY24, 2022-2023)

If you are not confident about a specific number, use a range or describe it directionally ("roughly halved", "between 12 and 15 percent") rather than guessing a wrong specific number.

## Indian market focus

Use NSE/BSE examples. Cite Indian companies. Use INR amounts. Reference SEBI, RBI, MPC where relevant. Avoid defaulting to US market examples.

## 5-year summary rules (the summary5yr frontmatter field)

Two paragraphs, written in the frontmatter as a YAML literal block (| operator).

Para 1: Plain English explanation. Zero jargon. Could be understood by someone who has never invested and doesn't know what BSE stands for. No em-dashes, no banned phrases.

Para 2: One specific 2020-2025 Indian market example. Must include: real company or event name, real number (price, percentage, crore amount), real time period. If the example needs two sentences, that's fine.

## Fact-checking

Before writing, verify any number or date you plan to use. If you are uncertain, use an approximate ("around Rs 70", "between 2021 and 2022") rather than a confident wrong figure. Never fabricate data.

## Quality check (run after writing, before committing)

Read the post back and check:
1. Does any sentence sound robotic? Rewrite it.
2. Is every example anchored to a real company, real number, real date?
3. Any em-dashes? Replace them.
4. Any banned phrase from the list above? Remove it.
5. Does summary5yr have two paragraphs — plain English + specific 2020-2025 example?
6. Is the title specific (names a company, event, or real question)?
7. Is word count between 700-900?
8. No conclusion section?
```

- [ ] **Step 2: Create `content/blog/TOPICS.md`**

```markdown
# Blog Topics

The cron agent picks the next 2 topics from the Queue each run, writes posts, then moves them to Done.

## Done

(none yet)

## Queue

### Terminology
- PE Ratio
- EPS (Earnings Per Share)
- EBITDA
- Market Cap
- Book Value vs Market Value
- Face Value
- Dividend yield
- Promoter holding
- Pledged shares
- Beta
- 52-week high and low
- P/B ratio (Price to Book)
- Debt-to-equity ratio
- Return on Equity (ROE)
- Return on Capital Employed (ROCE)
- Free cash flow
- Working capital
- Upper and lower circuit
- Delivery percentage
- Open Interest
- Call vs Put options
- Strike price
- Implied volatility
- PCR (Put-Call Ratio)
- India VIX
- Bulk deal vs block deal

### Events
- RBI June 2025 rate cut
- India JP Morgan bond index inclusion (2024)
- Union Budget 2024 capital gains tax change
- Adani FPO cancellation January 2023
- Nifty 50 all-time high 26277 September 2024
- SEBI F&O rules tightening October 2024
- LIC IPO May 2022
- Paytm payment bank crisis January 2024
- Zomato entering Nifty 50 (2024)
- Yes Bank rescue March 2020
- Reliance Rights Issue 2020
- Budget 2023 new tax regime
- RBI MPC rate hike cycle 2022-2023

### Concepts
- How circuit breakers work on NSE
- How IPOs are priced (book building process)
- FII vs DII — who actually moves Indian markets
- How Nifty 50 is calculated
- Why NSE and BSE prices differ
- How SEBI regulates markets
- What happens when a company goes bankrupt on NSE
- How mutual fund NAV is calculated
- Why SIP works mathematically (rupee cost averaging)
- T+1 settlement — what changed and why
- How stock splits work
- How buybacks work and why companies do them
- Short selling in India — what it is and why it's restricted
- How margin trading works
- Why promoters pledge shares and what it signals
```

- [ ] **Step 3: Create `content/blog/what-is-pe-ratio.mdx`**

```mdx
---
title: "What is PE ratio — and why did Zomato's 800x PE not scare everyone away?"
slug: "what-is-pe-ratio"
date: "2026-06-05"
category: "terminology"
excerpt: "The most quoted number in stock analysis, and why a high one isn't always bad."
summary5yr: |
  PE ratio is how many rupees you pay for every rupee a company earns in a year. A PE of 30 means you're paying Rs 30 for Rs 1 of profit. Lower PE can mean cheaper, but not always — a company growing fast often deserves a higher PE because tomorrow's earnings will be much bigger than today's.

  Zomato listed in July 2021 at Rs 76 per share with no profits at all, making its PE technically infinite. Investors paid anyway, betting that food delivery would scale. By Q2 FY24, Zomato reported its first quarterly profit. The stock had more than doubled from its post-listing lows by then, and the PE, though still high, was at least measurable.
tags: ["valuation", "fundamentals"]
---

Walk into any conversation about stocks and within thirty seconds someone will mention PE ratio. It gets thrown around as if it settles arguments: "too expensive, PE is 80" or "great value, PE is only 12." Most people using it have no idea why those numbers matter, or when they are completely misleading.

PE stands for price-to-earnings. The price part is straightforward — what one share costs right now on the exchange. The earnings part is the company's net profit divided by total shares, giving you earnings per share (EPS). Divide the share price by EPS and you get the ratio.

Think of PE as how many years of current profits you are paying for upfront. A PE of 20 means you are paying twenty years of today's earnings. If nothing changes and the company returns all its profits as dividends, you break even in twenty years. Obviously things do change. Companies grow, shrink, get disrupted, acquire competitors. Which is exactly why PE is a starting point, not a conclusion.

## When high PE makes complete sense

HDFC Bank traded at 30 to 35 times earnings for most of the decade before 2022. Every year, analysts called it expensive. Every year, the bank grew its earnings at 18 to 20 percent, and the stock kept compounding. Investors who avoided it because the PE looked high missed one of the most reliable wealth creators in Indian market history.

The logic is simple. If a company is growing earnings at 25 percent annually, paying 50 times today's earnings might be perfectly reasonable. Those earnings will double in three years and double again in six. The PE collapses on its own as profits catch up to the price.

This is why fast-growing consumer tech, pharma, and IT companies often trade at higher multiples than, say, a PSU bank. Investors are paying for future earnings, not just the current year's number.

## When PE is useless

PE breaks down the moment earnings turn negative or approach zero. Loss-making companies, businesses in a cyclical trough, or companies undergoing restructuring all produce PE numbers that mean nothing. Indigo Airlines posted a massive loss during Covid. Paytm burned cash for years after its 2021 IPO. Using PE to evaluate either of those in bad years would tell you nothing useful.

The other failure mode is when one-time items distort earnings. A company might sell a factory and post extraordinary profit for one year, making the PE look cheap. Or it might take a large write-down and look expensive. Always check whether the earnings number reflects the actual business or just an accounting event.

## Forward PE vs trailing PE

The standard PE uses the last twelve months of earnings. Forward PE uses analyst estimates of the next twelve months. Neither is perfectly accurate, but forward PE is often more useful for fast-growing companies because it reflects where the business is headed.

Nifty 50 itself trades at a PE. Historically, the index has averaged around 20 to 22 times trailing earnings. When it crosses 25, markets are pricing in optimism. When it falls below 15, fear is doing the pricing. Neither automatically means buy or sell, but it gives context.

The PE ratio is one lens. A company with a low PE and shrinking profits is not a bargain. A company with a high PE and accelerating growth might be the best investment available. The number only makes sense alongside the growth story behind it.
```

- [ ] **Step 4: Create `content/blog/fii-vs-dii.mdx`**

```mdx
---
title: "FII vs DII — who actually moves Indian markets, and who protects them"
slug: "fii-vs-dii"
date: "2026-06-05"
category: "concept"
excerpt: "Foreign and domestic institutions move in opposite directions more often than you'd think."
summary5yr: |
  FIIs are foreign funds investing in Indian stocks. DIIs are domestic funds — mutual funds, insurance companies, pension funds. When one sells heavily, the other often buys. This keeps markets from free-falling when foreign money leaves.

  In calendar year 2022, FIIs sold over Rs 1.2 lakh crore worth of Indian equities as the US Federal Reserve raised rates aggressively and global risk appetite collapsed. DIIs absorbed most of that selling, buying around Rs 2.1 lakh crore that year. Nifty 50 fell roughly 17 percent from its October 2021 high but recovered fully within twelve months, partly because domestic buyers stepped in consistently.
tags: ["institutions", "market-structure", "flows"]
---

When the market drops 2 percent in a session and the financial news cycle scrambles for a reason, the explanation usually lands on one of two things: FII selling or DII buying. Both get treated like monolithic forces pushing indices around. The reality is more interesting.

FII stands for Foreign Institutional Investor. These are overseas funds, hedge funds, sovereign wealth funds, and pension managers who invest in Indian markets from abroad. They have to convert foreign currency into rupees to buy Indian stocks, which means their activity also influences the rupee exchange rate. DII stands for Domestic Institutional Investor. This bucket includes Indian mutual funds, insurance companies like LIC, EPFO, and pension funds that invest domestically.

The key difference is motivation. FIIs are global allocators. When something changes in the United States — a rate hike, a recession scare, a stronger dollar — they often pull money from emerging markets like India and park it somewhere safer. Their decision to sell Infosys or Reliance has almost nothing to do with those companies specifically. It is a portfolio adjustment driven by global macro forces thousands of kilometres away.

DIIs operate on a completely different clock. Mutual funds receive SIP inflows every month regardless of what the market is doing. A retail investor in Pune who started a Rs 5,000 monthly SIP in 2020 keeps paying it whether Nifty is at 15,000 or 25,000. That money has to go somewhere, and it mostly goes into large-cap Indian stocks. Insurance companies similarly collect premiums consistently and deploy them over long horizons.

## Why they move in opposite directions

This structural difference creates a natural counterweight. When global fear spikes and FIIs sell Indian equities, DII buying absorbs a significant chunk of that supply. The market still falls, but not as much as it would if domestic buyers disappeared too.

The 2022 episode is instructive. The US Fed raised rates by 425 basis points across the year, one of the fastest tightening cycles in decades. Emerging market currencies and equities sold off globally. FIIs pulled substantial capital out of India. Indian mutual funds simultaneously saw record SIP inflows — retail investors, conditioned by the 2020-2021 bull run, kept buying the dip. The Nifty 50 fell significantly less than most emerging market peers and recovered faster.

This dynamic has strengthened over time as SIP penetration has grown. Monthly SIP inflows crossed Rs 20,000 crore by 2023 and kept climbing. That consistent, recurring domestic capital has made Indian markets meaningfully more stable against foreign outflows than they were a decade ago.

## What to watch

FII and DII activity is published daily by SEBI and NSE. The numbers show net buying or selling in equity cash markets. On any given day, if FIIs are net sellers by Rs 3,000 crore and DIIs are net buyers by Rs 2,500 crore, the market absorbed most of the foreign selling domestically.

Sustained FII selling over multiple weeks, without matching DII absorption, is worth paying attention to. It can signal a deeper shift in global risk sentiment or India-specific concerns about currency, growth, or policy. But a single day of heavy FII outflow usually tells you very little about where the market goes next.

The interplay between these two forces is one of the more underrated dynamics in Indian markets. Neither is always right, and neither moves based solely on what individual companies deserve. Understanding why each group acts is more useful than watching the raw numbers.
```

- [ ] **Step 5: Move PE Ratio and FII vs DII from Queue to Done in TOPICS.md**

Update `content/blog/TOPICS.md` — move those two topics to the Done section:

```markdown
## Done

- PE Ratio (2026-06-05) → what-is-pe-ratio.mdx
- FII vs DII (2026-06-05) → fii-vs-dii.mdx
```

- [ ] **Step 6: Commit all content**

```bash
git add content/blog/
git commit -m "blog: add RULES, TOPICS queue, and first 2 posts (PE ratio, FII vs DII)"
```

---

## Task 12: Agent prompt + schedule automation

**Files:**
- Create: `.claude/blog/agent-prompt.md`

- [ ] **Step 1: Create `.claude/blog/agent-prompt.md`**

```markdown
# Daily Blog Agent

You are the Ziro Market blog agent. Your job: write 2 new blog posts, commit them, and push to trigger a Vercel deploy.

## Steps

1. Read `content/blog/RULES.md` — these are the writing rules. Follow every rule.
2. Read `content/blog/TOPICS.md` — pick the next 2 topics from the Queue section.
3. For each topic:
   a. Write the MDX file. Slug = topic name in kebab-case.
   b. Follow every rule in RULES.md (no em-dashes, no banned phrases, 700-900 words, specific examples with real numbers).
   c. Run quality check mentally before saving.
   d. Save to `content/blog/<slug>.mdx`.
4. Update `content/blog/TOPICS.md`:
   - Move both topics from Queue to Done.
   - Add: `- <Topic Name> (<today's date>) → <slug>.mdx`
5. Commit: `git add content/blog/ && git commit -m "blog: add <topic1> and <topic2>"`
6. Push: `git push origin main`

## Rules reminder

- No em-dashes. Not one.
- No AI phrases from the banned list in RULES.md.
- Every example: real company name, real number, real date.
- summary5yr: 2 paragraphs. Para 1 = plain English, Para 2 = 2020-2025 Indian market example with real numbers.
- 700-900 words.
- No conclusion section.
- Title must name a company, event, or real question.

## Today's date

Today is {{ date }}. Use this in the frontmatter `date` field.
```

- [ ] **Step 2: Set up the daily schedule using /schedule skill**

Invoke `/schedule` with the following configuration:

- **Name:** `ziro-blog-daily`
- **Schedule:** `30 2 * * *` (8:00 AM IST = 02:30 UTC)
- **Prompt:** Read `.claude/blog/agent-prompt.md` and execute it for today's date. Working directory: `/Users/saransh/Dev/Websites/Trade Insights Website`.
- **Description:** Writes 2 Indian stock market blog posts, commits, and pushes to trigger Vercel deploy.

- [ ] **Step 3: Commit agent prompt**

```bash
git add .claude/blog/agent-prompt.md
git commit -m "chore: add blog agent prompt for daily cron"
```

---

## Task 13: Run full test suite + verify build

- [ ] **Step 1: Run all tests**

```bash
cd "/Users/saransh/Dev/Websites/Trade Insights Website"
npm test
```

Expected: all tests pass, none failing.

- [ ] **Step 2: Run type check**

```bash
npm run typecheck
```

Expected: no TypeScript errors.

- [ ] **Step 3: Run build**

```bash
npm run build
```

Expected: build completes, `/blog` and `/blog/what-is-pe-ratio` and `/blog/fii-vs-dii` appear in the static output.

- [ ] **Step 4: Push everything**

```bash
git push origin main
```

Expected: Vercel picks up the push and deploys.

---

## Self-Review

**Spec coverage check:**

| Spec requirement | Task |
|---|---|
| `/blog` route with listing page | Task 7 |
| "Learn" in nav | Task 9 |
| MDX files in `content/blog/` | Task 2, 11 |
| Frontmatter schema (title, slug, date, category, excerpt, summary5yr, tags) | Task 2 |
| 3-column grid, featured first post | Task 5 (BlogListing) |
| Category filter chips | Task 5 (BlogListing) |
| Individual post at `/blog/[slug]` | Task 8 |
| 5-year toggle shows amber summary box | Task 6 (SummaryBox) |
| Summary hidden by default | Task 6 |
| `RULES.md` with full writing rules | Task 11 |
| `TOPICS.md` with queue + done list | Task 11 |
| Sitemap updated | Task 10 |
| generateStaticParams for static export | Task 8 |
| Daily cron agent | Task 12 |
| Agent reads RULES.md + TOPICS.md each run | Task 12 |
| Agent commits + pushes after writing | Task 12 |

All requirements covered.
