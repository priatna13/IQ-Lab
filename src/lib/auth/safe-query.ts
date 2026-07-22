/** Safe decode for query values — malformed % sequences must not crash the page. */
export function safeDecodeURIComponent(raw: string | undefined | null): string | null {
  if (raw == null || raw === "") return null;
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}
