import { buildDomainItems, type ItemDraft } from "../item-helpers";

/** Keys balanced: a,a,b,b,c,c,d,d */
const DRAFTS: ItemDraft[] = [
  {
    n: "01",
    prompt: "BUKU : MEMBACA = PENA : ?  (hubungan: alat/bahan → aktivitas utamanya)",
    choices: ["Menulis", "Menghapus", "Mendengar", "Melukis dinding"],
    correctKey: "a",
    difficulty: 1,
  },
  {
    n: "02",
    prompt: "BENIH : POHON = RENCANA : ?",
    choices: [
      "Implementasi / pelaksanaan",
      "Cuaca",
      "Alat tulis",
      "Jam dinding",
    ],
    correctKey: "a",
    difficulty: 2,
  },
  {
    n: "03",
    prompt: "DOKTER : RUMAH SAKIT = GURU : ?",
    choices: ["Pasar", "Sekolah", "Bandara", "Pabrik baja"],
    correctKey: "b",
    difficulty: 1,
  },
  {
    n: "04",
    prompt: "PANAS : DINGIN = TINGGI : ?",
    choices: ["Besar", "Rendah", "Lebar", "Cepat"],
    correctKey: "b",
    difficulty: 1,
  },
  {
    n: "05",
    prompt: "HEMAT : BOROS = TELITI : ?",
    choices: ["Cermat", "Cepat", "Ceroboh", "Tenang"],
    correctKey: "c",
    difficulty: 2,
  },
  {
    n: "06",
    prompt: "KATA : KALIMAT = BATU BATA : ?",
    choices: ["Pasir", "Semen saja", "Bangunan", "Atap kaca"],
    correctKey: "c",
    difficulty: 2,
  },
  {
    n: "07",
    prompt: "PETA : WILAYAH = JADWAL : ?",
    choices: ["Warna", "Berat", "Suhu", "Waktu / kegiatan"],
    correctKey: "d",
    difficulty: 3,
  },
  {
    n: "08",
    prompt: "KRITIK : PERBAIKAN = DIAGNOSIS : ?",
    choices: [
      "Gejala diabaikan",
      "Biaya naik otomatis",
      "Libur panjang",
      "Penanganan / terapi",
    ],
    correctKey: "d",
    difficulty: 3,
  },
];

export function itemsVerbalAnalogi() {
  return buildDomainItems("verbal_analogi", DRAFTS);
}
