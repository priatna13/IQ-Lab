import { buildDomainItems, type ItemDraft } from "../item-helpers";

/** Keys balanced: a,a,b,b,c,c,d,d — pola simbol teks */
const DRAFTS: ItemDraft[] = [
  {
    n: "01",
    prompt: "Pola bergantian: □ ○ □ ○ □ … Simbol berikutnya?",
    choices: ["○", "□", "△", "●"],
    correctKey: "a",
    difficulty: 1,
  },
  {
    n: "02",
    prompt:
      "Urutan jumlah sisi: segitiga (3), persegi (4), segi lima (5), … Bentuk berikutnya?",
    choices: ["Segi enam (6)", "Lingkaran", "Segitiga", "Garis"],
    correctKey: "a",
    difficulty: 2,
  },
  {
    n: "03",
    prompt: "Pola: X Y X Y X … Huruf berikutnya?",
    choices: ["X", "Y", "Z", "W"],
    correctKey: "b",
    difficulty: 1,
  },
  {
    n: "04",
    prompt:
      "Pola grup: ▲ ▲ ● ▲ ▲ ● ▲ ▲ … Bentuk berikutnya? (dua segitiga, satu bulat)",
    choices: ["▲", "●", "■", "◆"],
    correctKey: "b",
    difficulty: 2,
  },
  {
    n: "05",
    prompt: "Pola: P, Q, P, Q, … Huruf berikutnya?",
    choices: ["Q", "R", "P", "S"],
    correctKey: "c",
    difficulty: 1,
  },
  {
    n: "06",
    prompt: "Pola jumlah garis: |  ||  |||  ||||  … Pola berikutnya?",
    choices: ["|||", "||||", "|||||", "||"],
    correctKey: "c",
    difficulty: 1,
  },
  {
    n: "07",
    prompt: "Baris: 1 = A B, 2 = B A, 3 = A B, 4 = ?",
    choices: ["A B", "A A", "B B", "B A"],
    correctKey: "d",
    difficulty: 3,
  },
  {
    n: "08",
    prompt: "Pola bukaan: ⊐ ⊏ ⊐ ⊏ ⊐ … Simbol berikutnya?",
    choices: ["⊐", "□", "○", "⊏"],
    correctKey: "d",
    difficulty: 2,
  },
];

export function itemsFigural() {
  return buildDomainItems("figural", DRAFTS);
}
