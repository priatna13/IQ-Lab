import type { DomainSessionRepository } from "@/domain/assessment";
import type { DomainSession } from "@/domain/assessment";
import { createInsForgeServerClient } from "@/lib/insforge/server";

type SessionRow = {
  id: string;
  attempt_id: string;
  participant_id: string;
  domain_id: string;
  sequence_index: number;
  status: string;
  started_at: string;
  ends_at: string;
  closed_at: string | null;
  close_reason: string | null;
  raw_correct: number | null;
  raw_total: number | null;
};

function mapRow(row: SessionRow): DomainSession {
  return {
    id: row.id,
    attemptId: row.attempt_id,
    participantId: row.participant_id,
    domainId: row.domain_id,
    sequenceIndex: row.sequence_index,
    status: row.status as DomainSession["status"],
    startedAt: new Date(row.started_at),
    endsAt: new Date(row.ends_at),
    closedAt: row.closed_at ? new Date(row.closed_at) : null,
    closeReason: row.close_reason as DomainSession["closeReason"],
    rawCorrect: row.raw_correct,
    rawTotal: row.raw_total,
  };
}

function toRow(session: DomainSession) {
  return {
    id: session.id,
    attempt_id: session.attemptId,
    participant_id: session.participantId,
    domain_id: session.domainId,
    sequence_index: session.sequenceIndex,
    status: session.status,
    started_at: session.startedAt.toISOString(),
    ends_at: session.endsAt.toISOString(),
    closed_at: session.closedAt?.toISOString() ?? null,
    close_reason: session.closeReason,
    raw_correct: session.rawCorrect,
    raw_total: session.rawTotal,
  };
}

export function createInsForgeDomainSessionRepository(): DomainSessionRepository {
  return {
    async findById(id) {
      const client = await createInsForgeServerClient();
      const { data, error } = await client.database
        .from("domain_sessions")
        .select("*")
        .eq("id", id)
        .limit(1);
      if (error) throw new Error(error.message ?? "load domain session failed");
      const rows = (data ?? []) as SessionRow[];
      return rows[0] ? mapRow(rows[0]) : null;
    },
    async findByAttemptAndDomain(attemptId, domainId) {
      const client = await createInsForgeServerClient();
      const { data, error } = await client.database
        .from("domain_sessions")
        .select("*")
        .eq("attempt_id", attemptId)
        .eq("domain_id", domainId)
        .limit(1);
      if (error) throw new Error(error.message ?? "load domain session failed");
      const rows = (data ?? []) as SessionRow[];
      return rows[0] ? mapRow(rows[0]) : null;
    },
    async listByAttempt(attemptId) {
      const client = await createInsForgeServerClient();
      const { data, error } = await client.database
        .from("domain_sessions")
        .select("*")
        .eq("attempt_id", attemptId);
      if (error) throw new Error(error.message ?? "list domain sessions failed");
      return ((data ?? []) as SessionRow[]).map(mapRow);
    },
    async save(session) {
      const client = await createInsForgeServerClient();
      const { error } = await client.database
        .from("domain_sessions")
        .upsert([toRow(session)]);
      if (error) throw new Error(error.message ?? "save domain session failed");
    },
  };
}
