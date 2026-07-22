import Link from "next/link";
import { notFound, redirect, unstable_rethrow } from "next/navigation";
import { PageShell } from "@/components/ui/page-shell";
import { FieldPicker } from "@/components/assessment/field-picker";
import { AbandonSkillButton } from "@/components/assessment/abandon-skill-button";
import { getSessionUser } from "@/lib/auth/session";
import { createServerAssessmentPorts } from "@/lib/assessment/ports-factory";
import { loadOwnedAttempt } from "@/lib/assessment/owned-attempt";
import { getResultSnapshotForAttempt } from "@/domain/assessment";
import { recommendFields } from "@/domain/assessment/skill/field-recommendation";
import { getFieldDef } from "@/domain/assessment/skill/field-catalog";
import type { FieldId } from "@/domain/assessment/skill/types";
import type { SkillAttempt, SkillResultSnapshot } from "@/domain/assessment/skill/types";

type Props = {
  params: Promise<{ attemptId: string }>;
};

function SoftLoadError({
  nextPath,
  message,
}: {
  nextPath: string;
  message: string;
}) {
  return (
    <PageShell width="md" orbs="calm">
      <Link
        href="/dashboard"
        className="text-sm font-semibold text-lab-teal hover:underline"
      >
        ← Dasbor
      </Link>
      <div className="mt-4">
        <p className="lab-section-label">Langkah lanjutan</p>
        <h1 className="mt-1 text-2xl font-bold text-lab-navy sm:text-3xl">
          Asesmen keahlian bidang
        </h1>
        <p
          role="alert"
          className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-slate-700 ring-1 ring-amber-100"
        >
          {message}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href={nextPath} className="lab-btn-primary">
            Coba lagi
          </Link>
          <Link href="/dashboard" className="lab-btn-secondary">
            Ke dasbor
          </Link>
        </div>
      </div>
    </PageShell>
  );
}

export default async function KeahlianPickerPage({ params }: Props) {
  const { attemptId } = await params;
  const nextPath = `/asesmen/${attemptId}/keahlian`;

  const user = await getSessionUser();
  if (!user) redirect(`/masuk?next=${encodeURIComponent(nextPath)}`);

  let recommended: FieldId[] = [];
  let completedFieldIds: FieldId[] = [];
  let skillSnapshots: SkillResultSnapshot[] = [];
  let openSkill: SkillAttempt | null = null;

  try {
    const ports = createServerAssessmentPorts();

    const owned = await loadOwnedAttempt(ports, attemptId, user.id);
    if (owned.status === "unavailable") {
      return <SoftLoadError nextPath={nextPath} message={owned.message} />;
    }
    if (owned.status === "not_found") {
      notFound();
    }

    const attempt = owned.attempt;
    if (attempt.status !== "completed") {
      redirect(`/asesmen/${attemptId}`);
    }

    const snapshot = await getResultSnapshotForAttempt(ports, {
      attemptId,
      participantId: user.id,
    });
    if (!snapshot) {
      // Owned completed attempt but no snapshot, or RLS hid snapshot — not a 500.
      notFound();
    }

    recommended = recommendFields(
      snapshot.abilityProfile ?? [],
      snapshot.rulePayload,
      3,
    );

    const skillAttempts = await ports.skillAttempts.listBySourceAttempt(
      attemptId,
    );
    completedFieldIds = skillAttempts
      .filter((a) => a.status === "completed")
      .map((a) => a.fieldId) as FieldId[];

    skillSnapshots = await ports.skillSnapshots.listBySourceAttempt(attemptId);
    openSkill = await ports.skillAttempts.findOpenByParticipant(user.id);
  } catch (err) {
    unstable_rethrow(err);
    return (
      <SoftLoadError
        nextPath={nextPath}
        message="Halaman keahlian sementara tidak bisa dimuat. Coba muat ulang sebentar lagi."
      />
    );
  }

  const openForThisSource =
    openSkill && openSkill.sourceAttemptId === attemptId ? openSkill : null;
  const openOtherSource =
    openSkill && openSkill.sourceAttemptId !== attemptId ? openSkill : null;
  const openFieldLabel = openSkill
    ? (getFieldDef(openSkill.fieldId)?.label ?? openSkill.fieldId)
    : null;

  return (
    <PageShell width="md" orbs="calm">
      <Link
        href={`/asesmen/${attemptId}/hasil`}
        className="text-sm font-semibold text-lab-teal hover:underline"
      >
        ← Kembali ke hasil asesmen
      </Link>
      <div className="mt-4">
        <p className="lab-section-label">Langkah lanjutan</p>
        <h1 className="mt-1 text-2xl font-bold text-lab-navy sm:text-3xl">
          Asesmen keahlian bidang
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Pilih kategori, lalu role/bidang pekerjaan. Soal menyesuaikan dengan
          bidang yang Anda pilih. Rekomendasi disusun dari profil 9 domain Anda.
        </p>
      </div>

      {openForThisSource ? (
        <section className="mt-6 rounded-[1.25rem] border border-lab-teal/25 bg-gradient-to-br from-lab-mint/50 to-white p-4 sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-lab-teal-deep">
            Sesi keahlian berjalan
          </p>
          <p className="mt-1 text-sm font-semibold text-lab-navy">
            {openFieldLabel}
          </p>
          <p className="mt-1 text-xs text-slate-600">
            Anda punya satu sesi keahlian terbuka. Lanjutkan, atau batalkan
            untuk memilih bidang lain.
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            <Link
              href={`/asesmen/${attemptId}/keahlian/${openForThisSource.fieldId}/sesi?sid=${openForThisSource.id}`}
              className="lab-btn-primary"
            >
              Lanjutkan sesi
            </Link>
            <AbandonSkillButton
              skillAttemptId={openForThisSource.id}
              sourceAttemptId={attemptId}
            />
          </div>
        </section>
      ) : null}

      {openOtherSource ? (
        <section className="mt-6 rounded-[1.25rem] border border-amber-200 bg-amber-50 p-4 sm:p-5">
          <p className="text-sm font-semibold text-lab-navy">
            Ada sesi keahlian di hasil asesmen lain
          </p>
          <p className="mt-1 text-xs text-slate-600">
            Bidang <strong>{openFieldLabel}</strong> masih terbuka pada attempt
            lain. Selesaikan atau batalkan dulu sebelum memulai di sini.
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            <Link
              href={`/asesmen/${openOtherSource.sourceAttemptId}/keahlian/${openOtherSource.fieldId}/sesi?sid=${openOtherSource.id}`}
              className="lab-btn-primary"
            >
              Lanjutkan di attempt itu
            </Link>
            <AbandonSkillButton
              skillAttemptId={openOtherSource.id}
              sourceAttemptId={openOtherSource.sourceAttemptId}
            />
          </div>
        </section>
      ) : null}

      {skillSnapshots.length > 0 ? (
        <section className="mt-6 lab-card p-4">
          <h2 className="text-sm font-bold text-lab-navy">
            Hasil keahlian sebelumnya
          </h2>
          <ul className="mt-2 space-y-2 text-sm">
            {skillSnapshots.map((s) => (
              <li key={s.id} className="flex flex-wrap justify-between gap-2">
                <Link
                  href={`/asesmen/${attemptId}/keahlian/${s.fieldId}/hasil`}
                  className="font-medium text-lab-teal hover:underline"
                >
                  {s.fieldLabel}
                </Link>
                <span className="font-mono tabular-nums text-slate-600">
                  {s.score}/100
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="mt-8">
        {openSkill ? (
          <p className="mb-4 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600 ring-1 ring-slate-100">
            Pemilihan bidang baru dinonaktifkan sampai sesi keahlian terbuka
            diselesaikan atau dibatalkan.
          </p>
        ) : null}
        {!openSkill ? (
          <FieldPicker
            sourceAttemptId={attemptId}
            recommendedFieldIds={recommended}
            completedFieldIds={completedFieldIds}
          />
        ) : null}
      </div>
    </PageShell>
  );
}
