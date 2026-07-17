import type { AssessmentPorts } from "./ports";
import {
  AssessmentError,
  type Attempt,
  type CreateAttemptInput,
} from "./types";

function newAttemptId(): string {
  return `att_${crypto.randomUUID()}`;
}

/**
 * Create an Open Attempt for a Participant.
 * Foundation invariant: unauthenticated callers are rejected.
 */
export async function createAttempt(
  ports: AssessmentPorts,
  input: CreateAttemptInput,
): Promise<Attempt> {
  if (input.participant === null) {
    throw new AssessmentError(
      "UNAUTHENTICATED",
      "Account required before creating an Attempt",
    );
  }

  if (input.participant.ageBand === "under_18") {
    throw new AssessmentError(
      "AGE_NOT_ELIGIBLE",
      "Participants under 18 are not eligible for Assessment",
    );
  }

  const existing = await ports.attempts.findOpenByParticipant(
    input.participant.id,
  );
  if (existing) {
    throw new AssessmentError(
      "OPEN_ATTEMPT_EXISTS",
      "At most one Open Attempt is allowed per Participant",
    );
  }

  const attempt: Attempt = {
    id: newAttemptId(),
    participantId: input.participant.id,
    track: input.track,
    contentVersionId: input.contentVersionId,
    status: "in_progress",
    startedAt: ports.clock.now(),
    completedAt: null,
    abandonedAt: null,
    isPrimary: false,
  };

  await ports.attempts.save(attempt);
  return attempt;
}
