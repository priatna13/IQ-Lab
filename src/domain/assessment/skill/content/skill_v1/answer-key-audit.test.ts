import { describe, expect, it } from "vitest";
import { FIELD_DEFS } from "../../field-catalog";
import { SKILL_PACKS } from "./packs";

/**
 * Semantic audit: substring that MUST appear on the choice marked correctKey.
 * Catches wrong key after reordering for balance a,a,b,b,c,c,d.
 */
const MUST_MATCH: Record<string, string[]> = {
  it_software: [
    "Hash Map",
    "[1, 2, 3, 4]",
    "O(log n)",
    "Stack",
    "INNER hanya",
    "listener",
    "Mengulang request",
  ],
  data_analyst: [
    "berubah di Q4",
    "KPI utama",
    "bukan otomatis causation",
    "index",
    "error pengukuran",
    "Relasi ketat",
    "Es krim",
  ],
  ui_ux: [
    "tampilan/interaksi",
    "Kontras rendah",
    "Visibility of system status",
    "lebih besar & lebih dekat",
    "Terlalu banyak step",
    "Flow = langkah",
    "cognitive load",
  ],
  project_product: [
    "Waterfall sekuensial",
    "Bottleneck",
    "Versi terkecil",
    "negotiasi prioritas",
    "value yang diharapkan",
    "Responsible, Accountable",
    "Identifikasi, penilaian",
  ],
  finance_accounting: [
    "Rp20.000.000",
    "Debit Kas, Kredit Piutang",
    "Accrual mengakui",
    "Aset lancar 1,8",
    "Persediaan",
    "total pendapatan = total biaya",
    "understated",
  ],
  sales_bd: [
    "Feature = apa adanya",
    "Gali value",
    "Situation, Problem",
    "relationship dan trust",
    "Alur prospek",
    "Dengarkan, klarifikasi",
    "nurturing",
  ],
  operations: [
    "Supplier, produksi",
    "demand/inventory",
    "FIFO = masuk pertama",
    "ketersediaan, janji kirim",
    "membatasi throughput",
    "Standarisasi + otomasi",
    "Output vs input",
  ],
  digital_marketing: [
    "4,5",
    "Customer Lifetime Value",
    "CPC per klik",
    "dua varian",
    "message match",
    "Creative fatigue",
    "menjangkau ulang",
  ],
  content_creator: [
    "lonjakan attention",
    "Storytelling + value",
    "Pembuka yang menarik",
    "kehadiran berulang",
    "tidak relevan",
    "tema besar berulang",
    "Saves, shares",
  ],
  graphic_design: [
    "piksel",
    "White space",
    "penekanan visual",
    "RGB layar",
    "RGB→CMYK",
    "tone",
    "Audiens, positioning",
  ],
  hr: [
    "tarik kandidat",
    "percakapan empatik",
    "perilaku/kompetensi",
    "pencapaian dan pengakuan",
    "alasan keluar",
    "skill kerja sekarang",
    "Kirkpatrick",
  ],
  coach: [
    "gali solusi coachee",
    "Evaluasi beban",
    "Spesifik, terukur",
    "bisa berkembang",
    "ownership",
    "feedback spesifik",
    "Perubahan perilaku",
  ],
  educator: [
    "transfer materi",
    "penyebab secara pribadi",
    "Menyesuaikan konten",
    "Partisipasi, transfer skill",
    "menyesuaikan pengajaran",
    "motivasi/beban",
    "apa yang diperbaiki",
  ],
  customer_service: [
    "reaktif bantu",
    "Tetap tenang, empati",
    "kontak pertama",
    "Selesaikan tuntas",
    "Konteks lanjutan",
    "bahasa alami",
    "tawarkan alternatif",
  ],
  legal: [
    "negara vs perbuatan",
    "tidak bersalah sampai",
    "Tidak otomatis batal",
    "Mediasi fasilitasi",
    "Klausul tersembunyi",
    "Ketidakseimbangan",
    "etika profesi",
  ],
};

describe("Skill pack answer-key audit", () => {
  it("covers every field with 7 expected anchors", () => {
    for (const def of FIELD_DEFS) {
      expect(MUST_MATCH[def.id], def.id).toBeDefined();
      expect(MUST_MATCH[def.id]).toHaveLength(7);
    }
  });

  it("correctKey choice contains the expected anchor for each item", () => {
    for (const def of FIELD_DEFS) {
      const pack = SKILL_PACKS[def.id];
      const anchors = MUST_MATCH[def.id];
      pack.items.forEach((item, i) => {
        const correct = item.choices.find((c) => c.id === item.correctKey);
        expect(correct, `${def.id} ${item.id}`).toBeDefined();
        expect(
          correct!.label,
          `${def.id} ${item.id} key=${item.correctKey} label="${correct!.label}"`,
        ).toContain(anchors[i]);
      });
    }
  });

  it("balances keys a,a,b,b,c,c,d per pack", () => {
    for (const def of FIELD_DEFS) {
      const keys = SKILL_PACKS[def.id].items.map((i) => i.correctKey);
      expect(keys, def.id).toEqual(["a", "a", "b", "b", "c", "c", "d"]);
    }
  });
});
