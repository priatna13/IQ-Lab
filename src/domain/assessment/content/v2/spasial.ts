import { buildDomainItems, type ItemDraft } from "../item-helpers";

/** Keys balanced: a,a,b,b,c,c,d,d */
const DRAFTS: ItemDraft[] = [
  {
    n: "01",
    prompt:
      "Panah mengarah ke atas ↑ diputar 90° searah jarum jam. Arah panah menjadi…",
    choices: ["→", "←", "↓", "↑"],
    correctKey: "a",
    difficulty: 2,
  },
  {
    n: "02",
    prompt:
      "Di peta, utara di atas. Dari titik A Anda berjalan 2 langkah utara lalu 2 langkah selatan. Posisi Anda…",
    choices: [
      "Kembali di A",
      "2 langkah utara dari A",
      "2 langkah timur dari A",
      "2 langkah barat dari A",
    ],
    correctKey: "a",
    difficulty: 1,
  },
  {
    n: "03",
    prompt: "Kubus memiliki berapa muka (sisi datar)?",
    choices: ["4", "6", "5", "8"],
    correctKey: "b",
    difficulty: 1,
  },
  {
    n: "04",
    prompt:
      "Ruangan: pintu di dinding utara, jendela di dinding timur. Anda menghadap pintu (menghadap utara). Jendela ada di…",
    choices: ["Kiri Anda", "Kanan Anda", "Belakang Anda", "Lantai saja"],
    correctKey: "b",
    difficulty: 3,
  },
  {
    n: "05",
    prompt:
      "Sebuah meja di tengah ruangan. Anda berdiri di sisi selatan meja menghadap utara. Sisi meja yang paling dekat dengan Anda adalah sisi…",
    choices: ["Utara meja", "Timur meja", "Selatan meja", "Barat meja"],
    correctKey: "c",
    difficulty: 2,
  },
  {
    n: "06",
    prompt:
      "Huruf “b” dicerminkan kiri–kanan (seperti cermin berdiri di samping huruf). Bentuk paling mirip…",
    choices: ["q", "p", "d", "b (tidak berubah)"],
    correctKey: "c",
    difficulty: 3,
  },
  {
    n: "07",
    prompt:
      "Denah: dapur di barat ruang tamu; kamar di utara ruang tamu. Dari kamar, dapur berada di arah…",
    choices: ["Tenggara", "Utara", "Timur laut", "Barat daya"],
    correctKey: "d",
    difficulty: 3,
  },
  {
    n: "08",
    prompt:
      "Kertas persegi dilipat sekali di tengah (dua lapis), lalu digunting satu lubang yang menembus kedua lapis. Setelah dibuka, jumlah lubang pada kertas…",
    choices: ["0", "1", "3", "2"],
    correctKey: "d",
    difficulty: 2,
  },
];

export function itemsSpasial() {
  return buildDomainItems("spasial", DRAFTS);
}
