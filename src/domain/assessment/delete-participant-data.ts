import type { AssessmentPorts } from "./ports";
import type { ParticipantId } from "./types";

export type DeleteParticipantDataResult = {
  deletedAttemptIds: string[];
  /** Norm Samples are detached — never deleted here. */
  normSamplesRetained: true;
};

/**
 * Remove all identifiable Assessment data for a Participant.
 * Norm Samples have no participant linkage and are retained (ADR 0015).
 */
export async function deleteParticipantAssessmentData(
  ports: AssessmentPorts,
  input: { participantId: ParticipantId },
): Promise<DeleteParticipantDataResult> {
  const existing = await ports.attempts.listAllByParticipant(
    input.participantId,
  );
  const attemptIds = existing.map((a) => a.id);

  // In-memory: explicit child cleanup. InsForge: FK CASCADE on attempt delete also covers children.
  await ports.responses.deleteByAttemptIds(attemptIds);
  await ports.domainSessions.deleteByAttemptIds(attemptIds);
  await ports.resultSnapshots.deleteByAttemptIds(attemptIds);
  await ports.integrityEvents.deleteAllByParticipant(input.participantId);

  const deletedAttemptIds = await ports.attempts.deleteAllByParticipant(
    input.participantId,
  );

  // Norm Samples: intentionally not touched (no participant linkage).

  return {
    deletedAttemptIds,
    normSamplesRetained: true,
  };
}
