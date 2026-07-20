import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { PageShell } from "@/components/ui/page-shell";
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
      <div className="lab-card relative mt-6 overflow-hidden border-lab-teal/20 p-5 sm:p-6">
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-lab-mint/55 via-white/40 to-lab-sky/20"
          aria-hidden
        />
        <div className="relative">
          <p className="lab-section-label text-lab-teal-deep">Langkah lanjutan</p>
          <h2 className="mt-1 text-lg font-bold text-lab-navy sm:text-xl">
            Asesmen keahlian berdasarkan bidang kerja
          </h2>
          <p className="mt-2 max-w-prose text-sm leading-relaxed text-slate-600">
            Pilih kategori (mis. Teknologi), lalu role (Software, UI/UX, Data…).
            Soal menyesuaikan bidang dan digabung dengan profil 9 domain Anda.
          </p>
          <ul className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
            <li className="lab-badge bg-white/90 ring-1 ring-lab-teal/15">
              5 kategori · 15 role
            </li>
            <li className="lab-badge bg-white/90 ring-1 ring-lab-teal/15">
              7 soal MCQ · ±12 mnt
            </li>
            <li className="lab-badge bg-white/90 ring-1 ring-lab-teal/15">
              Rekomendasi dari profil
            </li>
          </ul>
          <Link
            href={`/asesmen/${attemptId}/keahlian`}
            className="lab-btn-primary mt-5 inline-flex"
          >
            Pilih bidang kerja
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <ResultReport report={report} />
      </div>
    </PageShell>
  );
}
