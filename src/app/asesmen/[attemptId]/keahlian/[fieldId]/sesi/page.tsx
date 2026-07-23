import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { PageShell } from "@/components/ui/page-shell";
import { SkillRunner } from "@/components/assessment/skill-runner";
import { getSessionUser } from "@/lib/auth/session";
import { createServerAssessmentPorts } from "@/lib/assessment/ports-factory";
import { getSkillRunnerView } from "@/domain/assessment/skill/skill-session";
import { isFieldId } from "@/domain/assessment/skill/field-catalog";
import { AssessmentError } from "@/domain/assessment";

type Props = {
  params: Promise<{ attemptId: string; fieldId: string }>;
  searchParams: Promise<{ sid?: string }>;
};

/**
 * Skill session page. Never lets unexpected errors become opaque RSC digests:
 * known AssessmentError / missing data → redirect or notFound; other errors →
 * throw only after logging (error.tsx boundary shows a readable shell).
 */
export default async function SkillSessionPage({ params, searchParams }: Props) {
  const user = await getSessionUser();
  if (!user) redirect("/masuk");

  const { attemptId, fieldId } = await params;
  const { sid } = await searchParams;
  if (!isFieldId(fieldId)) notFound();

  try {
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

    if (skillAttempt.status === "abandoned") {
      redirect(`/asesmen/${attemptId}/keahlian`);
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
          ← Kembali ke daftar keahlian
        </Link>
        <p className="mt-2 text-xs text-slate-500">
          Sesi tetap terbuka jika Anda keluar. Batalkan di daftar keahlian bila
          ingin ganti bidang.
        </p>
        <div className="mt-6">
          <SkillRunner initialView={view} />
        </div>
      </PageShell>
    );
  } catch (err) {
    // Preserve Next control-flow exceptions
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
      redirect(`/asesmen/${attemptId}/keahlian`);
    }
    console.error("[SKILL_SESI] fatal", {
      attemptId,
      fieldId,
      message: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });
    throw err;
  }
}
