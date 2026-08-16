#!/usr/bin/env node
// Preview ready-to-post LinkedIn drafts from the blog (does NOT post).
//
//   node scripts/linkedin-drafts.mjs           # 8 newest posts
//   node scripts/linkedin-drafts.mjs 12        # 12 newest posts
//   node scripts/linkedin-drafts.mjs <slug>    # one specific post
//
// To actually publish, use scripts/linkedin-post.mjs. See content/linkedin/.

import { loadPosts, getPost, buildPost } from './lib/linkedin-content.mjs'

function render({ slug, date, commentary, commentText }) {
  return [
    '======================================================================',
    `POST: ${slug}   (date: ${date})`,
    '----------------------------------------------------------------------',
    commentary,
    '',
    '--- FIRST COMMENT ---',
    commentText,
    '',
  ].join('\n')
}

function main() {
  const arg = process.argv[2]
  let posts
  if (arg && !/^\d+$/.test(arg)) {
    const one = getPost(arg)
    if (!one) { console.error(`No post found for slug "${arg}".`); process.exit(1) }
    posts = [one]
  } else {
    posts = loadPosts().slice(0, arg ? parseInt(arg, 10) : 8)
  }
  console.log(`\nZiro Market — LinkedIn drafts (${posts.length}). Value in the post, link in the first comment.\n`)
  for (const p of posts) console.log(render(buildPost(p)))
}

main()
