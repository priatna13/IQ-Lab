import { buildDomainItems, type ItemDraft } from "../item-helpers";

/** Keys balanced: a,a,b,b,c,c,d,d */
const DRAFTS: ItemDraft[] = [
  {
    n: "01",
    prompt: "5, 10, 15, 20, … Angka berikutnya?",
    choices: ["25", "22", "30", "24"],
    correctKey: "a",
    difficulty: 1,
  },
  {
    n: "02",
    prompt: "2, 4, 8, 16, … Angka berikutnya? (setiap suku ×2)",
    choices: ["32", "24", "20", "18"],
    correctKey: "a",
    difficulty: 1,
  },
  {
    n: "03",
    prompt: "100, 90, 80, 70, … Angka berikutnya?",
    choices: ["65", "60", "55", "50"],
    correctKey: "b",
    difficulty: 1,
  },
  {
    n: "04",
    prompt: "64, 32, 16, 8, … Angka berikutnya? (setiap suku ÷2)",
    choices: ["6", "4", "2", "1"],
    correctKey: "b",
    difficulty: 2,
  },
  {
    n: "05",
    prompt: "3, 5, 9, 17, … Angka berikutnya? (selisih +2, +4, +8, … ×2)",
    choices: ["25", "30", "33", "34"],
    correctKey: "c",
    difficulty: 3,
  },
  {
    n: "06",
    prompt: "1, 4, 9, 16, … Angka berikutnya? (kuadrat: 1², 2², 3², 4², …)",
    choices: ["20", "24", "25", "36"],
    correctKey: "c",
    difficulty: 2,
  },
  {
    n: "07",
    prompt: "7, 10, 14, 19, … Angka berikutnya? (selisih +3, +4, +5, …)",
    choices: ["22", "23", "26", "25"],
    correctKey: "d",
    difficulty: 2,
  },
  {
    n: "08",
    prompt: "4, 6, 5, 7, 6, 8, … Angka berikutnya? (bergantian +2 lalu −1)",
    choices: ["5", "6", "9", "7"],
    correctKey: "d",
    difficulty: 3,
  },
];

export function itemsNumerikPola() {
  return buildDomainItems("numerik_pola", DRAFTS);
}
