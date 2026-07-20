import { buildDomainItems, type ItemDraft } from "../../../content/item-helpers";
import type { FieldId, SkillPack } from "../../types";

const INSTRUCTION =
  "Pilih jawaban paling tepat untuk konteks keahlian bidang ini. Ada 4 pilihan; hanya satu yang paling benar. Tidak ada penalti tebak-tebakan — kerjakan jujur sesuai pengetahuan Anda.";

const TIME = 720; // 12 minutes

function pack(
  fieldId: FieldId,
  label: string,
  drafts: ItemDraft[],
): SkillPack {
  if (drafts.length !== 7) {
    throw new Error(`${fieldId} must have 7 items, got ${drafts.length}`);
  }
  return {
    fieldId,
    label,
    instruction: INSTRUCTION,
    timeLimitSeconds: TIME,
    items: buildDomainItems(fieldId, drafts),
  };
}

/** Keys pattern per pack: a,a,b,b,c,c,d (2-2-2-1) */

export const SKILL_PACKS: Record<FieldId, SkillPack> = {
  it_software: pack("it_software", "IT / Software Developer / Programmer", [
    {
      n: "01",
      prompt:
        "Cara paling efisien (umumnya O(n)) mencari dua angka dalam array yang jumlahnya = target?",
      choices: [
        "Hash Map / dictionary",
        "Nested loop saja selalu",
        "Sort berulang tanpa struktur bantu",
        "Random pick sampai cocok",
      ],
      correctKey: "a",
      difficulty: 2,
    },
    {
      n: "02",
      prompt:
        "let a = [1,2,3]; let b = a; b.push(4); console.log(a); Output?",
      choices: ["[1, 2, 3, 4]", "[1, 2, 3]", "Error", "undefined"],
      correctKey: "a",
      difficulty: 2,
    },
    {
      n: "03",
      prompt:
        "Time complexity terbaik tipikal untuk cari elemen di data terurut (binary search)?",
      choices: ["O(n)", "O(log n)", "O(n²)", "O(n log n) selalu"],
      correctKey: "b",
      difficulty: 1,
    },
    {
      n: "04",
      prompt: "Struktur data paling cocok untuk Undo/Redo sederhana?",
      choices: ["Queue saja", "Stack", "Hash table saja", "Heap saja"],
      correctKey: "b",
      difficulty: 1,
    },
    {
      n: "05",
      prompt: "Perbedaan utama INNER JOIN vs LEFT JOIN?",
      choices: [
        "Tidak ada perbedaan",
        "LEFT selalu lebih cepat",
        "INNER hanya baris cocok di kedua tabel; LEFT pertahankan semua baris kiri",
        "INNER menghapus tabel",
      ],
      correctKey: "c",
      difficulty: 2,
    },
    {
      n: "06",
      prompt:
        "Aplikasi memory leak. Langkah debugging pertama yang paling masuk akal?",
      choices: [
        "Langsung tambah RAM server",
        "Rewrite seluruh kode",
        "Cek listener/subscription yang tidak di-cleanup",
        "Ganti framework dulu",
      ],
      correctKey: "c",
      difficulty: 2,
    },
    {
      n: "07",
      prompt: "“Idempotent” dalam konteks API berarti…",
      choices: [
        "Request selalu gagal",
        "Hanya GET yang diizinkan",
        "Response selalu berbeda",
        "Mengulang request yang sama tidak mengubah state di luar efek pertama",
      ],
      correctKey: "d",
      difficulty: 3,
    },
  ]),

  data_analyst: pack("data_analyst", "Data Analyst / Business Intelligence", [
    {
      n: "01",
      prompt:
        "Penjualan naik Q1–Q3 lalu turun tajam Q4. Pertanyaan analisis pertama yang paling berguna?",
      choices: [
        "Apa yang berubah di Q4 (produk, channel, musim, kompetitor)?",
        "Langsung hapus data Q4",
        "Abaikan karena sudah lewat",
        "Naikkan target tanpa data",
      ],
      correctKey: "a",
      difficulty: 2,
    },
    {
      n: "02",
      prompt: "Metrik mana yang lebih tepat di halaman utama dashboard eksekutif?",
      choices: [
        "KPI utama + tren + anomaly",
        "Semua data mentah tanpa filter",
        "Hanya grafik indah tanpa angka",
        "Tabel penuh tanpa ringkasan",
      ],
      correctKey: "a",
      difficulty: 1,
    },
    {
      n: "03",
      prompt: "Korelasi 0,92 antara dua variabel berarti…",
      choices: [
        "Pastikan satu menyebabkan yang lain",
        "Hubungan linier kuat, tapi bukan otomatis causation",
        "Tidak ada hubungan",
        "Data salah pasti",
      ],
      correctKey: "b",
      difficulty: 2,
    },
    {
      n: "04",
      prompt: "Query sangat lambat. Langkah optimasi pertama yang masuk akal?",
      choices: [
        "Beli server baru tanpa cek",
        "Cek filter, index, dan volume data yang di-scan",
        "Hapus semua tabel",
        "Ubah ke spreadsheet manual",
      ],
      correctKey: "b",
      difficulty: 2,
    },
    {
      n: "05",
      prompt: "Outlier boleh dihapus kapan?",
      choices: [
        "Selalu, tanpa cek",
        "Tidak pernah",
        "Hanya jika jelas error pengukuran dan terdokumentasi; jika valid, pertahankan/analisis terpisah",
        "Jika tidak suka angkanya",
      ],
      correctKey: "c",
      difficulty: 2,
    },
    {
      n: "06",
      prompt: "SQL vs NoSQL — kapan SQL biasanya lebih tepat?",
      choices: [
        "Data tidak terstruktur total selalu",
        "Tidak pernah",
        "Relasi ketat, transaksi, dan query ad-hoc terstruktur",
        "Hanya untuk gambar",
      ],
      correctKey: "c",
      difficulty: 2,
    },
    {
      n: "07",
      prompt: "Correlation ≠ Causation. Contoh paling tepat?",
      choices: [
        "Tekan tombol → lampu menyala (desain kausal)",
        "2+2=4",
        "Nama file menentukan hasil",
        "Es krim naik & tenggelam naik di musim panas — keduanya bisa karena cuaca, bukan sebab-akibat langsung",
      ],
      correctKey: "d",
      difficulty: 2,
    },
  ]),

  ui_ux: pack("ui_ux", "UI/UX Designer", [
    {
      n: "01",
      prompt: "Perbedaan fundamental UI vs UX?",
      choices: [
        "UI = tampilan/interaksi visual; UX = pengalaman menyeluruh pengguna",
        "UI hanya warna; UX hanya logo",
        "Sama persis",
        "UX hanya untuk mobile",
      ],
      correctKey: "a",
      difficulty: 1,
    },
    {
      n: "02",
      prompt:
        "Tombol CTA abu muda di background putih. Masalah utama desain?",
      choices: [
        "Kontras rendah / sulit terlihat & diakses",
        "Terlalu besar",
        "Terlalu banyak animasi",
        "Font serif",
      ],
      correctKey: "a",
      difficulty: 1,
    },
    {
      n: "03",
      prompt:
        "Form sangat panjang tanpa progress indicator melanggar prinsip…",
      choices: [
        "Aesthetic only",
        "Visibility of system status",
        "Hanya branding",
        "Tidak relevan",
      ],
      correctKey: "b",
      difficulty: 2,
    },
    {
      n: "04",
      prompt: "Fitts’s Law dalam desain tombol implikasinya…",
      choices: [
        "Tombol harus selalu hitam",
        "Target lebih besar & lebih dekat → lebih cepat/mudah diklik",
        "Teks harus sepanjang mungkin",
        "Animasi wajib",
      ],
      correctKey: "b",
      difficulty: 2,
    },
    {
      n: "05",
      prompt: "Penyebab umum user meninggalkan checkout (UX)?",
      choices: [
        "Warna brand saja",
        "Logo terlalu besar",
        "Terlalu banyak step, biaya tiba-tiba, form ribet, kurang kepercayaan",
        "Font terlalu bagus",
      ],
      correctKey: "c",
      difficulty: 2,
    },
    {
      n: "06",
      prompt: "User Flow vs User Journey?",
      choices: [
        "Sama persis",
        "Journey hanya wireframe",
        "Flow = langkah di produk; Journey = pengalaman lintas touchpoint & emosi",
        "Flow hanya marketing",
      ],
      correctKey: "c",
      difficulty: 2,
    },
    {
      n: "07",
      prompt: "Mengapa white space penting?",
      choices: [
        "Membuat halaman selalu kosong total",
        "Tidak berguna",
        "Hanya hemat tinta",
        "Membantu hierarki, keterbacaan, dan mengurangi cognitive load",
      ],
      correctKey: "d",
      difficulty: 2,
    },
  ]),

  project_product: pack(
    "project_product",
    "Project Manager / Product Manager",
    [
      {
        n: "01",
        prompt: "Perbedaan utama Waterfall vs Agile?",
        choices: [
          "Waterfall sekuensial & scope lebih kaku di awal; Agile iteratif & adaptif",
          "Agile selalu tanpa dokumentasi",
          "Waterfall tidak punya timeline",
          "Sama saja",
        ],
        correctKey: "a",
        difficulty: 1,
      },
      {
        n: "02",
        prompt:
          "Proyek delay karena tim saling menunggu deliverable. Istilah paling tepat?",
        choices: [
          "Bottleneck / dependency issue",
          "Hanya poor communication tanpa dependency",
          "Scope creep murni",
          "Resource overallocation saja",
        ],
        correctKey: "a",
        difficulty: 2,
      },
      {
        n: "03",
        prompt: "MVP (Minimum Viable Product) adalah…",
        choices: [
          "Produk final sempurna",
          "Versi terkecil yang bisa divalidasi pembelajaran dari user nyata",
          "Hanya mockup tanpa rilis",
          "Fitur sebanyak mungkin",
        ],
        correctKey: "b",
        difficulty: 1,
      },
      {
        n: "04",
        prompt: "Stakeholder minta fitur baru di tengah sprint. Respons baik?",
        choices: [
          "Langsung kerjakan diam-diam",
          "Evaluasi impact, negotiasi prioritas/backlog, jaga fokus sprint",
          "Tolak kasar tanpa dialog",
          "Batalkan seluruh sprint",
        ],
        correctKey: "b",
        difficulty: 2,
      },
      {
        n: "05",
        prompt: "Indikator keberhasilan proyek yang lebih baik?",
        choices: [
          "Tim terlihat sibuk",
          "Budget saja",
          "Produk memberi value yang diharapkan user/stakeholder",
          "Semua task selesai meski value nol",
        ],
        correctKey: "c",
        difficulty: 2,
      },
      {
        n: "06",
        prompt: "Fungsi utama RACI Matrix?",
        choices: [
          "Menghitung gaji",
          "Desain UI",
          "Memperjelas peran: Responsible, Accountable, Consulted, Informed",
          "Menghapus risiko otomatis",
        ],
        correctKey: "c",
        difficulty: 2,
      },
      {
        n: "07",
        prompt: "Risk management dalam proyek pada intinya…",
        choices: [
          "Mengabaikan risiko",
          "Hanya asuransi",
          "Hanya post-mortem",
          "Identifikasi, penilaian, mitigasi, dan pantau risiko secara terencana",
        ],
        correctKey: "d",
        difficulty: 2,
      },
    ],
  ),

  finance_accounting: pack("finance_accounting", "Akuntansi & Finance", [
    {
      n: "01",
      prompt:
        "Aset Rp120jt, masa manfaat 5 th, nilai sisa Rp20jt. Depresiasi garis lurus per tahun?",
      choices: [
        "Rp20.000.000",
        "Rp24.000.000",
        "Rp100.000.000",
        "Rp12.000.000",
      ],
      correctKey: "a",
      difficulty: 2,
    },
    {
      n: "02",
      prompt: "Jurnal pelunasan piutang Rp15jt yang tepat?",
      choices: [
        "Debit Kas, Kredit Piutang",
        "Debit Kas, Kredit Pendapatan",
        "Debit Piutang, Kredit Kas",
        "Debit Beban, Kredit Kas",
      ],
      correctKey: "a",
      difficulty: 1,
    },
    {
      n: "03",
      prompt: "Accrual basis vs cash basis — perbedaan mendasar?",
      choices: [
        "Sama persis",
        "Accrual mengakui saat terjadi (bukan hanya saat kas); cash saat kas berpindah",
        "Cash selalu melanggar hukum",
        "Accrual tidak pakai jurnal",
      ],
      correctKey: "b",
      difficulty: 2,
    },
    {
      n: "04",
      prompt: "Current ratio 1,8 artinya kira-kira…",
      choices: [
        "Utang 1,8× aset",
        "Aset lancar 1,8× kewajiban lancar",
        "Laba 1,8%",
        "ROE 1,8",
      ],
      correctKey: "b",
      difficulty: 2,
    },
    {
      n: "05",
      prompt: "Yang termasuk aset lancar?",
      choices: ["Tanah", "Gedung", "Persediaan barang dagang", "Mesin produksi"],
      correctKey: "c",
      difficulty: 1,
    },
    {
      n: "06",
      prompt: "Break even point secara sederhana adalah…",
      choices: [
        "Laba maksimum",
        "Titik kas habis",
        "Titik di mana total pendapatan = total biaya (laba nol)",
        "Harga jual terendah di pasar",
      ],
      correctKey: "c",
      difficulty: 2,
    },
    {
      n: "07",
      prompt:
        "Pembelian kredit Rp50jt belum dicatat. Dampak jika tidak dikoreksi?",
      choices: [
        "Tidak ada dampak",
        "Kas naik otomatis",
        "Laba pasti naik",
        "Aset (persediaan) dan utang understated",
      ],
      correctKey: "d",
      difficulty: 3,
    },
  ]),

  sales_bd: pack("sales_bd", "Sales / Business Development", [
    {
      n: "01",
      prompt: "Feature vs Benefit saat presentasi produk?",
      choices: [
        "Feature = apa adanya produk; Benefit = nilai/hasil bagi pelanggan",
        "Sama saja",
        "Benefit hanya harga",
        "Feature hanya diskon",
      ],
      correctKey: "a",
      difficulty: 1,
    },
    {
      n: "02",
      prompt: 'Prospek: "Harganya mahal." Respons paling baik?',
      choices: [
        "Gali value vs kebutuhan, bandingkan total cost/benefit, tawarkan opsi paketan",
        "Langsung potong harga 50% tanpa tanya",
        "Marah",
        "Abaikan",
      ],
      correctKey: "a",
      difficulty: 2,
    },
    {
      n: "03",
      prompt: "SPIN Selling berfokus pada…",
      choices: [
        "Hanya cold call volume",
        "Situation, Problem, Implication, Need-payoff questions",
        "Hanya demo fitur",
        "Hanya email massal",
      ],
      correctKey: "b",
      difficulty: 2,
    },
    {
      n: "04",
      prompt: "Lebih penting jangka panjang?",
      choices: [
        "Closing bulanan saja",
        "Membangun relationship dan trust",
        "Diskon besar terus",
        "Memaksa keputusan hari ini",
      ],
      correctKey: "b",
      difficulty: 1,
    },
    {
      n: "05",
      prompt: "Pipeline sales adalah…",
      choices: [
        "Gaji sales",
        "Logo perusahaan",
        "Alur prospek per tahap hingga closing yang harus dikelola",
        "Hanya CRM login",
      ],
      correctKey: "c",
      difficulty: 1,
    },
    {
      n: "06",
      prompt: "Objection handling yang efektif biasanya…",
      choices: [
        "Memotong pembicaraan",
        "Mengabaikan keberatan",
        "Dengarkan, klarifikasi, respons dengan bukti/value, cek kesepakatan",
        "Langsung walk away",
      ],
      correctKey: "c",
      difficulty: 2,
    },
    {
      n: "07",
      prompt: "Mengapa follow-up penting?",
      choices: [
        "Tidak penting",
        "Hanya untuk spam",
        "Mengganggu selalu",
        "Banyak keputusan butuh pengingat & nurturing; konsistensi meningkatkan konversi",
      ],
      correctKey: "d",
      difficulty: 2,
    },
  ]),

  operations: pack("operations", "Operations / Supply Chain / Logistik", [
    {
      n: "01",
      prompt: "Supply chain minimal mencakup…",
      choices: [
        "Supplier, produksi/operasi, gudang/distribusi, pelanggan (dan aliran info/kas)",
        "Hanya marketing",
        "Hanya HR",
        "Hanya desain logo",
      ],
      correctKey: "a",
      difficulty: 1,
    },
    {
      n: "02",
      prompt:
        "Gudang kehabisan barang laris & kelebihan barang sepi. Masalah utama?",
      choices: [
        "Perencanaan demand/inventory tidak akurat",
        "Lampu gudang",
        "Warna rak",
        "Jumlah satpam",
      ],
      correctKey: "a",
      difficulty: 2,
    },
    {
      n: "03",
      prompt: "FIFO vs FEFO?",
      choices: [
        "Sama saja",
        "FIFO = masuk pertama keluar pertama; FEFO = yang expiry lebih dulu keluar dulu",
        "FEFO hanya untuk logam",
        "FIFO melarang stok",
      ],
      correctKey: "b",
      difficulty: 2,
    },
    {
      n: "04",
      prompt: "Lead time penting dikelola karena…",
      choices: [
        "Tidak relevan",
        "Mempengaruhi ketersediaan, janji kirim, dan buffer stok",
        "Hanya untuk marketing",
        "Hanya untuk gaji",
      ],
      correctKey: "b",
      difficulty: 1,
    },
    {
      n: "05",
      prompt: "Bottleneck operasional adalah…",
      choices: [
        "Tahap tercepat",
        "Orang terpintar",
        "Tahap paling membatasi throughput keseluruhan",
        "Hanya mesin rusak permanen",
      ],
      correctKey: "c",
      difficulty: 2,
    },
    {
      n: "06",
      prompt: "Banyak tahap manual berulang. Pendekatan peningkatan tipikal?",
      choices: [
        "Tambah meeting saja",
        "Abaikan",
        "Standarisasi + otomasi/eliminasi pemborosan (lean)",
        "Pecah tim tanpa proses",
      ],
      correctKey: "c",
      difficulty: 2,
    },
    {
      n: "07",
      prompt: "Mengukur efisiensi proses sederhana bisa dengan…",
      choices: [
        "Hanya perasaan",
        "Jumlah logo",
        "Warna seragam",
        "Output vs input/waktu, defect rate, lead time, cost per unit",
      ],
      correctKey: "d",
      difficulty: 2,
    },
  ]),

  digital_marketing: pack(
    "digital_marketing",
    "Digital Marketing / Performance Marketing",
    [
      {
        n: "01",
        prompt: "Spend Rp10jt, penjualan Rp45jt. ROAS?",
        choices: ["4,5", "0,22", "45", "10"],
        correctKey: "a",
        difficulty: 1,
      },
      {
        n: "02",
        prompt: "Lebih penting dievaluasi jangka panjang?",
        choices: [
          "Conversion rate + Customer Lifetime Value",
          "Hanya CTR tinggi",
          "Hanya like",
          "Biaya serendah mungkin tanpa hasil",
        ],
        correctKey: "a",
        difficulty: 2,
      },
      {
        n: "03",
        prompt: "CPC, CPM, CPA — singkatnya?",
        choices: [
          "Sama semua",
          "CPC per klik; CPM per seribu tayang; CPA per aksi/konversi",
          "CPA per tayang",
          "CPM per klik saja",
        ],
        correctKey: "b",
        difficulty: 1,
      },
      {
        n: "04",
        prompt: "A/B testing adalah…",
        choices: [
          "Ganti brand tiap hari",
          "Membandingkan dua varian (mis. iklan/kreatif) untuk ukur mana lebih baik",
          "Hanya survey",
          "Hapus analytics",
        ],
        correctKey: "b",
        difficulty: 1,
      },
      {
        n: "05",
        prompt: "Landing page bounce rate 78%. Langkah pertama?",
        choices: [
          "Naikkan budget 10×",
          "Matikan semua channel",
          "Cek message match, load speed, CTA, relevansi traffic",
          "Ganti domain",
        ],
        correctKey: "c",
        difficulty: 2,
      },
      {
        n: "06",
        prompt: "CTR iklan turun 3 hari. Kemungkinan penyebab?",
        choices: [
          "Hanya cuaca",
          "Mustahil",
          "Creative fatigue, audience overlap, bid/kompetisi, seasonality",
          "Hanya font",
        ],
        correctKey: "c",
        difficulty: 2,
      },
      {
        n: "07",
        prompt: "Remarketing vs retargeting (praktik umum digital ads)?",
        choices: [
          "Tidak ada istilah",
          "Sama 100% selalu",
          "Hanya email",
          "Sering dipakai saling berganti: menjangkau ulang user yang pernah berinteraksi (web/app/ads)",
        ],
        correctKey: "d",
        difficulty: 2,
      },
    ],
  ),

  content_creator: pack(
    "content_creator",
    "Content Creator / Penulis Konten",
    [
      {
        n: "01",
        prompt: "Konten viral vs konten yang membangun trust jangka panjang?",
        choices: [
          "Viral = lonjakan attention; trust = konsistensi value & kredibilitas berulang",
          "Sama saja",
          "Trust hanya view",
          "Viral selalu buruk",
        ],
        correctKey: "a",
        difficulty: 2,
      },
      {
        n: "02",
        prompt: "Brand ingin awareness. Format fase awal yang biasanya lebih efektif?",
        choices: [
          "Storytelling + value",
          "Hard selling langsung saja",
          "Hanya promo diskon",
          "Konten sangat formal kaku",
        ],
        correctKey: "a",
        difficulty: 1,
      },
      {
        n: "03",
        prompt: "Hook dalam konten adalah…",
        choices: [
          "Penutup saja",
          "Pembuka yang menarik perhatian di detik/awal pertama",
          "Hashtag acak",
          "Watermark",
        ],
        correctKey: "b",
        difficulty: 1,
      },
      {
        n: "04",
        prompt: "Mengapa konsistensi lebih penting daripada kesempurnaan di awal branding?",
        choices: [
          "Algoritma membenci post",
          "Algoritma & audiens butuh kehadiran berulang; sempurna tapi jarang sulit tumbuh",
          "Kualitas tidak penting sama sekali",
          "Hanya untuk TV",
        ],
        correctKey: "b",
        difficulty: 2,
      },
      {
        n: "05",
        prompt: "View tinggi tapi engagement rendah. Kemungkinan masalah?",
        choices: [
          "Server down",
          "Judul terlalu pendek",
          "Konten tidak relevan/memicu aksi; distribusi ke audiens salah",
          "Terlalu banyak hashtag bagus",
        ],
        correctKey: "c",
        difficulty: 2,
      },
      {
        n: "06",
        prompt: "Content pillar vs content series?",
        choices: [
          "Sama",
          "Series hanya reels",
          "Pillar = tema besar berulang; series = rangkaian episode terhubung",
          "Pillar hanya logo",
        ],
        correctKey: "c",
        difficulty: 2,
      },
      {
        n: "07",
        prompt: "Mengukur sukses konten selain views/followers?",
        choices: [
          "Hanya like teman",
          "Tidak perlu metrik",
          "Hanya repost kompetitor",
          "Saves, shares, komentar berkualitas, CTR, konversi, retensi",
        ],
        correctKey: "d",
        difficulty: 2,
      },
    ],
  ),

  graphic_design: pack("graphic_design", "Desain Grafis", [
    {
      n: "01",
      prompt: "Raster vs Vector?",
      choices: [
        "Raster = piksel (foto); Vector = path skalabel (logo/icon)",
        "Sama",
        "Vector hanya foto",
        "Raster selalu lebih kecil file",
      ],
      correctKey: "a",
      difficulty: 1,
    },
    {
      n: "02",
      prompt: "Desain “penuh” dan sulit dibaca — prinsip yang sering dilanggar?",
      choices: [
        "White space / negative space",
        "Hanya alignment sempurna",
        "Terlalu sedikit warna",
        "Font terlalu besar saja",
      ],
      correctKey: "a",
      difficulty: 2,
    },
    {
      n: "03",
      prompt: "Visual hierarchy adalah…",
      choices: [
        "Urutan acak elemen",
        "Pengaturan penekanan visual agar mata membaca prioritas yang benar",
        "Hanya grid 12 kolom",
        "Hanya warna brand",
      ],
      correctKey: "b",
      difficulty: 1,
    },
    {
      n: "04",
      prompt: "CMYK vs RGB — kapan dipakai?",
      choices: [
        "CMYK layar; RGB cetak",
        "RGB layar/digital; CMYK cetak offset umum",
        "Sama untuk semua",
        "RGB hanya untuk kertas",
      ],
      correctKey: "b",
      difficulty: 2,
    },
    {
      n: "05",
      prompt: "Desain bagus di layar buruk di cetak — penyebab umum?",
      choices: [
        "Mouse murah",
        "Nama file",
        "Resolusi/mode warna (RGB→CMYK), bleed, profil warna",
        "Jam kerja",
      ],
      correctKey: "c",
      difficulty: 2,
    },
    {
      n: "06",
      prompt: "Tipografi memengaruhi kesan desain karena…",
      choices: [
        "Font tidak penting",
        "Hanya ukuran kertas",
        "Karakter font membawa tone (formal/fun) & keterbacaan",
        "Hanya untuk kode",
      ],
      correctKey: "c",
      difficulty: 2,
    },
    {
      n: "07",
      prompt: "Sebelum buat logo, pertanyaan penting ke klien meliputi…",
      choices: [
        "Hanya warna favorit CEO",
        "Hanya budget host",
        "Hanya jumlah follower",
        "Audiens, positioning, usage, kompetitor, nilai merek",
      ],
      correctKey: "d",
      difficulty: 2,
    },
  ]),

  hr: pack("hr", "Human Resources / People Development", [
    {
      n: "01",
      prompt: "Recruitment vs Selection?",
      choices: [
        "Recruitment = tarik kandidat; Selection = pilih yang cocok dari pool",
        "Sama",
        "Selection hanya iklan",
        "Recruitment hanya interview akhir",
      ],
      correctKey: "a",
      difficulty: 1,
    },
    {
      n: "02",
      prompt:
        "Karyawan high performer tiba-tiba drop. Langkah HR pertama yang tepat?",
      choices: [
        "Cari tahu penyebab lewat percakapan empatik & data, bukan langsung hukuman",
        "PHK hari itu",
        "Abaikan",
        "Potong gaji tanpa dialog",
      ],
      correctKey: "a",
      difficulty: 2,
    },
    {
      n: "03",
      prompt: "Competency-Based Interview menitikberatkan…",
      choices: [
        "Hobi saja",
        "Bukti perilaku/kompetensi lewat contoh situasi nyata",
        "Hanya IPK",
        "Hanya gaji harapan",
      ],
      correctKey: "b",
      difficulty: 2,
    },
    {
      n: "04",
      prompt: "Contoh intrinsic motivation?",
      choices: [
        "Bonus saja",
        "Rasa pencapaian dan pengakuan bermakna",
        "Tunjangan jabatan saja",
        "Gaji pokok saja",
      ],
      correctKey: "b",
      difficulty: 1,
    },
    {
      n: "05",
      prompt: "Mengapa exit interview penting?",
      choices: [
        "Formalitas kosong",
        "Menghukum karyawan",
        "Belajar alasan keluar & perbaiki organisasi",
        "Mengisi kuota meeting",
      ],
      correctKey: "c",
      difficulty: 1,
    },
    {
      n: "06",
      prompt: "Training vs Development?",
      choices: [
        "Sama",
        "Development hanya seminar liburan",
        "Training = skill kerja sekarang; Development = kesiapan jangka panjang/karier",
        "Training hanya online",
      ],
      correctKey: "c",
      difficulty: 2,
    },
    {
      n: "07",
      prompt: "Mengukur efektivitas pelatihan bisa dengan…",
      choices: [
        "Hanya absensi",
        "Hanya snack",
        "Hanya sertifikat cetak",
        "Reaksi, pembelajaran, perilaku on-job, dan dampak bisnis (Kirkpatrick-style)",
      ],
      correctKey: "d",
      difficulty: 2,
    },
  ]),

  coach: pack("coach", "Pelatih / Coach", [
    {
      n: "01",
      prompt: "Coaching vs Mentoring — beda utama?",
      choices: [
        "Coaching gali solusi coachee lewat pertanyaan; mentoring sering berbagi pengalaman mentor",
        "Sama 100%",
        "Coaching hanya olahraga",
        "Mentoring melarang saran",
      ],
      correctKey: "a",
      difficulty: 2,
    },
    {
      n: "02",
      prompt: "Atlet/coachee plateau. Pendekatan coach yang baik?",
      choices: [
        "Evaluasi beban, recovery, teknik, motivasi; sesuaikan program",
        "Hentikan total tanpa alasan",
        "Hanya marah",
        "Abaikan data",
      ],
      correctKey: "a",
      difficulty: 2,
    },
    {
      n: "03",
      prompt: "Tujuan SMART penting karena…",
      choices: [
        "Membuat tujuan kabur",
        "Spesifik, terukur, achievable, relevan, berbatas waktu — memandu progress",
        "Hanya akronim marketing",
        "Mengganti feedback",
      ],
      correctKey: "b",
      difficulty: 1,
    },
    {
      n: "04",
      prompt: "Growth mindset menekankan…",
      choices: [
        "Bakat tetap tidak bisa diubah",
        "Kemampuan bisa berkembang lewat usaha & strategi belajar",
        "Hanya bakat genetik",
        "Menghindari tantangan",
      ],
      correctKey: "b",
      difficulty: 1,
    },
    {
      n: "05",
      prompt: "Kapan coach lebih banyak bertanya daripada instruksi langsung?",
      choices: [
        "Tidak pernah",
        "Saat darurat keselamatan tanpa waktu",
        "Saat ingin coachee punya ownership & kesadaran diri",
        "Saat coachee tidur",
      ],
      correctKey: "c",
      difficulty: 2,
    },
    {
      n: "06",
      prompt: "Coachee mengulang kesalahan yang sama. Langkah baik?",
      choices: [
        "Abaikan",
        "Hukum publik",
        "Refleksi penyebab, feedback spesifik, rencana latihan terfokus",
        "Ganti coachee diam-diam",
      ],
      correctKey: "c",
      difficulty: 2,
    },
    {
      n: "07",
      prompt: "Keberhasilan coaching diukur dari…",
      choices: [
        "Lama sesi saja",
        "Jumlah jargon",
        "Hanya pujian coach",
        "Perubahan perilaku/kinerja sesuai tujuan yang disepakati",
      ],
      correctKey: "d",
      difficulty: 2,
    },
  ]),

  educator: pack("educator", "Guru / Pendidikan / Educator", [
    {
      n: "01",
      prompt: "Teaching vs Facilitating Learning?",
      choices: [
        "Teaching sering transfer materi; facilitating menuntun siswa aktif membangun pemahaman",
        "Sama",
        "Facilitating melarang penjelasan",
        "Teaching tanpa tujuan",
      ],
      correctKey: "a",
      difficulty: 2,
    },
    {
      n: "02",
      prompt: "Siswa sering mengganggu. Pendekatan jangka panjang lebih efektif?",
      choices: [
        "Cari tahu penyebab secara pribadi & respons proporsional",
        "Hukum di depan kelas selalu",
        "Abaikan total",
        "Tugas hukuman massal",
      ],
      correctKey: "a",
      difficulty: 2,
    },
    {
      n: "03",
      prompt: "Differentiated instruction adalah…",
      choices: [
        "Satu cara untuk semua tanpa adaptasi",
        "Menyesuaikan konten/proses/produk sesuai kesiapan & kebutuhan siswa",
        "Hanya les privat",
        "Hanya ujian nasional",
      ],
      correctKey: "b",
      difficulty: 2,
    },
    {
      n: "04",
      prompt: "Selain nilai ujian, efektivitas metode mengajar bisa dilihat dari…",
      choices: [
        "Hanya absensi guru",
        "Partisipasi, transfer skill, portofolio, observasi, feedback siswa",
        "Hanya volume suara",
        "Hanya slide cantik",
      ],
      correctKey: "b",
      difficulty: 2,
    },
    {
      n: "05",
      prompt: "Assessment for Learning terutama berfungsi untuk…",
      choices: [
        "Peringkat akhir saja",
        "Hukuman",
        "Memberi informasi untuk menyesuaikan pengajaran saat proses belajar",
        "Mengganti kurikulum nasional",
      ],
      correctKey: "c",
      difficulty: 2,
    },
    {
      n: "06",
      prompt: "Siswa pintar sering tidak mengerjakan tugas. Kemungkinan penanganan?",
      choices: [
        "Langsung tinggal kelas",
        "Abaikan bakat",
        "Gali motivasi/beban; sesuaikan challenge & accountability",
        "Hapus semua tugas kelas",
      ],
      correctKey: "c",
      difficulty: 2,
    },
    {
      n: "07",
      prompt: "Feedback spesifik & actionable lebih baik daripada angka saja karena…",
      choices: [
        "Angka tidak pernah berguna",
        "Siswa tidak suka angka",
        "Hanya untuk orang tua",
        "Menunjukkan apa yang diperbaiki dan bagaimana, memandu belajar",
      ],
      correctKey: "d",
      difficulty: 1,
    },
  ]),

  customer_service: pack(
    "customer_service",
    "Customer Service / Customer Success",
    [
      {
        n: "01",
        prompt: "Customer Service vs Customer Success?",
        choices: [
          "Service = reaktif bantu masalah; Success = proaktif bantu raih outcome pelanggan",
          "Sama 100%",
          "Success hanya telepon",
          "Service hanya email marketing",
        ],
        correctKey: "a",
        difficulty: 2,
      },
      {
        n: "02",
        prompt:
          "Pelanggan marah padahal error di pihak mereka. Respons baik?",
        choices: [
          "Tetap tenang, empati, bantu solusi tanpa menyalahkan di depan umum",
          "Tertawa",
          "Salahkan mereka kasar",
          "Tutup tiket",
        ],
        correctKey: "a",
        difficulty: 2,
      },
      {
        n: "03",
        prompt: "First Contact Resolution penting karena…",
        choices: [
          "Memperpanjang antrean",
          "Menyelesaikan di kontak pertama menaikkan kepuasan & efisiensi",
          "Menghindari dokumentasi",
          "Mengganti produk",
        ],
        correctKey: "b",
        difficulty: 1,
      },
      {
        n: "04",
        prompt: "Lebih penting jangka panjang?",
        choices: [
          "Tiket secepat mungkin tanpa tuntas",
          "Selesaikan tuntas + jaga hubungan",
          "Kompensasi besar setiap komplain",
          "Alihkan ke atasan terus",
        ],
        correctKey: "b",
        difficulty: 1,
      },
      {
        n: "05",
        prompt: "Mengapa catat riwayat interaksi pelanggan?",
        choices: [
          "Buang waktu",
          "Untuk gossip",
          "Konteks lanjutan, konsistensi, dan resolusi lebih cepat",
          "Mengisi server saja",
        ],
        correctKey: "c",
        difficulty: 1,
      },
      {
        n: "06",
        prompt: "Empati tanpa terdengar pura-pura ditunjukkan dengan…",
        choices: [
          "Script robotik",
          "Mengabaikan perasaan",
          "Akui dampak, bahasa alami, fokus bantu langkah konkret",
          "Janji mustahil",
        ],
        correctKey: "c",
        difficulty: 2,
      },
      {
        n: "07",
        prompt: "Pelanggan minta di luar kebijakan. Respons baik?",
        choices: [
          "Langsung ya melanggar aturan",
          "Langsung tidak kasar",
          "Diam",
          "Jelaskan batasan, tawarkan alternatif dalam kebijakan, eskalasi bila perlu",
        ],
        correctKey: "d",
        difficulty: 2,
      },
    ],
  ),

  legal: pack("legal", "Legal / Hukum", [
    {
      n: "01",
      prompt: "Hukum pidana vs perdata — beda utama?",
      choices: [
        "Pidana: negara vs perbuatan melawan hukum publik; perdata: sengketa hak antar pihak privat",
        "Sama",
        "Perdata selalu penjara",
        "Pidana hanya kontrak",
      ],
      correctKey: "a",
      difficulty: 2,
    },
    {
      n: "02",
      prompt: "Asas praduga tak bersalah berarti…",
      choices: [
        "Terdakwa dianggap tidak bersalah sampai dibuktikan bersalah secara sah",
        "Semua orang bersalah",
        "Hakim wajib menghukum",
        "Tidak ada pembelaan",
      ],
      correctKey: "a",
      difficulty: 1,
    },
    {
      n: "03",
      prompt: "Perjanjian tanpa akta notaris…",
      choices: [
        "Otomatis tidak sah selalu",
        "Tidak otomatis batal; keabsahan tergantung syarat sah perjanjian & bentuk yang diwajibkan hukum",
        "Selalu ilegal",
        "Hanya lisan yang sah",
      ],
      correctKey: "b",
      difficulty: 3,
    },
    {
      n: "04",
      prompt: "Mediasi vs arbitrase vs litigasi?",
      choices: [
        "Sama semua di pengadilan",
        "Mediasi fasilitasi damai; arbitrase putusan pihak ketiga; litigasi proses pengadilan",
        "Arbitrase hanya pidana",
        "Mediasi wajib penjara",
      ],
      correctKey: "b",
      difficulty: 2,
    },
    {
      n: "05",
      prompt: "Mengapa baca seluruh kontrak termasuk syarat kecil?",
      choices: [
        "Tidak perlu",
        "Hanya notaris yang baca",
        "Klausul tersembunyi bisa mengikat hak/kewajiban material",
        "Hanya untuk font",
      ],
      correctKey: "c",
      difficulty: 1,
    },
    {
      n: "06",
      prompt:
        "Klausul sangat merugikan & tidak dijelaskan — isu yang sering dibahas?",
      choices: [
        "Hanya tipografi",
        "Hanya logo",
        "Ketidakseimbangan/klausul tidak adil atau kurangnya kejelasan kesepakatan (tergantung yurisdiksi)",
        "Warna kertas",
      ],
      correctKey: "c",
      difficulty: 3,
    },
    {
      n: "07",
      prompt:
        "Klien minta nasihat untuk tindakan legal teknis tapi etis meragukan. Sikap penasihat yang baik?",
      choices: [
        "Dorong tanpa batas",
        "Bohong ke pihak lain",
        "Abaikan etika profesional",
        "Jelaskan risiko hukum & reputasi; batasi peran sesuai etika profesi",
      ],
      correctKey: "d",
      difficulty: 3,
    },
  ]),
};
