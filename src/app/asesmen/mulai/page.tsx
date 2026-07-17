import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { StartAttemptForm } from "@/components/assessment/start-attempt-form";
import { getSessionUser } from "@/lib/auth/session";
import { createServerAssessmentPorts } from "@/lib/assessment/ports-factory";
import { getOpenAttempt, toPublicContentVersion } from "@/domain/assessment";

export default async function StartAssessmentPage() {
  const user = await getSessionUser();
  if (!user) redirect("/masuk?next=/asesmen/mulai");
  if (!user.ageBand) redirect("/onboarding/usia");

  const ports = createServerAssessmentPorts();
  const open = await getOpenAttempt(ports, user.id);
  if (open) {
    redirect(`/asesmen/${open.id}`);
  }

  const cv = await ports.content.getPublished();
  const pub = cv ? toPublicContentVersion(cv) : null;

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-lg px-6 py-12">
        <Link
          href="/dashboard"
          className="text-sm font-medium text-lab-teal hover:underline"
        >
          ← Dasbor
        </Link>
        <h1 className="mt-4 text-2xl font-semibold text-lab-navy">
          Mulai asesmen
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Estimasi total ~60–90+ menit di 9 domain. Anda dapat{" "}
          <strong>jeda antar domain</strong> (bukan di tengah timer domain).
        </p>

        {pub ? (
          <p className="mt-3 text-xs text-slate-500">
            Konten: {pub.label} · {pub.domains.length} domain ·{" "}
            {pub.domains.reduce((s, d) => s + d.itemCount, 0)} item (versi{" "}
            {pub.id})
          </p>
        ) : null}

        <div className="mt-8">
          <StartAttemptForm />
        </div>
      </main>
    </>
  );
}
