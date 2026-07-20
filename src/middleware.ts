import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@insforge/sdk/ssr/middleware";

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/onboarding",
  "/asesmen",
  "/admin",
];

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request });

  await updateSession({
    // Next.js RequestCookies / ResponseCookies are structurally compatible at runtime.
    requestCookies: request.cookies as never,
    responseCookies: response.cookies as never,
  });

  const path = request.nextUrl.pathname;
  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`),
  );

  if (isProtected) {
    const access = request.cookies.get("insforge_access_token")?.value;
    const refresh = request.cookies.get("insforge_refresh_token")?.value;
    if (!access && !refresh) {
      const login = new URL("/masuk", request.url);
      login.searchParams.set("next", path);
      return NextResponse.redirect(login);
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
