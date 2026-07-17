"use client";

import { useState, useTransition } from "react";
import { abandonAttemptAction } from "@/app/actions/assessment";

type Props = {
  attemptId: string;
};

export function AbandonAttemptButton({ attemptId }: Props) {
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
      >
        Batalkan asesmen
      </button>
    );
  }

  return (
    <div className="space-y-2 rounded-lg border border-red-200 bg-red-50 p-3">
      <p className="text-sm text-red-900">
        Batalkan Attempt ini? Progress domain tersimpan tidak akan menjadi
        Report lengkap.{" "}
        <strong>Tidak</strong> memulai jeda retake 90 hari — Anda bisa mulai
        Attempt baru segera.
      </p>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={pending}
          onClick={() => {
            setError(null);
            startTransition(async () => {
              const result = await abandonAttemptAction(attemptId);
              if (result && !result.ok) {
                setError(result.error);
              }
            });
          }}
          className="rounded-lg bg-red-700 px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {pending ? "Membatalkan…" : "Ya, batalkan"}
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => setConfirming(false)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium"
        >
          Tidak
        </button>
      </div>
    </div>
  );
}
