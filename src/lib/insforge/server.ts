import { cache } from "react";
import { cookies } from "next/headers";
import {
  createAuthActions,
  createServerClient,
  refreshAuth,
} from "@insforge/sdk/ssr";
import { isAccessTokenUsable } from "@/lib/auth/jwt";

/**
 * Keep InsForge HTTP under serverless budgets, but allow enough headroom
 * for free/nano cold starts (4s was aborting valid refreshes).
 */
const INSFORGE_HTTP_TIMEOUT_MS = 8_000;
const INSFORGE_HTTP_RETRIES = 0;

const ACCESS_COOKIE = "insforge_access_token";
const REFRESH_COOKIE = "insforge_refresh_token";

type CookieJar = Awaited<ReturnType<typeof cookies>>;

async function timedFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), INSFORGE_HTTP_TIMEOUT_MS);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Ensure we have a non-expired access token for this request.
 * Server-mode SDK does not auto-refresh.
 */
async function resolveAccessToken(jar: CookieJar): Promise<string | undefined> {
  const access = jar.get(ACCESS_COOKIE)?.value ?? null;
  const refresh = jar.get(REFRESH_COOKIE)?.value ?? null;

  if (isAccessTokenUsable(access)) {
    return access ?? undefined;
  }

  if (!refresh) {
    return undefined;
  }

  try {
    const result = await refreshAuth({
      cookies: jar,
      refreshToken: refresh,
      fetch: timedFetch,
    });

    if (!result.accessToken) {
      return undefined;
    }

    try {
      jar.set(ACCESS_COOKIE, result.accessToken, {
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        httpOnly: false,
      });
      const nextRefresh = result.refreshToken ?? refresh;
      if (nextRefresh) {
        jar.set(REFRESH_COOKIE, nextRefresh, {
          path: "/",
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          httpOnly: true,
        });
      }
    } catch {
      // RSC may not allow cookie writes
    }

    return result.accessToken;
  } catch {
    return undefined;
  }
}

/**
 * One InsForge client per server request (React cache).
 * Prefer ensureServerAuthSession() on protected assessment pages so
 * getCurrentUser() runs before DB; this client shares the refreshed token.
 */
export const createInsForgeServerClient = cache(async () => {
  const jar = await cookies();
  const accessToken = await resolveAccessToken(jar);

  const baseUrl = (
    process.env.NEXT_PUBLIC_INSFORGE_URL ||
    process.env.INSFORGE_URL ||
    ""
  ).replace(/\/$/, "");
  const anonKey = (process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY || "").trim();

  if (!baseUrl || !anonKey) {
    throw new Error(
      "AUTH_ENV_MISSING: NEXT_PUBLIC_INSFORGE_URL / NEXT_PUBLIC_INSFORGE_ANON_KEY required",
    );
  }

  return createServerClient({
    baseUrl,
    anonKey,
    cookies: jar,
    // Defined string prevents fall-back to a stale access cookie.
    accessToken: accessToken ?? "",
    timeout: INSFORGE_HTTP_TIMEOUT_MS,
    retryCount: INSFORGE_HTTP_RETRIES,
  });
});

export async function createInsForgeAuthActions() {
  const jar = await cookies();
  return createAuthActions({
    cookies: jar,
    timeout: INSFORGE_HTTP_TIMEOUT_MS,
    retryCount: INSFORGE_HTTP_RETRIES,
  });
}
