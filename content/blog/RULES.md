# Blog Writing Rules

Read this file before writing every post. These rules exist to keep posts from reading like AI output.

## Voice

Write like a smart friend explaining the market over coffee. Not a textbook. Not a financial press release. Assume the reader is a curious 25-year-old who works in tech and invests but never studied finance formally.

## Structure rules

- No bullet point lists in the narrative prose. The only place a list belongs is inside a visual component (KeyTakeaways or a Callout, see Visual elements). Section headings (## or ###) are fine.
- No conclusion section. End on a thought, not a summary of what you just said.
- Length: 700-900 words for the main body (not counting frontmatter).
- One blank line between paragraphs.

## Visual elements (make posts scannable, not walls of text)

A long, unbroken pile of text is hard to read and hurts engagement and SEO. Break posts up with the components below. Every post should carry at least one or two visual elements, but the mix must VARY from post to post. Never apply the same template to every article. All components render server-side to plain HTML or SVG, so they stay crawlable and SEO friendly.

How to choose:

- Use only elements the data actually supports. A bar chart needs real comparable numbers, a table needs real rows. Never invent data to fill a component.
- Vary the mix organically. One post might get a stat row plus a table, another a bar chart plus a callout, another just a key-takeaways box. Decide per post based on what the story has.
- Place a visual where it earns its spot, next to the numbers it illustrates, not in a fixed slot.

Available components (write them directly in the MDX body, capitalised exactly, with a blank line before and after each block):

1. Tables (GFM markdown) for real comparisons:

   ```
   | Company | Metric | Value |
   | --- | --- | --- |
   | Infosys | Margin | 20 to 22% |
   ```

2. `<KeyTakeaways>` — a highlighted summary box near the top. Wrap a short markdown list (3 to 4 points). Leave a blank line after the opening tag and before the closing tag so the list parses.

3. `<Callout type="insight|risk|stat|note" title="...">` — a colored aside for a key point, risk, or stat. Blank line around the inner text.

4. `<StatGrid>` with `<Stat value="24,085" label="Nifty 50" trend="up|down|flat" />` — a row of big-number cards for the headline figures.

5. `<BarChart title="..." unit="$" data={[{ label: 'Amazon', value: 200 }]} caption="..." />` — a data-driven horizontal bar chart. Values must be real and comparable. Props that are arrays or objects use {curly braces}.

6. `<Pullquote cite="...">A standout line worth emphasising.</Pullquote>`

7. Images — original SVG infographics saved in /public/images and referenced with `![alt text](/images/file.svg)`. Build them from verified numbers. For evergreen pages, keep the image filename dateless and overwrite it on each update.

The FAQ is automatic. Do NOT write a "## Frequently Asked Questions" section in the body. Put the 5 FAQs in the frontmatter `faq[]` array only. The site renders them as an interactive, expandable accordion (native, accessible, no JavaScript) and generates the FAQPage structured data. Any FAQ heading left in the body is stripped on render.

## Bold statements for scanners

Every paragraph should have 1 bold phrase — the key insight a fast reader should catch. Bold the single most important sentence or clause in each paragraph. A person scanning the post should be able to read only the bold parts and still understand the core idea.

Rules for what to bold:
- Bold a complete thought, not a random word. "**PE is a starting point, not a conclusion.**" not just "**PE ratio**".
- Pick the insight or fact that would make someone stop scrolling. Usually the most surprising or actionable line.
- Never bold more than one sentence per paragraph. If everything is bold, nothing is.
- Never bold section headings (they're already prominent).
- The bold text should make sense on its own without surrounding context.

## Titles must be specific

Bad: "Understanding PE Ratio"
Good: "What is PE ratio, and why did Zomato's 800x PE not scare everyone away?"

The title should name a real company, a real event, or pose a real question that a curious person would actually search for.

## SEO title (the seoTitle frontmatter field)

Every post needs a `seoTitle` field in addition to the readable `title`. They are different on purpose. The `title` is the headline shown on the page (the H1) and stays human and readable. The `seoTitle` is what Google shows in search results (the browser `<title>` tag) and is keyword-optimised.

Format:

```yaml
seoTitle: "Target keywords | Benefit or searcher's goal"
```

The brand is appended automatically by the site, so the full Google title becomes:

`Target keywords | Benefit or searcher's goal | Ziro Market`

Rules:

- **Keyword first.** Front-load the exact phrase people search for (usually your primaryKeyword). This is what Google matches, and what survives if the title gets truncated. Examples: "India CPI May 2026", "SpaceX IPO 2026", "What Is PE Ratio".
- **The benefit must give a real reason to click.** It answers "why should I read this?" — the why, the impact, the decision the reader faces, or the question they are actually asking. It is never a restated number or fact already in the keyword half.
- **Length.** The full title including " | Ziro Market" (14 characters) must stay at or under 60 characters. That leaves about 46 characters for the keyword-plus-benefit part.
- **Keep one pipe.** Always `keywords | benefit`. The brand pipe is added for you, so do not type "| Ziro Market" yourself.

Bad benefit (just a data point, gives no reason to click):

- "India CPI May 2026 | 3.93%"
- "RBI Repo Rate June 2026 | Held at 5.25%"
- "Susan Electricals IPO 2026 | 600% Subscribed"

Good benefit (a real click reason — the why, the stakes, the decision):

- "India CPI May 2026 | Why Inflation Eased"
- "RBI Repo Rate June 2026 | What It Means"
- "Susan Electricals IPO 2026 | Should You Apply?"

Benefit patterns that work, matched to search intent:

- The "why" for news and data: "Why It Crashed", "Why FPIs Are Selling"
- The decision for IPOs and investing: "Should You Apply?", "Should You Worry?"
- The payoff or impact for macro: "Impact on India", "What It Means for You"
- The open question the reader is asking: "Is the Dollar Done?", "Will It Hit $6,000?"
- The practical insight for explainers: "When It Actually Matters", "High vs Low Explained"

## Evergreen vs event posts (update, do not duplicate)

Some topics recur forever and map to a single perennial search query ("nifty today", "gold price today"). For these, keep ONE canonical page at a stable, dateless URL and UPDATE it in place every time. Never create a new dated post for a recurring topic. This keeps the URL indexed, lets it accumulate ranking authority, and avoids the many near-duplicate thin pages that split ranking and look like low-quality content to Google.

Evergreen topics and their canonical slugs (update the existing file, never make a new one):

- Daily Indian market wrap (Nifty / Sensex close) -> `/blog/indian-stock-market-today`
- Gold price today -> `/blog/gold-price-today` (fold dated gold posts into this over time)
- Rupee vs dollar today -> `/blog/rupee-dollar-today`
- Bitcoin / crypto price today -> `/blog/bitcoin-price-today`
- Crude oil price today -> `/blog/crude-oil-price-today`

Extend this registry whenever a new recurring topic appears.

How to update an evergreen post:

1. Edit the existing `.mdx` file. Do not change the slug. Do not create a new file.
2. Set the `date` field to today so the page shows as freshly updated (it also re-sorts to the top of the listing).
3. Rewrite the headline numbers, intro, What Happened, key figures, and the infographic to the latest verified data. Overwrite the same image file and keep its filename dateless (for example `/images/indian-market-today.svg`), so the URL never changes.
4. Update the `title` and `seoTitle` to reflect the current state. The slug stays fixed even though the title changes.
5. Keep `primaryKeyword` stable, since it is the perennial query the page targets.
6. Re-verify every number before publishing, exactly as for any post.

Event posts (create a new page): one-time, dated happenings such as earnings, a specific IPO, an RBI or Fed decision, an M&A deal, a single data release, or a milestone. These get their own descriptive slug and are not updated daily.

Rule of thumb: if the same query will be searched again next week ("nifty today"), it is evergreen, so update the one page. If it happened once ("Turtlemint IPO", "RBI June 2026 decision"), it is an event, so make a new page.

## Excerpts

One punchy sentence. Maximum 20 words. This appears on the listing card. Write it last.

## Banned punctuation

No em-dashes. Not a single one. If you wrote one, replace it with a comma or a period or rewrite the sentence.

## Banned phrases

Remove any of these on your quality check pass:

- "It's worth noting" / "it should be noted" / "it is important to note"
- "delve into" / "dive into"
- "comprehensive" / "leverage" / "utilize"
- "in conclusion" / "to summarize" / "in summary"
- "furthermore" / "moreover" / "additionally" / "importantly"
- "navigate" / "seamlessly" / "robust" / "game-changer" / "game changer"
- "landscape" / "realm" / "crucial" / "vital" / "pivotal"
- "in the world of" / "when it comes to"
- Passive: "it can be seen that" / "it is known that" / "it has been observed"

## Examples must be specific

Every factual claim needs a real anchor:
- Real company name (Zomato, HDFC Bank, Infosys — not "a major IT company" or "a large bank")
- Real numbers (Rs 76 IPO price, 25 bps rate cut — not "significant" or "substantial")
- Real dates or date ranges (July 2021, Q3 FY24, 2022-2023)

If you are not confident about a specific number, use a range or describe it directionally ("roughly halved", "between 12 and 15 percent") rather than guessing a wrong specific number.

## Indian market focus

Use NSE/BSE examples. Cite Indian companies. Use INR amounts. Reference SEBI, RBI, MPC where relevant. Avoid defaulting to US market examples.

## ELI5 rules (the eli5 frontmatter field — "Explain Like I'm 5")

Two paragraphs, written in the frontmatter as a YAML literal block (| operator).

Para 1: Explain the concept as if talking to a literal 5-year-old. Use a simple physical analogy — lemonade stand, school canteen, pocket money, toys. Zero finance jargon. If a 7-year-old could not follow it, rewrite it.

Para 2: One specific 2020-2025 Indian market example that proves the analogy works in real life. Real company name, real number, real year. Still written simply — no jargon allowed here either.

Both paragraphs: no em-dashes, no banned phrases.

## Fact-checking and timestamps

Every specific number in a blog post must be verified before publishing. This is non-negotiable.

**Before writing any number:** Search the internet for the actual current or historical figure. Do not rely on memory or estimates.

**After verifying:** Add "as of [Month Year]" immediately after any specific price, ratio, yield, or market data figure. Examples:
- "HDFC Bank traded at around 3x book value (as of early 2022)"
- "Coal India paid Rs 26.5 per share in dividends (FY2024)"
- "Reliance's market cap was around Rs 19 lakh crore (as of early 2024)"

Numbers that still need a timestamp: any share price, market cap figure, P/B ratio, dividend yield, EPS, ROE percentage, debt amount, or index level.

Historical event dates (IPO date, rate cut date, regulatory change date) do not need "as of" — they are fixed facts. Only current or recent data points need timestamps.

If you cannot verify a number via search, describe it directionally instead: "HDFC Bank traded at a significant premium to book" rather than citing a specific ratio you cannot confirm.

## Quality check (run after writing, before committing)

Read the post back and check:
1. Does any sentence sound robotic? Rewrite it.
2. Is every example anchored to a real company, real number, real date?
3. Any em-dashes? Replace them.
4. Any banned phrase from the list above? Remove it.
5. Does eli5 have two paragraphs — simple analogy + specific real example?
6. Is the title specific (names a company, event, or real question) and under 60 characters?
6b. Is there a `seoTitle` in `keywords | benefit` format, keyword first, with a benefit that gives a real reason to click (not a restated number), and a full Google title (with " | Ziro Market") at or under 60 characters?
7. Is word count between 700-900 for explainers, 900-1100 for news articles?
8. No conclusion section?
9. (News only) Are 5 FAQs in the frontmatter faq[] array (not the body), each answered with verified facts?
10. Is there at least one data-backed visual element (table, chart, stat row, callout, or key-takeaways box), and does the mix differ from the last post rather than a fixed template?

---

## News Article Format

Use this format for event-driven posts: earnings reports, IPOs, RBI/SEBI decisions, FPI flows, sector developments, company-specific news.

### Additional frontmatter fields for news articles

```yaml
type: news
primaryKeyword: "exact phrase people search for"
secondaryKeywords: ["keyword 2", "keyword 3", "keyword 4", "keyword 5"]
```

### Section structure for news articles

Write each section as prose. No bullet lists anywhere in the body. The headings below are H2s.

**Intro (no heading):** 2-3 paragraphs. What happened, why it matters, what investors want to know. Hook the reader in the first sentence with the most interesting fact.

**## What Happened:** The event in detail. Figures, dates, quotes from official sources, sequence of events. Keep it factual.

**## Why This Matters for Investors:** Impact on the company, sector, or broader market. Connect the news to what it means for portfolios or the economy.

**## Market Reaction:** Stock price movement, index movement, volume, FPI/DII activity, analyst comment if available. If market has not yet reacted at time of writing, say so and explain what to watch.

**## What Investors Should Watch:** 3-5 paragraphs, one per key point. Each paragraph bolds the key insight. No subheadings within this section.

**## Risks to Monitor:** Uncertainties, tail risks, factors that could change the outcome. Prose only.

**[Ending thought, no heading]:** One final paragraph. Not a summary. A forward-looking observation or framing that gives the reader something to think about. No "In conclusion."

**Frequently Asked Questions:** Put 5 questions in the frontmatter `faq[]` array only. Do NOT write a FAQ section in the body. The site renders them as an interactive, expandable accordion and generates the FAQPage structured data automatically. Any `## Frequently Asked Questions` section left in the body is stripped on render.

### News article title rules

- Under 60 characters including spaces.
- Name the real event, real figure, real company.
- Good: "RBI holds repo rate at 5.25%, cuts FY27 GDP forecast"
- Bad: "What the RBI's latest decision means for you"

### News article eli5

Para 1: Plain-English summary of what happened. No jargon. One or two sentences a 10-year-old could follow.

Para 2: Why it affects someone's daily life or savings. Concrete and specific.

### News article excerpt

One punchy sentence under 25 words. State the news and the impact. Do not repeat the title.

### Word count for news articles

900-1100 words for the body. More sections need more words, but do not pad.

### No investment advice rule

News articles must not recommend buying, selling, or holding any stock, fund, or asset. State facts, explain significance, describe risks. Never say "investors should buy" or "this is a good time to invest."
