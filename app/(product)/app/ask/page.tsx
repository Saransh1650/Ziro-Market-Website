import type { Metadata } from 'next';
import AskWorkspace from '@/components/app/ask/AskWorkspace';

export const metadata: Metadata = { title: 'Ziro' };

export default function AskPage() {
  return <AskWorkspace />;
}
