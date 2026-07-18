import { buildDomainItems, type ItemDraft } from "../item-helpers";

/** Keys balanced: a,a,b,b,c,c,d,d — all math re-checked */
const DRAFTS: ItemDraft[] = [
  {
    n: "01",
    prompt: "15 + 27 = ?",
    choices: ["42", "32", "41", "52"],
    correctKey: "a",
    difficulty: 1,
  },
  {
    n: "02",
    prompt: "Rata-rata dari 4, 8, 12, 16 adalah…",
    choices: ["10", "8", "12", "14"],
    correctKey: "a",
    difficulty: 2,
  },
  {
    n: "03",
    prompt: "7 × 8 − 6 = ?",
    choices: ["48", "50", "56", "62"],
    correctKey: "b",
    difficulty: 2,
  },
  {
    n: "04",
    prompt: "Harga barang Rp80.000 setelah diskon 25% menjadi…",
    choices: ["Rp20.000", "Rp60.000", "Rp55.000", "Rp75.000"],
    correctKey: "b",
    difficulty: 2,
  },
  {
    n: "05",
    prompt: "96 ÷ 8 = ?",
    choices: ["10", "11", "12", "14"],
    correctKey: "c",
    difficulty: 1,
  },
  {
    n: "06",
    prompt: "Seperempat dari 240 adalah…",
    choices: ["40", "50", "60", "80"],
    correctKey: "c",
    difficulty: 1,
  },
  {
    n: "07",
    prompt: "Jika 3 pensil seharga Rp18.000, harga 5 pensil (harga sama) adalah…",
    choices: ["Rp24.000", "Rp28.000", "Rp36.000", "Rp30.000"],
    correctKey: "d",
    difficulty: 2,
  },
  {
    n: "08",
    prompt: "Sebuah tangki terisi 2/5. Jika kapasitas 150 liter, volume terisi…",
    choices: ["40 liter", "50 liter", "75 liter", "60 liter"],
    correctKey: "d",
    difficulty: 3,
  },
];

export function itemsNumerikOperasi() {
  return buildDomainItems("numerik_operasi", DRAFTS);
}
