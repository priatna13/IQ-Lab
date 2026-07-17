"use server";

import { redirect } from "next/navigation";
import {
  abandonAttempt,
  AssessmentError,
  closeDomainSessionIfTimedOut,
  completeAttempt,
  createAttempt,
  earlyFinishDomainSession,
  getDomainRunnerView,
  getResultSnapshotForAttempt,
  recordIntegrityEvent,
  startDomainSession,
  toPublicResultReport,
  upsertResponse,
  type IntegrityEventType,
  type PublicDomainRunnerView,
  type PublicResultReport,
  type Track,
} from "@/domain/assessment";
import { getSessionUser } from "@/lib/auth/session";
import { createServerAssessmentPorts } from "@/lib/assessment/ports-factory";

function isNextRedirect(err: unknown): boolean {
  return (
    !!err &&
    typeof err === "object" &&
    "digest" in err &&
    String((err as { digest?: string }).digest).startsWith("NEXT_REDIRECT")
  );
}

export type StartAttemptResult = {
  ok: boolean;
  error?: string;
};

export async function startAttemptAction(
  _prev: StartAttemptResult | null,
  formData: FormData,
): Promise<StartAttemptResult> {
  const user = await getSessionUser();
  if (!user) {
    return { ok: false, error: "Anda harus masuk terlebih dahulu." };
  }
  if (!user.ageBand || user.ageBand === "under_18") {
    return { ok: false, error: "Lengkapi rentang usia yang eligible dulu." };
  }

  const track = String(formData.get("track") ?? "") as Track;
  const confirmed = formData.get("confirm_track") === "on";

  if (track !== "explore" && track !== "career") {
    return { ok: false, error: "Pilih Track asesmen." };
  }
  if (!confirmed) {
    return {
      ok: false,
      error:
        "Konfirmasikan bahwa Track tidak dapat diganti setelah Attempt dimulai.",
    };
  }

  const ports = createServerAssessmentPorts();

  try {
    const attempt = await createAttempt(ports, {
      participant: { id: user.id, ageBand: user.ageBand },
      track,
    });
    redirect(`/asesmen/${attempt.id}`);
  } catch (err) {
    if (err instanceof AssessmentError) {
      if (err.code === "OPEN_ATTEMPT_EXISTS") {
        return {
          ok: false,
          error:
            "Anda masih punya Attempt berjalan. Lanjutkan yang ada, atau selesaikan dulu.",
        };
      }
      if (err.code === "RETAKE_COOLDOWN") {
        return {
          ok: false,
          error:
            "Jeda retake 90 hari masih aktif setelah penyelesaian terakhir. Anda tetap bisa melihat hasil sebelumnya di dasbor.",
        };
      }
      return { ok: false, error: err.message };
    }
    if (isNextRedirect(err)) throw err;
    console.error(err);
    return {
      ok: false,
      error: "Gagal memulai Attempt. Coba lagi beberapa saat.",
    };
  }
}

export async function startDomainAction(
  attemptId: string,
  domainId: string,
): Promise<{ ok: true; sessionId: string } | { ok: false; error: string }> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "Sesi tidak valid." };

  const ports = createServerAssessmentPorts();
  try {
    const session = await startDomainSession(ports, {
      attemptId,
      participantId: user.id,
      domainId,
    });
    return { ok: true, sessionId: session.id };
  } catch (err) {
    if (err instanceof AssessmentError) {
      return { ok: false, error: err.message };
    }
    console.error(err);
    return { ok: false, error: "Gagal memulai Domain Session." };
  }
}

export async function saveResponseAction(input: {
  sessionId: string;
  itemId: string;
  answer: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "Sesi tidak valid." };

  const ports = createServerAssessmentPorts();
  try {
    await upsertResponse(ports, {
      sessionId: input.sessionId,
      participantId: user.id,
      itemId: input.itemId,
      answer: input.answer,
    });
    return { ok: true };
  } catch (err) {
    if (err instanceof AssessmentError) {
      return { ok: false, error: err.message };
    }
    console.error(err);
    return { ok: false, error: "Gagal menyimpan jawaban." };
  }
}

export async function earlyFinishAction(
  sessionId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "Sesi tidak valid." };

  const ports = createServerAssessmentPorts();
  try {
    await earlyFinishDomainSession(ports, {
      sessionId,
      participantId: user.id,
    });
    return { ok: true };
  } catch (err) {
    if (err instanceof AssessmentError) {
      return { ok: false, error: err.message };
    }
    console.error(err);
    return { ok: false, error: "Gagal menyelesaikan domain." };
  }
}

export async function syncTimerCloseAction(
  sessionId: string,
): Promise<{ ok: true; view: PublicDomainRunnerView } | { ok: false; error: string }> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "Sesi tidak valid." };

  const ports = createServerAssessmentPorts();
  try {
    await closeDomainSessionIfTimedOut(ports, {
      sessionId,
      participantId: user.id,
    });
    const view = await getDomainRunnerView(ports, {
      sessionId,
      participantId: user.id,
    });
    return { ok: true, view };
  } catch (err) {
    if (err instanceof AssessmentError) {
      return { ok: false, error: err.message };
    }
    console.error(err);
    return { ok: false, error: "Gagal sinkron timer." };
  }
}

export async function refreshRunnerViewAction(
  sessionId: string,
): Promise<{ ok: true; view: PublicDomainRunnerView } | { ok: false; error: string }> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "Sesi tidak valid." };

  const ports = createServerAssessmentPorts();
  try {
    const view = await getDomainRunnerView(ports, {
      sessionId,
      participantId: user.id,
    });
    return { ok: true, view };
  } catch (err) {
    if (err instanceof AssessmentError) {
      return { ok: false, error: err.message };
    }
    console.error(err);
    return { ok: false, error: "Gagal memuat runner." };
  }
}

export async function abandonAttemptAction(
  attemptId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "Sesi tidak valid." };

  const ports = createServerAssessmentPorts();
  try {
    await abandonAttempt(ports, {
      attemptId,
      participantId: user.id,
    });
    redirect("/dashboard");
  } catch (err) {
    if (isNextRedirect(err)) throw err;
    if (err instanceof AssessmentError) {
      return { ok: false, error: err.message };
    }
    console.error(err);
    return { ok: false, error: "Gagal membatalkan Attempt." };
  }
}

export async function completeAttemptAction(
  attemptId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "Sesi tidak valid." };

  const ports = createServerAssessmentPorts();
  try {
    if (!user.ageBand || user.ageBand === "under_18") {
      return { ok: false, error: "Rentang usia tidak valid untuk menyelesaikan asesmen." };
    }
    await completeAttempt(ports, {
      attemptId,
      participantId: user.id,
      ageBand: user.ageBand,
    });
    redirect(`/asesmen/${attemptId}/hasil`);
  } catch (err) {
    if (isNextRedirect(err)) throw err;
    if (err instanceof AssessmentError) {
      return { ok: false, error: err.message };
    }
    console.error(err);
    return { ok: false, error: "Gagal menyelesaikan Attempt." };
  }
}

export async function loadReportAction(
  attemptId: string,
): Promise<
  { ok: true; report: PublicResultReport } | { ok: false; error: string }
> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "Sesi tidak valid." };

  const ports = createServerAssessmentPorts();
  try {
    const snapshot = await getResultSnapshotForAttempt(ports, {
      attemptId,
      participantId: user.id,
    });
    if (!snapshot) {
      return { ok: false, error: "Hasil belum tersedia." };
    }
    return { ok: true, report: toPublicResultReport(snapshot) };
  } catch (err) {
    if (err instanceof AssessmentError) {
      return { ok: false, error: err.message };
    }
    console.error(err);
    return { ok: false, error: "Gagal memuat hasil." };
  }
}

export async function recordIntegrityEventAction(input: {
  attemptId: string;
  domainSessionId?: string | null;
  type: IntegrityEventType;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "Sesi tidak valid." };

  const ports = createServerAssessmentPorts();
  try {
    await recordIntegrityEvent(ports, {
      attemptId: input.attemptId,
      participantId: user.id,
      domainSessionId: input.domainSessionId,
      type: input.type,
    });
    return { ok: true };
  } catch (err) {
    if (err instanceof AssessmentError) {
      return { ok: false, error: err.message };
    }
    console.error(err);
    return { ok: false, error: "Gagal mencatat sinyal integritas." };
  }
}
