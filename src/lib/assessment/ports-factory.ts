import {
  createSeedContentCatalog,
  type AssessmentPorts,
} from "@/domain/assessment";
import { createInsForgeAttemptRepository } from "./insforge-attempt-repository";
import { systemClock } from "./system-clock";

export function createServerAssessmentPorts(): AssessmentPorts {
  return {
    clock: systemClock,
    attempts: createInsForgeAttemptRepository(),
    content: createSeedContentCatalog(),
  };
}
