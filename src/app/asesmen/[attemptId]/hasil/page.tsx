import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { PageShell } from "@/components/ui/page-shell";
import { ResultReport } from "@/components/assessment/result-report";
import { SkillSummaryOnHasil } from "@/components/assessment/skill-summary-on-hasil";
import { getSessionUser } from "@/lib/auth/session";
import { createServerAssessmentPorts } from "@/lib/assessment/ports-factory";
import {
  getResultSnapshotForAttempt,
  toPublicResultReport,
} from "@/domain/assessment";

type Props = {
  params: Promise<{ attemptId: string }>;
};

export default async function ResultPage({ params }: Props) {
  const user = await getSessionUser();
  if (!user) redirect("/masuk");

  const { attemptId } = await params;
  const ports = createServerAssessmentPorts();
  const attempt = await ports.attempts.findById(attemptId);
  if (!attempt || attempt.participantId !== user.id) {
    notFound();
  }

  if (attempt.status !== "completed") {
    redirect(`/asesmen/${attemptId}`);
  }

  const snapshot = await getResultSnapshotForAttempt(ports, {
    attemptId,
    participantId: user.id,
  });
  if (!snapshot) {
    notFound();
  }

  const report = toPublicResultReport(snapshot);
  const skillSnapshots =
    await ports.skillSnapshots.listBySourceAttempt(attemptId);

  return (
    <PageShell width="md" orbs="calm">
      <Link
        href="/dashboard"
        className="text-sm font-semibold text-lab-teal hover:underline"
      >
        ← Dasbor
      </Link>
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="lab-section-label">Profil Anda</p>
          <h1 className="mt-1 text-2xl font-bold text-lab-navy sm:text-3xl">
            Hasil asesmen
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Laporan dari Result Snapshot (tidak dihitung ulang saat dibuka).
          </p>
        </div>
        <a
          href={`/api/asesmen/${attemptId}/pdf`}
          className="lab-btn-primary lab-btn-block shrink-0"
        >
          Unduh PDF
        </a>
      </div>

      <SkillSummaryOnHasil
        attemptId={attemptId}
        snapshots={skillSnapshots}
      />

      <div className="mt-8">
        <ResultReport report={report} />
      </div>
    </PageShell>
  );
}
