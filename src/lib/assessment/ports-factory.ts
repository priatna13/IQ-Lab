import {
  createHybridInsightNarrator,
  createSeedContentCatalog,
  type AssessmentPorts,
} from "@/domain/assessment";
import { createInsForgeAttemptRepository } from "./insforge-attempt-repository";
import { createInsForgeDomainSessionRepository } from "./insforge-domain-session-repository";
import { createInsForgeNormSampleRepository } from "./insforge-norm-sample-repository";
import { createInsForgeResponseRepository } from "./insforge-response-repository";
import { createInsForgeResultSnapshotRepository } from "./insforge-result-snapshot-repository";
import { narrateInsightWithOpenRouter } from "./openrouter-insight-llm";
import { systemClock } from "./system-clock";

export function createServerAssessmentPorts(): AssessmentPorts {
  const llm =
    process.env.OPENROUTER_API_KEY
      ? { narrate: narrateInsightWithOpenRouter }
      : undefined;

  return {
    clock: systemClock,
    attempts: createInsForgeAttemptRepository(),
    content: createSeedContentCatalog(),
    domainSessions: createInsForgeDomainSessionRepository(),
    responses: createInsForgeResponseRepository(),
    resultSnapshots: createInsForgeResultSnapshotRepository(),
    normSamples: createInsForgeNormSampleRepository(),
    insightNarrator: createHybridInsightNarrator(llm),
  };
}
