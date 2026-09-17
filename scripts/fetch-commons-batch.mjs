// Batch version of fetch-commons-image.mjs with polite rate limiting and retry,
// because the Commons API refuses rapid sequential requests.
import fs from 'fs';
import path from 'path';

const OK = [/public domain/i, /^cc0/i, /^cc by(-sa)?[ -]?\d?/i, /creative commons/i];
const UA = { 'User-Agent': 'ziromarket-blog/1.0 (editorial image sourcing; contact: ziromarket.com)' };
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const strip = (s) => (s || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

async function getJson(url, tries = 4) {
  for (let i = 0; i < tries; i++) {
    const r = await fetch(url, { headers: UA });
    const text = await r.text();
    try { return JSON.parse(text); } catch { await wait(5000 * (i + 1)); }
  }
  throw new Error('api unavailable after retries');
}

const jobs = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const out = [];
for (const [title, name] of jobs) {
  try {
    const api = `https://commons.wikimedia.org/w/api.php?action=query&prop=imageinfo&iiprop=url|extmetadata|mime&iiurlwidth=1280&format=json&titles=${encodeURIComponent(title)}`;
    const page = Object.values((await getJson(api)).query.pages)[0];
    if (!page.imageinfo) { out.push({ name, error: 'not found' }); continue; }
    const info = page.imageinfo[0];
    const meta = info.extmetadata || {};
    const license = strip(meta.LicenseShortName?.value) || strip(meta.UsageTerms?.value);
    if (!OK.some((r) => r.test(license))) { out.push({ name, error: `refused: ${license}` }); continue; }
    const author = strip(meta.Artist?.value) || 'Unknown author';
    const ext = (info.mime || 'image/jpeg').split('/')[1].replace('jpeg', 'jpg');
    const outPath = path.join('public', 'images', 'photos', `${name}.${ext}`);
    const bin = Buffer.from(await (await fetch(info.thumburl || info.url, { headers: UA })).arrayBuffer());
    fs.writeFileSync(outPath, bin);
    out.push({ name, file: outPath, kb: Math.round(bin.length / 1024), credit: `Photo: ${author} / Wikimedia Commons, ${license}` });
  } catch (e) { out.push({ name, error: String(e.message) }); }
  await wait(4000);
}
console.log(JSON.stringify(out, null, 1));
