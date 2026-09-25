import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Nav from './Nav';

// The nav no longer switches its CTA on launch mode: the web app is the
// primary action and the store download is always offered beside it.
describe('Nav', () => {
  it('leads with the web app', () => {
    render(<Nav />);
    const cta = screen.getAllByText(/open web app/i)[0].closest('a');
    expect(cta).toHaveAttribute('href', '/app/market');
  });

  it('still offers the app download', () => {
    render(<Nav />);
    expect(screen.getAllByText(/^download/i).length).toBeGreaterThan(0);
  });
});
