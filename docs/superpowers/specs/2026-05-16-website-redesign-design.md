# Ziro Website Redesign — Design Spec
**Date:** 2026-05-16
**Approach:** Narrative B — Pain-first editorial storytelling
**Status:** Approved by user

---

## Overview

Complete redesign of the Ziro marketing website to replace the current generic AI-looking hero (browser frame + phone mockup) with a bold, editorial, narrative-driven experience. The website tells a 3-act story: the chaos of juggling platforms today → Ziro enters → relief. No device chrome, no blue, no techy jargon, no "terminal" language.

---

## Design Principles

- **Pain before product.** Visitor feels seen before they're sold to.
- **Copy is the design.** Typography at editorial scale does visual heavy lifting.
- **Black. Not dark blue.** Background matches app: `#000000` / `#0a0a0a`.
- **Green and red only for financial data.** No decorative color. No gradients.
- **No device frames.** App screenshots shown raw — slightly angled, shadowed, no phone chrome.
- **No jargon.** Words like "terminal", "intelligence platform", "unified dashboard" are banned.
- **Swappable CTA.** Waitlist form now; easily replaced with App Store / Play Store badges at launch.

---

## Color Tokens (inherit from existing globals.css)

| Token | Value | Use |
|-------|-------|-----|
| `--bg` | `#0a0a0a` | Page background |
| `--bg-1` | `#111111` | Elevated surfaces |
| `--bg-2` | `#1a1a1a` | Cards, inputs |
| `--text-1` | `#f5f5f5` | Headlines |
| `--text-2` | `#a0a0a0` | Body copy |
| `--text-3` | `#666666` | Muted labels |
| `--green` | `#22c55e` | Positive data only |
| `--red` | `#ef4444` | Negative data only |

No new color tokens needed.

---

## Typography Scale

| Role | Font | Weight | Size |
|------|------|--------|------|
| Hero headline | Inter | 900 | `clamp(72px, 12vw, 140px)` |
| Section headline | Inter | 800 | `clamp(40px, 6vw, 72px)` |
| Feature headline | Inter | 800 | `clamp(32px, 4vw, 56px)` |
| Body | Inter | 400 | `clamp(16px, 1.4vw, 18px)` |
| Labels / meta | JetBrains Mono | 600 | `11–13px` |

Letter spacing on headlines: `-0.05em` to `-0.06em` (tight, editorial).
Line height on large headlines: `0.95–1.0` (tight stack).

---

## Page Architecture

### S1 — Navbar
- Sticky, `z-index: 500`
- Transparent background → `rgba(0,0,0,0.9) + blur(20px)` after 40px scroll
- Left: `ZIRO` wordmark — Inter 800, white, `letter-spacing: 0.04em`
- Right: single ghost CTA button `Join the waitlist →`
- No nav links — nothing competes with the scroll

### S2 — Hero
- Full viewport height (`100svh`)
- Text left-aligned, max-width `900px`, padding `0 clamp(24px, 5vw, 120px)`
- Vertical centering with `padding-top: clamp(120px, 18vh, 200px)`

**Headline (3-line stack):**
```
8 apps.
3 browser tabs.
1 trade you almost missed.
```
Inter 900, `clamp(72px, 11vw, 140px)`, white, letter-spacing `-0.055em`, line-height `0.95`.

**Sub-headline:**
```
There's a simpler way to watch the market.
```
`#22c55e`, Inter 500, `clamp(16px, 1.6vw, 20px)`, margin-top `32px`.

**CTA row** (margin-top `48px`):
- Primary: white button, black text, `Join the waitlist →`, border-radius `10px`, `padding: 16px 36px`
- Ghost: `See what's inside ↓`, `color: var(--text-3)`, no border, scroll-to-features on click

No illustration. No mockup. No background decoration except a very subtle dot-grid texture at `opacity: 0.015`.

### S3 — The Pain Section
**Label:** `YOUR CURRENT SETUP` — JetBrains Mono 600, `11px`, `var(--text-4)`, uppercase, `letter-spacing: 0.12em`

**Headline:** `"The apps most investors have open right now."` — Inter 800, ~48px, white.

**Chaos list** — typographic grid, 7 items. Each row:
- App name: Inter 700, white, ~32–40px
- Right-aligned annotation: Mono, muted, ~13px, italic
- Subtle bottom border `var(--border)`
- Alternating slight opacity (100%, 80%, 90%, 70%, 85%, 65%, 60%) — feels like chaos

```
NSE website            —  loads in 5 seconds
Moneycontrol           —  16 ads. you counted.
Google Finance         —  shows USD by default
Screener.in            —  fundamentals, finally
Your broker app        —  no sector data
Reddit thread          —  from March 2021
That Twitter list      —  person stopped posting
```

Items stagger-fade in on scroll with `[data-reveal]`. The whole section reads as sympathetic embarrassment — not mockery.

### S4 — The Pivot
Full-width. Centred. Breathes.

Single line, massive:
```
What if one app had all of it?
```
Inter 800, `clamp(40px, 7vw, 88px)`, white.

Below: Ziro wordmark / logo, size `clamp(80px, 12vw, 140px)`. A visual pause before features begin.

Optional: thin horizontal rule above and below this section.

### S5–S8 — Feature Sections (4 features)

Shared layout:
- Two columns: `48% text / 52% screenshot` on desktop, stacked on mobile
- Screenshot: raw app screen, `border-radius: 20px`, `rotate: ±3deg`, `box-shadow: 0 40px 80px rgba(0,0,0,0.7)`, no device frame
- Alternates: odd features = text left / screenshot right; even = screenshot left / text right
- Each section `min-height: 80vh`, vertically centred content

**Per-feature copy:**

| # | Problem headline | Sub-copy | Screenshot |
|---|---|---|---|
| 1 | "See what's moving. Before it's news." | Sector heatmap, top gainers, 52-week highs and lows, live indices | `/screenshots/sc-1.png` (home/heatmap) |
| 2 | "Your money. Tracked properly." | Portfolio NAV vs Nifty, full P&L, analytics that actually explain performance | `/screenshots/portfolio.png` |
| 3 | "Every sector. Every story." | Sector news, commodity prices, MF overlap, stock correlation — in one scroll | `/screenshots/sc-2.png` (discovery) |
| 4 | "Your watchlist, finally useful." | Live prices, mini-charts, comparison across multiple lists | `/screenshots/sc-3.png` (watchlist) |

Problem headlines: Inter 800, `clamp(36px, 5vw, 64px)`, white, `-0.04em` tracking.
Sub-copy: Inter 400, `clamp(15px, 1.3vw, 17px)`, `var(--text-2)`, margin-top `20px`, max-width `400px`.

Feature tag label above headline: Mono caps, `var(--text-4)`, `11px` — e.g. `01 / MARKET MAP`.

### S9 — Screenshots Mosaic
No heading. Full-bleed section. Black bg.

6–8 app screenshots in an organic overlapping grid:
- Mix of portrait (phone screenshots) and wider crops
- `border-radius: 16–24px`
- Rotation: alternating `±2–5deg`
- `box-shadow: 0 30px 60px rgba(0,0,0,0.6)`
- Subtle parallax on scroll (Y-axis only, 20–40px range, different per screenshot)
- No device chrome

Purpose: conveys product depth and visual richness without any copy. Dense and confident.

### S10 — Stats Strip
Full-width. `border-top` and `border-bottom: 1px solid var(--border)`. `background: var(--bg-1)`.

Four stats, horizontal flex with dividers:

```
500+  stocks tracked  |  Live  NSE & BSE  |  Real-time  data  |  Free  always
```

Label: Mono 700, `var(--text-4)`, `11px`, uppercase.
Number/value: Inter 800, white, `clamp(28px, 4vw, 48px)`.

Fades in on scroll.

### S11 — Waitlist CTA
Full-viewport. Centred.

**Headline:** `Stop juggling. Start seeing.` — Inter 900, `clamp(48px, 8vw, 96px)`, white.
**Sub:** `Be the first to know when Ziro launches.` — `var(--text-3)`, 18px.

**Form (waitlist mode):**
- Role toggle: `Investor` / `Trader` — pill toggle, same pattern as existing waitlist
- Email input: full-width, `var(--bg-2)` bg, `var(--border-2)` border
- Submit button: full-width, white bg, black text, `Join the waitlist`

**App launch mode (swap):**
Replace form with two badges: App Store + Play Store, side by side. No other markup change needed — form hidden, badges shown.

Background: subtle animated particle canvas (inherit from existing `waitlist-section` pattern).

### S12 — Footer
Two-column grid.

Left: ZIRO wordmark + `"India's market, in one place."` + social links.
Right: Privacy Policy, Terms of Service links.

Bottom bar: SEBI disclaimer — `"Ziro is not a registered investment advisor. Nothing on this app constitutes investment advice."` — Mono, `0.72rem`, `var(--text-4)`.

---

## Animations & Interactions

| Element | Animation |
|---------|-----------|
| All sections | `[data-reveal="up"]` — fade + translateY, staggered with `[data-delay]` |
| Chaos list items | Stagger 80ms apart, slide in from left |
| Feature screenshots | Fade + slight scale from `0.96` to `1` |
| Screenshots mosaic | Parallax Y-drift on scroll, each image independent |
| Navbar | Smooth bg transition on scroll threshold |
| Stats | Counter animation from 0 on first viewport entry |

Existing `ScrollRevealObserver` component handles `[data-reveal]`. No new animation library needed.

---

## Components to Delete
- `AppShowcase.tsx` — replaced by mosaic
- `ChartExperience.tsx` — not used in new design
- `CursorGlow.tsx` — remove (AI gimmick)
- `GridSection.tsx` — replaced
- `HeroNew.tsx` — replaced by new `Hero.tsx`
- `HowItWorks.tsx` — replaced by feature sections
- `MarketSignals.tsx` — absorbed into feature sections
- `SectorHeatmap.tsx` — absorbed into feature sections
- `Stats.tsx` — replaced by new stats strip
- `StockChatRooms.tsx` — cut (not a current app feature highlight)
- `Testimonials.tsx` — cut (no testimonials yet)
- `WhyUs.tsx` — replaced by narrative copy
- `WatchlistIntelligence.tsx` — absorbed into feature sections
- `Features.tsx` — replaced by 4 feature sections

## Components to Keep / Modify
- `Navbar.tsx` — simplify: remove nav links, keep logo + single CTA
- `Marquee.tsx` — keep as-is between hero and pain section
- `ScrollProgress.tsx` — keep
- `ScrollRevealObserver.tsx` — keep
- `Waitlist.tsx` — keep, minor copy changes
- `Footer.tsx` — simplify

## New Components to Create
| File | Purpose |
|------|---------|
| `Hero.tsx` | Pure-type hero, 3-line headline |
| `PainSection.tsx` | Chaos list with staggered reveals |
| `Pivot.tsx` | "What if one app..." full-width moment |
| `FeatureSplit.tsx` | Reusable two-column feature section |
| `ScreenshotMosaic.tsx` | Organic overlapping screenshot grid |
| `StatsStrip.tsx` | Animated stats bar |

---

## Screenshot Assets Needed
Exact filenames required in `/public/screenshots/`:
- `sc-1.png` — home screen / sector heatmap (exists)
- `portfolio.png` — portfolio NAV chart or All tab (needs adding)
- `sc-2.png` — discovery / sector stocks (exists)
- `sc-3.png` — watchlist (exists)
- `mosaic-1.png` through `mosaic-8.png` — 8 screens for the mosaic (need adding)

---

## Page Composition (final order)
```
<ScrollProgress />
<Navbar />          ← simplified
<Hero />            ← NEW
<Marquee />         ← keep
<PainSection />     ← NEW
<Pivot />           ← NEW
<FeatureSplit />    ← NEW × 4
<ScreenshotMosaic /> ← NEW
<StatsStrip />      ← NEW
<Waitlist />        ← keep, minor edits
<Footer />          ← simplified
```

---

## What This Is Not
- Not a "terminal" or "dashboard" or "platform"
- Not using blue, purple, or gradient backgrounds
- Not using device frames or browser chrome
- Not using stock photo illustrations or AI-generated imagery
- Not listing features as bullet points with icons
