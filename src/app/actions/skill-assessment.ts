"use server";

import { AssessmentError, type PublicResultReport } from "@/domain/assessment";
import { createSkillAttempt } from "@/domain/assessment/skill/create-skill-attempt";
import { completeSkillAttempt, toPublicSkillResult } from "@/domain/assessment/skill/complete-skill-attempt";
import { abandonSkillAttempt } from "@/domain/assessment/skill/abandon-skill-attempt";
import { upsertSkillResponse, getSkillRunnerView } from "@/domain/assessment/skill/skill-session";
import { recommendFields } from "@/domain/assessment/skill/field-recommendation";
import { FIELD_CATEGORIES, FIELD_DEFS, isFieldId } from "@/domain/assessment/skill/field-catalog";
import type { PublicSkillResult, PublicSkillRunnerView } from "@/domain/assessment/skill/types";
import { getSessionUser } from "@/lib/auth/session";
import { createServerAssessmentPorts } from "@/lib/assessment/ports-factory";
import { redirect } from "next/navigation";
import { trackProductEvent } from "@/lib/analytics/track";

function isNextRedirect(err: unknown): boolean {
  return (
    !!err &&
    typeof err === "object" &&
    "digest" in err &&
    String((err as { digest?: string }).digest).startsWith("NEXT_REDIRECT")
  );
}

export type StartSkillResult = { ok: boolean; error?: string };

export async function startSkillAttemptAction(
  _prev: StartSkillResult | null,
  formData: FormData,
): Promise<StartSkillResult> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "Anda harus masuk terlebih dahulu." };

  const sourceAttemptId = String(formData.get("sourceAttemptId") ?? "");
  const fieldId = String(formData.get("fieldId") ?? "");
  if (!sourceAttemptId || !isFieldId(fieldId)) {
    return { ok: false, error: "Pilih bidang/role yang valid." };
  }

  const ports = createServerAssessmentPorts();
  try {
    const attempt = await createSkillAttempt(ports, {
      participantId: user.id,
      sourceAttemptId,
      fieldId,
    });
    trackProductEvent(
      "skill_attempt_started",
      { fieldId, sourceAttemptId },
      { distinctId: user.id },
    );
    redirect(
      `/asesmen/${sourceAttemptId}/keahlian/${fieldId}/sesi?sid=${attempt.id}`,
    );
  } catch (err) {
    if (isNextRedirect(err)) throw err;
    if (err instanceof AssessmentError) {
      return { ok: false, error: err.message };
    }
    console.error(err);
    return { ok: false, error: "Gagal memulai asesmen keahlian." };
  }
}

export async function saveSkillResponseAction(input: {
  skillAttemptId: string;
  itemId: string;
  answer: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "Sesi tidak valid." };
  const ports = createServerAssessmentPorts();
  try {
    await upsertSkillResponse(ports, {
      skillAttemptId: input.skillAttemptId,
      participantId: user.id,
      itemId: input.itemId,
      answer: input.answer,
    });
    return { ok: true };
  } catch (err) {
    if (err instanceof AssessmentError) return { ok: false, error: err.message };
    console.error(err);
    return { ok: false, error: "Gagal menyimpan jawaban." };
  }
}

export async function completeSkillAttemptAction(
  skillAttemptId: string,
  sourceAttemptId: string,
  fieldId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "Sesi tidak valid." };
  const ports = createServerAssessmentPorts();
  try {
    const snap = await completeSkillAttempt(ports, {
      skillAttemptId,
      participantId: user.id,
    });
    trackProductEvent(
      "skill_attempt_completed",
      { fieldId: snap.fieldId, score: snap.score },
      { distinctId: user.id },
    );
    redirect(`/asesmen/${sourceAttemptId}/keahlian/${fieldId}/hasil`);
  } catch (err) {
    if (isNextRedirect(err)) throw err;
    if (err instanceof AssessmentError) return { ok: false, error: err.message };
    console.error(err);
    return { ok: false, error: "Gagal menyelesaikan asesmen keahlian." };
  }
}

/**
 * Abandon open skill session so participant can pick another field.
 * Redirects back to the skill picker for the source cognitive attempt.
 */
export async function abandonSkillAttemptAction(
  skillAttemptId: string,
  sourceAttemptId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "Sesi tidak valid." };
  const ports = createServerAssessmentPorts();
  try {
    await abandonSkillAttempt(ports, {
      skillAttemptId,
      participantId: user.id,
    });
    trackProductEvent(
      "skill_attempt_abandoned",
      { sourceAttemptId },
      { distinctId: user.id },
    );
    redirect(`/asesmen/${sourceAttemptId}/keahlian`);
  } catch (err) {
    if (isNextRedirect(err)) throw err;
    if (err instanceof AssessmentError) return { ok: false, error: err.message };
    console.error(err);
    return { ok: false, error: "Gagal membatalkan asesmen keahlian." };
  }
}

export async function refreshSkillRunnerViewAction(
  skillAttemptId: string,
): Promise<{ ok: true; view: PublicSkillRunnerView } | { ok: false; error: string }> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "Sesi tidak valid." };
  const ports = createServerAssessmentPorts();
  try {
    const view = await getSkillRunnerView(ports, {
      skillAttemptId,
      participantId: user.id,
    });
    return { ok: true, view };
  } catch (err) {
    if (err instanceof AssessmentError) return { ok: false, error: err.message };
    return { ok: false, error: "Gagal memuat runner." };
  }
}

export {
  recommendFields,
  FIELD_CATEGORIES,
  FIELD_DEFS,
  toPublicSkillResult,
};
export type { PublicResultReport, PublicSkillResult, PublicSkillRunnerView };
