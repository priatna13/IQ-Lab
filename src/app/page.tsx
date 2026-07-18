import Link from "next/link";
import { PageShell } from "@/components/ui/page-shell";
import { BrandLogo } from "@/components/ui/brand-logo";
import {
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
      {/* Hero — stack on mobile, 2-col from lg (DESIGN.md §6) */}
      <section className="animate-fade-up grid items-center gap-8 md:gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="min-w-0 space-y-5 sm:space-y-6">
          <span className="lab-badge max-w-full bg-white/90 text-lab-teal-deep shadow-soft ring-1 ring-lab-teal/20">
            <IconSparkle className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">Pengembangan diri · multi-domain</span>
          </span>
          <h1 className="max-w-2xl text-3xl font-bold leading-[1.15] tracking-tight text-lab-navy sm:text-4xl md:text-5xl">
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
          <div className="lab-actions">
            {user ? (
              <Link href="/dashboard" className="btn fx-59">
                <span className="btn-label">Buka dasbor</span>
              </Link>
            ) : (
              <>
                <Link href="/daftar" className="btn fx-59">
                  <span className="btn-label">Mulai gratis</span>
                </Link>
                <Link href="/masuk" className="btn fx-59 fx-59--alt">
                  <span className="btn-label">Sudah punya akun</span>
                </Link>
              </>
            )}
          </div>
          <p className="text-xs leading-relaxed text-slate-500">
            Gratis di fase MVP · ~60–90 menit · jeda antar domain diizinkan
          </p>
        </div>

        {/* Hero visual — below copy on mobile */}
        <div className="relative mx-auto w-full max-w-sm animate-fade-up-1 min-w-0 lg:max-w-none">
          <div className="lab-card relative overflow-hidden p-5 sm:p-7">
            <div
              className="absolute inset-0 bg-gradient-to-br from-lab-mint/50 via-white to-lab-mist/80"
              aria-hidden
            />
            <div className="relative flex flex-col items-center text-center">
              <BrandLogo size="hero" href={null} withWordmark={false} priority />
              <p className="mt-3 text-sm font-semibold text-lab-navy sm:mt-4">
                9 domain · 1 profil jujur
              </p>
              <p className="mt-1 px-1 text-xs text-slate-500">
                Bukan satu angka absolut — peta kemampuan Anda
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-1.5 sm:mt-5">
                {DOMAINS.map((d, i) => (
                  <span
                    key={d}
                    className={`lab-badge ring-1 ${DOMAIN_TINTS[i % DOMAIN_TINTS.length]}`}
                  >
                    {d}
                  </span>
                ))}
              </div>
              <div className="mt-5 grid w-full grid-cols-2 gap-2 sm:mt-6 sm:gap-3 text-left">
                <div className="rounded-xl bg-white/90 p-2.5 shadow-sm ring-1 ring-white sm:p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                    Indeks
                  </p>
                  <p className="font-mono text-xl font-bold tabular-nums text-lab-navy sm:text-2xl">
                    ··
                  </p>
                </div>
                <div className="rounded-xl bg-white/90 p-2.5 shadow-sm ring-1 ring-white sm:p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                    Estimasi IQ
                  </p>
                  <p className="font-mono text-xl font-bold tabular-nums text-lab-teal sm:text-2xl">
                    ··
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Honesty */}
      <section className="relative mt-10 animate-fade-up-1 lab-card p-4 sm:mt-12 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-lab-warm">
            <IconShield className="h-4 w-4" />
          </span>
          <div className="min-w-0">
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
              <Link
                href="/faq"
                className="inline-flex min-h-11 items-center text-lab-teal hover:underline"
              >
                FAQ &amp; metodologi
              </Link>
              <Link
                href="/privasi"
                className="inline-flex min-h-11 items-center text-lab-teal hover:underline"
              >
                Privasi
              </Link>
              <Link
                href="/syarat"
                className="inline-flex min-h-11 items-center text-lab-teal hover:underline"
              >
                Syarat
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Feature bento — Lift (fx-9) cards */}
      <section className="relative mt-8">
        <p className="lab-section-label">Kenapa IQ-Lab</p>
        <h2 className="mt-2 text-xl font-bold text-lab-navy sm:text-2xl">
          Profil utuh, insight yang bisa ditindaklanjuti
        </h2>
        <div className="lab-lift-grid mt-5">
          {[
            {
              title: "9 domain",
              body: "Profil verbal, numerik, spasial, memori, logika, dan area terkait — bukan satu angka saja.",
              icon: IconGrid,
            },
            {
              title: "Dua jalur",
              body: "Jelajahi potensi atau rancang langkah karir — item sama, framing insight berbeda.",
              icon: IconPath,
            },
            {
              title: "Gratis (MVP)",
              body: "Laporan web & PDF tanpa paywall di fase validasi produk.",
              icon: IconGift,
            },
          ].map((card) => (
            <button key={card.title} type="button" className="btn fx-9 lab-lift-card">
              <span className="lab-lift-card-icon" aria-hidden>
                <card.icon className="h-5 w-5" />
              </span>
              <span className="btn-label">{card.title}</span>
              <span className="lab-lift-card-desc">{card.body}</span>
            </button>
          ))}
        </div>
      </section>

      {/* How it works — Lift (fx-9) cards */}
      <section className="relative mt-10 sm:mt-12">
        <p className="lab-section-label">Alur singkat</p>
        <h2 className="mt-2 text-xl font-bold text-lab-navy sm:text-2xl">
          Tiga langkah, satu peta kemampuan
        </h2>
        <div className="lab-lift-grid mt-5">
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
            <button key={s.step} type="button" className="btn fx-9 lab-lift-card">
              <span className="lab-lift-card-step" aria-hidden>
                {s.step}
              </span>
              <span className="btn-label">{s.title}</span>
              <span className="lab-lift-card-desc">{s.body}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="lab-bottom-cta relative mt-10 overflow-hidden rounded-[1.25rem] bg-gradient-to-br from-lab-navy via-lab-navy-soft to-lab-teal p-5 text-white shadow-lift sm:mt-12 sm:p-8">
        <div
          className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-lab-sky/20 blur-2xl"
          aria-hidden
        />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h2 className="text-xl font-bold leading-snug sm:text-2xl">
              Siap memetakan kemampuan Anda?
            </h2>
            <p className="mt-2 max-w-md text-sm text-white/80">
              Mulai gratis. Hasil jujur untuk refleksi — bukan label rekrutmen.
            </p>
          </div>
          {user ? (
            <Link
              href="/dashboard"
              className="btn fx-59 shrink-0"
              style={
                {
                  "--primary": "#ffffff",
                  "--secondary": "#0f191e",
                } as React.CSSProperties
              }
            >
              <span className="btn-label">Ke dasbor</span>
            </Link>
          ) : (
            <Link href="/daftar" className="btn fx-59 shrink-0">
              <span className="btn-label">Mulai gratis</span>
            </Link>
          )}
        </div>
      </section>

      <p className="relative mt-8 text-xs text-slate-400 sm:mt-10">
        Backend: InsForge{" "}
        {insforge.isConfigured ? "terhubung" : "belum dikonfigurasi"}.
      </p>
    </PageShell>
  );
}
