import { cache } from "react";
import { cookies } from "next/headers";
import { ensureServerAuthSession } from "@/lib/auth/ensure-session";
import type { AgeBand } from "@/domain/assessment/types";

export type SessionUser = {
  id: string;
  email: string | null;
  name: string | null;
  ageBand: AgeBand | null;
};

const ACCESS_COOKIE = "insforge_access_token";
const REFRESH_COOKIE = "insforge_refresh_token";

/**
 * Deduped per request. On pages with cookies, uses ensureServerAuthSession
 * (refresh → getCurrentUser) so JWT is ready before callers hit the database.
 */
export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  try {
    const jar = await cookies();
    const hasSession =
      Boolean(jar.get(ACCESS_COOKIE)?.value) ||
      Boolean(jar.get(REFRESH_COOKIE)?.value);

    // Anonymous: zero network (homepage must stay instant).
    if (!hasSession) {
      return null;
    }

    const session = await ensureServerAuthSession();
    if (!session.ok) {
      return null;
    }
    return session.user;
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
