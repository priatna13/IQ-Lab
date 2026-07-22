import type { LoadKeahlianResult } from "@/lib/assessment/load-owned-assessment";
import type { KeahlianApiResponse } from "@/lib/assessment/keahlian-types";
import { getFieldDef } from "@/domain/assessment/skill/field-catalog";

/** Server-only mapper (safe to import from Route Handlers / RSC). */
export function toKeahlianApiResponse(
  attemptId: string,
  result: LoadKeahlianResult,
): KeahlianApiResponse {
  if (result.kind === "ok") {
    const { data } = result;
    const openSkill = data.openSkill
      ? {
          id: data.openSkill.id,
          fieldId: data.openSkill.fieldId,
          sourceAttemptId: data.openSkill.sourceAttemptId,
          fieldLabel:
            getFieldDef(data.openSkill.fieldId)?.label ??
            data.openSkill.fieldId,
        }
      : null;

    return {
      ok: true,
      view: {
        recommended: data.recommended,
        completedFieldIds: data.completedFieldIds,
        skillSnapshots: data.skillSnapshots.map((s) => ({
          id: s.id,
          fieldId: s.fieldId,
          fieldLabel: s.fieldLabel,
          score: s.score,
        })),
        openSkill,
        openForThisSource: Boolean(
          openSkill && openSkill.sourceAttemptId === attemptId,
        ),
        openOtherSource: Boolean(
          openSkill && openSkill.sourceAttemptId !== attemptId,
        ),
        diagnostics: {
          refreshed: data.diagnostics.refreshed,
          userId: data.diagnostics.userId,
          attemptId: data.diagnostics.attemptId,
        },
      },
    };
  }

  if (result.kind === "invalid_state") {
    return {
      ok: false,
      kind: result.kind,
      code: result.code,
      message: result.message,
      redirectTo: result.redirectTo,
    };
  }

  return {
    ok: false,
    kind: result.kind,
    code: result.code,
    message: result.message,
    detail: "detail" in result ? result.detail : undefined,
  };
}
