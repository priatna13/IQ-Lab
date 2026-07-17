import { describe, expect, it } from "vitest";
import { completeAttempt, getResultSnapshotForAttempt } from "./complete-attempt";
import { createAttempt } from "./create-attempt";
import { createSeedContentCatalog } from "./content-catalog";
import { MVP_CONTENT_VERSION_ID } from "./content-seed";
import {
  earlyFinishDomainSession,
  startDomainSession,
  upsertResponse,
} from "./domain-session";
import { NORM_VERSION_SYNTHETIC_V1 } from "./scoring";
import { toPublicResultReport } from "./result-types";
import type { AssessmentPorts } from "./ports";
import { createFixedClock } from "./testing/fixed-clock";
import { createInMemoryAttemptRepository } from "./testing/in-memory-attempts";
import {
  createInMemoryDomainSessionRepository,
  createInMemoryResponseRepository,
} from "./testing/in-memory-sessions";
import { createInMemoryResultSnapshotRepository } from "./testing/in-memory-snapshots";
import { createInMemoryNormSampleRepository } from "./testing/in-memory-norm-samples";

function buildPorts(): AssessmentPorts {
  return {
    clock: createFixedClock("2026-07-17T15:00:00.000Z"),
    attempts: createInMemoryAttemptRepository(),
    content: createSeedContentCatalog(),
    domainSessions: createInMemoryDomainSessionRepository(),
    responses: createInMemoryResponseRepository(),
    resultSnapshots: createInMemoryResultSnapshotRepository(),
    normSamples: createInMemoryNormSampleRepository(),
  };
}

async function finishAllDomains(ports: AssessmentPorts, attemptId: string) {
  const cv = await ports.content.getById(MVP_CONTENT_VERSION_ID);
  for (const domainId of cv!.domainOrder) {
    const session = await startDomainSession(ports, {
      attemptId,
      participantId: "p_1",
      domainId,
    });
    const domain = cv!.domains.find((d) => d.id === domainId)!;
    for (const item of domain.items) {
      await upsertResponse(ports, {
        sessionId: session.id,
        participantId: "p_1",
        itemId: item.id,
        answer: item.correctKey,
      });
    }
    await earlyFinishDomainSession(ports, {
      sessionId: session.id,
      participantId: "p_1",
    });
  }
}

describe("completeAttempt → Result Snapshot", () => {
  it("rejects complete while a Domain remains open", async () => {
    const ports = buildPorts();
    const attempt = await createAttempt(ports, {
      participant: { id: "p_1", ageBand: "18_45" },
      track: "explore",
    });
    const cv = await ports.content.getById(MVP_CONTENT_VERSION_ID);
    await startDomainSession(ports, {
      attemptId: attempt.id,
      participantId: "p_1",
      domainId: cv!.domainOrder[0],
    });

    await expect(
      completeAttempt(ports, {
        attemptId: attempt.id,
        participantId: "p_1",
        ageBand: "18_45",
      }),
    ).rejects.toMatchObject({ code: "INVALID_STATE" });
  });

  it("completes after nine closed Domains with frozen snapshot scores", async () => {
    const ports = buildPorts();
    const attempt = await createAttempt(ports, {
      participant: { id: "p_1", ageBand: "18_45" },
      track: "career",
    });

    await finishAllDomains(ports, attempt.id);

    const { attempt: completed, snapshot } = await completeAttempt(ports, {
      attemptId: attempt.id,
      participantId: "p_1",
      ageBand: "18_45",
    });

    expect(completed.status).toBe("completed");
    expect(completed.completedAt?.toISOString()).toBe(
      "2026-07-17T15:00:00.000Z",
    );
    expect(completed.isPrimary).toBe(true);

    expect(snapshot.normVersion).toBe(NORM_VERSION_SYNTHETIC_V1);
    expect(snapshot.track).toBe("career");
    expect(snapshot.contentVersionId).toBe(MVP_CONTENT_VERSION_ID);
    expect(snapshot.abilityProfile).toHaveLength(9);
    expect(snapshot.abilityProfile.every((e) => e.score === 100)).toBe(true);
    expect(snapshot.compositeIndex).toBe(100);
    expect(snapshot.iqEstimate).toBe(145); // 100+(100-50)=150, clamped 55–145

    const report = toPublicResultReport(snapshot);
    expect(report.labels.normBadge).toContain("norma sementara");
    expect(report.labels.iqEstimate).toContain("Estimasi IQ");

    // Immutable: second complete returns same snapshot, no rescore mutation of scores
    const again = await completeAttempt(ports, {
      attemptId: attempt.id,
      participantId: "p_1",
      ageBand: "18_45",
    });
    expect(again.snapshot.id).toBe(snapshot.id);
    expect(again.snapshot.compositeIndex).toBe(snapshot.compositeIndex);

    const loaded = await getResultSnapshotForAttempt(ports, {
      attemptId: attempt.id,
      participantId: "p_1",
    });
    expect(loaded?.id).toBe(snapshot.id);
  });
});
