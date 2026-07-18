import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ResultReport } from "@/components/assessment/result-report";
import { MeshOrbs } from "@/components/ui/mesh-orbs";
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

  return (
    <>
      <SiteHeader />
      <main
        id="main-content"
        className="relative mx-auto w-full max-w-2xl flex-1 overflow-hidden px-4 py-10 sm:px-6 sm:py-12"
      >
        <MeshOrbs calm />
        <div className="relative">
          <Link
            href="/dashboard"
            className="text-sm font-semibold text-lab-teal hover:underline"
          >
            ← Dasbor
          </Link>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
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
              className="lab-btn-primary w-full shrink-0 sm:w-auto"
            >
              Unduh PDF
            </a>
          </div>
          <div className="mt-8">
            <ResultReport report={report} />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
