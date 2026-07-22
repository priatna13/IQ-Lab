import { NextResponse, type NextRequest } from "next/server";

/**
 * Cookie-only gate. No InsForge SDK / network in Edge middleware.
 * Session refresh happens in Node server code (getSessionUser / login actions).
 * This avoids MIDDLEWARE_INVOCATION_TIMEOUT and edge SDK crashes.
 */
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/onboarding",
  "/asesmen",
  "/admin",
];

const ACCESS_COOKIE = "insforge_access_token";
const REFRESH_COOKIE = "insforge_refresh_token";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`),
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  const access = request.cookies.get(ACCESS_COOKIE)?.value;
  const refresh = request.cookies.get(REFRESH_COOKIE)?.value;
  if (!access && !refresh) {
    const login = new URL("/masuk", request.url);
    login.searchParams.set("next", path);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Only run on app pages that may need a session gate.
     * Skip static assets and pure marketing to minimize edge work.
     */
    "/dashboard/:path*",
    "/onboarding/:path*",
    "/asesmen/:path*",
    "/admin/:path*",
  ],
};
