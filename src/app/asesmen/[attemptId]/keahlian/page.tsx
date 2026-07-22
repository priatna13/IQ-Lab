"use client";

import { useParams } from "next/navigation";
import { KeahlianPageClient } from "@/components/assessment/keahlian-page-client";

/**
 * FULL client page — no async Server Component on this route.
 * Production E352 digests only come from failed RSC renders; this page
 * cannot produce that class of error. Data loads via /api/asesmen/:id/keahlian.
 */
export default function KeahlianPickerPage() {
  const params = useParams();
  const attemptId = String(
    (params?.attemptId as string | string[] | undefined) ?? "",
  );
  const id = Array.isArray(attemptId) ? attemptId[0] : attemptId;

  if (!id || id.length < 8) {
    return (
      <main className="mx-auto max-w-lg px-4 py-16">
        <h1 className="text-xl font-bold text-lab-navy">
          ID asesmen tidak valid
        </h1>
        <pre className="mt-4 overflow-x-auto rounded-xl bg-slate-950 p-3 text-left text-xs text-emerald-200">
          {`code: INVALID_ATTEMPT_ID\nmessage: attemptId=${String(id)}`}
        </pre>
      </main>
    );
  }

  return <KeahlianPageClient attemptId={id} />;
}
