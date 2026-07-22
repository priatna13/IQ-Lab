import { cache } from "react";
import { cookies } from "next/headers";
import { createAuthActions, createServerClient } from "@insforge/sdk/ssr";

/**
 * Keep InsForge HTTP well under Vercel serverless budgets.
 * SDK defaults (30s × 3 retries) can hang RSC for ~90s and surface as
 * "Application error: a server-side exception" mid-stream.
 */
const INSFORGE_HTTP_TIMEOUT_MS = 4_000;
const INSFORGE_HTTP_RETRIES = 0;

/**
 * One InsForge client per server request (React cache).
 * Avoids re-reading cookies / re-constructing the client on every repo call
 * during hot paths like answer autosave.
 */
export const createInsForgeServerClient = cache(async () => {
  return createServerClient({
    cookies: await cookies(),
    timeout: INSFORGE_HTTP_TIMEOUT_MS,
    retryCount: INSFORGE_HTTP_RETRIES,
  });
});

export async function createInsForgeAuthActions() {
  return createAuthActions({
    cookies: await cookies(),
    timeout: INSFORGE_HTTP_TIMEOUT_MS,
    retryCount: INSFORGE_HTTP_RETRIES,
  });
}
