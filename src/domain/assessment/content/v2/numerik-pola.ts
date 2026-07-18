import { buildDomainItems, type ItemDraft } from "../item-helpers";

/** Keys balanced: a,a,b,b,c,c,d,d — patterns re-checked */
const DRAFTS: ItemDraft[] = [
  {
    n: "01",
    prompt: "2, 4, 6, 8, … Angka berikutnya?",
    choices: ["10", "9", "12", "14"],
    correctKey: "a",
    difficulty: 1,
  },
  {
    n: "02",
    prompt: "1, 1, 2, 3, 5, 8, … Angka berikutnya? (setiap suku = jumlah dua sebelumnya)",
    choices: ["13", "10", "11", "12"],
    correctKey: "a",
    difficulty: 2,
  },
  {
    n: "03",
    prompt: "3, 6, 12, 24, … Angka berikutnya?",
    choices: ["30", "48", "36", "60"],
    correctKey: "b",
    difficulty: 1,
  },
  {
    n: "04",
    prompt: "81, 27, 9, 3, … Angka berikutnya? (setiap suku dibagi 3)",
    choices: ["0", "1", "2", "3"],
    correctKey: "b",
    difficulty: 2,
  },
  {
    n: "05",
    prompt: "5, 8, 12, 17, … Angka berikutnya? (selisih +3, +4, +5, …)",
    choices: ["21", "22", "23", "24"],
    correctKey: "c",
    difficulty: 2,
  },
  {
    n: "06",
    prompt: "4, 9, 16, 25, … Angka berikutnya? (kuadrat: 2², 3², 4², 5², …)",
    choices: ["30", "32", "36", "49"],
    correctKey: "c",
    difficulty: 2,
  },
  {
    n: "07",
    prompt: "2, 3, 5, 8, 12, … Angka berikutnya? (selisih +1, +2, +3, +4, …)",
    choices: ["15", "16", "18", "17"],
    correctKey: "d",
    difficulty: 3,
  },
  {
    n: "08",
    prompt:
      "10, 7, 11, 8, 12, 9, … Angka berikutnya? (bergantian: −3, lalu +4)",
    choices: ["10", "11", "14", "13"],
    correctKey: "d",
    difficulty: 3,
  },
];

export function itemsNumerikPola() {
  return buildDomainItems("numerik_pola", DRAFTS);
}
