import type { ContentCatalog } from "./content-catalog";
import type { ResultSnapshot } from "./result-types";
import type {
  DomainSession,
  DomainSessionId,
  Response,
} from "./session-types";
import type { Attempt, AttemptId, ParticipantId } from "./types";

/** Injectable clock for timers, grace windows, and retake cooldowns. */
export type Clock = {
  now(): Date;
};

export type AttemptRepository = {
  findOpenByParticipant(participantId: ParticipantId): Promise<Attempt | null>;
  save(attempt: Attempt): Promise<void>;
  findById(id: AttemptId): Promise<Attempt | null>;
  listCompletedByParticipant(participantId: ParticipantId): Promise<Attempt[]>;
};

export type ResultSnapshotRepository = {
  findByAttemptId(attemptId: AttemptId): Promise<ResultSnapshot | null>;
  findById(id: string): Promise<ResultSnapshot | null>;
  save(snapshot: ResultSnapshot): Promise<void>;
};

export type DomainSessionRepository = {
  findById(id: DomainSessionId): Promise<DomainSession | null>;
  findByAttemptAndDomain(
    attemptId: AttemptId,
    domainId: string,
  ): Promise<DomainSession | null>;
  listByAttempt(attemptId: AttemptId): Promise<DomainSession[]>;
  save(session: DomainSession): Promise<void>;
};

export type ResponseRepository = {
  listBySession(sessionId: DomainSessionId): Promise<Response[]>;
  findBySessionAndItem(
    sessionId: DomainSessionId,
    itemId: string,
  ): Promise<Response | null>;
  upsert(response: Response): Promise<void>;
};

export type AssessmentPorts = {
  clock: Clock;
  attempts: AttemptRepository;
  content: ContentCatalog;
  domainSessions: DomainSessionRepository;
  responses: ResponseRepository;
  resultSnapshots: ResultSnapshotRepository;
  /** Grace after endsAt for in-flight answer updates only. */
  graceWindowMs?: number;
};
