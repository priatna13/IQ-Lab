import { cache } from "react";
import { cookies } from "next/headers";
import type { InsForgeClient } from "@insforge/sdk";
import { createInsForgeServerClient } from "@/lib/insforge/server";
import { readJwtSub } from "@/lib/auth/jwt";
import {
  AGE_BAND_PROFILE_KEY,
  parseAgeBand,
} from "@/domain/participant/age-band";
import type { AgeBand } from "@/domain/assessment/types";
import type { SessionUser } from "@/lib/auth/session";

const ACCESS_COOKIE = "insforge_access_token";
const REFRESH_COOKIE = "insforge_refresh_token";

export type EnsureSessionOk = {
  ok: true;
  user: SessionUser;
  client: InsForgeClient;
  accessToken: string | null;
  refreshed: boolean;
};

export type EnsureSessionFail = {
  ok: false;
  code:
    | "NO_SESSION_COOKIES"
    | "AUTH_SESSION_FAILED"
    | "AUTH_NO_USER_ID"
    | "AUTH_UNEXPECTED";
  message: string;
  detail?: string;
};

export type EnsureSessionResult = EnsureSessionOk | EnsureSessionFail;

function mapUser(
  user: {
    id?: string;
    email?: string | null;
    profile?: unknown;
    metadata?: unknown;
  },
  accessToken: string | null,
): SessionUser | null {
  const profile = user.profile as Record<string, unknown> | null | undefined;
  const metadata = user.metadata as Record<string, unknown> | null | undefined;
  const id =
    (typeof user.id === "string" && user.id) ||
    readJwtSub(accessToken) ||
    null;
  if (!id) return null;

  const ageBand =
    parseAgeBand(profile?.[AGE_BAND_PROFILE_KEY]) ??
    parseAgeBand(metadata?.[AGE_BAND_PROFILE_KEY]) ??
    null;

  return {
    id,
    email: user.email ?? null,
    name:
      (typeof profile?.name === "string" ? profile.name : null) ??
      (typeof user.email === "string" ? user.email : null),
    ageBand,
  };
}

/**
 * ONE request-scoped session bootstrap (must complete before DB):
 * 1) createInsForgeServerClient — refreshes expired access JWT
 * 2) auth.getCurrentUser() — binds identity / re-applies Authorization header
 * 3) return user + same client used by assessment repositories
 *
 * Never parallelize this with attempt queries.
 */
export const ensureServerAuthSession = cache(
  async (): Promise<EnsureSessionResult> => {
    try {
      const jar = await cookies();
      const accessCookie = jar.get(ACCESS_COOKIE)?.value ?? null;
      const refreshCookie = jar.get(REFRESH_COOKIE)?.value ?? null;

      if (!accessCookie && !refreshCookie) {
        return {
          ok: false,
          code: "NO_SESSION_COOKIES",
          message: "NO_SESSION_COOKIES: belum login (tidak ada cookie sesi).",
        };
      }

      // Shared with repositories via React cache — token refresh lives here.
      const client = await createInsForgeServerClient();

      // Critical: wait for this BEFORE any database call on this request.
      const userResult = await client.auth.getCurrentUser();
      console.info("[AUTH] getCurrentUser", {
        hasUser: Boolean(userResult?.data?.user),
        userId: userResult?.data?.user?.id ?? null,
        error: userResult?.error?.message ?? null,
        hadAccessCookie: Boolean(accessCookie),
        hadRefreshCookie: Boolean(refreshCookie),
      });

      if (userResult.error || !userResult.data?.user) {
        return {
          ok: false,
          code: "AUTH_SESSION_FAILED",
          message: `AUTH_SESSION_FAILED: ${
            userResult.error?.message ?? "User tidak ditemukan dari sesi"
          }`,
          detail: `hadAccess=${Boolean(accessCookie)} hadRefresh=${Boolean(refreshCookie)}`,
        };
      }

      // Re-bind access token onto HTTP client for subsequent DB (same instance).
      const tokenFromCookie =
        jar.get(ACCESS_COOKIE)?.value ?? accessCookie ?? null;
      if (
        tokenFromCookie &&
        typeof (client as { setAccessToken?: (t: string) => void })
          .setAccessToken === "function"
      ) {
        (client as { setAccessToken: (t: string) => void }).setAccessToken(
          tokenFromCookie,
        );
      }

      const sessionUser = mapUser(
        userResult.data.user,
        tokenFromCookie,
      );
      if (!sessionUser) {
        return {
          ok: false,
          code: "AUTH_NO_USER_ID",
          message:
            "AUTH_NO_USER_ID: getCurrentUser sukses tapi id/sub kosong.",
        };
      }

      return {
        ok: true,
        user: sessionUser,
        client,
        accessToken: tokenFromCookie,
        // createInsForgeServerClient may have refreshed; expose signal for UI strip.
        refreshed: Boolean(refreshCookie && !accessCookie),
      };
    } catch (err) {
      return {
        ok: false,
        code: "AUTH_UNEXPECTED",
        message: `AUTH_UNEXPECTED: ${
          err instanceof Error ? err.message : String(err)
        }`,
        detail: err instanceof Error ? err.stack?.slice(0, 800) : undefined,
      };
    }
  },
);
