import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { PageShell } from "@/components/ui/page-shell";
import { SkillResultPanel } from "@/components/assessment/skill-result-panel";
import { getSessionUser } from "@/lib/auth/session";
import { createServerAssessmentPorts } from "@/lib/assessment/ports-factory";
import { toPublicSkillResult } from "@/domain/assessment/skill/complete-skill-attempt";
import { isFieldId } from "@/domain/assessment/skill/field-catalog";

type Props = {
  params: Promise<{ attemptId: string; fieldId: string }>;
};

export default async function SkillHasilPage({ params }: Props) {
  const user = await getSessionUser();
  if (!user) redirect("/masuk");

  const { attemptId, fieldId } = await params;
  if (!isFieldId(fieldId)) notFound();

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

  const snapshot = await ports.skillSnapshots.findBySkillAttemptId(completed.id);
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
        <h1 className="mt-1 text-2xl font-bold text-lab-navy">Hasil keahlian</h1>
      </div>
      <div className="mt-8">
        <SkillResultPanel result={result} />
      </div>
    </PageShell>
  );
}
