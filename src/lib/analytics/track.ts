/**
 * Lightweight product analytics (C2).
 * - Always no-ops safely if no provider configured.
 * - Optional PostHog capture via POSTHOG_KEY / NEXT_PUBLIC_POSTHOG_KEY.
 * - Optional webhook via ANALYTICS_WEBHOOK_URL (server only).
 * Never send PII (email, names, raw answers).
 */

export type AnalyticsEventName =
  | "signup_succeeded"
  | "sign_in_succeeded"
  | "attempt_started"
  | "domain_session_closed"
  | "attempt_completed"
  | "pdf_downloaded"
  | "pdf_stored"
  | "account_data_deleted";

export type AnalyticsProps = Record<
  string,
  string | number | boolean | null | undefined
>;

function posthogKey(): string | undefined {
  return (
    process.env.POSTHOG_KEY?.trim() ||
    process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim() ||
    undefined
  );
}

function posthogHost(): string {
  return (
    process.env.POSTHOG_HOST?.trim() ||
    process.env.NEXT_PUBLIC_POSTHOG_HOST?.trim() ||
    "https://us.i.posthog.com"
  );
}

/**
 * Fire-and-forget product event. Safe on server and edge.
 * Distinct id should be a stable opaque participant/user id when known.
 */
export function trackProductEvent(
  name: AnalyticsEventName,
  props: AnalyticsProps = {},
  options?: { distinctId?: string },
): void {
  const cleaned: Record<string, string | number | boolean | null> = {};
  for (const [k, v] of Object.entries(props)) {
    if (v === undefined) continue;
    cleaned[k] = v;
  }

  const payload = {
    event: name,
    properties: cleaned,
    distinctId: options?.distinctId ?? "anonymous",
    ts: new Date().toISOString(),
  };

  if (process.env.NODE_ENV !== "production") {
    console.info("[analytics]", payload.event, payload.properties);
  }

  // Do not await — never block product flows
  void dispatchPostHog(payload).catch(() => undefined);
  void dispatchWebhook(payload).catch(() => undefined);
}

async function dispatchPostHog(payload: {
  event: string;
  properties: Record<string, string | number | boolean | null>;
  distinctId: string;
  ts: string;
}): Promise<void> {
  const key = posthogKey();
  if (!key) return;

  const host = posthogHost().replace(/\/$/, "");
  await fetch(`${host}/capture/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: key,
      event: payload.event,
      distinct_id: payload.distinctId,
      properties: {
        ...payload.properties,
        $lib: "iq-lab-server",
        source: "iq-lab",
      },
      timestamp: payload.ts,
    }),
  });
}

async function dispatchWebhook(payload: {
  event: string;
  properties: Record<string, string | number | boolean | null>;
  distinctId: string;
  ts: string;
}): Promise<void> {
  const url = process.env.ANALYTICS_WEBHOOK_URL?.trim();
  if (!url) return;

  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function isAnalyticsConfigured(): boolean {
  return Boolean(posthogKey() || process.env.ANALYTICS_WEBHOOK_URL?.trim());
}
