import { buildDomainItems, type ItemDraft } from "../item-helpers";

/** Keys balanced: a,a,b,b,c,c,d,d */
const DRAFTS: ItemDraft[] = [
  {
    n: "01",
    prompt: "Pola bergantian: ○ △ ○ △ ○ … Simbol berikutnya?",
    choices: ["△", "○", "□", "●"],
    correctKey: "a",
    difficulty: 1,
  },
  {
    n: "02",
    prompt:
      "Urutan jumlah sisi: segitiga (3), persegi (4), segi lima (5), … Bentuk berikutnya?",
    choices: ["Segi enam (6)", "Lingkaran (tanpa sisi lurus)", "Segitiga lagi", "Garis (1)"],
    correctKey: "a",
    difficulty: 2,
  },
  {
    n: "03",
    prompt: "Pola bergantian: A B A B A … Huruf berikutnya?",
    choices: ["A", "B", "C", "D"],
    correctKey: "b",
    difficulty: 1,
  },
  {
    n: "04",
    prompt:
      "Pola grup 3: ■ ■ □ ■ ■ □ ■ ■ … Bentuk berikutnya? (dua hitam, satu putih, berulang)",
    choices: ["■", "□", "●", "▲"],
    correctKey: "b",
    difficulty: 2,
  },
  {
    n: "05",
    prompt: "Pola bergantian huruf: N, Z, N, Z, … Huruf berikutnya?",
    choices: ["Z", "H", "N", "I"],
    correctKey: "c",
    difficulty: 2,
  },
  {
    n: "06",
    prompt: "Pola jumlah bintang: *  **  ***  ****  … Pola berikutnya?",
    choices: ["***", "****", "*****", "**"],
    correctKey: "c",
    difficulty: 1,
  },
  {
    n: "07",
    prompt:
      "Baris bergantian: baris-1 = A B, baris-2 = B A, baris-3 = A B, baris-4 = ?",
    choices: ["A B", "A A", "B B", "B A"],
    correctKey: "d",
    difficulty: 3,
  },
  {
    n: "08",
    prompt:
      "Pola arah bukaan: ⊐ (buka kanan), ⊏ (buka kiri), ⊐, … Simbol berikutnya?",
    choices: ["⊐", "□", "○", "⊏"],
    correctKey: "d",
    difficulty: 3,
  },
];

export function itemsFigural() {
  return buildDomainItems("figural", DRAFTS);
}
