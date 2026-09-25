import type { Metadata } from 'next';
import FundsView from '@/components/app/FundsView';

export const metadata: Metadata = { title: 'Mutual funds' };

export default function FundsPage() {
  return <FundsView kind="fund" />;
}
