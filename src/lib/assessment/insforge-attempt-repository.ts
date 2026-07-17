import type { AttemptRepository } from "@/domain/assessment";
import type { Attempt, AttemptId, ParticipantId, Track } from "@/domain/assessment";
import { createInsForgeServerClient } from "@/lib/insforge/server";

type AttemptRow = {
  id: string;
  participant_id: string;
  track: string;
  content_version_id: string;
  status: string;
  started_at: string;
  completed_at: string | null;
  abandoned_at: string | null;
  is_primary: boolean;
};

function mapRow(row: AttemptRow): Attempt {
  return {
    id: row.id,
    participantId: row.participant_id,
    track: row.track as Track,
    contentVersionId: row.content_version_id,
    status: row.status as Attempt["status"],
    startedAt: new Date(row.started_at),
    completedAt: row.completed_at ? new Date(row.completed_at) : null,
    abandonedAt: row.abandoned_at ? new Date(row.abandoned_at) : null,
    isPrimary: row.is_primary,
  };
}

export function createInsForgeAttemptRepository(): AttemptRepository {
  return {
    async findOpenByParticipant(participantId: ParticipantId) {
      const client = await createInsForgeServerClient();
      const { data, error } = await client.database
        .from("attempts")
        .select("*")
        .eq("participant_id", participantId)
        .eq("status", "in_progress")
        .limit(1);

      if (error) {
        throw new Error(error.message ?? "Failed to load open Attempt");
      }
      const rows = (data ?? []) as AttemptRow[];
      if (rows.length === 0) return null;
      return mapRow(rows[0]);
    },

    async findById(id: AttemptId) {
      const client = await createInsForgeServerClient();
      const { data, error } = await client.database
        .from("attempts")
        .select("*")
        .eq("id", id)
        .limit(1);

      if (error) {
        throw new Error(error.message ?? "Failed to load Attempt");
      }
      const rows = (data ?? []) as AttemptRow[];
      if (rows.length === 0) return null;
      return mapRow(rows[0]);
    },

    async save(attempt: Attempt) {
      const client = await createInsForgeServerClient();
      const row = {
        id: attempt.id,
        participant_id: attempt.participantId,
        track: attempt.track,
        content_version_id: attempt.contentVersionId,
        status: attempt.status,
        started_at: attempt.startedAt.toISOString(),
        completed_at: attempt.completedAt?.toISOString() ?? null,
        abandoned_at: attempt.abandonedAt?.toISOString() ?? null,
        is_primary: attempt.isPrimary,
      };

      const { error } = await client.database.from("attempts").upsert([row]);
      if (error) {
        throw new Error(error.message ?? "Failed to save Attempt");
      }
    },

    async listCompletedByParticipant(participantId: ParticipantId) {
      const client = await createInsForgeServerClient();
      const { data, error } = await client.database
        .from("attempts")
        .select("*")
        .eq("participant_id", participantId)
        .eq("status", "completed");
      if (error) {
        throw new Error(error.message ?? "Failed to list completed Attempts");
      }
      return ((data ?? []) as AttemptRow[]).map(mapRow);
    },

    async listAllByParticipant(participantId: ParticipantId) {
      const client = await createInsForgeServerClient();
      const { data, error } = await client.database
        .from("attempts")
        .select("*")
        .eq("participant_id", participantId);
      if (error) {
        throw new Error(error.message ?? "Failed to list Attempts");
      }
      return ((data ?? []) as AttemptRow[]).map(mapRow);
    },

    async deleteAllByParticipant(participantId: ParticipantId) {
      const client = await createInsForgeServerClient();
      const { data, error: listError } = await client.database
        .from("attempts")
        .select("id")
        .eq("participant_id", participantId);
      if (listError) {
        throw new Error(listError.message ?? "Failed to list Attempts");
      }
      const ids = ((data ?? []) as Array<{ id: string }>).map((r) => r.id);
      if (ids.length === 0) return [];
      const { error } = await client.database
        .from("attempts")
        .delete()
        .eq("participant_id", participantId);
      if (error) {
        throw new Error(error.message ?? "Failed to delete Attempts");
      }
      return ids;
    },
  };
}
