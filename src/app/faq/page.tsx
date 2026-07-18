import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "FAQ & Metodologi — IQ-Lab",
  description:
    "Penjelasan kerangka multi-domain inspired-by, batasan produk, dan cara memakai hasil IQ-Lab untuk pengembangan diri.",
};

const FAQ_ITEMS: Array<{ q: string; a: ReactNode }> = [
  {
    q: "Apa itu IQ-Lab?",
    a: (
      <>
        IQ-Lab adalah platform asesmen <strong>multi-domain</strong> untuk
        membantu Anda melihat profil kekuatan dan kelemahan kognitif, lalu
        merancang langkah belajar atau karir. Produk ini untuk{" "}
        <strong>pengembangan diri</strong>, bukan sertifikasi formal.
      </>
    ),
  },
  {
    q: "Apakah IQ-Lab sama dengan tes IST / IST 2000R?",
    a: (
      <>
        <strong>Tidak.</strong> IQ-Lab <strong>bukan</strong> produk, adaptasi
        resmi, atau substitusi IST / IST 2000R yang berlisensi. Item soal,
        penamaan domain, dan norma kami bersifat original IQ-Lab. Kami hanya
        terinspirasi gagasan bahwa kecerdasan bisa digambarkan sebagai{" "}
        <em>struktur multi-faktor</em> (banyak area), bukan satu angka saja —
        tradisi yang antara lain dikenal lewat kerangka asesmen struktur
        inteligensi (termasuk karya Rudolf Amthauer dan pengembangan IST di
        dunia profesional).
      </>
    ),
  },
  {
    q: "Apa arti “inspired-by kerangka multi-domain”?",
    a: (
      <>
        Artinya asesmen IQ-Lab mengukur beberapa area (verbal, numerik,
        figural/spasial, memori, penalaran logis, penilaian praktis, dll.)
        agar hasilnya berupa <strong>profil</strong>, bukan sekadar satu skor.
        Ini konsep umum dalam asesmen multi-faktor. Ini{" "}
        <strong>bukan</strong> klaim kesetaraan psikometrik dengan tes
        berlisensi manapun, dan bukan replikasi item/norma IST resmi.
      </>
    ),
  },
  {
    q: "Untuk apa hasilnya boleh dipakai?",
    a: (
      <>
        Hasil dirancang untuk:
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Refleksi kekuatan & area pengembangan</li>
          <li>Eksplorasi jurusan, minat, atau jalur belajar</li>
          <li>Prioritas skill & rencana pengembangan karir mandiri</li>
          <li>Diskusi dengan mentor/coach (sebagai bahan bantu, bukan “bukti resmi”)</li>
        </ul>
      </>
    ),
  },
  {
    q: "Apa yang tidak menjadi tujuan IQ-Lab?",
    a: (
      <>
        IQ-Lab <strong>bukan</strong>:
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Diagnosis klinis atau asesmen psikologis formal</li>
          <li>
            Sertifikasi rekrutmen, penempatan, atau seleksi CPNS / BUMN /
            perusahaan
          </li>
          <li>Pengganti tes IST resmi di lembaga psikologi atau HRD</li>
          <li>Label absolut “IQ resmi” setara instrumen klinis (mis. WAIS)</li>
        </ul>
      </>
    ),
  },
  {
    q: "Apa arti Indeks kemampuan umum dan Estimasi IQ?",
    a: (
      <>
        <strong>Indeks kemampuan umum</strong> merangkum profil multi-domain
        menjadi satu angka ringkas (skala internal).{" "}
        <strong>Estimasi IQ</strong> adalah transform ke skala yang familiar
        (sekitar mean 100) berdasarkan{" "}
        <strong>norma internal sementara</strong> IQ-Lab — bukan norma populasi
        Indonesia yang sudah divalidasi secara klinis/rekrutmen. Di antarmuka
        kami menandai ini sebagai{" "}
        <em>“Estimasi · norma sementara”</em>.
      </>
    ),
  },
  {
    q: "Bagaimana insight karir dihasilkan?",
    a: (
      <>
        Klaster arah dan prioritas skill dihitung dulu oleh{" "}
        <strong>rule engine</strong> (matriks domain → klaster yang bisa
        diaudit). Narasi Bahasa Indonesia bisa ditulis template atau model
        bahasa, tetapi <strong>hanya dalam batasan</strong> keluaran rule
        tersebut — model tidak boleh mengarang klaster di luar matriks. Insight
        dibekukan di Result Snapshot saat asesmen selesai.
      </>
    ),
  },
  {
    q: "Bagaimana cara memakai hasil dengan sehat?",
    a: (
      <>
        Anggap hasil sebagai <strong>peta sementara</strong>: bandingkan dengan
        pengalaman nyata, coba proyek kecil di klaster yang disarankan, dan
        revisi rencana seiring waktu. Jangan pakai satu angka untuk menutup
        pintu jurusan/karir. Jika Anda butuh keputusan high-stakes (rekrutmen
        formal, klinis), gunakan layanan profesional berlisensi yang sesuai.
      </>
    ),
  },
  {
    q: "Bagaimana privasi data saya?",
    a: (
      <>
        Hasil individual bersifat pribadi (hanya akun Anda). Anda dapat menghapus
        data asesmen teridentifikasi dari dasbor. Sampel agregat anonim (tanpa
        identitas) dapat dipakai untuk memperbaiki norma internal — tanpa
        menautkan kembali ke akun Anda. Detail lengkap:{" "}
        <Link
          href="/privasi"
          className="font-semibold text-lab-teal hover:underline"
        >
          Kebijakan Privasi
        </Link>{" "}
        dan{" "}
        <Link
          href="/syarat"
          className="font-semibold text-lab-teal hover:underline"
        >
          Syarat Penggunaan
        </Link>
        .
      </>
    ),
  },
];

export default function FaqPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-sm font-medium uppercase tracking-wide text-lab-teal">
          FAQ & metodologi
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-lab-navy">
          Memahami IQ-Lab dengan jujur
        </h1>
        <p className="mt-3 text-slate-600">
          Halaman ini menjelaskan posisi produk, batasan, dan cara membaca
          hasil — selaras dengan komitmen kami: transparan, bukan overclaim.
        </p>

        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-slate-700">
          <strong className="text-lab-navy">Ringkas:</strong> multi-domain
          inspired-by · item original ·{" "}
          <strong>bukan IST resmi</strong> ·{" "}
          <strong>bukan rekrutmen/klinis</strong> · estimasi norma internal
          sementara · untuk pengembangan diri.
        </div>

        <div className="mt-10 space-y-6">
          {FAQ_ITEMS.map((item) => (
            <section
              key={item.q}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <h2 className="text-base font-semibold text-lab-navy">
                {item.q}
              </h2>
              <div className="mt-3 text-sm leading-relaxed text-slate-700">
                {item.a}
              </div>
            </section>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-slate-600">
          Siap mencoba?{" "}
          <Link href="/daftar" className="font-semibold text-lab-teal">
            Buat akun gratis
          </Link>{" "}
          atau kembali ke{" "}
          <Link href="/" className="font-semibold text-lab-teal">
            beranda
          </Link>
          .
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
