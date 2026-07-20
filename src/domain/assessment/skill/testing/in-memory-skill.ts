import type {
  SkillAttemptRepository,
  SkillResponseRepository,
  SkillResultSnapshotRepository,
} from "../ports";
import type { SkillAttempt, SkillResponse, SkillResultSnapshot } from "../types";

export function createInMemorySkillAttemptRepository(): SkillAttemptRepository {
  const byId = new Map<string, SkillAttempt>();

  return {
    async findById(id) {
      const a = byId.get(id);
      return a ? structuredClone(a) : null;
    },
    async findOpenByParticipant(participantId) {
      for (const a of byId.values()) {
        if (a.participantId === participantId && a.status === "in_progress") {
          return structuredClone(a);
        }
      }
      return null;
    },
    async findCompletedBySourceAndField(sourceAttemptId, fieldId) {
      for (const a of byId.values()) {
        if (
          a.sourceAttemptId === sourceAttemptId &&
          a.fieldId === fieldId &&
          a.status === "completed"
        ) {
          return structuredClone(a);
        }
      }
      return null;
    },
    async listBySourceAttempt(sourceAttemptId) {
      return [...byId.values()]
        .filter((a) => a.sourceAttemptId === sourceAttemptId)
        .map((a) => structuredClone(a));
    },
    async listByParticipant(participantId) {
      return [...byId.values()]
        .filter((a) => a.participantId === participantId)
        .map((a) => structuredClone(a));
    },
    async save(attempt) {
      byId.set(attempt.id, structuredClone(attempt));
    },
  };
}

export function createInMemorySkillResponseRepository(): SkillResponseRepository {
  const byKey = new Map<string, SkillResponse>();
  const key = (skillAttemptId: string, itemId: string) =>
    `${skillAttemptId}::${itemId}`;

  return {
    async listBySkillAttempt(skillAttemptId) {
      return [...byKey.values()]
        .filter((r) => r.skillAttemptId === skillAttemptId)
        .map((r) => structuredClone(r));
    },
    async upsert(response) {
      byKey.set(key(response.skillAttemptId, response.itemId), structuredClone(response));
    },
  };
}

export function createInMemorySkillSnapshotRepository(): SkillResultSnapshotRepository {
  const bySkillAttempt = new Map<string, SkillResultSnapshot>();
  const bySource = new Map<string, SkillResultSnapshot[]>();

  return {
    async findBySkillAttemptId(skillAttemptId) {
      const s = bySkillAttempt.get(skillAttemptId);
      return s ? structuredClone(s) : null;
    },
    async listBySourceAttempt(sourceAttemptId) {
      return (bySource.get(sourceAttemptId) ?? []).map((s) => structuredClone(s));
    },
    async save(snapshot) {
      bySkillAttempt.set(snapshot.skillAttemptId, structuredClone(snapshot));
      const list = bySource.get(snapshot.sourceAttemptId) ?? [];
      const next = list.filter((s) => s.id !== snapshot.id);
      next.push(structuredClone(snapshot));
      bySource.set(snapshot.sourceAttemptId, next);
    },
  };
}
