import { describe, expect, it } from "vitest";
import { createAttempt } from "./create-attempt";
import { createSeedContentCatalog } from "./content-catalog";
import { V2_CONTENT_VERSION_ID } from "./content/v2";
import {
  earlyFinishDomainSession,
  getDomainRunnerView,
  startDomainSession,
  stableResponseId,
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
import { createInMemoryIntegrityEventRepository } from "./testing/in-memory-integrity";
import { AssessmentError } from "./types";

function buildPorts(iso = "2026-07-17T12:00:00.000Z"): AssessmentPorts & {
  setNow: (iso: string) => void;
} {
  let current = new Date(iso);
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
    normSamples: createInMemoryNormSampleRepository(),
    integrityEvents: createInMemoryIntegrityEventRepository(),
    graceWindowMs: 30_000,
  };
}

async function openFirstDomain(ports: AssessmentPorts) {
  const attempt = await createAttempt(ports, {
    participant: { id: "p_1", ageBand: "18_45" },
    track: "explore",
    contentVersionId: V2_CONTENT_VERSION_ID,
  });
  const cv = await ports.content.getById(V2_CONTENT_VERSION_ID);
  const domainId = cv!.domainOrder[0];
  const session = await startDomainSession(ports, {
    attemptId: attempt.id,
    participantId: "p_1",
    domainId,
  });
  return { attempt, domainId, session, cv: cv! };
}

describe("Domain Session runner boundary", () => {
  it("starts a Domain Session with server endsAt from domain time limit", async () => {
    const ports = buildPorts("2026-07-17T12:00:00.000Z");
    const { session, cv, domainId } = await openFirstDomain(ports);
    const domain = cv.domains.find((d) => d.id === domainId)!;

    expect(session.status).toBe("in_progress");
    expect(session.endsAt.toISOString()).toBe(
      new Date(
        Date.parse("2026-07-17T12:00:00.000Z") + domain.timeLimitSeconds * 1000,
      ).toISOString(),
    );
  });

  it("allows Response upserts and free navigation state via last-write-wins", async () => {
    const ports = buildPorts();
    const { session, cv, domainId } = await openFirstDomain(ports);
    const item = cv.domains.find((d) => d.id === domainId)!.items[0];

    await upsertResponse(ports, {
      sessionId: session.id,
      participantId: "p_1",
      itemId: item.id,
      answer: "a",
    });
    await upsertResponse(ports, {
      sessionId: session.id,
      participantId: "p_1",
      itemId: item.id,
      answer: "b",
    });

    const view = await getDomainRunnerView(ports, {
      sessionId: session.id,
      participantId: "p_1",
    });
    expect(view.responses[item.id]).toBe("b");
    expect(JSON.stringify(view)).not.toContain("correctKey");

    const listed = await ports.responses.listBySession(session.id);
    expect(listed).toHaveLength(1);
    expect(listed[0].id).toBe(stableResponseId(session.id, item.id));
  });

  it("rejects Early Finish until every Item has a Response, then freezes", async () => {
    const ports = buildPorts();
    const { session, cv, domainId } = await openFirstDomain(ports);
    const domain = cv.domains.find((d) => d.id === domainId)!;

    await expect(
      earlyFinishDomainSession(ports, {
        sessionId: session.id,
        participantId: "p_1",
      }),
    ).rejects.toMatchObject({ code: "INVALID_STATE" });

    for (const item of domain.items) {
      await upsertResponse(ports, {
        sessionId: session.id,
        participantId: "p_1",
        itemId: item.id,
        answer: item.choices[0].id,
      });
    }

    const closed = await earlyFinishDomainSession(ports, {
      sessionId: session.id,
      participantId: "p_1",
    });
    expect(closed.status).toBe("closed");
    expect(closed.closeReason).toBe("early_finish");
    expect(closed.rawTotal).toBe(domain.items.length);
    expect(closed.rawCorrect).not.toBeNull();

    await expect(
      upsertResponse(ports, {
        sessionId: session.id,
        participantId: "p_1",
        itemId: domain.items[0].id,
        answer: "c",
      }),
    ).rejects.toBeInstanceOf(AssessmentError);
  });

  it("on timer + grace expiry closes with partial score and freezes Responses", async () => {
    const ports = buildPorts("2026-07-17T12:00:00.000Z");
    const { session, cv, domainId } = await openFirstDomain(ports);
    const domain = cv.domains.find((d) => d.id === domainId)!;
    const item = domain.items[0];

    await upsertResponse(ports, {
      sessionId: session.id,
      participantId: "p_1",
      itemId: item.id,
      answer: item.correctKey,
    });

    // Jump past endsAt + grace
    ports.setNow(
      new Date(
        session.endsAt.getTime() + 30_000 + 1,
      ).toISOString(),
    );

    const view = await getDomainRunnerView(ports, {
      sessionId: session.id,
      participantId: "p_1",
    });
    expect(view.session.status).toBe("closed");
    expect(view.session.closeReason).toBe("timer");
    expect(view.session.rawTotal).toBe(domain.items.length);
    expect(view.session.rawCorrect).toBe(1);

    await expect(
      upsertResponse(ports, {
        sessionId: session.id,
        participantId: "p_1",
        itemId: domain.items[1].id,
        answer: "a",
      }),
    ).rejects.toMatchObject({ code: "INVALID_STATE" });
  });

  it("during grace allows update to existing Response but not new Item answers", async () => {
    const ports = buildPorts("2026-07-17T12:00:00.000Z");
    const { session, cv, domainId } = await openFirstDomain(ports);
    const domain = cv.domains.find((d) => d.id === domainId)!;
    const item0 = domain.items[0];
    const item1 = domain.items[1];

    await upsertResponse(ports, {
      sessionId: session.id,
      participantId: "p_1",
      itemId: item0.id,
      answer: "a",
    });

    ports.setNow(new Date(session.endsAt.getTime() + 5_000).toISOString());

    await upsertResponse(ports, {
      sessionId: session.id,
      participantId: "p_1",
      itemId: item0.id,
      answer: "b",
    });

    await expect(
      upsertResponse(ports, {
        sessionId: session.id,
        participantId: "p_1",
        itemId: item1.id,
        answer: "a",
      }),
    ).rejects.toMatchObject({ code: "INVALID_STATE" });

    const view = await getDomainRunnerView(ports, {
      sessionId: session.id,
      participantId: "p_1",
    });
    expect(view.responses[item0.id]).toBe("b");
    expect(view.responses[item1.id]).toBeUndefined();
  });
});
