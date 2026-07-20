import { buildDomainItems, type ItemDraft } from "../item-helpers";

/** Keys balanced: a,a,b,b,c,c,d,d — original BI, sinonim/antonim/wacana style */
const DRAFTS: ItemDraft[] = [
  {
    n: "01",
    prompt: 'Sinonim paling dekat untuk kata "akurat" adalah…',
    choices: ["Tepat", "Kasar", "Lambat", "Samar"],
    correctKey: "a",
    difficulty: 1,
  },
  {
    n: "02",
    prompt: 'Makna kata "diversifikasi" yang paling tepat adalah…',
    choices: [
      "Penyebaran ke beberapa jenis agar risiko tidak terkonsentrasi",
      "Penghapusan seluruh opsi",
      "Penggandaan harga tanpa alasan",
      "Penguncian satu produk saja",
    ],
    correctKey: "a",
    difficulty: 2,
  },
  {
    n: "03",
    prompt:
      "Wacana: Produksi naik 10% sementara jumlah pekerja tetap. Output per pekerja cenderung…",
    choices: ["Turun", "Naik", "Nol", "Tidak bisa disimpulkan sama sekali"],
    correctKey: "b",
    difficulty: 2,
  },
  {
    n: "04",
    prompt:
      'Kalimat: "Meski tenggat ketat, laporan tetap diperiksa ulang." Hubungan makna paling dekat…',
    choices: [
      "Sebab-akibat murni",
      "Konsesi / pertentangan",
      "Perbandingan ukuran",
      "Urutan waktu saja",
    ],
    correctKey: "b",
    difficulty: 2,
  },
  {
    n: "05",
    prompt: 'Antonim paling tepat untuk "konsisten" adalah…',
    choices: ["Stabil", "Rutin", "Berubah-ubah", "Tertib"],
    correctKey: "c",
    difficulty: 1,
  },
  {
    n: "06",
    prompt:
      "Wacana: Dua rute sampai tujuan yang sama; rute A lebih cepat tetapi lebih mahal. Pernyataan paling netral…",
    choices: [
      "A selalu lebih baik",
      "B harus dihindari",
      "Pilihan bergantung prioritas waktu vs biaya",
      "Biaya tidak relevan",
    ],
    correctKey: "c",
    difficulty: 2,
  },
  {
    n: "07",
    prompt: 'Frasa "menunda peluncuran produk" paling dekat maknanya dengan…',
    choices: [
      "Mempercepat rilis",
      "Membatalkan merek",
      "Menaikkan gaji",
      "Menangguhkan perkenalan produk ke pasar",
    ],
    correctKey: "d",
    difficulty: 2,
  },
  {
    n: "08",
    prompt:
      "Wacana: Keluhan pelanggan turun setelah panduan baru; volume penjualan tidak berubah. Kesimpulan paling hati-hati…",
    choices: [
      "Panduan pasti satu-satunya penyebab",
      "Penjualan harus digandakan",
      "Keluhan tidak penting",
      "Panduan mungkin membantu menurunkan keluhan",
    ],
    correctKey: "d",
    difficulty: 3,
  },
];

export function itemsVerbalPemahaman() {
  return buildDomainItems("verbal_pemahaman", DRAFTS);
}
