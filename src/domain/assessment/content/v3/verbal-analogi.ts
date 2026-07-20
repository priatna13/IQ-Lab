import { buildDomainItems, type ItemDraft } from "../item-helpers";

/** Keys balanced: a,a,b,b,c,c,d,d */
const DRAFTS: ItemDraft[] = [
  {
    n: "01",
    prompt: "KUNCI : PINTU = SANDI : ?",
    choices: ["Akses / masuk sistem", "Jendela", "Atap", "Lampu"],
    correctKey: "a",
    difficulty: 1,
  },
  {
    n: "02",
    prompt: "BENIH : TUMBUH = IDE : ?",
    choices: [
      "Dikembangkan / dieksekusi",
      "Dibuang tanpa pikir",
      "Diganti cuaca",
      "Dihitung berat",
    ],
    correctKey: "a",
    difficulty: 2,
  },
  {
    n: "03",
    prompt: "PILOT : PESAWAT = SOPIR : ?",
    choices: ["Rel kereta saja", "Kendaraan / mobil", "Bandara saja", "Helm saja"],
    correctKey: "b",
    difficulty: 1,
  },
  {
    n: "04",
    prompt: "TERANG : GELAP = KERAS : ?",
    choices: ["Kuat", "Lembut / pelan", "Berat", "Cepat"],
    correctKey: "b",
    difficulty: 1,
  },
  {
    n: "05",
    prompt: "HEMAT : BOROS = TERATUR : ?",
    choices: ["Rapi", "Disiplin", "Berantakan / kacau", "Cepat"],
    correctKey: "c",
    difficulty: 2,
  },
  {
    n: "06",
    prompt: "HURUF : KATA = SEL : ?",
    choices: ["Aksara", "Tinta", "Jaringan / organ (bagian → keseluruhan)", "Kertas"],
    correctKey: "c",
    difficulty: 2,
  },
  {
    n: "07",
    prompt: "PETA : LOKASI = RESEP : ?",
    choices: ["Warna", "Suhu ruangan", "Alamat rumah", "Cara membuat hidangan"],
    correctKey: "d",
    difficulty: 2,
  },
  {
    n: "08",
    prompt: "GEJALA : DIAGNOSIS = DATA : ?",
    choices: [
      "Mengabaikan pola",
      "Menghapus arsip",
      "Menunda tanpa alasan",
      "Analisis / kesimpulan",
    ],
    correctKey: "d",
    difficulty: 3,
  },
];

export function itemsVerbalAnalogi() {
  return buildDomainItems("verbal_analogi", DRAFTS);
}
