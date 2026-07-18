/** Shared Domain metadata for Content Versions (fixed order). Labels/instructions = UI BI. */

export type DomainSpec = {
  id: string;
  /** Short title shown in progress list and runner header. */
  label: string;
  /** One-line purpose (progress / onboarding). */
  shortBlurb: string;
  /** Full instructions shown when a Domain Session opens. */
  instruction: string;
  timeLimitSeconds: number;
};

/**
 * Fixed nine-domain sequence (Content Version order).
 * Timer targets soft-launch: ~7–9 min / domain → total roughly 60–90+ min.
 */
export const DOMAIN_SPECS: DomainSpec[] = [
  {
    id: "verbal_pemahaman",
    label: "Pemahaman verbal",
    shortBlurb: "Makna kata dan wacana singkat",
    instruction:
      "Baca setiap soal dengan saksama. Pilih makna kata atau jawaban yang paling sesuai dengan kalimat/wacana. Ada 4 pilihan; hanya satu yang paling tepat. Tidak ada penalti tebak-tebakan, tetapi kerjakan dengan jujur.",
    timeLimitSeconds: 480,
  },
  {
    id: "verbal_analogi",
    label: "Analogi verbal",
    shortBlurb: "Hubungan antar kata",
    instruction:
      "Setiap soal berbentuk A : B = C : ? Temukan hubungan antara A dan B, lalu pilih kata yang membuat hubungan C dengan pilihan itu paling selaras. Fokus pada jenis hubungan (mis. lawan kata, tempat kerja, bagian–keseluruhan), bukan kemiripan bunyi.",
    timeLimitSeconds: 480,
  },
  {
    id: "numerik_operasi",
    label: "Operasi numerik",
    shortBlurb: "Hitung cepat dan akurat",
    instruction:
      "Selesaikan perhitungan aritmetika (tambah, kurang, kali, bagi, persen, rata-rata, proporsi). Kerjakan di kertas coretan bila perlu. Kalkulator atau aplikasi hitung tidak diizinkan. Perhatikan satuan (rupiah, liter, pecahan).",
    timeLimitSeconds: 480,
  },
  {
    id: "numerik_pola",
    label: "Deret dan pola angka",
    shortBlurb: "Kelanjutan deret bilangan",
    instruction:
      "Temukan aturan pada deret angka (selisih, kelipatan, kuadrat, pola bergantian, dll.), lalu pilih angka berikutnya yang paling konsisten. Beberapa soal memberi petunjuk pola di dalam teks soal — manfaatkan jika ada.",
    timeLimitSeconds: 480,
  },
  {
    id: "figural",
    label: "Pola figural (teks)",
    shortBlurb: "Pola simbol dan bentuk tertulis",
    instruction:
      "Pola disajikan sebagai rangkaian simbol atau teks (bukan gambar terpisah). Amati urutan atau aturan pengulangan, lalu pilih opsi yang melengkapi dengan paling logis. Baca urutan dari kiri ke kanan kecuali petunjuk lain.",
    timeLimitSeconds: 540,
  },
  {
    id: "spasial",
    label: "Spasial",
    shortBlurb: "Arah, rotasi, dan ruang",
    instruction:
      "Bayangkan posisi, arah mata angin, rotasi, atau lipatan dari deskripsi teks. Anda boleh coret sketsa sederhana. Jawab berdasarkan deskripsi soal, bukan asumsi di luar teks.",
    timeLimitSeconds: 540,
  },
  {
    id: "memori",
    label: "Memori kerja",
    shortBlurb: "Ingat materi singkat dalam soal",
    instruction:
      "Setiap soal berisi materi singkat (daftar, kode, aturan) lalu pertanyaan di bawahnya. Jawab hanya dari materi pada soal itu — jangan mengandalkan pengetahuan luar. Materi sengaja tetap terlihat di layar (format memori kerja untuk asesmen teks).",
    timeLimitSeconds: 420,
  },
  {
    id: "logika",
    label: "Penalaran logis",
    shortBlurb: "Deduksi dari premis",
    instruction:
      "Gunakan hanya premis/aturan yang diberikan. Pilih kesimpulan yang valid secara logika — bukan yang “paling mungkin di dunia nyata” jika premis tidak mendukung. Hindari asumsi tambahan.",
    timeLimitSeconds: 540,
  },
  {
    id: "praktis",
    label: "Penilaian praktis",
    shortBlurb: "Keputusan situasional yang bertanggung jawab",
    instruction:
      "Pilih tindakan yang paling masuk akal, etis, dan profesional dalam konteks kerja atau sehari-hari. Utamakan keamanan data, kejujuran, komunikasi jelas, dan tanggung jawab proses — bukan jalan pintas yang merugikan orang lain.",
    timeLimitSeconds: 480,
  },
];

export function formatDomainMinutes(timeLimitSeconds: number): string {
  const m = Math.round(timeLimitSeconds / 60);
  return `±${m} menit`;
}
