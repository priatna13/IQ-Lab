import { describe, expect, it } from "vitest";
import { abandonAttempt, attemptTriggersRetakeCooldown } from "./abandon-attempt";
import { createAttempt, getOpenAttempt } from "./create-attempt";
import { createSeedContentCatalog } from "./content-catalog";
import { MVP_CONTENT_VERSION_ID } from "./content-seed";
import {
  earlyFinishDomainSession,
  startDomainSession,
  upsertResponse,
} from "./domain-session";
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
    clock: createFixedClock("2026-07-17T12:00:00.000Z"),
    attempts: createInMemoryAttemptRepository(),
    content: createSeedContentCatalog(),
    domainSessions: createInMemoryDomainSessionRepository(),
    responses: createInMemoryResponseRepository(),
    resultSnapshots: createInMemoryResultSnapshotRepository(),
    normSamples: createInMemoryNormSampleRepository(),
  };
}

async function answerAllAndFinish(
  ports: AssessmentPorts,
  sessionId: string,
  domainId: string,
) {
  const cv = await ports.content.getById(MVP_CONTENT_VERSION_ID);
  const domain = cv!.domains.find((d) => d.id === domainId)!;
  for (const item of domain.items) {
    await upsertResponse(ports, {
      sessionId,
      participantId: "p_1",
      itemId: item.id,
      answer: item.choices[0].id,
    });
  }
  return earlyFinishDomainSession(ports, {
    sessionId,
    participantId: "p_1",
  });
}

describe("Nine Domains — order, pause/resume, abandon", () => {
  it("enforces fixed Domain sequence (cannot start domain 2 before domain 1 closed)", async () => {
    const ports = buildPorts();
    const attempt = await createAttempt(ports, {
      participant: { id: "p_1", ageBand: "18_45" },
      track: "explore",
    });
    const cv = await ports.content.getById(MVP_CONTENT_VERSION_ID);
    const [d0, d1] = cv!.domainOrder;

    await expect(
      startDomainSession(ports, {
        attemptId: attempt.id,
        participantId: "p_1",
        domainId: d1,
      }),
    ).rejects.toMatchObject({ code: "INVALID_STATE" });

    await startDomainSession(ports, {
      attemptId: attempt.id,
      participantId: "p_1",
      domainId: d0,
    });
  });

  it("resumes the same Open Attempt and same Domain Session after leaving", async () => {
    const ports = buildPorts();
    const attempt = await createAttempt(ports, {
      participant: { id: "p_1", ageBand: "18_45" },
      track: "career",
    });
    const cv = await ports.content.getById(MVP_CONTENT_VERSION_ID);
    const d0 = cv!.domainOrder[0];

    const session1 = await startDomainSession(ports, {
      attemptId: attempt.id,
      participantId: "p_1",
      domainId: d0,
    });

    // "Leave" — only look up open attempt again (pause antar domain / tab close)
    const open = await getOpenAttempt(ports, "p_1");
    expect(open?.id).toBe(attempt.id);
    expect(open?.track).toBe("career");
    expect(open?.contentVersionId).toBe(attempt.contentVersionId);

    const session2 = await startDomainSession(ports, {
      attemptId: open!.id,
      participantId: "p_1",
      domainId: d0,
    });
    expect(session2.id).toBe(session1.id);
    expect(session2.endsAt.toISOString()).toBe(session1.endsAt.toISOString());
  });

  it("does not reopen a closed Domain Session", async () => {
    const ports = buildPorts();
    const attempt = await createAttempt(ports, {
      participant: { id: "p_1", ageBand: "18_45" },
      track: "explore",
    });
    const cv = await ports.content.getById(MVP_CONTENT_VERSION_ID);
    const d0 = cv!.domainOrder[0];

    const session = await startDomainSession(ports, {
      attemptId: attempt.id,
      participantId: "p_1",
      domainId: d0,
    });
    await answerAllAndFinish(ports, session.id, d0);

    await expect(
      startDomainSession(ports, {
        attemptId: attempt.id,
        participantId: "p_1",
        domainId: d0,
      }),
    ).rejects.toMatchObject({ code: "INVALID_STATE" });
  });

  it("does not carry unused time from one Domain to the next", async () => {
    const ports = buildPorts();
    const attempt = await createAttempt(ports, {
      participant: { id: "p_1", ageBand: "18_45" },
      track: "explore",
    });
    const cv = await ports.content.getById(MVP_CONTENT_VERSION_ID);
    const [d0, d1] = cv!.domainOrder;
    const domain0 = cv!.domains.find((d) => d.id === d0)!;
    const domain1 = cv!.domains.find((d) => d.id === d1)!;

    const s0 = await startDomainSession(ports, {
      attemptId: attempt.id,
      participantId: "p_1",
      domainId: d0,
    });
    await answerAllAndFinish(ports, s0.id, d0);

    const s1 = await startDomainSession(ports, {
      attemptId: attempt.id,
      participantId: "p_1",
      domainId: d1,
    });

    // Fresh budget from domain definition — not leftover from s0
    const expectedMs = domain1.timeLimitSeconds * 1000;
    const actualMs = s1.endsAt.getTime() - s1.startedAt.getTime();
    expect(actualMs).toBe(expectedMs);
    expect(actualMs).not.toBe(domain0.timeLimitSeconds * 1000 - 1);
    expect(s1.endsAt.getTime()).toBeGreaterThan(s0.endsAt.getTime() - expectedMs);
  });

  it("abandon clears Open Attempt without retake-cooldown signal", async () => {
    const ports = buildPorts();
    const attempt = await createAttempt(ports, {
      participant: { id: "p_1", ageBand: "18_45" },
      track: "explore",
    });

    const abandoned = await abandonAttempt(ports, {
      attemptId: attempt.id,
      participantId: "p_1",
    });

    expect(abandoned.status).toBe("abandoned");
    expect(abandoned.abandonedAt).not.toBeNull();
    expect(abandoned.completedAt).toBeNull();
    expect(attemptTriggersRetakeCooldown(abandoned)).toBe(false);

    expect(await getOpenAttempt(ports, "p_1")).toBeNull();

    // New Attempt allowed immediately (no cooldown from abandon)
    const next = await createAttempt(ports, {
      participant: { id: "p_1", ageBand: "18_45" },
      track: "career",
    });
    expect(next.status).toBe("in_progress");
    expect(next.id).not.toBe(attempt.id);
  });

  it("can progress domain 1 then domain 2 in order after pause at list page", async () => {
    const ports = buildPorts();
    const attempt = await createAttempt(ports, {
      participant: { id: "p_1", ageBand: "18_45" },
      track: "explore",
    });
    const cv = await ports.content.getById(MVP_CONTENT_VERSION_ID);
    const [d0, d1] = cv!.domainOrder;

    const s0 = await startDomainSession(ports, {
      attemptId: attempt.id,
      participantId: "p_1",
      domainId: d0,
    });
    await answerAllAndFinish(ports, s0.id, d0);

    // Pause: only Open Attempt remains
    const open = await getOpenAttempt(ports, "p_1");
    expect(open?.id).toBe(attempt.id);

    const s1 = await startDomainSession(ports, {
      attemptId: open!.id,
      participantId: "p_1",
      domainId: d1,
    });
    expect(s1.domainId).toBe(d1);
    expect(s1.status).toBe("in_progress");
  });
});
