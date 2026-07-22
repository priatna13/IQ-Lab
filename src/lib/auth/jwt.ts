/**
 * Minimal JWT helpers for SSR session hygiene.
 * Does not verify signature — only reads exp to decide whether to refresh.
 */

function base64UrlToJson(part: string): Record<string, unknown> | null {
  try {
    const padded = part.replace(/-/g, "+").replace(/_/g, "/");
    const padLen = (4 - (padded.length % 4)) % 4;
    const b64 = padded + "=".repeat(padLen);
    const json =
      typeof atob === "function"
        ? atob(b64)
        : Buffer.from(b64, "base64").toString("utf8");
    const parsed = JSON.parse(json) as unknown;
    return parsed && typeof parsed === "object"
      ? (parsed as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}

/** Unix exp claim, or null if missing/unreadable. */
export function getJwtExpSeconds(token: string): number | null {
  const part = token.split(".")[1];
  if (!part) return null;
  const payload = base64UrlToJson(part);
  const exp = payload?.exp;
  return typeof exp === "number" && Number.isFinite(exp) ? exp : null;
}

/**
 * True when token is present and either has no exp claim or is not near expiry.
 * @param leewaySeconds treat as expired this many seconds before real exp
 */
export function isAccessTokenUsable(
  token: string | null | undefined,
  leewaySeconds = 60,
): boolean {
  if (!token || token.length < 20) return false;
  const exp = getJwtExpSeconds(token);
  if (exp == null) {
    // Opaque or non-JWT — still try it; refresh path handles 401.
    return true;
  }
  const now = Math.floor(Date.now() / 1000);
  return exp > now + leewaySeconds;
}

export function readJwtSub(token: string | null | undefined): string | null {
  if (!token) return null;
  const part = token.split(".")[1];
  if (!part) return null;
  const payload = base64UrlToJson(part);
  const sub = payload?.sub;
  return typeof sub === "string" && sub.length > 0 ? sub : null;
}
