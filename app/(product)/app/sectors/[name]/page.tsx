import type { Metadata } from 'next';
import SectorView from '@/components/app/SectorView';

export async function generateMetadata(
  { params }: { params: Promise<{ name: string }> },
): Promise<Metadata> {
  const { name } = await params;
  return { title: `${decodeURIComponent(name)} sector` };
}

export default async function SectorPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  return <SectorView sector={decodeURIComponent(name)} />;
}
