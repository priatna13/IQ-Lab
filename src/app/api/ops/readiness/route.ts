import { NextResponse } from "next/server";
import {
  CURRENT_CONTENT_VERSION_ID,
  createSeedContentCatalog,
} from "@/domain/assessment";
import {
  getOpenRouterChatModel,
  isOpenRouterConfigured,
} from "@/lib/assessment/openrouter-config";
import { isAnalyticsConfigured } from "@/lib/analytics/track";

/**
 * Soft-launch readiness (no secrets). Safe to expose in internal staging.
 * Does not call external networks.
 */
export async function GET() {
  const catalog = createSeedContentCatalog();
  const published = await catalog.getPublished();

  const insforgeUrl = Boolean(
    process.env.NEXT_PUBLIC_INSFORGE_URL?.trim() ||
      process.env.INSFORGE_URL?.trim(),
  );
  const anonKey = Boolean(process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY?.trim());
  const apiKey = Boolean(process.env.INSFORGE_API_KEY?.trim());
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim() || null;
  const openRouter = isOpenRouterConfigured();

  const checks = {
    insforgeUrlConfigured: insforgeUrl,
    anonKeyConfigured: anonKey,
    apiKeyConfigured: apiKey,
    appUrlConfigured: Boolean(appUrl),
    publishedContentVersion: published?.id ?? null,
    publishedIsCurrentV3: published?.id === CURRENT_CONTENT_VERSION_ID,
    openRouterConfigured: openRouter,
    openRouterModel: openRouter ? getOpenRouterChatModel() : null,
    insightMode: openRouter ? ("llm_or_template_fallback" as const) : ("template_only" as const),
    analyticsConfigured: isAnalyticsConfigured(),
    reportPdfBucket: "reports",
  };

  const requiredOk =
    checks.insforgeUrlConfigured &&
    checks.anonKeyConfigured &&
    checks.apiKeyConfigured &&
    checks.publishedIsCurrentV3;

  const body = {
    ok: requiredOk,
    softLaunch: {
      required: requiredOk,
      recommendedGoogleOAuth: "enable in InsForge dashboard (ops A1)",
      recommendedOpenRouter: openRouter
        ? "configured"
        : "optional — template insight used until OPENROUTER_API_KEY is set",
      emailVerification:
        "controlled by insforge.toml require_email_verification (default false for local MVP)",
    },
    checks,
    docs: "/docs/SOFT-LAUNCH-OPS.md",
  };

  return NextResponse.json(body, {
    status: requiredOk ? 200 : 503,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
