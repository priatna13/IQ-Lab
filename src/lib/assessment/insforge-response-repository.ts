import type { ResponseRepository } from "@/domain/assessment";
import type { Response } from "@/domain/assessment";
import { createInsForgeServerClient } from "@/lib/insforge/server";

type ResponseRow = {
  id: string;
  domain_session_id: string;
  attempt_id: string;
  participant_id: string;
  item_id: string;
  answer: string;
  updated_at: string;
};

function mapRow(row: ResponseRow): Response {
  return {
    id: row.id,
    domainSessionId: row.domain_session_id,
    attemptId: row.attempt_id,
    participantId: row.participant_id,
    itemId: row.item_id,
    answer: row.answer,
    updatedAt: new Date(row.updated_at),
  };
}

export function createInsForgeResponseRepository(): ResponseRepository {
  return {
    async listBySession(sessionId) {
      const client = await createInsForgeServerClient();
      const { data, error } = await client.database
        .from("responses")
        .select("*")
        .eq("domain_session_id", sessionId);
      if (error) throw new Error(error.message ?? "list responses failed");
      return ((data ?? []) as ResponseRow[]).map(mapRow);
    },
    async findBySessionAndItem(sessionId, itemId) {
      const client = await createInsForgeServerClient();
      const { data, error } = await client.database
        .from("responses")
        .select("*")
        .eq("domain_session_id", sessionId)
        .eq("item_id", itemId)
        .limit(1);
      if (error) throw new Error(error.message ?? "find response failed");
      const rows = (data ?? []) as ResponseRow[];
      return rows[0] ? mapRow(rows[0]) : null;
    },
    async upsert(response) {
      const client = await createInsForgeServerClient();
      const row = {
        id: response.id,
        domain_session_id: response.domainSessionId,
        attempt_id: response.attemptId,
        participant_id: response.participantId,
        item_id: response.itemId,
        answer: response.answer,
        updated_at: response.updatedAt.toISOString(),
      };
      const { error } = await client.database.from("responses").upsert([row]);
      if (error) throw new Error(error.message ?? "upsert response failed");
    },
    async deleteByAttemptIds(attemptIds) {
      if (attemptIds.length === 0) return;
      void attemptIds; // CASCADE from attempts delete
    },
  };
}
