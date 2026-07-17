import { createInsForgeServerClient } from "@/lib/insforge/server";
import {
  AGE_BAND_PROFILE_KEY,
  parseAgeBand,
} from "@/domain/participant/age-band";
import type { AgeBand } from "@/domain/assessment/types";

export type SessionUser = {
  id: string;
  email: string | null;
  name: string | null;
  ageBand: AgeBand | null;
};

export async function getSessionUser(): Promise<SessionUser | null> {
  const client = await createInsForgeServerClient();
  const { data, error } = await client.auth.getCurrentUser();

  if (error || !data?.user) {
    return null;
  }

  const user = data.user;
  const profile = user.profile as Record<string, unknown> | null | undefined;
  const metadata = user.metadata as Record<string, unknown> | null | undefined;

  const ageBand =
    parseAgeBand(profile?.[AGE_BAND_PROFILE_KEY]) ??
    parseAgeBand(metadata?.[AGE_BAND_PROFILE_KEY]) ??
    null;

  return {
    id: user.id,
    email: user.email ?? null,
    name:
      (typeof profile?.name === "string" ? profile.name : null) ??
      (typeof user.email === "string" ? user.email : null),
    ageBand,
  };
}

export async function requireSessionUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("UNAUTHENTICATED");
  }
  return user;
}
