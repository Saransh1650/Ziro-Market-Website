# Website Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current generic hero + feature sections with a bold, narrative-driven landing page that leads with pain, introduces Ziro as the relief, and showcases app features through raw screenshots without device frames.

**Architecture:** 12 new/modified components composed in `app/page.tsx`. No new libraries. Existing `[data-reveal]` scroll animation pattern from `ScrollRevealObserver` reused throughout. Inline styles consistent with existing codebase convention.

**Tech Stack:** Next.js 15 (App Router), TypeScript, CSS via `globals.css` + inline styles, Inter + JetBrains Mono fonts (already loaded).

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| CREATE | `components/Hero.tsx` | Full-viewport type-only hero section |
| CREATE | `components/PainSection.tsx` | Staggered chaos list of platforms users juggle |
| CREATE | `components/Pivot.tsx` | "What if one app had all of it?" transition moment |
| CREATE | `components/FeatureSplit.tsx` | Reusable two-column feature row (text + screenshot) |
| CREATE | `components/ScreenshotMosaic.tsx` | Horizontal scrolling mosaic of raw app screenshots |
| CREATE | `components/StatsStrip.tsx` | Four-stat strip with monospace labels |
| MODIFY | `app/page.tsx` | New composition order, feature data array |
| MODIFY | `components/Navbar.tsx` | CTA copy tweak only |
| MODIFY | `components/Waitlist.tsx` | Headline + subtitle copy only |
| MODIFY | `components/Footer.tsx` | Tagline copy only |
| MODIFY | `app/globals.css` | Add `.feature-split-inner` responsive rule |
| DELETE | `components/AppShowcase.tsx` | Replaced by ScreenshotMosaic |
| DELETE | `components/ChartExperience.tsx` | Not in new design |
| DELETE | `components/CursorGlow.tsx` | Removed |
| DELETE | `components/FeatureSection.tsx` | Replaced by FeatureSplit |
| DELETE | `components/GridSection.tsx` | Replaced |
| DELETE | `components/HeroNew.tsx` | Replaced by Hero |
| DELETE | `components/HowItWorks.tsx` | Replaced |
| DELETE | `components/MarketSignals.tsx` | Absorbed |
| DELETE | `components/SectorHeatmap.tsx` | Absorbed |
| DELETE | `components/Stats.tsx` | Replaced by StatsStrip |
| DELETE | `components/StockChatRooms.tsx` | Cut |
| DELETE | `components/Testimonials.tsx` | Cut |
| DELETE | `components/WhyUs.tsx` | Replaced |
| DELETE | `components/WatchlistIntelligence.tsx` | Absorbed |
| DELETE | `components/Features.tsx` | Replaced |
| DELETE | `components/AppExperience.tsx` | Not in new design |

---

## Task 1: Update page.tsx composition + delete old components

**Files:**
- Modify: `app/page.tsx`
- Delete: all 11 components listed in DELETE rows above

- [ ] **Step 1: Rewrite `app/page.tsx`**

Replace entire file with:

```tsx
import ScrollProgress from '@/components/ScrollProgress';
import ScrollRevealObserver from '@/components/ScrollRevealObserver';
import Navbar from '@/components/Navbar';
import Marquee from '@/components/Marquee';
import Waitlist from '@/components/Waitlist';
import Footer from '@/components/Footer';

// Temporarily stub new components until created
function Hero() { return <section style={{ minHeight: '100svh', background: '#0a0a0a', display: 'flex', alignItems: 'center', padding: '120px 48px' }}><h1 style={{ color: '#fff', fontSize: '80px', fontWeight: 900 }}>8 apps.<br />3 browser tabs.<br />1 trade you almost missed.</h1></section>; }
function PainSection() { return <section style={{ background: '#0a0a0a', padding: '80px 48px', color: '#fff' }}>Pain section placeholder</section>; }
function Pivot() { return <section style={{ background: '#0a0a0a', padding: '80px 48px', color: '#fff', textAlign: 'center', borderTop: '1px solid #222' }}>Pivot placeholder</section>; }
function FeatureSplit({ num }: { num: string }) { return <section style={{ background: '#0a0a0a', padding: '80px 48px', color: '#fff', borderTop: '1px solid #222' }}>Feature {num} placeholder</section>; }
function ScreenshotMosaic() { return <section style={{ background: '#0a0a0a', padding: '60px 0', borderTop: '1px solid #222', color: '#fff' }}>Mosaic placeholder</section>; }
function StatsStrip() { return <section style={{ background: '#111', padding: '40px 48px', color: '#fff', borderTop: '1px solid #222' }}>Stats placeholder</section>; }

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <ScrollRevealObserver />
      <Navbar />
      <Hero />
      <Marquee />
      <PainSection />
      <Pivot />
      <FeatureSplit num="01" />
      <FeatureSplit num="02" />
      <FeatureSplit num="03" />
      <FeatureSplit num="04" />
      <ScreenshotMosaic />
      <StatsStrip />
      <Waitlist />
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Delete old components**

```bash
cd "/Users/saransh/Dev/Websites/Trade Insights Website"
rm components/AppShowcase.tsx components/ChartExperience.tsx components/CursorGlow.tsx
rm components/FeatureSection.tsx components/GridSection.tsx components/HeroNew.tsx
rm components/HowItWorks.tsx components/MarketSignals.tsx components/SectorHeatmap.tsx
rm components/Stats.tsx components/StockChatRooms.tsx components/Testimonials.tsx
rm components/WhyUs.tsx components/WatchlistIntelligence.tsx components/Features.tsx
rm components/AppExperience.tsx
```

- [ ] **Step 3: Verify dev server compiles cleanly**

```bash
cd "/Users/saransh/Dev/Websites/Trade Insights Website" && npm run dev
```

Expected: server starts, no TypeScript errors, page loads at localhost:3000. Placeholders visible.

- [ ] **Step 4: Commit**

```bash
cd "/Users/saransh/Dev/Websites/Trade Insights Website"
git add -A
git commit -m "refactor: remove old components, stub new page composition"
```

---

## Task 2: Create Hero component

**Files:**
- Create: `components/Hero.tsx`
- Modify: `app/page.tsx` (remove stub, import real component)

- [ ] **Step 1: Create `components/Hero.tsx`**

```tsx
'use client';

export default function Hero() {
  return (
    <section
      style={{
        minHeight: '100svh',
        background: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 'clamp(120px, 18vh, 200px) clamp(24px, 5vw, 120px) clamp(60px, 8vh, 100px)',
        position: 'relative',
      }}
    >
      {/* Dot grid texture */}
      <div
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.015) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div style={{ maxWidth: '900px', position: 'relative' }}>
        <h1
          style={{
            fontSize: 'clamp(64px, 11vw, 140px)',
            fontWeight: 900,
            color: '#ffffff',
            letterSpacing: '-0.055em',
            lineHeight: 0.95,
            margin: 0,
          }}
        >
          8 apps.<br />
          3 browser tabs.<br />
          1 trade you<br />almost missed.
        </h1>

        <p
          style={{
            fontSize: 'clamp(16px, 1.6vw, 20px)',
            color: 'var(--green)',
            fontWeight: 500,
            marginTop: '32px',
            lineHeight: 1.4,
          }}
        >
          There&apos;s a simpler way to watch the market.
        </p>

        <div
          style={{
            display: 'flex', alignItems: 'center',
            gap: '24px', marginTop: '48px', flexWrap: 'wrap',
          }}
        >
          <a
            href="#waitlist"
            style={{
              display: 'inline-flex', alignItems: 'center',
              padding: '16px 36px',
              background: '#ffffff', color: '#000000',
              borderRadius: '10px',
              fontWeight: 700, fontSize: '1rem',
              letterSpacing: '-0.01em',
              textDecoration: 'none',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(255,255,255,0.12)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Join the waitlist →
          </a>
          <a
            href="#pain"
            style={{
              color: 'var(--text-3)',
              fontSize: '0.95rem',
              fontWeight: 500,
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-1)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-3)')}
          >
            See what&apos;s inside ↓
          </a>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Replace stub in `app/page.tsx`**

Remove the `function Hero()` stub line and add at top of file:
```tsx
import Hero from '@/components/Hero';
```

- [ ] **Step 3: Verify in browser**

Run `npm run dev`. Check localhost:3000:
- Headline stacks 4 lines, very large, white, tight leading
- Green sub-headline below
- Two CTA links visible
- Dot grid texture barely visible
- Fills full viewport height

- [ ] **Step 4: Commit**

```bash
cd "/Users/saransh/Dev/Websites/Trade Insights Website"
git add components/Hero.tsx app/page.tsx
git commit -m "feat: add Hero component — pure typography hero"
```

---

## Task 3: Create PainSection component

**Files:**
- Create: `components/PainSection.tsx`
- Modify: `app/page.tsx` (remove stub, import real)

- [ ] **Step 1: Create `components/PainSection.tsx`**

```tsx
const painItems = [
  { app: 'NSE website',        note: 'loads in 5 seconds' },
  { app: 'Moneycontrol',       note: '16 ads. you counted.' },
  { app: 'Google Finance',     note: 'shows USD by default' },
  { app: 'Screener.in',        note: 'fundamentals, finally' },
  { app: 'Your broker app',    note: 'no sector data' },
  { app: 'Reddit thread',      note: 'from March 2021' },
  { app: 'That Twitter list',  note: 'person stopped posting' },
];

const opacities = [1, 0.8, 0.9, 0.7, 0.85, 0.65, 0.6];

export default function PainSection() {
  return (
    <section
      id="pain"
      style={{
        background: 'var(--bg)',
        padding: 'clamp(80px, 12vh, 140px) clamp(24px, 5vw, 120px)',
      }}
    >
      <p
        style={{
          fontFamily: 'var(--mono)', fontSize: '11px', fontWeight: 700,
          letterSpacing: '0.12em', color: 'var(--text-4)',
          textTransform: 'uppercase', marginBottom: '32px',
        }}
      >
        YOUR CURRENT SETUP
      </p>

      <h2
        data-reveal="up"
        style={{
          fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800,
          color: 'var(--text-1)', letterSpacing: '-0.04em',
          marginBottom: '64px', maxWidth: '600px', lineHeight: 1.1,
        }}
      >
        The apps most investors<br />have open right now.
      </h2>

      <div style={{ maxWidth: '860px' }}>
        {painItems.map((item, idx) => (
          <div
            key={idx}
            data-reveal="up"
            data-delay={String(idx * 80)}
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              padding: '22px 0',
              borderBottom: '1px solid var(--border)',
              opacity: opacities[idx],
              gap: '24px',
            }}
          >
            <span
              style={{
                fontSize: 'clamp(22px, 3.5vw, 40px)',
                fontWeight: 700,
                color: 'var(--text-1)',
                letterSpacing: '-0.03em',
                lineHeight: 1,
              }}
            >
              {item.app}
            </span>
            <span
              style={{
                fontFamily: 'var(--mono)',
                fontSize: '13px',
                color: 'var(--text-4)',
                fontStyle: 'italic',
                flexShrink: 0,
                textAlign: 'right',
              }}
            >
              — {item.note}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Replace stub in `app/page.tsx`**

Remove `function PainSection()` stub. Add import:
```tsx
import PainSection from '@/components/PainSection';
```

- [ ] **Step 3: Verify in browser**

Check localhost:3000:
- 7 rows visible, each with app name left + italic note right
- Rows decrease in opacity (first bold, last faint)
- Bottom border on each row
- Large app names, smaller italic note

- [ ] **Step 4: Commit**

```bash
cd "/Users/saransh/Dev/Websites/Trade Insights Website"
git add components/PainSection.tsx app/page.tsx
git commit -m "feat: add PainSection — chaos list of platforms"
```

---

## Task 4: Create Pivot component

**Files:**
- Create: `components/Pivot.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create `components/Pivot.tsx`**

```tsx
export default function Pivot() {
  return (
    <section
      style={{
        background: 'var(--bg)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        padding: 'clamp(80px, 14vh, 160px) clamp(24px, 5vw, 120px)',
        textAlign: 'center',
      }}
    >
      <h2
        data-reveal="up"
        style={{
          fontSize: 'clamp(40px, 7vw, 88px)',
          fontWeight: 800,
          color: 'var(--text-1)',
          letterSpacing: '-0.05em',
          lineHeight: 1.0,
          maxWidth: '800px',
          margin: '0 auto 56px',
        }}
      >
        What if one app<br />had all of it?
      </h2>

      <div
        data-reveal="up"
        data-delay="200"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '14px',
        }}
      >
        <div
          style={{
            width: '44px', height: '44px',
            borderRadius: '10px', overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <img
            src="/app_icon/ziro.png"
            alt="Ziro"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>
        <span
          style={{
            fontSize: 'clamp(32px, 5vw, 56px)',
            fontWeight: 900,
            color: '#ffffff',
            letterSpacing: '0.06em',
          }}
        >
          ZIRO
        </span>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Replace stub in `app/page.tsx`**

Remove `function Pivot()` stub. Add import:
```tsx
import Pivot from '@/components/Pivot';
```

- [ ] **Step 3: Verify in browser**

Check localhost:3000:
- Full-width section with top/bottom borders
- Large headline centred
- Ziro icon + wordmark below, centred

- [ ] **Step 4: Commit**

```bash
cd "/Users/saransh/Dev/Websites/Trade Insights Website"
git add components/Pivot.tsx app/page.tsx
git commit -m "feat: add Pivot — narrative transition moment"
```

---

## Task 5: Create FeatureSplit component + add responsive CSS

**Files:**
- Create: `components/FeatureSplit.tsx`
- Modify: `app/globals.css` (add responsive rule)
- Modify: `app/page.tsx` (remove stubs, wire up 4 feature instances)

- [ ] **Step 1: Create `components/FeatureSplit.tsx`**

```tsx
interface FeatureSplitProps {
  num: string;
  tag: string;
  headline: string;
  body: string;
  screenshot: string;
  screenshotAlt: string;
  reverse?: boolean;
}

export default function FeatureSplit({
  num,
  tag,
  headline,
  body,
  screenshot,
  screenshotAlt,
  reverse = false,
}: FeatureSplitProps) {
  return (
    <section
      style={{
        background: 'var(--bg)',
        borderTop: '1px solid var(--border)',
        padding: 'clamp(80px, 12vh, 140px) clamp(24px, 5vw, 80px)',
      }}
    >
      <div
        className="feature-split-inner"
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: reverse ? 'row-reverse' : 'row',
          alignItems: 'center',
          gap: 'clamp(48px, 6vw, 120px)',
        }}
      >
        {/* Text side */}
        <div
          style={{ flex: '0 0 45%' }}
          data-reveal={reverse ? 'right' : 'left'}
        >
          <p
            style={{
              fontFamily: 'var(--mono)',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              color: 'var(--text-4)',
              textTransform: 'uppercase',
              marginBottom: '24px',
            }}
          >
            {num} / {tag}
          </p>
          <h2
            style={{
              fontSize: 'clamp(32px, 4vw, 56px)',
              fontWeight: 800,
              color: 'var(--text-1)',
              letterSpacing: '-0.04em',
              lineHeight: 1.05,
              marginBottom: '20px',
              whiteSpace: 'pre-line',
            }}
          >
            {headline}
          </h2>
          <p
            style={{
              fontSize: 'clamp(15px, 1.3vw, 17px)',
              color: 'var(--text-2)',
              lineHeight: 1.7,
              maxWidth: '400px',
            }}
          >
            {body}
          </p>
        </div>

        {/* Screenshot side */}
        <div
          style={{ flex: '0 0 50%', display: 'flex', justifyContent: 'center' }}
          data-reveal={reverse ? 'left' : 'right'}
          data-delay="150"
        >
          <img
            src={screenshot}
            alt={screenshotAlt}
            style={{
              width: '100%',
              maxWidth: '300px',
              borderRadius: '20px',
              transform: reverse ? 'rotate(-2.5deg)' : 'rotate(2.5deg)',
              boxShadow: '0 40px 80px rgba(0,0,0,0.7)',
              display: 'block',
            }}
            draggable={false}
          />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add responsive rule to `app/globals.css`**

Append at end of file:

```css
/* ─── FEATURE SPLIT ─── */
@media (max-width: 768px) {
  .feature-split-inner {
    flex-direction: column !important;
    gap: 40px !important;
  }
  .feature-split-inner > div:last-child img {
    max-width: 240px !important;
    transform: rotate(0deg) !important;
  }
}
```

- [ ] **Step 3: Replace all FeatureSplit stubs in `app/page.tsx`**

Remove all 4 `function FeatureSplit` and `<FeatureSplit num="0X" />` stub lines. Replace with:

```tsx
import FeatureSplit from '@/components/FeatureSplit';

// Add this features array before the Home() function:
const features = [
  {
    num: '01',
    tag: 'MARKET MAP',
    headline: "See what's moving.\nBefore it's news.",
    body: 'Sector heatmap, top gainers, 52-week highs and lows, live indices — everything happening in the market, the moment it happens.',
    screenshot: '/screenshots/sc-1.png',
    screenshotAlt: 'Market heatmap',
    reverse: false,
  },
  {
    num: '02',
    tag: 'PORTFOLIO',
    headline: "Your money.\nTracked properly.",
    body: 'Portfolio NAV vs Nifty, full P&L breakdown, analytics that explain exactly how your holdings are performing.',
    screenshot: '/screenshots/sc-3.png',
    screenshotAlt: 'Portfolio view',
    reverse: true,
  },
  {
    num: '03',
    tag: 'DISCOVERY',
    headline: "Every sector.\nEvery story.",
    body: 'Sector news, commodity prices, MF overlap, stock correlation — everything you need to understand the bigger picture.',
    screenshot: '/screenshots/sc-2.png',
    screenshotAlt: 'Discovery and sectors',
    reverse: false,
  },
  {
    num: '04',
    tag: 'WATCHLIST',
    headline: "Your watchlist,\nfinally useful.",
    body: 'Live prices, mini-charts, comparison across multiple lists. Know exactly how your picks are doing at a glance.',
    screenshot: '/screenshots/sc-3.png',
    screenshotAlt: 'Watchlist',
    reverse: true,
  },
];
```

Inside `Home()`, replace the 4 FeatureSplit lines with:
```tsx
{features.map((f, idx) => (
  <FeatureSplit key={idx} {...f} />
))}
```

- [ ] **Step 4: Verify in browser**

Check localhost:3000:
- 4 feature sections visible below Pivot
- Sections alternate text-left / text-right
- Screenshots rotated ±2.5°, heavy drop shadow
- Mono tag label above headline
- Collapses to stacked column on narrow viewport

- [ ] **Step 5: Commit**

```bash
cd "/Users/saransh/Dev/Websites/Trade Insights Website"
git add components/FeatureSplit.tsx app/page.tsx app/globals.css
git commit -m "feat: add FeatureSplit component — 4 feature sections with raw screenshots"
```

---

## Task 6: Create ScreenshotMosaic component

**Files:**
- Create: `components/ScreenshotMosaic.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create `components/ScreenshotMosaic.tsx`**

```tsx
const screenshots = [
  { src: '/screenshots/sc-1.png',    alt: 'Market heatmap',    rotate: -3,   zIndex: 3 },
  { src: '/screenshots/sc-2.png',    alt: 'Discovery sectors', rotate: 2,    zIndex: 2 },
  { src: '/screenshots/sc-3.png',    alt: 'Watchlist',         rotate: -1.5, zIndex: 4 },
  { src: '/screenshots/sc-1.png',    alt: 'Sector view',       rotate: 3,    zIndex: 1 },
  { src: '/screenshots/sc-2.png',    alt: 'Stock detail',      rotate: -2,   zIndex: 3 },
  { src: '/screenshots/sc-3.png',    alt: 'Portfolio',         rotate: 1.5,  zIndex: 2 },
];

export default function ScreenshotMosaic() {
  return (
    <section
      style={{
        background: 'var(--bg)',
        borderTop: '1px solid var(--border)',
        overflow: 'hidden',
        padding: 'clamp(60px, 8vh, 100px) 0',
      }}
    >
      <div
        className="no-scrollbar"
        style={{
          display: 'flex',
          gap: '28px',
          padding: '40px clamp(24px, 5vw, 80px)',
          overflowX: 'auto',
          alignItems: 'center',
        }}
      >
        {screenshots.map((s, idx) => (
          <div
            key={idx}
            data-reveal="up"
            data-delay={String(idx * 100)}
            style={{
              flexShrink: 0,
              width: 'clamp(160px, 22vw, 260px)',
              borderRadius: '20px',
              overflow: 'hidden',
              transform: `rotate(${s.rotate}deg)`,
              boxShadow: '0 30px 60px rgba(0,0,0,0.65)',
              position: 'relative',
              zIndex: s.zIndex,
            }}
          >
            <img
              src={s.src}
              alt={s.alt}
              style={{ width: '100%', display: 'block' }}
              draggable={false}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Replace stub in `app/page.tsx`**

Remove `function ScreenshotMosaic()` stub. Add import:
```tsx
import ScreenshotMosaic from '@/components/ScreenshotMosaic';
```

- [ ] **Step 3: Verify in browser**

Check localhost:3000:
- 6 screenshots in a horizontal row, no device frames
- Each slightly rotated, heavy shadow
- Row overflows/scrolls horizontally if viewport too narrow

- [ ] **Step 4: Commit**

```bash
cd "/Users/saransh/Dev/Websites/Trade Insights Website"
git add components/ScreenshotMosaic.tsx app/page.tsx
git commit -m "feat: add ScreenshotMosaic — organic raw screenshot row"
```

---

## Task 7: Create StatsStrip component

**Files:**
- Create: `components/StatsStrip.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create `components/StatsStrip.tsx`**

```tsx
const stats = [
  { label: 'STOCKS TRACKED', value: '500+' },
  { label: 'LIVE DATA',       value: 'NSE & BSE' },
  { label: 'UPDATES',         value: 'Real-time' },
  { label: 'COST',            value: 'Free' },
];

export default function StatsStrip() {
  return (
    <section
      style={{
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-1)',
        padding: 'clamp(32px, 5vh, 56px) 0',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
        }}
      >
        {stats.map((s, idx) => (
          <div
            key={idx}
            data-reveal="up"
            data-delay={String(idx * 100)}
            style={{
              flex: '1 1 200px',
              padding: 'clamp(20px, 3vw, 36px) clamp(24px, 3vw, 48px)',
              borderRight: idx < stats.length - 1 ? '1px solid var(--border)' : 'none',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--mono)',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                color: 'var(--text-4)',
                textTransform: 'uppercase',
                marginBottom: '10px',
              }}
            >
              {s.label}
            </p>
            <p
              style={{
                fontSize: 'clamp(28px, 4vw, 48px)',
                fontWeight: 800,
                color: 'var(--text-1)',
                letterSpacing: '-0.03em',
                lineHeight: 1,
              }}
            >
              {s.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Replace stub in `app/page.tsx`**

Remove `function StatsStrip()` stub. Add import:
```tsx
import StatsStrip from '@/components/StatsStrip';
```

- [ ] **Step 3: Verify in browser**

Check localhost:3000:
- 4 stat cells in a row, separated by vertical borders
- Monospace uppercase label above, large value below
- `bg-1` background differentiates from surrounding sections

- [ ] **Step 4: Commit**

```bash
cd "/Users/saransh/Dev/Websites/Trade Insights Website"
git add components/StatsStrip.tsx app/page.tsx
git commit -m "feat: add StatsStrip — four-stat bar"
```

---

## Task 8: Update Waitlist, Navbar, Footer copy

**Files:**
- Modify: `components/Waitlist.tsx` (headline + subtitle only)
- Modify: `components/Navbar.tsx` (CTA arrow only)
- Modify: `components/Footer.tsx` (tagline only)

- [ ] **Step 1: Update Waitlist headline and subtitle**

In `components/Waitlist.tsx`, find:
```tsx
<h2 className="wl-title">Ziro Market</h2>
<p className="wl-subtitle">
  Join a waitlist of investors who want a smarter way to track the Indian market.
</p>
```

Replace with:
```tsx
<h2 className="wl-title">Stop juggling.<br />Start seeing.</h2>
<p className="wl-subtitle">
  Be the first to know when Ziro launches.
</p>
```

- [ ] **Step 2: Update Footer tagline**

In `components/Footer.tsx`, find:
```tsx
India&apos;s high-density market intelligence terminal. Real signals. Zero noise.
```

Replace with:
```tsx
India&apos;s market, in one place.
```

- [ ] **Step 3: Update Navbar CTA**

In `components/Navbar.tsx`, find:
```tsx
Join Waitlist
```

Replace with:
```tsx
Join the waitlist →
```

- [ ] **Step 4: Verify in browser**

Check:
- Waitlist section shows "Stop juggling. Start seeing." as headline
- Footer shows new tagline
- Navbar CTA reads "Join the waitlist →"

- [ ] **Step 5: Commit**

```bash
cd "/Users/saransh/Dev/Websites/Trade Insights Website"
git add components/Waitlist.tsx components/Navbar.tsx components/Footer.tsx
git commit -m "feat: update copy — waitlist headline, footer tagline, navbar CTA"
```

---

## Task 9: Final page.tsx cleanup

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Write final clean `app/page.tsx`**

Replace entire file:

```tsx
import ScrollProgress from '@/components/ScrollProgress';
import ScrollRevealObserver from '@/components/ScrollRevealObserver';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Marquee from '@/components/Marquee';
import PainSection from '@/components/PainSection';
import Pivot from '@/components/Pivot';
import FeatureSplit from '@/components/FeatureSplit';
import ScreenshotMosaic from '@/components/ScreenshotMosaic';
import StatsStrip from '@/components/StatsStrip';
import Waitlist from '@/components/Waitlist';
import Footer from '@/components/Footer';

const features = [
  {
    num: '01',
    tag: 'MARKET MAP',
    headline: "See what's moving.\nBefore it's news.",
    body: 'Sector heatmap, top gainers, 52-week highs and lows, live indices — everything happening in the market, the moment it happens.',
    screenshot: '/screenshots/sc-1.png',
    screenshotAlt: 'Market heatmap',
    reverse: false,
  },
  {
    num: '02',
    tag: 'PORTFOLIO',
    headline: "Your money.\nTracked properly.",
    body: 'Portfolio NAV vs Nifty, full P&L breakdown, analytics that explain exactly how your holdings are performing.',
    screenshot: '/screenshots/sc-3.png',
    screenshotAlt: 'Portfolio view',
    reverse: true,
  },
  {
    num: '03',
    tag: 'DISCOVERY',
    headline: "Every sector.\nEvery story.",
    body: 'Sector news, commodity prices, MF overlap, stock correlation — everything you need to understand the bigger picture.',
    screenshot: '/screenshots/sc-2.png',
    screenshotAlt: 'Discovery and sectors',
    reverse: false,
  },
  {
    num: '04',
    tag: 'WATCHLIST',
    headline: "Your watchlist,\nfinally useful.",
    body: 'Live prices, mini-charts, comparison across multiple lists. Know exactly how your picks are doing at a glance.',
    screenshot: '/screenshots/sc-3.png',
    screenshotAlt: 'Watchlist',
    reverse: true,
  },
];

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <ScrollRevealObserver />
      <Navbar />
      <Hero />
      <Marquee />
      <PainSection />
      <Pivot />
      {features.map((f, idx) => (
        <FeatureSplit key={idx} {...f} />
      ))}
      <ScreenshotMosaic />
      <StatsStrip />
      <Waitlist />
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Run TypeScript check**

```bash
cd "/Users/saransh/Dev/Websites/Trade Insights Website" && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Final visual walkthrough in browser**

Scroll entire page top to bottom and check:
1. Navbar: ZIRO logo + "Join the waitlist →" CTA — frosted bg appears on scroll
2. Hero: giant 4-line headline, green sub-line, two CTAs
3. Marquee: ticker strip scrolling
4. PainSection: 7-row chaos list, fading opacity
5. Pivot: "What if one app..." centred + ZIRO wordmark
6. Feature 1: text left / screenshot right, rotated
7. Feature 2: screenshot left / text right, rotated other way
8. Feature 3: text left / screenshot right
9. Feature 4: screenshot left / text right
10. Mosaic: horizontal row of 6 screenshots, all rotated
11. StatsStrip: 4 cells with `bg-1` background
12. Waitlist: "Stop juggling. Start seeing." headline + form
13. Footer: new tagline, social links, disclaimer

- [ ] **Step 4: Final commit**

```bash
cd "/Users/saransh/Dev/Websites/Trade Insights Website"
git add app/page.tsx
git commit -m "feat: complete website redesign — narrative B implementation"
```

---

## Self-Review

**Spec coverage:**
- S1 Navbar ✓ Task 8
- S2 Hero ✓ Task 2
- S3 PainSection ✓ Task 3
- S4 Pivot ✓ Task 4
- S5–S8 FeatureSplit × 4 ✓ Task 5
- S9 Mosaic ✓ Task 6
- S10 StatsStrip ✓ Task 7
- S11 Waitlist copy ✓ Task 8
- S12 Footer copy ✓ Task 8
- Delete old components ✓ Task 1
- Responsive CSS ✓ Task 5

**Placeholder scan:** None found.

**Type consistency:** `FeatureSplitProps` defined in Task 5 Step 1, used in same file — no cross-task type drift.
