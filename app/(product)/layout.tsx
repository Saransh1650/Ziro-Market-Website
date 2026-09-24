import type { Metadata } from 'next';
import './product.css';
import { ThemeProvider, themeScript } from '@/components/app/ThemeProvider';

/**
 * Wraps every product surface. Sits in a route group, so it adds no
 * segment to any URL and the marketing pages never see it.
 */

export const metadata: Metadata = {
  // The product is a signed-in tool, not content to rank. The public,
  // indexable surfaces — /stocks, /funds — sit outside this group.
  robots: { index: false, follow: false },
};

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/*
        Blocking, and deliberately so. React cannot run early enough:
        without this the first paint is light and then repaints dark,
        which is a visible flash on every load in dark mode.
      */}
      <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      <ThemeProvider>{children}</ThemeProvider>
    </>
  );
}
