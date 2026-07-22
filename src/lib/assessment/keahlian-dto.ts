import type { FieldId } from "@/domain/assessment/skill/types";
import type { LoadKeahlianResult } from "@/lib/assessment/load-owned-assessment";
import { getFieldDef } from "@/domain/assessment/skill/field-catalog";

/** Fully JSON-serializable DTO for client + API (no Date / class instances). */
export type KeahlianViewDto = {
  recommended: FieldId[];
  completedFieldIds: FieldId[];
  skillSnapshots: Array<{
    id: string;
    fieldId: string;
    fieldLabel: string;
    score: number;
  }>;
  openSkill: null | {
    id: string;
    fieldId: string;
    sourceAttemptId: string;
    fieldLabel: string;
  };
  openForThisSource: boolean;
  openOtherSource: boolean;
  diagnostics: {
    refreshed: boolean;
    userId: string;
    attemptId: string;
  };
};

export type KeahlianApiResponse =
  | { ok: true; view: KeahlianViewDto }
  | {
      ok: false;
      kind: "unauthenticated" | "not_found" | "invalid_state" | "error";
      code: string;
      message: string;
      detail?: string;
      redirectTo?: string;
    };

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
