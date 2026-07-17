import type { ResultSnapshotRepository } from "../ports";
import type { ResultSnapshot } from "../result-types";

export function createInMemoryResultSnapshotRepository(): ResultSnapshotRepository {
  const byAttempt = new Map<string, ResultSnapshot>();
  const byId = new Map<string, ResultSnapshot>();

  return {
    async findByAttemptId(attemptId) {
      const s = byAttempt.get(attemptId);
      return s ? structuredClone(s) : null;
    },
    async findById(id) {
      const s = byId.get(id);
      return s ? structuredClone(s) : null;
    },
    async save(snapshot) {
      const copy = structuredClone(snapshot);
      byAttempt.set(snapshot.attemptId, copy);
      byId.set(snapshot.id, copy);
    },
    async deleteByAttemptIds(attemptIds) {
      for (const attemptId of attemptIds) {
        const s = byAttempt.get(attemptId);
        if (s) {
          byId.delete(s.id);
          byAttempt.delete(attemptId);
        }
      }
    },
  };
}
