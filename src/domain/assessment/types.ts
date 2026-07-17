/** Domain types for the Assessment application boundary (see CONTEXT.md). */

export type Track = "explore" | "career";

export type AttemptStatus = "in_progress" | "completed" | "abandoned";

export type AgeBand = "under_18" | "18_45" | "46_plus";

export type ParticipantId = string;

export type ContentVersionId = string;

export type AttemptId = string;

export type Participant = {
  id: ParticipantId;
  ageBand: AgeBand;
};

export type Attempt = {
  id: AttemptId;
  participantId: ParticipantId;
  track: Track;
  contentVersionId: ContentVersionId;
  status: AttemptStatus;
  startedAt: Date;
  completedAt: Date | null;
  abandonedAt: Date | null;
  isPrimary: boolean;
};

export type CreateAttemptInput = {
  participant: Participant | null;
  track: Track;
  contentVersionId: ContentVersionId;
};

export type AssessmentErrorCode =
  | "UNAUTHENTICATED"
  | "AGE_NOT_ELIGIBLE"
  | "OPEN_ATTEMPT_EXISTS"
  | "RETAKE_COOLDOWN"
  | "NOT_FOUND"
  | "INVALID_STATE";

export class AssessmentError extends Error {
  readonly code: AssessmentErrorCode;

  constructor(code: AssessmentErrorCode, message: string) {
    super(message);
    this.name = "AssessmentError";
    this.code = code;
  }
}
