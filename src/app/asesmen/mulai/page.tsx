import Link from "next/link";
import { redirect } from "next/navigation";
import { PageShell } from "@/components/ui/page-shell";
import { StartAttemptForm } from "@/components/assessment/start-attempt-form";
import { getSessionUser } from "@/lib/auth/session";
import { createServerAssessmentPorts } from "@/lib/assessment/ports-factory";
import {
  getOpenAttempt,
  getRetakeCooldownUntil,
  toPublicContentVersion,
} from "@/domain/assessment";

export default async function StartAssessmentPage() {
  const user = await getSessionUser();
  if (!user) redirect("/masuk?next=/asesmen/mulai");
  if (!user.ageBand) redirect("/onboarding/usia");

  const ports = createServerAssessmentPorts();
  const open = await getOpenAttempt(ports, user.id);
  if (open) {
    redirect(`/asesmen/${open.id}`);
  }

  const completed = await ports.attempts.listCompletedByParticipant(user.id);
  const cooldownUntil = getRetakeCooldownUntil(completed, new Date());
  if (cooldownUntil) {
    redirect("/dashboard");
  }

  const cv = await ports.content.getPublished();
  const pub = cv ? toPublicContentVersion(cv) : null;

  return (
    <PageShell width="sm" orbs="calm">
      <Link
        href="/dashboard"
        className="text-sm font-semibold text-lab-teal hover:underline"
      >
        ← Dasbor
      </Link>
      <p className="lab-section-label mt-4">Asesmen</p>
      <h1 className="mt-2 text-2xl font-bold text-lab-navy sm:text-3xl">
        Mulai asesmen
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">
        Estimasi total ~60–90+ menit di 9 domain (8 soal per domain). Anda
        dapat <strong>jeda antar domain</strong> (bukan di tengah timer
        domain). Setelah selesai, retake dibatasi 1 penyelesaian / 90 hari.
        Hasil bersifat estimasi pengembangan diri — bukan tes IST resmi atau
        alat rekrutmen/klinis.
      </p>

      {pub ? (
        <div className="lab-card mt-6 p-4 text-sm sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Isi asesmen · {pub.label}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {pub.domains.reduce((s, d) => s + d.itemCount, 0)} soal · versi{" "}
            <code className="rounded bg-slate-100 px-1">{pub.id}</code>
          </p>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-slate-700">
            {pub.domainOrder.map((id) => {
              const d = pub.domains.find((x) => x.id === id);
              if (!d) return null;
              return (
                <li key={id}>
                  <span className="font-medium text-lab-navy">{d.label}</span>
                  {d.shortBlurb ? (
                    <span className="text-slate-500"> — {d.shortBlurb}</span>
                  ) : null}
                  <span className="text-slate-400">
                    {" "}
                    ({d.itemCount} soal, ±{Math.round(d.timeLimitSeconds / 60)}{" "}
                    mnt)
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      ) : null}

      <div className="lab-card mt-6 p-5 sm:p-6">
        <StartAttemptForm />
      </div>
    </PageShell>
  );
}
