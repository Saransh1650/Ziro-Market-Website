import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useLiveIndices } from './useLiveIndices';
import { STATIC_INDICES } from '@/lib/marketData';

const fetchMock = vi.fn();
beforeEach(() => {
  vi.useFakeTimers();
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
});

describe('useLiveIndices', () => {
  it('returns seed snapshot on first render', () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => STATIC_INDICES });
    const { result } = renderHook(() => useLiveIndices(STATIC_INDICES));
    expect(result.current.data).toEqual(STATIC_INDICES);
    expect(result.current.stale).toBe(false);
  });

  it('keeps stale snapshot if fetch fails', async () => {
    fetchMock.mockRejectedValue(new Error('net'));
    const { result } = renderHook(() => useLiveIndices(STATIC_INDICES));
    await vi.advanceTimersByTimeAsync(20_000);
    vi.useRealTimers();
    await waitFor(() => expect(result.current.data).toEqual(STATIC_INDICES));
  });
});
