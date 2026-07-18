import type { ResultSnapshotRepository } from "@/domain/assessment/ports";
import type { RulePayload } from "@/domain/assessment/career-rules";
import type { ResultSnapshot } from "@/domain/assessment/result-types";
import type { Track } from "@/domain/assessment/types";
import { createInsForgeServerClient } from "@/lib/insforge/server";

type SnapshotRow = {
  id: string;
  attempt_id: string;
  participant_id: string;
  track: string;
  content_version_id: string;
  norm_version: string;
  frozen_at: string;
  ability_profile: ResultSnapshot["abilityProfile"];
  composite_index: number;
  iq_estimate: number;
  rule_payload: RulePayload | null;
  insight_prose: string | null;
  action_plan_prose: string | null;
  pdf_url?: string | null;
  pdf_key?: string | null;
};

function mapRow(row: SnapshotRow): ResultSnapshot {
  return {
    id: row.id,
    attemptId: row.attempt_id,
    participantId: row.participant_id,
    track: row.track as Track,
    contentVersionId: row.content_version_id,
    normVersion: row.norm_version,
    frozenAt: new Date(row.frozen_at),
    abilityProfile: row.ability_profile,
    compositeIndex: row.composite_index,
    iqEstimate: row.iq_estimate,
    rulePayload: (row.rule_payload as RulePayload | null) ?? null,
    insightProse: row.insight_prose,
    actionPlanProse: row.action_plan_prose,
    pdfUrl: row.pdf_url ?? null,
    pdfKey: row.pdf_key ?? null,
  };
}

export function createInsForgeResultSnapshotRepository(): ResultSnapshotRepository {
  return {
    async findByAttemptId(attemptId) {
      const client = await createInsForgeServerClient();
      const { data, error } = await client.database
        .from("result_snapshots")
        .select("*")
        .eq("attempt_id", attemptId)
        .limit(1);
      if (error) throw new Error(error.message ?? "load snapshot failed");
      const rows = (data ?? []) as SnapshotRow[];
      return rows[0] ? mapRow(rows[0]) : null;
    },
    async findById(id) {
      const client = await createInsForgeServerClient();
      const { data, error } = await client.database
        .from("result_snapshots")
        .select("*")
        .eq("id", id)
        .limit(1);
      if (error) throw new Error(error.message ?? "load snapshot failed");
      const rows = (data ?? []) as SnapshotRow[];
      return rows[0] ? mapRow(rows[0]) : null;
    },
    async save(snapshot) {
      const client = await createInsForgeServerClient();
      const row = {
        id: snapshot.id,
        attempt_id: snapshot.attemptId,
        participant_id: snapshot.participantId,
        track: snapshot.track,
        content_version_id: snapshot.contentVersionId,
        norm_version: snapshot.normVersion,
        frozen_at: snapshot.frozenAt.toISOString(),
        ability_profile: snapshot.abilityProfile,
        composite_index: snapshot.compositeIndex,
        iq_estimate: snapshot.iqEstimate,
        rule_payload: snapshot.rulePayload,
        insight_prose: snapshot.insightProse,
        action_plan_prose: snapshot.actionPlanProse,
        pdf_url: snapshot.pdfUrl ?? null,
        pdf_key: snapshot.pdfKey ?? null,
      };
      const { error } = await client.database
        .from("result_snapshots")
        .upsert([row]);
      if (error) throw new Error(error.message ?? "save snapshot failed");
    },
    async deleteByAttemptIds(attemptIds) {
      if (attemptIds.length === 0) return;
      void attemptIds; // CASCADE from attempts delete
    },
  };
}
