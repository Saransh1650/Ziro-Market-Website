import type { Metadata } from 'next';
import { Suspense } from 'react';
import PortfolioAnalysis from '@/components/app/PortfolioAnalysis';
export const metadata: Metadata = { title: 'Portfolio analysis' };
export default function AnalysisPage() {
  return (
    <Suspense fallback={<div style={{ height: 400 }} aria-hidden="true" />}>
      <PortfolioAnalysis />
    </Suspense>
  );
}
