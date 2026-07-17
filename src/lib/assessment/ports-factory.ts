import {
  createSeedContentCatalog,
  type AssessmentPorts,
} from "@/domain/assessment";
import { createInsForgeAttemptRepository } from "./insforge-attempt-repository";
import { createInsForgeDomainSessionRepository } from "./insforge-domain-session-repository";
import { createInsForgeResponseRepository } from "./insforge-response-repository";
import { systemClock } from "./system-clock";

export function createServerAssessmentPorts(): AssessmentPorts {
  return {
    clock: systemClock,
    attempts: createInsForgeAttemptRepository(),
    content: createSeedContentCatalog(),
    domainSessions: createInsForgeDomainSessionRepository(),
    responses: createInsForgeResponseRepository(),
  };
}
