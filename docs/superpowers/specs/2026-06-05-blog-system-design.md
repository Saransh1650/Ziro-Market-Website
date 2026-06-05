# Blog System Design — Ziro Market

**Date:** 2026-06-05  
**Status:** Approved

---

## Overview

Add a daily blog to ziromarket.com covering Indian stock market topics: terminology explanations, market events, and core concepts. Two posts per day, fully automated — Claude writes, commits, pushes, Vercel deploys.

---

## Decisions Made

| Question | Decision |
|---|---|
| Where does blog live? | Separate `/blog` route + "Learn" in nav |
| Content storage | MDX files in `content/blog/` |
| 5-year toggle | Summary box at top of each post (amber styling, hidden by default) |
| Publishing | Fully automated — Claude cron agent, no human review |
| Posts per day | 2 |

---

## Content Architecture

### Directory structure

```
content/
  blog/
    RULES.md          ← writing rules (agent reads every run)
    TOPICS.md         ← queue + done list (agent updates after each post)
    what-is-pe-ratio.mdx
    rbi-rate-cut-june-2025.mdx
    ...
```

### MDX frontmatter schema

```yaml
---
title: "What is PE Ratio — and why did Zomato's 800x PE not scare everyone away?"
slug: "what-is-pe-ratio"
date: "2026-06-05"
category: "terminology"        # terminology | event | concept
excerpt: "One punchy sentence, max 20 words, for the listing card."
summary5yr: |
  Plain English paragraph (no jargon). Second paragraph: specific 2020-2025
  example with real company name, real numbers, real date.
tags: ["valuation", "fundamentals"]
---
```

The post body follows the frontmatter as standard Markdown/MDX.

---

## Page Structure

### Routes

```
app/
  blog/
    page.tsx              ← listing page (/blog)
    [slug]/
      page.tsx            ← individual post (/blog/what-is-pe-ratio)
```

### Components

```
components/
  blog/
    PostCard.tsx          ← card used on listing page
    SummaryBox.tsx        ← 5-year toggle + amber box (client component)
    CategoryChip.tsx      ← badge: Terminology / Event / Concept
lib/
  blog.ts                 ← MDX parsing, getAllPosts(), getPost(slug)
```

### Listing page (`/blog`)

- Header: "Markets, explained without the jargon." + subtitle
- Category filter chips: All / Terminology / Events / Concepts
- 3-column grid of `PostCard` components
- First post featured (spans 2 columns)
- "Learn" added to nav links

### Individual post page (`/blog/[slug]`)

- Breadcrumb: Learn / [category]
- Post header: category badge, date, title (h1), deck paragraph
- Toggle bar: "5-year view" label + toggle switch
- `SummaryBox`: hidden by default, amber-styled, appears when toggled
- Post body: prose only, headers OK, no bullet lists
- Prev/Next navigation at bottom

### 5-year toggle behavior

- Client component (`'use client'`)
- Toggle state lives in `useState`, no persistence (resets on navigate)
- When toggled on: `SummaryBox` renders `summary5yr` frontmatter content in amber box
- Label: "5-year view — plain English summary with a recent Indian market example"

---

## Blog Writing Rules

Stored in `content/blog/RULES.md`. The cron agent reads this file before writing every post.

### Voice and style

- Write like a smart friend explaining over coffee, not a textbook or press release
- Conversational but precise — never vague
- Indian market focus: use NSE/BSE examples, INR amounts, Indian companies and events
- Titles must be specific. Not "Understanding PE Ratio" — "What is PE Ratio and why did Zomato's 800x PE not scare everyone away?"
- Excerpts: one punchy sentence, max 20 words

### What to avoid (anti-patterns)

**Banned punctuation:** No em-dashes (`—`). Use a comma, period, or rewrite.

**Banned phrases (AI giveaways):**
- "It's worth noting", "it should be noted", "it is important to note"
- "delve into", "dive into"
- "comprehensive", "leverage", "utilize", "utilize"
- "in conclusion", "to summarize", "in summary"
- "furthermore", "moreover", "additionally", "importantly"
- "navigate", "seamlessly", "robust", "game-changer"
- "landscape", "realm", "crucial", "vital", "pivotal"
- Passive voice constructions: "it can be seen that", "it is known that"

**Structure rules:**
- No bullet point lists in the post body — prose only
- No conclusion section — end on a thought, not a summary
- Max 700-900 words for the main body

### Examples must be specific

Every factual claim needs a real anchor:
- Real company name (Zomato, HDFC Bank, Infosys — not "a major IT company")
- Real numbers (Rs 76 IPO price, 18% earnings growth — not "significant growth")
- Real dates (July 2021, Q3 FY24 — not "recently")

### 5-year summary rules

- Two paragraphs total
- Para 1: plain English explanation, zero jargon, could be understood by someone who has never invested
- Para 2: specific 2020-2025 Indian market example with real company/event + real numbers
- Must cite actual company name, actual date range, actual price or % or rupee figure

### Fact-checking

- Before writing, verify any number or date mentally
- If unsure of an exact figure, use a range ("between 70 and 80") or describe directionally ("roughly doubled") rather than guessing a specific wrong number
- Do not state a specific stock price, index level, or date unless confident it is correct

### Quality check (run after writing)

Read the post back and ask:
1. Does any sentence sound like it was written by a robot? Rewrite it.
2. Is every example specific — real company, real number, real date?
3. Does the post contain any banned phrase or em-dash? Remove them.
4. Does the summary5yr field have two paragraphs — plain English + specific 2020-2025 example?
5. Is the title specific and interesting, not generic?
6. Is it between 700-900 words?

---

## Topic Queue

Stored in `content/blog/TOPICS.md`. Agent picks the next topic from the queue, writes the post, moves it to the Done list, commits both files.

### Categories

- **terminology** — defining specific market terms with examples
- **event** — documenting a specific market event (RBI decision, big IPO, regulatory change)
- **concept** — explaining how something works (how circuit breakers fire, how IPO pricing works)

### Initial queue (50+ topics)

**Terminology**
- PE Ratio
- EPS (Earnings Per Share)
- EBITDA
- Market Cap
- Book Value vs Market Value
- Face Value
- Dividend yield
- Promoter holding
- Pledged shares
- Beta (volatility measure)
- 52-week high/low
- P/B ratio (Price to Book)
- Debt-to-equity ratio
- Return on Equity (ROE)
- Return on Capital Employed (ROCE)
- Free cash flow
- Working capital
- Upper/Lower circuit
- Delivery percentage
- Open Interest
- Call vs Put options
- Strike price
- Implied volatility
- PCR (Put-Call Ratio)
- VIX (India VIX)
- Bulk deal vs block deal

**Events**
- RBI June 2025 rate cut
- India's JP Morgan bond index inclusion (2024)
- Union Budget 2024 — capital gains tax change
- Adani FPO cancellation (Jan 2023)
- Nifty 50 all-time high 26,277 (Sept 2024)
- SEBI F&O rules tightening (Oct 2024)
- LIC IPO — India's largest ever (May 2022)
- Paytm payment bank crisis (Jan 2024)
- Zomato entering Nifty 50 (2024)
- Yes Bank rescue (March 2020)
- Reliance Rights Issue 2020
- Budget 2023 — new tax regime
- RBI MPC rate hike cycle 2022-2023

**Concepts**
- How circuit breakers work on NSE
- How IPOs are priced (book building process)
- FII vs DII — who actually moves Indian markets
- How Nifty 50 is calculated
- Why NSE and BSE prices differ
- How SEBI regulates markets
- What happens when a company goes bankrupt on NSE
- How mutual fund NAV is calculated
- Why SIP works mathematically (rupee cost averaging)
- T+1 settlement — what changed and why
- How stock splits work
- How buybacks work and why companies do them
- Short selling — what it is and why it's restricted in India
- How margin trading works
- Why promoters pledge shares and what it signals

---

## Automation

### Cron schedule

One run per day at 8:00 AM IST. Each run produces 2 posts (picks 2 topics from queue in sequence).

### Agent workflow (each run)

1. Read `content/blog/RULES.md`
2. Read `content/blog/TOPICS.md` — pick next 2 topics from queue
3. For each topic:
   a. Write MDX file to `content/blog/[slug].mdx` following RULES.md
   b. Run quality check (banned phrases, em-dashes, specificity, word count)
   c. Fix any issues found
4. Update `TOPICS.md` — move 2 done topics from Queue to Done
5. Commit all changed files with message: `blog: add [topic1] and [topic2]`
6. Push to main — Vercel auto-deploys

### Files committed per run

- `content/blog/[slug-1].mdx` (new)
- `content/blog/[slug-2].mdx` (new)
- `content/blog/TOPICS.md` (updated)

---

## Design System

Inherits the existing Ziro Market design system from `app/globals.css`:

| Token | Value | Used for |
|---|---|---|
| `--text-1` | `#0b3b2e` | Post titles, strong text |
| `--text-2` | `rgba(11,59,46,0.68)` | Body text |
| `--text-3` | `rgba(11,59,46,0.42)` | Dates, breadcrumbs, meta |
| `--amber` | `#9b6810` | 5-year box label, toggle active state |
| `--amber-dim` | `rgba(155,104,16,0.10)` | 5-year box background |
| `--positive` | `#1a6b3c` | Terminology category badge |
| `--border-1` | `rgba(11,59,46,0.10)` | Grid lines, dividers |
| `--mono` | JetBrains Mono | Kickers, dates, badges |
| `--sans` | Manrope | All body text and headings |

Category badge colors:
- `terminology` → green (`--positive-dim` / `--positive`)
- `event` → amber (`--amber-dim` / `--amber`)
- `concept` → neutral (`--bg-3` / `--text-2`)

---

## Deployment Flow

```
Claude cron agent
  → writes 2 MDX files + updates TOPICS.md
  → git commit + git push origin main
  → Vercel webhook fires
  → next build (static generation)
  → deploy live in ~2-3 minutes
```

No staging environment. Posts go live on push. Since Claude reviews its own output before committing, this is acceptable for this use case.

---

## Out of Scope

- Comments or reactions on posts
- Search within blog
- Email newsletter
- Author profiles
- Post editing UI
- Draft/preview workflow
