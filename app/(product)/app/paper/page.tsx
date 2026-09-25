import type { Metadata } from 'next';
import PaperTradeView from '@/components/app/PaperTradeView';
export const metadata: Metadata = { title: 'Paper trade' };
export default function PaperPage() { return <PaperTradeView />; }
