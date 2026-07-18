import { describe, expect, it } from "vitest";
import { buildReportPdfBytes } from "./build-report-pdf";
import type { PublicResultReport } from "./result-types";
import { CAREER_RULES_VERSION } from "./career-rules";

function sampleReport(): PublicResultReport {
  return {
    attemptId: "att_test_pdf",
    track: "career",
    contentVersionId: "cv_mvp_v2",
    normVersion: "norm_synthetic_v1",
    frozenAt: "2026-07-17T12:00:00.000Z",
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
        rawCorrect: 4,
        rawTotal: 8,
        score: 50,
      },
    ],
    compositeIndex: 62,
    iqEstimate: 112,
    labels: {
      composite: "Indeks kemampuan umum",
      iqEstimate: "Estimasi IQ (norma internal IQ-Lab)",
      normBadge: "Estimasi · norma sementara",
      disclaimer:
        "Hasil ini untuk pengembangan diri. Bukan tes IST resmi, bukan diagnosis klinis, dan bukan sertifikasi rekrutmen.",
    },
    rulePayload: {
      version: CAREER_RULES_VERSION,
      track: "career",
      strengths: [
        { domainId: "verbal_pemahaman", label: "Pemahaman verbal", score: 75 },
      ],
      growthAreas: [
        { domainId: "logika", label: "Penalaran logis", score: 50 },
      ],
      clusters: [
        {
          id: "komunikasi_konten",
          label: "Komunikasi & konten",
          fitScore: 70,
          supportingDomains: ["Pemahaman verbal"],
        },
      ],
      skillPriorities: ["Menulis persuasif", "Presentasi ide"],
      confidence: "medium",
    },
    insightProse: "Insight uji dari snapshot beku.",
    actionPlanProse: "Action plan uji dari snapshot beku.",
  };
}

describe("buildReportPdfBytes", () => {
  it("produces a PDF from snapshot report only", async () => {
    const report = sampleReport();
    const bytes = await buildReportPdfBytes(report);
    expect(bytes.byteLength).toBeGreaterThan(500);
    const header = String.fromCharCode(...bytes.slice(0, 5));
    expect(header).toBe("%PDF-");
  });

  it("regenerating the same report yields identical bytes (content-equivalent)", async () => {
    const report = sampleReport();
    const a = await buildReportPdfBytes(report);
    const b = await buildReportPdfBytes(report);
    expect(Buffer.from(a).equals(Buffer.from(b))).toBe(true);
  });

  it("does not invent scores — different composite changes output", async () => {
    const report = sampleReport();
    const a = await buildReportPdfBytes(report);
    const b = await buildReportPdfBytes({
      ...report,
      compositeIndex: 99,
    });
    expect(Buffer.from(a).equals(Buffer.from(b))).toBe(false);
  });
});
