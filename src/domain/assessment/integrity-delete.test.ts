import { describe, expect, it } from "vitest";
import { completeAttempt } from "./complete-attempt";
import { createAttempt, getOpenAttempt } from "./create-attempt";
import { deleteParticipantAssessmentData } from "./delete-participant-data";
import { createSeedContentCatalog } from "./content-catalog";
import { MVP_CONTENT_VERSION_ID } from "./content-seed";
import {
  earlyFinishDomainSession,
  startDomainSession,
  upsertResponse,
} from "./domain-session";
import { recordIntegrityEvent } from "./integrity";
import { INTEGRITY_POLICY } from "./integrity-types";
import type { AssessmentPorts } from "./ports";
import { createFixedClock } from "./testing/fixed-clock";
import { createInMemoryAttemptRepository } from "./testing/in-memory-attempts";
import {
  createInMemoryDomainSessionRepository,
  createInMemoryResponseRepository,
} from "./testing/in-memory-sessions";
import { createInMemoryIntegrityEventRepository } from "./testing/in-memory-integrity";
import { createInMemoryNormSampleRepository } from "./testing/in-memory-norm-samples";
import { createInMemoryResultSnapshotRepository } from "./testing/in-memory-snapshots";

function buildPorts(): AssessmentPorts & {
  samples: ReturnType<typeof createInMemoryNormSampleRepository>;
  integrity: ReturnType<typeof createInMemoryIntegrityEventRepository>;
} {
  const samples = createInMemoryNormSampleRepository();
  const integrity = createInMemoryIntegrityEventRepository();
  return {
    clock: createFixedClock("2026-07-17T18:00:00.000Z"),
    attempts: createInMemoryAttemptRepository(),
    content: createSeedContentCatalog(),
    domainSessions: createInMemoryDomainSessionRepository(),
    responses: createInMemoryResponseRepository(),
    resultSnapshots: createInMemoryResultSnapshotRepository(),
    normSamples: samples,
    integrityEvents: integrity,
    samples,
    integrity,
  };
}

async function finishAll(ports: AssessmentPorts, attemptId: string) {
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

describe("Integrity Events", () => {
  it("records blur without invalidating Attempt or blocking complete", async () => {
    expect(INTEGRITY_POLICY.autoInvalidateAttempt).toBe(false);
    expect(INTEGRITY_POLICY.excludesNormSample).toBe(false);

    const ports = buildPorts();
    const attempt = await createAttempt(ports, {
      participant: { id: "p_1", ageBand: "18_45" },
      track: "explore",
    });
    const cv = await ports.content.getById(MVP_CONTENT_VERSION_ID);
    const session = await startDomainSession(ports, {
      attemptId: attempt.id,
      participantId: "p_1",
      domainId: cv!.domainOrder[0],
    });

    await recordIntegrityEvent(ports, {
      attemptId: attempt.id,
      participantId: "p_1",
      domainSessionId: session.id,
      type: "visibility_hidden",
      meta: { source: "test" },
    });

    const open = await getOpenAttempt(ports, "p_1");
    expect(open?.status).toBe("in_progress");
    expect(ports.integrity.listByAttempt).toBeDefined();
    const events = await ports.integrityEvents.listByAttempt(attempt.id);
    expect(events).toHaveLength(1);
    expect(events[0].type).toBe("visibility_hidden");
  });
});

describe("Account Deletion vs Norm Samples", () => {
  it("deletes identifiable assessment data but retains Norm Samples", async () => {
    const ports = buildPorts();
    const attempt = await createAttempt(ports, {
      participant: { id: "p_1", ageBand: "18_45" },
      track: "career",
    });
    await finishAll(ports, attempt.id);
    await completeAttempt(ports, {
      attemptId: attempt.id,
      participantId: "p_1",
      ageBand: "18_45",
    });

    expect(ports.samples.list()).toHaveLength(1);
    const snapshotBefore = await ports.resultSnapshots.findByAttemptId(
      attempt.id,
    );
    expect(snapshotBefore).not.toBeNull();

    await recordIntegrityEvent(ports, {
      attemptId: attempt.id,
      participantId: "p_1",
      type: "blur",
    });

    const result = await deleteParticipantAssessmentData(ports, {
      participantId: "p_1",
    });

    expect(result.normSamplesRetained).toBe(true);
    expect(result.deletedAttemptIds).toContain(attempt.id);
    expect(await ports.attempts.findById(attempt.id)).toBeNull();
    expect(await ports.resultSnapshots.findByAttemptId(attempt.id)).toBeNull();
    expect(await ports.integrityEvents.listByAttempt(attempt.id)).toHaveLength(
      0,
    );
    // Detached norm science remains
    expect(ports.samples.list()).toHaveLength(1);
    expect(JSON.stringify(ports.samples.list()[0])).not.toContain("p_1");
  });
});
