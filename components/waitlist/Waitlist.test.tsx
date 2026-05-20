import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Waitlist from './Waitlist';

const fetchMock = vi.fn();
beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
});

describe('Waitlist', () => {
  it('rejects empty email client-side', async () => {
    render(<Waitlist />);
    await userEvent.click(screen.getByRole('radio', { name: /ios/i }));
    await userEvent.click(screen.getByRole('button', { name: /join the waitlist/i }));
    expect(await screen.findByText(/enter a valid email/i)).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('submits and shows position on success', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({ position: 2847 }) });
    render(<Waitlist />);
    await userEvent.click(screen.getByRole('radio', { name: /ios/i }));
    await userEvent.type(screen.getByPlaceholderText(/your email/i), 'a@b.com');
    await userEvent.click(screen.getByRole('button', { name: /join the waitlist/i }));
    await waitFor(() => expect(screen.getByText(/#2,847/)).toBeInTheDocument());
  });

  it('shows error on network failure', async () => {
    fetchMock.mockRejectedValue(new Error('net'));
    render(<Waitlist />);
    await userEvent.click(screen.getByRole('radio', { name: /android/i }));
    await userEvent.type(screen.getByPlaceholderText(/your email/i), 'a@b.com');
    await userEvent.click(screen.getByRole('button', { name: /join the waitlist/i }));
    expect(await screen.findByText(/could not reach server/i)).toBeInTheDocument();
  });
});
