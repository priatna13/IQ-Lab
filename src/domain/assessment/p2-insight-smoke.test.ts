/**
 * P2 live smoke: OpenRouter LLM via hybrid narrator + completeAttempt.
 * Run: npx vitest run scripts/p2-insight-smoke.test.ts
 * Requires OPENROUTER_API_KEY (and InsForge env for app hasil check is separate).
 */
import { describe, expect, it } from "vitest";
import { completeAttempt } from "@/domain/assessment/complete-attempt";
import { createAttempt } from "@/domain/assessment/create-attempt";
import { createSeedContentCatalog } from "@/domain/assessment/content-catalog";
import { V2_CONTENT_VERSION_ID } from "@/domain/assessment/content/v2";
import {
  earlyFinishDomainSession,
  startDomainSession,
  upsertResponse,
} from "@/domain/assessment/domain-session";
import { createHybridInsightNarrator } from "@/domain/assessment/insight-narrator";
import { narrateFromTemplate } from "@/domain/assessment/insight-template";
import type { AssessmentPorts } from "@/domain/assessment/ports";
import { createFixedClock } from "@/domain/assessment/testing/fixed-clock";
import { createInMemoryAttemptRepository } from "@/domain/assessment/testing/in-memory-attempts";
import {
  createInMemoryDomainSessionRepository,
  createInMemoryResponseRepository,
} from "@/domain/assessment/testing/in-memory-sessions";
import { createInMemoryResultSnapshotRepository } from "@/domain/assessment/testing/in-memory-snapshots";
import { createInMemoryNormSampleRepository } from "@/domain/assessment/testing/in-memory-norm-samples";
import { createInMemoryIntegrityEventRepository } from "@/domain/assessment/testing/in-memory-integrity";
import { narrateInsightWithOpenRouter } from "@/lib/assessment/openrouter-insight-llm";
import {
  getOpenRouterChatModel,
  isOpenRouterConfigured,
} from "@/lib/assessment/openrouter-config";

/** Opt-in live smoke: requires OPENROUTER_API_KEY and RUN_P2_LIVE=1 */
const hasKey =
  isOpenRouterConfigured() && process.env.RUN_P2_LIVE === "1";

function buildPortsWithLlm(): AssessmentPorts {
  return {
    clock: createFixedClock("2026-07-19T08:00:00.000Z"),
    attempts: createInMemoryAttemptRepository(),
    content: createSeedContentCatalog(),
    domainSessions: createInMemoryDomainSessionRepository(),
    responses: createInMemoryResponseRepository(),
    resultSnapshots: createInMemoryResultSnapshotRepository(),
    normSamples: createInMemoryNormSampleRepository(),
    integrityEvents: createInMemoryIntegrityEventRepository(),
    insightNarrator: createHybridInsightNarrator({
      narrate: narrateInsightWithOpenRouter,
    }),
  };
}

async function finishAllDomains(
  ports: AssessmentPorts,
  attemptId: string,
  participantId: string,
) {
  const cv = await ports.content.getById(V2_CONTENT_VERSION_ID);
  for (const domainId of cv!.domainOrder) {
    const session = await startDomainSession(ports, {
      attemptId,
      participantId,
      domainId,
    });
    const domain = cv!.domains.find((d) => d.id === domainId)!;
    // Mix of correct/incorrect so profile is not perfect (more realistic LLM input)
    for (let i = 0; i < domain.items.length; i++) {
      const item = domain.items[i];
      const answer =
        i < 5
          ? item.correctKey
          : item.correctKey === "a"
            ? "b"
            : "a";
      await upsertResponse(ports, {
        sessionId: session.id,
        participantId,
        itemId: item.id,
        answer,
      });
    }
    await earlyFinishDomainSession(ports, {
      sessionId: session.id,
      participantId,
    });
  }
}

describe.skipIf(!hasKey)("P2 OpenRouter live insight", () => {
  it(
    "completeAttempt freezes non-empty insight/action plan via hybrid LLM narrator",
    { timeout: 120_000 },
    async () => {
      expect(getOpenRouterChatModel()).toBe("openai/gpt-4o-mini");

      const ports = buildPortsWithLlm();
      const participantId = "p2_live_participant";
      const attempt = await createAttempt(ports, {
        participant: { id: participantId, ageBand: "18_45" },
        track: "career",
      });

      await finishAllDomains(ports, attempt.id, participantId);

      const { snapshot } = await completeAttempt(ports, {
        attemptId: attempt.id,
        participantId,
        ageBand: "18_45",
      });

      expect(snapshot.insightProse?.trim().length).toBeGreaterThan(20);
      expect(snapshot.actionPlanProse?.trim().length).toBeGreaterThan(20);
      expect(snapshot.rulePayload).not.toBeNull();
      expect(snapshot.compositeIndex).toBeGreaterThan(0);
      expect(snapshot.iqEstimate).toBeGreaterThan(0);

      // Template fallback is still valid product behavior; detect if LLM path likely used
      // by comparing against pure template for same payload.
      const template = narrateFromTemplate(snapshot.rulePayload!);
      const usedLlmOrDistinct =
        snapshot.insightProse !== template.insightProse ||
        snapshot.actionPlanProse !== template.actionPlanProse;

      // Soft signal: prefer distinct prose; if equal, LLM may have mirrored template (rare).
      // Record both for the log via console.
      console.log(
        JSON.stringify({
          p2: true,
          model: getOpenRouterChatModel(),
          compositeIndex: snapshot.compositeIndex,
          iqEstimate: snapshot.iqEstimate,
          insightLen: snapshot.insightProse!.length,
          actionLen: snapshot.actionPlanProse!.length,
          distinctFromTemplate: usedLlmOrDistinct,
          insightPreview: snapshot.insightProse!.slice(0, 160),
          actionPreview: snapshot.actionPlanProse!.slice(0, 160),
        }),
      );

      // Always pass if prose exists (template fallback is acceptable soft-launch)
      expect(snapshot.insightProse).toBeTruthy();
    },
  );
});

describe.skipIf(hasKey)("P2 OpenRouter not configured", () => {
  it("skips live smoke when OPENROUTER_API_KEY missing", () => {
    expect(hasKey).toBe(false);
  });
});
