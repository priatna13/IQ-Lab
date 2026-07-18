import { buildDomainItems, type ItemDraft } from "../item-helpers";

/** Keys balanced: a,a,b,b,c,c,d,d */
const DRAFTS: ItemDraft[] = [
  {
    n: "01",
    prompt:
      "Semua karyawan mendapat kartu akses. Rina adalah karyawan. Kesimpulan valid…",
    choices: [
      "Rina mendapat kartu akses",
      "Rina adalah manajer",
      "Semua orang mendapat kartu akses",
      "Rina tidak bekerja",
    ],
    correctKey: "a",
    difficulty: 1,
  },
  {
    n: "02",
    prompt:
      "Pernyataan: “Semua proposal disetujui.” Manakah yang menegasikan (membuatnya salah)?",
    choices: [
      "Ada proposal yang tidak disetujui",
      "Banyak proposal disetujui",
      "Proposal A disetujui",
      "Semua proposal dibahas",
    ],
    correctKey: "a",
    difficulty: 2,
  },
  {
    n: "03",
    prompt:
      "Jika hujan, lapangan basah. Lapangan tidak basah. Kesimpulan paling valid…",
    choices: [
      "Pasti hujan",
      "Tidak hujan",
      "Lapangan selalu kering sepanjang tahun",
      "Tidak ada hubungan",
    ],
    correctKey: "b",
    difficulty: 2,
  },
  {
    n: "04",
    prompt:
      "Hanya hari kerja toko buka. Hari ini Minggu (bukan hari kerja). Maka…",
    choices: ["Toko buka", "Toko tutup", "Toko mungkin buka", "Tidak relevan"],
    correctKey: "b",
    difficulty: 1,
  },
  {
    n: "05",
    prompt:
      "Premis: Tidak ada burung yang menyusui. Kelelawar menyusui. Kesimpulan…",
    choices: [
      "Kelelawar adalah burung",
      "Semua kelelawar terbang",
      "Kelelawar bukan burung",
      "Burung menyusui",
    ],
    correctKey: "c",
    difficulty: 2,
  },
  {
    n: "06",
    prompt:
      "Aturan: Jika proyek terlambat DAN anggaran jebol, status = kritis. Proyek terlambat tetapi anggaran aman. Dari aturan itu saja…",
    choices: [
      "Status pasti kritis",
      "Proyek otomatis batal",
      "Syarat kritis belum terpenuhi",
      "Proyek harus dihentikan",
    ],
    correctKey: "c",
    difficulty: 2,
  },
  {
    n: "07",
    prompt:
      "Antrian satu baris: A di depan B; C di belakang B; D di depan A. Urutan dari depan ke belakang…",
    choices: ["A-D-B-C", "D-B-A-C", "C-B-A-D", "D-A-B-C"],
    correctKey: "d",
    difficulty: 3,
  },
  {
    n: "08",
    prompt:
      "Ada tiga isi kotak yang berbeda: hanya apel; kosong; apel+jeruk. Setiap kotak punya label, dan SEMUA label salah. Untuk kotak yang berlabel “Hanya apel”, manakah yang pasti benar?",
    choices: [
      "Isinya pasti hanya apel",
      "Isinya pasti kosong",
      "Isinya pasti apel+jeruk",
      "Isinya bukan hanya apel (bisa kosong atau apel+jeruk)",
    ],
    correctKey: "d",
    difficulty: 3,
  },
];

export function itemsLogika() {
  return buildDomainItems("logika", DRAFTS);
}
