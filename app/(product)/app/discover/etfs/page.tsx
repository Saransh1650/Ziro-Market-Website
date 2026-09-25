import type { Metadata } from 'next';
import FundsView from '@/components/app/FundsView';

export const metadata: Metadata = { title: 'ETFs' };

export default function EtfsPage() {
  return <FundsView kind="etf" />;
}
