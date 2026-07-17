import type { RulePayload } from "./career-rules";

export type InsightNarration = {
  insightProse: string;
  actionPlanProse: string;
  source: "template" | "llm";
};

/** Deterministic Bahasa Indonesia narration from Rule Payload (LLM fallback). */
export function narrateFromTemplate(payload: RulePayload): InsightNarration {
  const strengthText = payload.strengths
    .map((s) => `${s.label} (${s.score})`)
    .join(", ");
  const growthText = payload.growthAreas
    .map((s) => `${s.label} (${s.score})`)
    .join(", ");
  const clusterText = payload.clusters
    .map((c) => `${c.label} (kecocokan ~${c.fitScore})`)
    .join("; ");

  const confidenceNote =
    payload.confidence === "low"
      ? "Profil relatif datar — anggap rekomendasi sebagai arah eksplorasi, bukan penentuan tunggal."
      : payload.confidence === "high"
        ? "Ada kontras yang jelas antar domain — prioritas di bawah cenderung lebih tajam."
        : "Kontras antar domain sedang — gunakan ini sebagai peta awal.";

  const insightProse = [
    `Berdasarkan profil multi-domain Anda, kekuatan menonjol pada: ${strengthText || "—"}.`,
    `Area yang paling berpeluang dikembangkan: ${growthText || "—"}.`,
    `Klaster arah yang selaras dengan pola skor (rule engine ${payload.version}): ${clusterText || "—"}.`,
    confidenceNote,
    "Ini insight pengembangan diri IQ-Lab — bukan diagnosis klinis atau penempatan kerja resmi.",
  ].join(" ");

  const skills = payload.skillPriorities.join(", ") || "praktik terarah sesuai klaster";

  let actionPlanProse: string;
  if (payload.track === "explore") {
    actionPlanProse = [
      "Rencana eksplorasi (30/60/90 hari):",
      `30 hari — pilih 1 klaster teratas dan coba proyek mini atau mata kuliah terkait; latih skill: ${skills}.`,
      "60 hari — kumpulkan bukti (portfolio/catatan refleksi) dari 2–3 aktivitas di klaster yang sama.",
      "90 hari — evaluasi mana yang terasa natural; putuskan jalur eksplorasi lanjutan atau ganti klaster #2.",
    ].join(" ");
  } else {
    actionPlanProse = [
      "Rencana langkah karir:",
      `Prioritas skill: ${skills}.`,
      "Bandingkan job description target dengan kekuatan domain Anda; catat 2–3 skill gap konkret.",
      "Rancang 1 proyek kerja/portofolio yang menonjolkan klaster #1 dan menutup gap terbesar.",
      "Diskusikan temuan ini dengan mentor/rekan — bukan sebagai skor rekrutmen, melainkan peta pengembangan.",
    ].join(" ");
  }

  return { insightProse, actionPlanProse, source: "template" };
}
