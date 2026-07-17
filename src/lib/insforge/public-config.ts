/**
 * Browser-safe InsForge configuration.
 * Never put API keys or admin credentials here.
 */

export type InsForgePublicConfig = {
  url: string;
  anonKey: string;
  isConfigured: boolean;
};

export function getInsForgePublicConfig(): InsForgePublicConfig {
  const url = process.env.NEXT_PUBLIC_INSFORGE_URL?.trim() ?? "";
  const anonKey = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY?.trim() ?? "";
  const isConfigured = url.length > 0 && anonKey.length > 0;

  return { url, anonKey, isConfigured };
}
