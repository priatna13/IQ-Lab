import type { NormSampleRepository } from "@/domain/assessment/ports";
import type { NormSample } from "@/domain/assessment/norm-sample";
import { createInsForgeServerClient } from "@/lib/insforge/server";

export function createInsForgeNormSampleRepository(): NormSampleRepository {
  return {
    async save(sample: NormSample) {
      const client = await createInsForgeServerClient();
      const row = {
        id: sample.id,
        age_band: sample.ageBand,
        age_bucket: sample.ageBucket,
        content_version_id: sample.contentVersionId,
        norm_version: sample.normVersion,
        track: sample.track,
        ability_profile: sample.abilityProfile,
        composite_index: sample.compositeIndex,
        iq_estimate: sample.iqEstimate,
        primary_completed_at: sample.primaryCompletedAt.toISOString(),
      };
      const { error } = await client.database
        .from("norm_samples")
        .insert([row]);
      if (error) {
        throw new Error(error.message ?? "Failed to save Norm Sample");
      }
    },
  };
}
