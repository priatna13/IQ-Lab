import type { ContentCatalog } from "./content-catalog";
import type { Attempt, AttemptId, ParticipantId } from "./types";

/** Injectable clock for timers, grace windows, and retake cooldowns. */
export type Clock = {
  now(): Date;
};

export type AttemptRepository = {
  findOpenByParticipant(participantId: ParticipantId): Promise<Attempt | null>;
  save(attempt: Attempt): Promise<void>;
  findById(id: AttemptId): Promise<Attempt | null>;
};

export type AssessmentPorts = {
  clock: Clock;
  attempts: AttemptRepository;
  content: ContentCatalog;
};
