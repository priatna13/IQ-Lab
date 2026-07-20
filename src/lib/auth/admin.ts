import { getSessionUser, type SessionUser } from "@/lib/auth/session";

/**
 * Admin allowlist: comma-separated emails in ADMIN_EMAILS (server env).
 * Example: ADMIN_EMAILS=admin@iqlab.app,ops@example.com
 */
export function getAdminEmailAllowlist(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const list = getAdminEmailAllowlist();
  if (list.length === 0) return false;
  return list.includes(email.trim().toLowerCase());
}

export async function getAdminSessionUser(): Promise<SessionUser | null> {
  const user = await getSessionUser();
  if (!user || !isAdminEmail(user.email)) return null;
  return user;
}

export async function requireAdminSessionUser(): Promise<SessionUser> {
  const user = await getAdminSessionUser();
  if (!user) {
    throw new Error("FORBIDDEN_ADMIN");
  }
  return user;
}
