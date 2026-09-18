// Checks every post against content/blog/RULES.md: seoTitle length and format,
// five FAQs, em-dashes, banned phrases, a visual element, an image with credit,
// and word count. Run: node scripts/lint-content.mjs [--all]
import fs from 'fs';
import path from 'path';

const BANNED = [
  "it's worth noting", 'it is worth noting', 'it should be noted', 'important to note',
  'delve into', 'dive into', 'comprehensive', 'utilize', 'in conclusion', 'to summarize',
  'in summary', 'furthermore', 'moreover', 'seamlessly', 'game-changer', 'game changer',
  'in the world of', 'when it comes to', 'it can be seen that', 'it is known that',
];
// "leverage" and "landscape" are banned as corporate-speak but legitimate in finance
// ("leveraged positions", "the credit landscape" is still banned, "leveraged" is not).
const BANNED_WORD = ['navigate', 'robust', 'crucial', 'vital', 'pivotal', 'realm', 'landscape', 'additionally', 'importantly'];
// "leverage" is banned as corporate-speak (a verb: "leverage our scale") but is
// ordinary finance vocabulary as a noun ("leverage in mid-caps", "leveraged
// positions"), so only the verb form is flagged.
const BANNED_VERB = /\bleverage (our|the|their|its|this|these|a)\b/i;

const dir = path.join('content', 'blog');
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.mdx'));
const onlyToday = !process.argv.includes('--all');
const today = new Date().toISOString().slice(0, 10);
let flagged = 0;

for (const f of files.sort()) {
  const raw = fs.readFileSync(path.join(dir, f), 'utf8');
  // Split on the frontmatter fences only: a body can contain its own '---'.
  const fmEnd = raw.indexOf('\n---', 4);
  const fm = raw.slice(0, fmEnd);
  const body = raw.slice(fmEnd + 4);
  if (onlyToday && !new RegExp(`^date: "${today}"`, 'm').test(fm)) continue;
  const issues = [];

  const seo = fm.match(/^seoTitle: "(.+)"/m);
  if (!seo) issues.push('no seoTitle');
  else {
    if (seo[1].length + ' | Ziro Market'.length > 60) issues.push(`seoTitle ${seo[1].length + 14} chars`);
    if ((seo[1].match(/\|/g) || []).length !== 1) issues.push('seoTitle needs exactly one pipe');
  }
  const faqs = (fm.match(/^ {2}- q:/gm) || []).length;
  if (faqs !== 5) issues.push(`${faqs} FAQs`);
  if (raw.includes('\u2014')) issues.push('em-dash');

  const low = body.toLowerCase();
  const hits = BANNED.filter((b) => low.includes(b));
  for (const w of BANNED_WORD) {
    if (new RegExp(`\\b${w}\\b`, 'i').test(body)) hits.push(w);
  }
  if (BANNED_VERB.test(body)) hits.push('leverage (verb)');
  if (hits.length) issues.push(`banned: ${[...new Set(hits)].join(', ')}`);

  if (!/<(Callout|StatGrid|BarChart|KeyTakeaways|Pullquote)|\n\| /.test(body)) issues.push('no visual element');
  if (!body.includes('/images/')) issues.push('no image');
  for (const m of body.matchAll(/<Logo[^>]*?\/images\/photos\/[^>]*?>/gs)) {
    if (!m[0].includes('credit=')) issues.push('photo without credit');
    const src = m[0].match(/src="([^"]+)"/);
    if (src && !fs.existsSync(path.join('public', src[1]))) issues.push(`missing file ${src[1]}`);
  }

  const words = body.replace(/<[^>]+>/g, '').replace(/\|.*\|/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').split(/\s+/).filter(Boolean).length;
  if (words > 1250 || words < 650) issues.push(`${words} words`);

  if (issues.length) { flagged++; console.log(`FLAG ${f} -> ${issues.join('; ')}`); }
  else console.log(`OK   ${f}`);
}
console.log(flagged === 0 ? '\nall checked posts pass' : `\n${flagged} post(s) flagged`);
