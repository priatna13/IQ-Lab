/** Shared Domain metadata for Content Versions (fixed order). */
export const DOMAIN_SPECS: Array<{
  id: string;
  label: string;
  instruction: string;
  timeLimitSeconds: number;
}> = [
  {
    id: "verbal_pemahaman",
    label: "Pemahaman verbal",
    instruction:
      "Baca setiap soal dengan saksama. Pilih makna kata atau jawaban yang paling sesuai dengan wacana singkat.",
    timeLimitSeconds: 480,
  },
  {
    id: "verbal_analogi",
    label: "Analogi verbal",
    instruction:
      "Temukan hubungan antar kata pada pasangan contoh, lalu pilih pasangan yang paling selaras.",
    timeLimitSeconds: 480,
  },
  {
    id: "numerik_operasi",
    label: "Operasi numerik",
    instruction:
      "Selesaikan perhitungan dengan cepat dan akurat. Tidak ada kalkulator.",
    timeLimitSeconds: 480,
  },
  {
    id: "numerik_pola",
    label: "Deret / pola angka",
    instruction:
      "Temukan pola pada deret angka, lalu pilih kelanjutan atau bilangan yang tepat.",
    timeLimitSeconds: 480,
  },
  {
    id: "figural",
    label: "Figural / pola bentuk",
    instruction:
      "Amati pola simbol atau bentuk (disajikan sebagai teks), lalu pilih opsi yang melengkapi.",
    timeLimitSeconds: 540,
  },
  {
    id: "spasial",
    label: "Spasial",
    instruction:
      "Bayangkan rotasi, lipatan, atau relasi ruang dari deskripsi teks, lalu pilih jawaban benar.",
    timeLimitSeconds: 540,
  },
  {
    id: "memori",
    label: "Memori kerja",
    instruction:
      "Setiap soal menampilkan materi singkat lalu pertanyaan. Jawab hanya berdasarkan materi pada soal itu.",
    timeLimitSeconds: 420,
  },
  {
    id: "logika",
    label: "Penalaran logis",
    instruction:
      "Terapkan aturan atau deduksi dari premis yang diberikan. Pilih kesimpulan yang valid.",
    timeLimitSeconds: 540,
  },
  {
    id: "praktis",
    label: "Penilaian praktis",
    instruction:
      "Pilih opsi yang paling masuk akal dan bertanggung jawab dalam situasi sehari-hari atau kerja.",
    timeLimitSeconds: 480,
  },
];
