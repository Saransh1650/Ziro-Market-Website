# Ziro Market — Website Redesign

**Date:** 2026-05-20
**Author:** Saransh Singhal (with Claude)
**Status:** Approved for implementation planning

## Goal

Full ground-up rewrite of the marketing site to:

1. Sharpen the brand from "generic dark editorial" to a distinct, non-AI, non-glow, non-blue design.
2. Match the colour palette of the Flutter app (`lib/core/app_theme.dart`) so site and product feel like one company.
3. Showcase the pain points users live with today and the features of the app — without leaning on screenshots.
4. Architect the waitlist flow so flipping to a launched state requires only an env var change.

The current site (Next.js 16.2, components/ tree) is a black/white editorial design with screenshot mosaic. It is being replaced wholesale, not incrementally refactored.

## Decisions log

| Decision | Choice | Alternatives considered |
|---|---|---|
| Site purpose | Hybrid waitlist + launch-swap | Waitlist-only; launched-only |
| Design direction | Swiss Brutalist (dark, app-matched) | Editorial print, warm institutional dark, terminal heritage |
| Feature presentation | Mixed — bold type + abstract data viz + optional screenshot deep-dive | Faux-UI mockups, pure abstract, pure typographic |
| Accent palette | Amber `#F59E0B` primary, gold `#D97706` rare, app market colors | Burnt orange, oxblood, forest, no color |
| Launch-swap mechanism | Single `NEXT_PUBLIC_LAUNCH_MODE` env var, all branching via `getLaunchMode()` | Multiple flags, build-time codegen |

## Design system

### Palette (app-matched, dark)

```
bg-0         #000000   page base
bg-1         #0A0A0A   section alt / cards
bg-2         #111111   elevated tiles
bg-3         #171717   hover states
border-1     #1F1F1F   hairlines
border-2     #2A2A2A   strong dividers
text-1       #EDEDED   primary
text-2       #C0C0C0   body
text-3       #6B6B6B   captions / mono
amber        #F59E0B   primary accent · CTAs · key word in headlines
gold         #D97706   rare · stat hover · key numerals
positive     #22C55E   up moves only
negative     #EF4444   down moves only
```

### Typography

- **Display** — Neue Haas Grotesk Display, fallback Inter Display 900. `clamp(3rem, 7vw, 5.8rem)`, tracking `-0.055em`, line-height `0.92`. Occasional italic semibold for rhythm; amber on a single key word per headline.
- **Body** — Inter 400/500, `0.95rem`, line-height `1.55`, colour `text-2`.
- **Mono** — JetBrains Mono 600 for tickers, kickers, captions, stat labels. Uppercase, tracking `0.14em–0.18em`, colour `text-3`.

### Grid & motifs

- Container max `1340px`, gutter `28px`, 12-column.
- Hairline section dividers (1px `#1F1F1F`) — no rounded section breaks.
- Corner crosshair brackets on hero + each feature block (signature motif).
- Number-prefixed sections: `№ 01 / MARKET MAP`.
- No shadows, no gradients, no glow, no blur (except sticky nav backdrop).
- Radius: `4px` buttons, `8px` cards, `0` section blocks.
- Motion: scroll-reveal `opacity + 40px translateY`, 600ms `cubic-bezier(.16, 1, .3, 1)`. Marquee. Pulse on `LIVE` dot only.

## Architecture

### Stack (kept)

- Next.js 16.2 App Router, React 19, TypeScript
- Tailwind 4 + `globals.css` design tokens
- framer-motion (existing dep) for scroll/intersection
- Vercel Analytics
- No new heavy dependencies

### File structure (target)

```
app/
  layout.tsx               # fonts, analytics, metadata
  page.tsx                 # composes sections in order
  globals.css              # design tokens + base reset
  api/
    waitlist/route.ts      # POST handler (existing endpoint, kept)
    indices/route.ts       # NEW — live indices fetcher w/ static fallback
components/
  layout/
    Nav.tsx
    Footer.tsx
    ScrollReveal.tsx
  hero/
    Hero.tsx
    LiveIndices.tsx
    Marquee.tsx
  pain/
    PainSection.tsx
    PainCard.tsx
  pivot/
    Pivot.tsx
  features/
    FeatureBlock.tsx
    viz/
      HeatmapViz.tsx
      NavVsNiftyViz.tsx
      SectorTiles.tsx
      WatchlistRows.tsx
      EventsGrid.tsx
      PaperTradeMock.tsx
  stats/
    StatsStrip.tsx
  builtFor/
    BuiltForIndia.tsx
  waitlist/
    Waitlist.tsx
    LaunchCTA.tsx
lib/
  launchMode.ts
  marketData.ts
  analytics.ts
hooks/
  useLiveIndices.ts
  useReveal.ts
```

### Launch-swap mechanism

- `lib/launchMode.ts` exports `getLaunchMode(): 'waitlist' | 'launched'`.
- Reads `NEXT_PUBLIC_LAUNCH_MODE`, defaults to `'waitlist'`.
- `Waitlist`, `Nav`, `Hero` all branch on this single flag.
- To launch: set env var to `launched`, redeploy. No code edits.
- `LaunchCTA.tsx` (App Store + Play Store badges) pre-built but conditionally rendered.

### Data flow

- **Live indices** — client-side `useLiveIndices` polls `/api/indices` every 15s. API tries upstream (Upstox or similar), falls back to static snapshot in `lib/marketData.ts`. First render uses SSR with static snapshot so there is no loading spinner.
- **Waitlist** — POST to existing `/api/waitlist`, returns `{ position }`.
- No auth, no DB, no state-management library.

### Boundaries

- Each section component is self-contained, props-only.
- No section reaches into another's DOM or state.
- Viz components are pure: data in → SVG/HTML out.

## Page sections (top → bottom)

| № | Section | Notes |
|---|---|---|
| 01 | **Nav** (60px sticky) | Logo · `App · Why · Manifesto` · waitlist counter chip · amber CTA. Scroll: transparent → semi-opaque + backdrop-blur + hairline bottom. |
| 02 | **Hero** (~100vh) | Mono kicker with live dot, 3-line headline (italic + amber key word), 2-col sub-grid (body + `<1s` stat), amber + ghost CTAs, microcopy, live indices strip (NIFTY 50 / BANK NIFTY / SENSEX / INDIA VIX), corner crosshairs. |
| 03 | **Marquee** | Single hairline-bordered strip, mono tickers, slow auto-scroll, edge fades. |
| 04 | **Pain — "What you put up with today"** | Three villains (NSE / Moneycontrol / Google Finance), interactive tabs. Each: huge gold stat numeral, 3 bullet complaints, mono rating badge (`SLOW`, `NOISY`, `WRONG MARKET`). Right side: CSS-built faux browser frame mocking that competitor (skeleton bars, "AD" rectangles). No screenshots of competitors. |
| 05 | **Pivot** | Full-bleed black, 2 lines: `So we built something else.` + small mono `Live. Indian. Ad-free. Built for the next decade.` Hairlines above + below. |
| 06 | **Feature 01 · Market Map** | "11 sectors. **One look.**" — `HeatmapViz` (11-cell sector grid, real names, green/red shades). |
| 07 | **Feature 02 · Portfolio** | "Your money. **Tracked properly.**" — `NavVsNiftyViz` (two-line SVG chart, +18.4% chip). |
| 08 | **Feature 03 · Discovery** | "Every sector. **Every story.**" — `SectorTiles` (commodity tiles + sector cards). |
| 09 | **Feature 04 · Watchlist** | "Your picks, **finally useful.**" — `WatchlistRows` (live ticker rows with sparklines). |
| 10 | **Feature 05 · Tomorrow** | "Know what's coming. **Tomorrow.**" — `EventsGrid` (calendar grid of earnings, results, ex-div, RBI dates). |
| 11 | **Feature 06 · Paper Trade** | "Practice without **the pain.**" — `PaperTradeMock` (fake order pad + P&L delta). |
| 12 | **Stats Strip** | Mono row: `1.8M ticks/day · 42 data sources · <1s cold start · 100% Indian markets`. |
| 13 | **Built for India** | Headline + monochrome wordmark strip (NSE · BSE · MCX · SEBI registered · Upstox), one-line manifesto on rupee formatting / IST / lakh-crore. |
| 14 | **Waitlist / Launch CTA** | Conditional on launch mode. *Waitlist:* counter + email input + iOS/Android toggle + amber submit. *Launched:* `Download Ziro Market` + store badges + sign-in link. Float-ticker background. |
| 15 | **Footer** | 2-col (brand · links). Disclaimer (market risks, India only, not SEBI registered as advisor), © year, build hash mono. |

Each `FeatureBlock` uses the same shell: top hairline + `№ 0N / TAG` (mono) + 2-line headline (amber on one word) + 2-col body (copy + 2 bullet sub-features on left, viz component on right). Layout alternates left/right per block.

## Data, error handling, edge cases

### Live data

- `useLiveIndices` fetches `/api/indices` every 15s.
- API route tries upstream → on fail returns static snapshot from `lib/marketData.ts`.
- First render: SSR with static snapshot (no layout shift, no loading spinner).
- Stale-mark: if data older than 60s, mono caption shows `LAST UPDATE 14:23 IST` greyed.
- Off-hours (outside 09:15–15:30 IST Mon–Fri): show last close + `MARKET CLOSED` badge.

### Marquee

- Pure CSS animation, seeded list of 30 symbols.
- Live values overlay when `useLiveIndices` data resolves.
- No JS animation loop.

### Waitlist submit

- POST `/api/waitlist` with `{ email, platform }`.
- Validation: email regex client + server, platform must be `ios|android`.
- Success: `{ position }` → display `You're #2,847 in line.`
- Duplicate email: 200 with existing position (not an error).
- Network fail: inline mono error `COULD NOT REACH SERVER · RETRY` in negative red.
- Rate-limit by IP server-side.

### Launch-swap

- Single env var `NEXT_PUBLIC_LAUNCH_MODE=waitlist|launched`.
- All branching imports `getLaunchMode()` — no scattered checks.
- When flipped: waitlist form hidden, store badges shown, hero CTA copy + nav CTA copy swap.
- Counter chip in nav: in waitlist mode shows waitlist count, in launched mode hidden or shows `4.8★ App Store`.

### Accessibility

- `prefers-reduced-motion`: disable marquee, scroll-reveal becomes instant.
- Color contrast: ivory on black 17:1, amber on black 11:1 — AAA on display, AA on body.
- All interactive elements keyboard-focusable, visible 2px amber focus ring.
- Live regions: indices have `aria-live="polite"` on change.
- Proper h1/h2/h3 hierarchy.
- Alt text on logo mark, mono captions labelled with `aria-label`.

### Responsive breakpoints

- `≥1280px` — full layout.
- `1024–1279px` — slight compression, indices strip wraps 2×2.
- `768–1023px` — feature blocks single-column, viz stacks below copy.
- `<768px` — nav becomes hamburger → bottom-sheet menu; headlines `clamp` down; marquee narrower; hero stat moves below body para.

### Performance budgets

- LCP target < 1.2s (matches hero promise).
- No image > 80kb except OG/social cards.
- Fonts: subset Latin + numerals, `font-display: swap`.
- All viz pure SVG/CSS; canvas only for optional waitlist background, 8ms render budget.
- No third-party scripts above the fold (analytics deferred).

### SEO / metadata

- Existing `sitemap.ts` and `robots.ts` kept.
- New OG: bold headline rendered at build via `/api/og` route (optional).
- Title: `Ziro Market — Indian markets, without the noise.`
- Description aligned to hero sub.
- Structured data: `Organization` + `SoftwareApplication`.

## Testing

- **Visual** — Playwright screenshot diffs per section at 3 breakpoints (1440, 1024, 390).
- **Unit** — `lib/launchMode.ts` (both modes), `useLiveIndices` (fallback + stale-mark), `Waitlist` (validation, dupe, error).
- **Integration** — form submit → mock API → verify success/error UI.
- **A11y** — `axe-core` via Playwright on each route.
- **Manual checklist before deploy** — scroll-reveal triggers, marquee runs, reduced-motion respected, mobile nav opens, launch-mode flip preview.

## Scope

### In

- Full rewrite of `app/page.tsx` composition.
- New `components/` tree (delete current Hero, FeatureSplit, ScreenshotMosaic, PainSection, Pivot, Marquee, StatsStrip, Navbar, Waitlist, Footer; rewrite per new spec).
- Rewrite `globals.css` to new design system (keep token shape, replace values).
- Six new viz components — pure SVG/CSS.
- Launch-mode flag wiring (`lib/launchMode.ts` + branching components).
- `/privacy` and `/terms` pages re-skinned to match (content kept).
- Live indices API route — basic implementation with static fallback.

### Out (this iteration)

- Real-time WebSocket (polling is fine; WS later).
- Auth, dashboard, web app version.
- Blog / changelog / careers pages.
- i18n (English only first).
- A/B test infrastructure.
- Custom font hosting (Google Fonts CDN is fine).
- Animated logo / mascot.
- Optional screenshot deep-dive modal — component scaffolded, populated later if needed; `public/screenshots/sc-*.png` reused if invoked.

## Rollout

- Build on a feature branch, replace existing components in one PR (full rewrite, not incremental).
- Preview deploy via Vercel for review.
- Diff QA against current site at all 3 breakpoints.
- Merge → production.
- Monitor Vercel Analytics for bounce / scroll-depth changes first 72 hours.
- Launch-day flip: env var change + redeploy, no code touch.

## Risks & mitigations

| Risk | Mitigation |
|---|---|
| Without screenshots, abstract viz feels unconvincing | Each viz uses real names + realistic numbers; optional deep-dive modal scaffolded. |
| Brutalist look feels cold for retail audience | Amber accent + warm copy tone + humanised bullets in pain section. |
| Dark mode default with no toggle | Matches app — conscious choice. Toggle out-of-scope. |
| Live indices upstream dependency | Static fallback always serves first paint. |
