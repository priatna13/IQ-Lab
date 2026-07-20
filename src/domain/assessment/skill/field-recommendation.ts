import type { AbilityProfile } from "../result-types";
import type { CareerClusterId, RulePayload } from "../career-rules";
import type { FieldId } from "./types";
import { FIELD_DEFS, getFieldDef } from "./field-catalog";

export const FIELD_RECOMMENDATION_VERSION = "field_rec_v1";

/** Cluster → preferred roles (ordered). */
const CLUSTER_TO_FIELDS: Record<CareerClusterId, FieldId[]> = {
  rekayasa_sistem: ["it_software", "data_analyst", "project_product"],
  analisis_data: ["data_analyst", "finance_accounting", "operations"],
  desain_visual_produk: ["ui_ux", "graphic_design", "content_creator"],
  komunikasi_konten: [
    "content_creator",
    "digital_marketing",
    "sales_bd",
    "educator",
  ],
  operasi_manajemen: [
    "project_product",
    "operations",
    "hr",
    "customer_service",
  ],
  riset_strategis: ["legal", "data_analyst", "project_product", "coach"],
};

function domainScoreMap(profile: AbilityProfile): Record<string, number> {
  const map: Record<string, number> = {};
  for (const e of profile) {
    map[e.domainId] = e.score;
  }
  return map;
}

/** Score a field by average of its relevant cognitive domains. */
export function scoreFieldAgainstProfile(
  fieldId: FieldId,
  profile: AbilityProfile,
): number {
  const def = getFieldDef(fieldId);
  if (!def) return 0;
  const scores = domainScoreMap(profile);
  const vals = def.relevantDomains
    .map((d) => scores[d])
    .filter((n): n is number => typeof n === "number");
  if (vals.length === 0) return 50;
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
}

/**
 * Recommend 1–3 roles: blend rule-payload cluster order with profile domain fit.
 */
export function recommendFields(
  profile: AbilityProfile,
  rulePayload: RulePayload | null,
  limit = 3,
): FieldId[] {
  const ranked = new Map<FieldId, number>();

  // Seed from cluster priority in rule payload
  if (rulePayload?.clusters?.length) {
    rulePayload.clusters.forEach((c, clusterIdx) => {
      const fields = CLUSTER_TO_FIELDS[c.id as CareerClusterId] ?? [];
      fields.forEach((fieldId, fieldIdx) => {
        const base = (rulePayload.clusters.length - clusterIdx) * 100;
        const orderBonus = fields.length - fieldIdx;
        const fit = scoreFieldAgainstProfile(fieldId, profile);
        ranked.set(fieldId, (ranked.get(fieldId) ?? 0) + base + orderBonus + fit);
      });
    });
  }

  // Ensure every field has a score from profile alone
  for (const def of FIELD_DEFS) {
    if (!ranked.has(def.id)) {
      ranked.set(def.id, scoreFieldAgainstProfile(def.id, profile));
    }
  }

  return [...ranked.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([id]) => id);
}
