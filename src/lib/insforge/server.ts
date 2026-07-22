import { cache } from "react";
import { cookies } from "next/headers";
import {
  createAuthActions,
  createServerClient,
  refreshAuth,
} from "@insforge/sdk/ssr";
import { isAccessTokenUsable } from "@/lib/auth/jwt";

/**
 * Keep InsForge HTTP well under Vercel serverless budgets.
 * SDK defaults (30s × 3 retries) can hang RSC for ~90s and surface as
 * "Application error: a server-side exception" mid-stream.
 */
const INSFORGE_HTTP_TIMEOUT_MS = 4_000;
const INSFORGE_HTTP_RETRIES = 0;

const ACCESS_COOKIE = "insforge_access_token";
const REFRESH_COOKIE = "insforge_refresh_token";

type CookieJar = Awaited<ReturnType<typeof cookies>>;

/**
 * Ensure we have a non-expired access token for this request.
 * Server-mode SDK does not auto-refresh; without this, expired access + valid
 * refresh cookies pass middleware but RLS sees auth.uid()=null → empty rows →
 * thrown NOT_FOUND / E352 on pages that don't handle null.
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
    const controller = new AbortController();
    const timer = setTimeout(
      () => controller.abort(),
      INSFORGE_HTTP_TIMEOUT_MS,
    );
    const result = await refreshAuth({
      cookies: jar,
      refreshToken: refresh,
      fetch: (input, init) =>
        fetch(input, { ...init, signal: controller.signal }),
    }).finally(() => clearTimeout(timer));

    if (!result.accessToken) {
      return undefined;
    }

    // Server Actions / Route Handlers can write cookies; RSC cannot.
    // Always use the fresh token for this request even if set() throws.
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
      // ignore non-writable cookie store (Server Components)
    }

    return result.accessToken;
  } catch {
    return undefined;
  }
}

/**
 * One InsForge client per server request (React cache).
 * Ensures access token is refreshed before auth/database calls so
 * participant_id RLS (auth.uid()) stays in sync with the session user.
 */
export const createInsForgeServerClient = cache(async () => {
  const jar = await cookies();
  const accessToken = await resolveAccessToken(jar);

  return createServerClient({
    cookies: jar,
    // Always pass a defined string so createServerClient does not fall back to a
    // stale/expired access cookie (undefined triggers cookie read via ??).
    // Empty string → no user JWT → auth.uid() null → RLS empty (handled as 404).
    accessToken: accessToken ?? "",
    timeout: INSFORGE_HTTP_TIMEOUT_MS,
    retryCount: INSFORGE_HTTP_RETRIES,
  });
});

export async function createInsForgeAuthActions() {
  const jar = await cookies();
  // Login/signup write cookies; still pass timeout budgets.
  return createAuthActions({
    cookies: jar,
    timeout: INSFORGE_HTTP_TIMEOUT_MS,
    retryCount: INSFORGE_HTTP_RETRIES,
  });
}
