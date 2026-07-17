import { describe, expect, it } from "vitest";
import { createAttempt } from "./create-attempt";
import { AssessmentError } from "./types";
import { createFixedClock } from "./testing/fixed-clock";
import { createInMemoryAttemptRepository } from "./testing/in-memory-attempts";
import type { AssessmentPorts } from "./ports";

function buildPorts(): AssessmentPorts {
  return {
    clock: createFixedClock("2026-07-17T12:00:00.000Z"),
    attempts: createInMemoryAttemptRepository(),
  };
}

describe("Assessment application boundary — createAttempt", () => {
  it("rejects creating an Attempt without an authenticated Participant", async () => {
    const ports = buildPorts();

    await expect(
      createAttempt(ports, {
        participant: null,
        track: "explore",
        contentVersionId: "cv_test_v1",
      }),
    ).rejects.toMatchObject({
      name: "AssessmentError",
      code: "UNAUTHENTICATED",
    });

    await expect(
      createAttempt(ports, {
        participant: null,
        track: "explore",
        contentVersionId: "cv_test_v1",
      }),
    ).rejects.toBeInstanceOf(AssessmentError);
  });

  it("creates an Open Attempt for an eligible authenticated Participant", async () => {
    const ports = buildPorts();

    const attempt = await createAttempt(ports, {
      participant: { id: "p_1", ageBand: "18_45" },
      track: "career",
      contentVersionId: "cv_test_v1",
    });

    expect(attempt.status).toBe("in_progress");
    expect(attempt.participantId).toBe("p_1");
    expect(attempt.track).toBe("career");
    expect(attempt.contentVersionId).toBe("cv_test_v1");
    expect(attempt.startedAt.toISOString()).toBe("2026-07-17T12:00:00.000Z");
    expect(attempt.isPrimary).toBe(false);

    const open = await ports.attempts.findOpenByParticipant("p_1");
    expect(open?.id).toBe(attempt.id);
  });

  it("rejects a second Open Attempt for the same Participant", async () => {
    const ports = buildPorts();
    const input = {
      participant: { id: "p_1" as const, ageBand: "18_45" as const },
      track: "explore" as const,
      contentVersionId: "cv_test_v1",
    };

    await createAttempt(ports, input);

    await expect(createAttempt(ports, input)).rejects.toMatchObject({
      code: "OPEN_ATTEMPT_EXISTS",
    });
  });
});
