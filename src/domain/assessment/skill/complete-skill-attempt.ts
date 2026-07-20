import type { AssessmentPorts } from "../ports";
import { AssessmentError } from "../types";
import type { ParticipantId } from "../types";
import { getFieldDef, getCategoryDef } from "./field-catalog";
import { getSkillPack } from "./content/skill_v1";
import type { SkillPorts } from "./ports";
import {
  buildDomainAlignment,
  buildSkillInsightProse,
  skillScoreFromRaw,
} from "./scoring";
import type { PublicSkillResult, SkillResultSnapshot } from "./types";

export async function completeSkillAttempt(
  ports: AssessmentPorts & SkillPorts,
  input: { skillAttemptId: string; participantId: ParticipantId },
): Promise<SkillResultSnapshot> {
  const attempt = await ports.skillAttempts.findById(input.skillAttemptId);
  if (!attempt || attempt.participantId !== input.participantId) {
    throw new AssessmentError("NOT_FOUND", "Skill attempt tidak ditemukan");
  }

  const existing = await ports.skillSnapshots.findBySkillAttemptId(attempt.id);
  if (existing) return existing;

  if (attempt.status === "completed") {
    throw new AssessmentError("INVALID_STATE", "Snapshot keahlian hilang");
  }

  const pack = getSkillPack(attempt.fieldId, attempt.skillContentVersionId);
  if (!pack) {
    throw new AssessmentError("NOT_FOUND", "Paket soal tidak ditemukan");
  }

  const field = getFieldDef(attempt.fieldId);
  if (!field) {
    throw new AssessmentError("NOT_FOUND", "Field tidak ditemukan");
  }
  const category = getCategoryDef(field.categoryId);

  const cognitiveSnap = await ports.resultSnapshots.findByAttemptId(
    attempt.sourceAttemptId,
  );
  if (!cognitiveSnap) {
    throw new AssessmentError(
      "INVALID_STATE",
      "Hasil asesmen 9 domain tidak ditemukan",
    );
  }

  const responses = await ports.skillResponses.listBySkillAttempt(attempt.id);
  const answerByItem = new Map(responses.map((r) => [r.itemId, r.answer]));

  let correct = 0;
  for (const item of pack.items) {
    if (answerByItem.get(item.id) === item.correctKey) correct += 1;
  }
  const total = pack.items.length;
  const score = skillScoreFromRaw(correct, total);
  const alignment = buildDomainAlignment(
    cognitiveSnap.abilityProfile,
    field,
    score,
  );
  const insightProse = buildSkillInsightProse({
    fieldLabel: field.label,
    score,
    rawCorrect: correct,
    rawTotal: total,
    alignment,
  });

  const now = ports.clock.now();
  const snapshot: SkillResultSnapshot = {
    id: `sksnap_${crypto.randomUUID()}`,
    skillAttemptId: attempt.id,
    participantId: attempt.participantId,
    sourceAttemptId: attempt.sourceAttemptId,
    fieldId: attempt.fieldId,
    fieldLabel: field.label,
    categoryId: field.categoryId,
    categoryLabel: category?.label ?? field.categoryId,
    skillContentVersionId: attempt.skillContentVersionId,
    rawCorrect: correct,
    rawTotal: total,
    score,
    domainAlignment: alignment,
    insightProse,
    frozenAt: now,
  };

  attempt.status = "completed";
  attempt.completedAt = now;
  await ports.skillAttempts.save(attempt);
  await ports.skillSnapshots.save(snapshot);
  return snapshot;
}

export function toPublicSkillResult(
  snapshot: SkillResultSnapshot,
): PublicSkillResult {
  return {
    skillAttemptId: snapshot.skillAttemptId,
    sourceAttemptId: snapshot.sourceAttemptId,
    fieldId: snapshot.fieldId,
    fieldLabel: snapshot.fieldLabel,
    categoryId: snapshot.categoryId,
    categoryLabel: snapshot.categoryLabel,
    score: snapshot.score,
    rawCorrect: snapshot.rawCorrect,
    rawTotal: snapshot.rawTotal,
    domainAlignment: { ...snapshot.domainAlignment },
    insightProse: snapshot.insightProse,
    frozenAt: snapshot.frozenAt.toISOString(),
    disclaimer:
      "Asesmen keahlian bidang untuk pengembangan diri. Bukan sertifikasi industri, bukan lisensi profesional, dan bukan pengganti asesmen rekrutmen resmi.",
  };
}
