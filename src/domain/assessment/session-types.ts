import type { AttemptId, ParticipantId } from "./types";
import type { DomainId } from "./content-types";

export type DomainSessionId = string;
export type ItemId = string;

export type DomainSessionStatus = "in_progress" | "closed";
export type DomainSessionCloseReason = "early_finish" | "timer";

export type DomainSession = {
  id: DomainSessionId;
  attemptId: AttemptId;
  participantId: ParticipantId;
  domainId: DomainId;
  sequenceIndex: number;
  status: DomainSessionStatus;
  startedAt: Date;
  endsAt: Date;
  closedAt: Date | null;
  closeReason: DomainSessionCloseReason | null;
  rawCorrect: number | null;
  rawTotal: number | null;
};

export type Response = {
  id: string;
  domainSessionId: DomainSessionId;
  attemptId: AttemptId;
  participantId: ParticipantId;
  itemId: ItemId;
  answer: string;
  updatedAt: Date;
};

/** Default grace after endsAt for in-flight upserts only (ms). */
export const DEFAULT_GRACE_WINDOW_MS = 30_000;
