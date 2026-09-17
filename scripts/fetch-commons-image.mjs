// Downloads a Wikimedia Commons image into /public/images/photos and prints the
// attribution string to paste into the post. Only public domain, CC0, CC BY and
// CC BY-SA files are accepted; anything else is refused so we never ship an
// image we cannot legally use.
//
//   node scripts/fetch-commons-image.mjs "File:Example.jpg" output-name
import fs from 'fs';
import path from 'path';

const OK = [/public domain/i, /^cc0/i, /^cc by(-sa)?[ -]?\d?/i, /creative commons/i];
const [title, outName] = process.argv.slice(2);
if (!title || !outName) { console.error('usage: fetch-commons-image.mjs "File:X.jpg" out-name'); process.exit(1); }

const api = `https://commons.wikimedia.org/w/api.php?action=query&prop=imageinfo&iiprop=url|extmetadata|mime&iiurlwidth=1280&format=json&titles=${encodeURIComponent(title)}`;
const res = await fetch(api, { headers: { 'User-Agent': 'ziromarket-blog/1.0 (editorial image sourcing)' } });
const data = await res.json();
const page = Object.values(data.query.pages)[0];
if (!page.imageinfo) { console.error('not found:', title); process.exit(1); }
const info = page.imageinfo[0];
const meta = info.extmetadata || {};
const strip = (s) => (s || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

const license = strip(meta.LicenseShortName?.value) || strip(meta.UsageTerms?.value);
if (!OK.some((r) => r.test(license))) { console.error('REFUSED, license not usable:', license); process.exit(1); }

const author = strip(meta.Artist?.value) || 'Unknown author';
const url = info.thumburl || info.url;
const ext = (info.mime || 'image/jpeg').split('/')[1].replace('jpeg', 'jpg');
const outPath = path.join('public', 'images', 'photos', `${outName}.${ext}`);
const bin = Buffer.from(await (await fetch(url, { headers: { 'User-Agent': 'ziromarket-blog/1.0' } })).arrayBuffer());
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, bin);

const credit = /public domain|cc0/i.test(license)
  ? `Photo: ${author} / Wikimedia Commons, ${license}`
  : `Photo: ${author} / Wikimedia Commons, ${license}`;
console.log(JSON.stringify({ file: outPath, kb: Math.round(bin.length / 1024), license, credit }, null, 1));
