import { describe, expect, it } from "vitest";
import { abandonAttempt } from "./abandon-attempt";
import { completeAttempt } from "./complete-attempt";
import { createAttempt, getOpenAttempt } from "./create-attempt";
import { createSeedContentCatalog } from "./content-catalog";
import { V2_CONTENT_VERSION_ID } from "./content/v2";
import {
  earlyFinishDomainSession,
  startDomainSession,
  upsertResponse,
} from "./domain-session";
import { isCoreNormSample } from "./norm-sample";
import type { AssessmentPorts } from "./ports";
import { RETAKE_COOLDOWN_MS } from "./retake-policy";
import { createFixedClock } from "./testing/fixed-clock";
import { createInMemoryAttemptRepository } from "./testing/in-memory-attempts";
import {
  createInMemoryDomainSessionRepository,
  createInMemoryResponseRepository,
} from "./testing/in-memory-sessions";
import { createInMemoryNormSampleRepository } from "./testing/in-memory-norm-samples";
import { createInMemoryResultSnapshotRepository } from "./testing/in-memory-snapshots";
import { createInMemoryIntegrityEventRepository } from "./testing/in-memory-integrity";

function buildPorts(iso = "2026-01-01T00:00:00.000Z"): AssessmentPorts & {
  setNow: (iso: string) => void;
  samples: ReturnType<typeof createInMemoryNormSampleRepository>;
} {
  let current = new Date(iso);
  const samples = createInMemoryNormSampleRepository();
  return {
    clock: {
      now() {
        return new Date(current.getTime());
      },
    },
    setNow(next: string) {
      current = new Date(next);
    },
    attempts: createInMemoryAttemptRepository(),
    content: createSeedContentCatalog(),
    domainSessions: createInMemoryDomainSessionRepository(),
    responses: createInMemoryResponseRepository(),
    resultSnapshots: createInMemoryResultSnapshotRepository(),
    normSamples: samples,
    integrityEvents: createInMemoryIntegrityEventRepository(),
    samples,
  };
}

async function finishAll(
  ports: AssessmentPorts,
  attemptId: string,
  participantId = "p_1",
) {
  const cv = await ports.content.getById(V2_CONTENT_VERSION_ID);
  for (const domainId of cv!.domainOrder) {
    const session = await startDomainSession(ports, {
      attemptId,
      participantId,
      domainId,
    });
    const domain = cv!.domains.find((d) => d.id === domainId)!;
    for (const item of domain.items) {
      await upsertResponse(ports, {
        sessionId: session.id,
        participantId,
        itemId: item.id,
        answer: item.correctKey,
      });
    }
    await earlyFinishDomainSession(ports, {
      sessionId: session.id,
      participantId,
    });
  }
}

describe("Primary, Retake Policy, Norm Sample", () => {
  it("marks first Completed as Primary and writes Norm Sample without PII", async () => {
    const ports = buildPorts();
    const attempt = await createAttempt(ports, {
      participant: { id: "p_1", ageBand: "18_45" },
      track: "explore",
    });
    await finishAll(ports, attempt.id);

    const { attempt: done } = await completeAttempt(ports, {
      attemptId: attempt.id,
      participantId: "p_1",
      ageBand: "18_45",
    });

    expect(done.isPrimary).toBe(true);
    expect(ports.samples.list()).toHaveLength(1);
    const sample = ports.samples.list()[0];
    expect(sample.ageBucket).toBe("core_18_45");
    expect(isCoreNormSample(sample)).toBe(true);
    expect(JSON.stringify(sample)).not.toContain("p_1");
    expect(JSON.stringify(sample)).not.toContain(attempt.id);
    expect(sample).not.toHaveProperty("participantId");
    expect(sample).not.toHaveProperty("attemptId");
  });

  it("stores 46+ samples in senior bucket (not core)", async () => {
    const ports = buildPorts();
    const attempt = await createAttempt(ports, {
      participant: { id: "p_2", ageBand: "46_plus" },
      track: "career",
    });
    await finishAll(ports, attempt.id, "p_2");
    await completeAttempt(ports, {
      attemptId: attempt.id,
      participantId: "p_2",
      ageBand: "46_plus",
    });
    const sample = ports.samples.list()[0];
    expect(sample.ageBucket).toBe("senior_46_plus");
    expect(isCoreNormSample(sample)).toBe(false);
  });

  it("rejects new Attempt during 90-day retake cooldown; prior report still loadable", async () => {
    const ports = buildPorts("2026-01-01T00:00:00.000Z");
    const attempt = await createAttempt(ports, {
      participant: { id: "p_1", ageBand: "18_45" },
      track: "explore",
    });
    await finishAll(ports, attempt.id);
    const { snapshot } = await completeAttempt(ports, {
      attemptId: attempt.id,
      participantId: "p_1",
      ageBand: "18_45",
    });

    // +30 days — still in cooldown
    ports.setNow("2026-01-31T00:00:00.000Z");
    await expect(
      createAttempt(ports, {
        participant: { id: "p_1", ageBand: "18_45" },
        track: "career",
      }),
    ).rejects.toMatchObject({ code: "RETAKE_COOLDOWN" });

    // Prior report still readable
    const loaded = await ports.resultSnapshots.findByAttemptId(attempt.id);
    expect(loaded?.id).toBe(snapshot.id);
    expect(loaded?.compositeIndex).toBe(snapshot.compositeIndex);
  });

  it("allows new Attempt after cooldown; second complete is not Primary and no second Norm Sample", async () => {
    const ports = buildPorts("2026-01-01T00:00:00.000Z");
    const a1 = await createAttempt(ports, {
      participant: { id: "p_1", ageBand: "18_45" },
      track: "explore",
    });
    await finishAll(ports, a1.id);
    const first = await completeAttempt(ports, {
      attemptId: a1.id,
      participantId: "p_1",
      ageBand: "18_45",
    });
    expect(first.attempt.isPrimary).toBe(true);
    expect(ports.samples.list()).toHaveLength(1);

    ports.setNow(
      new Date(
        Date.parse("2026-01-01T00:00:00.000Z") + RETAKE_COOLDOWN_MS + 1,
      ).toISOString(),
    );

    const a2 = await createAttempt(ports, {
      participant: { id: "p_1", ageBand: "18_45" },
      track: "career",
    });
    await finishAll(ports, a2.id);
    const second = await completeAttempt(ports, {
      attemptId: a2.id,
      participantId: "p_1",
      ageBand: "18_45",
    });

    expect(second.attempt.isPrimary).toBe(false);
    expect(ports.samples.list()).toHaveLength(1);
  });

  it("abandon does not start retake cooldown", async () => {
    const ports = buildPorts("2026-01-01T00:00:00.000Z");
    const attempt = await createAttempt(ports, {
      participant: { id: "p_1", ageBand: "18_45" },
      track: "explore",
    });
    await abandonAttempt(ports, {
      attemptId: attempt.id,
      participantId: "p_1",
    });
    expect(await getOpenAttempt(ports, "p_1")).toBeNull();

    // Immediately allowed
    const next = await createAttempt(ports, {
      participant: { id: "p_1", ageBand: "18_45" },
      track: "career",
    });
    expect(next.status).toBe("in_progress");
    expect(ports.samples.list()).toHaveLength(0);
  });
});
