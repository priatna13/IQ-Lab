import Link from "next/link";
import { redirect } from "next/navigation";
import { PageShell } from "@/components/ui/page-shell";
import { IconArrowRight, IconSparkle } from "@/components/ui/icons";
import { getSessionUser } from "@/lib/auth/session";
import { signOutAction } from "@/app/actions/auth";
import { DeleteAccountButton } from "@/components/account/delete-account-button";
import { AbandonSkillButton } from "@/components/assessment/abandon-skill-button";
import { createServerAssessmentPorts } from "@/lib/assessment/ports-factory";
import {
  getOpenAttempt,
  getRetakeCooldownUntil,
} from "@/domain/assessment";
import { getFieldDef } from "@/domain/assessment/skill/field-catalog";

export default async function DashboardPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/masuk?next=/dashboard");
  }
  if (!user.ageBand) {
    redirect("/onboarding/usia");
  }

  let openAttempt: Awaited<ReturnType<typeof getOpenAttempt>> = null;
  let completedAttempts: Awaited<
    ReturnType<
      ReturnType<typeof createServerAssessmentPorts>["attempts"]["listCompletedByParticipant"]
    >
  > = [];
  let cooldownUntil: Date | null = null;
  const skillBySource = new Map<string, number>();
  let openSkill: Awaited<
    ReturnType<
      ReturnType<typeof createServerAssessmentPorts>["skillAttempts"]["listByParticipant"]
    >
  >[number] | null = null;
  let dataError: string | null = null;

  try {
    const ports = createServerAssessmentPorts();
    openAttempt = await getOpenAttempt(ports, user.id);
    completedAttempts = await ports.attempts.listCompletedByParticipant(
      user.id,
    );
    cooldownUntil = getRetakeCooldownUntil(completedAttempts, new Date());
    const allSkillAttempts = await ports.skillAttempts.listByParticipant(
      user.id,
    );
    for (const sa of allSkillAttempts) {
      if (sa.status !== "completed") continue;
      skillBySource.set(
        sa.sourceAttemptId,
        (skillBySource.get(sa.sourceAttemptId) ?? 0) + 1,
      );
    }
    openSkill =
      allSkillAttempts.find((s) => s.status === "in_progress") ?? null;
  } catch {
    dataError =
      "Data asesmen sementara tidak bisa dimuat (backend sibuk). Coba muat ulang sebentar lagi.";
  }

  const openSkillLabel = openSkill
    ? (getFieldDef(openSkill.fieldId)?.label ?? openSkill.fieldId)
    : null;

  return (
    <PageShell width="lg" orbs="full">
      <div className="animate-fade-up">
        <p className="lab-section-label">Ruang Anda</p>
        <h1 className="mt-2 text-2xl font-bold text-lab-navy sm:text-3xl">
          Dasbor
        </h1>
        <p className="mt-2 break-words text-slate-600">
          Halo{user.name ? `, ${user.name}` : ""}
          {user.email ? (
            <>
              {" "}
              <span className="block text-slate-400 sm:inline">
                ({user.email})
              </span>
            </>
          ) : null}
        </p>

        <div className="lab-card mt-6 space-y-5 p-4 sm:mt-8 sm:p-6">
          {dataError ? (
            <p
              role="alert"
              className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-slate-700 ring-1 ring-amber-100"
            >
              {dataError}
            </p>
          ) : null}

          <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2 sm:gap-4">
            <div className="rounded-xl bg-lab-mist/80 px-4 py-3 ring-1 ring-white">
              <dt className="text-slate-500">Rentang usia</dt>
              <dd className="mt-1 font-semibold text-lab-navy">
                {user.ageBand === "18_45"
                  ? "18–45 tahun"
                  : user.ageBand === "46_plus"
                    ? "46+ tahun"
                    : user.ageBand}
              </dd>
            </div>
            <div className="rounded-xl bg-lab-mint/40 px-4 py-3 ring-1 ring-lab-teal/10">
              <dt className="text-slate-500">Status asesmen</dt>
              <dd className="mt-1 font-semibold text-lab-navy">
                {dataError
                  ? "Tidak tersedia"
                  : openAttempt
                    ? "Ada Attempt berjalan"
                    : openSkill
                      ? "Keahlian berjalan"
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

          {openSkill ? (
            <div className="rounded-[1.25rem] border border-lab-violet/30 bg-gradient-to-br from-lab-mist/80 to-white p-4 sm:p-5">
              <span className="lab-badge bg-white text-lab-navy ring-1 ring-lab-violet/25">
                <IconSparkle className="h-3.5 w-3.5" />
                Keahlian berjalan
              </span>
              <p className="mt-3 text-sm font-semibold text-lab-navy">
                {openSkillLabel}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Dimulai {openSkill.startedAt.toLocaleString("id-ID")} · berakhir{" "}
                {openSkill.endsAt.toLocaleString("id-ID")}
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Selesaikan sesi keahlian ini, atau batalkan untuk memilih bidang
                lain. Maksimal satu sesi keahlian terbuka.
              </p>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                <Link
                  href={`/asesmen/${openSkill.sourceAttemptId}/keahlian/${openSkill.fieldId}/sesi?sid=${openSkill.id}`}
                  className="lab-btn-primary"
                >
                  Lanjutkan keahlian
                  <IconArrowRight />
                </Link>
                <Link
                  href={`/asesmen/${openSkill.sourceAttemptId}/keahlian`}
                  className="lab-btn-secondary"
                >
                  Daftar bidang
                </Link>
                <AbandonSkillButton
                  skillAttemptId={openSkill.id}
                  sourceAttemptId={openSkill.sourceAttemptId}
                />
              </div>
            </div>
          ) : null}

          {openAttempt ? (
            <div className="rounded-[1.25rem] border border-lab-teal/25 bg-gradient-to-br from-lab-mint/50 to-white p-4 sm:p-5">
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
                className="lab-btn-primary lab-btn-block mt-4"
              >
                Lanjutkan asesmen
                <IconArrowRight />
              </Link>
            </div>
          ) : cooldownUntil ? (
            <div className="rounded-[1.25rem] border border-amber-200 bg-amber-50 p-4 sm:p-5">
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
            <div className="rounded-[1.25rem] border border-dashed border-lab-teal/35 bg-gradient-to-br from-white to-lab-mist/60 p-4 sm:p-5">
              <p className="text-sm font-semibold text-lab-navy">
                Siap memulai?
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Pilih Track dulu — item asesmen sama, framing insight berbeda.
              </p>
              <Link
                href="/asesmen/mulai"
                className="lab-btn-primary lab-btn-block mt-4"
              >
                Mulai asesmen
                <IconArrowRight />
              </Link>
            </div>
          )}

          {completedAttempts.length > 0 ? (
            <div className="rounded-[1.25rem] border border-slate-100 bg-slate-50/80 p-4 sm:p-5">
              <p className="text-sm font-semibold text-lab-navy">
                Hasil selesai
              </p>
              <ul className="mt-3 space-y-3">
                {completedAttempts.map((a) => {
                  const skillCount = skillBySource.get(a.id) ?? 0;
                  const skillOpenHere =
                    openSkill?.sourceAttemptId === a.id ? openSkill : null;
                  return (
                    <li
                      key={a.id}
                      className="flex flex-col gap-2 rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-100 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <span className="min-w-0 text-sm text-slate-600">
                        {a.track === "explore" ? "Jelajahi potensi" : "Karir"}
                        {a.isPrimary ? " · utama" : ""}
                        {a.completedAt
                          ? ` · ${a.completedAt.toLocaleDateString("id-ID")}`
                          : ""}
                        {skillOpenHere ? (
                          <span className="mt-0.5 block text-xs font-medium text-lab-navy">
                            Keahlian berjalan:{" "}
                            {getFieldDef(skillOpenHere.fieldId)?.label ??
                              skillOpenHere.fieldId}
                          </span>
                        ) : skillCount > 0 ? (
                          <span className="mt-0.5 block text-xs text-lab-teal">
                            {skillCount} bidang keahlian selesai
                          </span>
                        ) : null}
                      </span>
                      <span className="grid grid-cols-2 gap-2 sm:flex sm:shrink-0 sm:flex-wrap">
                        <Link
                          href={`/asesmen/${a.id}/hasil`}
                          className="lab-btn-secondary min-h-11 px-3 text-xs sm:text-sm"
                        >
                          Lihat profil
                        </Link>
                        <Link
                          href={
                            skillOpenHere
                              ? `/asesmen/${a.id}/keahlian/${skillOpenHere.fieldId}/sesi?sid=${skillOpenHere.id}`
                              : `/asesmen/${a.id}/keahlian`
                          }
                          className="lab-btn-primary min-h-11 px-3 text-xs sm:text-sm"
                        >
                          {skillOpenHere ? "Lanjut keahlian" : "Keahlian"}
                        </Link>
                        <a
                          href={`/api/asesmen/${a.id}/pdf`}
                          className="lab-btn-ghost col-span-2 min-h-11 border border-slate-200 px-3 text-xs sm:col-span-1 sm:text-sm"
                        >
                          PDF
                        </a>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}

          <div className="lab-actions pt-1">
            <Link href="/" className="lab-btn-secondary lab-btn-block">
              Beranda
            </Link>
            <form action={signOutAction} className="w-full sm:w-auto">
              <button
                type="submit"
                className="lab-btn-ghost w-full border border-slate-200 sm:w-auto"
              >
                Keluar
              </button>
            </form>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Privasi &amp; kebijakan
            </p>
            <p className="mb-3 text-xs text-slate-500">
              <Link
                href="/privasi"
                className="font-medium text-lab-teal hover:underline"
              >
                Kebijakan Privasi
              </Link>
              {" · "}
              <Link
                href="/syarat"
                className="font-medium text-lab-teal hover:underline"
              >
                Syarat Penggunaan
              </Link>
            </p>
            <DeleteAccountButton />
          </div>
        </div>
      </div>
    </PageShell>
  );
}
