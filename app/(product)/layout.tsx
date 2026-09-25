import './product.css';
import { productFont } from './fonts';
import { ThemeProvider, themeScript } from '@/components/app/ThemeProvider';
import { AuthProvider } from '@/components/app/AuthProvider';

/**
 * Everything built on the product design system: the signed-in app under
 * `/app`, and the public instrument pages like `/stocks/[symbol]`.
 *
 * Sits in a route group, so it adds no segment to any URL and the
 * marketing pages never see it.
 *
 * No robots directive here — the group holds both private and indexable
 * surfaces. `/app` opts itself out in its own layout.
 */
export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/*
        Blocking, and deliberately so. React cannot run early enough:
        without this the first paint is light and then repaints dark,
        which is a visible flash on every load in dark mode.
      */}
      <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      <div className={productFont.variable}>
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </div>
    </>
  );
}
