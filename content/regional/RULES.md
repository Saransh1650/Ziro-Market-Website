# Regional-Language Blog Writing Rules

Read this file before writing every regional-language post. It is a copy of the
English `content/blog/RULES.md` PLUS a Regional Language section at the bottom.
Everything in the English rules still applies (structure, visuals, fact-checking,
banned phrases, no em-dashes, evergreen vs event). The Regional Language section
adds the language-quality bar, which is the whole point of these pages.

These pages live in `content/regional/<lang>/<slug>.mdx`, render at
`/regional/<lang>/<slug>`, and are intentionally kept OUT of the main `/blog`
listing and `/blog` sitemap. They link back to ziromarket.com and to the English
original. They carry a gentle app-download popup aimed at readers who are rural or
not comfortable in English.

---

## PART A — Base rules (same as English blog)

### Voice

Write like a smart friend explaining the market over chai, not a textbook and not
a press release. Assume the reader is curious, invests or wants to, but never
studied finance formally. For regional pages, also assume the reader may be in a
small town or village and may not know English finance jargon at all.

### Structure rules

- No bullet point lists in the narrative prose. Lists belong only inside a visual
  component (KeyTakeaways or a Callout). Section headings (## or ###) are fine.
- No conclusion section. End on a thought, not a summary.
- Length: 700-900 words for explainers, 900-1100 for news, in the target language.
- One blank line between paragraphs.

### Visual elements

Break posts up with the same components as the English blog. Use only elements the
data supports, vary the mix per post, and place each visual next to the numbers it
illustrates. Available components (written directly in MDX, blank line before and
after each block):

1. GFM markdown tables for real comparisons.
2. `<KeyTakeaways title="...">` — pass a `title` in the target language. Wrap a 3-4 point markdown list, blank line after the opening tag and before the closing tag.
3. `<Callout type="insight|risk|stat|note" title="...">` — pass `title` in the target language.
4. `<StatGrid>` with `<Stat value="..." label="..." trend="up|down|flat" />` — `label` in the target language.
5. `<BarChart title="..." unit="..." data={[...]} caption="..." />` — title/caption in the target language, values real and comparable.
6. `<Pullquote cite="...">A standout line.</Pullquote>`
7. Images — original SVG infographics in /public/images. Reuse the English post's infographic if its labels are language-neutral; otherwise keep the headline number visual and let the body carry the words.

The FAQ is automatic. Do NOT write a FAQ heading in the body. Put 5 FAQs in the
frontmatter `faq[]` array only, written in the target language.

### Bold statements for scanners

Every paragraph gets exactly one bolded key insight — a complete thought, the line
a fast reader should catch. Never bold more than one sentence per paragraph. Never
bold headings.

### Titles must be specific

Name a real number, company, or event, and pose the real question the reader would
search for in their language. Bad: a vague "Gold price explained". Good: a title
that states today's actual gold rate.

### SEO title (seoTitle frontmatter field)

Every post needs a `seoTitle` in `keywords | benefit` format, keyword first, with a
benefit that gives a real reason to click. The brand " | Ziro Market" is appended
automatically, so do not type it. For regional pages, write the seoTitle in the
target language using the words people actually type when searching in that
language. Keep the full title at or under ~60 characters where the script allows.

### Evergreen vs event posts

Same rule as English: recurring queries ("aaj sona kitne ka hai") map to ONE
canonical page that you update in place; one-time events get a new page. The
regional evergreen slug mirrors the English slug (for example
`/regional/hi/gold-rate-today-india`). Update the file, never duplicate it, set the
date to today, refresh every number, keep the slug fixed.

### Excerpts

One punchy sentence, max ~20 words, in the target language. Write it last.

### Banned punctuation

No em-dashes. Not one. Use a comma, a period, or rewrite.

### Examples must be specific

Every factual claim needs a real anchor: real company (Reliance, HDFC Bank, Tata),
real number (Rs 1,47,239 per 10g), real date or range. If unsure of a number, give
a range or describe it directionally rather than guess.

### Indian market focus

NSE/BSE examples, Indian companies, INR amounts, SEBI/RBI/MPC where relevant.

### eli5 frontmatter field

Two paragraphs in the target language, written as a YAML literal block (| operator).
Para 1: explain the concept like to a small child using a simple physical analogy
(a shop, pocket money, a weekly market). Zero jargon. Para 2: one specific recent
Indian example with a real company, real number, real year, still in plain words.

### Fact-checking and timestamps

Every specific number must be verified by search before publishing, exactly as for
English posts. After verifying, add the target-language equivalent of "as of [Month
Year]" after any price, ratio, yield, or index level. Historical fixed dates do not
need a timestamp.

### News article format

For event-driven posts use the same section flow as the English blog, written as
prose in the target language: intro (no heading), What Happened, Why This Matters
for Investors, Market Reaction, What Investors Should Watch, Risks to Monitor, and
an ending thought (no heading). News must not recommend buying, selling, or holding
anything. State facts, explain significance, describe risks.

---

## PART B — Regional Language rules (the quality bar)

These are mandatory and are the reason these pages exist. A page that breaks any of
these should not be published.

### 1. Write natively, never translate

Do NOT translate the English post word for word. Read the English post to learn the
facts and numbers, then write a fresh post in the target language the way a native
speaker would actually say it. Sentence order, idioms, and phrasing must be native.
If a sentence reads like it was run through a translation tool, rewrite it from
scratch. The goal is "originally written in Hindi/Tamil/Telugu", not "translated
into" it.

### 2. Grammar must be perfect

Zero grammatical mistakes. Before publishing, check every sentence for:
- Gender agreement (in Hindi, noun-adjective-verb gender: "सोने की कीमत बढ़ी" not "बढ़ा").
- Correct postpositions / case markers (का/के/की, ने, को, से, में, पर used correctly).
- Verb conjugation and tense consistency.
- Honorific and number agreement (singular/plural, आप vs तुम — use the neutral
  respectful register throughout).
- Correct sandhi and spelling, including nukta where needed (ज़, फ़, क़) and proper
  use of anusvara/chandrabindu (ं vs ँ).
Read the whole post aloud in your head one more time as a final grammar pass.

### 3. Use the reader's everyday register

Target a rural or non-technical reader. Use simple, everyday spoken words, not heavy
literary or over-Sanskritized vocabulary, and not heavy Urduized vocabulary either.
Prefer the word a shopkeeper or farmer would actually use. If a simpler common word
exists, use it. Short sentences beat long ones.

### 4. Handle finance/English terms the way people really say them

Many financial terms are spoken in English even by non-English speakers. Keep those
in the form people actually use, written in the native script, and gloss them once
in plain words the first time they appear. Examples in Hindi:
- GST → "जीएसटी (सरकारी टैक्स)" on first use, then "जीएसटी".
- ETF, SIP, demat, KYC → write in Devanagari with a one-line plain explanation first.
- Keep widely understood words natural: "सोना", "चाँदी", "ग्राम", "भाव", "कीमत",
  "बाज़ार", "शेयर".
Do not invent obscure "pure" translations nobody uses (e.g. do not coin a Sanskrit
word for "share" when लोग say "शेयर").

### 5. Numbers in the Indian system

Use the Indian numbering system in words and digits: लाख and करोड़, not million and
billion. Write amounts as "Rs 1,47,239" with the Indian comma grouping. Spell large
numbers the way they are spoken locally ("एक लाख सैंतालीस हज़ार").

### 6. Localize ALL visible text, not just the body

Every word the reader sees must be in the target language: the H1 title, excerpt,
eli5, FAQ questions and answers, and the `title`/`label`/`caption` props passed to
KeyTakeaways, Callout, Stat, BarChart. The breadcrumb, "also read", the eli5 toggle
label, the FAQ heading, the footer CTA, and the download popup are already localized
in `lib/regional.ts`. The OG card uses a separate Latin `ogTitle` on purpose (so the
social image has no missing-glyph boxes); write `ogTitle` in short, clear English.

### 7. The app-download popup

Every regional page shows a gentle, dismissible app-download popup (the ad). Its
copy lives in `lib/regional.ts` under each language's `ui`, written in that language,
aimed at a non-technical reader: simple words, a clear free-to-download promise, a
big obvious button, and an easy "not now". It must never be a full-screen blocker
and must remember a dismissal. Keep the tone warm and plain, never pushy.

### 8. Frontmatter extras for regional posts

In addition to the normal fields, every regional post sets:
- `lang`: the language code (e.g. "hi"). Must match the folder.
- `enSlug`: the slug of the English original, for the hreflang alternate and the
  "read in English" link.
- `ogTitle`: a short English headline for the social card.

### 9. Final quality check (run before committing)

1. Does any sentence read like a machine translation? Rewrite it natively.
2. Any grammar, gender, postposition, or spelling error? Fix it.
3. Is the register simple enough for a non-English rural reader?
4. Are English finance terms glossed once in plain words on first use?
5. Are numbers in lakh/crore with Indian comma grouping?
6. Are ALL visible strings (title, excerpt, eli5, FAQs, component labels) in the
   target language, with `ogTitle` in English?
7. Every number verified and timestamped, no em-dashes, no invented data?
8. `lang`, `enSlug`, and `ogTitle` present in frontmatter?
