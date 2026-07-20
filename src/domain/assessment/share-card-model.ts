/**
 * Safe share-card DTO from PublicResultReport (DESIGN.md R3).
 * No participant id / email / attempt id on the card.
 */

import type { PublicResultReport } from "./result-types";

export type ShareCardModel = {
  title: string;
  trackLabel: string;
  compositeIndex: number;
  compositeLabel: string;
  includeIq: boolean;
  iqEstimate: number | null;
  iqLabel: string;
  clusters: Array<{ label: string; fitScore: number }>;
  strengths: string[];
  normBadge: string;
  disclaimer: string;
  brand: string;
};

export function toShareCardModel(
  report: PublicResultReport,
  options?: { includeIq?: boolean },
): ShareCardModel {
  const includeIq = Boolean(options?.includeIq);

  const clusters = [...(report.rulePayload?.clusters ?? [])]
    .sort((a, b) => b.fitScore - a.fitScore)
    .slice(0, 3)
    .map((c) => ({ label: c.label, fitScore: c.fitScore }));

  const fromRules = (report.rulePayload?.skillPriorities ?? []).slice(0, 2);
  const topDomains = [...report.abilityProfile]
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map((d) => d.label);
  const strengths =
    fromRules.length > 0 ? fromRules : topDomains.length > 0 ? topDomains : [];

  return {
    title: "Profil kemampuan saya",
    trackLabel:
      report.track === "explore" ? "Jelajahi potensi" : "Rancang langkah karir",
    compositeIndex: report.compositeIndex,
    compositeLabel: report.labels.composite,
    includeIq,
    iqEstimate: includeIq ? report.iqEstimate : null,
    iqLabel: "Estimasi IQ · norma internal",
    clusters,
    strengths,
    normBadge: report.labels.normBadge,
    disclaimer:
      "Bukan IST resmi · bukan diagnosis klinis · bukan sertifikasi rekrutmen",
    brand: "IQ-Lab",
  };
}
