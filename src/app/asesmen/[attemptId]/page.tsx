import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { AbandonAttemptButton } from "@/components/assessment/abandon-attempt-button";
import { CompleteAttemptButton } from "@/components/assessment/complete-attempt-button";
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

  if (attempt.status === "abandoned") {
    redirect("/dashboard");
  }
  if (attempt.status === "completed") {
    redirect(`/asesmen/${attemptId}/hasil`);
  }

  const cv = await ports.content.getById(attempt.contentVersionId);
  const pub = cv ? toPublicContentVersion(cv) : null;
  const sessions = await ports.domainSessions.listByAttempt(attemptId);
  const byDomain = new Map(sessions.map((s) => [s.domainId, s]));

  // First incomplete domain becomes the "continue" target
  let nextDomainId: string | null = null;
  if (pub) {
    for (const domainId of pub.domainOrder) {
      const s = byDomain.get(domainId);
      if (!s || s.status !== "closed") {
        nextDomainId = domainId;
        break;
      }
    }
  }

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
          . Content Version:{" "}
          <code className="text-xs">{attempt.contentVersionId}</code>
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
            <ol className="mt-6 list-decimal space-y-3 pl-5 text-sm text-slate-700">
              {pub.domainOrder.map((domainId) => {
                const domain = pub.domains.find((d) => d.id === domainId);
                const session = byDomain.get(domainId);
                const closed = session?.status === "closed";
                const inProgress = session?.status === "in_progress";
                const locked =
                  !closed &&
                  !inProgress &&
                  nextDomainId !== null &&
                  domainId !== nextDomainId;

                return (
                  <li key={domainId} className="pl-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <span className="font-medium">
                          {domain?.label ?? domainId}
                        </span>
                        {domain?.shortBlurb ? (
                          <span className="mt-0.5 block text-xs text-slate-500">
                            {domain.shortBlurb}
                          </span>
                        ) : null}
                        <span className="text-slate-400">
                          {" "}
                          · {domain?.itemCount ?? 0} soal
                          {domain?.timeLimitSeconds
                            ? ` · ±${Math.round(domain.timeLimitSeconds / 60)} mnt`
                            : ""}
                          {closed
                            ? ` · selesai (${session?.closeReason === "early_finish" ? "awal" : "timer"}) ${session?.rawCorrect ?? "?"}/${session?.rawTotal ?? "?"}`
                            : inProgress
                              ? " · sedang dikerjakan"
                              : locked
                                ? " · terkunci (kerjakan berurutan)"
                                : " · siap"}
                        </span>
                      </div>
                      {!closed && !locked ? (
                        <Link
                          href={`/asesmen/${attemptId}/domain/${domainId}`}
                          className="rounded-lg bg-lab-teal px-3 py-1.5 text-xs font-semibold text-white"
                        >
                          {inProgress ? "Lanjutkan" : "Mulai domain"}
                        </Link>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ol>
          ) : null}

          {nextDomainId === null ? (
            <div className="mt-6 space-y-3 rounded-lg bg-teal-50 p-4">
              <p className="text-sm text-lab-navy">
                Semua 9 domain sudah ditutup. Selesaikan Attempt untuk
                membekukan Result Snapshot (profil, indeks, estimasi IQ).
              </p>
              <CompleteAttemptButton attemptId={attempt.id} />
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
                Kerjakan domain berurutan. Timer hanya berlaku di dalam domain
                aktif (sisa waktu tidak dipindah ke domain berikutnya). Anda
                boleh keluar ke dasbor dan melanjutkan Open Attempt yang sama
                nanti.
              </p>
              {nextDomainId ? (
                <Link
                  href={`/asesmen/${attemptId}/domain/${nextDomainId}`}
                  className="inline-flex rounded-lg bg-lab-teal px-4 py-2 text-sm font-semibold text-white"
                >
                  Lanjut domain berikutnya
                </Link>
              ) : null}
            </div>
          )}

          {attempt.status === "in_progress" ? (
            <div className="mt-8 border-t border-slate-100 pt-6">
              <AbandonAttemptButton attemptId={attempt.id} />
            </div>
          ) : null}
        </div>
      </main>
    </>
  );
}
