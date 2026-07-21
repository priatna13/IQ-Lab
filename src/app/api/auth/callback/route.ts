import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { createAuthActions } from "@insforge/sdk/ssr";
import {
  AUTH_NEXT_COOKIE,
  parseSafeNextPath,
} from "@/lib/auth/safe-next-path";

/**
 * OAuth callback: establish session cookies, then route to Age Band onboarding
 * (or final destination when onboarding already done — handled on that page via ?next=).
 */
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("insforge_code");
  const oauthError = request.nextUrl.searchParams.get("error");

  if (oauthError || !code) {
    return NextResponse.redirect(
      new URL("/masuk?error=oauth_failed", request.url),
    );
  }

  const cookieStore = await cookies();
  const codeVerifier = cookieStore.get("insforge_code_verifier")?.value;
  if (!codeVerifier) {
    return NextResponse.redirect(
      new URL("/masuk?error=missing_verifier", request.url),
    );
  }

  const safeNext = parseSafeNextPath(
    cookieStore.get(AUTH_NEXT_COOKIE)?.value ??
      request.nextUrl.searchParams.get("next"),
  );

  const onboardingUrl = new URL("/onboarding/usia", request.url);
  if (safeNext) {
    onboardingUrl.searchParams.set("next", safeNext);
  }

  const response = NextResponse.redirect(onboardingUrl);
  const auth = createAuthActions({
    requestCookies: request.cookies,
    responseCookies: response.cookies,
  });

  const { error } = await auth.exchangeOAuthCode(code, codeVerifier);
  if (error) {
    const fail = new URL("/masuk", request.url);
    fail.searchParams.set("error", "exchange_failed");
    if (safeNext) fail.searchParams.set("next", safeNext);
    return NextResponse.redirect(fail);
  }

  response.cookies.delete("insforge_code_verifier");
  response.cookies.delete(AUTH_NEXT_COOKIE);
  return response;
}
