import { describe, expect, it } from "vitest";
import { toShareCardModel } from "./share-card-model";
import type { PublicResultReport } from "./result-types";

function fixture(over?: Partial<PublicResultReport>): PublicResultReport {
  return {
    attemptId: "att_secret",
    track: "explore",
    contentVersionId: "cv_mvp_v2",
    normVersion: "synthetic_v1",
    frozenAt: "2026-07-20T00:00:00.000Z",
    abilityProfile: [
      {
        domainId: "verbal_pemahaman",
        label: "Pemahaman verbal",
        rawCorrect: 6,
        rawTotal: 8,
        score: 75,
      },
      {
        domainId: "logika",
        label: "Penalaran logis",
        rawCorrect: 7,
        rawTotal: 8,
        score: 88,
      },
    ],
    compositeIndex: 70,
    iqEstimate: 115,
    labels: {
      composite: "Indeks kemampuan umum",
      iqEstimate: "Estimasi IQ",
      normBadge: "Estimasi · norma sementara",
      disclaimer: "long disclaimer",
    },
    rulePayload: {
      version: "career_rules_v1",
      confidence: "medium",
      track: "explore",
      clusters: [
        {
          id: "analisis_data",
          label: "Analisis data",
          fitScore: 80,
          supportingDomains: ["logika"],
        },
        {
          id: "komunikasi_konten",
          label: "Komunikasi",
          fitScore: 60,
          supportingDomains: ["verbal_pemahaman"],
        },
      ],
      skillPriorities: ["Literasi data", "Debugging logis", "Extra"],
      strengths: [
        { domainId: "logika", label: "Penalaran logis", score: 88 },
      ],
      growthAreas: [],
    },
    insightProse: "x",
    actionPlanProse: "y",
    ...over,
  };
}

describe("toShareCardModel", () => {
  it("defaults without IQ and omits attempt identity fields", () => {
    const m = toShareCardModel(fixture());
    expect(m.includeIq).toBe(false);
    expect(m.iqEstimate).toBeNull();
    expect(m.compositeIndex).toBe(70);
    expect(m.clusters).toHaveLength(2);
    expect(m.strengths).toEqual(["Literasi data", "Debugging logis"]);
    expect(m.disclaimer).toMatch(/bukan IST/i);
    expect(JSON.stringify(m)).not.toContain("att_secret");
  });

  it("includes IQ when opted in", () => {
    const m = toShareCardModel(fixture(), { includeIq: true });
    expect(m.includeIq).toBe(true);
    expect(m.iqEstimate).toBe(115);
  });
});
