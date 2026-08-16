#!/usr/bin/env node
// Publish a blog to the Ziro Market LinkedIn page automatically.
//
//   node scripts/linkedin-post.mjs <slug>     # publish one specific blog
//   node scripts/linkedin-post.mjs --next     # publish the newest not-yet-posted blog (for cron)
//   node scripts/linkedin-post.mjs --next --dry-run   # show what it WOULD post, no API call
//
// It creates the post (value in the body) and then adds the blog + app link as
// the FIRST COMMENT (2026 reach rule), and records the slug in
// content/linkedin/posted.json so it never posts the same thing twice.
//
// Required env (set as GitHub Action secrets or in your shell):
//   LINKEDIN_ACCESS_TOKEN   OAuth token with w_organization_social (page) or w_member_social (profile)
//   LINKEDIN_AUTHOR_URN     e.g. urn:li:organization:1234567  (page)  or  urn:li:person:abcd  (profile)
// Optional:
//   LINKEDIN_VERSION        API version YYYYMM (default 202603)
//   LINKEDIN_POST_COMMENT   "false" to skip the first-comment link (default: post it)
//   LINKEDIN_REFRESH_TOKEN + LINKEDIN_CLIENT_ID + LINKEDIN_CLIENT_SECRET  -> auto-refresh the access token
// See content/linkedin/SETUP.md for the one-time setup.

import fs from 'node:fs'
import path from 'node:path'
import { loadPosts, getPost, buildPost, escapeCommentary } from './lib/linkedin-content.mjs'

const API = 'https://api.linkedin.com/rest'
const VERSION = process.env.LINKEDIN_VERSION || '202603'
const STATE_FILE = path.join(process.cwd(), 'content', 'linkedin', 'posted.json')

const args = process.argv.slice(2)
const DRY = args.includes('--dry-run')
const NEXT = args.includes('--next')
const SLUG = args.find((a) => !a.startsWith('--'))

function readState() {
  try { return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8')) } catch { return { posts: {} } }
}
function writeState(state) {
  fs.mkdirSync(path.dirname(STATE_FILE), { recursive: true })
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2) + '\n')
}

function pickPost(state) {
  if (SLUG) {
    const p = getPost(SLUG)
    if (!p) { console.error(`No post found for slug "${SLUG}".`); process.exit(1) }
    return p
  }
  if (NEXT) {
    const next = loadPosts().find((p) => !state.posts[p.slug])
    if (!next) { console.log('Nothing new to post — every blog is already in posted.json.'); process.exit(0) }
    return next
  }
  console.error('Pass a <slug> or --next. Add --dry-run to preview without posting.')
  process.exit(1)
}

async function refreshTokenIfConfigured() {
  const { LINKEDIN_REFRESH_TOKEN, LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET } = process.env
  if (!LINKEDIN_REFRESH_TOKEN || !LINKEDIN_CLIENT_ID || !LINKEDIN_CLIENT_SECRET) return null
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: LINKEDIN_REFRESH_TOKEN,
    client_id: LINKEDIN_CLIENT_ID,
    client_secret: LINKEDIN_CLIENT_SECRET,
  })
  const res = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })
  if (!res.ok) throw new Error(`Token refresh failed: ${res.status} ${await res.text()}`)
  const json = await res.json()
  return json.access_token
}

function headers(token) {
  return {
    Authorization: `Bearer ${token}`,
    'LinkedIn-Version': VERSION,
    'X-Restli-Protocol-Version': '2.0.0',
    'Content-Type': 'application/json',
  }
}

async function createPost(token, author, commentary) {
  const payload = {
    author,
    commentary: escapeCommentary(commentary),
    visibility: 'PUBLIC',
    distribution: { feedDistribution: 'MAIN_FEED', targetEntities: [], thirdPartyDistributionChannels: [] },
    lifecycleState: 'PUBLISHED',
    isReshareDisabledByAuthor: false,
  }
  const res = await fetch(`${API}/posts`, { method: 'POST', headers: headers(token), body: JSON.stringify(payload) })
  if (!res.ok) throw new Error(`Create post failed: ${res.status} ${await res.text()}`)
  const urn = res.headers.get('x-restli-id') || res.headers.get('x-linkedin-id')
  return urn
}

async function addComment(token, author, postUrn, text) {
  const res = await fetch(`${API}/socialActions/${encodeURIComponent(postUrn)}/comments`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify({ actor: author, object: postUrn, message: { text: escapeCommentary(text) } }),
  })
  if (!res.ok) throw new Error(`Add comment failed: ${res.status} ${await res.text()}`)
  return true
}

async function main() {
  const state = readState()
  const post = pickPost(state)
  const built = buildPost(post)

  console.log(`\n--- LinkedIn post: ${built.slug} ---\n${built.commentary}\n\n--- first comment ---\n${built.commentText}\n`)

  if (DRY) {
    console.log('[dry-run] Not calling the API. Set LINKEDIN_ACCESS_TOKEN + LINKEDIN_AUTHOR_URN and drop --dry-run to publish.')
    return
  }

  const author = process.env.LINKEDIN_AUTHOR_URN
  let token = process.env.LINKEDIN_ACCESS_TOKEN
  if (!author) { console.error('Missing LINKEDIN_AUTHOR_URN.'); process.exit(1) }

  const refreshed = await refreshTokenIfConfigured()
  if (refreshed) token = refreshed
  if (!token) { console.error('Missing LINKEDIN_ACCESS_TOKEN (and no refresh token configured).'); process.exit(1) }

  const urn = await createPost(token, author, built.commentary)
  console.log(`Posted: ${urn || '(no urn returned)'}`)

  if (urn && process.env.LINKEDIN_POST_COMMENT !== 'false') {
    try {
      await addComment(token, author, urn, built.commentText)
      console.log('Added first comment with the link.')
    } catch (e) {
      console.warn(`Post published, but comment failed: ${e.message}`)
    }
  }

  state.posts[built.slug] = { postedAt: new Date().toISOString(), urn: urn || null }
  writeState(state)
  console.log(`Recorded in ${path.relative(process.cwd(), STATE_FILE)}.`)
}

main().catch((e) => { console.error(e.message); process.exit(1) })
