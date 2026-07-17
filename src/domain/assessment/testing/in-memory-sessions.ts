import type {
  DomainSessionRepository,
  ResponseRepository,
} from "../ports";
import type { DomainSession, Response } from "../session-types";

export function createInMemoryDomainSessionRepository(): DomainSessionRepository {
  const byId = new Map<string, DomainSession>();

  return {
    async findById(id) {
      const s = byId.get(id);
      return s ? { ...s } : null;
    },
    async findByAttemptAndDomain(attemptId, domainId) {
      for (const s of byId.values()) {
        if (s.attemptId === attemptId && s.domainId === domainId) {
          return { ...s };
        }
      }
      return null;
    },
    async listByAttempt(attemptId) {
      return [...byId.values()]
        .filter((s) => s.attemptId === attemptId)
        .map((s) => ({ ...s }));
    },
    async save(session) {
      byId.set(session.id, { ...session });
    },
  };
}

export function createInMemoryResponseRepository(): ResponseRepository {
  const byKey = new Map<string, Response>();

  const key = (sessionId: string, itemId: string) => `${sessionId}::${itemId}`;

  return {
    async listBySession(sessionId) {
      return [...byKey.values()]
        .filter((r) => r.domainSessionId === sessionId)
        .map((r) => ({ ...r }));
    },
    async findBySessionAndItem(sessionId, itemId) {
      const found = byKey.get(key(sessionId, itemId));
      return found ? { ...found } : null;
    },
    async upsert(response) {
      byKey.set(key(response.domainSessionId, response.itemId), {
        ...response,
      });
    },
  };
}
