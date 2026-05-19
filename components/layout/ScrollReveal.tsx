'use client';
import { useReveal } from '@/hooks/useReveal';
import type { ReactNode } from 'react';

export default function ScrollReveal({ children, as = 'div', className = '', delayMs = 0 }: {
  children: ReactNode;
  as?: 'div' | 'section' | 'article';
  className?: string;
  delayMs?: number;
}) {
  const ref = useReveal<HTMLDivElement>();
  const Tag = as as 'div';
  return (
    <Tag
      ref={ref}
      data-reveal
      className={className}
      style={delayMs ? { transitionDelay: `${delayMs}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
