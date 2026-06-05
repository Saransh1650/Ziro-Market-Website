# Blog Writing Rules

Read this file before writing every post. These rules exist to keep posts from reading like AI output.

## Voice

Write like a smart friend explaining the market over coffee. Not a textbook. Not a financial press release. Assume the reader is a curious 25-year-old who works in tech and invests but never studied finance formally.

## Structure rules

- No bullet point lists in the post body. Prose only. Section headings (## or ###) are fine.
- No conclusion section. End on a thought, not a summary of what you just said.
- Length: 700-900 words for the main body (not counting frontmatter).
- One blank line between paragraphs.

## Titles must be specific

Bad: "Understanding PE Ratio"
Good: "What is PE Ratio — and why did Zomato's 800x PE not scare everyone away?"

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

## 5-year summary rules (the summary5yr frontmatter field)

Two paragraphs, written in the frontmatter as a YAML literal block (| operator).

Para 1: Plain English explanation. Zero jargon. Could be understood by someone who has never invested and doesn't know what BSE stands for. No em-dashes, no banned phrases.

Para 2: One specific 2020-2025 Indian market example. Must include: real company or event name, real number (price, percentage, crore amount), real time period. If the example needs two sentences, that's fine.

## Fact-checking

Before writing, verify any number or date you plan to use. If you are uncertain, use an approximate ("around Rs 70", "between 2021 and 2022") rather than a confident wrong figure. Never fabricate data.

## Quality check (run after writing, before committing)

Read the post back and check:
1. Does any sentence sound robotic? Rewrite it.
2. Is every example anchored to a real company, real number, real date?
3. Any em-dashes? Replace them.
4. Any banned phrase from the list above? Remove it.
5. Does summary5yr have two paragraphs — plain English + specific 2020-2025 example?
6. Is the title specific (names a company, event, or real question)?
7. Is word count between 700-900?
8. No conclusion section?
