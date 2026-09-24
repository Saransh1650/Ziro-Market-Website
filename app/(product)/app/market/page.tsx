import type { Metadata } from 'next';
import MarketMap from '@/components/app/MarketMap';

export const metadata: Metadata = { title: 'Market map' };

export default function MarketPage() {
  return <MarketMap />;
}
