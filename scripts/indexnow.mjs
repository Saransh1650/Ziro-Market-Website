// Submits all site URLs to IndexNow so Bing and Yandex index new/updated pages
// instantly instead of waiting for a crawl.
//
// Run after deploying new content:  npm run indexnow
//
// The key is public by design (it is hosted at /<key>.txt), so it is safe to
// commit. IndexNow verifies ownership by checking that key file exists.

import fs from 'fs';
import path from 'path';

const HOST = 'ziromarket.com';
const BASE_URL = `https://${HOST}`;
const KEY = '337f42e4c86d3f8e5bfdecba0e0b0ad3';
const KEY_LOCATION = `${BASE_URL}/${KEY}.txt`;
const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

const staticUrls = [
  `${BASE_URL}`,
  `${BASE_URL}/blog`,
  `${BASE_URL}/privacy`,
  `${BASE_URL}/terms`,
];

const postUrls = fs
  .readdirSync(BLOG_DIR)
  .filter((f) => f.endsWith('.mdx'))
  .map((f) => `${BASE_URL}/blog/${f.replace(/\.mdx$/, '')}`);

const urlList = [...staticUrls, ...postUrls];

const body = {
  host: HOST,
  key: KEY,
  keyLocation: KEY_LOCATION,
  urlList,
};

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify(body),
});

console.log(`Submitted ${urlList.length} URLs to IndexNow`);
console.log(`Response: ${res.status} ${res.statusText}`);
if (!res.ok) {
  const text = await res.text().catch(() => '');
  console.error('IndexNow rejected the submission:', text);
  process.exit(1);
}
