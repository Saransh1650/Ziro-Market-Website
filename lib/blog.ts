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
      if (!data.title || !data.date) {
        throw new Error(`${slug}.mdx is missing required frontmatter (title, date)`)
      }
      return { ...(data as Omit<PostMeta, 'slug'>), slug }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPost(slug: string, dir = BLOG_DIR): Post | null {
  const filePath = path.join(dir, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null
  const raw = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(raw)
  if (!data.title || !data.date) {
    throw new Error(`${slug}.mdx is missing required frontmatter (title, date)`)
  }
  return { ...(data as Omit<PostMeta, 'slug'>), slug, content }
}
