import type { AssessmentPorts } from "./ports";
import type { DomainDefinition, Item } from "./content-types";
import {
  DEFAULT_GRACE_WINDOW_MS,
  type DomainSession,
  type DomainSessionCloseReason,
  type Response,
} from "./session-types";
import { AssessmentError, type AttemptId, type ParticipantId } from "./types";

function newId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID()}`;
}

/**
 * Stable Response PK per (session, item) so concurrent autosaves merge on
 * upsert instead of racing two random IDs into UNIQUE (domain_session_id, item_id).
 */
export function stableResponseId(sessionId: string, itemId: string): string {
  const raw = `rsp_${sessionId}_${itemId}`;
  return raw.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 200);
}

function graceMs(ports: AssessmentPorts): number {
  return ports.graceWindowMs ?? DEFAULT_GRACE_WINDOW_MS;
}

async function requireOwnedOpenAttempt(
  ports: AssessmentPorts,
  attemptId: AttemptId,
  participantId: ParticipantId,
) {
  const attempt = await ports.attempts.findById(attemptId);
  if (!attempt || attempt.participantId !== participantId) {
    throw new AssessmentError("NOT_FOUND", "Attempt not found");
  }
  if (attempt.status !== "in_progress") {
    throw new AssessmentError(
      "INVALID_STATE",
      "Attempt is not in progress",
    );
  }
  return attempt;
}

async function loadDomainDef(
  ports: AssessmentPorts,
  contentVersionId: string,
  domainId: string,
): Promise<DomainDefinition> {
  const cv = await ports.content.getById(contentVersionId);
  if (!cv) {
    throw new AssessmentError("NOT_FOUND", "Content Version not found");
  }
  const domain = cv.domains.find((d) => d.id === domainId);
  if (!domain) {
    throw new AssessmentError("NOT_FOUND", "Domain not found in Content Version");
  }
  return domain;
}

function scoreSession(
  domain: DomainDefinition,
  responses: Response[],
): { rawCorrect: number; rawTotal: number } {
  const byItem = new Map(responses.map((r) => [r.itemId, r.answer]));
  let rawCorrect = 0;
  for (const item of domain.items) {
    const answer = byItem.get(item.id);
    if (answer !== undefined && answer === item.correctKey) {
      rawCorrect += 1;
    }
  }
  return { rawCorrect, rawTotal: domain.items.length };
}

async function closeSession(
  ports: AssessmentPorts,
  session: DomainSession,
  domain: DomainDefinition,
  reason: DomainSessionCloseReason,
): Promise<DomainSession> {
  if (session.status === "closed") {
    return session;
  }
  const responses = await ports.responses.listBySession(session.id);
  const { rawCorrect, rawTotal } = scoreSession(domain, responses);
  const closed: DomainSession = {
    ...session,
    status: "closed",
    closedAt: ports.clock.now(),
    closeReason: reason,
    rawCorrect,
    rawTotal,
  };
  await ports.domainSessions.save(closed);
  return closed;
}

/**
 * If past endsAt + grace and still open, close as timer partial.
 * Returns updated session.
 */
export async function ensureSessionNotPastGrace(
  ports: AssessmentPorts,
  session: DomainSession,
  domain: DomainDefinition,
): Promise<DomainSession> {
  if (session.status === "closed") return session;
  const now = ports.clock.now().getTime();
  const hardClose = session.endsAt.getTime() + graceMs(ports);
  if (now >= hardClose) {
    return closeSession(ports, session, domain, "timer");
  }
  return session;
}

export async function startDomainSession(
  ports: AssessmentPorts,
  input: {
    attemptId: AttemptId;
    participantId: ParticipantId;
    domainId: string;
  },
): Promise<DomainSession> {
  const attempt = await requireOwnedOpenAttempt(
    ports,
    input.attemptId,
    input.participantId,
  );

  const existing = await ports.domainSessions.findByAttemptAndDomain(
    input.attemptId,
    input.domainId,
  );
  if (existing) {
    if (existing.status === "closed") {
      throw new AssessmentError(
        "INVALID_STATE",
        "Domain Session already closed and cannot be reopened",
      );
    }
    const domain = await loadDomainDef(
      ports,
      attempt.contentVersionId,
      input.domainId,
    );
    return ensureSessionNotPastGrace(ports, existing, domain);
  }

  const cv = await ports.content.getById(attempt.contentVersionId);
  if (!cv) {
    throw new AssessmentError("NOT_FOUND", "Content Version not found");
  }
  const sequenceIndex = cv.domainOrder.indexOf(input.domainId);
  if (sequenceIndex < 0) {
    throw new AssessmentError("NOT_FOUND", "Domain not in Content Version order");
  }

  // Enforce fixed order: previous domain must be closed (if any)
  if (sequenceIndex > 0) {
    const prevDomainId = cv.domainOrder[sequenceIndex - 1];
    const prev = await ports.domainSessions.findByAttemptAndDomain(
      input.attemptId,
      prevDomainId,
    );
    if (!prev || prev.status !== "closed") {
      throw new AssessmentError(
        "INVALID_STATE",
        "Previous Domain must be completed before starting this Domain",
      );
    }
  }

  const domain = await loadDomainDef(
    ports,
    attempt.contentVersionId,
    input.domainId,
  );
  const now = ports.clock.now();
  const session: DomainSession = {
    id: newId("ds"),
    attemptId: input.attemptId,
    participantId: input.participantId,
    domainId: input.domainId,
    sequenceIndex,
    status: "in_progress",
    startedAt: now,
    endsAt: new Date(now.getTime() + domain.timeLimitSeconds * 1000),
    closedAt: null,
    closeReason: null,
    rawCorrect: null,
    rawTotal: null,
  };
  await ports.domainSessions.save(session);
  return session;
}

type OpenSessionContext = {
  live: DomainSession;
  domain: DomainDefinition;
  now: number;
  endsAt: number;
  hardClose: number;
};

/**
 * Load session + content once and validate timer state for writes.
 * Shared by single and batch upsert hot paths.
 */
async function loadOpenSessionContext(
  ports: AssessmentPorts,
  input: { sessionId: string; participantId: ParticipantId },
): Promise<OpenSessionContext> {
  const session = await ports.domainSessions.findById(input.sessionId);
  if (!session || session.participantId !== input.participantId) {
    throw new AssessmentError("NOT_FOUND", "Domain Session not found");
  }

  const attempt = await ports.attempts.findById(session.attemptId);
  if (!attempt) {
    throw new AssessmentError("NOT_FOUND", "Attempt not found");
  }

  const domain = await loadDomainDef(
    ports,
    attempt.contentVersionId,
    session.domainId,
  );

  const live = await ensureSessionNotPastGrace(ports, session, domain);
  if (live.status === "closed") {
    throw new AssessmentError(
      "INVALID_STATE",
      "Domain Session is closed; Responses are frozen",
    );
  }

  const now = ports.clock.now().getTime();
  const endsAt = live.endsAt.getTime();
  const hardClose = endsAt + graceMs(ports);

  if (now >= hardClose) {
    await closeSession(ports, live, domain, "timer");
    throw new AssessmentError(
      "INVALID_STATE",
      "Domain Session is closed; Responses are frozen",
    );
  }

  return { live, domain, now, endsAt, hardClose };
}

function buildValidatedResponse(
  ctx: OpenSessionContext,
  input: {
    participantId: ParticipantId;
    itemId: string;
    answer: string;
  },
  existingIds: ReadonlySet<string> | null,
  nowDate: Date,
): Response {
  const item = ctx.domain.items.find((i) => i.id === input.itemId);
  if (!item) {
    throw new AssessmentError("NOT_FOUND", "Item not in this Domain");
  }
  if (!item.choices.some((c) => c.id === input.answer)) {
    throw new AssessmentError("INVALID_STATE", "Answer is not a valid choice");
  }

  // Grace: only updates to rows already on server (in-flight), not new blanks.
  if (ctx.now >= ctx.endsAt) {
    if (!existingIds || !existingIds.has(input.itemId)) {
      throw new AssessmentError(
        "INVALID_STATE",
        "Grace Window only accepts updates to existing Responses",
      );
    }
  }

  return {
    // Stable PK — skips a SELECT on the hot pre-endsAt path.
    id: stableResponseId(ctx.live.id, input.itemId),
    domainSessionId: ctx.live.id,
    attemptId: ctx.live.attemptId,
    participantId: input.participantId,
    itemId: input.itemId,
    answer: input.answer,
    updatedAt: nowDate,
  };
}

export async function upsertResponse(
  ports: AssessmentPorts,
  input: {
    sessionId: string;
    participantId: ParticipantId;
    itemId: string;
    answer: string;
  },
): Promise<Response> {
  const ctx = await loadOpenSessionContext(ports, input);

  let existingIds: Set<string> | null = null;
  if (ctx.now >= ctx.endsAt) {
    // Only during grace do we need to know which items already have a row.
    const listed = await ports.responses.listBySession(ctx.live.id);
    existingIds = new Set(listed.map((r) => r.itemId));
  }

  const response = buildValidatedResponse(
    ctx,
    input,
    existingIds,
    ports.clock.now(),
  );
  await ports.responses.upsert(response);
  return response;
}

/**
 * Persist many answers after one session/attempt load.
 * Uses multi-row upsert when the repository supports it (one HTTP round-trip).
 */
export async function upsertResponsesBatch(
  ports: AssessmentPorts,
  input: {
    sessionId: string;
    participantId: ParticipantId;
    answers: Array<{ itemId: string; answer: string }>;
  },
): Promise<{ saved: number }> {
  if (input.answers.length === 0) return { saved: 0 };

  const ctx = await loadOpenSessionContext(ports, {
    sessionId: input.sessionId,
    participantId: input.participantId,
  });

  let existingIds: Set<string> | null = null;
  if (ctx.now >= ctx.endsAt) {
    const listed = await ports.responses.listBySession(ctx.live.id);
    existingIds = new Set(listed.map((r) => r.itemId));
  }

  const nowDate = ports.clock.now();
  // Last write wins per itemId if the client sent duplicates.
  const byItem = new Map<string, { itemId: string; answer: string }>();
  for (const row of input.answers) {
    byItem.set(row.itemId, row);
  }

  const rows: Response[] = [];
  for (const row of byItem.values()) {
    rows.push(
      buildValidatedResponse(
        ctx,
        {
          participantId: input.participantId,
          itemId: row.itemId,
          answer: row.answer,
        },
        existingIds,
        nowDate,
      ),
    );
  }

  if (ports.responses.upsertMany) {
    await ports.responses.upsertMany(rows);
  } else {
    await Promise.all(rows.map((r) => ports.responses.upsert(r)));
  }
  return { saved: rows.length };
}

export async function earlyFinishDomainSession(
  ports: AssessmentPorts,
  input: { sessionId: string; participantId: ParticipantId },
): Promise<DomainSession> {
  const session = await ports.domainSessions.findById(input.sessionId);
  if (!session || session.participantId !== input.participantId) {
    throw new AssessmentError("NOT_FOUND", "Domain Session not found");
  }

  const attempt = await ports.attempts.findById(session.attemptId);
  if (!attempt) {
    throw new AssessmentError("NOT_FOUND", "Attempt not found");
  }

  const domain = await loadDomainDef(
    ports,
    attempt.contentVersionId,
    session.domainId,
  );

  const live = await ensureSessionNotPastGrace(ports, session, domain);
  if (live.status === "closed") {
    return live;
  }

  const responses = await ports.responses.listBySession(live.id);
  const answered = new Set(responses.map((r) => r.itemId));
  const allAnswered = domain.items.every((item) => answered.has(item.id));
  if (!allAnswered) {
    const missing = domain.items.length - answered.size;
    throw new AssessmentError(
      "INVALID_STATE",
      `Belum semua soal tersimpan di server (${answered.size}/${domain.items.length}). Tunggu indikator "Tersimpan", lalu coba lagi. Sisa: ${missing} soal.`,
    );
  }

  return closeSession(ports, live, domain, "early_finish");
}

export async function closeDomainSessionIfTimedOut(
  ports: AssessmentPorts,
  input: { sessionId: string; participantId: ParticipantId },
): Promise<DomainSession> {
  const session = await ports.domainSessions.findById(input.sessionId);
  if (!session || session.participantId !== input.participantId) {
    throw new AssessmentError("NOT_FOUND", "Domain Session not found");
  }
  const attempt = await ports.attempts.findById(session.attemptId);
  if (!attempt) {
    throw new AssessmentError("NOT_FOUND", "Attempt not found");
  }
  const domain = await loadDomainDef(
    ports,
    attempt.contentVersionId,
    session.domainId,
  );
  return ensureSessionNotPastGrace(ports, session, domain);
}

/**
 * Close every open Domain Session on an Attempt that is past endsAt + grace.
 * Call when loading progress / starting the next domain so a stale open
 * session (client left mid-timer) does not block fixed-order progression.
 */
export async function closeExpiredSessionsForAttempt(
  ports: AssessmentPorts,
  input: { attemptId: AttemptId; participantId: ParticipantId },
): Promise<DomainSession[]> {
  const attempt = await requireOwnedOpenAttempt(
    ports,
    input.attemptId,
    input.participantId,
  );
  const sessions = await ports.domainSessions.listByAttempt(input.attemptId);
  const closed: DomainSession[] = [];
  for (const session of sessions) {
    if (session.status !== "in_progress") continue;
    const domain = await loadDomainDef(
      ports,
      attempt.contentVersionId,
      session.domainId,
    );
    const live = await ensureSessionNotPastGrace(ports, session, domain);
    if (live.status === "closed") closed.push(live);
  }
  return closed;
}

/** Public runner payload — never includes correctKey. */
export type PublicRunnerItem = {
  id: string;
  prompt: string;
  choices: Array<{ id: string; label: string }>;
};

export type PublicDomainRunnerView = {
  session: {
    id: string;
    domainId: string;
    status: DomainSession["status"];
    startedAt: string;
    endsAt: string;
    graceEndsAt: string;
    closedAt: string | null;
    closeReason: DomainSessionCloseReason | null;
    rawCorrect: number | null;
    rawTotal: number | null;
  };
  domain: {
    id: string;
    label: string;
    shortBlurb?: string;
    instruction: string;
    timeLimitSeconds: number;
  };
  items: PublicRunnerItem[];
  responses: Record<string, string>;
  answeredCount: number;
  totalItems: number;
  canEarlyFinish: boolean;
  serverNow: string;
};

export async function getDomainRunnerView(
  ports: AssessmentPorts,
  input: { sessionId: string; participantId: ParticipantId },
): Promise<PublicDomainRunnerView> {
  const session = await ports.domainSessions.findById(input.sessionId);
  if (!session || session.participantId !== input.participantId) {
    throw new AssessmentError("NOT_FOUND", "Domain Session not found");
  }

  const attempt = await ports.attempts.findById(session.attemptId);
  if (!attempt) {
    throw new AssessmentError("NOT_FOUND", "Attempt not found");
  }

  const domain = await loadDomainDef(
    ports,
    attempt.contentVersionId,
    session.domainId,
  );

  const live = await ensureSessionNotPastGrace(ports, session, domain);
  const responses = await ports.responses.listBySession(live.id);
  const responseMap: Record<string, string> = {};
  for (const r of responses) {
    responseMap[r.itemId] = r.answer;
  }

  const answeredCount = domain.items.filter((i) => responseMap[i.id]).length;
  const canEarlyFinish =
    live.status === "in_progress" && answeredCount === domain.items.length;

  return {
    session: {
      id: live.id,
      domainId: live.domainId,
      status: live.status,
      startedAt: live.startedAt.toISOString(),
      endsAt: live.endsAt.toISOString(),
      graceEndsAt: new Date(
        live.endsAt.getTime() + graceMs(ports),
      ).toISOString(),
      closedAt: live.closedAt?.toISOString() ?? null,
      closeReason: live.closeReason,
      rawCorrect: live.rawCorrect,
      rawTotal: live.rawTotal,
    },
    domain: {
      id: domain.id,
      label: domain.label,
      shortBlurb: domain.shortBlurb,
      instruction: domain.instruction,
      timeLimitSeconds: domain.timeLimitSeconds,
    },
    items: domain.items.map(
      (item: Item): PublicRunnerItem => ({
        id: item.id,
        prompt: item.prompt,
        choices: item.choices.map((c) => ({ id: c.id, label: c.label })),
      }),
    ),
    responses: responseMap,
    answeredCount,
    totalItems: domain.items.length,
    canEarlyFinish,
    serverNow: ports.clock.now().toISOString(),
  };
}
