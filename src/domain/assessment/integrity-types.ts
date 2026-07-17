import type { AttemptId, ParticipantId } from "./types";

export type IntegrityEventType = "blur" | "visibility_hidden" | "focus_return";

export type IntegrityEvent = {
  id: string;
  attemptId: AttemptId;
  participantId: ParticipantId;
  domainSessionId: string | null;
  type: IntegrityEventType;
  recordedAt: Date;
  meta: Record<string, unknown> | null;
};

/**
 * Integrity events are observational only in MVP:
 * - do not auto-invalidate Attempt
 * - do not exclude Norm Sample
 */
export const INTEGRITY_POLICY = {
  autoInvalidateAttempt: false,
  excludesNormSample: false,
} as const;
