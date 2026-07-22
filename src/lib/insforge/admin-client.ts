import { createAdminClient, type InsForgeClient } from "@insforge/sdk";

/**
 * Privileged server-only client (bypasses RLS). Never import from client components.
 */
export function createInsForgeAdminClient(): InsForgeClient {
  const baseUrl = (
    process.env.INSFORGE_URL ||
    process.env.NEXT_PUBLIC_INSFORGE_URL ||
    ""
  ).replace(/\/$/, "");
  const apiKey = process.env.INSFORGE_API_KEY?.trim() || "";
  if (!baseUrl || !apiKey) {
    throw new Error(
      "Admin client requires INSFORGE_URL and INSFORGE_API_KEY (server-only).",
    );
  }
  return createAdminClient({
    baseUrl,
    apiKey,
    // Match SSR client budgets — avoid long serverless hangs.
    timeout: 4_000,
    retryCount: 0,
  });
}
