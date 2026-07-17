import { describe, expect, it } from "vitest";
import { createAttempt, getOpenAttempt } from "./create-attempt";
import { createSeedContentCatalog } from "./content-catalog";
import { toPublicContentVersion } from "./content-types";
import { MVP_CONTENT_VERSION_ID } from "./content-seed";
import { AssessmentError } from "./types";
import { createFixedClock } from "./testing/fixed-clock";
import { createInMemoryAttemptRepository } from "./testing/in-memory-attempts";
import type { AssessmentPorts } from "./ports";

function buildPorts(): AssessmentPorts {
  return {
    clock: createFixedClock("2026-07-17T12:00:00.000Z"),
    attempts: createInMemoryAttemptRepository(),
    content: createSeedContentCatalog(),
  };
}

describe("Assessment application boundary — createAttempt", () => {
  it("rejects creating an Attempt without an authenticated Participant", async () => {
    const ports = buildPorts();

    await expect(
      createAttempt(ports, {
        participant: null,
        track: "explore",
      }),
    ).rejects.toMatchObject({
      name: "AssessmentError",
      code: "UNAUTHENTICATED",
    });

    await expect(
      createAttempt(ports, {
        participant: null,
        track: "explore",
      }),
    ).rejects.toBeInstanceOf(AssessmentError);
  });

  it("creates an Open Attempt pinning Track and published Content Version", async () => {
    const ports = buildPorts();

    const attempt = await createAttempt(ports, {
      participant: { id: "p_1", ageBand: "18_45" },
      track: "career",
    });

    expect(attempt.status).toBe("in_progress");
    expect(attempt.participantId).toBe("p_1");
    expect(attempt.track).toBe("career");
    expect(attempt.contentVersionId).toBe(MVP_CONTENT_VERSION_ID);
    expect(attempt.startedAt.toISOString()).toBe("2026-07-17T12:00:00.000Z");
    expect(attempt.isPrimary).toBe(false);

    const open = await getOpenAttempt(ports, "p_1");
    expect(open?.id).toBe(attempt.id);
    expect(open?.contentVersionId).toBe(MVP_CONTENT_VERSION_ID);
  });

  it("pins an explicit Content Version id when it exists and is published", async () => {
    const ports = buildPorts();

    const attempt = await createAttempt(ports, {
      participant: { id: "p_2", ageBand: "46_plus" },
      track: "explore",
      contentVersionId: MVP_CONTENT_VERSION_ID,
    });

    expect(attempt.contentVersionId).toBe(MVP_CONTENT_VERSION_ID);
    expect(attempt.track).toBe("explore");
  });

  it("rejects unknown Content Version", async () => {
    const ports = buildPorts();

    await expect(
      createAttempt(ports, {
        participant: { id: "p_3", ageBand: "18_45" },
        track: "explore",
        contentVersionId: "cv_does_not_exist",
      }),
    ).rejects.toMatchObject({ code: "NOT_FOUND" });
  });

  it("rejects a second Open Attempt for the same Participant", async () => {
    const ports = buildPorts();
    const input = {
      participant: { id: "p_1" as const, ageBand: "18_45" as const },
      track: "explore" as const,
    };

    await createAttempt(ports, input);

    await expect(createAttempt(ports, input)).rejects.toMatchObject({
      code: "OPEN_ATTEMPT_EXISTS",
    });
  });

  it("exposes public Content Version without correctKey fields", async () => {
    const ports = buildPorts();
    const cv = await ports.content.getPublished();
    expect(cv).not.toBeNull();
    expect(cv!.domainOrder).toHaveLength(9);
    expect(cv!.domains).toHaveLength(9);
    for (const domain of cv!.domains) {
      expect(domain.items.length).toBeGreaterThanOrEqual(8);
      expect(domain.items.length).toBeLessThanOrEqual(12);
    }

    const pub = toPublicContentVersion(cv!);
    const serialized = JSON.stringify(pub);
    expect(serialized).not.toContain("correctKey");
    expect(pub.domains.every((d) => d.itemCount >= 8)).toBe(true);
    // Public shape has no items array with keys
    expect(
      pub.domains.every(
        (d) => !("items" in d) || (d as { items?: unknown }).items === undefined,
      ),
    ).toBe(true);
  });
});
