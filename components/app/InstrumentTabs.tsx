import Link from 'next/link';

const TABS = [
  { href: '/app/discover', label: 'Stocks', id: 'stocks' },
  { href: '/app/discover/etfs', label: 'ETFs', id: 'etfs' },
  { href: '/app/discover/funds', label: 'Mutual funds', id: 'funds' },
] as const;

/**
 * The instrument-type level of Discover. Tabs, not a segmented control:
 * this is a change of *what* is listed, which is one level above the cap
 * tier that filters within Stocks.
 */
export default function InstrumentTabs({ current }: { current: (typeof TABS)[number]['id'] }) {
  return (
    <nav className="zw-instabs" aria-label="Instrument type">
      {TABS.map((t) => (
        <Link key={t.id} href={t.href} aria-current={t.id === current ? 'page' : undefined}>
          {t.label}
        </Link>
      ))}
    </nav>
  );
}
