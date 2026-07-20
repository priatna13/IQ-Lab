import {
  createHybridInsightNarrator,
  createSeedContentCatalog,
  type AssessmentPorts,
} from "@/domain/assessment";
import type { SkillPorts } from "@/domain/assessment/skill/ports";
import { createInsForgeAttemptRepository } from "./insforge-attempt-repository";
import { createInsForgeDomainSessionRepository } from "./insforge-domain-session-repository";
import { createInsForgeIntegrityEventRepository } from "./insforge-integrity-repository";
import { createInsForgeNormSampleRepository } from "./insforge-norm-sample-repository";
import { createInsForgeResponseRepository } from "./insforge-response-repository";
import { createInsForgeResultSnapshotRepository } from "./insforge-result-snapshot-repository";
import {
  createInsForgeSkillAttemptRepository,
  createInsForgeSkillResponseRepository,
  createInsForgeSkillSnapshotRepository,
} from "./insforge-skill-repositories";
import { narrateInsightWithOpenRouter } from "./openrouter-insight-llm";
import { systemClock } from "./system-clock";

export type ServerAssessmentPorts = AssessmentPorts & SkillPorts;

export function createServerAssessmentPorts(): ServerAssessmentPorts {
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
    integrityEvents: createInsForgeIntegrityEventRepository(),
    insightNarrator: createHybridInsightNarrator(llm),
    skillAttempts: createInsForgeSkillAttemptRepository(),
    skillResponses: createInsForgeSkillResponseRepository(),
    skillSnapshots: createInsForgeSkillSnapshotRepository(),
  };
}
