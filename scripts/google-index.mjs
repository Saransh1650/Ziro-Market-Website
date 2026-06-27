// Submit all blog and regional URLs to Google Indexing API after deploy.
// Also resubmits the sitemap via Google Search Console API.
//
// Requires:
//   GOOGLE_SERVICE_ACCOUNT_JSON — full JSON of a service account key file.
//   The service account must be added as an owner in Search Console for
//   the property (sc-domain:ziromarket.com).
//
// Run after deploy:  npm run google-index

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const BASE_URL = 'https://ziromarket.com';
const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');
const REGIONAL_DIR = path.join(process.cwd(), 'content', 'regional');

const INDEXING_SCOPE = 'https://www.googleapis.com/auth/indexing';
const WEBMASTERS_SCOPE = 'https://www.googleapis.com/auth/webmasters';
const BATCH_ENDPOINT = 'https://indexing.googleapis.com/batch';
const TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';

// The Search Console property and sitemap URL (both must be URL-encoded in the path)
const SITE_URL = encodeURIComponent('sc-domain:ziromarket.com');
const SITEMAP_FEED = encodeURIComponent(`${BASE_URL}/sitemap.xml`);

// ── JWT / OAuth helpers ────────────────────────────────────────────────────

function b64url(input) {
  const buf = typeof input === 'string' ? Buffer.from(input) : input;
  return buf.toString('base64url');
}

async function getAccessToken(serviceAccountJson, scope) {
  const { client_email, private_key } = JSON.parse(serviceAccountJson);
  const now = Math.floor(Date.now() / 1000);

  const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = b64url(JSON.stringify({
    iss: client_email,
    scope,
    aud: TOKEN_ENDPOINT,
    iat: now,
    exp: now + 3600,
  }));

  const signingInput = `${header}.${payload}`;
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(signingInput);
  const sig = signer.sign(private_key, 'base64url');

  const jwt = `${signingInput}.${sig}`;

  const res = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(`Token fetch failed: ${JSON.stringify(data)}`);
  return data.access_token;
}

// ── Indexing API ───────────────────────────────────────────────────────────

// Build a multipart/mixed batch body (up to 100 URLs per call per API limits)
function buildBatchBody(urls, boundary) {
  const parts = urls.map((url, i) => {
    const body = JSON.stringify({ url, type: 'URL_UPDATED' });
    return [
      `--${boundary}`,
      'Content-Type: application/http',
      `Content-ID: <item${i + 1}>`,
      '',
      'POST /v3/urlNotifications:publish HTTP/1.1',
      'Content-Type: application/json',
      `Content-Length: ${Buffer.byteLength(body)}`,
      '',
      body,
    ].join('\r\n');
  });

  return parts.join('\r\n') + `\r\n--${boundary}--`;
}

async function submitBatch(urls, token) {
  const boundary = `batch_${Date.now()}`;
  const res = await fetch(BATCH_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': `multipart/mixed; boundary=${boundary}`,
    },
    body: buildBatchBody(urls, boundary),
  });

  const text = await res.text();
  return { status: res.status, ok: res.ok, body: text };
}

// ── Search Console Sitemap API ─────────────────────────────────────────────

async function submitSitemap(token) {
  const endpoint = `https://www.googleapis.com/webmasters/v3/sites/${SITE_URL}/sitemaps/${SITEMAP_FEED}`;
  const res = await fetch(endpoint, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
  });
  return { status: res.status, ok: res.ok };
}

// ── Collect URLs ───────────────────────────────────────────────────────────

const blogUrls = fs.existsSync(BLOG_DIR)
  ? fs
      .readdirSync(BLOG_DIR)
      .filter((f) => f.endsWith('.mdx'))
      .map((f) => `${BASE_URL}/blog/${f.replace(/\.mdx$/, '')}`)
  : [];

const regionalUrls = fs.existsSync(REGIONAL_DIR)
  ? fs
      .readdirSync(REGIONAL_DIR, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .flatMap((d) =>
        fs
          .readdirSync(path.join(REGIONAL_DIR, d.name))
          .filter((f) => f.endsWith('.mdx'))
          .map((f) => `${BASE_URL}/regional/${d.name}/${f.replace(/\.mdx$/, '')}`),
      )
  : [];

const staticUrls = [BASE_URL, `${BASE_URL}/blog`];
const allUrls = [...staticUrls, ...blogUrls, ...regionalUrls];

console.log(
  `URLs found: ${allUrls.length} total` +
    ` (${staticUrls.length} static, ${blogUrls.length} blog, ${regionalUrls.length} regional)`,
);

// ── Auth ───────────────────────────────────────────────────────────────────

const saJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
if (!saJson) {
  console.error('ERROR: GOOGLE_SERVICE_ACCOUNT_JSON env var not set.');
  console.error(
    'Set it to the full contents of the service account JSON key file.',
  );
  process.exit(1);
}

console.log('Authenticating with Google...');
const [indexingToken, webmastersToken] = await Promise.all([
  getAccessToken(saJson, INDEXING_SCOPE),
  getAccessToken(saJson, WEBMASTERS_SCOPE),
]);
console.log('Auth OK.');

// ── Submit sitemap ─────────────────────────────────────────────────────────

const sitemapResult = await submitSitemap(webmastersToken);
if (sitemapResult.ok) {
  console.log(`Sitemap submitted: ${sitemapResult.status} OK`);
} else {
  console.warn(`Sitemap submission failed: ${sitemapResult.status}`);
}

// ── Submit URL batches ─────────────────────────────────────────────────────

const BATCH_SIZE = 100;
let totalOk = 0;
let totalFailed = 0;
const batchCount = Math.ceil(allUrls.length / BATCH_SIZE);

for (let i = 0; i < allUrls.length; i += BATCH_SIZE) {
  const batch = allUrls.slice(i, i + BATCH_SIZE);
  const batchNum = Math.floor(i / BATCH_SIZE) + 1;

  const result = await submitBatch(batch, indexingToken);

  if (result.ok) {
    totalOk += batch.length;
    console.log(`Batch ${batchNum}/${batchCount}: ${batch.length} URLs → ${result.status}`);
  } else {
    totalFailed += batch.length;
    console.error(`Batch ${batchNum}/${batchCount}: FAILED (${result.status})`);
    console.error(result.body.slice(0, 500));
  }
}

// ── Summary ────────────────────────────────────────────────────────────────

console.log(`\nDone: ${totalOk} submitted, ${totalFailed} failed`);
if (totalFailed > 0) process.exit(1);
