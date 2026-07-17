import type { RulePayload } from "./career-rules";
import {
  narrateFromTemplate,
  type InsightNarration,
} from "./insight-template";

export type InsightNarrator = {
  narrate(payload: RulePayload): Promise<InsightNarration>;
};

/**
 * Hybrid narrator: try LLM, fall back to template.
 * LLM must only rephrase; caller freezes Rule Payload as truth.
 */
export function createHybridInsightNarrator(llm?: {
  narrate(payload: RulePayload): Promise<InsightNarration>;
}): InsightNarrator {
  return {
    async narrate(payload) {
      if (!llm) {
        return narrateFromTemplate(payload);
      }
      try {
        const result = await llm.narrate(payload);
        if (
          !result.insightProse?.trim() ||
          !result.actionPlanProse?.trim()
        ) {
          return narrateFromTemplate(payload);
        }
        return { ...result, source: "llm" };
      } catch {
        return narrateFromTemplate(payload);
      }
    },
  };
}
