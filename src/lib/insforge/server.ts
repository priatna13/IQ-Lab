import { cache } from "react";
import { cookies } from "next/headers";
import { createAuthActions, createServerClient } from "@insforge/sdk/ssr";

/**
 * One InsForge client per server request (React cache).
 * Avoids re-reading cookies / re-constructing the client on every repo call
 * during hot paths like answer autosave.
 */
export const createInsForgeServerClient = cache(async () => {
  return createServerClient({
    cookies: await cookies(),
  });
});

export async function createInsForgeAuthActions() {
  return createAuthActions({
    cookies: await cookies(),
  });
}
