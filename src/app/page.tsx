import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MeshOrbs } from "@/components/ui/mesh-orbs";
import {
  IconArrowRight,
  IconGift,
  IconGrid,
  IconPath,
  IconShield,
  IconSparkle,
} from "@/components/ui/icons";
import { getInsForgePublicConfig } from "@/lib/insforge/public-config";
import { getSessionUser } from "@/lib/auth/session";

export default async function HomePage() {
  const insforge = getInsForgePublicConfig();
  const user = await getSessionUser();

  return (
    <>
      <SiteHeader />
      <main id="main-content" className="relative mx-auto w-full max-w-4xl flex-1 overflow-hidden px-4 py-10 sm:px-6 sm:py-14">
        <MeshOrbs />

        <section className="relative animate-fade-up space-y-6">
          <span className="lab-badge bg-lab-mint/80 text-lab-teal-deep ring-1 ring-lab-teal/20">
            <IconSparkle className="h-3.5 w-3.5" />
            Pengembangan diri · multi-domain
          </span>
          <h1 className="max-w-2xl text-3xl font-bold leading-tight tracking-tight text-lab-navy sm:text-4xl md:text-5xl">
            Kenali struktur kemampuan Anda — lalu rancang langkah belajar &amp;
            karir
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
            IQ-Lab memetakan{" "}
            <strong className="font-semibold text-lab-navy">
              profil kekuatan &amp; kelemahan
            </strong>{" "}
            lewat asesmen 9 domain, plus insight arah potensi. Dirancang untuk
            mahasiswa, fresh graduate, dan profesional mid-career.
          </p>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
            {user ? (
              <Link href="/dashboard" className="lab-btn-primary w-full sm:w-auto">
                Buka dasbor
                <IconArrowRight />
              </Link>
            ) : (
              <>
                <Link href="/daftar" className="lab-btn-primary w-full sm:w-auto">
                  Mulai gratis
                  <IconArrowRight />
                </Link>
                <Link href="/masuk" className="lab-btn-secondary w-full sm:w-auto">
                  Sudah punya akun
                </Link>
              </>
            )}
          </div>
        </section>

        <section className="relative mt-10 animate-fade-up-1 lab-card p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-lab-warm">
              <IconShield className="h-4 w-4" />
            </span>
            <div>
              <h2 className="font-semibold text-lab-navy">Penting dibaca</h2>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate-700">
                <li>
                  <strong>Bukan</strong> tes IST / IST 2000R resmi atau berlisensi.
                </li>
                <li>
                  <strong>Bukan</strong> alat diagnosis klinis atau sertifikasi
                  rekrutmen (BUMN, CPNS, HR formal).
                </li>
                <li>
                  Hasil berupa <strong>estimasi norma internal</strong> untuk
                  pengembangan diri — refleksi, bukan label absolut.
                </li>
                <li>
                  Item original IQ-Lab; kerangka multi-domain terinspirasi tradisi
                  asesmen struktur inteligensi.
                </li>
              </ul>
              <p className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold">
                <Link href="/faq" className="text-lab-teal hover:underline">
                  FAQ &amp; metodologi
                </Link>
                <Link href="/privasi" className="text-lab-teal hover:underline">
                  Privasi
                </Link>
                <Link href="/syarat" className="text-lab-teal hover:underline">
                  Syarat
                </Link>
              </p>
            </div>
          </div>
        </section>

        <section className="relative mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {[
            {
              title: "9 domain",
              body: "Profil verbal, numerik, spasial, memori, logika, dan area terkait — bukan satu angka saja.",
              icon: IconGrid,
              delay: "animate-fade-up-1",
              tint: "from-lab-teal/15 to-lab-mint/40",
            },
            {
              title: "Dua jalur",
              body: "Jelajahi potensi atau rancang langkah karir — item sama, framing insight berbeda.",
              icon: IconPath,
              delay: "animate-fade-up-2",
              tint: "from-lab-violet/15 to-white",
            },
            {
              title: "Gratis (MVP)",
              body: "Laporan web & PDF tanpa paywall di fase validasi produk.",
              icon: IconGift,
              delay: "animate-fade-up-3",
              tint: "from-lab-sky/15 to-white",
            },
          ].map((card) => (
            <article
              key={card.title}
              className={`lab-card-hover relative overflow-hidden p-5 ${card.delay}`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${card.tint} opacity-80`}
                aria-hidden
              />
              <div className="relative">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 text-lab-teal shadow-sm">
                  <card.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-3 font-semibold text-lab-navy">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {card.body}
                </p>
              </div>
            </article>
          ))}
        </section>

        <p className="relative mt-10 text-xs text-slate-400">
          Backend: InsForge{" "}
          {insforge.isConfigured ? "terhubung" : "belum dikonfigurasi"}.
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
