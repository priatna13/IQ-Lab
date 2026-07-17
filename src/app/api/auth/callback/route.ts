import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { createAuthActions } from "@insforge/sdk/ssr";

/**
 * OAuth callback: establish session cookies, then send Participant through
 * Age Band onboarding (which redirects to dashboard if already complete).
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

  const response = NextResponse.redirect(
    new URL("/onboarding/usia", request.url),
  );
  const auth = createAuthActions({
    requestCookies: request.cookies,
    responseCookies: response.cookies,
  });

  const { error } = await auth.exchangeOAuthCode(code, codeVerifier);
  if (error) {
    return NextResponse.redirect(
      new URL("/masuk?error=exchange_failed", request.url),
    );
  }

  response.cookies.delete("insforge_code_verifier");
  return response;
}
