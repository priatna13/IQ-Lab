import { buildDomainItems, type ItemDraft } from "../item-helpers";

/** Keys balanced: a,a,b,b,c,c,d,d */
const DRAFTS: ItemDraft[] = [
  {
    n: "01",
    prompt:
      "Materi (ingat): PIN = 3, 8, 1, 6.\nPertanyaan: Angka kedua pada PIN adalah…",
    choices: ["8", "3", "1", "6"],
    correctKey: "a",
    difficulty: 1,
  },
  {
    n: "02",
    prompt:
      "Materi: Rute kunjungan — Depok → Bogor → Sukabumi. Pertanyaan: Kota terakhir…",
    choices: ["Sukabumi", "Depok", "Bogor", "Jakarta"],
    correctKey: "a",
    difficulty: 1,
  },
  {
    n: "03",
    prompt:
      "Materi: Daftar tugas — arsip, cetak, kirim, arsip ulang. Pertanyaan: Tugas ketiga…",
    choices: ["Arsip", "Kirim", "Cetak", "Arsip ulang"],
    correctKey: "b",
    difficulty: 1,
  },
  {
    n: "04",
    prompt:
      "Materi: Jadwal — 08.00 buka, 12.00 istirahat, 13.00 lanjut. Kegiatan pukul 12.00?",
    choices: ["Buka", "Istirahat", "Lanjut", "Tutup"],
    correctKey: "b",
    difficulty: 1,
  },
  {
    n: "05",
    prompt:
      "Materi: Grup A (Eka, Fajar), Grup B (Gita, Hana). Siapa satu grup dengan Gita?",
    choices: ["Eka", "Fajar", "Hana", "Tidak ada"],
    correctKey: "c",
    difficulty: 2,
  },
  {
    n: "06",
    prompt:
      "Materi: Kode huruf R – T – V – X. Huruf tepat setelah T adalah…",
    choices: ["R", "T", "V", "X"],
    correctKey: "c",
    difficulty: 2,
  },
  {
    n: "07",
    prompt:
      "Materi: Skor — Lia 7, Mira 9, Nia 6, Oki 8. Siapa skor tertinggi?",
    choices: ["Lia", "Nia", "Oki", "Mira"],
    correctKey: "d",
    difficulty: 2,
  },
  {
    n: "08",
    prompt:
      "Materi: Aturan tumpukan — kuning di atas hijau; biru di bawah hijau. Warna paling atas…",
    choices: ["Hijau", "Biru", "Merah", "Kuning"],
    correctKey: "d",
    difficulty: 3,
  },
];

export function itemsMemori() {
  return buildDomainItems("memori", DRAFTS);
}
