import { createInsForgeAdminClient } from "@/lib/insforge/admin-client";
import type { AbilityProfile } from "@/domain/assessment";
import type { RulePayload } from "@/domain/assessment/career-rules";
import type { Track } from "@/domain/assessment/types";

export type AdminAttemptRow = {
  id: string;
  participantId: string;
  participantEmail: string | null;
  participantName: string | null;
  track: Track;
  status: string;
  contentVersionId: string;
  isPrimary: boolean;
  startedAt: string;
  completedAt: string | null;
  abandonedAt: string | null;
  compositeIndex: number | null;
  iqEstimate: number | null;
  hasSnapshot: boolean;
};

export type AdminDomainSessionRow = {
  id: string;
  domainId: string;
  sequenceIndex: number;
  status: string;
  closeReason: string | null;
  rawCorrect: number | null;
  rawTotal: number | null;
  startedAt: string;
  endsAt: string;
  closedAt: string | null;
};

export type AdminAttemptDetail = {
  attempt: AdminAttemptRow;
  abilityProfile: AbilityProfile;
  compositeIndex: number | null;
  iqEstimate: number | null;
  normVersion: string | null;
  insightProse: string | null;
  actionPlanProse: string | null;
  rulePayload: RulePayload | null;
  domainSessions: AdminDomainSessionRow[];
  frozenAt: string | null;
};

type AttemptDb = {
  id: string;
  participant_id: string;
  track: string;
  status: string;
  content_version_id: string;
  is_primary: boolean;
  started_at: string;
  completed_at: string | null;
  abandoned_at: string | null;
};

type SnapshotDb = {
  attempt_id: string;
  participant_id: string;
  composite_index: number;
  iq_estimate: number;
  ability_profile: AbilityProfile;
  rule_payload: RulePayload | null;
  insight_prose: string | null;
  action_plan_prose: string | null;
  norm_version: string;
  frozen_at: string;
};

type SessionDb = {
  id: string;
  attempt_id: string;
  domain_id: string;
  sequence_index: number;
  status: string;
  close_reason: string | null;
  raw_correct: number | null;
  raw_total: number | null;
  started_at: string;
  ends_at: string;
  closed_at: string | null;
};

type UserMeta = { email: string | null; name: string | null };

type UserDirRow = {
  id: string;
  email: string | null;
  display_name: string | null;
};

/**
 * Load id → { email, name } via SECURITY DEFINER RPC (auth.users).
 * Fallback: per-id auth profile + empty email if RPC unavailable.
 */
async function loadUserMetaMap(
  admin: ReturnType<typeof createInsForgeAdminClient>,
  ids: string[],
): Promise<Map<string, UserMeta>> {
  const map = new Map<string, UserMeta>();
  const unique = [...new Set(ids.filter(Boolean))];
  for (const id of unique) {
    map.set(id, { email: null, name: null });
  }

  try {
    const { data, error } = await admin.database.rpc("admin_user_directory");
    if (!error && Array.isArray(data)) {
      for (const row of data as UserDirRow[]) {
        if (!row?.id) continue;
        map.set(String(row.id), {
          email: row.email ? String(row.email) : null,
          name: row.display_name ? String(row.display_name) : null,
        });
      }
      return map;
    }
    if (error) {
      console.warn("[admin] admin_user_directory RPC:", error.message);
    }
  } catch (e) {
    console.warn("[admin] admin_user_directory failed", e);
  }

  // Fallback: profile name only (no email without RPC)
  for (const id of unique) {
    try {
      const { data } = await admin.auth.getProfile(id);
      if (data && typeof data === "object") {
        const p = data as Record<string, unknown>;
        const name =
          typeof p.name === "string"
            ? p.name
            : typeof p.display_name === "string"
              ? p.display_name
              : null;
        map.set(id, { email: null, name });
      }
    } catch {
      // ignore
    }
  }
  return map;
}

function labelParticipant(m: UserMeta | undefined, id: string): {
  email: string | null;
  name: string | null;
} {
  return {
    email: m?.email ?? null,
    name: m?.name ?? null,
  };
}

export async function listAdminAttempts(): Promise<AdminAttemptRow[]> {
  const admin = createInsForgeAdminClient();
  const { data: attempts, error } = await admin.database
    .from("attempts")
    .select("*")
    .order("started_at", { ascending: false })
    .limit(200);
  if (error) throw new Error(error.message ?? "Gagal memuat attempts");

  const rows = (attempts ?? []) as AttemptDb[];
  const { data: snaps } = await admin.database
    .from("result_snapshots")
    .select("attempt_id,participant_id,composite_index,iq_estimate,frozen_at")
    .limit(500);
  const snapByAttempt = new Map<string, { composite: number; iq: number }>();
  for (const s of (snaps ?? []) as Array<{
    attempt_id: string;
    composite_index: number;
    iq_estimate: number;
  }>) {
    snapByAttempt.set(s.attempt_id, {
      composite: s.composite_index,
      iq: s.iq_estimate,
    });
  }

  const meta = await loadUserMetaMap(
    admin,
    rows.map((r) => r.participant_id),
  );

  return rows.map((r) => {
    const snap = snapByAttempt.get(r.id);
    const m = labelParticipant(meta.get(r.participant_id), r.participant_id);
    return {
      id: r.id,
      participantId: r.participant_id,
      participantEmail: m.email,
      participantName: m.name,
      track: r.track as Track,
      status: r.status,
      contentVersionId: r.content_version_id,
      isPrimary: Boolean(r.is_primary),
      startedAt: r.started_at,
      completedAt: r.completed_at,
      abandonedAt: r.abandoned_at,
      compositeIndex: snap?.composite ?? null,
      iqEstimate: snap?.iq ?? null,
      hasSnapshot: Boolean(snap),
    };
  });
}

export async function getAdminAttemptDetail(
  attemptId: string,
): Promise<AdminAttemptDetail | null> {
  const admin = createInsForgeAdminClient();
  const { data: attemptRows, error } = await admin.database
    .from("attempts")
    .select("*")
    .eq("id", attemptId)
    .limit(1);
  if (error) throw new Error(error.message ?? "Gagal memuat attempt");
  const attempt = ((attemptRows ?? []) as AttemptDb[])[0];
  if (!attempt) return null;

  const { data: snapRows } = await admin.database
    .from("result_snapshots")
    .select("*")
    .eq("attempt_id", attemptId)
    .limit(1);
  const snap = ((snapRows ?? []) as SnapshotDb[])[0] ?? null;

  const { data: sessionRows } = await admin.database
    .from("domain_sessions")
    .select("*")
    .eq("attempt_id", attemptId)
    .order("sequence_index", { ascending: true });
  const sessions = ((sessionRows ?? []) as SessionDb[]).map((s) => ({
    id: s.id,
    domainId: s.domain_id,
    sequenceIndex: s.sequence_index,
    status: s.status,
    closeReason: s.close_reason,
    rawCorrect: s.raw_correct,
    rawTotal: s.raw_total,
    startedAt: s.started_at,
    endsAt: s.ends_at,
    closedAt: s.closed_at,
  }));

  const meta = await loadUserMetaMap(admin, [attempt.participant_id]);
  const m = labelParticipant(
    meta.get(attempt.participant_id),
    attempt.participant_id,
  );

  const attemptRow: AdminAttemptRow = {
    id: attempt.id,
    participantId: attempt.participant_id,
    participantEmail: m.email,
    participantName: m.name,
    track: attempt.track as Track,
    status: attempt.status,
    contentVersionId: attempt.content_version_id,
    isPrimary: Boolean(attempt.is_primary),
    startedAt: attempt.started_at,
    completedAt: attempt.completed_at,
    abandonedAt: attempt.abandoned_at,
    compositeIndex: snap?.composite_index ?? null,
    iqEstimate: snap?.iq_estimate ?? null,
    hasSnapshot: Boolean(snap),
  };

  return {
    attempt: attemptRow,
    abilityProfile: snap?.ability_profile ?? [],
    compositeIndex: snap?.composite_index ?? null,
    iqEstimate: snap?.iq_estimate ?? null,
    normVersion: snap?.norm_version ?? null,
    insightProse: snap?.insight_prose ?? null,
    actionPlanProse: snap?.action_plan_prose ?? null,
    rulePayload: snap?.rule_payload ?? null,
    domainSessions: sessions,
    frozenAt: snap?.frozen_at ?? null,
  };
}
