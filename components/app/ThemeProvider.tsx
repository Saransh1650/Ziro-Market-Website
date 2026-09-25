'use client';

import { createContext, useCallback, useContext, useSyncExternalStore } from 'react';

export type ThemeSetting = 'light' | 'dark' | 'system';
export type Resolved = 'light' | 'dark';

const STORAGE_KEY = 'zw-theme';

/**
 * Runs before first paint, inlined in the product layout.
 *
 * Without it the page renders light, hydrates, then repaints dark — a
 * visible flash on every load for anyone using dark mode. This has to be
 * a blocking inline script; nothing React does is early enough.
 */
export const themeScript = `(function(){try{var s=localStorage.getItem('${STORAGE_KEY}')||'system';var d=s==='dark'||(s==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.setAttribute('data-theme',d?'dark':'light');}catch(e){document.documentElement.setAttribute('data-theme','light');}})();`;

/**
 * The theme is browser state — it lives in `localStorage` and in a media
 * query, both of which change outside React. That makes it an external
 * store rather than something to mirror into `useState` from an effect,
 * which would cascade renders and fight the pre-paint script.
 */

type Snapshot = `${ThemeSetting}:${Resolved}`;

const listeners = new Set<() => void>();
let snapshot: Snapshot = 'system:light';
let mediaBound = false;

function readSetting(): ThemeSetting {
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeSetting | null;
    if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;
  } catch {
    // Private mode, or storage blocked. The default is still correct.
  }
  return 'system';
}

function resolveSetting(setting: ThemeSetting): Resolved {
  if (setting !== 'system') return setting;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function recompute(): void {
  const setting = readSetting();
  const resolved = resolveSetting(setting);
  const next: Snapshot = `${setting}:${resolved}`;

  document.documentElement.setAttribute('data-theme', resolved);

  // The snapshot must be referentially stable between real changes, or
  // useSyncExternalStore loops. A string comparison gives that for free.
  if (next === snapshot) return;
  snapshot = next;
  for (const l of listeners) l();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);

  if (!mediaBound) {
    mediaBound = true;
    // Follow the OS while set to system, so a scheduled dark mode takes
    // effect without a reload.
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', recompute);
    // Another tab changing the theme should change this one too.
    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY) recompute();
    });
  }

  recompute();
  return () => listeners.delete(listener);
}

const getSnapshot = (): Snapshot => snapshot;
const getServerSnapshot = (): Snapshot => 'system:light';

interface ThemeContextValue {
  setting: ThemeSetting;
  resolved: Resolved;
  setTheme: (next: ThemeSetting) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const snap = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [setting, resolved] = snap.split(':') as [ThemeSetting, Resolved];

  const setTheme = useCallback((next: ThemeSetting) => {
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Not persisting is survivable; not switching is not.
    }
    recompute();
  }, []);

  return (
    <ThemeContext.Provider value={{ setting, resolved, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
