/**
 * Safe internal post-auth redirect path.
 * Rejects open redirects (protocol-relative, absolute URLs, empty).
 */
export function parseSafeNextPath(
  raw: string | null | undefined,
): string | null {
  if (raw == null) return null;
  const next = raw.trim();
  if (!next.startsWith("/") || next.startsWith("//")) return null;
  if (next.includes("://")) return null;
  // Block backslash tricks and control chars
  if (next.includes("\\") || /[\u0000-\u001f]/.test(next)) return null;
  return next;
}

/** Cookie holding post-OAuth destination (short-lived, set before leaving site). */
export const AUTH_NEXT_COOKIE = "iq_lab_auth_next";

export function authNextCookieOptions(isProd: boolean) {
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 600,
  };
}
