import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

/**
 * OAuth callback. Exchanges the provider's code for a session and sets
 * the cookies that every other surface reads.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  const raw = searchParams.get('next') ?? '/app/market';
  // Relative paths only — an absolute URL here is an open redirect.
  const next = raw.startsWith('/') && !raw.startsWith('//') ? raw : '/app/market';

  if (!code) {
    return NextResponse.redirect(`${origin}/app/login?error=missing_code`);
  }

  const response = NextResponse.redirect(`${origin}${next}`);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (toSet) => {
          for (const { name, value, options } of toSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(`${origin}/app/login?error=${encodeURIComponent(error.message)}`);
  }

  return response;
}
