import type { AssessmentPorts } from "./ports";
import { AssessmentError, type Attempt, type ParticipantId } from "./types";

/**
 * Explicitly abandon an Open Attempt.
 * Does not start retake cooldown (only Completed does — ticket 09 / ADR 0006).
 * Clears the single Open Attempt slot so a new Attempt may be created.
 */
export async function abandonAttempt(
  ports: AssessmentPorts,
  input: {
    attemptId: string;
    participantId: ParticipantId;
  },
): Promise<Attempt> {
  const attempt = await ports.attempts.findById(input.attemptId);
  if (!attempt || attempt.participantId !== input.participantId) {
    throw new AssessmentError("NOT_FOUND", "Attempt not found");
  }

  if (attempt.status === "abandoned") {
    return attempt;
  }

  if (attempt.status === "completed") {
    throw new AssessmentError(
      "INVALID_STATE",
      "Completed Attempt cannot be abandoned",
    );
  }

  if (attempt.status !== "in_progress") {
    throw new AssessmentError("INVALID_STATE", "Attempt is not open");
  }

  const abandoned: Attempt = {
    ...attempt,
    status: "abandoned",
    abandonedAt: ports.clock.now(),
    completedAt: null,
    isPrimary: false,
  };

  await ports.attempts.save(abandoned);
  return abandoned;
}

/**
 * Retake cooldown is driven only by Completed Attempts (ADR 0006).
 * Abandoned never contributes a cooldown signal.
 */
export function attemptTriggersRetakeCooldown(attempt: Attempt): boolean {
  return attempt.status === "completed" && attempt.completedAt !== null;
}
