import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
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
      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-2xl font-semibold text-lab-navy">Dasbor</h1>
        <p className="mt-2 text-slate-600">
          Halo{user.name ? `, ${user.name}` : ""}
          {user.email ? (
            <>
              {" "}
              <span className="text-slate-400">({user.email})</span>
            </>
          ) : null}
        </p>

        <div className="mt-8 space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-slate-500">Rentang usia</dt>
              <dd className="font-medium text-lab-navy">
                {user.ageBand === "18_45"
                  ? "18–45 tahun"
                  : user.ageBand === "46_plus"
                    ? "46+ tahun"
                    : user.ageBand}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Status asesmen</dt>
              <dd className="font-medium text-lab-navy">
                {openAttempt
                  ? "Ada Attempt berjalan"
                  : "Belum ada Open Attempt"}
              </dd>
            </div>
          </dl>

          {user.ageBand === "46_plus" ? (
            <p className="rounded-lg bg-orange-50 px-3 py-2 text-sm text-slate-700">
              Anda mendaftar dengan disclaimer 46+: norma & saran karir fase
              awal dioptimalkan untuk 18–45.
            </p>
          ) : null}

          {openAttempt ? (
            <div className="rounded-lg border border-lab-teal/30 bg-teal-50/50 p-4">
              <p className="text-sm font-medium text-lab-navy">
                Attempt{" "}
                {openAttempt.track === "explore"
                  ? "Jelajahi potensi"
                  : "Rancang langkah karir"}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Dimulai {openAttempt.startedAt.toLocaleString("id-ID")} · versi{" "}
                {openAttempt.contentVersionId}
              </p>
              <p className="mt-2 text-xs text-slate-600">
                Progress domain tersimpan. Lanjutkan kapan saja — jeda antar
                domain diizinkan.
              </p>
              <Link
                href={`/asesmen/${openAttempt.id}`}
                className="mt-3 inline-flex rounded-lg bg-lab-teal px-4 py-2 text-sm font-semibold text-white"
              >
                Lanjutkan asesmen
              </Link>
            </div>
          ) : cooldownUntil ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-medium text-lab-navy">
                Jeda retake 90 hari aktif
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Anda dapat memulai Attempt baru setelah{" "}
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
            <div className="rounded-lg border border-dashed border-slate-300 p-4">
              <p className="text-sm text-slate-600">
                Siap memulai asesmen 9 domain? Pilih Track dulu — item sama,
                framing insight berbeda.
              </p>
              <Link
                href="/asesmen/mulai"
                className="mt-3 inline-flex rounded-lg bg-lab-teal px-4 py-2 text-sm font-semibold text-white"
              >
                Mulai asesmen
              </Link>
            </div>
          )}

          {completedAttempts.length > 0 ? (
            <div className="rounded-lg border border-slate-200 p-4">
              <p className="text-sm font-medium text-lab-navy">Hasil selesai</p>
              <ul className="mt-2 space-y-2 text-sm">
                {completedAttempts.map((a) => (
                  <li key={a.id} className="flex justify-between gap-2">
                    <span className="text-slate-600">
                      {a.track === "explore" ? "Jelajahi potensi" : "Karir"}
                      {a.isPrimary ? " · utama" : ""}
                      {a.completedAt
                        ? ` · ${a.completedAt.toLocaleDateString("id-ID")}`
                        : ""}
                    </span>
                    <span className="flex gap-3">
                      <Link
                        href={`/asesmen/${a.id}/hasil`}
                        className="font-semibold text-lab-teal hover:underline"
                      >
                        Lihat
                      </Link>
                      <a
                        href={`/api/asesmen/${a.id}/pdf`}
                        className="font-semibold text-lab-navy hover:underline"
                      >
                        PDF
                      </a>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/"
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-lab-navy"
            >
              Beranda
            </Link>
            <form action={signOutAction}>
              <button
                type="submit"
                className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white"
              >
                Keluar
              </button>
            </form>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Privasi & kebijakan
            </p>
            <p className="mb-3 text-xs text-slate-500">
              <Link href="/privasi" className="text-lab-teal hover:underline">
                Kebijakan Privasi
              </Link>
              {" · "}
              <Link href="/syarat" className="text-lab-teal hover:underline">
                Syarat Penggunaan
              </Link>
            </p>
            <DeleteAccountButton />
          </div>
        </div>
      </main>
    </>
  );
}
