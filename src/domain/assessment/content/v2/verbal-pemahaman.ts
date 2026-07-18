import { buildDomainItems, type ItemDraft } from "../item-helpers";

/** Keys balanced: a,a,b,b,c,c,d,d */
const DRAFTS: ItemDraft[] = [
  {
    n: "01",
    prompt: 'Sinonim paling dekat untuk kata "efisien" adalah…',
    choices: [
      "Berdaya guna (hasil optimal dengan sumber daya minimal)",
      "Lambat",
      "Mahal",
      "Acak",
    ],
    correctKey: "a",
    difficulty: 1,
  },
  {
    n: "02",
    prompt: 'Makna kata "implikasi" yang paling tepat adalah…',
    choices: [
      "Akibat atau konsekuensi yang tersirat",
      "Judul laporan",
      "Alat ukur",
      "Nama perusahaan",
    ],
    correctKey: "a",
    difficulty: 2,
  },
  {
    n: "03",
    prompt:
      "Wacana: Harga tiket naik 20%, jumlah penumpang tetap. Pendapatan tiket (harga × jumlah) cenderung…",
    choices: ["Turun", "Naik", "Tidak berubah", "Bisa naik atau turun tanpa data lain"],
    correctKey: "b",
    difficulty: 2,
  },
  {
    n: "04",
    prompt:
      'Kalimat: "Meskipun hujan deras, tim tetap menyelesaikan survei lapangan." Hubungan makna paling dekat…',
    choices: [
      "Sebab-akibat murni",
      "Pertentangan / konsesi",
      "Perbandingan kuantitas",
      "Urutan waktu saja",
    ],
    correctKey: "b",
    difficulty: 2,
  },
  {
    n: "05",
    prompt:
      'Antonimi paling tepat untuk "transparan" dalam konteks organisasi adalah…',
    choices: ["Terbuka", "Jernih", "Tertutup / tidak jelas", "Cepat"],
    correctKey: "c",
    difficulty: 1,
  },
  {
    n: "06",
    prompt:
      "Wacana: Dua proposal biayanya sama; A lebih berisiko tetapi potensi hasil lebih tinggi. Pernyataan paling netral…",
    choices: [
      "A selalu lebih baik dari B",
      "B harus ditolak tanpa data",
      "Pilihan bergantung pada toleransi risiko dan tujuan",
      "Biaya tidak perlu dipertimbangkan",
    ],
    correctKey: "c",
    difficulty: 3,
  },
  {
    n: "07",
    prompt: 'Frasa "menunda keputusan strategis" paling dekat maknanya dengan…',
    choices: [
      "Mempercepat eksekusi",
      "Menghapus semua opsi",
      "Mendelegasikan gaji",
      "Menangguhkan pilihan penting",
    ],
    correctKey: "d",
    difficulty: 2,
  },
  {
    n: "08",
    prompt:
      "Wacana: Produktivitas naik setelah pelatihan; jam kerja tidak bertambah. Kesimpulan paling hati-hati…",
    choices: [
      "Pelatihan pasti satu-satunya penyebab",
      "Jam kerja seharusnya dikurangi",
      "Produktivitas tidak relevan",
      "Pelatihan mungkin berkontribusi pada kenaikan",
    ],
    correctKey: "d",
    difficulty: 3,
  },
];

export function itemsVerbalPemahaman() {
  return buildDomainItems("verbal_pemahaman", DRAFTS);
}
