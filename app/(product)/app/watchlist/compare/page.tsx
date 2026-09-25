import type { Metadata } from 'next';
import CompareView from '@/components/app/CompareView';

export const metadata: Metadata = { title: 'Compare watchlist' };

export default function ComparePage() {
  return <CompareView />;
}
