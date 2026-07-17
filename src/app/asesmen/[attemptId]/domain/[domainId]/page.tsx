import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { DomainRunner } from "@/components/assessment/domain-runner";
import { getSessionUser } from "@/lib/auth/session";
import { createServerAssessmentPorts } from "@/lib/assessment/ports-factory";
import {
  AssessmentError,
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

  let sessionId: string;
  try {
    const session = await startDomainSession(ports, {
      attemptId,
      participantId: user.id,
      domainId,
    });
    sessionId = session.id;
  } catch (err) {
    if (err instanceof AssessmentError) {
      return (
        <>
          <SiteHeader />
          <main className="mx-auto max-w-lg px-6 py-12">
            <p className="text-sm text-red-700">{err.message}</p>
            <Link
              href={`/asesmen/${attemptId}`}
              className="mt-4 inline-block text-sm font-medium text-lab-teal"
            >
              ← Kembali
            </Link>
          </main>
        </>
      );
    }
    throw err;
  }

  const view = await getDomainRunnerView(ports, {
    sessionId,
    participantId: user.id,
  });

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-6 py-10">
        <Link
          href={`/asesmen/${attemptId}`}
          className="text-sm font-medium text-lab-teal hover:underline"
        >
          ← Daftar domain
        </Link>
        <div className="mt-6">
          <DomainRunner attemptId={attemptId} initialView={view} />
        </div>
      </main>
    </>
  );
}
