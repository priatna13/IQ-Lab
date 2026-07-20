import type { AssessmentPorts } from "../ports";
import { AssessmentError } from "../types";
import type { AttemptId, ParticipantId } from "../types";
import {
  CURRENT_SKILL_CONTENT_VERSION_ID,
  getSkillPack,
} from "./content/skill_v1";
import { isFieldId } from "./field-catalog";
import type { SkillPorts } from "./ports";
import type { FieldId, SkillAttempt } from "./types";

export type CreateSkillAttemptCommand = {
  participantId: ParticipantId;
  sourceAttemptId: AttemptId;
  fieldId: string;
};

export async function createSkillAttempt(
  ports: AssessmentPorts & SkillPorts,
  cmd: CreateSkillAttemptCommand,
): Promise<SkillAttempt> {
  if (!isFieldId(cmd.fieldId)) {
    throw new AssessmentError("INVALID_STATE", "Bidang/role tidak dikenal");
  }
  const fieldId = cmd.fieldId as FieldId;

  const source = await ports.attempts.findById(cmd.sourceAttemptId);
  if (!source || source.participantId !== cmd.participantId) {
    throw new AssessmentError("NOT_FOUND", "Attempt sumber tidak ditemukan");
  }
  if (source.status !== "completed") {
    throw new AssessmentError(
      "INVALID_STATE",
      "Selesaikan asesmen 9 domain terlebih dahulu",
    );
  }

  const existingCompleted = await ports.skillAttempts.findCompletedBySourceAndField(
    cmd.sourceAttemptId,
    fieldId,
  );
  if (existingCompleted) {
    throw new AssessmentError(
      "INVALID_STATE",
      "Anda sudah menyelesaikan keahlian bidang ini untuk hasil asesmen tersebut",
    );
  }

  const open = await ports.skillAttempts.findOpenByParticipant(cmd.participantId);
  if (open) {
    if (open.sourceAttemptId === cmd.sourceAttemptId && open.fieldId === fieldId) {
      return open;
    }
    throw new AssessmentError(
      "OPEN_ATTEMPT_EXISTS",
      "Masih ada asesmen keahlian berjalan. Selesaikan dulu.",
    );
  }

  const pack = getSkillPack(fieldId);
  if (!pack) {
    throw new AssessmentError("NOT_FOUND", "Paket soal keahlian tidak ditemukan");
  }

  const now = ports.clock.now();
  const attempt: SkillAttempt = {
    id: `skatt_${crypto.randomUUID()}`,
    participantId: cmd.participantId,
    sourceAttemptId: cmd.sourceAttemptId,
    fieldId,
    skillContentVersionId: CURRENT_SKILL_CONTENT_VERSION_ID,
    status: "in_progress",
    startedAt: now,
    completedAt: null,
    endsAt: new Date(now.getTime() + pack.timeLimitSeconds * 1000),
  };

  await ports.skillAttempts.save(attempt);
  return attempt;
}
