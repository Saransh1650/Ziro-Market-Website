// Shared LinkedIn content builder used by both the drafts previewer
// (linkedin-drafts.mjs) and the auto-poster (linkedin-post.mjs).
// One source of truth for how a blog post becomes a LinkedIn post.

import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

export const SITE = 'https://www.ziromarket.com'
const BLOG_DIR = path.join(process.cwd(), 'content', 'blog')

export const blogLink = (slug) =>
  `${SITE}/blog/${slug}?utm_source=linkedin&utm_medium=social&utm_campaign=blog&utm_content=${slug}`
export const appLink = (slug) =>
  `${SITE}/download?utm_source=linkedin&utm_medium=social&utm_campaign=app_install&utm_content=${slug}`

const HASHTAG_OVERRIDES = {
  rbi: 'RBI', fii: 'FII', dii: 'DII', ai: 'AI', ipo: 'IPO', it: 'IT',
  'it-stocks': 'ITStocks', 'us-fed': 'Fed', ev: 'EV', gst: 'GST', sip: 'SIP',
  nifty: 'Nifty50', 'usd-inr': 'USDINR', btc: 'Bitcoin', eth: 'Ethereum',
  'new-age': 'NewAge', 'quick-commerce': 'QuickCommerce', 'market-today': 'StockMarket',
}
const CORE_TAGS = ['StockMarket', 'Investing', 'ZiroMarket']

function toHashtag(tag) {
  if (HASHTAG_OVERRIDES[tag]) return HASHTAG_OVERRIDES[tag]
  return tag.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('')
}

export function hashtags(tags = []) {
  const seen = new Set()
  const out = []
  for (const h of [...tags.map(toHashtag), ...CORE_TAGS]) {
    const key = h.toLowerCase()
    if (!seen.has(key)) { seen.add(key); out.push('#' + h) }
    if (out.length >= 5) break
  }
  return out.join(' ')
}

function quickAnswer(content, excerpt) {
  const m = content.match(/title="The quick answer">\s*\n\s*\n([\s\S]*?)\n\s*\n<\/Callout>/)
  if (m) return m[1].trim().replace(/\*\*/g, '')
  return (excerpt || '').trim()
}

const isNews = (data) => data.type === 'news' || data.category === 'event'

// LinkedIn Posts API "commentary" treats these as reserved and needs them
// backslash-escaped, or the request 422s / renders wrong. We keep # (hashtags)
// and @ unescaped on purpose.
export function escapeCommentary(text) {
  return text.replace(/([\\()\[\]{}<>*_~|])/g, '\\$1')
}

export function loadPosts() {
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => {
      const slug = f.replace(/\.mdx$/, '')
      const { data, content } = matter(fs.readFileSync(path.join(BLOG_DIR, f), 'utf8'))
      return { slug, data, content }
    })
    .filter((p) => p.data.title && p.data.date)
    .sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime())
}

export function getPost(slug) {
  return loadPosts().find((p) => p.slug === slug) || null
}

// Build the LinkedIn post body + the first-comment text for a blog post.
export function buildPost(post) {
  const { slug, data, content } = post
  const body = quickAnswer(content, data.excerpt)
  const disclaimer = isNews(data) ? '\n\nNot investment advice.' : ''
  const commentary =
    `${data.title}\n\n${body}${disclaimer}\n\nFull read in the comments below.\n\n${hashtags(data.tags)}`
  const commentText =
    `Full read: ${blogLink(slug)}\n\nTrack the Indian market live on Ziro Market (free): ${appLink(slug)}`
  return { slug, title: data.title, date: data.date, commentary, commentText }
}
