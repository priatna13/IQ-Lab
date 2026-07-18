import { buildDomainItems, type ItemDraft } from "../item-helpers";

/** Keys balanced: a,a,b,b,c,c,d,d — no single-option gaming */
const DRAFTS: ItemDraft[] = [
  {
    n: "01",
    prompt:
      "Email berisi data gaji rekan terlanjur terkirim ke grup luas. Langkah pertama yang paling tepat…",
    choices: [
      "Segera coba tarik/perbaiki, beri tahu atasan/IT sesuai prosedur, minta penerima hapus",
      "Abaikan saja",
      "Sebarkan data lain agar “adil”",
      "Tunggu seminggu tanpa tindakan",
    ],
    correctKey: "a",
    difficulty: 2,
  },
  {
    n: "02",
    prompt:
      "Rekan meminta Anda menandatangani daftar hadir padahal ia absen. Tindakan paling tepat…",
    choices: [
      "Tolak; sarankan ia urus sesuai kebijakan kehadiran",
      "Tandatangani agar solid",
      "Tandatangani lalu laporkan orang lain",
      "Tanyakan bayaran dulu",
    ],
    correctKey: "a",
    difficulty: 1,
  },
  {
    n: "03",
    prompt:
      "Deadline laporan sore ini. Rekan minta bantuan tugas besar yang bisa menunggu. Keputusan paling seimbang…",
    choices: [
      "Langsung kerjakan semua permintaan rekan dulu",
      "Selesaikan prioritas deadline; komunikasikan kapan Anda bisa bantu",
      "Abaikan rekan selamanya",
      "Tinggalkan laporan Anda",
    ],
    correctKey: "b",
    difficulty: 1,
  },
  {
    n: "04",
    prompt:
      "Di rapat, ide Anda dikritik tajam tetapi substansial. Respons paling profesional…",
    choices: [
      "Balas menyerang pribadi",
      "Dengarkan, klarifikasi, pisahkan emosi dari substansi",
      "Keluar rapat tanpa kata",
      "Setuju semua tanpa pikir",
    ],
    correctKey: "b",
    difficulty: 2,
  },
  {
    n: "05",
    prompt:
      "Anda belum yakin estimasi biaya proyek. Klien meminta angka pasti. Respons paling tepat…",
    choices: [
      "Sebut angka acak agar terlihat yakin",
      "Tolak menjawab selamanya",
      "Sampaikan rentang/estimasi + asumsi; janji revisi setelah data",
      "Diam total",
    ],
    correctKey: "c",
    difficulty: 2,
  },
  {
    n: "06",
    prompt:
      "Laptop kerja lambat setelah banyak aplikasi pribadi terpasang. Langkah bijak…",
    choices: [
      "Abaikan sampai rusak",
      "Bagikan ke orang lain diam-diam",
      "Ikuti kebijakan IT; bersihkan yang tidak perlu; pisahkan pemakaian pribadi",
      "Format tanpa backup data tim",
    ],
    correctKey: "c",
    difficulty: 2,
  },
  {
    n: "07",
    prompt:
      "Klien marah di chat publik karena keterlambatan yang sebagian karena perubahan scope dari pihaknya. Respons awal terbaik…",
    choices: [
      "Balas emosi di publik",
      "Blokir klien",
      "Salahkan rekan di publik",
      "Akui tanggung jawab proses, pindah ke kanal privat, usulkan solusi & klarifikasi scope",
    ],
    correctKey: "d",
    difficulty: 3,
  },
  {
    n: "08",
    prompt:
      "Anda menemukan bug kecil di fitur jarang dipakai; rilis besar dijadwalkan besok. Tindakan paling masuk akal…",
    choices: [
      "Sembunyikan selamanya",
      "Batalkan rilis sendiri tanpa komunikasi",
      "Posting ke media sosial dulu",
      "Laporkan dengan tingkat keparahan; biarkan triage putuskan apakah memblokir rilis",
    ],
    correctKey: "d",
    difficulty: 3,
  },
];

export function itemsPraktis() {
  return buildDomainItems("praktis", DRAFTS);
}
