import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MeshOrbs } from "@/components/ui/mesh-orbs";
import { IconArrowRight, IconSparkle } from "@/components/ui/icons";
import { getSessionUser } from "@/lib/auth/session";
import { signOutAction } from "@/app/actions/auth";
import { DeleteAccountButton } from "@/components/account/delete-account-button";
import { createServerAssessmentPorts } from "@/lib/assessment/ports-factory";
import {
  getOpenAttempt,
  getRetakeCooldownUntil,
} from "@/domain/assessment";

export default async function DashboardPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/masuk?next=/dashboard");
  }
  if (!user.ageBand) {
    redirect("/onboarding/usia");
  }

  const ports = createServerAssessmentPorts();
  const openAttempt = await getOpenAttempt(ports, user.id);
  const completedAttempts =
    await ports.attempts.listCompletedByParticipant(user.id);
  const cooldownUntil = getRetakeCooldownUntil(
    completedAttempts,
    new Date(),
  );

  return (
    <>
      <SiteHeader />
      <main
        id="main-content"
        className="relative mx-auto w-full max-w-3xl flex-1 overflow-hidden px-4 py-10 sm:px-6 sm:py-12"
      >
        <MeshOrbs />
        <div className="relative animate-fade-up">
          <p className="lab-section-label">Ruang Anda</p>
          <h1 className="mt-2 text-2xl font-bold text-lab-navy sm:text-3xl">
            Dasbor
          </h1>
          <p className="mt-2 text-slate-600">
            Halo{user.name ? `, ${user.name}` : ""}
            {user.email ? (
              <>
                {" "}
                <span className="text-slate-400">({user.email})</span>
              </>
            ) : null}
          </p>

          <div className="lab-card mt-8 space-y-5 p-5 sm:p-6">
            <dl className="grid gap-4 text-sm sm:grid-cols-2">
              <div className="rounded-xl bg-lab-mist/80 px-4 py-3">
                <dt className="text-slate-500">Rentang usia</dt>
                <dd className="mt-1 font-semibold text-lab-navy">
                  {user.ageBand === "18_45"
                    ? "18–45 tahun"
                    : user.ageBand === "46_plus"
                      ? "46+ tahun"
                      : user.ageBand}
                </dd>
              </div>
              <div className="rounded-xl bg-lab-mint/40 px-4 py-3">
                <dt className="text-slate-500">Status asesmen</dt>
                <dd className="mt-1 font-semibold text-lab-navy">
                  {openAttempt
                    ? "Ada Attempt berjalan"
                    : "Belum ada Open Attempt"}
                </dd>
              </div>
            </dl>

            {user.ageBand === "46_plus" ? (
              <p className="rounded-xl bg-orange-50 px-4 py-3 text-sm text-slate-700 ring-1 ring-orange-100">
                Anda mendaftar dengan disclaimer 46+: norma &amp; saran karir
                fase awal dioptimalkan untuk 18–45.
              </p>
            ) : null}

            {openAttempt ? (
              <div className="rounded-2xl border border-lab-teal/25 bg-gradient-to-br from-lab-mint/50 to-white p-4 sm:p-5">
                <span className="lab-badge bg-white text-lab-teal-deep ring-1 ring-lab-teal/20">
                  <IconSparkle className="h-3.5 w-3.5" />
                  Sedang berjalan
                </span>
                <p className="mt-3 text-sm font-semibold text-lab-navy">
                  Track{" "}
                  {openAttempt.track === "explore"
                    ? "Jelajahi potensi"
                    : "Rancang langkah karir"}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Dimulai {openAttempt.startedAt.toLocaleString("id-ID")} ·{" "}
                  {openAttempt.contentVersionId}
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Progress domain tersimpan. Lanjutkan kapan saja — jeda antar
                  domain diizinkan.
                </p>
                <Link
                  href={`/asesmen/${openAttempt.id}`}
                  className="lab-btn-primary mt-4 w-full sm:w-auto"
                >
                  Lanjutkan asesmen
                  <IconArrowRight />
                </Link>
              </div>
            ) : cooldownUntil ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:p-5">
                <p className="text-sm font-semibold text-lab-navy">
                  Jeda retake 90 hari aktif
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Attempt baru setelah{" "}
                  <strong>
                    {cooldownUntil.toLocaleString("id-ID", {
                      dateStyle: "long",
                      timeStyle: "short",
                    })}
                  </strong>
                  . Hasil sebelumnya tetap bisa dilihat di bawah.
                </p>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-lab-teal/30 bg-white/60 p-4 sm:p-5">
                <p className="text-sm text-slate-600">
                  Siap memulai asesmen 9 domain? Pilih Track dulu — item sama,
                  framing insight berbeda.
                </p>
                <Link
                  href="/asesmen/mulai"
                  className="lab-btn-primary mt-4 w-full sm:w-auto"
                >
                  Mulai asesmen
                  <IconArrowRight />
                </Link>
              </div>
            )}

            {completedAttempts.length > 0 ? (
              <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 sm:p-5">
                <p className="text-sm font-semibold text-lab-navy">
                  Hasil selesai
                </p>
                <ul className="mt-3 space-y-3">
                  {completedAttempts.map((a) => (
                    <li
                      key={a.id}
                      className="flex flex-col gap-2 rounded-xl bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                    >
                      <span className="text-sm text-slate-600">
                        {a.track === "explore" ? "Jelajahi potensi" : "Karir"}
                        {a.isPrimary ? " · utama" : ""}
                        {a.completedAt
                          ? ` · ${a.completedAt.toLocaleDateString("id-ID")}`
                          : ""}
                      </span>
                      <span className="flex gap-2">
                        <Link
                          href={`/asesmen/${a.id}/hasil`}
                          className="lab-btn-secondary !min-h-9 flex-1 !px-3 !py-1.5 text-xs sm:flex-none"
                        >
                          Lihat
                        </Link>
                        <a
                          href={`/api/asesmen/${a.id}/pdf`}
                          className="lab-btn-ghost !min-h-9 flex-1 border border-slate-200 text-xs sm:flex-none"
                        >
                          PDF
                        </a>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="flex w-full flex-col gap-2 pt-1 sm:flex-row sm:flex-wrap">
              <Link href="/" className="lab-btn-secondary w-full sm:w-auto">
                Beranda
              </Link>
              <form action={signOutAction} className="w-full sm:w-auto">
                <button type="submit" className="lab-btn-ghost w-full border border-slate-200 sm:w-auto">
                  Keluar
                </button>
              </form>
            </div>

            <div className="border-t border-slate-100 pt-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Privasi &amp; kebijakan
              </p>
              <p className="mb-3 text-xs text-slate-500">
                <Link href="/privasi" className="font-medium text-lab-teal hover:underline">
                  Kebijakan Privasi
                </Link>
                {" · "}
                <Link href="/syarat" className="font-medium text-lab-teal hover:underline">
                  Syarat Penggunaan
                </Link>
              </p>
              <DeleteAccountButton />
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
