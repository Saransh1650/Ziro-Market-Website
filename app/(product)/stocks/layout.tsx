import AppShell from '@/components/app/AppShell';

/**
 * The public instrument pages share the product's frame — rail, search,
 * index ticker — so a stock reached from Google looks and navigates like
 * one reached from inside the app. The page body itself stays a server
 * component, so what crawlers index is unchanged.
 */
export default function StocksLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
