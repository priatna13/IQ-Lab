import type { AssessmentPorts } from "../ports";
import { AssessmentError } from "../types";
import type { ParticipantId } from "../types";
import { getCategoryDef, getFieldDef } from "./field-catalog";
import { getSkillPack } from "./content/skill_v1";
import type { SkillPorts } from "./ports";
import type { PublicSkillRunnerView, SkillResponse } from "./types";

const DEFAULT_GRACE_MS = 30_000;

export async function upsertSkillResponse(
  ports: AssessmentPorts & SkillPorts,
  input: {
    skillAttemptId: string;
    participantId: ParticipantId;
    itemId: string;
    answer: string;
  },
): Promise<void> {
  const attempt = await ports.skillAttempts.findById(input.skillAttemptId);
  if (!attempt || attempt.participantId !== input.participantId) {
    throw new AssessmentError("NOT_FOUND", "Skill attempt tidak ditemukan");
  }
  if (attempt.status !== "in_progress") {
    throw new AssessmentError("INVALID_STATE", "Sesi keahlian sudah ditutup");
  }

  const now = ports.clock.now();
  const graceMs = ports.graceWindowMs ?? DEFAULT_GRACE_MS;
  if (now.getTime() > attempt.endsAt.getTime() + graceMs) {
    throw new AssessmentError("INVALID_STATE", "Waktu sesi keahlian habis");
  }

  const pack = getSkillPack(attempt.fieldId, attempt.skillContentVersionId);
  if (!pack || !pack.items.some((i) => i.id === input.itemId)) {
    throw new AssessmentError("INVALID_STATE", "Item tidak valid");
  }

  const response: SkillResponse = {
    id: `skres_${attempt.id}_${input.itemId}`,
    skillAttemptId: attempt.id,
    itemId: input.itemId,
    answer: input.answer,
    updatedAt: now,
  };
  await ports.skillResponses.upsert(response);
}

export async function getSkillRunnerView(
  ports: AssessmentPorts & SkillPorts,
  input: { skillAttemptId: string; participantId: ParticipantId },
): Promise<PublicSkillRunnerView> {
  const attempt = await ports.skillAttempts.findById(input.skillAttemptId);
  if (!attempt || attempt.participantId !== input.participantId) {
    throw new AssessmentError("NOT_FOUND", "Skill attempt tidak ditemukan");
  }

  const pack = getSkillPack(attempt.fieldId, attempt.skillContentVersionId);
  if (!pack) {
    throw new AssessmentError("NOT_FOUND", "Paket soal tidak ditemukan");
  }

  const field = getFieldDef(attempt.fieldId);
  const category = field ? getCategoryDef(field.categoryId) : undefined;

  const responses = await ports.skillResponses.listBySkillAttempt(attempt.id);
  const responseMap: Record<string, string> = {};
  for (const r of responses) {
    responseMap[r.itemId] = r.answer;
  }

  const graceMs = ports.graceWindowMs ?? DEFAULT_GRACE_MS;
  const now = ports.clock.now();

  return {
    skillAttemptId: attempt.id,
    sourceAttemptId: attempt.sourceAttemptId,
    fieldId: attempt.fieldId,
    fieldLabel: pack.label,
    categoryLabel: category?.label ?? "",
    instruction: pack.instruction,
    timeLimitSeconds: pack.timeLimitSeconds,
    endsAt: attempt.endsAt.toISOString(),
    graceEndsAt: new Date(attempt.endsAt.getTime() + graceMs).toISOString(),
    serverNow: now.toISOString(),
    status: attempt.status,
    items: pack.items.map((item) => ({
      id: item.id,
      prompt: item.prompt,
      choices: item.choices.map((c) => ({ id: c.id, label: c.label })),
    })),
    responses: responseMap,
    answeredCount: Object.keys(responseMap).length,
    itemCount: pack.items.length,
  };
}
