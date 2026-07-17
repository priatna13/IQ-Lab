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
    async listCompletedByParticipant(participantId: ParticipantId) {
      return [...byId.values()]
        .filter(
          (a) =>
            a.participantId === participantId && a.status === "completed",
        )
        .map((a) => ({ ...a }));
    },
    async listAllByParticipant(participantId: ParticipantId) {
      return [...byId.values()]
        .filter((a) => a.participantId === participantId)
        .map((a) => ({ ...a }));
    },
    async deleteAllByParticipant(participantId: ParticipantId) {
      const ids: AttemptId[] = [];
      for (const [id, attempt] of byId) {
        if (attempt.participantId === participantId) {
          ids.push(id);
          byId.delete(id);
        }
      }
      return ids;
    },
  };
}
