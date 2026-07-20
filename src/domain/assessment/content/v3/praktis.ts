import { buildDomainItems, type ItemDraft } from "../item-helpers";

/** Keys balanced: a,a,b,b,c,c,d,d */
const DRAFTS: ItemDraft[] = [
  {
    n: "01",
    prompt:
      "File rahasia klien terlanjur diunggah ke folder bersama yang terlalu luas. Langkah pertama paling tepat…",
    choices: [
      "Cabut akses segera, laporkan ke atasan/IT, perbaiki izin, dokumentasikan",
      "Biarkan saja",
      "Sebarkan file lain agar seimbang",
      "Tunggu sebulan tanpa tindakan",
    ],
    correctKey: "a",
    difficulty: 2,
  },
  {
    n: "02",
    prompt:
      "Rekan minta Anda menutupi kesalahan laporan yang disengaja. Tindakan paling tepat…",
    choices: [
      "Tolak; sarankan koreksi jujur sesuai prosedur",
      "Setuju agar solid",
      "Setuju lalu fitnah orang lain",
      "Minta bayaran dulu",
    ],
    correctKey: "a",
    difficulty: 1,
  },
  {
    n: "03",
    prompt:
      "Anda punya presentasi penting jam 3; rekan minta review dokumen non-mendesak. Keputusan seimbang…",
    choices: [
      "Tunda presentasi Anda",
      "Selesaikan prioritas presentasi; janjikan waktu review setelahnya",
      "Abaikan rekan selamanya",
      "Kerjakan review dulu tanpa batas",
    ],
    correctKey: "b",
    difficulty: 1,
  },
  {
    n: "04",
    prompt:
      "Di rapat, usulan Anda dikritik tajam tapi berdasar data. Respons profesional…",
    choices: [
      "Serang pribadi pengritik",
      "Dengarkan, klarifikasi, fokus pada substansi",
      "Keluar tanpa bicara",
      "Setuju membabi buta",
    ],
    correctKey: "b",
    difficulty: 2,
  },
  {
    n: "05",
    prompt:
      "Estimasi proyek belum matang; stakeholder minta angka pasti hari ini. Respons terbaik…",
    choices: [
      "Sebut angka acak",
      "Tolak bicara selamanya",
      "Berikan rentang + asumsi; janji update setelah data lengkap",
      "Diam total",
    ],
    correctKey: "c",
    difficulty: 2,
  },
  {
    n: "06",
    prompt:
      "Perangkat kerja penuh aplikasi pribadi dan menjadi lambat. Langkah bijak…",
    choices: [
      "Abaikan sampai rusak",
      "Serahkan ke orang lain diam-diam",
      "Ikuti kebijakan IT; bersihkan yang tidak perlu; pisahkan urusan pribadi",
      "Format tanpa backup",
    ],
    correctKey: "c",
    difficulty: 2,
  },
  {
    n: "07",
    prompt:
      "Pelanggan marah di chat publik karena delay yang sebagian karena perubahan request mereka. Respons awal terbaik…",
    choices: [
      "Balas marah di publik",
      "Blokir pelanggan",
      "Salahkan rekan di publik",
      "Akui proses, pindah ke privat, tawarkan solusi & klarifikasi scope",
    ],
    correctKey: "d",
    difficulty: 3,
  },
  {
    n: "08",
    prompt:
      "Anda temukan cacat kecil di fitur jarang dipakai; rilis besar besok. Tindakan paling masuk akal…",
    choices: [
      "Sembunyikan selamanya",
      "Batalkan rilis sendiri tanpa bicara",
      "Posting ke media sosial dulu",
      "Laporkan severity; biarkan triage putuskan apakah memblokir rilis",
    ],
    correctKey: "d",
    difficulty: 3,
  },
];

export function itemsPraktis() {
  return buildDomainItems("praktis", DRAFTS);
}
