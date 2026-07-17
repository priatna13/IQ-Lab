import type { AssessmentPorts } from "./ports";
import {
  buildRulePayload,
  sanitizeRulePayload,
} from "./career-rules";
import { createHybridInsightNarrator } from "./insight-narrator";
import {
  compositeIndexFromDomainScores,
  domainScoreFromRaw,
  iqEstimateFromComposite,
  NORM_VERSION_SYNTHETIC_V1,
} from "./scoring";
import { buildNormSample } from "./norm-sample";
import type { AbilityProfile, ResultSnapshot } from "./result-types";
import {
  AssessmentError,
  type AgeBand,
  type Attempt,
  type ParticipantId,
} from "./types";

function newSnapshotId(): string {
  return `rs_${crypto.randomUUID()}`;
}

export type CompleteAttemptResult = {
  attempt: Attempt;
  snapshot: ResultSnapshot;
};

/**
 * Complete an Attempt after all nine Domain Sessions are closed.
 * Freezes Result Snapshot (immutable) with synthetic norms.
 */
export async function completeAttempt(
  ports: AssessmentPorts,
  input: {
    attemptId: string;
    participantId: ParticipantId;
    /** Required for Norm Sample age bucket (not stored as PII on sample). */
    ageBand: AgeBand;
  },
): Promise<CompleteAttemptResult> {
  const attempt = await ports.attempts.findById(input.attemptId);
  if (!attempt || attempt.participantId !== input.participantId) {
    throw new AssessmentError("NOT_FOUND", "Attempt not found");
  }

  if (attempt.status === "completed") {
    const existing = await ports.resultSnapshots.findByAttemptId(attempt.id);
    if (existing) {
      return { attempt, snapshot: existing };
    }
    throw new AssessmentError(
      "INVALID_STATE",
      "Attempt completed but Result Snapshot missing",
    );
  }

  if (attempt.status === "abandoned") {
    throw new AssessmentError(
      "INVALID_STATE",
      "Abandoned Attempt cannot be completed",
    );
  }

  if (attempt.status !== "in_progress") {
    throw new AssessmentError("INVALID_STATE", "Attempt is not in progress");
  }

  const cv = await ports.content.getById(attempt.contentVersionId);
  if (!cv) {
    throw new AssessmentError("NOT_FOUND", "Content Version not found");
  }

  const sessions = await ports.domainSessions.listByAttempt(attempt.id);
  const byDomain = new Map(sessions.map((s) => [s.domainId, s]));

  for (const domainId of cv.domainOrder) {
    const session = byDomain.get(domainId);
    if (!session || session.status !== "closed") {
      throw new AssessmentError(
        "INVALID_STATE",
        "All Domain Sessions must be closed before completing the Attempt",
      );
    }
  }

  const abilityProfile: AbilityProfile = cv.domainOrder.map((domainId) => {
    const domain = cv.domains.find((d) => d.id === domainId)!;
    const session = byDomain.get(domainId)!;
    const rawCorrect = session.rawCorrect ?? 0;
    const rawTotal = session.rawTotal ?? domain.items.length;
    return {
      domainId,
      label: domain.label,
      rawCorrect,
      rawTotal,
      score: domainScoreFromRaw(rawCorrect, rawTotal),
    };
  });

  const compositeIndex = compositeIndexFromDomainScores(
    abilityProfile.map((e) => e.score),
  );
  const iqEstimate = iqEstimateFromComposite(compositeIndex);

  // Primary = first Completed for this Participant (ticket 09 will harden retake)
  const priorCompleted = await ports.attempts.listCompletedByParticipant(
    input.participantId,
  );
  const isPrimary = priorCompleted.length === 0;

  const rulePayload = sanitizeRulePayload(
    buildRulePayload(abilityProfile, attempt.track),
  );
  const narrator =
    ports.insightNarrator ?? createHybridInsightNarrator();
  const narration = await narrator.narrate(rulePayload);

  const frozenAt = ports.clock.now();
  const snapshot: ResultSnapshot = {
    id: newSnapshotId(),
    attemptId: attempt.id,
    participantId: input.participantId,
    track: attempt.track,
    contentVersionId: attempt.contentVersionId,
    normVersion: NORM_VERSION_SYNTHETIC_V1,
    frozenAt,
    abilityProfile,
    compositeIndex,
    iqEstimate,
    rulePayload,
    insightProse: narration.insightProse,
    actionPlanProse: narration.actionPlanProse,
  };

  await ports.resultSnapshots.save(snapshot);

  const completed: Attempt = {
    ...attempt,
    status: "completed",
    completedAt: frozenAt,
    abandonedAt: null,
    isPrimary,
  };
  await ports.attempts.save(completed);

  // Norm Sample only for Primary Completed — no account/attempt linkage fields
  if (isPrimary) {
    const sample = buildNormSample({
      ageBand: input.ageBand,
      contentVersionId: attempt.contentVersionId,
      normVersion: NORM_VERSION_SYNTHETIC_V1,
      track: attempt.track,
      abilityProfile,
      compositeIndex,
      iqEstimate,
      primaryCompletedAt: frozenAt,
    });
    if (sample) {
      await ports.normSamples.save(sample);
    }
  }

  return { attempt: completed, snapshot };
}

export async function getResultSnapshotForAttempt(
  ports: AssessmentPorts,
  input: { attemptId: string; participantId: ParticipantId },
): Promise<ResultSnapshot | null> {
  const attempt = await ports.attempts.findById(input.attemptId);
  if (!attempt || attempt.participantId !== input.participantId) {
    throw new AssessmentError("NOT_FOUND", "Attempt not found");
  }
  return ports.resultSnapshots.findByAttemptId(input.attemptId);
}
