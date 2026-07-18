import Link from "next/link";
import { PageShell } from "@/components/ui/page-shell";
import { BrandLogo } from "@/components/ui/brand-logo";
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

const DOMAINS = [
  "Verbal",
  "Analogi",
  "Numerik",
  "Pola",
  "Figural",
  "Spasial",
  "Memori",
  "Logika",
  "Praktis",
];

const DOMAIN_TINTS = [
  "bg-lab-teal/15 text-lab-teal-deep ring-lab-teal/20",
  "bg-lab-sky/15 text-sky-700 ring-lab-sky/25",
  "bg-lab-violet/15 text-violet-700 ring-lab-violet/20",
  "bg-lab-mint text-lab-teal-deep ring-lab-teal/15",
  "bg-lab-coral/10 text-rose-700 ring-lab-coral/20",
  "bg-lab-mist text-lab-navy-soft ring-lab-sky/20",
  "bg-amber-50 text-amber-800 ring-amber-200/60",
  "bg-lab-violet/10 text-violet-800 ring-lab-violet/15",
  "bg-lab-teal/10 text-lab-navy ring-lab-teal/15",
];

export default async function HomePage() {
  const insforge = getInsForgePublicConfig();
  const user = await getSessionUser();

  return (
    <PageShell width="xl" orbs="full" mainClassName="sm:py-14">
      {/* Hero */}
      <section className="animate-fade-up grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <span className="lab-badge bg-white/90 text-lab-teal-deep shadow-soft ring-1 ring-lab-teal/20">
            <IconSparkle className="h-3.5 w-3.5" />
            Pengembangan diri · multi-domain
          </span>
          <h1 className="max-w-2xl text-3xl font-bold leading-[1.12] tracking-tight text-lab-navy sm:text-4xl md:text-5xl">
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
          <p className="text-xs text-slate-500">
            Gratis di fase MVP · ~60–90 menit · jeda antar domain diizinkan
          </p>
        </div>

        {/* Hero visual panel */}
        <div className="relative animate-fade-up-1 mx-auto w-full max-w-sm lg:max-w-none">
          <div className="lab-card relative overflow-hidden p-6 sm:p-7">
            <div
              className="absolute inset-0 bg-gradient-to-br from-lab-mint/50 via-white to-lab-mist/80"
              aria-hidden
            />
            <div className="relative flex flex-col items-center text-center">
              <BrandLogo size="hero" href={null} withWordmark={false} priority />
              <p className="mt-4 text-sm font-semibold text-lab-navy">
                9 domain · 1 profil jujur
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Bukan satu angka absolut — peta kemampuan Anda
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-1.5">
                {DOMAINS.map((d, i) => (
                  <span
                    key={d}
                    className={`lab-badge ring-1 ${DOMAIN_TINTS[i % DOMAIN_TINTS.length]}`}
                  >
                    {d}
                  </span>
                ))}
              </div>
              <div className="mt-6 grid w-full grid-cols-2 gap-3 text-left">
                <div className="rounded-xl bg-white/90 p-3 shadow-sm ring-1 ring-white">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                    Indeks
                  </p>
                  <p className="font-mono text-2xl font-bold tabular-nums text-lab-navy">
                    ··
                  </p>
                </div>
                <div className="rounded-xl bg-white/90 p-3 shadow-sm ring-1 ring-white">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                    Estimasi IQ
                  </p>
                  <p className="font-mono text-2xl font-bold tabular-nums text-lab-teal">
                    ··
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Honesty */}
      <section className="relative mt-12 animate-fade-up-1 lab-card p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-lab-warm">
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

      {/* Feature bento */}
      <section className="relative mt-8">
        <p className="lab-section-label">Kenapa IQ-Lab</p>
        <h2 className="mt-2 text-xl font-bold text-lab-navy sm:text-2xl">
          Profil utuh, insight yang bisa ditindaklanjuti
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {[
            {
              title: "9 domain",
              body: "Profil verbal, numerik, spasial, memori, logika, dan area terkait — bukan satu angka saja.",
              icon: IconGrid,
              delay: "animate-fade-up-1",
              tint: "from-lab-teal/20 to-lab-mint/50",
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
                className={`absolute inset-0 bg-gradient-to-br ${card.tint} opacity-90`}
                aria-hidden
              />
              <div className="relative">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/95 text-lab-teal shadow-sm ring-1 ring-white">
                  <card.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-3 font-semibold text-lab-navy">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {card.body}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="relative mt-12 animate-fade-up-2">
        <p className="lab-section-label">Alur singkat</p>
        <h2 className="mt-2 text-xl font-bold text-lab-navy sm:text-2xl">
          Tiga langkah, satu peta kemampuan
        </h2>
        <ol className="mt-5 grid gap-4 sm:grid-cols-3">
          {[
            {
              step: "01",
              title: "Daftar & pilih track",
              body: "Buat akun, set rentang usia, pilih jelajahi potensi atau langkah karir.",
            },
            {
              step: "02",
              title: "Kerjakan 9 domain",
              body: "Timer per domain. Boleh jeda antar domain — progress tersimpan.",
            },
            {
              step: "03",
              title: "Lihat profil & rencana",
              body: "Indeks, estimasi, bar domain, insight, action plan, dan unduh PDF.",
            },
          ].map((s) => (
            <li key={s.step} className="lab-card p-5">
              <span className="font-mono text-xs font-bold tabular-nums text-lab-teal">
                {s.step}
              </span>
              <h3 className="mt-2 font-semibold text-lab-navy">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Bottom CTA */}
      <section className="relative mt-12 animate-fade-up-3 overflow-hidden rounded-[1.25rem] bg-gradient-to-br from-lab-navy via-lab-navy-soft to-lab-teal p-6 text-white shadow-lift sm:p-8">
        <div
          className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-lab-sky/20 blur-2xl"
          aria-hidden
        />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold sm:text-2xl">
              Siap memetakan kemampuan Anda?
            </h2>
            <p className="mt-2 max-w-md text-sm text-white/80">
              Mulai gratis. Hasil jujur untuk refleksi — bukan label rekrutmen.
            </p>
          </div>
          {user ? (
            <Link
              href="/dashboard"
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-lab-navy shadow-soft transition hover:bg-lab-mint"
            >
              Ke dasbor
              <IconArrowRight />
            </Link>
          ) : (
            <Link
              href="/daftar"
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-lab-navy shadow-soft transition hover:bg-lab-mint"
            >
              Mulai gratis
              <IconArrowRight />
            </Link>
          )}
        </div>
      </section>

      <p className="relative mt-10 text-xs text-slate-400">
        Backend: InsForge{" "}
        {insforge.isConfigured ? "terhubung" : "belum dikonfigurasi"}.
      </p>
    </PageShell>
  );
}
