import type { Attempt } from "@/domain/assessment";
import type { ResultSnapshot } from "@/domain/assessment/result-types";
import type { FieldId } from "@/domain/assessment/skill/types";
import type {
  SkillAttempt,
  SkillResultSnapshot,
} from "@/domain/assessment/skill/types";
import { recommendFields } from "@/domain/assessment/skill/field-recommendation";
import {
  ensureServerAuthSession,
  type EnsureSessionFail,
} from "@/lib/auth/ensure-session";
import { createServerAssessmentPorts } from "@/lib/assessment/ports-factory";
import type { SessionUser } from "@/lib/auth/session";

export type KeahlianPageData = {
  user: SessionUser;
  attempt: Attempt;
  snapshot: ResultSnapshot;
  recommended: FieldId[];
  completedFieldIds: FieldId[];
  skillSnapshots: SkillResultSnapshot[];
  openSkill: SkillAttempt | null;
  diagnostics: {
    refreshed: boolean;
    userId: string;
    attemptId: string;
  };
};

export type LoadKeahlianResult =
  | { kind: "ok"; data: KeahlianPageData }
  | {
      kind: "unauthenticated";
      code: string;
      message: string;
      detail?: string;
    }
  | {
      kind: "not_found";
      code: string;
      message: string;
      detail?: string;
    }
  | {
      kind: "invalid_state";
      code: string;
      message: string;
      redirectTo: string;
    }
  | {
      kind: "error";
      code: string;
      message: string;
      detail?: string;
    };

/**
 * Sequential load (never Promise.all auth+DB):
 *   ensureSession → getCurrentUser done inside
 *   → attempts.findById
 *   → result_snapshots
 *   → skill lists
 *
 * Never throws for expected auth/data failures — returns diagnostic codes.
 */
export async function loadKeahlianPage(
  attemptId: string,
): Promise<LoadKeahlianResult> {
  console.info("[ASSESSMENT] start", { attemptId, path: "keahlian" });

  const session = await ensureServerAuthSession();
  if (!session.ok) {
    const fail = session as EnsureSessionFail;
    if (fail.code === "NO_SESSION_COOKIES") {
      return {
        kind: "unauthenticated",
        code: fail.code,
        message: fail.message,
        detail: fail.detail,
      };
    }
    // Cookie present but session broken — still treat as unauthenticated for UX,
    // keep diagnostic message for the login redirect page if needed.
    return {
      kind: "unauthenticated",
      code: fail.code,
      message: fail.message,
      detail: fail.detail,
    };
  }

  const { user, refreshed } = session;
  console.info("[ASSESSMENT] auth ok", {
    userId: user.id,
    email: user.email,
    refreshed,
  });

  try {
    // Repositories share React-cached createInsForgeServerClient
    // already warmed by ensureServerAuthSession + getCurrentUser.
    const ports = createServerAssessmentPorts();

    // 1) Attempt — ONLY after getCurrentUser completed above
    const attempt = await ports.attempts.findById(attemptId);
    console.info("[ASSESSMENT] attempt result", {
      hasData: Boolean(attempt),
      attemptParticipantId: attempt?.participantId ?? null,
      sessionUserId: user.id,
      status: attempt?.status ?? null,
    });

    if (!attempt) {
      return {
        kind: "not_found",
        code: "ATTEMPT_NOT_FOUND",
        message: `ATTEMPT_NOT_FOUND: attempt=${attemptId}, user=${user.id}`,
        detail:
          "Baris tidak terlihat (tidak ada / RLS menolak). Kolom ownership = participant_id, bukan user_id.",
      };
    }

    if (attempt.participantId !== user.id) {
      return {
        kind: "not_found",
        code: "ATTEMPT_OWNERSHIP_MISMATCH",
        message: `ATTEMPT_OWNERSHIP_MISMATCH: attempt.participant_id=${attempt.participantId} session.user.id=${user.id}`,
        detail: "Akun login bukan pemilik asesmen ini.",
      };
    }

    if (attempt.status !== "completed") {
      return {
        kind: "invalid_state",
        code: "ATTEMPT_NOT_COMPLETED",
        message: `ATTEMPT_NOT_COMPLETED: status=${attempt.status}`,
        redirectTo: `/asesmen/${attemptId}`,
      };
    }

    // 2) Snapshot — after attempt ownership confirmed
    const snapshot = await ports.resultSnapshots.findByAttemptId(attemptId);
    console.info("[ASSESSMENT] snapshot result", {
      hasData: Boolean(snapshot),
      attemptId,
    });

    if (!snapshot) {
      return {
        kind: "not_found",
        code: "SNAPSHOT_NOT_FOUND",
        message: `SNAPSHOT_NOT_FOUND: attempt=${attemptId}, user=${user.id}`,
        detail: "Attempt completed tapi result_snapshots kosong / RLS hide.",
      };
    }

    if (snapshot.participantId !== user.id) {
      return {
        kind: "not_found",
        code: "SNAPSHOT_OWNERSHIP_MISMATCH",
        message: `SNAPSHOT_OWNERSHIP_MISMATCH: snapshot.participant_id=${snapshot.participantId} session=${user.id}`,
      };
    }

    const abilityProfile = Array.isArray(snapshot.abilityProfile)
      ? snapshot.abilityProfile
      : [];

    const recommended = recommendFields(
      abilityProfile,
      snapshot.rulePayload,
      3,
    );

    // 3) Skill lists — sequential, after auth
    const skillAttempts =
      await ports.skillAttempts.listBySourceAttempt(attemptId);
    const completedFieldIds = skillAttempts
      .filter((a) => a.status === "completed")
      .map((a) => a.fieldId) as FieldId[];

    const skillSnapshots =
      await ports.skillSnapshots.listBySourceAttempt(attemptId);
    const openSkill = await ports.skillAttempts.findOpenByParticipant(
      user.id,
    );

    console.info("[ASSESSMENT] skill lists ok", {
      skillAttempts: skillAttempts.length,
      skillSnapshots: skillSnapshots.length,
      openSkill: openSkill?.id ?? null,
    });

    return {
      kind: "ok",
      data: {
        user,
        attempt,
        snapshot,
        recommended,
        completedFieldIds,
        skillSnapshots,
        openSkill,
        diagnostics: {
          refreshed,
          userId: user.id,
          attemptId,
        },
      },
    };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : `UNKNOWN: ${String(err)}`;
    const stack = err instanceof Error ? err.stack : undefined;
    console.error("[ASSESSMENT_FATAL]", {
      attemptId,
      userId: user.id,
      message,
      stack,
    });
    return {
      kind: "error",
      code: "ASSESSMENT_QUERY_FAILED",
      message: `ASSESSMENT_QUERY_FAILED: ${message}`,
      detail: stack?.slice(0, 1200),
    };
  }
}
