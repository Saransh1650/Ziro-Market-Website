# LinkedIn as a free SEO + growth channel for Ziro Market

Goal: use the Ziro Market LinkedIn presence to (1) borrow LinkedIn's very high domain authority for search + AI-answer visibility, (2) drive referral traffic to ziromarket.com, and (3) convert readers into app installs. This doc is the playbook; `posts-queue.md` has ready posts; `scripts/linkedin-drafts.mjs` generates fresh drafts from the blog.

Links (always add UTM so we can measure LinkedIn in analytics):
- Site: https://www.ziromarket.com
- App download: https://www.ziromarket.com/download
- iOS: https://apps.apple.com/in/app/ziro-market-stock-trends/id6761326539
- Android: https://play.google.com/store/apps/details?id=com.ziro.market

UTM convention:
- Blog link: `?utm_source=linkedin&utm_medium=social&utm_campaign=blog&utm_content=<slug>`
- App link: `?utm_source=linkedin&utm_medium=social&utm_campaign=app_install&utm_content=<slug-or-topic>`

---

## What actually works on LinkedIn in 2026 (researched)

These findings shape everything below:

1. **LinkedIn Articles are indexed by Google; regular posts are NOT.** Company-page Articles and newsletters rank in search and get pulled into AI answers. This is our real "free SEO" lever: republish the best blogs as native LinkedIn Articles.
2. **Company-page organic reach fell ~60-66% (2024 to early 2026). Personal profiles get ~10x the reach.** So post from a personal profile (founder/team) first, then reshare to the company page, and have the team engage.
3. **Posts with an external link in the body get ~60% less reach, and the old "link in first comment" trick is now largely patched.** So: deliver the value natively in the post, and treat the link as secondary (comment or profile), or accept lower reach on the few posts where the click matters most.
4. **Carousels / document (PDF) posts perform best in 2026** because they keep people swiping inside LinkedIn. Our data posts (scorecards, "quick answer" boxes) convert perfectly into carousels.
5. **Brand mentions correlate with AI-search visibility ~3x more than backlinks.** Even nofollow LinkedIn mentions of "Ziro Market" help us show up in ChatGPT/Perplexity/AI Overviews.

Takeaway: lead with **native value** (text + carousels), publish flagship pieces as **Articles** (for indexing), keep the **link + app CTA** present but not the hero, and post **consistently** from a person, amplified by the page.

---

## The content mix (aim for 4-5 posts/week)

| Type | Cadence | Purpose |
| --- | --- | --- |
| Native text post (from a blog's "quick answer") | 2x/week | reach + brand |
| Carousel / document (scorecards, comparisons, "5 things to watch") | 1x/week | max reach, saves |
| LinkedIn Article (republish a flagship blog natively) | 1x/week | Google + AI indexing, authority |
| Market-commentary post (timely, no link, pure insight) | 1-2x/week | reach + credibility |
| App-value post (a feature the app does, tied to a market moment) | 1x/week | installs |

Rotate topics across the proven clusters: markets/macro (RBI, Fed, de-dollarization, gold), AI (data centers, AI bubble, AI stocks), new-age/IPOs (quick commerce, PhonePe, Groww, Swiggy vs Zomato), crypto (bitcoin, ETH, XRP, Solana), and smart-money (FII/DII).

---

## Post anatomy (the format that gets reach)

1. **Hook (line 1, under ~140 chars).** A curiosity gap or a surprising number. This is all most people see before "see more." Examples: "Blinkit is the only quick-commerce app in India making money. Here's the scoreboard." / "Central banks bought 2,175 tonnes of gold last year. That's not a coincidence."
2. **One blank line, then 3-6 short lines** delivering the actual insight (use the blog's "quick answer" + one or two stats). Short lines and line breaks beat paragraphs on mobile.
3. **A takeaway line** the reader can repeat.
4. **Soft CTA:** "We break this down (with the numbers) on the Ziro Market app — link in the comments." or for app: "Track FII/DII flows and this exact data live on Ziro Market (free): [app link]".
5. **3-5 hashtags** on their own line: mix broad (#StockMarket #Investing #IndianStockMarket) + niche (#QuickCommerce #Nifty50 #Crypto) + brand (#ZiroMarket).
6. **First comment:** drop the blog/app link here (native reach stays higher), and be first to comment to seed the thread.

Keep it human, specific, and number-led. No hype, no "financial advice." End every market post with a light disclaimer: "Not investment advice."

---

## LinkedIn Articles (the SEO engine — do 1/week)

Because Articles are indexed by Google, republish flagship blogs as native LinkedIn Articles:
1. Title = the blog's `seoTitle` idea, keyword-first ("Quick Commerce War 2026: Blinkit vs Zepto vs Instamart").
2. Paste the blog body, lightly trimmed. Keep the "quick answer", the tables (as text/lists), and the FAQ (great for AI answers).
3. First line: the self-contained answer (same GEO rule as the site).
4. Add a canonical-style note + link back: "Originally published on Ziro Market: [blog link]" near the top or bottom. This gives us the brand mention + referral, and the Article ranks in its own right.
5. End with the app CTA.

Priority blogs to publish as Articles first (highest search + AI-answer value):
- quick-commerce-war-2026-blinkit-zepto-instamart
- stock-market-august-2026-what-to-watch
- it-sector-q1-fy27-scorecard-2026
- de-dollarization-brics-2026-dollar-dominance
- central-banks-buying-gold-2026
- ai-bubble-2026-will-it-burst
- phonepe-ipo-2026 / groww-ipo-2026 / swiggy-vs-zomato-2026

---

## Cadence & workflow (keep it sustainable)

- **Batch weekly.** Every Monday, run `node scripts/linkedin-drafts.mjs 8` to get 8 fresh drafts from the newest blogs, tweak the hooks, and schedule the week.
- **Schedule** with LinkedIn's native scheduler (free) or Buffer/Publer if you want a queue.
- **Post from a person, reshare to the page**, engage for the first 60-90 minutes (the algorithm rewards early engagement).
- **Track** the `utm_campaign=linkedin` traffic in analytics and the `app_install` UTM to see installs. Double down on the post types that convert.

---

## What I can and cannot do from here

- I CAN: write the posts/articles/carousels, keep them on-brand and GEO-clean, and regenerate drafts from every new blog via the script.
- I CANNOT: publish to LinkedIn directly (no LinkedIn account/API is connected to this workspace). To automate true posting, connect one of:
  - LinkedIn's official Marketing API (needs a LinkedIn developer app + Page admin approval), which a scheduled cloud routine could then call, or
  - a scheduler like Buffer/Publer/Zapier that holds the queue and posts on a cadence.
  Tell me which and I'll wire the automation (e.g., a weekly routine that generates the drafts and hands them to the scheduler).
