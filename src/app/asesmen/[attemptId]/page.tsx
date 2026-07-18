import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { PageShell } from "@/components/ui/page-shell";
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

  const closedCount = pub
    ? pub.domainOrder.filter((id) => byDomain.get(id)?.status === "closed")
        .length
    : 0;
  const totalDomains = pub?.domainOrder.length ?? 9;
  const progressPct = Math.round((closedCount / totalDomains) * 100);

  return (
    <PageShell width="md" orbs="calm">
      <Link
        href="/dashboard"
        className="text-sm font-semibold text-lab-teal hover:underline"
      >
        ← Dasbor
      </Link>

      <p className="lab-section-label mt-4">Attempt</p>
      <h1 className="mt-2 text-2xl font-bold text-lab-navy sm:text-3xl">
        Progress domain
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Track ter-pin:{" "}
        <strong className="text-lab-navy">
          {attempt.track === "explore"
            ? "Jelajahi potensi"
            : "Rancang langkah karir"}
        </strong>
        . Content:{" "}
        <code className="rounded bg-slate-100 px-1 text-xs">
          {attempt.contentVersionId}
        </code>
      </p>

      <div className="lab-card mt-6 p-5 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Kemajuan
            </p>
            <p className="mt-1 font-mono text-2xl font-bold tabular-nums text-lab-navy">
              {closedCount}
              <span className="text-base font-medium text-slate-400">
                /{totalDomains}
              </span>
            </p>
          </div>
          <p className="text-sm text-slate-500">
            Dimulai {attempt.startedAt.toLocaleString("id-ID")}
          </p>
        </div>
        <div className="lab-progress-track mt-3">
          <div
            className="lab-progress-fill transition-all duration-300"
            style={{ width: `${Math.max(4, progressPct)}%` }}
          />
        </div>

        {pub ? (
          <ol className="mt-6 space-y-3">
            {pub.domainOrder.map((domainId, i) => {
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
                <li
                  key={domainId}
                  className={`rounded-xl border px-4 py-3 ${
                    closed
                      ? "border-lab-teal/20 bg-lab-mint/30"
                      : inProgress
                        ? "border-lab-teal/40 bg-white shadow-glow"
                        : locked
                          ? "border-slate-100 bg-slate-50/80 opacity-70"
                          : "border-slate-200 bg-white"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs tabular-nums text-slate-400">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="font-medium text-lab-navy">
                          {domain?.label ?? domainId}
                        </span>
                        {closed ? (
                          <span className="lab-badge bg-white text-lab-teal-deep ring-1 ring-lab-teal/15">
                            Selesai
                          </span>
                        ) : inProgress ? (
                          <span className="lab-badge bg-lab-teal/10 text-lab-teal ring-1 ring-lab-teal/20">
                            Aktif
                          </span>
                        ) : locked ? (
                          <span className="lab-badge bg-slate-100 text-slate-500">
                            Terkunci
                          </span>
                        ) : (
                          <span className="lab-badge bg-lab-mist text-lab-navy-soft ring-1 ring-lab-sky/20">
                            Siap
                          </span>
                        )}
                      </div>
                      {domain?.shortBlurb ? (
                        <p className="mt-1 text-xs text-slate-500">
                          {domain.shortBlurb}
                        </p>
                      ) : null}
                      <p className="mt-0.5 text-xs text-slate-400">
                        {domain?.itemCount ?? 0} soal
                        {domain?.timeLimitSeconds
                          ? ` · ±${Math.round(domain.timeLimitSeconds / 60)} mnt`
                          : ""}
                        {closed
                          ? ` · ${session?.closeReason === "early_finish" ? "awal" : "timer"} ${session?.rawCorrect ?? "?"}/${session?.rawTotal ?? "?"}`
                          : null}
                      </p>
                    </div>
                    {!closed && !locked ? (
                      <Link
                        href={`/asesmen/${attemptId}/domain/${domainId}`}
                        className="lab-btn-primary !min-h-9 !px-3 !py-1.5 text-xs"
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
          <div className="mt-6 space-y-3 rounded-xl bg-lab-mint/40 p-4 ring-1 ring-lab-teal/15">
            <p className="text-sm text-lab-navy">
              Semua 9 domain sudah ditutup. Selesaikan Attempt untuk
              membekukan Result Snapshot (profil, indeks, estimasi IQ).
            </p>
            <CompleteAttemptButton attemptId={attempt.id} />
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            <p className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-600">
              Kerjakan domain berurutan. Timer hanya berlaku di dalam domain
              aktif. Anda boleh keluar ke dasbor dan melanjutkan nanti.
            </p>
            <Link
              href={`/asesmen/${attemptId}/domain/${nextDomainId}`}
              className="lab-btn-primary w-full sm:w-auto"
            >
              Lanjut domain berikutnya
            </Link>
          </div>
        )}

        {attempt.status === "in_progress" ? (
          <div className="mt-8 border-t border-slate-100 pt-6">
            <AbandonAttemptButton attemptId={attempt.id} />
          </div>
        ) : null}
      </div>
    </PageShell>
  );
}
