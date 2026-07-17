"use server";

import { redirect } from "next/navigation";
import {
  AssessmentError,
  createAttempt,
  type Track,
} from "@/domain/assessment";
import { getSessionUser } from "@/lib/auth/session";
import { createServerAssessmentPorts } from "@/lib/assessment/ports-factory";

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
      return { ok: false, error: err.message };
    }
    // Next.js redirect throws; rethrow
    if (
      err &&
      typeof err === "object" &&
      "digest" in err &&
      String((err as { digest?: string }).digest).startsWith("NEXT_REDIRECT")
    ) {
      throw err;
    }
    console.error(err);
    return {
      ok: false,
      error: "Gagal memulai Attempt. Coba lagi beberapa saat.",
    };
  }
}
