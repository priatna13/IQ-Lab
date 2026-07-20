import { buildDomainItems, type ItemDraft } from "../item-helpers";

/** Keys balanced: a,a,b,b,c,c,d,d */
const DRAFTS: ItemDraft[] = [
  {
    n: "01",
    prompt: "48 + 27 = ?",
    choices: ["75", "65", "73", "85"],
    correctKey: "a",
    difficulty: 1,
  },
  {
    n: "02",
    prompt: "Rata-rata dari 6, 10, 14, 18 adalah…",
    choices: ["12", "10", "14", "16"],
    correctKey: "a",
    difficulty: 2,
  },
  {
    n: "03",
    prompt: "9 × 6 − 12 = ?",
    choices: ["40", "42", "54", "66"],
    correctKey: "b",
    difficulty: 2,
  },
  {
    n: "04",
    prompt: "Harga Rp120.000 setelah diskon 20% menjadi…",
    choices: ["Rp24.000", "Rp96.000", "Rp100.000", "Rp90.000"],
    correctKey: "b",
    difficulty: 2,
  },
  {
    n: "05",
    prompt: "144 ÷ 12 = ?",
    choices: ["10", "11", "12", "14"],
    correctKey: "c",
    difficulty: 1,
  },
  {
    n: "06",
    prompt: "Sepertiga dari 180 adalah…",
    choices: ["40", "50", "60", "90"],
    correctKey: "c",
    difficulty: 1,
  },
  {
    n: "07",
    prompt: "Jika 4 buku seharga Rp60.000, harga 6 buku (harga sama) adalah…",
    choices: ["Rp80.000", "Rp85.000", "Rp100.000", "Rp90.000"],
    correctKey: "d",
    difficulty: 2,
  },
  {
    n: "08",
    prompt: "Sebuah drum terisi 3/5. Kapasitas 200 liter. Volume terisi…",
    choices: ["80 liter", "100 liter", "150 liter", "120 liter"],
    correctKey: "d",
    difficulty: 2,
  },
];

export function itemsNumerikOperasi() {
  return buildDomainItems("numerik_operasi", DRAFTS);
}
