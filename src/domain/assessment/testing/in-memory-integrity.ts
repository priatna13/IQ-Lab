import type { IntegrityEventRepository } from "../ports";
import type { IntegrityEvent } from "../integrity-types";

export function createInMemoryIntegrityEventRepository(): IntegrityEventRepository & {
  listAll(): IntegrityEvent[];
} {
  const events: IntegrityEvent[] = [];
  return {
    async save(event) {
      events.push(structuredClone(event));
    },
    async listByAttempt(attemptId) {
      return events
        .filter((e) => e.attemptId === attemptId)
        .map((e) => structuredClone(e));
    },
    async deleteAllByParticipant(participantId) {
      for (let i = events.length - 1; i >= 0; i--) {
        if (events[i].participantId === participantId) {
          events.splice(i, 1);
        }
      }
    },
    listAll() {
      return events.map((e) => structuredClone(e));
    },
  };
}
