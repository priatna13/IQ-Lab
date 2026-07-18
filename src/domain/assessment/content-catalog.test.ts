import { describe, expect, it } from "vitest";
import { createSeedContentCatalog } from "./content-catalog";
import { MVP_CONTENT_VERSION_ID } from "./content-seed";
import {
  CURRENT_CONTENT_VERSION_ID,
  V2_CONTENT_VERSION_ID,
} from "./content/v2";
import { startDomainSession, getDomainRunnerView } from "./domain-session";
import { createAttempt } from "./create-attempt";
import { createFixedClock } from "./testing/fixed-clock";
import { createInMemoryAttemptRepository } from "./testing/in-memory-attempts";
import {
  createInMemoryDomainSessionRepository,
  createInMemoryResponseRepository,
} from "./testing/in-memory-sessions";
import { createInMemoryResultSnapshotRepository } from "./testing/in-memory-snapshots";
import { createInMemoryNormSampleRepository } from "./testing/in-memory-norm-samples";
import { createInMemoryIntegrityEventRepository } from "./testing/in-memory-integrity";
import type { AssessmentPorts } from "./ports";

function buildPorts(): AssessmentPorts {
  return {
    clock: createFixedClock("2026-07-18T09:00:00.000Z"),
    attempts: createInMemoryAttemptRepository(),
    content: createSeedContentCatalog(),
    domainSessions: createInMemoryDomainSessionRepository(),
    responses: createInMemoryResponseRepository(),
    resultSnapshots: createInMemoryResultSnapshotRepository(),
    normSamples: createInMemoryNormSampleRepository(),
    integrityEvents: createInMemoryIntegrityEventRepository(),
  };
}

describe("Content catalog — Item Bank v2", () => {
  it("publishes only cv_mvp_v2", async () => {
    const catalog = createSeedContentCatalog();
    const published = await catalog.getPublished();
    expect(published?.id).toBe(V2_CONTENT_VERSION_ID);
    expect(published?.published).toBe(true);
    expect(published?.id).toBe(CURRENT_CONTENT_VERSION_ID);
  });

  it("keeps cv_mvp_v1 loadable but unpublished", async () => {
    const catalog = createSeedContentCatalog();
    const v1 = await catalog.getById(MVP_CONTENT_VERSION_ID);
    expect(v1).not.toBeNull();
    expect(v1?.published).toBe(false);
    expect(v1?.domains).toHaveLength(9);
  });

  it("rejects pinning unpublished v1 on new Attempt", async () => {
    const ports = buildPorts();
    await expect(
      createAttempt(ports, {
        participant: { id: "p1", ageBand: "18_45" },
        track: "explore",
        contentVersionId: MVP_CONTENT_VERSION_ID,
      }),
    ).rejects.toMatchObject({ code: "NOT_FOUND" });
  });

  it("v2 has 9 domains × 8 items with keys server-side only on full bank", async () => {
    const catalog = createSeedContentCatalog();
    const v2 = await catalog.getById(V2_CONTENT_VERSION_ID);
    expect(v2?.domainOrder).toHaveLength(9);
    expect(v2?.domains).toHaveLength(9);
    for (const domain of v2!.domains) {
      expect(domain.items).toHaveLength(8);
      for (const item of domain.items) {
        expect(item.correctKey).toMatch(/^[a-d]$/);
        expect(item.choices).toHaveLength(4);
        expect(item.prompt.length).toBeGreaterThan(5);
        expect(item.prompt).not.toMatch(/Soal latihan MVP/);
      }
    }
  });

  it("createAttempt pins published v2", async () => {
    const ports = buildPorts();
    const attempt = await createAttempt(ports, {
      participant: {
        id: "p1",
        ageBand: "18_45",
      },
      track: "explore",
    });
    expect(attempt.contentVersionId).toBe(V2_CONTENT_VERSION_ID);
  });

  it("public runner view never exposes correctKey", async () => {
    const ports = buildPorts();
    const attempt = await createAttempt(ports, {
      participant: { id: "p1", ageBand: "18_45" },
      track: "career",
    });
    const session = await startDomainSession(ports, {
      attemptId: attempt.id,
      participantId: "p1",
      domainId: "verbal_pemahaman",
    });
    const view = await getDomainRunnerView(ports, {
      sessionId: session.id,
      participantId: "p1",
    });
    const json = JSON.stringify(view);
    expect(json).not.toMatch(/correctKey/);
    expect(view.items.length).toBe(8);
  });
});
