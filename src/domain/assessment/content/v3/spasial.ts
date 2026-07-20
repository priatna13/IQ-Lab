import { buildDomainItems, type ItemDraft } from "../item-helpers";

/** Keys balanced: a,a,b,b,c,c,d,d */
const DRAFTS: ItemDraft[] = [
  {
    n: "01",
    prompt:
      "Panah → diputar 90° berlawanan jarum jam. Arah panah menjadi…",
    choices: ["↑", "↓", "←", "→"],
    correctKey: "a",
    difficulty: 2,
  },
  {
    n: "02",
    prompt:
      "Dari titik O Anda maju 3 langkah utara lalu 3 langkah selatan. Posisi Anda…",
    choices: [
      "Kembali di O",
      "3 langkah utara dari O",
      "3 langkah timur dari O",
      "3 langkah barat dari O",
    ],
    correctKey: "a",
    difficulty: 1,
  },
  {
    n: "03",
    prompt: "Balok memiliki berapa titik sudut (vertex)?",
    choices: ["6", "8", "12", "4"],
    correctKey: "b",
    difficulty: 2,
  },
  {
    n: "04",
    prompt:
      "Anda menghadap utara. Belok kanan 90°, lalu belok kanan 90° lagi. Anda menghadap…",
    choices: ["Utara", "Selatan", "Timur", "Barat"],
    correctKey: "b",
    difficulty: 2,
  },
  {
    n: "05",
    prompt:
      "Meja di tengah. Anda di sisi barat meja menghadap timur. Sisi meja paling dekat dengan Anda adalah sisi…",
    choices: ["Timur meja", "Utara meja", "Barat meja", "Selatan meja"],
    correctKey: "c",
    difficulty: 2,
  },
  {
    n: "06",
    prompt:
      'Huruf "p" dicerminkan kiri–kanan (cermin di samping huruf). Bentuk paling mirip…',
    choices: ["b", "q", "d", "p (tidak berubah)"],
    correctKey: "c",
    difficulty: 3,
  },
  {
    n: "07",
    prompt:
      "Denah: gudang di selatan kantor; parkiran di barat kantor. Dari parkiran, gudang ada di arah…",
    choices: ["Barat laut", "Utara", "Timur laut", "Tenggara"],
    correctKey: "d",
    difficulty: 3,
  },
  {
    n: "08",
    prompt:
      "Kertas dilipat dua, digunting satu lubang menembus kedua lapis. Setelah dibuka, jumlah lubang…",
    choices: ["0", "1", "3", "2"],
    correctKey: "d",
    difficulty: 2,
  },
];

export function itemsSpasial() {
  return buildDomainItems("spasial", DRAFTS);
}
