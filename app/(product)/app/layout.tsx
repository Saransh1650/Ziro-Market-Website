import type { Metadata } from 'next';
import AppShell from '@/components/app/AppShell';

/**
 * The signed-in product. Private by definition — the indexable surfaces
 * (`/stocks`, `/funds`) live outside this subtree, at the root of the
 * product route group.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
