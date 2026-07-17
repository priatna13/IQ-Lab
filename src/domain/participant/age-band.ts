import type { AgeBand } from "@/domain/assessment/types";

export type AgeBandChoice = Exclude<AgeBand, "under_18"> | "under_18";

export type AgeBandGate =
  | { status: "blocked"; reason: "under_18" }
  | { status: "allowed"; ageBand: "18_45"; disclaimer46Plus: false }
  | { status: "allowed_with_disclaimer"; ageBand: "46_plus"; disclaimer46Plus: true };

/** Pure gate for Age Band selection (Assessment eligibility). */
export function evaluateAgeBand(choice: AgeBandChoice): AgeBandGate {
  if (choice === "under_18") {
    return { status: "blocked", reason: "under_18" };
  }
  if (choice === "46_plus") {
    return {
      status: "allowed_with_disclaimer",
      ageBand: "46_plus",
      disclaimer46Plus: true,
    };
  }
  return {
    status: "allowed",
    ageBand: "18_45",
    disclaimer46Plus: false,
  };
}

export function parseAgeBand(value: unknown): AgeBand | null {
  if (value === "under_18" || value === "18_45" || value === "46_plus") {
    return value;
  }
  return null;
}

export const AGE_BAND_PROFILE_KEY = "age_band" as const;
