import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { PageShell } from "@/components/ui/page-shell";
import { SkillResultPanel } from "@/components/assessment/skill-result-panel";
import { getSessionUser } from "@/lib/auth/session";
import { createServerAssessmentPorts } from "@/lib/assessment/ports-factory";
import { toPublicSkillResult } from "@/domain/assessment/skill/complete-skill-attempt";
import { isFieldId } from "@/domain/assessment/skill/field-catalog";
import { AssessmentError } from "@/domain/assessment";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Props = {
  params: Promise<{ attemptId: string; fieldId: string }>;
};

function HasilErrorShell({
  attemptId,
  title,
  detail,
}: {
  attemptId: string;
  title: string;
  detail: string;
}) {
  return (
    <PageShell width="md" orbs="calm">
      <p className="lab-section-label">Keahlian</p>
      <h1 className="mt-1 text-2xl font-bold text-lab-navy">{title}</h1>
      <pre className="mt-4 overflow-x-auto rounded-xl bg-slate-950 px-3 py-3 text-left text-xs text-amber-100">
        {detail}
      </pre>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href={`/asesmen/${attemptId}/keahlian`}
          className="lab-btn-primary"
        >
          Daftar keahlian
        </Link>
        <Link href="/dashboard" className="lab-btn-secondary">
          Dasbor
        </Link>
      </div>
    </PageShell>
  );
}

export default async function SkillHasilPage({ params }: Props) {
  const user = await getSessionUser();
  if (!user) redirect("/masuk");

  const { attemptId, fieldId } = await params;
  if (!isFieldId(fieldId)) notFound();

  try {
    const ports = createServerAssessmentPorts();
    const attempt = await ports.attempts.findById(attemptId);
    if (!attempt || attempt.participantId !== user.id) notFound();

    const completed = await ports.skillAttempts.findCompletedBySourceAndField(
      attemptId,
      fieldId,
    );
    if (!completed) {
      redirect(`/asesmen/${attemptId}/keahlian`);
    }

    const snapshot = await ports.skillSnapshots.findBySkillAttemptId(
      completed.id,
    );
    if (!snapshot) notFound();

    const result = toPublicSkillResult(snapshot);

    return (
      <PageShell width="md" orbs="calm">
        <div className="flex flex-wrap gap-4 text-sm font-semibold">
          <Link
            href={`/asesmen/${attemptId}/hasil`}
            className="text-lab-teal hover:underline"
          >
            ← Hasil 9 domain
          </Link>
          <Link
            href={`/asesmen/${attemptId}/keahlian`}
            className="text-lab-teal hover:underline"
          >
            Bidang lain
          </Link>
        </div>
        <div className="mt-4">
          <p className="lab-section-label">Keahlian bidang</p>
          <h1 className="mt-1 text-2xl font-bold text-lab-navy">
            Hasil keahlian
          </h1>
        </div>
        <div className="mt-8">
          <SkillResultPanel result={result} />
        </div>
      </PageShell>
    );
  } catch (err) {
    if (
      err &&
      typeof err === "object" &&
      "digest" in err &&
      (String((err as { digest?: string }).digest).startsWith("NEXT_REDIRECT") ||
        String((err as { digest?: string }).digest).startsWith("NEXT_NOT_FOUND"))
    ) {
      throw err;
    }
    if (err instanceof AssessmentError) {
      if (err.code === "NOT_FOUND") notFound();
      return (
        <HasilErrorShell
          attemptId={attemptId}
          title="Hasil keahlian tidak tersedia"
          detail={`code: ${err.code}\nmessage: ${err.message}`}
        />
      );
    }
    const message = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error ? err.stack : undefined;
    console.error("[SKILL_HASIL] fatal", { attemptId, fieldId, message, stack });
    return (
      <HasilErrorShell
        attemptId={attemptId}
        title="Gagal memuat hasil keahlian"
        detail={`code: HASIL_FATAL\nmessage: ${message}${stack ? `\n\n${stack.slice(0, 500)}` : ""}`}
      />
    );
  }
}
