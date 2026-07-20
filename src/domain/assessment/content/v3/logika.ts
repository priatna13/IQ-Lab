import { buildDomainItems, type ItemDraft } from "../item-helpers";

/** Keys balanced: a,a,b,b,c,c,d,d */
const DRAFTS: ItemDraft[] = [
  {
    n: "01",
    prompt:
      "Semua peserta mendapat sertifikat. Andi adalah peserta. Kesimpulan valid…",
    choices: [
      "Andi mendapat sertifikat",
      "Andi adalah panitia",
      "Semua orang mendapat sertifikat",
      "Andi tidak hadir",
    ],
    correctKey: "a",
    difficulty: 1,
  },
  {
    n: "02",
    prompt:
      'Pernyataan: "Semua tiket terjual." Manakah yang menegasikannya?',
    choices: [
      "Ada tiket yang belum terjual",
      "Banyak tiket terjual",
      "Tiket A terjual",
      "Semua tiket dicetak",
    ],
    correctKey: "a",
    difficulty: 2,
  },
  {
    n: "03",
    prompt:
      "Jika listrik padam, lift berhenti. Lift tidak berhenti. Kesimpulan paling valid…",
    choices: [
      "Pasti listrik padam",
      "Listrik tidak padam",
      "Lift selalu rusak",
      "Tidak ada hubungan",
    ],
    correctKey: "b",
    difficulty: 2,
  },
  {
    n: "04",
    prompt:
      "Hanya anggota klub boleh masuk aula. Rina bukan anggota. Maka…",
    choices: [
      "Rina boleh masuk",
      "Rina tidak boleh masuk",
      "Rina pasti panitia",
      "Tidak relevan",
    ],
    correctKey: "b",
    difficulty: 1,
  },
  {
    n: "05",
    prompt:
      "Premis: Tidak ada ikan yang menyusui. Paus menyusui. Kesimpulan…",
    choices: [
      "Paus adalah ikan",
      "Semua paus di laut",
      "Paus bukan ikan",
      "Ikan menyusui",
    ],
    correctKey: "c",
    difficulty: 2,
  },
  {
    n: "06",
    prompt:
      "Aturan: Jika stok habis DAN pemasok telat, status = kritis. Stok habis tetapi pemasok tepat waktu. Dari aturan itu saja…",
    choices: [
      "Status pasti kritis",
      "Pesanan dibatalkan otomatis",
      "Syarat kritis belum terpenuhi",
      "Gudang harus ditutup",
    ],
    correctKey: "c",
    difficulty: 2,
  },
  {
    n: "07",
    prompt:
      "Antrian: A di depan B; C di belakang B; D di depan A. Urutan depan → belakang…",
    choices: ["A-D-B-C", "D-B-A-C", "C-B-A-D", "D-A-B-C"],
    correctKey: "d",
    difficulty: 3,
  },
  {
    n: "08",
    prompt:
      "Tiga kotak berlabel, SEMUA label salah. Kotak berlabel “kosong” pasti…",
    choices: [
      "Benar-benar kosong",
      "Berisi apa pun sesuai label",
      "Tidak bisa disimpulkan",
      "Tidak kosong (karena label salah)",
    ],
    correctKey: "d",
    difficulty: 3,
  },
];

export function itemsLogika() {
  return buildDomainItems("logika", DRAFTS);
}
