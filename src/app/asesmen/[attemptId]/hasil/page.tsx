import Link from "next/link";
import { notFound, redirect, unstable_rethrow } from "next/navigation";
import { PageShell } from "@/components/ui/page-shell";
import { ResultReport } from "@/components/assessment/result-report";
import { SkillSummaryOnHasil } from "@/components/assessment/skill-summary-on-hasil";
import { getSessionUser } from "@/lib/auth/session";
import { createServerAssessmentPorts } from "@/lib/assessment/ports-factory";
import { loadOwnedAttempt } from "@/lib/assessment/owned-attempt";
import {
  getResultSnapshotForAttempt,
  toPublicResultReport,
} from "@/domain/assessment";
import type { SkillResultSnapshot } from "@/domain/assessment/skill/types";
import type { ResultSnapshot } from "@/domain/assessment/result-types";

type Props = {
  params: Promise<{ attemptId: string }>;
};

export default async function ResultPage({ params }: Props) {
  const { attemptId } = await params;
  const nextPath = `/asesmen/${attemptId}/hasil`;

  const user = await getSessionUser();
  if (!user) redirect(`/masuk?next=${encodeURIComponent(nextPath)}`);

  let report: ReturnType<typeof toPublicResultReport> | null = null;
  let skillSnapshots: SkillResultSnapshot[] = [];
  let loadError: string | null = null;

  try {
    const ports = createServerAssessmentPorts();
    const owned = await loadOwnedAttempt(ports, attemptId, user.id);
    if (owned.status === "unavailable") {
      loadError = owned.message;
    } else if (owned.status === "not_found") {
      notFound();
    } else {
      if (owned.attempt.status !== "completed") {
        redirect(`/asesmen/${attemptId}`);
      }

      const snapshot: ResultSnapshot | null =
        await getResultSnapshotForAttempt(ports, {
          attemptId,
          participantId: user.id,
        });
      if (!snapshot) {
        notFound();
      }

      report = toPublicResultReport(snapshot);
      skillSnapshots =
        await ports.skillSnapshots.listBySourceAttempt(attemptId);
    }
  } catch (err) {
    unstable_rethrow(err);
    loadError =
      "Hasil asesmen sementara tidak bisa dimuat. Coba muat ulang sebentar lagi.";
  }

  if (loadError || !report) {
    return (
      <PageShell width="md" orbs="calm">
        <Link
          href="/dashboard"
          className="text-sm font-semibold text-lab-teal hover:underline"
        >
          ← Dasbor
        </Link>
        <div className="mt-4">
          <h1 className="text-2xl font-bold text-lab-navy">Hasil asesmen</h1>
          <p
            role="alert"
            className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-slate-700 ring-1 ring-amber-100"
          >
            {loadError ??
              "Hasil tidak tersedia. Pastikan Anda masuk dengan akun pemilik asesmen."}
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

      <SkillSummaryOnHasil attemptId={attemptId} snapshots={skillSnapshots} />

      <div className="mt-8">
        <ResultReport report={report} />
      </div>
    </PageShell>
  );
}
