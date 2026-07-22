import type { FieldId } from "@/domain/assessment/skill/types";

/**
 * Pure JSON-serializable types for client + API.
 * No server imports (cookies, ensure-session, repositories).
 */
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
