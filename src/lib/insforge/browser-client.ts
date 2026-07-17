import { createClient, type InsForgeClient } from "@insforge/sdk";
import { getInsForgePublicConfig } from "./public-config";

let browserClient: InsForgeClient | null = null;

/** Anon SDK client for browser / public use. */
export function getInsForgeBrowserClient(): InsForgeClient {
  const config = getInsForgePublicConfig();
  if (!config.isConfigured) {
    throw new Error(
      "InsForge public config missing. Set NEXT_PUBLIC_INSFORGE_URL and NEXT_PUBLIC_INSFORGE_ANON_KEY.",
    );
  }

  if (!browserClient) {
    browserClient = createClient({
      baseUrl: config.url,
      anonKey: config.anonKey,
    });
  }

  return browserClient;
}
