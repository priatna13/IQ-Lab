import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { PageShell } from "@/components/ui/page-shell";
import { SkillRunner } from "@/components/assessment/skill-runner";
import { getSessionUser } from "@/lib/auth/session";
import { createServerAssessmentPorts } from "@/lib/assessment/ports-factory";
import { getSkillRunnerView } from "@/domain/assessment/skill/skill-session";
import { isFieldId } from "@/domain/assessment/skill/field-catalog";

type Props = {
  params: Promise<{ attemptId: string; fieldId: string }>;
  searchParams: Promise<{ sid?: string }>;
};

export default async function SkillSessionPage({ params, searchParams }: Props) {
  const user = await getSessionUser();
  if (!user) redirect("/masuk");

  const { attemptId, fieldId } = await params;
  const { sid } = await searchParams;
  if (!isFieldId(fieldId)) notFound();

  const ports = createServerAssessmentPorts();
  const attempt = await ports.attempts.findById(attemptId);
  if (!attempt || attempt.participantId !== user.id) notFound();

  let skillAttemptId = sid;
  if (!skillAttemptId) {
    const open = await ports.skillAttempts.findOpenByParticipant(user.id);
    if (
      open &&
      open.sourceAttemptId === attemptId &&
      open.fieldId === fieldId
    ) {
      skillAttemptId = open.id;
    }
  }
  if (!skillAttemptId) {
    redirect(`/asesmen/${attemptId}/keahlian`);
  }

  const skillAttempt = await ports.skillAttempts.findById(skillAttemptId);
  if (
    !skillAttempt ||
    skillAttempt.participantId !== user.id ||
    skillAttempt.sourceAttemptId !== attemptId
  ) {
    notFound();
  }

  if (skillAttempt.status === "completed") {
    redirect(`/asesmen/${attemptId}/keahlian/${fieldId}/hasil`);
  }

  const view = await getSkillRunnerView(ports, {
    skillAttemptId: skillAttempt.id,
    participantId: user.id,
  });

  return (
    <PageShell width="md" orbs="calm">
      <Link
        href={`/asesmen/${attemptId}/keahlian`}
        className="text-sm font-semibold text-lab-teal hover:underline"
      >
        ← Pilih bidang lain
      </Link>
      <div className="mt-6">
        <SkillRunner initialView={view} />
      </div>
    </PageShell>
  );
}
