import { KeahlianPageClient } from "@/components/assessment/keahlian-page-client";

type Props = {
  params: Promise<{ attemptId: string }>;
};

/**
 * Thin server shell — data loads on the client via API so production Next.js
 * does not swallow the real error into a digest-only RSC failure.
 */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function KeahlianPickerPage({ params }: Props) {
  const { attemptId } = await params;
  // Validate path param early without throwing opaque RSC digests.
  if (!attemptId || attemptId.length < 8) {
    return (
      <main className="mx-auto max-w-lg px-4 py-16">
        <h1 className="text-xl font-bold text-lab-navy">ID asesmen tidak valid</h1>
        <pre className="mt-4 rounded-xl bg-slate-950 p-3 text-xs text-emerald-200">
          {`code: INVALID_ATTEMPT_ID\nmessage: attemptId=${String(attemptId)}`}
        </pre>
      </main>
    );
  }

  return <KeahlianPageClient attemptId={attemptId} />;
}
