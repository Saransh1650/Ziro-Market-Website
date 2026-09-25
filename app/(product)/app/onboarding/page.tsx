import type { Metadata } from 'next';
import { Suspense } from 'react';
import Onboarding from '@/components/app/Onboarding';

export const metadata: Metadata = { title: 'Pick a username', robots: { index: false, follow: false } };

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div style={{ height: 300 }} aria-hidden="true" />}>
      <Onboarding />
    </Suspense>
  );
}
