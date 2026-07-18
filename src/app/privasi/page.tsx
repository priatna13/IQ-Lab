import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageShell, LegalSection } from "@/components/legal-page-shell";

export const metadata: Metadata = {
  title: "Kebijakan Privasi — IQ-Lab",
  description:
    "Bagaimana IQ-Lab mengumpulkan, memakai, dan menghapus data peserta asesmen multi-domain.",
};

export default function PrivacyPage() {
  return (
    <LegalPageShell
      title="Kebijakan Privasi"
      description="Menjelaskan data apa yang kami proses, untuk apa, berapa lama, dan hak Anda — selaras dengan perilaku produk saat ini (MVP soft-launch)."
      updated="18 Juli 2026"
    >
      <LegalSection id="ringkas" title="1. Ringkas">
        <p>
          IQ-Lab memproses data agar Anda bisa mendaftar, mengerjakan asesmen,
          menyimpan hasil, dan (opsional) menerima narasi insight. Hasil
          individual bersifat pribadi untuk akun Anda. Sampel norma agregat
          dibuat <strong>tanpa identitas</strong> dan tidak ditautkan kembali ke
          akun setelah terpisah.
        </p>
      </LegalSection>

      <LegalSection id="pengendali" title="2. Pengendali & infrastruktur">
        <p>
          Operator produk IQ-Lab mengelola layanan aplikasi. Backend autentikasi
          dan basis data memakai platform{" "}
          <strong>InsForge</strong> (Postgres, Auth, penyimpanan terkait
          layanan). Jika fitur insight LLM diaktifkan, teks insight dapat
          diproses lewat penyedia model (mis. OpenRouter) <strong>hanya</strong>{" "}
          dari payload terstruktur skor/aturan — bukan untuk menjual data
          personal Anda.
        </p>
      </LegalSection>

      <LegalSection id="data" title="3. Data yang kami proses">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Akun:</strong> email, kata sandi (di-hash oleh penyedia
            auth) atau identitas OAuth (mis. Google), nama tampilan jika diisi.
          </li>
          <li>
            <strong>Profil kelayakan:</strong> kelompok usia (Age Band), bukan
            tanggal lahir penuh di MVP.
          </li>
          <li>
            <strong>Asesmen:</strong> Track, Attempt, Domain Session, jawaban
            (Response), skor domain, Result Snapshot (profil, indeks, estimasi
            IQ, insight, action plan), Integrity Event (mis. blur/pindah tab —
            tanpa diskualifikasi otomatis).
          </li>
          <li>
            <strong>Teknis sesi:</strong> cookie/token sesi yang diperlukan agar
            Anda tetap masuk.
          </li>
          <li>
            <strong>Norm Sample (agregat):</strong> ringkasan skor dari Attempt
            Primary yang selesai, dengan bucket usia dan Content Version —{" "}
            <strong>tanpa</strong> email/nama/user id sebagai identitas.
          </li>
        </ul>
        <p className="mt-2">
          Kami <strong>tidak</strong> meminta data sensitif kesehatan untuk
          diagnosis, dan tidak menarget anak di bawah 18 tahun (onboarding
          menolak Age Band &lt; 18).
        </p>
      </LegalSection>

      <LegalSection id="tujuan" title="4. Tujuan pemrosesan">
        <ul className="list-disc space-y-1 pl-5">
          <li>Menyediakan akun dan keamanan akses</li>
          <li>Menjalankan asesmen, timer, skor, dan laporan (web/PDF)</li>
          <li>Menegakkan kebijakan retake dan satu Open Attempt</li>
          <li>Meningkatkan norma internal lewat sampel agregat anonim</li>
          <li>
            Observasi kualitas (Integrity Event) tanpa auto-gagal attempt
          </li>
          <li>Menghapus data atas permintaan Anda (lihat §7)</li>
        </ul>
      </LegalSection>

      <LegalSection id="dasar" title="5. Dasar & batasan penggunaan hasil">
        <p>
          Dengan memakai layanan, Anda setuju hasil dipakai untuk{" "}
          <strong>pengembangan diri</strong>. Hasil{" "}
          <strong>bukan</strong> diagnosis klinis, bukan sertifikasi rekrutmen,
          dan bukan tes IST resmi. Lihat juga{" "}
          <Link href="/syarat" className="font-medium text-lab-teal hover:underline">
            Syarat Penggunaan
          </Link>{" "}
          dan{" "}
          <Link href="/faq" className="font-medium text-lab-teal hover:underline">
            FAQ
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection id="pembagian" title="6. Pembagian data">
        <p>
          Kami tidak menjual data peserta. Data dapat diproses oleh sub-pemroses
          infrastruktur (InsForge / hosting front / penyedia LLM opsional)
          semata-mata untuk menjalankan layanan. PDF digenerate on-demand dari
          Result Snapshot; tidak diiklankan ke publik.
        </p>
      </LegalSection>

      <LegalSection id="retensi" title="7. Penyimpanan, penghapusan & hak Anda">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Data asesmen disimpan selama akun aktif agar Anda bisa melanjutkan
            Attempt dan melihat laporan.
          </li>
          <li>
            Dari dasbor, Anda dapat memicu{" "}
            <strong>penghapusan data asesmen teridentifikasi</strong>{" "}
            (Attempt, Response, Domain Session, Snapshot, Integrity Event)
            milik Anda.
          </li>
          <li>
            <strong>Norm Sample</strong> yang sudah terpisah/agregat{" "}
            <strong>tidak dihapus</strong> bersama akun — tidak lagi berisi
            tautan identitas ke Anda (kebijakan domain ADR 0015).
          </li>
          <li>
            Penghapusan total identitas di lapisan Auth platform (baris
            pengguna auth) bergantung pada kemampuan platform; produk memastikan
            data asesmen teridentifikasi dihapus dan sesi diakhiri.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="keamanan" title="8. Keamanan">
        <p>
          Kami menerapkan kontrol wajar: kunci jawaban hanya di server, skor di
          server, sesi lewat cookie yang dilindungi framework, dan RLS di basis
          data agar baris milik peserta lain tidak terbaca. Tidak ada sistem yang
          100% bebas risiko; laporkan insiden ke operator.
        </p>
      </LegalSection>

      <LegalSection id="cookie" title="9. Cookie & sejenisnya">
        <p>
          Cookie/token sesi dipakai untuk autentikasi (masuk/keluar). Kami tidak
          memasang iklan pihak ketiga di MVP. Analytics produk lanjutan (jika
          ditambahkan nanti) akan dijelaskan di pembaruan kebijakan ini.
        </p>
      </LegalSection>

      <LegalSection id="anak" title="10. Anak & remaja">
        <p>
          Layanan tidak ditujukan untuk pengguna di bawah 18 tahun. Onboarding
          menolak Age Band di bawah 18.
        </p>
      </LegalSection>

      <LegalSection id="perubahan" title="11. Perubahan">
        <p>
          Kami dapat memperbarui kebijakan ini seiring fitur baru. Tanggal
          “Terakhir diperbarui” di atas akan disesuaikan. Penggunaan
          berkelanjutan setelah pembaruan berarti Anda memahami versi terbaru.
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
