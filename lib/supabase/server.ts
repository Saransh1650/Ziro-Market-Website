import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

/**
 * Server Supabase client, for Server Components and route handlers.
 *
 * A Server Component cannot set cookies, so the setters swallow the
 * error Next throws there — session refresh is handled in middleware,
 * which can write them.
 */
export async function supabaseServer() {
  const store = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => store.getAll(),
        setAll: (toSet) => {
          try {
            for (const { name, value, options } of toSet) store.set(name, value, options);
          } catch {
            // Called from a Server Component. Middleware refreshes the
            // session instead, so this is safe to ignore.
          }
        },
      },
    },
  );
}
