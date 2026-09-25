import type { Metadata } from 'next';
import { Suspense } from 'react';
import LoginForm from '@/components/app/LoginForm';

export const metadata: Metadata = {
  title: 'Sign in',
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ height: 300 }} aria-hidden="true" />}>
      <LoginForm />
    </Suspense>
  );
}
