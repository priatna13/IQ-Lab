import type { AttemptRepository } from "../ports";
import type { Attempt, AttemptId, ParticipantId } from "../types";

export function createInMemoryAttemptRepository(): AttemptRepository {
  const byId = new Map<AttemptId, Attempt>();

  return {
    async findOpenByParticipant(participantId: ParticipantId) {
      for (const attempt of byId.values()) {
        if (
          attempt.participantId === participantId &&
          attempt.status === "in_progress"
        ) {
          return { ...attempt };
        }
      }
      return null;
    },
    async save(attempt: Attempt) {
      byId.set(attempt.id, { ...attempt });
    },
    async findById(id: AttemptId) {
      const found = byId.get(id);
      return found ? { ...found } : null;
    },
  };
}
