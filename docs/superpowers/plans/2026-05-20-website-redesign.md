# Ziro Market — Website Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the marketing site with a dark Swiss-brutalist design that matches the Flutter app palette, uses bold typography + abstract data viz instead of screenshots, and is architected so flipping from waitlist mode to launched mode requires only an env var change.

**Architecture:** Next.js 16 App Router + React 19 + TypeScript + Tailwind 4. Component tree organised by section (`layout/`, `hero/`, `pain/`, `features/`, `waitlist/`...). Pure SVG/CSS visualisations — no canvas except optional waitlist background. Single `lib/launchMode.ts` gates waitlist-vs-launch UI. Live indices fetched client-side every 15s with SSR static fallback.

**Tech Stack:** Next.js 16.2, React 19, TypeScript 5, Tailwind 4, framer-motion (existing), Vitest + React Testing Library (new), Playwright (new), axe-playwright (new), JetBrains Mono + Inter via `next/font`.

**Reference spec:** [`docs/superpowers/specs/2026-05-20-website-redesign-design.md`](../specs/2026-05-20-website-redesign-design.md)

**Important codebase notes:**
- `app/layout.tsx` already wires Inter + JetBrains Mono — keep and reuse.
- `next.config.ts` currently rewrites all `/api/*` to the remote backend. This must be scoped to **only** the existing remote endpoints (e.g. `/api/waitlist`) so the new local `/api/indices` route resolves locally.
- The repo uses Next 16 — read `node_modules/next/dist/docs/` before assuming any deprecated API works.

---

## Task 0: Tooling setup

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Create: `playwright.config.ts`

- [ ] **Step 0.1: Install test dependencies**

Run:
```bash
npm i -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @playwright/test axe-playwright
npx playwright install --with-deps chromium
```
Expected: installs succeed, `node_modules/.bin/vitest` and `node_modules/.bin/playwright` exist.

- [ ] **Step 0.2: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    include: ['**/*.test.{ts,tsx}'],
    exclude: ['node_modules', '.next', 'tests/e2e/**'],
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './') },
  },
});
```

- [ ] **Step 0.3: Create `vitest.setup.ts`**

```ts
import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => cleanup());
```

- [ ] **Step 0.4: Create `playwright.config.ts`**

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'list',
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  use: { baseURL: 'http://localhost:3000', trace: 'on-first-retry' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'tablet',  use: { ...devices['Desktop Chrome'], viewport: { width: 1024, height: 768 } } },
    { name: 'mobile',  use: { ...devices['iPhone 13'] } },
  ],
});
```

- [ ] **Step 0.5: Add scripts to `package.json`**

Add to `"scripts"`:
```json
"test": "vitest run",
"test:watch": "vitest",
"e2e": "playwright test",
"typecheck": "tsc --noEmit"
```

- [ ] **Step 0.6: Sanity-run test runner**

Run: `npm test`
Expected: `No test files found` (exit 0). Confirms config is valid.

- [ ] **Step 0.7: Commit**

```bash
git add package.json package-lock.json vitest.config.ts vitest.setup.ts playwright.config.ts
git commit -m "chore: add Vitest + Playwright test infrastructure"
```

---

## Task 1: Rewrite `globals.css` design tokens

**Files:**
- Modify: `app/globals.css` (full replacement)

- [ ] **Step 1.1: Replace `app/globals.css` with the new design system**

```css
/* ============================================================
   ZIRO MARKET — DARK SWISS BRUTALIST
   App-palette-matched · amber accent · hairline grid
   ============================================================ */

/* ─── TOKENS ─── */
:root {
  --bg-0: #000000;
  --bg-1: #0A0A0A;
  --bg-2: #111111;
  --bg-3: #171717;

  --border-1: #1F1F1F;
  --border-2: #2A2A2A;

  --text-1: #EDEDED;
  --text-2: #C0C0C0;
  --text-3: #6B6B6B;
  --text-4: #3A3A3A;

  --amber: #F59E0B;
  --amber-dim: rgba(245, 158, 11, 0.10);
  --gold: #D97706;

  --positive: #22C55E;
  --positive-dim: rgba(34, 197, 94, 0.10);
  --negative: #EF4444;
  --negative-dim: rgba(239, 68, 68, 0.10);

  --sans: var(--font-inter), -apple-system, system-ui, sans-serif;
  --mono: var(--font-jetbrains-mono), ui-monospace, 'Courier New', monospace;

  --r-sm: 4px;
  --r:    8px;
  --r-lg: 12px;

  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);

  --container: 1340px;
  --gutter: 28px;
}

/* ─── RESET ─── */
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }
body {
  font-family: var(--sans);
  background: var(--bg-0);
  color: var(--text-1);
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-feature-settings: 'ss01', 'cv11';
}
a { text-decoration: none; color: inherit; }
button, input, textarea, select { font-family: inherit; font-size: inherit; color: inherit; }
img, svg { display: block; max-width: 100%; }

/* ─── CONTAINER ─── */
.container { max-width: var(--container); margin: 0 auto; padding: 0 var(--gutter); }

/* ─── TYPE ─── */
.display {
  font-family: var(--sans);
  font-weight: 900;
  font-size: clamp(3rem, 7vw, 5.8rem);
  line-height: 0.92;
  letter-spacing: -0.055em;
}
.display em { font-style: italic; font-weight: 600; }
.display .amber { color: var(--amber); }

h2 { font-size: clamp(2rem, 4vw, 3.4rem); font-weight: 900; letter-spacing: -0.045em; line-height: 0.96; }
h3 { font-size: 1.15rem; font-weight: 700; letter-spacing: -0.01em; }

p  { color: var(--text-2); line-height: 1.55; font-size: 0.95rem; }

.mono { font-family: var(--mono); }
.kicker {
  font-family: var(--mono);
  font-size: 0.68rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--text-3);
  font-weight: 600;
}
.caption {
  font-family: var(--mono);
  font-size: 0.62rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-3);
}
.up   { color: var(--positive); }
.down { color: var(--negative); }
.amber { color: var(--amber); }

/* ─── BUTTONS ─── */
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  padding: 13px 22px;
  border-radius: var(--r-sm);
  font-size: 0.88rem; font-weight: 700; letter-spacing: 0.01em;
  border: 1px solid transparent; cursor: pointer;
  transition: transform 0.15s var(--ease-out), background 0.15s, color 0.15s, border-color 0.15s;
  white-space: nowrap;
}
.btn:focus-visible { outline: 2px solid var(--amber); outline-offset: 3px; }
.btn-amber  { background: var(--amber); color: #000; }
.btn-amber:hover  { background: var(--gold); transform: translateY(-1px); }
.btn-ghost  { background: transparent; color: var(--text-1); border-color: var(--border-2); }
.btn-ghost:hover  { border-color: var(--text-3); }
.btn-sm { padding: 8px 14px; font-size: 0.78rem; }
.btn-lg { padding: 16px 28px; font-size: 0.95rem; }

/* ─── HAIRLINES ─── */
.hr-1 { width: 100%; height: 1px; background: var(--border-1); }
.hr-2 { width: 100%; height: 1px; background: var(--border-2); }

/* ─── SECTION ─── */
.section { padding: 120px 0; position: relative; }
.section + .section { border-top: 1px solid var(--border-1); }
.section-sm { padding: 64px 0; }

/* ─── CROSSHAIRS ─── */
.crosshair { position: relative; }
.crosshair::before, .crosshair::after { content: ''; position: absolute; width: 16px; height: 16px; pointer-events: none; }
.crosshair::before { top: 20px; right: 28px; border-top: 1.5px solid var(--border-2); border-right: 1.5px solid var(--border-2); }
.crosshair::after  { bottom: 20px; left: 28px;  border-bottom: 1.5px solid var(--border-2); border-left: 1.5px solid var(--border-2); }

/* ─── SECTION NUMBER LABEL ─── */
.section-num {
  display: inline-flex; align-items: center; gap: 10px;
  font-family: var(--mono); font-size: 0.7rem; letter-spacing: 0.18em;
  text-transform: uppercase; color: var(--text-3); font-weight: 600;
}

/* ─── LIVE DOT ─── */
.live-dot {
  display: inline-block; width: 6px; height: 6px; border-radius: 50%;
  background: var(--positive); animation: pulse 2s ease infinite;
}
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }

/* ─── SCROLL REVEAL ─── */
[data-reveal] { opacity: 0; transform: translateY(40px); transition: opacity 0.6s var(--ease-out), transform 0.6s var(--ease-out); }
[data-reveal].in { opacity: 1; transform: none; }

/* ─── REDUCED MOTION ─── */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; }
  [data-reveal] { opacity: 1; transform: none; }
}

/* ─── UTIL ─── */
.sr-only {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0;
}
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.no-scrollbar::-webkit-scrollbar { display: none; }

/* ─── RESPONSIVE ─── */
@media (max-width: 768px) {
  .container { padding: 0 20px; }
  .section { padding: 72px 0; }
  .crosshair::before, .crosshair::after { display: none; }
}
```

- [ ] **Step 1.2: Verify dev server still boots**

Run: `npm run dev` (background) then `curl -sI http://localhost:3000 | head -1`. Expected: `HTTP/1.1 200 OK`. Stop the dev server.

- [ ] **Step 1.3: Commit**

```bash
git add app/globals.css
git commit -m "feat: rewrite globals.css with dark Swiss-brutalist tokens"
```

---

## Task 2: Adjust `app/layout.tsx` metadata + body

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 2.1: Update metadata + viewport theme**

Replace the existing `title`, `description`, and `viewport.themeColor`:

```ts
export const metadata: Metadata = {
  metadataBase: new URL("https://ziromarket.com"),
  alternates: { canonical: "/" },
  title: "Ziro Market — Indian markets, without the noise.",
  description: "Live heatmaps, portfolio analytics, sector intelligence and watchlists — built for India, in one app that loads in under a second.",
  keywords: ["Indian Stock Market", "NIFTY 50", "SENSEX", "NSE", "BSE", "MCX", "Sector Heatmap", "Portfolio Tracker", "Ziro Market"],
  authors: [{ name: "Ziro Market Team" }],
  creator: "Ziro Market",
  publisher: "Ziro Market",
  applicationName: "Ziro Market",
  formatDetection: { email: false, address: false, telephone: false },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon/apple-touch-icon.png',
  },
  openGraph: {
    title: "Ziro Market — Indian markets, without the noise.",
    description: "Live heatmaps, portfolio analytics, watchlists — built for India.",
    url: "https://ziromarket.com",
    siteName: "Ziro Market",
    images: [{ url: "/app_icon/ziro.png", width: 1024, height: 1024, alt: "Ziro Market" }],
    type: "website",
    locale: 'en_IN',
  },
  twitter: {
    card: "summary_large_image",
    title: "Ziro Market — Indian markets, without the noise.",
    description: "Built for India. No autoplay ads, no buried buttons, no USD defaults.",
    images: ["/app_icon/ziro.png"],
    creator: "@ziromarket",
  },
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Ziro Market" },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#000000",
};
```

- [ ] **Step 2.2: Strip inline body style (no longer needed)**

Replace the body element:

```tsx
<body>
  {children}
  <Analytics />
</body>
```

- [ ] **Step 2.3: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: refresh root metadata + theme-color"
```

---

## Task 3: `lib/launchMode.ts` — TDD

**Files:**
- Create: `lib/launchMode.ts`
- Test: `lib/launchMode.test.ts`

- [ ] **Step 3.1: Write failing test**

Create `lib/launchMode.test.ts`:
```ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getLaunchMode, isLaunched, isWaitlist } from './launchMode';

const original = process.env.NEXT_PUBLIC_LAUNCH_MODE;
beforeEach(() => { delete process.env.NEXT_PUBLIC_LAUNCH_MODE; });
afterEach(() => { process.env.NEXT_PUBLIC_LAUNCH_MODE = original; });

describe('launchMode', () => {
  it('defaults to waitlist when env not set', () => {
    expect(getLaunchMode()).toBe('waitlist');
    expect(isWaitlist()).toBe(true);
    expect(isLaunched()).toBe(false);
  });
  it('returns launched when env is "launched"', () => {
    process.env.NEXT_PUBLIC_LAUNCH_MODE = 'launched';
    expect(getLaunchMode()).toBe('launched');
    expect(isLaunched()).toBe(true);
    expect(isWaitlist()).toBe(false);
  });
  it('falls back to waitlist on unknown values', () => {
    process.env.NEXT_PUBLIC_LAUNCH_MODE = 'banana';
    expect(getLaunchMode()).toBe('waitlist');
  });
});
```

- [ ] **Step 3.2: Run test, verify FAIL**

Run: `npm test -- lib/launchMode.test.ts`
Expected: FAIL — module does not exist.

- [ ] **Step 3.3: Implement**

Create `lib/launchMode.ts`:
```ts
export type LaunchMode = 'waitlist' | 'launched';

export function getLaunchMode(): LaunchMode {
  return process.env.NEXT_PUBLIC_LAUNCH_MODE === 'launched' ? 'launched' : 'waitlist';
}
export const isLaunched = (): boolean => getLaunchMode() === 'launched';
export const isWaitlist = (): boolean => getLaunchMode() === 'waitlist';
```

- [ ] **Step 3.4: Run test, verify PASS**

Run: `npm test -- lib/launchMode.test.ts`
Expected: PASS, 3 tests.

- [ ] **Step 3.5: Commit**

```bash
git add lib/launchMode.ts lib/launchMode.test.ts
git commit -m "feat(lib): add launchMode flag (waitlist|launched)"
```

---

## Task 4: `lib/marketData.ts` — static seed snapshot

**Files:**
- Create: `lib/marketData.ts`

- [ ] **Step 4.1: Implement seed data + types**

```ts
export interface IndexQuote {
  symbol: string;
  name: string;
  value: number;
  change: number;
  changePct: number;
  asOf: string; // ISO timestamp
}

export interface TickerQuote {
  symbol: string;
  changePct: number;
}

export const STATIC_INDICES: IndexQuote[] = [
  { symbol: 'NIFTY50',  name: 'NIFTY 50',    value: 22847.30, change:  141.20, changePct:  0.62, asOf: '2026-05-20T09:30:00+05:30' },
  { symbol: 'BANKNIFTY',name: 'BANK NIFTY',  value: 48920.15, change:  201.40, changePct:  0.41, asOf: '2026-05-20T09:30:00+05:30' },
  { symbol: 'SENSEX',   name: 'SENSEX',      value: 75103.42, change:  -58.30, changePct: -0.08, asOf: '2026-05-20T09:30:00+05:30' },
  { symbol: 'INDIAVIX', name: 'INDIA VIX',   value:    13.82, change:   -0.24, changePct: -1.71, asOf: '2026-05-20T09:30:00+05:30' },
];

export const STATIC_TICKERS: TickerQuote[] = [
  { symbol: 'RELIANCE', changePct:  2.4 },
  { symbol: 'INFY',     changePct: -0.8 },
  { symbol: 'HDFCBANK', changePct:  1.2 },
  { symbol: 'TCS',      changePct:  3.1 },
  { symbol: 'BAJFINANCE',changePct: 4.7 },
  { symbol: 'ICICIBANK',changePct:  0.6 },
  { symbol: 'SBIN',     changePct:  3.1 },
  { symbol: 'WIPRO',    changePct: -1.1 },
  { symbol: 'ITC',      changePct:  0.5 },
  { symbol: 'ADANIENT', changePct:  1.8 },
  { symbol: 'MARUTI',   changePct: -0.4 },
  { symbol: 'TATAMOTORS',changePct: 2.0 },
  { symbol: 'LT',       changePct:  0.9 },
  { symbol: 'KOTAKBANK',changePct: -0.6 },
  { symbol: 'AXISBANK', changePct:  1.5 },
  { symbol: 'HINDUNILVR',changePct:-0.3 },
];

export function isMarketOpen(now: Date = new Date()): boolean {
  const ist = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  const day = ist.getDay(); // 0 Sun, 6 Sat
  if (day === 0 || day === 6) return false;
  const minutes = ist.getHours() * 60 + ist.getMinutes();
  return minutes >= 9 * 60 + 15 && minutes <= 15 * 60 + 30;
}

export function formatINR(n: number): string {
  return n.toLocaleString('en-IN', { maximumFractionDigits: 2 });
}
```

- [ ] **Step 4.2: Quick unit test**

Create `lib/marketData.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { STATIC_INDICES, isMarketOpen, formatINR } from './marketData';

describe('marketData', () => {
  it('has 4 indices', () => expect(STATIC_INDICES).toHaveLength(4));
  it('formats Indian numbering', () => expect(formatINR(123456)).toMatch(/1,23,456/));
  it('closed on Sunday', () => expect(isMarketOpen(new Date('2026-05-17T10:00:00+05:30'))).toBe(false));
  it('open Wednesday 10:00 IST', () => expect(isMarketOpen(new Date('2026-05-20T10:00:00+05:30'))).toBe(true));
  it('closed Wednesday 16:00 IST', () => expect(isMarketOpen(new Date('2026-05-20T16:00:00+05:30'))).toBe(false));
});
```

- [ ] **Step 4.3: Run + verify PASS**

Run: `npm test -- lib/marketData.test.ts`
Expected: PASS, 5 tests.

- [ ] **Step 4.4: Commit**

```bash
git add lib/marketData.ts lib/marketData.test.ts
git commit -m "feat(lib): add marketData seeds + helpers"
```

---

## Task 5: `hooks/useReveal.ts`

**Files:**
- Create: `hooks/useReveal.ts`

- [ ] **Step 5.1: Implement**

```ts
'use client';
import { useEffect, useRef } from 'react';

export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('in');
      return;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { el.classList.add('in'); io.unobserve(el); } }),
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}
```

- [ ] **Step 5.2: Commit**

```bash
git add hooks/useReveal.ts
git commit -m "feat(hooks): add useReveal scroll-reveal hook"
```

---

## Task 6: `hooks/useLiveIndices.ts` — TDD

**Files:**
- Create: `hooks/useLiveIndices.ts`
- Test: `hooks/useLiveIndices.test.tsx`

- [ ] **Step 6.1: Write failing test**

```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useLiveIndices } from './useLiveIndices';
import { STATIC_INDICES } from '@/lib/marketData';

const fetchMock = vi.fn();
beforeEach(() => {
  vi.useFakeTimers();
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
});

describe('useLiveIndices', () => {
  it('returns seed snapshot on first render', () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => STATIC_INDICES });
    const { result } = renderHook(() => useLiveIndices(STATIC_INDICES));
    expect(result.current.data).toEqual(STATIC_INDICES);
    expect(result.current.stale).toBe(false);
  });

  it('keeps stale snapshot if fetch fails', async () => {
    fetchMock.mockRejectedValue(new Error('net'));
    const { result } = renderHook(() => useLiveIndices(STATIC_INDICES));
    await vi.advanceTimersByTimeAsync(20_000);
    await waitFor(() => expect(result.current.data).toEqual(STATIC_INDICES));
  });
});
```

- [ ] **Step 6.2: Run test, verify FAIL**

Run: `npm test -- hooks/useLiveIndices.test.tsx`
Expected: FAIL — module missing.

- [ ] **Step 6.3: Implement**

```ts
'use client';
import { useEffect, useState } from 'react';
import type { IndexQuote } from '@/lib/marketData';

export interface LiveIndicesState {
  data: IndexQuote[];
  stale: boolean;
  lastFetchedAt: number | null;
}

export function useLiveIndices(initial: IndexQuote[], intervalMs = 15_000): LiveIndicesState {
  const [data, setData] = useState<IndexQuote[]>(initial);
  const [lastFetchedAt, setLastFetchedAt] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function tick() {
      try {
        const res = await fetch('/api/indices');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as IndexQuote[];
        if (!cancelled && Array.isArray(json) && json.length > 0) {
          setData(json);
          setLastFetchedAt(Date.now());
        }
      } catch {
        /* keep last good snapshot */
      }
    }
    tick();
    const id = setInterval(tick, intervalMs);
    return () => { cancelled = true; clearInterval(id); };
  }, [intervalMs]);

  const stale = lastFetchedAt !== null && Date.now() - lastFetchedAt > 60_000;
  return { data, stale, lastFetchedAt };
}
```

- [ ] **Step 6.4: Run test, verify PASS**

Run: `npm test -- hooks/useLiveIndices.test.tsx`
Expected: PASS, 2 tests.

- [ ] **Step 6.5: Commit**

```bash
git add hooks/useLiveIndices.ts hooks/useLiveIndices.test.tsx
git commit -m "feat(hooks): add useLiveIndices with stale fallback"
```

---

## Task 7: `components/layout/ScrollReveal.tsx`

**Files:**
- Create: `components/layout/ScrollReveal.tsx`

- [ ] **Step 7.1: Implement**

```tsx
'use client';
import { useReveal } from '@/hooks/useReveal';
import type { ReactNode } from 'react';

export default function ScrollReveal({ children, as = 'div', className = '', delayMs = 0 }: {
  children: ReactNode;
  as?: 'div' | 'section' | 'article';
  className?: string;
  delayMs?: number;
}) {
  const ref = useReveal<HTMLDivElement>();
  const Tag = as as 'div';
  return (
    <Tag
      ref={ref}
      data-reveal
      className={className}
      style={delayMs ? { transitionDelay: `${delayMs}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
```

- [ ] **Step 7.2: Commit**

```bash
git add components/layout/ScrollReveal.tsx
git commit -m "feat(layout): add ScrollReveal wrapper"
```

---

## Task 8: `components/layout/Nav.tsx`

**Files:**
- Create: `components/layout/Nav.tsx`
- Test: `components/layout/Nav.test.tsx`

- [ ] **Step 8.1: Write failing test**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import Nav from './Nav';

const orig = process.env.NEXT_PUBLIC_LAUNCH_MODE;
beforeEach(() => { delete process.env.NEXT_PUBLIC_LAUNCH_MODE; });
afterEach(() => { process.env.NEXT_PUBLIC_LAUNCH_MODE = orig; });

describe('Nav', () => {
  it('shows "Get Early Access" in waitlist mode', () => {
    render(<Nav />);
    expect(screen.getByRole('link', { name: /get early access/i })).toBeInTheDocument();
  });
  it('shows "Download" in launched mode', () => {
    process.env.NEXT_PUBLIC_LAUNCH_MODE = 'launched';
    render(<Nav />);
    expect(screen.getByRole('link', { name: /download/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 8.2: Run, verify FAIL**

Run: `npm test -- components/layout/Nav.test.tsx`. Expected: module missing.

- [ ] **Step 8.3: Implement**

```tsx
'use client';
import { useEffect, useState } from 'react';
import { isLaunched } from '@/lib/launchMode';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const launched = isLaunched();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className="nav"
      style={{
        position: 'sticky', top: 0, zIndex: 500,
        height: 60, display: 'flex', alignItems: 'center',
        background: scrolled ? 'rgba(10,10,10,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border-1)' : '1px solid transparent',
        transition: 'background 0.25s ease, border-color 0.25s ease',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="#top" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span aria-hidden style={{
            width: 22, height: 22, background: 'var(--text-1)', color: '#000',
            display: 'grid', placeItems: 'center', borderRadius: 3,
            fontFamily: 'var(--mono)', fontSize: '0.7rem', fontWeight: 900,
          }}>Z</span>
          <span style={{ fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            ZIRO MARKET
          </span>
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <a href="#features" className="caption" style={{ display: 'none' }} data-show-md>App</a>
          <a href="#pain" className="caption" style={{ display: 'none' }} data-show-md>Why</a>
          <a href="#pivot" className="caption" style={{ display: 'none' }} data-show-md>Manifesto</a>
          <a
            href={launched ? '#download' : '#waitlist'}
            className="btn btn-amber btn-sm"
            aria-label={launched ? 'Download Ziro Market' : 'Get early access to Ziro Market'}
          >
            {launched ? 'Download →' : 'Get Early Access →'}
          </a>
        </div>
      </div>
      <style jsx>{`
        @media (min-width: 768px) { [data-show-md] { display: inline-block !important; } }
      `}</style>
    </nav>
  );
}
```

- [ ] **Step 8.4: Run, verify PASS**

Run: `npm test -- components/layout/Nav.test.tsx`. Expected: PASS.

- [ ] **Step 8.5: Commit**

```bash
git add components/layout/Nav.tsx components/layout/Nav.test.tsx
git commit -m "feat(layout): add Nav with launch-mode branching"
```

---

## Task 9: `components/layout/Footer.tsx`

**Files:**
- Create: `components/layout/Footer.tsx`

- [ ] **Step 9.1: Implement**

```tsx
export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer style={{ background: 'var(--bg-1)', borderTop: '1px solid var(--border-1)', padding: '72px 0 36px' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 56 }}>
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              ZIRO MARKET
            </div>
            <p style={{ marginTop: 14, color: 'var(--text-3)', fontSize: '0.85rem', maxWidth: 320 }}>
              Indian markets, without the noise. Built in India for Indian markets.
            </p>
          </div>
          <FooterCol title="Product" links={[
            { label: 'Why', href: '#pain' },
            { label: 'App', href: '#features' },
            { label: 'Waitlist', href: '#waitlist' },
          ]} />
          <FooterCol title="Company" links={[
            { label: 'Manifesto', href: '#pivot' },
            { label: 'Contact',   href: 'mailto:hello@ziromarket.com' },
          ]} />
          <FooterCol title="Legal" links={[
            { label: 'Privacy', href: '/privacy' },
            { label: 'Terms',   href: '/terms' },
          ]} />
        </div>

        <div style={{ height: 1, background: 'var(--border-1)', margin: '56px 0 24px' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
          <p className="caption" style={{ maxWidth: 600 }}>
            Ziro Market is not a SEBI registered advisor. Markets are subject to risk; data shown is for informational purposes only.
          </p>
          <span className="caption">© {year} Ziro Market · made in India</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h4 className="caption" style={{ marginBottom: 16, color: 'var(--text-4)' }}>{title}</h4>
      {links.map((l) => (
        <a key={l.href} href={l.href}
           style={{ display: 'block', fontSize: '0.88rem', color: 'var(--text-3)', padding: '5px 0' }}>
          {l.label}
        </a>
      ))}
    </div>
  );
}
```

- [ ] **Step 9.2: Commit**

```bash
git add components/layout/Footer.tsx
git commit -m "feat(layout): add Footer"
```

---

## Task 10: `components/hero/Marquee.tsx`

**Files:**
- Create: `components/hero/Marquee.tsx`

- [ ] **Step 10.1: Implement**

```tsx
import { STATIC_TICKERS } from '@/lib/marketData';

export default function Marquee() {
  const items = [...STATIC_TICKERS, ...STATIC_TICKERS]; // duplicate for seamless loop
  return (
    <div
      aria-hidden
      style={{
        overflow: 'hidden',
        borderTop: '1px solid var(--border-1)',
        borderBottom: '1px solid var(--border-1)',
        background: 'var(--bg-1)',
        position: 'relative',
        padding: '14px 0',
      }}
    >
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 120, zIndex: 2,
        background: 'linear-gradient(90deg, var(--bg-1), transparent)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', right: 0, top: 0, bottom: 0, width: 120, zIndex: 2,
        background: 'linear-gradient(-90deg, var(--bg-1), transparent)', pointerEvents: 'none',
      }} />
      <div className="track">
        {items.map((t, i) => (
          <span key={i} className="mq-item">
            <span style={{ color: 'var(--text-1)', fontWeight: 700 }}>{t.symbol}</span>
            <span className={t.changePct >= 0 ? 'up' : 'down'}>
              {t.changePct >= 0 ? '▲' : '▼'} {Math.abs(t.changePct).toFixed(2)}%
            </span>
          </span>
        ))}
      </div>
      <style jsx>{`
        .track {
          display: flex; white-space: nowrap;
          animation: run 60s linear infinite;
          will-change: transform;
        }
        .mq-item {
          display: inline-flex; align-items: center; gap: 10px;
          font-family: var(--mono);
          font-size: 0.7rem; color: var(--text-3); flex-shrink: 0;
          padding: 0 24px; border-right: 1px solid var(--border-1);
        }
        @keyframes run { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @media (prefers-reduced-motion: reduce) { .track { animation: none; } }
      `}</style>
    </div>
  );
}
```

- [ ] **Step 10.2: Commit**

```bash
git add components/hero/Marquee.tsx
git commit -m "feat(hero): add Marquee ticker strip"
```

---

## Task 11: `components/hero/LiveIndices.tsx`

**Files:**
- Create: `components/hero/LiveIndices.tsx`

- [ ] **Step 11.1: Implement**

```tsx
'use client';
import { STATIC_INDICES, formatINR, isMarketOpen } from '@/lib/marketData';
import { useLiveIndices } from '@/hooks/useLiveIndices';

export default function LiveIndices() {
  const { data, stale } = useLiveIndices(STATIC_INDICES);
  const open = isMarketOpen();
  return (
    <div
      aria-live="polite"
      style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        borderTop: '1px solid var(--border-1)', background: 'var(--bg-1)',
      }}
    >
      {data.map((idx, i) => (
        <div key={idx.symbol} style={{
          padding: '18px 22px',
          borderRight: i < data.length - 1 ? '1px solid var(--border-1)' : 'none',
          display: 'flex', flexDirection: 'column', gap: 4,
        }}>
          <div className="caption">{idx.name}</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '-0.01em' }}>
            {formatINR(idx.value)}
          </div>
          <div className={`mono ${idx.changePct >= 0 ? 'up' : 'down'}`} style={{ fontSize: '0.72rem', fontWeight: 700 }}>
            {idx.changePct >= 0 ? '▲' : '▼'} {Math.abs(idx.change).toFixed(2)} · {idx.changePct >= 0 ? '+' : ''}{idx.changePct.toFixed(2)}%
          </div>
        </div>
      ))}
      <div className="caption" style={{
        gridColumn: '1 / -1', padding: '8px 22px', borderTop: '1px solid var(--border-1)',
        display: 'flex', justifyContent: 'space-between',
      }}>
        <span>{open ? <><span className="live-dot" /> &nbsp;LIVE · NSE · BSE</> : 'MARKET CLOSED · Last close'}</span>
        <span>{stale ? 'STALE · last update saved' : 'Updated 09:30 IST'}</span>
      </div>
    </div>
  );
}
```

- [ ] **Step 11.2: Commit**

```bash
git add components/hero/LiveIndices.tsx
git commit -m "feat(hero): add LiveIndices strip"
```

---

## Task 12: `components/hero/Hero.tsx`

**Files:**
- Create: `components/hero/Hero.tsx`

- [ ] **Step 12.1: Implement**

```tsx
import { isLaunched } from '@/lib/launchMode';
import LiveIndices from './LiveIndices';

export default function Hero() {
  const launched = isLaunched();
  return (
    <section id="top" className="crosshair" style={{ paddingTop: 72, paddingBottom: 0, borderBottom: '1px solid var(--border-1)' }}>
      <div className="container" style={{ paddingBottom: 56 }}>
        <div className="section-num">
          <span className="live-dot" aria-hidden /> LIVE · NSE · BSE · MCX · {launched ? '50,000+ users' : '2,847 on waitlist'}
        </div>

        <h1 className="display" style={{ marginTop: 28 }}>
          Indian markets,<br />
          <em>without the</em> <span className="amber">noise.</span>
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 40, alignItems: 'end', borderTop: '1px solid var(--border-1)', paddingTop: 28, marginTop: 28 }}>
          <p style={{ maxWidth: 520 }}>
            Heatmaps, live indices, portfolio analytics and sector intelligence — built for India, in one app that loads in under a second. No autoplay ads. No buried buttons. No USD defaults.
          </p>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '2.6rem', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1 }}>&lt; 1s</div>
            <div className="caption" style={{ marginTop: 6 }}>Cold-start to live data</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 14, marginTop: 32, alignItems: 'center', flexWrap: 'wrap' }}>
          <a href={launched ? '#download' : '#waitlist'} className="btn btn-amber btn-lg">
            {launched ? 'Download Ziro Market →' : 'Join the waitlist →'}
          </a>
          <a href="#pivot" className="btn btn-ghost">Read the manifesto</a>
          <span className="caption">No spam · iOS &amp; Android · India-first</span>
        </div>
      </div>

      <LiveIndices />
    </section>
  );
}
```

- [ ] **Step 12.2: Commit**

```bash
git add components/hero/Hero.tsx
git commit -m "feat(hero): add Hero section"
```

---

## Task 13: `components/pain/PainCard.tsx`

**Files:**
- Create: `components/pain/PainCard.tsx`

- [ ] **Step 13.1: Implement**

```tsx
export interface Pain {
  app: string;
  ratingLabel: string;
  ratingColor: string;
  headlineTop: string;
  headlineHighlight: string;
  stat: { value: string; unit: string };
  bullets: string[];
  fauxFrame: 'nse' | 'mc' | 'gfin';
}

export default function PainCard({ pain }: { pain: Pain }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, padding: '40px 0' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="kicker">{pain.app}</span>
          <span className="caption" style={{ color: pain.ratingColor, border: `1px solid ${pain.ratingColor}`, padding: '3px 8px', borderRadius: 3 }}>
            {pain.ratingLabel}
          </span>
        </div>
        <h2 style={{ marginTop: 18 }}>
          {pain.headlineTop}<br />
          <span style={{ color: 'var(--gold)' }}>{pain.headlineHighlight}</span>
        </h2>
        <div style={{ marginTop: 22, display: 'flex', alignItems: 'baseline', gap: 14 }}>
          <span style={{ fontSize: '3.4rem', fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--gold)' }}>
            {pain.stat.value}
          </span>
          <span className="caption">{pain.stat.unit}</span>
        </div>
        <ul style={{ marginTop: 24, listStyle: 'none', padding: 0 }}>
          {pain.bullets.map((b, i) => (
            <li key={i} style={{ padding: '10px 0', borderTop: '1px solid var(--border-1)', color: 'var(--text-2)', fontSize: '0.95rem' }}>
              <span className="caption" style={{ marginRight: 12 }}>0{i + 1}</span>{b}
            </li>
          ))}
        </ul>
      </div>
      <FauxBrowser kind={pain.fauxFrame} />
    </div>
  );
}

function FauxBrowser({ kind }: { kind: 'nse' | 'mc' | 'gfin' }) {
  return (
    <div style={{
      background: 'var(--bg-2)', border: '1px solid var(--border-1)', borderRadius: 8, overflow: 'hidden',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 14px', borderBottom: '1px solid var(--border-1)', background: 'var(--bg-1)' }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--text-4)' }} />
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--text-4)' }} />
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--text-4)' }} />
        <span className="caption" style={{ marginLeft: 12 }}>
          {kind === 'nse' && 'nseindia.com / market-data'}
          {kind === 'mc'  && 'moneycontrol.com'}
          {kind === 'gfin'&& 'google.com/finance'}
        </span>
      </div>
      <div style={{ padding: 16 }}>
        {kind === 'nse' && <NseMock />}
        {kind === 'mc'  && <McMock />}
        {kind === 'gfin'&& <GfinMock />}
      </div>
    </div>
  );
}

function Skeleton({ w = '100%', h = 12 }: { w?: string | number; h?: number }) {
  return <div style={{ width: w, height: h, background: 'var(--border-1)', borderRadius: 2 }} />;
}

function NseMock() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Skeleton w="40%" h={14} />
      <Skeleton w="70%" h={10} />
      <Skeleton w="55%" h={10} />
      <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
        {Array.from({ length: 9 }).map((_, i) => <Skeleton key={i} h={18} />)}
      </div>
      <div style={{ marginTop: 20, color: 'var(--text-4)', fontFamily: 'var(--mono)', fontSize: '0.65rem' }}>
        ⌛ loading market-data… (5.2s)
      </div>
    </div>
  );
}

function McMock() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Skeleton w="50%" h={14} />
      <div style={{ background: 'var(--bg-3)', border: '1px dashed var(--border-2)', padding: 10, textAlign: 'center', fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--text-3)' }}>AD · 728×90</div>
      <Skeleton w="80%" h={10} />
      <div style={{ background: 'var(--bg-3)', border: '1px dashed var(--border-2)', padding: 10, textAlign: 'center', fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--text-3)' }}>AD · autoplay video</div>
      <Skeleton w="60%" h={10} />
      <div style={{ background: 'var(--bg-3)', border: '1px dashed var(--border-2)', padding: 10, textAlign: 'center', fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--text-3)' }}>AD · sticky bottom</div>
    </div>
  );
}

function GfinMock() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: '0.78rem' }}>
        S&amp;P 500 &nbsp;<span className="up">▲ 5,431.20</span>
      </div>
      <div style={{ fontFamily: 'var(--mono)', fontSize: '0.78rem' }}>
        DOW JONES &nbsp;<span className="up">▲ 39,210.10</span>
      </div>
      <div style={{ fontFamily: 'var(--mono)', fontSize: '0.78rem' }}>
        NASDAQ &nbsp;<span className="down">▼ 17,832.40</span>
      </div>
      <div style={{ marginTop: 12, fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--text-3)' }}>
        Currency: USD · Indian markets: 3 clicks deep
      </div>
    </div>
  );
}
```

- [ ] **Step 13.2: Commit**

```bash
git add components/pain/PainCard.tsx
git commit -m "feat(pain): add PainCard + competitor faux frames"
```

---

## Task 14: `components/pain/PainSection.tsx`

**Files:**
- Create: `components/pain/PainSection.tsx`

- [ ] **Step 14.1: Implement**

```tsx
'use client';
import { useState } from 'react';
import PainCard, { type Pain } from './PainCard';

const PAINS: Pain[] = [
  {
    app: 'NSE WEBSITE',
    ratingLabel: 'SLOW',
    ratingColor: 'var(--negative)',
    headlineTop: 'Built in 2003.',
    headlineHighlight: 'Still feels like it.',
    stat: { value: '5+', unit: 'seconds to load' },
    bullets: [
      'Data buried under multiple page reloads',
      'No live prices — everything is delayed',
      'Circuit breaker info? Three clicks deep.',
    ],
    fauxFrame: 'nse',
  },
  {
    app: 'MONEYCONTROL',
    ratingLabel: 'NOISY',
    ratingColor: 'var(--amber)',
    headlineTop: 'The ads load',
    headlineHighlight: 'faster than the data.',
    stat: { value: '16', unit: 'ads per page' },
    bullets: [
      'Autoplay video in the corner, always',
      'The analysis you need is behind a paywall',
      'Four different loading spinners at once',
    ],
    fauxFrame: 'mc',
  },
  {
    app: 'GOOGLE FINANCE',
    ratingLabel: 'WRONG MARKET',
    ratingColor: 'var(--gold)',
    headlineTop: 'Defaults to Wall Street.',
    headlineHighlight: 'You trade Dalal Street.',
    stat: { value: 'USD', unit: 'default currency' },
    bullets: [
      'NIFTY data is buried, US stocks up front',
      'No NSE intraday — only daily snapshots',
      'No sector heatmap, no India-specific data',
    ],
    fauxFrame: 'gfin',
  },
];

export default function PainSection() {
  const [idx, setIdx] = useState(0);
  return (
    <section id="pain" className="section crosshair">
      <div className="container">
        <div className="section-num">№ 04 / PAIN</div>
        <h2 style={{ marginTop: 18, maxWidth: 720 }}>
          What you <span className="amber">put up with</span> today.
        </h2>
        <p style={{ marginTop: 14, maxWidth: 620 }}>
          Three of the most-visited finance products in India. None of them built for the way you actually use them.
        </p>

        <div role="tablist" aria-label="Pain points" style={{ marginTop: 40, display: 'flex', gap: 0, borderTop: '1px solid var(--border-1)', borderBottom: '1px solid var(--border-1)' }}>
          {PAINS.map((p, i) => (
            <button
              key={p.app}
              role="tab"
              aria-selected={i === idx}
              onClick={() => setIdx(i)}
              style={{
                flex: 1, padding: '18px 16px', background: i === idx ? 'var(--bg-1)' : 'transparent',
                borderRight: i < PAINS.length - 1 ? '1px solid var(--border-1)' : 'none',
                color: i === idx ? 'var(--text-1)' : 'var(--text-3)',
                fontFamily: 'var(--mono)', fontSize: '0.7rem', letterSpacing: '0.14em', textTransform: 'uppercase',
                cursor: 'pointer', textAlign: 'left',
              }}
            >
              <span style={{ color: 'var(--text-4)' }}>0{i + 1} </span>{p.app}
              <span style={{ float: 'right', color: p.ratingColor }}>{p.ratingLabel}</span>
            </button>
          ))}
        </div>

        <PainCard pain={PAINS[idx]} />
      </div>
    </section>
  );
}
```

- [ ] **Step 14.2: Commit**

```bash
git add components/pain/PainSection.tsx
git commit -m "feat(pain): add interactive PainSection"
```

---

## Task 15: `components/pivot/Pivot.tsx`

**Files:**
- Create: `components/pivot/Pivot.tsx`

- [ ] **Step 15.1: Implement**

```tsx
export default function Pivot() {
  return (
    <section id="pivot" className="section" style={{ textAlign: 'center', padding: '160px 0' }}>
      <div className="container">
        <div className="section-num">№ 05 / MANIFESTO</div>
        <h2 style={{ marginTop: 24, fontSize: 'clamp(2.4rem, 5vw, 4.4rem)', letterSpacing: '-0.05em' }}>
          So we built<br /><span className="amber">something else.</span>
        </h2>
        <p className="caption" style={{ marginTop: 28 }}>
          Live · Indian · Ad-free · Built for the next decade.
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Step 15.2: Commit**

```bash
git add components/pivot/Pivot.tsx
git commit -m "feat(pivot): add manifesto pivot section"
```

---

## Task 16: `components/features/FeatureBlock.tsx`

**Files:**
- Create: `components/features/FeatureBlock.tsx`

- [ ] **Step 16.1: Implement**

```tsx
import type { ReactNode } from 'react';

export default function FeatureBlock({
  num, tag, headlineTop, headlineHighlight, body, bullets, reverse = false, viz,
}: {
  num: string;
  tag: string;
  headlineTop: string;
  headlineHighlight: string;
  body: string;
  bullets: string[];
  reverse?: boolean;
  viz: ReactNode;
}) {
  return (
    <section className="section crosshair">
      <div className="container">
        <div className="section-num">№ {num} / {tag}</div>
        <div style={{
          marginTop: 28,
          display: 'grid', gridTemplateColumns: reverse ? '1fr 1.1fr' : '1.1fr 1fr',
          gap: 64, alignItems: 'center',
        }}>
          <div style={{ order: reverse ? 2 : 1 }}>
            <h2>{headlineTop} <span className="amber">{headlineHighlight}</span></h2>
            <p style={{ marginTop: 18, maxWidth: 520 }}>{body}</p>
            <ul style={{ marginTop: 24, listStyle: 'none', padding: 0 }}>
              {bullets.map((b, i) => (
                <li key={i} style={{ padding: '12px 0', borderTop: '1px solid var(--border-1)', display: 'flex', gap: 16, color: 'var(--text-2)', fontSize: '0.92rem' }}>
                  <span className="caption">→</span>{b}
                </li>
              ))}
            </ul>
          </div>
          <div style={{ order: reverse ? 1 : 2 }}>{viz}</div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 16.2: Commit**

```bash
git add components/features/FeatureBlock.tsx
git commit -m "feat(features): add FeatureBlock shell"
```

---

## Task 17: `viz/HeatmapViz.tsx`

**Files:**
- Create: `components/features/viz/HeatmapViz.tsx`

- [ ] **Step 17.1: Implement**

```tsx
const SECTORS: { name: string; pct: number }[] = [
  { name: 'IT',         pct:  2.4 },
  { name: 'BANKING',    pct:  1.1 },
  { name: 'AUTO',       pct: -0.6 },
  { name: 'PHARMA',     pct:  0.8 },
  { name: 'FMCG',       pct: -0.2 },
  { name: 'METALS',     pct:  3.2 },
  { name: 'REALTY',     pct: -1.4 },
  { name: 'ENERGY',     pct:  1.7 },
  { name: 'INFRA',      pct:  0.4 },
  { name: 'CHEMICAL',   pct: -0.9 },
  { name: 'TELECOM',    pct:  2.0 },
];

function tint(pct: number): string {
  const abs = Math.min(Math.abs(pct), 4) / 4; // 0..1
  if (pct >= 0) return `rgba(34, 197, 94, ${0.15 + abs * 0.65})`;
  return `rgba(239, 68, 68, ${0.15 + abs * 0.65})`;
}

export default function HeatmapViz() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4, background: 'var(--bg-1)', padding: 4, border: '1px solid var(--border-1)', borderRadius: 8 }}>
      {SECTORS.map((s) => (
        <div key={s.name} style={{
          background: tint(s.pct), padding: '20px 14px', minHeight: 90,
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: 0.5, color: 'var(--text-1)' }}>{s.name}</div>
          <div className={`mono ${s.pct >= 0 ? 'up' : 'down'}`} style={{ fontSize: '0.78rem', fontWeight: 700 }}>
            {s.pct >= 0 ? '+' : ''}{s.pct.toFixed(2)}%
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 17.2: Commit**

```bash
git add components/features/viz/HeatmapViz.tsx
git commit -m "feat(viz): add HeatmapViz"
```

---

## Task 18: `viz/NavVsNiftyViz.tsx`

**Files:**
- Create: `components/features/viz/NavVsNiftyViz.tsx`

- [ ] **Step 18.1: Implement**

```tsx
const NAV   = [100, 102, 101, 105, 108, 112, 110, 116, 119, 124, 122, 128, 132, 130, 136, 142];
const NIFTY = [100, 101, 102, 103, 102, 104, 105, 106, 107, 108, 110, 111, 112, 114, 115, 118];

function toPath(values: number[], w: number, h: number) {
  const min = Math.min(...values, ...NIFTY);
  const max = Math.max(...values, ...NIFTY);
  const sx = w / (values.length - 1);
  const sy = (v: number) => h - ((v - min) / (max - min)) * h;
  return values.map((v, i) => `${i === 0 ? 'M' : 'L'} ${i * sx} ${sy(v)}`).join(' ');
}

export default function NavVsNiftyViz() {
  const W = 420, H = 220;
  return (
    <div style={{ background: 'var(--bg-1)', border: '1px solid var(--border-1)', borderRadius: 8, padding: 22 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
        <span className="caption">PORTFOLIO NAV vs NIFTY 50</span>
        <span className="up mono" style={{ fontSize: '0.85rem', fontWeight: 700 }}>+18.4%</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="auto" preserveAspectRatio="none" aria-label="NAV vs NIFTY chart">
        <path d={toPath(NIFTY, W, H)} fill="none" stroke="var(--text-3)" strokeWidth="1.5" strokeDasharray="4 3" />
        <path d={toPath(NAV,   W, H)} fill="none" stroke="var(--amber)" strokeWidth="2.5" />
      </svg>
      <div style={{ display: 'flex', gap: 18, marginTop: 14 }}>
        <Legend swatch="var(--amber)" label="Your NAV" />
        <Legend swatch="var(--text-3)" label="NIFTY 50" dashed />
      </div>
    </div>
  );
}

function Legend({ swatch, label, dashed }: { swatch: string; label: string; dashed?: boolean }) {
  return (
    <span className="caption" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <span style={{ display: 'inline-block', width: 18, height: 2, background: dashed ? 'transparent' : swatch, borderTop: dashed ? `2px dashed ${swatch}` : 'none' }} />
      {label}
    </span>
  );
}
```

- [ ] **Step 18.2: Commit**

```bash
git add components/features/viz/NavVsNiftyViz.tsx
git commit -m "feat(viz): add NavVsNiftyViz"
```

---

## Task 19: `viz/SectorTiles.tsx`

**Files:**
- Create: `components/features/viz/SectorTiles.tsx`

- [ ] **Step 19.1: Implement**

```tsx
const COMMODITIES = [
  { name: 'CRUDE OIL', val: '$78.42', chg:  1.20, unit: 'WTI · per bbl' },
  { name: 'GOLD',      val: '₹71,240', chg: -0.40, unit: 'MCX · 10g' },
  { name: 'SILVER',    val: '₹88,310', chg:  1.85, unit: 'MCX · 1kg' },
  { name: 'COPPER',    val: '₹802.40', chg:  0.65, unit: 'MCX · per kg' },
];

export default function SectorTiles() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
      {COMMODITIES.map((c) => (
        <div key={c.name} style={{ background: 'var(--bg-1)', border: '1px solid var(--border-1)', borderRadius: 8, padding: 18 }}>
          <div className="caption" style={{ marginBottom: 6 }}>{c.name}</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.02em' }}>{c.val}</div>
          <div className={`mono ${c.chg >= 0 ? 'up' : 'down'}`} style={{ fontSize: '0.78rem', fontWeight: 700, marginTop: 4 }}>
            {c.chg >= 0 ? '▲' : '▼'} {Math.abs(c.chg).toFixed(2)}%
          </div>
          <div className="caption" style={{ marginTop: 10, color: 'var(--text-4)' }}>{c.unit}</div>
          <MiniSpark up={c.chg >= 0} />
        </div>
      ))}
    </div>
  );
}

function MiniSpark({ up }: { up: boolean }) {
  const path = up
    ? 'M0 24 L8 20 L16 22 L24 14 L32 16 L40 8 L48 11 L56 5'
    : 'M0 6 L8 9 L16 7 L24 14 L32 12 L40 18 L48 16 L56 22';
  return (
    <svg width="100%" height="28" viewBox="0 0 56 28" style={{ marginTop: 12 }}>
      <path d={path} fill="none" stroke={up ? 'var(--positive)' : 'var(--negative)'} strokeWidth="1.8" />
    </svg>
  );
}
```

- [ ] **Step 19.2: Commit**

```bash
git add components/features/viz/SectorTiles.tsx
git commit -m "feat(viz): add SectorTiles commodity grid"
```

---

## Task 20: `viz/WatchlistRows.tsx`

**Files:**
- Create: `components/features/viz/WatchlistRows.tsx`

- [ ] **Step 20.1: Implement**

```tsx
const ROWS = [
  { sym: 'RELIANCE',  price: '2,914.20', chg:  2.40 },
  { sym: 'TCS',       price: '4,082.15', chg:  3.10 },
  { sym: 'HDFCBANK',  price: '1,612.40', chg:  1.20 },
  { sym: 'INFY',      price: '1,742.65', chg: -0.80 },
  { sym: 'BAJFINANCE',price: '6,920.00', chg:  4.70 },
  { sym: 'ITC',       price:   '436.85', chg:  0.50 },
];

export default function WatchlistRows() {
  return (
    <div style={{ background: 'var(--bg-1)', border: '1px solid var(--border-1)', borderRadius: 8, overflow: 'hidden' }}>
      <div className="caption" style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-1)', display: 'flex', justifyContent: 'space-between' }}>
        <span>WATCHLIST · LONG-TERM</span><span>6 stocks · live</span>
      </div>
      {ROWS.map((r, i) => (
        <div key={r.sym} style={{
          display: 'grid', gridTemplateColumns: '110px 1fr 90px 90px',
          alignItems: 'center', padding: '14px 16px',
          borderTop: i === 0 ? 'none' : '1px solid var(--border-1)',
        }}>
          <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>{r.sym}</span>
          <Spark up={r.chg >= 0} />
          <span className="mono" style={{ fontSize: '0.82rem', textAlign: 'right' }}>₹{r.price}</span>
          <span className={`mono ${r.chg >= 0 ? 'up' : 'down'}`} style={{ fontSize: '0.78rem', fontWeight: 700, textAlign: 'right' }}>
            {r.chg >= 0 ? '+' : ''}{r.chg.toFixed(2)}%
          </span>
        </div>
      ))}
    </div>
  );
}

function Spark({ up }: { up: boolean }) {
  const path = up
    ? 'M0 18 L10 14 L20 16 L30 10 L40 12 L50 6 L60 8 L70 3'
    : 'M0 3 L10 7 L20 5 L30 11 L40 9 L50 14 L60 12 L70 18';
  return (
    <svg width="80" height="22" viewBox="0 0 70 22" style={{ marginLeft: 14 }}>
      <path d={path} fill="none" stroke={up ? 'var(--positive)' : 'var(--negative)'} strokeWidth="1.5" />
    </svg>
  );
}
```

- [ ] **Step 20.2: Commit**

```bash
git add components/features/viz/WatchlistRows.tsx
git commit -m "feat(viz): add WatchlistRows"
```

---

## Task 21: `viz/EventsGrid.tsx`

**Files:**
- Create: `components/features/viz/EventsGrid.tsx`

- [ ] **Step 21.1: Implement**

```tsx
const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
const EVENTS: { day: number; label: string; kind: 'earn' | 'div' | 'macro' }[] = [
  { day: 0, label: 'INFY Q4',     kind: 'earn' },
  { day: 0, label: 'RELIANCE AGM', kind: 'macro' },
  { day: 1, label: 'TCS ex-div',  kind: 'div'  },
  { day: 2, label: 'RBI MPC',     kind: 'macro' },
  { day: 3, label: 'HDFC Q4',     kind: 'earn' },
  { day: 4, label: 'CPI release', kind: 'macro' },
  { day: 4, label: 'WIPRO Q4',    kind: 'earn' },
];

const KIND_STYLE: Record<string, { bg: string; color: string }> = {
  earn:  { bg: 'rgba(245, 158, 11, 0.15)', color: 'var(--amber)' },
  div:   { bg: 'rgba(34, 197, 94, 0.15)',  color: 'var(--positive)' },
  macro: { bg: 'rgba(192, 192, 192, 0.10)',color: 'var(--text-2)' },
};

export default function EventsGrid() {
  return (
    <div style={{ background: 'var(--bg-1)', border: '1px solid var(--border-1)', borderRadius: 8, overflow: 'hidden' }}>
      <div className="caption" style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-1)' }}>
        WEEK OF 18–22 MAY · IST
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)' }}>
        {DAYS.map((d, i) => (
          <div key={d} style={{ borderRight: i < 4 ? '1px solid var(--border-1)' : 'none', minHeight: 180, padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span className="caption">{d}</span>
            {EVENTS.filter((e) => e.day === i).map((e, j) => (
              <span key={j} style={{
                fontSize: '0.72rem', fontWeight: 700, padding: '6px 8px', borderRadius: 4,
                background: KIND_STYLE[e.kind].bg, color: KIND_STYLE[e.kind].color,
              }}>{e.label}</span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 21.2: Commit**

```bash
git add components/features/viz/EventsGrid.tsx
git commit -m "feat(viz): add EventsGrid"
```

---

## Task 22: `viz/PaperTradeMock.tsx`

**Files:**
- Create: `components/features/viz/PaperTradeMock.tsx`

- [ ] **Step 22.1: Implement**

```tsx
export default function PaperTradeMock() {
  return (
    <div style={{ background: 'var(--bg-1)', border: '1px solid var(--border-1)', borderRadius: 8, padding: 22 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span className="caption">PAPER · NIFTY 50 · 25 MAY · 22800 CE</span>
        <span className="up mono" style={{ fontSize: '0.78rem', fontWeight: 700 }}>+₹4,820</span>
      </div>
      <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Tile label="Entry" value="₹142.30" />
        <Tile label="LTP"   value="₹190.50" highlight />
        <Tile label="Qty"   value="100" />
        <Tile label="P&L %" value="+33.9%" up />
      </div>
      <div style={{ marginTop: 18, padding: 12, border: '1px dashed var(--border-2)', borderRadius: 6, fontFamily: 'var(--mono)', fontSize: '0.72rem', color: 'var(--text-3)' }}>
        PAPER MODE · No real money · Reset weekly
      </div>
    </div>
  );
}

function Tile({ label, value, highlight, up }: { label: string; value: string; highlight?: boolean; up?: boolean }) {
  return (
    <div style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 6, border: '1px solid var(--border-1)' }}>
      <div className="caption">{label}</div>
      <div className={up ? 'up' : undefined} style={{ fontSize: '1.1rem', fontWeight: 800, marginTop: 4, color: highlight ? 'var(--amber)' : undefined }}>
        {value}
      </div>
    </div>
  );
}
```

- [ ] **Step 22.2: Commit**

```bash
git add components/features/viz/PaperTradeMock.tsx
git commit -m "feat(viz): add PaperTradeMock"
```

---

## Task 23: `components/stats/StatsStrip.tsx`

**Files:**
- Create: `components/stats/StatsStrip.tsx`

- [ ] **Step 23.1: Implement**

```tsx
const STATS = [
  { value: '1.8M', label: 'ticks per day' },
  { value: '42',   label: 'data sources' },
  { value: '<1s',  label: 'cold-start' },
  { value: '100%', label: 'Indian markets' },
];

export default function StatsStrip() {
  return (
    <section className="section-sm" style={{ borderTop: '1px solid var(--border-1)', borderBottom: '1px solid var(--border-1)' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
        {STATS.map((s) => (
          <div key={s.label} style={{ borderRight: '1px solid var(--border-1)', paddingLeft: 0, paddingRight: 16 }}>
            <div style={{ fontSize: '2.4rem', fontWeight: 900, letterSpacing: '-0.04em' }}>{s.value}</div>
            <div className="caption" style={{ marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 23.2: Commit**

```bash
git add components/stats/StatsStrip.tsx
git commit -m "feat(stats): add StatsStrip"
```

---

## Task 24: `components/builtFor/BuiltForIndia.tsx`

**Files:**
- Create: `components/builtFor/BuiltForIndia.tsx`

- [ ] **Step 24.1: Implement**

```tsx
const WORDMARKS = ['NSE', 'BSE', 'MCX', 'SEBI registered (DP)', 'Upstox data', 'RBI rates'];

export default function BuiltForIndia() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-num">№ 13 / BUILT FOR INDIA</div>
        <h2 style={{ marginTop: 18, maxWidth: 760 }}>
          Built in India. <span className="amber">For Indian markets.</span>
        </h2>
        <p style={{ marginTop: 14, maxWidth: 540 }}>
          Rupee formatting. IST timezone. Lakh and crore conventions. Tax rules that match what you actually file.
        </p>
        <div style={{
          marginTop: 40, padding: '32px 24px', background: 'var(--bg-1)', border: '1px solid var(--border-1)',
          borderRadius: 8, display: 'grid', gridTemplateColumns: `repeat(${WORDMARKS.length}, 1fr)`, gap: 24, alignItems: 'center', textAlign: 'center',
        }}>
          {WORDMARKS.map((w) => (
            <span key={w} className="mono" style={{ color: 'var(--text-3)', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.06em' }}>
              {w}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 24.2: Commit**

```bash
git add components/builtFor/BuiltForIndia.tsx
git commit -m "feat: add BuiltForIndia section"
```

---

## Task 25: `components/waitlist/Waitlist.tsx` — TDD

**Files:**
- Create: `components/waitlist/Waitlist.tsx`
- Test: `components/waitlist/Waitlist.test.tsx`

- [ ] **Step 25.1: Write failing tests**

```tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Waitlist from './Waitlist';

const fetchMock = vi.fn();
beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
});

describe('Waitlist', () => {
  it('rejects empty email client-side', async () => {
    render(<Waitlist />);
    await userEvent.click(screen.getByRole('button', { name: /platform: ios/i }));
    await userEvent.click(screen.getByRole('button', { name: /join the waitlist/i }));
    expect(await screen.findByText(/enter a valid email/i)).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('submits and shows position on success', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({ position: 2847 }) });
    render(<Waitlist />);
    await userEvent.click(screen.getByRole('button', { name: /platform: ios/i }));
    await userEvent.type(screen.getByPlaceholderText(/your email/i), 'a@b.com');
    await userEvent.click(screen.getByRole('button', { name: /join the waitlist/i }));
    await waitFor(() => expect(screen.getByText(/#2,847/)).toBeInTheDocument());
  });

  it('shows error on network failure', async () => {
    fetchMock.mockRejectedValue(new Error('net'));
    render(<Waitlist />);
    await userEvent.click(screen.getByRole('button', { name: /platform: android/i }));
    await userEvent.type(screen.getByPlaceholderText(/your email/i), 'a@b.com');
    await userEvent.click(screen.getByRole('button', { name: /join the waitlist/i }));
    expect(await screen.findByText(/could not reach server/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 25.2: Run, verify FAIL**

Run: `npm test -- components/waitlist/Waitlist.test.tsx`. Expected: FAIL.

- [ ] **Step 25.3: Implement**

```tsx
'use client';
import { useState, type FormEvent } from 'react';
import { isLaunched } from '@/lib/launchMode';
import LaunchCTA from './LaunchCTA';

type Platform = 'ios' | 'android';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Waitlist() {
  if (isLaunched()) {
    return (
      <section id="waitlist" className="section">
        <div className="container"><LaunchCTA /></div>
      </section>
    );
  }
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ position?: number; error?: string } | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setResult(null);
    if (!platform) return setResult({ error: 'Pick a platform' });
    if (!EMAIL_RE.test(email)) return setResult({ error: 'Enter a valid email' });
    setSubmitting(true);
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, platform }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as { position?: number };
      setResult({ position: json.position });
    } catch {
      setResult({ error: 'Could not reach server · retry' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="waitlist" className="section crosshair" style={{ background: 'var(--bg-1)' }}>
      <div className="container" style={{ maxWidth: 600, textAlign: 'center' }}>
        <div className="section-num" style={{ justifyContent: 'center' }}>№ 14 / WAITLIST</div>
        <h2 style={{ marginTop: 18, fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)' }}>
          Be early. <span className="amber">Be ready.</span>
        </h2>
        <p style={{ marginTop: 12, color: 'var(--text-3)' }}>
          Get the app the moment it ships. No spam, ever.
        </p>

        <form onSubmit={onSubmit} style={{ marginTop: 36, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div role="radiogroup" aria-label="Platform" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, background: 'var(--bg-2)', padding: 5, borderRadius: 12 }}>
            <PlatformButton current={platform} value="ios"     onSelect={setPlatform} label="iOS" />
            <PlatformButton current={platform} value="android" onSelect={setPlatform} label="Android" />
          </div>
          <input
            type="email" placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)}
            aria-label="Email"
            style={{
              padding: '16px 18px', background: 'var(--bg-2)', border: '1px solid var(--border-2)',
              borderRadius: 8, color: 'var(--text-1)', fontSize: '0.95rem', outline: 'none',
            }}
          />
          <button
            className="btn btn-amber btn-lg" type="submit" disabled={submitting}
          >
            {submitting ? 'Submitting…' : 'Join the waitlist →'}
          </button>
        </form>

        <div className="mono" style={{ marginTop: 16, fontSize: '0.78rem', minHeight: 22 }}>
          {result?.position && (
            <span className="up">You're #{result.position.toLocaleString('en-IN')} in line.</span>
          )}
          {result?.error && <span className="down">{result.error}</span>}
        </div>
      </div>
    </section>
  );
}

function PlatformButton({ current, value, onSelect, label }: {
  current: Platform | null; value: Platform; onSelect: (p: Platform) => void; label: string;
}) {
  const active = current === value;
  return (
    <button
      type="button" role="radio" aria-checked={active}
      onClick={() => onSelect(value)}
      aria-label={`Platform: ${label}`}
      style={{
        padding: '11px 18px',
        background: active ? 'var(--bg-3)' : 'transparent',
        border: `1px solid ${active ? 'var(--border-2)' : 'transparent'}`,
        borderRadius: 8, color: active ? 'var(--text-1)' : 'var(--text-3)',
        fontWeight: 600, cursor: 'pointer',
      }}
    >{label}</button>
  );
}
```

- [ ] **Step 25.4: Run, verify PASS**

Run: `npm test -- components/waitlist/Waitlist.test.tsx`. Expected: PASS.

- [ ] **Step 25.5: Commit**

```bash
git add components/waitlist/Waitlist.tsx components/waitlist/Waitlist.test.tsx
git commit -m "feat(waitlist): add Waitlist with validation + error states"
```

---

## Task 26: `components/waitlist/LaunchCTA.tsx`

**Files:**
- Create: `components/waitlist/LaunchCTA.tsx`

- [ ] **Step 26.1: Implement**

```tsx
export default function LaunchCTA() {
  return (
    <div id="download" style={{ textAlign: 'center' }}>
      <div className="section-num" style={{ justifyContent: 'center' }}>№ 14 / DOWNLOAD</div>
      <h2 style={{ marginTop: 18 }}>
        Get <span className="amber">Ziro Market</span>.
      </h2>
      <p style={{ marginTop: 12, maxWidth: 480, margin: '12px auto 0' }}>
        Free. iOS and Android. Built for Indian markets.
      </p>
      <div style={{ marginTop: 32, display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
        <a href="https://apps.apple.com/in/app/ziromarket" className="btn btn-amber btn-lg">App Store →</a>
        <a href="https://play.google.com/store/apps/details?id=com.ziromarket" className="btn btn-ghost btn-lg">Play Store →</a>
      </div>
      <p className="caption" style={{ marginTop: 24 }}>Already have it? <a href="#" style={{ color: 'var(--text-1)', textDecoration: 'underline' }}>Sign in</a></p>
    </div>
  );
}
```

- [ ] **Step 26.2: Commit**

```bash
git add components/waitlist/LaunchCTA.tsx
git commit -m "feat(waitlist): add LaunchCTA (post-launch CTA)"
```

---

## Task 27: `/api/indices` route + scoped rewrites

**Files:**
- Modify: `next.config.ts`
- Create: `app/api/indices/route.ts`
- Test: `app/api/indices/route.test.ts`

- [ ] **Step 27.1: Scope existing API rewrite**

Replace the body of `nextConfig.rewrites`:
```ts
rewrites: async () => ([
  { source: '/api/waitlist',      destination: 'http://52.90.228.120:3000/api/waitlist' },
  { source: '/api/backend/:path*', destination: 'http://52.90.228.120:3000/api/:path*' },
]),
```
This frees `/api/indices` for the local handler.

- [ ] **Step 27.2: Write failing test**

```ts
import { describe, it, expect } from 'vitest';
import { GET } from './route';

describe('GET /api/indices', () => {
  it('returns 4 indices', async () => {
    const res = await GET();
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(Array.isArray(json)).toBe(true);
    expect(json).toHaveLength(4);
    expect(json[0]).toHaveProperty('symbol');
  });
});
```

- [ ] **Step 27.3: Run, verify FAIL**

Run: `npm test -- app/api/indices/route.test.ts`. Expected: module missing.

- [ ] **Step 27.4: Implement**

```ts
import { NextResponse } from 'next/server';
import { STATIC_INDICES } from '@/lib/marketData';

export const runtime = 'nodejs';

export async function GET() {
  // Upstream fetch placeholder — for now return static snapshot
  // TODO when WS / Upstox key wired: try { await fetch(UPSTOX_URL) } catch { fall back }
  return NextResponse.json(STATIC_INDICES, {
    headers: { 'cache-control': 'no-store, max-age=0' },
  });
}
```

- [ ] **Step 27.5: Run, verify PASS**

Run: `npm test -- app/api/indices/route.test.ts`. Expected: PASS.

- [ ] **Step 27.6: Commit**

```bash
git add next.config.ts app/api/indices/route.ts app/api/indices/route.test.ts
git commit -m "feat(api): add /api/indices route + scope rewrites"
```

---

## Task 28: Compose `app/page.tsx`

**Files:**
- Modify: `app/page.tsx` (full replacement)

- [ ] **Step 28.1: Replace the page**

```tsx
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/hero/Hero';
import Marquee from '@/components/hero/Marquee';
import PainSection from '@/components/pain/PainSection';
import Pivot from '@/components/pivot/Pivot';
import FeatureBlock from '@/components/features/FeatureBlock';
import HeatmapViz from '@/components/features/viz/HeatmapViz';
import NavVsNiftyViz from '@/components/features/viz/NavVsNiftyViz';
import SectorTiles from '@/components/features/viz/SectorTiles';
import WatchlistRows from '@/components/features/viz/WatchlistRows';
import EventsGrid from '@/components/features/viz/EventsGrid';
import PaperTradeMock from '@/components/features/viz/PaperTradeMock';
import StatsStrip from '@/components/stats/StatsStrip';
import BuiltForIndia from '@/components/builtFor/BuiltForIndia';
import Waitlist from '@/components/waitlist/Waitlist';

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <Marquee />
      <PainSection />
      <Pivot />

      <FeatureBlock
        num="06" tag="MARKET MAP"
        headlineTop="11 sectors." headlineHighlight="One look."
        body="Sector heatmap, top gainers, 52-week highs and lows, live indices — everything happening in the market, the moment it happens."
        bullets={['Live colour-coded sector grid', 'Top gainers & losers, one tap away']}
        viz={<HeatmapViz />}
      />
      <FeatureBlock
        num="07" tag="PORTFOLIO" reverse
        headlineTop="Your money." headlineHighlight="Tracked properly."
        body="Portfolio NAV vs Nifty, full P&L breakdown, analytics that explain exactly how your holdings are performing."
        bullets={['NAV-vs-NIFTY benchmarking', 'Realised + unrealised P&L']}
        viz={<NavVsNiftyViz />}
      />
      <FeatureBlock
        num="08" tag="DISCOVERY"
        headlineTop="Every sector." headlineHighlight="Every story."
        body="Sector news, commodity prices, MF overlap, stock correlation — everything you need to understand the bigger picture."
        bullets={['Commodities: crude, gold, silver, copper', 'MF holding overlap + correlation']}
        viz={<SectorTiles />}
      />
      <FeatureBlock
        num="09" tag="WATCHLIST" reverse
        headlineTop="Your picks," headlineHighlight="finally useful."
        body="Live prices, mini-charts, comparison across multiple lists. Know exactly how your picks are doing at a glance."
        bullets={['Multiple lists, side-by-side', 'Live sparklines + change %']}
        viz={<WatchlistRows />}
      />
      <FeatureBlock
        num="10" tag="TOMORROW"
        headlineTop="Know what's coming." headlineHighlight="Tomorrow."
        body="Earnings, results, ex-dividend dates, RBI policy days — the events that move prices, before they move."
        bullets={['Weekly events calendar', 'Filter by your watchlist']}
        viz={<EventsGrid />}
      />
      <FeatureBlock
        num="11" tag="PAPER TRADE" reverse
        headlineTop="Practice without" headlineHighlight="the pain."
        body="Try out trades, options strategies and position sizing with no real money. Reset every week."
        bullets={['Equities + F&O paper book', 'Resets weekly so you stay honest']}
        viz={<PaperTradeMock />}
      />

      <StatsStrip />
      <BuiltForIndia />
      <Waitlist />
      <Footer />
    </>
  );
}
```

- [ ] **Step 28.2: Boot dev server, sanity-check**

Run: `npm run dev` (background). Open `http://localhost:3000`. Confirm:
- No console errors
- Hero renders with amber accent + live indices strip
- Pain tabs are clickable
- Marquee animates
- Waitlist accepts an email (mock fetch will 404 — that's fine in dev)
Stop dev server.

- [ ] **Step 28.3: Run typecheck**

Run: `npm run typecheck`. Expected: 0 errors.

- [ ] **Step 28.4: Commit**

```bash
git add app/page.tsx
git commit -m "feat: compose new page.tsx from new component tree"
```

---

## Task 29: Re-skin `/privacy` and `/terms`

**Files:**
- Modify: `app/privacy/page.tsx`
- Modify: `app/terms/page.tsx`

- [ ] **Step 29.1: Wrap each legal page in the new Nav + Footer shell**

For each (`app/privacy/page.tsx`, `app/terms/page.tsx`), the structure becomes:

```tsx
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';

export default function Page() {
  return (
    <>
      <Nav />
      <main className="container section">
        <h1 className="display" style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)' }}>Privacy Policy</h1>
        <div style={{ marginTop: 32, maxWidth: 760 }}>
          {/* existing prose content preserved, wrapped in <p>/<h2>/<ul> with default styles */}
        </div>
      </main>
      <Footer />
    </>
  );
}
```

Keep the existing legal prose unchanged — only the wrapper/layout updates. Do the same for terms.

- [ ] **Step 29.2: Visual verify**

Run: `npm run dev`. Open `/privacy` and `/terms`. Confirm nav + footer present, type readable on black bg. Stop dev server.

- [ ] **Step 29.3: Commit**

```bash
git add app/privacy/page.tsx app/terms/page.tsx
git commit -m "feat: re-skin /privacy and /terms to new design system"
```

---

## Task 30: Delete old components

**Files:**
- Delete: every file under `components/` that is NOT inside the new subfolders (`layout/`, `hero/`, `pain/`, `pivot/`, `features/`, `stats/`, `builtFor/`, `waitlist/`).

- [ ] **Step 30.1: Remove old components**

Run:
```bash
rm components/Hero.tsx components/Marquee.tsx components/PainSection.tsx \
   components/Pivot.tsx components/FeatureSplit.tsx components/ScreenshotMosaic.tsx \
   components/StatsStrip.tsx components/Waitlist.tsx components/Footer.tsx \
   components/Navbar.tsx components/ScrollProgress.tsx components/ScrollRevealObserver.tsx
```

- [ ] **Step 30.2: Typecheck + tests**

```bash
npm run typecheck && npm test
```
Expected: typecheck passes, all unit tests pass.

- [ ] **Step 30.3: Commit**

```bash
git add -A components/
git commit -m "chore: remove legacy component files"
```

---

## Task 31: Playwright visual smoke tests

**Files:**
- Create: `tests/e2e/home.spec.ts`
- Create: `tests/e2e/legal.spec.ts`

- [ ] **Step 31.1: Write home smoke**

`tests/e2e/home.spec.ts`:
```ts
import { test, expect } from '@playwright/test';

test('home renders and key sections are visible', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Indian markets');
  await expect(page.getByRole('link', { name: /get early access/i }).first()).toBeVisible();
  await expect(page.getByText('NIFTY 50')).toBeVisible();
  await expect(page.getByText('What you')).toBeVisible();
  await expect(page.getByText(/built in India/i)).toBeVisible();
});

test('pain tabs switch content', async ({ page }) => {
  await page.goto('/#pain');
  await page.getByRole('tab', { name: /moneycontrol/i }).click();
  await expect(page.getByText(/ads load/i)).toBeVisible();
});

test('waitlist submit shows position (mock)', async ({ page }) => {
  await page.route('**/api/waitlist', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ position: 2847 }) }),
  );
  await page.goto('/#waitlist');
  await page.getByRole('radio', { name: /ios/i }).click();
  await page.getByPlaceholder(/your email/i).fill('a@b.com');
  await page.getByRole('button', { name: /join the waitlist/i }).click();
  await expect(page.getByText(/#2,847/)).toBeVisible();
});
```

- [ ] **Step 31.2: Write legal smoke**

`tests/e2e/legal.spec.ts`:
```ts
import { test, expect } from '@playwright/test';

for (const path of ['/privacy', '/terms']) {
  test(`${path} renders`, async ({ page }) => {
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByText(/ziro market/i).first()).toBeVisible();
  });
}
```

- [ ] **Step 31.3: Run E2E**

Run: `npm run e2e`. Expected: all tests pass on `desktop`, `tablet`, `mobile` projects.

- [ ] **Step 31.4: Commit**

```bash
git add tests/e2e
git commit -m "test(e2e): add Playwright smoke tests for home + legal"
```

---

## Task 32: Axe accessibility pass

**Files:**
- Create: `tests/e2e/a11y.spec.ts`

- [ ] **Step 32.1: Write a11y test**

```ts
import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test('home has no serious a11y violations', async ({ page }) => {
  await page.goto('/');
  await injectAxe(page);
  await checkA11y(page, undefined, {
    detailedReport: true,
    axeOptions: { runOnly: ['wcag2a', 'wcag2aa'] },
  });
});
```

- [ ] **Step 32.2: Run**

Run: `npm run e2e -- a11y`. Fix any *serious* findings (typically: missing labels on icon-only buttons, low-contrast captions). Re-run until passing.

- [ ] **Step 32.3: Commit**

```bash
git add tests/e2e/a11y.spec.ts
git commit -m "test(e2e): add axe a11y check"
```

---

## Task 33: Manual checklist + ship

**Files:** none (verification only)

- [ ] **Step 33.1: Boot prod build locally**

```bash
npm run build && npm run start
```
Expected: build succeeds, server listens on :3000.

- [ ] **Step 33.2: Manual QA on `http://localhost:3000`**

Verify on Chrome + Safari + iOS Simulator/Android emulator:
- Hero LCP < 1.5s on warm cache
- Scroll-reveal triggers on feature blocks
- Marquee animates and pauses with `prefers-reduced-motion`
- Pain tabs are keyboard-navigable (arrows + Enter)
- Waitlist form: empty submit shows validation, real submit shows position
- Live indices strip is visible above-the-fold on desktop
- Footer links are reachable, legal pages render
- Mobile (`< 768px`): nav collapses cleanly, feature blocks single-column, no horizontal scroll

- [ ] **Step 33.3: Launch-mode preview**

```bash
NEXT_PUBLIC_LAUNCH_MODE=launched npm run dev
```
Verify: hero CTA reads "Download Ziro Market →", nav reads "Download →", waitlist section is replaced by App Store + Play Store badges. Stop dev server.

- [ ] **Step 33.4: Reset env and final commit**

```bash
git status   # should be clean
```

- [ ] **Step 33.5: Open PR**

```bash
git push -u origin <branch>
gh pr create --title "Website redesign — dark Swiss brutalist + launch-swap" --body "$(cat <<'EOF'
## Summary
- Full marketing-site rewrite per `docs/superpowers/specs/2026-05-20-website-redesign-design.md`
- New dark Swiss-brutalist design system, app-palette-matched, amber accent
- Six hand-built data-viz components — no app screenshots
- `NEXT_PUBLIC_LAUNCH_MODE` flag flips waitlist → download CTAs

## Test plan
- [ ] `npm test` passes (Vitest unit/integration)
- [ ] `npm run e2e` passes (Playwright + axe)
- [ ] Manual: hero, pain tabs, marquee, waitlist submit, launch-mode swap, mobile layout

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

---

## Self-Review

**Spec coverage:** Every spec section maps to one or more tasks (palette → T1, type → T1, components → T7–T26, launch swap → T3+T8+T25+T26, live data → T4+T6+T11+T27, sections 01–15 → T8/T9/T10/T11/T12/T14/T15/T16–T22/T23/T24/T25/T26, testing → T25 unit + T31 E2E + T32 a11y, performance budgets → enforced via T33 manual QA + `font-display: swap` in T1, OG metadata → T2). The `/api/og` route is marked optional in the spec and is not in scope this round.

**Placeholder scan:** No "TBD", "implement later" or empty-step entries. The `/api/indices` upstream is marked `TODO` *inside* a code block as a hand-off marker — it is not a plan placeholder; the function returns the static snapshot which is the agreed first iteration.

**Type consistency:** `LaunchMode`, `IndexQuote`, `TickerQuote`, `Pain` are defined once and re-imported. Hook names (`useLiveIndices`, `useReveal`) are consistent across components.

**Scope check:** One cohesive plan, single PR target.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-05-20-website-redesign.md`. Two execution options:

1. **Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration
2. **Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?
