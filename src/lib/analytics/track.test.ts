import { afterEach, describe, expect, it, vi } from "vitest";
import { isAnalyticsConfigured, trackProductEvent } from "./track";

describe("trackProductEvent", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("is not configured by default in test env", () => {
    vi.stubEnv("POSTHOG_KEY", "");
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_KEY", "");
    vi.stubEnv("ANALYTICS_WEBHOOK_URL", "");
    expect(isAnalyticsConfigured()).toBe(false);
  });

  it("logs in non-production without throwing", () => {
    const spy = vi.spyOn(console, "info").mockImplementation(() => undefined);
    trackProductEvent("attempt_started", { track: "explore" }, { distinctId: "p1" });
    expect(spy).toHaveBeenCalled();
  });

  it("posts to PostHog when key is set", async () => {
    vi.stubEnv("POSTHOG_KEY", "phc_test");
    vi.stubEnv("POSTHOG_HOST", "https://example.posthog.test");
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);

    trackProductEvent("signup_succeeded", {}, { distinctId: "u1" });
    // allow microtask
    await new Promise((r) => setTimeout(r, 10));

    expect(fetchMock).toHaveBeenCalled();
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain("example.posthog.test/capture");
    const body = JSON.parse(String(init.body)) as { event: string; distinct_id: string };
    expect(body.event).toBe("signup_succeeded");
    expect(body.distinct_id).toBe("u1");
  });
});
