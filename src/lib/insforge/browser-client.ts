import { createBrowserClient } from "@insforge/sdk/ssr";

/** Browser client (read-only auth surface). Auth mutations use Server Actions. */
export function getInsForgeBrowserClient() {
  return createBrowserClient();
}
