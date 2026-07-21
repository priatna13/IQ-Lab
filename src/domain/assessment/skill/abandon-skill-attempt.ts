import type { AssessmentPorts } from "../ports";
import { AssessmentError } from "../types";
import type { ParticipantId } from "../types";
import type { SkillPorts } from "./ports";
import type { SkillAttempt } from "./types";

/**
 * Explicitly abandon an open Skill Attempt so the participant can pick another field.
 * No Skill Result Snapshot; completed field packs remain usable.
 */
export async function abandonSkillAttempt(
  ports: AssessmentPorts & SkillPorts,
  input: {
    skillAttemptId: string;
    participantId: ParticipantId;
  },
): Promise<SkillAttempt> {
  const attempt = await ports.skillAttempts.findById(input.skillAttemptId);
  if (!attempt || attempt.participantId !== input.participantId) {
    throw new AssessmentError("NOT_FOUND", "Skill attempt tidak ditemukan");
  }

  if (attempt.status === "abandoned") {
    return attempt;
  }

  if (attempt.status === "completed") {
    throw new AssessmentError(
      "INVALID_STATE",
      "Skill attempt yang sudah selesai tidak dapat dibatalkan",
    );
  }

  if (attempt.status !== "in_progress") {
    throw new AssessmentError("INVALID_STATE", "Skill attempt tidak terbuka");
  }

  const abandoned: SkillAttempt = {
    ...attempt,
    status: "abandoned",
    completedAt: null,
  };

  await ports.skillAttempts.save(abandoned);
  return abandoned;
}
