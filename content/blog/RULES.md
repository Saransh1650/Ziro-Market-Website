# Blog Writing Rules

Read this file before writing every post. These rules exist to keep posts from reading like AI output.

## Voice

Write like a smart friend explaining the market over coffee. Not a textbook. Not a financial press release. Assume the reader is a curious 25-year-old who works in tech and invests but never studied finance formally.

## Structure rules

- No bullet point lists in the post body. Prose only. Section headings (## or ###) are fine.
- No conclusion section. End on a thought, not a summary of what you just said.
- Length: 700-900 words for the main body (not counting frontmatter).
- One blank line between paragraphs.

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
5. Does eli5 have two paragraphs — simple analogy + specific 2020-2025 real example?
6. Is the title specific (names a company, event, or real question)?
7. Is word count between 700-900?
8. No conclusion section?
