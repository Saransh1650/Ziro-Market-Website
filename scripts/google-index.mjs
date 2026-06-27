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

// Parse the multipart/mixed response body. Returns an array of
// { url, status, message } — one per URL in the batch.
function parseBatchResponse(responseBody, urls) {
  // Extract boundary from the first line (--batch_XXX)
  const boundaryMatch = responseBody.match(/^--(\S+)/m);
  if (!boundaryMatch) return urls.map((url) => ({ url, status: 0, message: 'no boundary' }));

  const boundary = boundaryMatch[1];
  const parts = responseBody.split(`--${boundary}`).slice(1); // drop preamble

  const results = [];
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (part.trim() === '--') break; // closing delimiter

    // Find the HTTP status line inside the part (e.g. "HTTP/1.1 200 OK")
    const statusMatch = part.match(/HTTP\/1\.1 (\d{3}) ([^\r\n]*)/);
    const status = statusMatch ? parseInt(statusMatch[1], 10) : 0;
    const statusText = statusMatch ? statusMatch[2] : 'unknown';

    // Try to extract error message from JSON body if present
    let message = statusText;
    const jsonMatch = part.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.error?.message) message = parsed.error.message;
        else if (parsed.urlNotificationMetadata?.latestUpdate?.notifyTime) {
          message = `notified at ${parsed.urlNotificationMetadata.latestUpdate.notifyTime}`;
        }
      } catch {
        // ignore parse errors
      }
    }

    results.push({ url: urls[i] ?? `item${i + 1}`, status, message });
  }

  return results;
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
  const envelopeOk = res.ok;
  const items = envelopeOk ? parseBatchResponse(text, urls) : [];
  return { envelopeOk, envelopeStatus: res.status, items, rawBody: text };
}

// ── Search Console Sitemap API ─────────────────────────────────────────────

async function submitSitemap(token) {
  const endpoint = `https://www.googleapis.com/webmasters/v3/sites/${SITE_URL}/sitemaps/${SITEMAP_FEED}`;
  const res = await fetch(endpoint, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
  });
  const body = await res.text();
  return { status: res.status, ok: res.ok, body };
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
  console.log(`Sitemap ping: 200 OK`);
} else {
  let hint = '';
  if (sitemapResult.status === 403) {
    hint =
      '\n  → Add the service account email as an Owner in Search Console' +
      '\n    (Settings → Users and permissions → Add user → Owner role)';
  }
  try {
    const err = JSON.parse(sitemapResult.body);
    console.warn(`Sitemap ping: ${sitemapResult.status} ${err?.error?.message ?? ''}${hint}`);
  } catch {
    console.warn(`Sitemap ping: ${sitemapResult.status}${hint}`);
  }
}

// ── Submit URL batches ─────────────────────────────────────────────────────

const BATCH_SIZE = 100;
const counts = { ok: 0, rateLimit: 0, forbidden: 0, other: 0 };
const failures = [];
const batchCount = Math.ceil(allUrls.length / BATCH_SIZE);

for (let i = 0; i < allUrls.length; i += BATCH_SIZE) {
  const batch = allUrls.slice(i, i + BATCH_SIZE);
  const batchNum = Math.floor(i / BATCH_SIZE) + 1;

  const result = await submitBatch(batch, indexingToken);

  if (!result.envelopeOk) {
    // Entire batch rejected — treat all as failed
    console.error(`Batch ${batchNum}/${batchCount}: envelope error ${result.envelopeStatus}`);
    console.error(result.rawBody.slice(0, 600));
    counts.other += batch.length;
    continue;
  }

  let batchOk = 0;
  let batchFail = 0;

  for (const item of result.items) {
    if (item.status === 200) {
      counts.ok++;
      batchOk++;
    } else if (item.status === 429) {
      counts.rateLimit++;
      batchFail++;
      failures.push({ url: item.url, status: item.status, message: item.message });
    } else if (item.status === 403) {
      counts.forbidden++;
      batchFail++;
      failures.push({ url: item.url, status: item.status, message: item.message });
    } else {
      counts.other++;
      batchFail++;
      failures.push({ url: item.url, status: item.status, message: item.message });
    }
  }

  console.log(
    `Batch ${batchNum}/${batchCount}: ${batchOk} queued` +
      (batchFail ? `, ${batchFail} failed` : ''),
  );
}

// ── Summary ────────────────────────────────────────────────────────────────

console.log('\n── Results ───────────────────────────────────────');
console.log(`  Queued for indexing : ${counts.ok}`);
if (counts.rateLimit) console.log(`  Rate limited (429)  : ${counts.rateLimit}`);
if (counts.forbidden) console.log(`  Forbidden (403)     : ${counts.forbidden}`);
if (counts.other)     console.log(`  Other errors        : ${counts.other}`);

if (failures.length) {
  console.log('\n── Failed URLs ───────────────────────────────────');
  for (const f of failures) {
    console.log(`  [${f.status}] ${f.url}`);
    if (f.message && f.message !== 'OK') console.log(`       ${f.message}`);
  }

  if (counts.rateLimit) {
    console.log('\n  Rate limit hit: Google allows 200 URL notifications/day by default.');
    console.log('  Request higher quota at: https://developers.google.com/search/apis/indexing-api/v3/quota-pricing');
  }
  if (counts.forbidden) {
    console.log('\n  403 errors: service account email must be added as Owner in Search Console.');
  }
}

console.log('──────────────────────────────────────────────────');

const totalFailed = counts.rateLimit + counts.forbidden + counts.other;
if (totalFailed > 0) process.exit(1);
