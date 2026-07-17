import type { AssessmentPorts } from "./ports";
import {
  AssessmentError,
  type Attempt,
  type CreateAttemptInput,
  type Track,
} from "./types";

function newAttemptId(): string {
  return `att_${crypto.randomUUID()}`;
}

export type CreateAttemptCommand = {
  participant: CreateAttemptInput["participant"];
  track: Track;
  /** If omitted, pins the currently published Content Version. */
  contentVersionId?: string;
};

/**
 * Create an Open Attempt for a Participant.
 * Pins Track + Content Version; enforces single Open Attempt.
 */
export async function createAttempt(
  ports: AssessmentPorts,
  input: CreateAttemptCommand,
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

  if (input.track !== "explore" && input.track !== "career") {
    throw new AssessmentError("INVALID_STATE", "Track must be explore or career");
  }

  const contentVersion = input.contentVersionId
    ? await ports.content.getById(input.contentVersionId)
    : await ports.content.getPublished();

  if (!contentVersion || !contentVersion.published) {
    throw new AssessmentError(
      "NOT_FOUND",
      "Published Content Version not found",
    );
  }

  if (
    input.contentVersionId &&
    contentVersion.id !== input.contentVersionId
  ) {
    throw new AssessmentError("NOT_FOUND", "Content Version mismatch");
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
    contentVersionId: contentVersion.id,
    status: "in_progress",
    startedAt: ports.clock.now(),
    completedAt: null,
    abandonedAt: null,
    isPrimary: false,
  };

  await ports.attempts.save(attempt);
  return attempt;
}

export async function getOpenAttempt(
  ports: AssessmentPorts,
  participantId: string,
): Promise<Attempt | null> {
  return ports.attempts.findOpenByParticipant(participantId);
}
