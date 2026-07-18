import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { ResultReport } from "@/components/assessment/result-report";
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
      <main id="main-content" className="mx-auto max-w-2xl px-6 py-12">
        <Link
          href="/dashboard"
          className="text-sm font-medium text-lab-teal hover:underline"
        >
          ← Dasbor
        </Link>
        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-lab-navy">
              Hasil asesmen
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Laporan dari Result Snapshot (tidak dihitung ulang saat dibuka).
            </p>
          </div>
          <a
            href={`/api/asesmen/${attemptId}/pdf`}
            className="inline-flex rounded-lg bg-lab-navy px-4 py-2.5 text-sm font-semibold text-white hover:opacity-95"
          >
            Unduh PDF
          </a>
        </div>
        <div className="mt-8">
          <ResultReport report={report} />
        </div>
      </main>
    </>
  );
}
