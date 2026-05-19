import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import Nav from './Nav';

const orig = process.env.NEXT_PUBLIC_LAUNCH_MODE;
beforeEach(() => { delete process.env.NEXT_PUBLIC_LAUNCH_MODE; });
afterEach(() => { process.env.NEXT_PUBLIC_LAUNCH_MODE = orig; });

describe('Nav', () => {
  it('shows "Get Early Access" in waitlist mode', () => {
    render(<Nav />);
    expect(screen.getByRole('link', { name: /get early access/i })).toBeInTheDocument();
  });
  it('shows "Download" in launched mode', () => {
    process.env.NEXT_PUBLIC_LAUNCH_MODE = 'launched';
    render(<Nav />);
    expect(screen.getByRole('link', { name: /download/i })).toBeInTheDocument();
  });
});
