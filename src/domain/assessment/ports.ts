import type { ContentCatalog } from "./content-catalog";
import type { InsightNarrator } from "./insight-narrator";
import type { IntegrityEvent } from "./integrity-types";
import type { NormSample } from "./norm-sample";
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
  listAllByParticipant(participantId: ParticipantId): Promise<Attempt[]>;
  /** Delete all attempts for participant; DB layer relies on FK CASCADE for children. */
  deleteAllByParticipant(participantId: ParticipantId): Promise<AttemptId[]>;
};

export type IntegrityEventRepository = {
  save(event: IntegrityEvent): Promise<void>;
  listByAttempt(attemptId: AttemptId): Promise<IntegrityEvent[]>;
  deleteAllByParticipant(participantId: ParticipantId): Promise<void>;
};

export type ResultSnapshotRepository = {
  findByAttemptId(attemptId: AttemptId): Promise<ResultSnapshot | null>;
  findById(id: string): Promise<ResultSnapshot | null>;
  save(snapshot: ResultSnapshot): Promise<void>;
  deleteByAttemptIds(attemptIds: AttemptId[]): Promise<void>;
};

/** Append-only anonymized samples — no PII, no participant linkage. */
export type NormSampleRepository = {
  save(sample: NormSample): Promise<void>;
};

export type DomainSessionRepository = {
  findById(id: DomainSessionId): Promise<DomainSession | null>;
  findByAttemptAndDomain(
    attemptId: AttemptId,
    domainId: string,
  ): Promise<DomainSession | null>;
  listByAttempt(attemptId: AttemptId): Promise<DomainSession[]>;
  save(session: DomainSession): Promise<void>;
  deleteByAttemptIds(attemptIds: AttemptId[]): Promise<void>;
};

export type ResponseRepository = {
  listBySession(sessionId: DomainSessionId): Promise<Response[]>;
  findBySessionAndItem(
    sessionId: DomainSessionId,
    itemId: string,
  ): Promise<Response | null>;
  upsert(response: Response): Promise<void>;
  deleteByAttemptIds(attemptIds: AttemptId[]): Promise<void>;
};

export type AssessmentPorts = {
  clock: Clock;
  attempts: AttemptRepository;
  content: ContentCatalog;
  domainSessions: DomainSessionRepository;
  responses: ResponseRepository;
  resultSnapshots: ResultSnapshotRepository;
  normSamples: NormSampleRepository;
  integrityEvents: IntegrityEventRepository;
  /** Hybrid Insight narrator (rule payload → prose). Defaults to template-only if omitted in tests. */
  insightNarrator?: InsightNarrator;
  /** Grace after endsAt for in-flight answer updates only. */
  graceWindowMs?: number;
  /** Override retake window in tests (default 90 days). */
  retakeCooldownMs?: number;
};
