import type { AbilityProfile } from "./result-types";
import type { Track } from "./types";

export const CAREER_RULES_VERSION = "career_rules_v1";

export type CareerClusterId =
  | "analisis_data"
  | "komunikasi_konten"
  | "desain_visual_produk"
  | "rekayasa_sistem"
  | "operasi_manajemen"
  | "riset_strategis";

export type CareerClusterDef = {
  id: CareerClusterId;
  label: string;
  /** Domain weights 0–1 summing roughly to 1 */
  domainWeights: Record<string, number>;
  skillHints: string[];
};

/** Versioned matrix: only these clusters may appear in Rule Payload. */
export const CAREER_CLUSTER_MATRIX: CareerClusterDef[] = [
  {
    id: "analisis_data",
    label: "Analisis data & kuantitatif",
    domainWeights: {
      numerik_operasi: 0.3,
      numerik_pola: 0.3,
      logika: 0.25,
      memori: 0.15,
    },
    skillHints: [
      "Literasi data",
      "Pemodelan sederhana",
      "Ketelitian kuantitatif",
    ],
  },
  {
    id: "komunikasi_konten",
    label: "Komunikasi & konten",
    domainWeights: {
      verbal_pemahaman: 0.35,
      verbal_analogi: 0.3,
      praktis: 0.2,
      memori: 0.15,
    },
    skillHints: [
      "Menulis persuasif",
      "Menyusun narasi",
      "Presentasi ide",
    ],
  },
  {
    id: "desain_visual_produk",
    label: "Desain visual & spasial",
    domainWeights: {
      figural: 0.35,
      spasial: 0.35,
      praktis: 0.15,
      verbal_pemahaman: 0.15,
    },
    skillHints: [
      "Pemikiran visual",
      "Layout & struktur",
      "Prototipe konsep",
    ],
  },
  {
    id: "rekayasa_sistem",
    label: "Rekayasa & penalaran sistem",
    domainWeights: {
      logika: 0.35,
      numerik_pola: 0.25,
      spasial: 0.2,
      memori: 0.2,
    },
    skillHints: [
      "Debugging logis",
      "Abstraksi masalah",
      "Arsitektur solusi",
    ],
  },
  {
    id: "operasi_manajemen",
    label: "Operasi & koordinasi",
    domainWeights: {
      praktis: 0.35,
      verbal_pemahaman: 0.2,
      memori: 0.2,
      logika: 0.25,
    },
    skillHints: [
      "Prioritas kerja",
      "Koordinasi tim",
      "Keputusan situasional",
    ],
  },
  {
    id: "riset_strategis",
    label: "Riset & penalaran strategis",
    domainWeights: {
      verbal_analogi: 0.25,
      logika: 0.3,
      numerik_pola: 0.25,
      memori: 0.2,
    },
    skillHints: [
      "Sintesis informasi",
      "Hipotesis & uji",
      "Pemetaan opsi",
    ],
  },
];

export type RulePayload = {
  version: string;
  track: Track;
  strengths: Array<{ domainId: string; label: string; score: number }>;
  growthAreas: Array<{ domainId: string; label: string; score: number }>;
  clusters: Array<{
    id: CareerClusterId;
    label: string;
    fitScore: number;
    supportingDomains: string[];
  }>;
  skillPriorities: string[];
  confidence: "high" | "medium" | "low";
};

function scoreForCluster(
  profile: AbilityProfile,
  def: CareerClusterDef,
): { fit: number; supporting: string[] } {
  const byId = new Map(profile.map((p) => [p.domainId, p]));
  let weighted = 0;
  let weightSum = 0;
  const supporting: string[] = [];
  for (const [domainId, w] of Object.entries(def.domainWeights)) {
    const entry = byId.get(domainId);
    const score = entry?.score ?? 50;
    weighted += score * w;
    weightSum += w;
    if (entry && score >= 55) supporting.push(entry.label);
  }
  const fit = weightSum > 0 ? weighted / weightSum : 50;
  return { fit: Math.round(fit), supporting };
}

/**
 * Deterministic Rule Payload from Ability Profile + Track.
 * Clusters are only chosen from CAREER_CLUSTER_MATRIX.
 */
export function buildRulePayload(
  profile: AbilityProfile,
  track: Track,
): RulePayload {
  const sorted = [...profile].sort((a, b) => b.score - a.score);
  const strengths = sorted.slice(0, 3).map((e) => ({
    domainId: e.domainId,
    label: e.label,
    score: e.score,
  }));
  const growthAreas = [...profile]
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)
    .map((e) => ({
      domainId: e.domainId,
      label: e.label,
      score: e.score,
    }));

  const scored = CAREER_CLUSTER_MATRIX.map((def) => {
    const { fit, supporting } = scoreForCluster(profile, def);
    return {
      id: def.id,
      label: def.label,
      fitScore: fit,
      supportingDomains: supporting,
      skillHints: def.skillHints,
    };
  }).sort((a, b) => b.fitScore - a.fitScore);

  const top = scored.slice(0, 3);
  const skillPriorities = [
    ...new Set(top.flatMap((c) => c.skillHints)),
  ].slice(0, 6);

  const scores = profile.map((p) => p.score);
  const spread =
    Math.max(...scores, 0) - Math.min(...scores, 100);
  const mean =
    scores.reduce((a, b) => a + b, 0) / Math.max(scores.length, 1);
  let confidence: RulePayload["confidence"] = "medium";
  if (spread < 12) confidence = "low";
  else if (spread >= 25 && mean >= 40) confidence = "high";

  return {
    version: CAREER_RULES_VERSION,
    track,
    strengths,
    growthAreas,
    clusters: top.map(({ id, label, fitScore, supportingDomains }) => ({
      id,
      label,
      fitScore,
      supportingDomains,
    })),
    skillPriorities,
    confidence,
  };
}

/** Ensure payload clusters ⊆ matrix (guard against LLM pollution if merged). */
export function sanitizeRulePayload(payload: RulePayload): RulePayload {
  const allowed = new Set(CAREER_CLUSTER_MATRIX.map((c) => c.id));
  return {
    ...payload,
    clusters: payload.clusters.filter((c) => allowed.has(c.id)),
  };
}
