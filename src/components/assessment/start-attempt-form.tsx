"use client";

import { useActionState, useState } from "react";
import {
  startAttemptAction,
  type StartAttemptResult,
} from "@/app/actions/assessment";

const initial: StartAttemptResult = { ok: false };

export function StartAttemptForm() {
  const [state, formAction, pending] = useActionState(
    startAttemptAction,
    initial,
  );
  const [track, setTrack] = useState<"explore" | "career" | "">("");

  return (
    <form action={formAction} className="space-y-5">
      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold text-lab-navy">
          Pilih Track
        </legend>

        <label className="flex cursor-pointer gap-3 rounded-lg border border-slate-200 bg-white p-4">
          <input
            type="radio"
            name="track"
            value="explore"
            required
            checked={track === "explore"}
            onChange={() => setTrack("explore")}
          />
          <span className="text-sm">
            <span className="font-medium text-lab-navy">Jelajahi potensi</span>
            <span className="mt-1 block text-slate-600">
              Cocok jika Anda ingin memetakan kekuatan dan arah belajar /
              eksplorasi bidang.
            </span>
          </span>
        </label>

        <label className="flex cursor-pointer gap-3 rounded-lg border border-slate-200 bg-white p-4">
          <input
            type="radio"
            name="track"
            value="career"
            checked={track === "career"}
            onChange={() => setTrack("career")}
          />
          <span className="text-sm">
            <span className="font-medium text-lab-navy">
              Rancang langkah karir
            </span>
            <span className="mt-1 block text-slate-600">
              Cocok untuk skill gap, prioritas training, dan arah role
              profesional.
            </span>
          </span>
        </label>
      </fieldset>

      <label className="flex items-start gap-2 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
        <input type="checkbox" name="confirm_track" className="mt-1" />
        <span>
          Saya memahami Track <strong>tidak dapat diganti</strong> setelah
          Attempt dimulai. Item asesmen sama; yang berbeda adalah framing
          insight & action plan.
        </span>
      </label>

      {state?.error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-lab-teal px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {pending ? "Membuat Attempt…" : "Mulai asesmen"}
      </button>
    </form>
  );
}
