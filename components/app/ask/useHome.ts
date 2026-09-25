'use client';

import { useCallback, useEffect, useState } from 'react';
import { getHome, type Home } from '@/lib/api/assistantHome';
import { PROFILE_CHANGED } from '../assistant/intents';

/**
 * What Ziro already knows and noticed for this user. Refetches when the
 * profile changes so the next interview question appears without a reload.
 */
export function useHome(token: string | null) {
  const [home, setHome] = useState<Home | null>(null);
  const [loading, setLoading] = useState(Boolean(token));

  const load = useCallback((signal?: AbortSignal) => {
    if (!token) return;
    void getHome(token, signal).then((r) => {
      if (signal?.aborted) return;
      if (r.ok) setHome(r.data);
      setLoading(false);
    });
  }, [token]);

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    const onChange = () => load();
    document.addEventListener(PROFILE_CHANGED, onChange);
    return () => {
      controller.abort();
      document.removeEventListener(PROFILE_CHANGED, onChange);
    };
  }, [load]);

  return { home, loading, reload: load };
}
