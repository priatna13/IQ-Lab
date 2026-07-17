import type { AbilityProfile } from "./result-types";
import type { AgeBand, Track } from "./types";

export type NormAgeBucket = "core_18_45" | "senior_46_plus";

/**
 * Anonymized unit for empirical re-norming.
 * No participant_id, email, or attempt_id (cannot join back to Account).
 */
export type NormSample = {
  id: string;
  ageBand: Exclude<AgeBand, "under_18">;
  /** Core empirical bucket vs separate 46+ (ADR 0011). */
  ageBucket: NormAgeBucket;
  contentVersionId: string;
  normVersion: string;
  track: Track;
  abilityProfile: AbilityProfile;
  compositeIndex: number;
  iqEstimate: number;
  primaryCompletedAt: Date;
};

export function ageBandToNormBucket(
  ageBand: AgeBand,
): NormAgeBucket | null {
  if (ageBand === "18_45") return "core_18_45";
  if (ageBand === "46_plus") return "senior_46_plus";
  return null;
}

export function buildNormSample(input: {
  ageBand: AgeBand;
  contentVersionId: string;
  normVersion: string;
  track: Track;
  abilityProfile: AbilityProfile;
  compositeIndex: number;
  iqEstimate: number;
  primaryCompletedAt: Date;
}): NormSample | null {
  const ageBucket = ageBandToNormBucket(input.ageBand);
  if (!ageBucket || input.ageBand === "under_18") return null;

  return {
    id: `ns_${crypto.randomUUID()}`,
    ageBand: input.ageBand,
    ageBucket,
    contentVersionId: input.contentVersionId,
    normVersion: input.normVersion,
    track: input.track,
    abilityProfile: input.abilityProfile.map((e) => ({ ...e })),
    compositeIndex: input.compositeIndex,
    iqEstimate: input.iqEstimate,
    primaryCompletedAt: input.primaryCompletedAt,
  };
}

/** Core empirical v1 uses only 18–45 samples. */
export function isCoreNormSample(sample: NormSample): boolean {
  return sample.ageBucket === "core_18_45";
}
