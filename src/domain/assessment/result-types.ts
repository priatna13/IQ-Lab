import type { RulePayload } from "./career-rules";
import type { ContentVersionId, ParticipantId, Track } from "./types";
import type { DomainId } from "./content-types";

export type ResultSnapshotId = string;

export type DomainScoreEntry = {
  domainId: DomainId;
  label: string;
  rawCorrect: number;
  rawTotal: number;
  score: number;
};

export type AbilityProfile = DomainScoreEntry[];

export type ResultSnapshot = {
  id: ResultSnapshotId;
  attemptId: string;
  participantId: ParticipantId;
  track: Track;
  contentVersionId: ContentVersionId;
  normVersion: string;
  frozenAt: Date;
  abilityProfile: AbilityProfile;
  compositeIndex: number;
  iqEstimate: number;
  rulePayload: RulePayload | null;
  insightProse: string | null;
  actionPlanProse: string | null;
  /** Durable PDF archive in Storage (content ≡ snapshot). */
  pdfUrl?: string | null;
  pdfKey?: string | null;
};

/** Public report DTO (immutable view of snapshot). */
export type PublicResultReport = {
  attemptId: string;
  track: Track;
  contentVersionId: ContentVersionId;
  normVersion: string;
  frozenAt: string;
  abilityProfile: AbilityProfile;
  compositeIndex: number;
  iqEstimate: number;
  labels: {
    composite: string;
    iqEstimate: string;
    normBadge: string;
    disclaimer: string;
  };
  rulePayload: RulePayload | null;
  insightProse: string | null;
  actionPlanProse: string | null;
};

export function toPublicResultReport(snapshot: ResultSnapshot): PublicResultReport {
  return {
    attemptId: snapshot.attemptId,
    track: snapshot.track,
    contentVersionId: snapshot.contentVersionId,
    normVersion: snapshot.normVersion,
    frozenAt: snapshot.frozenAt.toISOString(),
    abilityProfile: snapshot.abilityProfile.map((e) => ({ ...e })),
    compositeIndex: snapshot.compositeIndex,
    iqEstimate: snapshot.iqEstimate,
    labels: {
      composite: "Indeks kemampuan umum",
      iqEstimate: "Estimasi IQ (norma internal IQ-Lab)",
      normBadge: "Estimasi · norma sementara",
      disclaimer:
        "Hasil ini untuk pengembangan diri. Bukan tes IST resmi, bukan diagnosis klinis, dan bukan sertifikasi rekrutmen. Angka IQ adalah estimasi norma internal sementara.",
    },
    rulePayload: snapshot.rulePayload
      ? structuredClone(snapshot.rulePayload)
      : null,
    insightProse: snapshot.insightProse,
    actionPlanProse: snapshot.actionPlanProse,
  };
}
