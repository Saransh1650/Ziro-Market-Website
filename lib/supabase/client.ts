'use client';

import { createBrowserClient } from '@supabase/ssr';

/**
 * Browser Supabase client.
 *
 * Cookie-backed via `@supabase/ssr`, not `localStorage`. The default
 * `supabase-js` client stores the session where neither Server
 * Components nor middleware can read it, which would mean the server
 * never knows who is signed in.
 */
let cached: ReturnType<typeof createBrowserClient> | null = null;

export function supabaseBrowser() {
  cached ??= createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  return cached;
}
