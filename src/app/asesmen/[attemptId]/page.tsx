import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { getSessionUser } from "@/lib/auth/session";
import { createServerAssessmentPorts } from "@/lib/assessment/ports-factory";
import { toPublicContentVersion } from "@/domain/assessment";

type Props = {
  params: Promise<{ attemptId: string }>;
};

export default async function AttemptProgressPage({ params }: Props) {
  const user = await getSessionUser();
  if (!user) redirect("/masuk");

  const { attemptId } = await params;
  const ports = createServerAssessmentPorts();
  const attempt = await ports.attempts.findById(attemptId);

  if (!attempt || attempt.participantId !== user.id) {
    notFound();
  }

  const cv = await ports.content.getById(attempt.contentVersionId);
  const pub = cv ? toPublicContentVersion(cv) : null;

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-6 py-12">
        <Link
          href="/dashboard"
          className="text-sm font-medium text-lab-teal hover:underline"
        >
          ← Dasbor
        </Link>

        <h1 className="mt-4 text-2xl font-semibold text-lab-navy">
          Attempt berjalan
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Track ter-pin:{" "}
          <strong>
            {attempt.track === "explore"
              ? "Jelajahi potensi"
              : "Rancang langkah karir"}
          </strong>
          . Content Version: <code className="text-xs">{attempt.contentVersionId}</code>
        </p>

        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-slate-500">Status</dt>
              <dd className="font-medium text-lab-navy">{attempt.status}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Dimulai</dt>
              <dd className="font-medium text-lab-navy">
                {attempt.startedAt.toLocaleString("id-ID")}
              </dd>
            </div>
          </dl>

          {pub ? (
            <ol className="mt-6 list-decimal space-y-2 pl-5 text-sm text-slate-700">
              {pub.domainOrder.map((domainId) => {
                const domain = pub.domains.find((d) => d.id === domainId);
                return (
                  <li key={domainId}>
                    <span className="font-medium">
                      {domain?.label ?? domainId}
                    </span>
                    <span className="text-slate-400">
                      {" "}
                      · {domain?.itemCount ?? 0} soal · belum dikerjakan
                    </span>
                  </li>
                );
              })}
            </ol>
          ) : null}

          <p className="mt-6 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
            Runner Domain (timer, Response, Early Finish) menyusul di ticket 04.
            Progress Attempt sudah tersimpan — Anda dapat kembali ke dasbor dan
            melanjutkan nanti.
          </p>
        </div>
      </main>
    </>
  );
}
