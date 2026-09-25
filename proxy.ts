import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const CANONICAL_HOST = "ziromarket.com";

// Hosts allowed to serve this site directly. Everything else — internal
// subdomains like admin.ziromarket.com / staging.ziromarket.com, or any
// unknown domain pointed at this deployment — gets redirected to the main site.
const ALLOWED_HOSTS = new Set([CANONICAL_HOST, `www.${CANONICAL_HOST}`]);

// `host` is already normalized (lowercased, port + trailing dot stripped).
function isAllowedHost(host: string): boolean {
  if (ALLOWED_HOSTS.has(host)) return true;
  // Local development
  if (host === "localhost" || host === "127.0.0.1") return true;
  // Vercel preview / deployment URLs (suffix match is safe: attacker-owned
  // "...fakevercel.app" does not end in the literal ".vercel.app").
  if (host.endsWith(".vercel.app")) return true;
  return false;
}

function normalizeHost(raw: string): string {
  return raw
    .toLowerCase()
    .split(",")[0] // first value if Host header is comma-joined
    .trim()
    .replace(/\.$/, "") // strip FQDN trailing dot: "ziromarket.com." -> "ziromarket.com"
    .split(":")[0]; // strip port
}

// Signed-in surfaces. Everything else — marketing, blog, /stocks,
// /app/market, /app/discover — stays readable without an account.
const PROTECTED = ["/app/watchlist", "/app/portfolio", "/app/paper", "/app/alerts"];

/**
 * Refresh the Supabase session and gate the private surfaces.
 *
 * Refreshing has to happen here rather than in a Server Component,
 * because only middleware can write the rotated cookies back.
 */
async function withAuth(req: NextRequest): Promise<NextResponse> {
  const response = NextResponse.next();
  const path = req.nextUrl.pathname;

  const needsAuth = PROTECTED.some((p) => path === p || path.startsWith(`${p}/`));
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Without configuration there is no session to read. Gating the
  // surfaces anyway would lock everyone out of a misconfigured deploy
  // with no way to tell why.
  if (!url || !key) return response;

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => req.cookies.getAll(),
      setAll: (toSet) => {
        for (const { name, value, options } of toSet) response.cookies.set(name, value, options);
      },
    },
  });

  const { data } = await supabase.auth.getUser();

  if (needsAuth && !data.user) {
    const login = new URL("/app/login", req.url);
    // Carry the destination so sign-in lands where they were going.
    login.searchParams.set("next", path + req.nextUrl.search);
    return NextResponse.redirect(login);
  }

  return response;
}

/**
 * Catch an OAuth code that landed on the wrong path.
 *
 * Supabase only honours a `redirect_to` that matches its configured
 * Redirect URLs allowlist. When it does not match, Supabase silently
 * falls back to the project's **Site URL** — so the browser arrives at
 * `https://ziromarket.com/?code=…` instead of `/auth/callback?code=…`,
 * the code is never exchanged, and sign-in appears to do nothing.
 *
 * Rather than depend on dashboard configuration being right, any request
 * carrying `?code=` outside the callback route is forwarded to the
 * handler with the code intact. Sign-in then works whatever the Site URL
 * is set to.
 *
 * `next` is preserved when present so the user still lands where they
 * were going.
 */
function rescueOAuthCode(req: NextRequest): NextResponse | null {
  const { pathname, searchParams } = req.nextUrl;

  if (pathname === "/auth/callback") return null;

  const code = searchParams.get("code");
  if (!code) return null;

  // PKCE codes are UUID-shaped. Requiring that keeps an unrelated `code`
  // query param — a coupon code, a referral code — from being dragged
  // into the auth flow.
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(code)) return null;

  const callback = new URL("/auth/callback", req.url);
  callback.searchParams.set("code", code);

  const next = searchParams.get("next");
  if (next && next.startsWith("/") && !next.startsWith("//")) {
    callback.searchParams.set("next", next);
  }

  return NextResponse.redirect(callback);
}

export async function proxy(req: NextRequest) {
  const host = normalizeHost(req.headers.get("host") ?? "");

  if (!host || isAllowedHost(host)) {
    // Before anything else: an auth code in the URL is the user mid
    // sign-in, and must not be lost to a gate or a rewrite.
    const rescued = rescueOAuthCode(req);
    if (rescued) return rescued;

    return withAuth(req);
  }

  // Non-canonical host: send to the homepage of the main site. We drop the
  // original path so internal admin routes are never forwarded or exposed.
  const url = new URL("/", `https://${CANONICAL_HOST}`);
  return NextResponse.redirect(url, 308);
}

export const config = {
  // Run on all routes except Next internals and static files.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
