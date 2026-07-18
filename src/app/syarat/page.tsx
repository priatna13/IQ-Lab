import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageShell, LegalSection } from "@/components/legal-page-shell";

export const metadata: Metadata = {
  title: "Syarat Penggunaan — IQ-Lab",
  description:
    "Syarat memakai asesmen multi-domain IQ-Lab: kelayakan, batasan hasil, akun, dan perilaku wajar.",
};

export default function TermsPage() {
  return (
    <LegalPageShell
      title="Syarat Penggunaan"
      description="Aturan memakai situs dan asesmen IQ-Lab. Dengan mendaftar atau mengerjakan asesmen, Anda menyetujui syarat ini."
      updated="18 Juli 2026"
    >
      <LegalSection id="layanan" title="1. Layanan">
        <p>
          IQ-Lab menyediakan asesmen multi-domain, profil kemampuan, estimasi
          skor internal, insight/action plan, serta laporan web dan PDF untuk{" "}
          <strong>pengembangan diri dan arah belajar/karir mandiri</strong>.
          Layanan MVP bersifat gratis tanpa paywall fitur inti.
        </p>
      </LegalSection>

      <LegalSection id="bukan" title="2. Apa yang bukan IQ-Lab">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Bukan tes IST / IST 2000R resmi, berlisensi, atau setara item/norma
            IST.
          </li>
          <li>
            Bukan diagnosis klinis, psikopatologi, atau asesmen psikologi formal
            berizin praktik.
          </li>
          <li>
            Bukan sertifikasi rekrutmen, penempatan, seleksi CPNS/BUMN, atau alat
            HR formal.
          </li>
          <li>
            Bukan jaminan hasil karir, kelulusan, atau “IQ resmi” setara
            instrumen klinis.
          </li>
        </ul>
        <p className="mt-2">
          Detail metodologi:{" "}
          <Link href="/faq" className="font-medium text-lab-teal hover:underline">
            FAQ & metodologi
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection id="kelayakan" title="3. Kelayakan">
        <ul className="list-disc space-y-1 pl-5">
          <li>Anda berusia minimal 18 tahun.</li>
          <li>
            Usia 46+ diizinkan dengan pemahaman bahwa norma & saran karir mungkin
            kurang terkalibrasi (disclaimer onboarding).
          </li>
          <li>
            Anda bertanggung jawab atas kebenaran data akun dan keamanan kata
            sandi / akun OAuth.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="akun" title="4. Akun & asesmen">
        <ul className="list-disc space-y-1 pl-5">
          <li>Account wajib sebelum memulai Attempt.</li>
          <li>
            Track (<em>Jelajahi potensi</em> / <em>Rancang langkah karir</em>)
            dipilih saat mulai dan <strong>tidak diganti</strong> di tengah
            Attempt; ganti track berarti batalkan Attempt (jika diizinkan
            kebijakan) lalu mulai baru.
          </li>
          <li>
            Paling banyak satu Open Attempt per peserta; pause diizinkan antar
            Domain Session.
          </li>
          <li>
            Retake setelah Completed dibatasi (MVP: satu penyelesaian per 90
            hari). Abandoned tidak memicu cooldown yang sama.
          </li>
          <li>
            Item dan urutan Domain dipin pada Content Version saat Attempt
            dibuat.
          </li>
          <li>
            Dilarang membocorkan kunci, mengotomatisasi massal, atau menyalahgunakan
            layanan untuk menipu orang lain tentang “skor resmi”.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="hasil" title="5. Hasil, norma & insight">
        <p>
          Domain Score, Composite Index, dan IQ Estimate memakai{" "}
          <strong>Norm Version internal</strong> (pada soft-launch: norma
          sintetik/sementara) dan harus dibaca sebagai estimasi. Insight karir
          mengikuti Rule Payload; narasi AI (jika aktif) dibatasi payload itu
          dan dapat jatuh ke template jika model gagal. Result Snapshot bersifat
          imutabel setelah complete — tidak di-rewrite diam-diam saat model
          membaik.
        </p>
      </LegalSection>

      <LegalSection id="integritas" title="6. Integritas">
        <p>
          Peristiwa seperti pindah tab dapat dicatat sebagai Integrity Event
          untuk observasi kualitas. MVP{" "}
          <strong>tidak</strong> melakukan diskualifikasi otomatis. Anda
          diharapkan mengerjakan sendiri dengan jujur.
        </p>
      </LegalSection>

      <LegalSection id="ip" title="7. Konten & kekayaan intelektual">
        <p>
          Soal, salinan UI, dan merek IQ-Lab milik operator / pemberi lisensi.
          Anda boleh menyimpan PDF laporan untuk keperluan pribadi. Dilarang
          menyalin bank soal untuk produk saingan atau mengklaim hasil sebagai
          sertifikat resmi pihak ketiga.
        </p>
      </LegalSection>

      <LegalSection id="privasi" title="8. Privasi">
        <p>
          Pemrosesan data diatur dalam{" "}
          <Link
            href="/privasi"
            className="font-medium text-lab-teal hover:underline"
          >
            Kebijakan Privasi
          </Link>
          . Dengan memakai layanan Anda memahami praktik tersebut.
        </p>
      </LegalSection>

      <LegalSection id="ketersediaan" title="9. Ketersediaan & perubahan">
        <p>
          Layanan disediakan “sebagaimana adanya” untuk soft-launch. Kami dapat
          mengubah fitur, konten (Content Version baru), atau menghentikan
          layanan dengan pemberitahuan wajar bila memungkinkan. Kami tidak
          menjamin uptime mutlak.
        </p>
      </LegalSection>

      <LegalSection id="tanggung-jawab" title="10. Batasan tanggung jawab">
        <p>
          Sejauh diizinkan hukum yang berlaku, operator tidak bertanggung jawab
          atas keputusan high-stakes (rekrutmen, medis, hukum) yang Anda ambil
          semata-mata berdasarkan hasil IQ-Lab. Gunakan profesional berlisensi
          untuk keperluan tersebut.
        </p>
      </LegalSection>

      <LegalSection id="hukum" title="11. Hukum & kontak">
        <p>
          Syarat ini disusun untuk produk digital yang diakses dari Indonesia
          (UI Bahasa Indonesia). Sengketa diupayakan diselesaikan secara
          musyawarah. Untuk pertanyaan, hubungi operator proyek lewat saluran
          yang diumumkan di situs/dasbor.
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
