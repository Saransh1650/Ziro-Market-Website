'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

export type ThemeSetting = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'zw-theme';

/**
 * Runs before first paint, inlined in the product layout.
 *
 * Without it the page renders light, hydrates, then repaints dark — a
 * visible flash on every single load for anyone using dark mode. This has
 * to be a blocking inline script; nothing React does is early enough.
 */
export const themeScript = `(function(){try{var s=localStorage.getItem('${STORAGE_KEY}')||'system';var d=s==='dark'||(s==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.setAttribute('data-theme',d?'dark':'light');}catch(e){document.documentElement.setAttribute('data-theme','light');}})();`;

interface ThemeContextValue {
  setting: ThemeSetting;
  resolved: 'light' | 'dark';
  setTheme: (next: ThemeSetting) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function resolve(setting: ThemeSetting): 'light' | 'dark' {
  if (setting !== 'system') return setting;
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Starts at 'system' on both server and client so the first render
  // matches; the inline script has already painted the right colours.
  const [setting, setSetting] = useState<ThemeSetting>('system');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as ThemeSetting | null;
      if (stored) setSetting(stored);
    } catch {
      // Private mode, or storage blocked. The default is still correct.
    }
  }, []);

  const [resolved, setResolved] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const next = resolve(setting);
    setResolved(next);
    document.documentElement.setAttribute('data-theme', next);

    if (setting !== 'system') return;

    // Follow the OS while set to system, so a scheduled dark mode takes
    // effect without a reload.
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      const v = mq.matches ? 'dark' : 'light';
      setResolved(v);
      document.documentElement.setAttribute('data-theme', v);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [setting]);

  const setTheme = useCallback((next: ThemeSetting) => {
    setSetting(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Not persisting is survivable; not switching is not.
    }
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
