import type { Metadata } from 'next';
import CommodityView from '@/components/app/CommodityView';

export async function generateMetadata({ params }: { params: Promise<{ symbol: string }> }): Promise<Metadata> {
  const { symbol } = await params;
  return { title: `${decodeURIComponent(symbol)} price` };
}

export default async function CommodityPage({ params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = await params;
  return <CommodityView commodityKey={decodeURIComponent(symbol).toLowerCase()} />;
}
