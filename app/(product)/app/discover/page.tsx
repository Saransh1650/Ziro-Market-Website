import type { Metadata } from 'next';
import { Suspense } from 'react';
import Discover from '@/components/app/Discover';

export const metadata: Metadata = { title: 'Discover' };

export default function DiscoverPage() {
  return (
    <Suspense fallback={<div style={{ height: 400 }} aria-hidden="true" />}>
      <Discover />
    </Suspense>
  );
}
