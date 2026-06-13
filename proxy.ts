import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

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

export function proxy(req: NextRequest) {
  const host = normalizeHost(req.headers.get("host") ?? "");
  if (!host || isAllowedHost(host)) return NextResponse.next();

  // Non-canonical host: send to the homepage of the main site. We drop the
  // original path so internal admin routes are never forwarded or exposed.
  const url = new URL("/", `https://${CANONICAL_HOST}`);
  return NextResponse.redirect(url, 308);
}

export const config = {
  // Run on all routes except Next internals and static files.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
