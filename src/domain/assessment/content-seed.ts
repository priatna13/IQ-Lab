import type { ContentVersion, DomainDefinition, Item } from "./content-types";

const DOMAIN_SPECS: Array<{
  id: string;
  label: string;
  instruction: string;
  timeLimitSeconds: number;
}> = [
  {
    id: "verbal_pemahaman",
    label: "Pemahaman verbal",
    instruction:
      "Pilih makna kata atau jawaban yang paling sesuai dengan wacana singkat.",
    timeLimitSeconds: 480,
  },
  {
    id: "verbal_analogi",
    label: "Analogi verbal",
    instruction: "Temukan hubungan antar kata yang paling selaras.",
    timeLimitSeconds: 480,
  },
  {
    id: "numerik_operasi",
    label: "Operasi numerik",
    instruction: "Selesaikan perhitungan dengan cepat dan akurat.",
    timeLimitSeconds: 480,
  },
  {
    id: "numerik_pola",
    label: "Deret / pola angka",
    instruction: "Temukan pola pada deret angka, lalu pilih kelanjutan yang tepat.",
    timeLimitSeconds: 480,
  },
  {
    id: "figural",
    label: "Figural / pola bentuk",
    instruction: "Amati pola bentuk dan pilih opsi yang melengkapi.",
    timeLimitSeconds: 540,
  },
  {
    id: "spasial",
    label: "Spasial",
    instruction: "Bayangkan rotasi atau relasi ruang, lalu pilih jawaban benar.",
    timeLimitSeconds: 540,
  },
  {
    id: "memori",
    label: "Memori",
    instruction:
      "Ingat materi singkat, lalu jawab pertanyaan tanpa melihat materi lagi.",
    timeLimitSeconds: 420,
  },
  {
    id: "logika",
    label: "Penalaran logis",
    instruction: "Terapkan aturan atau deduksi untuk memilih kesimpulan yang valid.",
    timeLimitSeconds: 540,
  },
  {
    id: "praktis",
    label: "Penilaian praktis",
    instruction:
      "Pilih opsi yang paling masuk akal dalam situasi sehari-hari / kerja.",
    timeLimitSeconds: 480,
  },
];

const ITEMS_PER_DOMAIN = 8;

function buildItems(domainId: string): Item[] {
  return Array.from({ length: ITEMS_PER_DOMAIN }, (_, index) => {
    const n = index + 1;
    const correctKey = (["a", "b", "c", "d"] as const)[index % 4];
    return {
      id: `${domainId}_i${n}`,
      domainId,
      prompt: `[${domainId}] Soal latihan MVP #${n}. Pilih opsi yang ditandai sebagai kunci untuk domain ini (placeholder konten; diganti set ter-review).`,
      choices: [
        { id: "a", label: "Opsi A" },
        { id: "b", label: "Opsi B" },
        { id: "c", label: "Opsi C" },
        { id: "d", label: "Opsi D" },
      ],
      correctKey,
      difficulty: 1 + (index % 5),
    };
  });
}

function buildDomains(): DomainDefinition[] {
  return DOMAIN_SPECS.map((spec) => ({
    ...spec,
    items: buildItems(spec.id),
  }));
}

/**
 * Historical Content Version (placeholder items).
 * Kept loadable for Attempts that pinned v1; not published for new Attempts.
 */
export const MVP_CONTENT_VERSION_ID = "cv_mvp_v1";

export function getMvpContentVersion(): ContentVersion {
  const domains = buildDomains();
  return {
    id: MVP_CONTENT_VERSION_ID,
    label: "IQ-Lab MVP v1 (placeholder)",
    published: false,
    domainOrder: domains.map((d) => d.id),
    domains,
  };
}
