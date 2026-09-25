'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js';
import { supabaseBrowser } from '@/lib/supabase/client';

interface AuthValue {
  user: User | null;
  session: Session | null;
  /** True until the first session check resolves. */
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthValue>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = supabaseBrowser();

    // `onAuthStateChange` fires immediately with the current session, so
    // it covers both the initial read and every later change — no
    // separate getSession call, and no setState directly in the effect
    // body.
    const { data } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, next: Session | null) => {
      setSession(next);
      setLoading(false);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabaseBrowser().auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user: session?.user ?? null, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

/** Access token for authenticated backend calls, or null when signed out. */
export function useAccessToken(): string | null {
  return useAuth().session?.access_token ?? null;
}
