import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { PageShell } from "@/components/ui/page-shell";
import { FieldPicker } from "@/components/assessment/field-picker";
import { getSessionUser } from "@/lib/auth/session";
import { createServerAssessmentPorts } from "@/lib/assessment/ports-factory";
import { getResultSnapshotForAttempt } from "@/domain/assessment";
import { recommendFields } from "@/domain/assessment/skill/field-recommendation";
import type { FieldId } from "@/domain/assessment/skill/types";

type Props = {
  params: Promise<{ attemptId: string }>;
};

export default async function KeahlianPickerPage({ params }: Props) {
  const user = await getSessionUser();
  if (!user) redirect("/masuk");

  const { attemptId } = await params;
  const ports = createServerAssessmentPorts();
  const attempt = await ports.attempts.findById(attemptId);
  if (!attempt || attempt.participantId !== user.id) notFound();
  if (attempt.status !== "completed") {
    redirect(`/asesmen/${attemptId}`);
  }

  const snapshot = await getResultSnapshotForAttempt(ports, {
    attemptId,
    participantId: user.id,
  });
  if (!snapshot) notFound();

  const recommended = recommendFields(
    snapshot.abilityProfile,
    snapshot.rulePayload,
    3,
  );

  const skillAttempts = await ports.skillAttempts.listBySourceAttempt(attemptId);
  const completedFieldIds = skillAttempts
    .filter((a) => a.status === "completed")
    .map((a) => a.fieldId) as FieldId[];

  const skillSnapshots = await ports.skillSnapshots.listBySourceAttempt(attemptId);

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

      {skillSnapshots.length > 0 ? (
        <section className="mt-6 lab-card p-4">
          <h2 className="text-sm font-bold text-lab-navy">Hasil keahlian sebelumnya</h2>
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
        <FieldPicker
          sourceAttemptId={attemptId}
          recommendedFieldIds={recommended}
          completedFieldIds={completedFieldIds}
        />
      </div>
    </PageShell>
  );
}
