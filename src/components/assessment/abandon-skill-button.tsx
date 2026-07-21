"use client";

import { useState, useTransition } from "react";
import { abandonSkillAttemptAction } from "@/app/actions/skill-assessment";

type Props = {
  skillAttemptId: string;
  sourceAttemptId: string;
};

export function AbandonSkillButton({
  skillAttemptId,
  sourceAttemptId,
}: Props) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      <button
        type="button"
        className="lab-btn-ghost w-full border border-slate-200 text-sm text-slate-600 sm:w-auto"
        disabled={pending}
        onClick={() => {
          if (
            !window.confirm(
              "Batalkan asesmen keahlian ini? Jawaban belum selesai tidak akan disimpan sebagai hasil. Anda bisa memilih bidang lain.",
            )
          ) {
            return;
          }
          setError(null);
          start(async () => {
            try {
              const res = await abandonSkillAttemptAction(
                skillAttemptId,
                sourceAttemptId,
              );
              // Success redirects away; res is often undefined after redirect().
              if (res && !res.ok) setError(res.error);
            } catch {
              // NEXT_REDIRECT — navigation in progress
            }
          });
        }}
      >
        {pending ? "Membatalkan…" : "Batalkan sesi keahlian"}
      </button>
      {error ? (
        <p role="alert" className="text-xs text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
