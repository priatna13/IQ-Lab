import type { FieldCategoryDef, FieldCategoryId, FieldDef, FieldId } from "./types";

export const FIELD_CATEGORIES: FieldCategoryDef[] = [
  {
    id: "teknologi_produk",
    label: "Teknologi & Produk Digital",
    shortBlurb: "Software, data, desain produk, dan pengelolaan produk",
  },
  {
    id: "bisnis_keuangan",
    label: "Bisnis, Keuangan & Operasi",
    shortBlurb: "Akuntansi, penjualan, dan rantai pasok",
  },
  {
    id: "pemasaran_kreatif",
    label: "Pemasaran & Kreatif",
    shortBlurb: "Marketing digital, konten, dan desain grafis",
  },
  {
    id: "orang_layanan",
    label: "Orang, Edukasi & Layanan",
    shortBlurb: "HR, coaching, pendidikan, dan customer success",
  },
  {
    id: "legal",
    label: "Legal & Kepatuhan",
    shortBlurb: "Hukum dan penasihatan legal",
  },
];

export const FIELD_DEFS: FieldDef[] = [
  {
    id: "it_software",
    categoryId: "teknologi_produk",
    label: "IT / Software Developer / Programmer",
    shortBlurb: "Logika, algoritma, debugging, dan rekayasa perangkat lunak",
    relevantDomains: ["logika", "numerik_pola", "numerik_operasi", "spasial", "memori"],
  },
  {
    id: "data_analyst",
    categoryId: "teknologi_produk",
    label: "Data Analyst / Business Intelligence",
    shortBlurb: "Analisis data, KPI, dan interpretasi tren",
    relevantDomains: ["numerik_operasi", "numerik_pola", "logika", "praktis"],
  },
  {
    id: "ui_ux",
    categoryId: "teknologi_produk",
    label: "UI/UX Designer",
    shortBlurb: "Antarmuka, alur pengguna, dan prinsip desain",
    relevantDomains: ["spasial", "figural", "numerik_pola", "praktis", "verbal_pemahaman"],
  },
  {
    id: "project_product",
    categoryId: "teknologi_produk",
    label: "Project Manager / Product Manager",
    shortBlurb: "Prioritas, dependency, MVP, dan koordinasi tim",
    relevantDomains: ["logika", "praktis", "verbal_pemahaman", "memori"],
  },
  {
    id: "finance_accounting",
    categoryId: "bisnis_keuangan",
    label: "Akuntansi & Finance",
    shortBlurb: "Laporan keuangan, rasio, dan konsep dasar akuntansi",
    relevantDomains: ["numerik_operasi", "logika", "memori", "praktis"],
  },
  {
    id: "sales_bd",
    categoryId: "bisnis_keuangan",
    label: "Sales / Business Development",
    shortBlurb: "Presentasi nilai, objection handling, dan pipeline",
    relevantDomains: ["verbal_pemahaman", "praktis", "logika", "numerik_operasi"],
  },
  {
    id: "operations",
    categoryId: "bisnis_keuangan",
    label: "Operations / Supply Chain / Logistik",
    shortBlurb: "Stok, bottleneck, lead time, dan efisiensi proses",
    relevantDomains: ["numerik_operasi", "logika", "praktis", "numerik_pola"],
  },
  {
    id: "digital_marketing",
    categoryId: "pemasaran_kreatif",
    label: "Digital Marketing / Performance Marketing",
    shortBlurb: "ROAS, funnel, A/B test, dan metrik iklan",
    relevantDomains: ["numerik_operasi", "logika", "praktis", "verbal_pemahaman"],
  },
  {
    id: "content_creator",
    categoryId: "pemasaran_kreatif",
    label: "Content Creator / Penulis Konten",
    shortBlurb: "Hook, pillar konten, dan engagement",
    relevantDomains: ["verbal_pemahaman", "praktis", "figural", "numerik_pola"],
  },
  {
    id: "graphic_design",
    categoryId: "pemasaran_kreatif",
    label: "Desain Grafis",
    shortBlurb: "Hierarki visual, tipografi, raster/vector, warna cetak",
    relevantDomains: ["figural", "spasial", "numerik_pola", "praktis"],
  },
  {
    id: "hr",
    categoryId: "orang_layanan",
    label: "Human Resources / People Development",
    shortBlurb: "Rekrutmen, motivasi, dan pengembangan karyawan",
    relevantDomains: ["verbal_pemahaman", "praktis", "logika", "memori"],
  },
  {
    id: "coach",
    categoryId: "orang_layanan",
    label: "Pelatih / Coach",
    shortBlurb: "Coaching, growth mindset, dan tujuan SMART",
    relevantDomains: ["praktis", "verbal_pemahaman", "logika", "memori"],
  },
  {
    id: "educator",
    categoryId: "orang_layanan",
    label: "Guru / Pendidikan / Educator",
    shortBlurb: "Fasilitasi belajar, asesmen, dan diferensiasi",
    relevantDomains: ["verbal_pemahaman", "praktis", "memori", "logika"],
  },
  {
    id: "customer_service",
    categoryId: "orang_layanan",
    label: "Customer Service / Customer Success",
    shortBlurb: "Empati, resolusi, dan hubungan pelanggan",
    relevantDomains: ["verbal_pemahaman", "praktis", "memori", "logika"],
  },
  {
    id: "legal",
    categoryId: "legal",
    label: "Legal / Hukum",
    shortBlurb: "Pidana vs perdata, kontrak, dan resolusi sengketa",
    relevantDomains: ["verbal_pemahaman", "logika", "memori", "praktis"],
  },
];

export function getFieldDef(fieldId: FieldId): FieldDef | undefined {
  return FIELD_DEFS.find((f) => f.id === fieldId);
}

export function getCategoryDef(categoryId: FieldCategoryId): FieldCategoryDef | undefined {
  return FIELD_CATEGORIES.find((c) => c.id === categoryId);
}

export function fieldsInCategory(categoryId: FieldCategoryId): FieldDef[] {
  return FIELD_DEFS.filter((f) => f.categoryId === categoryId);
}

export function isFieldId(value: string): value is FieldId {
  return FIELD_DEFS.some((f) => f.id === value);
}
