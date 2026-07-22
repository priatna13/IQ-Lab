import { KeahlianPageClient } from "@/components/assessment/keahlian-page-client";

type Props = {
  params: Promise<{ attemptId: string }>;
};

/**
 * Thin server shell only.
 * NOTE: Do NOT use next/dynamic({ ssr: false }) here — that throws in App Router
 * Server Components and surfaces as production digest E352 with a redacted message.
 * Data loading is client-side via /api/asesmen/:id/keahlian (real JSON errors).
 */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;

export default async function KeahlianPickerPage({ params }: Props) {
  const { attemptId } = await params;

  console.info("[KEAHLIAN] render started", { attemptId });

  try {
    if (!attemptId || typeof attemptId !== "string" || attemptId.length < 8) {
      console.error("[KEAHLIAN_RENDER_FAILED]", {
        attemptId,
        message: "INVALID_ATTEMPT_ID",
      });
      return (
        <main className="mx-auto max-w-lg px-4 py-16">
          <h1 className="text-xl font-bold text-lab-navy">
            ID asesmen tidak valid
          </h1>
          <pre className="mt-4 overflow-x-auto rounded-xl bg-slate-950 p-3 text-left text-xs text-emerald-200">
            {`code: INVALID_ATTEMPT_ID\nmessage: attemptId=${String(attemptId)}`}
          </pre>
        </main>
      );
    }

    console.info("[KEAHLIAN] render shell ok", { attemptId });
    return <KeahlianPageClient attemptId={attemptId} />;
  } catch (error) {
    console.error("[KEAHLIAN_RENDER_FAILED]", {
      attemptId,
      name: error instanceof Error ? error.name : "UnknownError",
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    return (
      <main className="mx-auto max-w-lg px-4 py-16">
        <h1 className="text-xl font-bold text-lab-navy">
          Gagal merender halaman keahlian
        </h1>
        <pre
          role="alert"
          className="mt-4 overflow-x-auto rounded-xl bg-slate-950 p-3 text-left text-xs text-emerald-200"
        >
          {`code: KEAHLIAN_RENDER_FAILED
message: ${error instanceof Error ? error.message : String(error)}
attemptId: ${attemptId}`}
        </pre>
      </main>
    );
  }
}
