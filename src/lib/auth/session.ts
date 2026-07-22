import { cache } from "react";
import { cookies } from "next/headers";
import { createInsForgeServerClient } from "@/lib/insforge/server";
import {
  AGE_BAND_PROFILE_KEY,
  parseAgeBand,
} from "@/domain/participant/age-band";
import type { AgeBand } from "@/domain/assessment/types";
import { readJwtSub } from "@/lib/auth/jwt";

export type SessionUser = {
  id: string;
  email: string | null;
  name: string | null;
  ageBand: AgeBand | null;
};

const ACCESS_COOKIE = "insforge_access_token";
const REFRESH_COOKIE = "insforge_refresh_token";

/**
 * Deduped per request so multi-step server actions do not re-hit auth.
 * Uses createInsForgeServerClient (which refreshes expired access tokens) so
 * user.id matches auth.uid() used by RLS on attempts / snapshots.
 */
export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  try {
    const jar = await cookies();
    const access = jar.get(ACCESS_COOKIE)?.value;
    const refresh = jar.get(REFRESH_COOKIE)?.value;
    const hasSession = Boolean(access) || Boolean(refresh);

    // Anonymous: zero network to InsForge (homepage must stay instant).
    if (!hasSession) {
      return null;
    }

    const client = await createInsForgeServerClient();
    const { data, error } = await client.auth.getCurrentUser();

    if (error || !data?.user) {
      return null;
    }

    const user = data.user;
    const profile = user.profile as Record<string, unknown> | null | undefined;
    const metadata = user.metadata as Record<string, unknown> | null | undefined;

    // Prefer API user id; fall back to JWT sub so we never invent an id.
    const id =
      (typeof user.id === "string" && user.id) ||
      readJwtSub(access) ||
      null;
    if (!id) {
      return null;
    }

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
  } catch {
    // Fail open as anonymous so marketing pages stay up when auth is slow/down.
    return null;
  }
});

export async function requireSessionUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("UNAUTHENTICATED");
  }
  return user;
}
