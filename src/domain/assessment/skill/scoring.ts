import { domainScoreFromRaw } from "../scoring";
import type { AbilityProfile } from "../result-types";
import type { FieldDef } from "./types";
import type { DomainAlignment, DomainAlignmentKind } from "./types";

export function skillScoreFromRaw(correct: number, total: number): number {
  return domainScoreFromRaw(correct, total);
}

export function averageRelevantDomainScore(
  profile: AbilityProfile,
  field: FieldDef,
): number {
  const map = new Map(profile.map((e) => [e.domainId, e.score]));
  const vals = field.relevantDomains
    .map((id) => map.get(id))
    .filter((n): n is number => typeof n === "number");
  if (vals.length === 0) return 50;
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
}

const HIGH = 65;
const LOW = 45;

export function buildDomainAlignment(
  profile: AbilityProfile,
  field: FieldDef,
  skillScore: number,
): DomainAlignment {
  const relevantDomainAvg = averageRelevantDomainScore(profile, field);
  const domainStrong = relevantDomainAvg >= HIGH;
  const domainWeak = relevantDomainAvg <= LOW;
  const skillStrong = skillScore >= HIGH;
  const skillWeak = skillScore <= LOW;

  let kind: DomainAlignmentKind;
  let summary: string;

  if (domainStrong && skillStrong) {
    kind = "selaras";
    summary =
      "Profil domain yang relevan dengan bidang ini kuat, dan skor keahlian juga solid — arah bidang selaras dengan performa Anda.";
  } else if (domainStrong && skillWeak) {
    kind = "potensi_belum_terampil";
    summary =
      "Fondasi kognitif untuk bidang ini terlihat menjanjikan, tetapi skor keahlian teknis masih perlu diasah lewat praktik dan belajar terarah.";
  } else if (domainWeak && skillStrong) {
    kind = "pengalaman_mengompensasi";
    summary =
      "Skor keahlian bidang relatif baik meski domain terkait tidak menonjol — pengetahuan/pengalaman praktik kemungkinan mengompensasi.";
  } else {
    kind = "perlu_penguatan_ganda";
    summary =
      "Baik fondasi domain terkait maupun skor keahlian masih bisa ditingkatkan. Mulai dari konsep inti bidang dan latihan terstruktur.";
  }

  return { kind, relevantDomainAvg, skillScore, summary };
}

export function buildSkillInsightProse(input: {
  fieldLabel: string;
  score: number;
  rawCorrect: number;
  rawTotal: number;
  alignment: DomainAlignment;
}): string {
  const { fieldLabel, score, rawCorrect, rawTotal, alignment } = input;
  return [
    `Hasil asesmen keahlian untuk ${fieldLabel}: skor ${score} dari 100 (${rawCorrect} benar dari ${rawTotal} soal).`,
    alignment.summary,
    `Rata-rata domain kognitif terkait: ${alignment.relevantDomainAvg}.`,
    "Ini bukan sertifikasi industri. Gunakan sebagai peta belajar dan bahan refleksi karier bersama mentor atau pengalaman kerja nyata.",
  ].join(" ");
}
