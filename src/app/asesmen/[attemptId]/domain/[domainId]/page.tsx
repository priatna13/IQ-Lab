import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { PageShell } from "@/components/ui/page-shell";
import { DomainRunner } from "@/components/assessment/domain-runner";
import { getSessionUser } from "@/lib/auth/session";
import { createServerAssessmentPorts } from "@/lib/assessment/ports-factory";
import {
  AssessmentError,
  closeExpiredSessionsForAttempt,
  getDomainRunnerView,
  startDomainSession,
} from "@/domain/assessment";

type Props = {
  params: Promise<{ attemptId: string; domainId: string }>;
};

export default async function DomainRunnerPage({ params }: Props) {
  const user = await getSessionUser();
  if (!user) redirect("/masuk");

  const { attemptId, domainId } = await params;
  const ports = createServerAssessmentPorts();
  const attempt = await ports.attempts.findById(attemptId);
  if (!attempt || attempt.participantId !== user.id) {
    notFound();
  }

  // Close stale timer sessions so fixed domain order is not blocked.
  if (attempt.status === "in_progress") {
    try {
      await closeExpiredSessionsForAttempt(ports, {
        attemptId,
        participantId: user.id,
      });
    } catch {
      // continue — startDomainSession re-validates
    }
  }

  let sessionId: string;
  try {
    const session = await startDomainSession(ports, {
      attemptId,
      participantId: user.id,
      domainId,
    });
    // If this domain just auto-closed on open (timer), send user back to list
    // so they can continue the next domain.
    if (session.status === "closed") {
      redirect(`/asesmen/${attemptId}`);
    }
    sessionId = session.id;
  } catch (err) {
    if (err instanceof AssessmentError) {
      return (
        <PageShell width="sm" orbs="none" footer={false}>
          <p role="alert" className="text-sm text-red-700">
            {err.message}
          </p>
          <Link
            href={`/asesmen/${attemptId}`}
            className="mt-4 inline-block text-sm font-semibold text-lab-teal hover:underline"
          >
            ← Kembali
          </Link>
        </PageShell>
      );
    }
    throw err;
  }

  const view = await getDomainRunnerView(ports, {
    sessionId,
    participantId: user.id,
  });

  return (
    <PageShell width="md" orbs="none" footer={false}>
      <Link
        href={`/asesmen/${attemptId}`}
        className="text-sm font-semibold text-lab-teal hover:underline"
      >
        ← Daftar domain
      </Link>
      <div className="mt-6">
        <DomainRunner attemptId={attemptId} initialView={view} />
      </div>
    </PageShell>
  );
}
