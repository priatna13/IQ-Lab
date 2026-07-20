import type {
  SkillAttemptRepository,
  SkillResponseRepository,
  SkillResultSnapshotRepository,
} from "@/domain/assessment/skill/ports";
import type {
  DomainAlignment,
  FieldCategoryId,
  FieldId,
  SkillAttempt,
  SkillResponse,
  SkillResultSnapshot,
} from "@/domain/assessment/skill/types";
import { createInsForgeServerClient } from "@/lib/insforge/server";

type SkillAttemptRow = {
  id: string;
  participant_id: string;
  source_attempt_id: string;
  field_id: string;
  skill_content_version_id: string;
  status: string;
  started_at: string;
  completed_at: string | null;
  ends_at: string;
};

type SkillResponseRow = {
  id: string;
  skill_attempt_id: string;
  item_id: string;
  answer: string;
  updated_at: string;
};

type SkillSnapshotRow = {
  id: string;
  skill_attempt_id: string;
  participant_id: string;
  source_attempt_id: string;
  field_id: string;
  field_label: string;
  category_id: string;
  category_label: string;
  skill_content_version_id: string;
  raw_correct: number;
  raw_total: number;
  score: number;
  domain_alignment: DomainAlignment;
  insight_prose: string;
  frozen_at: string;
};

function mapAttempt(row: SkillAttemptRow): SkillAttempt {
  return {
    id: row.id,
    participantId: row.participant_id,
    sourceAttemptId: row.source_attempt_id,
    fieldId: row.field_id as FieldId,
    skillContentVersionId: row.skill_content_version_id,
    status: row.status as SkillAttempt["status"],
    startedAt: new Date(row.started_at),
    completedAt: row.completed_at ? new Date(row.completed_at) : null,
    endsAt: new Date(row.ends_at),
  };
}

function mapResponse(row: SkillResponseRow): SkillResponse {
  return {
    id: row.id,
    skillAttemptId: row.skill_attempt_id,
    itemId: row.item_id,
    answer: row.answer,
    updatedAt: new Date(row.updated_at),
  };
}

function mapSnapshot(row: SkillSnapshotRow): SkillResultSnapshot {
  return {
    id: row.id,
    skillAttemptId: row.skill_attempt_id,
    participantId: row.participant_id,
    sourceAttemptId: row.source_attempt_id,
    fieldId: row.field_id as FieldId,
    fieldLabel: row.field_label,
    categoryId: row.category_id as FieldCategoryId,
    categoryLabel: row.category_label,
    skillContentVersionId: row.skill_content_version_id,
    rawCorrect: row.raw_correct,
    rawTotal: row.raw_total,
    score: row.score,
    domainAlignment: row.domain_alignment,
    insightProse: row.insight_prose,
    frozenAt: new Date(row.frozen_at),
  };
}

export function createInsForgeSkillAttemptRepository(): SkillAttemptRepository {
  return {
    async findById(id) {
      const client = await createInsForgeServerClient();
      const { data, error } = await client.database
        .from("skill_attempts")
        .select("*")
        .eq("id", id)
        .limit(1);
      if (error) throw new Error(error.message ?? "skill_attempts load failed");
      const rows = (data ?? []) as SkillAttemptRow[];
      return rows[0] ? mapAttempt(rows[0]) : null;
    },

    async findOpenByParticipant(participantId) {
      const client = await createInsForgeServerClient();
      const { data, error } = await client.database
        .from("skill_attempts")
        .select("*")
        .eq("participant_id", participantId)
        .eq("status", "in_progress")
        .limit(1);
      if (error) throw new Error(error.message ?? "skill_attempts open failed");
      const rows = (data ?? []) as SkillAttemptRow[];
      return rows[0] ? mapAttempt(rows[0]) : null;
    },

    async findCompletedBySourceAndField(sourceAttemptId, fieldId) {
      const client = await createInsForgeServerClient();
      const { data, error } = await client.database
        .from("skill_attempts")
        .select("*")
        .eq("source_attempt_id", sourceAttemptId)
        .eq("field_id", fieldId)
        .eq("status", "completed")
        .limit(1);
      if (error) throw new Error(error.message ?? "skill_attempts completed failed");
      const rows = (data ?? []) as SkillAttemptRow[];
      return rows[0] ? mapAttempt(rows[0]) : null;
    },

    async listBySourceAttempt(sourceAttemptId) {
      const client = await createInsForgeServerClient();
      const { data, error } = await client.database
        .from("skill_attempts")
        .select("*")
        .eq("source_attempt_id", sourceAttemptId);
      if (error) throw new Error(error.message ?? "skill_attempts list failed");
      return ((data ?? []) as SkillAttemptRow[]).map(mapAttempt);
    },

    async listByParticipant(participantId) {
      const client = await createInsForgeServerClient();
      const { data, error } = await client.database
        .from("skill_attempts")
        .select("*")
        .eq("participant_id", participantId);
      if (error) throw new Error(error.message ?? "skill_attempts list failed");
      return ((data ?? []) as SkillAttemptRow[]).map(mapAttempt);
    },

    async save(attempt) {
      const client = await createInsForgeServerClient();
      const row = {
        id: attempt.id,
        participant_id: attempt.participantId,
        source_attempt_id: attempt.sourceAttemptId,
        field_id: attempt.fieldId,
        skill_content_version_id: attempt.skillContentVersionId,
        status: attempt.status,
        started_at: attempt.startedAt.toISOString(),
        completed_at: attempt.completedAt?.toISOString() ?? null,
        ends_at: attempt.endsAt.toISOString(),
      };
      const { error } = await client.database.from("skill_attempts").upsert([row]);
      if (error) throw new Error(error.message ?? "skill_attempts save failed");
    },
  };
}

export function createInsForgeSkillResponseRepository(): SkillResponseRepository {
  return {
    async listBySkillAttempt(skillAttemptId) {
      const client = await createInsForgeServerClient();
      const { data, error } = await client.database
        .from("skill_responses")
        .select("*")
        .eq("skill_attempt_id", skillAttemptId);
      if (error) throw new Error(error.message ?? "skill_responses list failed");
      return ((data ?? []) as SkillResponseRow[]).map(mapResponse);
    },

    async upsert(response) {
      const client = await createInsForgeServerClient();
      const row = {
        id: response.id,
        skill_attempt_id: response.skillAttemptId,
        item_id: response.itemId,
        answer: response.answer,
        updated_at: response.updatedAt.toISOString(),
      };
      const { error } = await client.database.from("skill_responses").upsert([row]);
      if (error) throw new Error(error.message ?? "skill_responses upsert failed");
    },
  };
}

export function createInsForgeSkillSnapshotRepository(): SkillResultSnapshotRepository {
  return {
    async findBySkillAttemptId(skillAttemptId) {
      const client = await createInsForgeServerClient();
      const { data, error } = await client.database
        .from("skill_result_snapshots")
        .select("*")
        .eq("skill_attempt_id", skillAttemptId)
        .limit(1);
      if (error) throw new Error(error.message ?? "skill snapshot load failed");
      const rows = (data ?? []) as SkillSnapshotRow[];
      return rows[0] ? mapSnapshot(rows[0]) : null;
    },

    async listBySourceAttempt(sourceAttemptId) {
      const client = await createInsForgeServerClient();
      const { data, error } = await client.database
        .from("skill_result_snapshots")
        .select("*")
        .eq("source_attempt_id", sourceAttemptId);
      if (error) throw new Error(error.message ?? "skill snapshot list failed");
      return ((data ?? []) as SkillSnapshotRow[]).map(mapSnapshot);
    },

    async save(snapshot) {
      const client = await createInsForgeServerClient();
      const row = {
        id: snapshot.id,
        skill_attempt_id: snapshot.skillAttemptId,
        participant_id: snapshot.participantId,
        source_attempt_id: snapshot.sourceAttemptId,
        field_id: snapshot.fieldId,
        field_label: snapshot.fieldLabel,
        category_id: snapshot.categoryId,
        category_label: snapshot.categoryLabel,
        skill_content_version_id: snapshot.skillContentVersionId,
        raw_correct: snapshot.rawCorrect,
        raw_total: snapshot.rawTotal,
        score: snapshot.score,
        domain_alignment: snapshot.domainAlignment,
        insight_prose: snapshot.insightProse,
        frozen_at: snapshot.frozenAt.toISOString(),
      };
      const { error } = await client.database
        .from("skill_result_snapshots")
        .upsert([row]);
      if (error) throw new Error(error.message ?? "skill snapshot save failed");
    },
  };
}
