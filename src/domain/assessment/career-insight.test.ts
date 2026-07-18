import { describe, expect, it } from "vitest";
import {
  buildRulePayload,
  CAREER_CLUSTER_MATRIX,
  CAREER_RULES_VERSION,
  sanitizeRulePayload,
  type RulePayload,
} from "./career-rules";
import { completeAttempt } from "./complete-attempt";
import { createAttempt } from "./create-attempt";
import { createSeedContentCatalog } from "./content-catalog";
import { V2_CONTENT_VERSION_ID } from "./content/v2";
import {
  earlyFinishDomainSession,
  startDomainSession,
  upsertResponse,
} from "./domain-session";
import { createHybridInsightNarrator } from "./insight-narrator";
import { narrateFromTemplate } from "./insight-template";
import type { AssessmentPorts } from "./ports";
import type { AbilityProfile } from "./result-types";
import { createFixedClock } from "./testing/fixed-clock";
import { createInMemoryAttemptRepository } from "./testing/in-memory-attempts";
import {
  createInMemoryDomainSessionRepository,
  createInMemoryResponseRepository,
} from "./testing/in-memory-sessions";
import { createInMemoryResultSnapshotRepository } from "./testing/in-memory-snapshots";
import { createInMemoryNormSampleRepository } from "./testing/in-memory-norm-samples";
import { createInMemoryIntegrityEventRepository } from "./testing/in-memory-integrity";

function sampleProfile(): AbilityProfile {
  return [
    { domainId: "verbal_pemahaman", label: "Verbal", rawCorrect: 7, rawTotal: 8, score: 88 },
    { domainId: "verbal_analogi", label: "Analogi", rawCorrect: 6, rawTotal: 8, score: 75 },
    { domainId: "numerik_operasi", label: "Numerik", rawCorrect: 3, rawTotal: 8, score: 38 },
    { domainId: "numerik_pola", label: "Pola", rawCorrect: 4, rawTotal: 8, score: 50 },
    { domainId: "figural", label: "Figural", rawCorrect: 5, rawTotal: 8, score: 62 },
    { domainId: "spasial", label: "Spasial", rawCorrect: 5, rawTotal: 8, score: 62 },
    { domainId: "memori", label: "Memori", rawCorrect: 6, rawTotal: 8, score: 75 },
    { domainId: "logika", label: "Logika", rawCorrect: 4, rawTotal: 8, score: 50 },
    { domainId: "praktis", label: "Praktis", rawCorrect: 7, rawTotal: 8, score: 88 },
  ];
}

function buildPorts(narrator = createHybridInsightNarrator()): AssessmentPorts {
  return {
    clock: createFixedClock("2026-07-17T16:00:00.000Z"),
    attempts: createInMemoryAttemptRepository(),
    content: createSeedContentCatalog(),
    domainSessions: createInMemoryDomainSessionRepository(),
    responses: createInMemoryResponseRepository(),
    resultSnapshots: createInMemoryResultSnapshotRepository(),
    normSamples: createInMemoryNormSampleRepository(),
    integrityEvents: createInMemoryIntegrityEventRepository(),
    insightNarrator: narrator,
  };
}

async function finishAllPerfect(ports: AssessmentPorts, attemptId: string) {
  const cv = await ports.content.getById(V2_CONTENT_VERSION_ID);
  for (const domainId of cv!.domainOrder) {
    const session = await startDomainSession(ports, {
      attemptId,
      participantId: "p_1",
      domainId,
    });
    const domain = cv!.domains.find((d) => d.id === domainId)!;
    for (const item of domain.items) {
      await upsertResponse(ports, {
        sessionId: session.id,
        participantId: "p_1",
        itemId: item.id,
        answer: item.correctKey,
      });
    }
    await earlyFinishDomainSession(ports, {
      sessionId: session.id,
      participantId: "p_1",
    });
  }
}

describe("career rule engine", () => {
  it("emits versioned payload with clusters only from the matrix", () => {
    const payload = buildRulePayload(sampleProfile(), "career");
    expect(payload.version).toBe(CAREER_RULES_VERSION);
    expect(payload.track).toBe("career");
    expect(payload.clusters.length).toBeGreaterThan(0);
    expect(payload.clusters.length).toBeLessThanOrEqual(3);
    const allowed = new Set(CAREER_CLUSTER_MATRIX.map((c) => c.id));
    for (const c of payload.clusters) {
      expect(allowed.has(c.id)).toBe(true);
    }
    // High verbal+praktis should rank komunikasi or operasi high
    expect(payload.strengths[0].score).toBeGreaterThanOrEqual(
      payload.growthAreas[0].score,
    );
  });

  it("sanitize strips unknown clusters", () => {
    const payload = buildRulePayload(sampleProfile(), "explore");
    const dirty = {
      ...payload,
      clusters: [
        ...payload.clusters,
        {
          id: "not_in_matrix" as never,
          label: "Fake",
          fitScore: 99,
          supportingDomains: [],
        },
      ],
    } as RulePayload;
    const clean = sanitizeRulePayload(dirty);
    expect(clean.clusters.every((c) => c.id !== ("not_in_matrix" as never))).toBe(
      true,
    );
  });

  it("explore vs career templates differ in action plan framing", () => {
    const payload = buildRulePayload(sampleProfile(), "explore");
    const explore = narrateFromTemplate({ ...payload, track: "explore" });
    const career = narrateFromTemplate({ ...payload, track: "career" });
    expect(explore.actionPlanProse).toMatch(/30\/60\/90|eksplorasi/i);
    expect(career.actionPlanProse).toMatch(/skill gap|karir|portofolio/i);
  });
});

describe("completeAttempt with hybrid insight", () => {
  it("uses template fallback when LLM fails and freezes payload on snapshot", async () => {
    const failingLlm = {
      async narrate() {
        throw new Error("llm down");
      },
    };
    const ports = buildPorts(createHybridInsightNarrator(failingLlm));
    const attempt = await createAttempt(ports, {
      participant: { id: "p_1", ageBand: "18_45" },
      track: "explore",
    });
    await finishAllPerfect(ports, attempt.id);

    const { snapshot } = await completeAttempt(ports, {
      attemptId: attempt.id,
      participantId: "p_1",
      ageBand: "18_45",
    });

    expect(snapshot.rulePayload).not.toBeNull();
    expect(snapshot.rulePayload?.version).toBe(CAREER_RULES_VERSION);
    expect(snapshot.insightProse).toBeTruthy();
    expect(snapshot.actionPlanProse).toMatch(/30\/60\/90|eksplorasi/i);
    expect(snapshot.rulePayload?.track).toBe("explore");
  });

  it("persists LLM narration when available without changing rule clusters", async () => {
    const ports = buildPorts(
      createHybridInsightNarrator({
        async narrate(payload) {
          return {
            insightProse: `LLM insight untuk ${payload.clusters[0]?.label}`,
            actionPlanProse: `LLM plan skills: ${payload.skillPriorities.join(", ")}`,
            source: "llm",
          };
        },
      }),
    );
    const attempt = await createAttempt(ports, {
      participant: { id: "p_1", ageBand: "18_45" },
      track: "career",
    });
    await finishAllPerfect(ports, attempt.id);

    const { snapshot } = await completeAttempt(ports, {
      attemptId: attempt.id,
      participantId: "p_1",
      ageBand: "18_45",
    });

    expect(snapshot.insightProse).toMatch(/^LLM insight/);
    expect(snapshot.actionPlanProse).toMatch(/^LLM plan/);
    const allowed = new Set(CAREER_CLUSTER_MATRIX.map((c) => c.id));
    for (const c of snapshot.rulePayload!.clusters) {
      expect(allowed.has(c.id)).toBe(true);
    }
  });
});
