import { cookies } from "next/headers";
import { createAuthActions, createServerClient } from "@insforge/sdk/ssr";

export async function createInsForgeServerClient() {
  return createServerClient({
    cookies: await cookies(),
  });
}

export async function createInsForgeAuthActions() {
  return createAuthActions({
    cookies: await cookies(),
  });
}
