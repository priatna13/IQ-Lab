"use client";

import { useState, useTransition } from "react";
import { completeAttemptAction } from "@/app/actions/assessment";

export function CompleteAttemptButton({ attemptId }: { attemptId: string }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div className="space-y-2">
      {error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          setError(null);
          startTransition(async () => {
            const result = await completeAttemptAction(attemptId);
            if (result && !result.ok) setError(result.error);
          });
        }}
        className="rounded-lg bg-lab-teal px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {pending ? "Memproses hasil…" : "Selesaikan & lihat hasil"}
      </button>
    </div>
  );
}
