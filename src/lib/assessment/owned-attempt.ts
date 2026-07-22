import { notFound } from "next/navigation";
import type { Attempt } from "@/domain/assessment";
import type { ServerAssessmentPorts } from "@/lib/assessment/ports-factory";

export type LoadOwnedAttemptResult =
  | { status: "ok"; attempt: Attempt }
  | { status: "not_found" }
  | { status: "unavailable"; message: string };

/**
 * Load an attempt visible to the current user under RLS.
 * Empty result (RLS hide / wrong owner / missing id) → not_found — never throw.
 * Transport/timeout errors → unavailable for soft UI.
 */
export async function loadOwnedAttempt(
  ports: ServerAssessmentPorts,
  attemptId: string,
  participantId: string,
): Promise<LoadOwnedAttemptResult> {
  try {
    const attempt = await ports.attempts.findById(attemptId);
    if (!attempt || attempt.participantId !== participantId) {
      return { status: "not_found" };
    }
    return { status: "ok", attempt };
  } catch {
    return {
      status: "unavailable",
      message:
        "Data asesmen sementara tidak bisa dimuat. Coba muat ulang sebentar lagi.",
    };
  }
}

/** Convenience for pages: not_found → notFound(), unavailable rethrows as soft path caller. */
export async function requireOwnedAttempt(
  ports: ServerAssessmentPorts,
  attemptId: string,
  participantId: string,
): Promise<Attempt | { unavailable: string }> {
  const result = await loadOwnedAttempt(ports, attemptId, participantId);
  if (result.status === "not_found") notFound();
  if (result.status === "unavailable") return { unavailable: result.message };
  return result.attempt;
}
