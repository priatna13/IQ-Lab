import { buildDomainItems, type ItemDraft } from "../item-helpers";

/** Keys balanced: a,a,b,b,c,c,d,d */
const DRAFTS: ItemDraft[] = [
  {
    n: "01",
    prompt:
      "Materi: KODE = 7, 2, 9, 4. Pertanyaan: Angka pertama pada kode adalah…",
    choices: ["7", "2", "9", "4"],
    correctKey: "a",
    difficulty: 1,
  },
  {
    n: "02",
    prompt:
      "Materi: Tiga kota dikunjungi berurutan: Bandung → Semarang → Surabaya. Pertanyaan: Kota pertama…",
    choices: ["Bandung", "Semarang", "Surabaya", "Jakarta"],
    correctKey: "a",
    difficulty: 1,
  },
  {
    n: "03",
    prompt:
      "Materi: Daftar belanja — susu, roti, telur, apel. Pertanyaan: Item kedua adalah…",
    choices: ["Susu", "Roti", "Telur", "Apel"],
    correctKey: "b",
    difficulty: 1,
  },
  {
    n: "04",
    prompt:
      "Materi: Urutan rapat — 09.00 briefing, 10.00 demo, 11.00 Q&A. Pertanyaan: Kegiatan pukul 10.00?",
    choices: ["Briefing", "Demo", "Q&A", "Istirahat"],
    correctKey: "b",
    difficulty: 1,
  },
  {
    n: "05",
    prompt:
      "Materi: Tim A (Rina, Budi), Tim B (Sari, Doni). Pertanyaan: Siapa satu tim dengan Sari?",
    choices: ["Rina", "Budi", "Doni", "Tidak ada"],
    correctKey: "c",
    difficulty: 2,
  },
  {
    n: "06",
    prompt:
      "Materi: Kata sandi huruf: M – K – P – L. Pertanyaan: Huruf tepat sebelum L adalah…",
    choices: ["M", "K", "P", "L"],
    correctKey: "c",
    difficulty: 2,
  },
  {
    n: "07",
    prompt:
      "Materi: Skor kuis — Ana 8, Bima 6, Cici 9, Dedi 7. Pertanyaan: Siapa skor tertinggi?",
    choices: ["Ana", "Bima", "Dedi", "Cici"],
    correctKey: "d",
    difficulty: 2,
  },
  {
    n: "08",
    prompt:
      "Materi: Aturan rak — biru di atas merah; hijau di bawah merah. Urutan atas → bawah: biru, merah, hijau. Warna paling atas…",
    choices: ["Merah", "Hijau", "Kuning", "Biru"],
    correctKey: "d",
    difficulty: 3,
  },
];

export function itemsMemori() {
  return buildDomainItems("memori", DRAFTS);
}
