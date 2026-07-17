import type { IntegrityEventRepository } from "@/domain/assessment/ports";
import type { IntegrityEvent } from "@/domain/assessment/integrity-types";
import { createInsForgeServerClient } from "@/lib/insforge/server";

type EventRow = {
  id: string;
  attempt_id: string;
  participant_id: string;
  domain_session_id: string | null;
  event_type: string;
  recorded_at: string;
  meta: Record<string, unknown> | null;
};

function mapRow(row: EventRow): IntegrityEvent {
  return {
    id: row.id,
    attemptId: row.attempt_id,
    participantId: row.participant_id,
    domainSessionId: row.domain_session_id,
    type: row.event_type as IntegrityEvent["type"],
    recordedAt: new Date(row.recorded_at),
    meta: row.meta,
  };
}

export function createInsForgeIntegrityEventRepository(): IntegrityEventRepository {
  return {
    async save(event) {
      const client = await createInsForgeServerClient();
      const row = {
        id: event.id,
        attempt_id: event.attemptId,
        participant_id: event.participantId,
        domain_session_id: event.domainSessionId,
        event_type: event.type,
        recorded_at: event.recordedAt.toISOString(),
        meta: event.meta,
      };
      const { error } = await client.database
        .from("integrity_events")
        .insert([row]);
      if (error) throw new Error(error.message ?? "save integrity event failed");
    },
    async listByAttempt(attemptId) {
      const client = await createInsForgeServerClient();
      const { data, error } = await client.database
        .from("integrity_events")
        .select("*")
        .eq("attempt_id", attemptId);
      if (error) throw new Error(error.message ?? "list integrity events failed");
      return ((data ?? []) as EventRow[]).map(mapRow);
    },
    async deleteAllByParticipant(participantId) {
      const client = await createInsForgeServerClient();
      const { error } = await client.database
        .from("integrity_events")
        .delete()
        .eq("participant_id", participantId);
      if (error) {
        throw new Error(error.message ?? "delete integrity events failed");
      }
    },
  };
}
