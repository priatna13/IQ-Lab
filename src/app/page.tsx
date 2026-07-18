import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getInsForgePublicConfig } from "@/lib/insforge/public-config";
import { getSessionUser } from "@/lib/auth/session";

export default async function HomePage() {
  const insforge = getInsForgePublicConfig();
  const user = await getSessionUser();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex max-w-4xl flex-col gap-10 px-6 py-14">
        <section className="space-y-5">
          <p className="text-sm font-medium uppercase tracking-wide text-lab-teal">
            Pengembangan diri · multi-domain
          </p>
          <h1 className="max-w-2xl text-4xl font-semibold leading-tight text-lab-navy md:text-5xl">
            Kenali struktur kemampuan Anda — lalu rancang langkah belajar &
            karir
          </h1>
          <p className="max-w-2xl text-lg text-slate-600">
            IQ-Lab memberikan{" "}
            <strong>profil kekuatan & kelemahan</strong> lewat asesmen
            multi-domain, plus insight arah potensi. Dirancang untuk mahasiswa,
            fresh graduate, dan profesional mid-career.
          </p>
          <div className="flex flex-wrap gap-3">
            {user ? (
              <Link
                href="/dashboard"
                className="rounded-lg bg-lab-teal px-5 py-2.5 text-sm font-semibold text-white"
              >
                Buka dasbor
              </Link>
            ) : (
              <>
                <Link
                  href="/daftar"
                  className="rounded-lg bg-lab-teal px-5 py-2.5 text-sm font-semibold text-white"
                >
                  Mulai gratis
                </Link>
                <Link
                  href="/masuk"
                  className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-lab-navy"
                >
                  Sudah punya akun
                </Link>
              </>
            )}
          </div>
        </section>

        <section className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-slate-700">
          <h2 className="font-semibold text-lab-navy">Penting dibaca</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              <strong>Bukan</strong> tes IST / IST 2000R resmi atau berlisensi.
            </li>
            <li>
              <strong>Bukan</strong> alat diagnosis klinis atau sertifikasi
              rekrutmen (BUMN, CPNS, HR formal).
            </li>
            <li>
              Hasil berupa <strong>estimasi norma internal</strong> untuk
              pengembangan diri — gunakan sebagai refleksi, bukan label absolut.
            </li>
            <li>
              Item asesmen original IQ-Lab; kerangka multi-domain terinspirasi
              tradisi asesmen struktur inteligensi.
            </li>
          </ul>
          <p className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
            <Link
              href="/faq"
              className="font-semibold text-lab-teal hover:underline"
            >
              FAQ & metodologi
            </Link>
            <Link
              href="/privasi"
              className="font-semibold text-lab-teal hover:underline"
            >
              Privasi
            </Link>
            <Link
              href="/syarat"
              className="font-semibold text-lab-teal hover:underline"
            >
              Syarat
            </Link>
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "9 domain",
              body: "Profil verbal, numerik, spasial, memori, logika, dan area terkait — bukan satu angka saja.",
            },
            {
              title: "Dua jalur",
              body: "Jelajahi potensi atau rancang langkah karir — item sama, framing insight berbeda.",
            },
            {
              title: "Gratis (MVP)",
              body: "Laporan web & PDF tanpa paywall di fase validasi produk.",
            },
          ].map((card) => (
            <article
              key={card.title}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <h3 className="font-semibold text-lab-navy">{card.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{card.body}</p>
            </article>
          ))}
        </section>

        <p className="text-xs text-slate-400">
          Backend: InsForge{" "}
          {insforge.isConfigured ? "terhubung" : "belum dikonfigurasi"}.
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
