import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { PageShell } from "@/components/ui/page-shell";
import { SkillRunner } from "@/components/assessment/skill-runner";
import { getSessionUser } from "@/lib/auth/session";
import { createServerAssessmentPorts } from "@/lib/assessment/ports-factory";
import { getSkillRunnerView } from "@/domain/assessment/skill/skill-session";
import { isFieldId } from "@/domain/assessment/skill/field-catalog";
import { AssessmentError } from "@/domain/assessment";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Props = {
  params: Promise<{ attemptId: string; fieldId: string }>;
  searchParams: Promise<{ sid?: string }>;
};

function SesiErrorShell({
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
          Kembali ke daftar keahlian
        </Link>
        <Link href="/dashboard" className="lab-btn-secondary">
          Dasbor
        </Link>
      </div>
    </PageShell>
  );
}

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
        <SesiErrorShell
          attemptId={attemptId}
          title="Sesi keahlian tidak tersedia"
          detail={`code: ${err.code}\nmessage: ${err.message}`}
        />
      );
    }
    const message = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error ? err.stack : undefined;
    console.error("[SKILL_SESI] fatal", { attemptId, fieldId, message, stack });
    // Never rethrow — avoid opaque RSC digests in production.
    return (
      <SesiErrorShell
        attemptId={attemptId}
        title="Gagal memuat sesi keahlian"
        detail={`code: SESI_FATAL\nmessage: ${message}${stack ? `\n\n${stack.slice(0, 500)}` : ""}`}
      />
    );
  }
}
