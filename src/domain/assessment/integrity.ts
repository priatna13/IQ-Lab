import type { AssessmentPorts } from "./ports";
import type { IntegrityEvent, IntegrityEventType } from "./integrity-types";
import { AssessmentError, type ParticipantId } from "./types";

function newId(): string {
  return `ie_${crypto.randomUUID()}`;
}

/**
 * Record a light integrity signal. Never changes Attempt status.
 */
export async function recordIntegrityEvent(
  ports: AssessmentPorts,
  input: {
    attemptId: string;
    participantId: ParticipantId;
    domainSessionId?: string | null;
    type: IntegrityEventType;
    meta?: Record<string, unknown> | null;
  },
): Promise<IntegrityEvent> {
  const attempt = await ports.attempts.findById(input.attemptId);
  if (!attempt || attempt.participantId !== input.participantId) {
    throw new AssessmentError("NOT_FOUND", "Attempt not found");
  }

  // Still allow logging on completed/abandoned for audit, but never invalidate
  const event: IntegrityEvent = {
    id: newId(),
    attemptId: input.attemptId,
    participantId: input.participantId,
    domainSessionId: input.domainSessionId ?? null,
    type: input.type,
    recordedAt: ports.clock.now(),
    meta: input.meta ?? null,
  };

  await ports.integrityEvents.save(event);

  // Explicit: do not touch attempt.status
  return event;
}
