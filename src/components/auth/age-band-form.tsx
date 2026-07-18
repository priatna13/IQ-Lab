"use client";

import { useActionState, useState } from "react";
import {
  saveAgeBandAction,
  type AuthActionResult,
} from "@/app/actions/auth";

const initial: AuthActionResult = { ok: false };

export function AgeBandForm() {
  const [state, formAction, pending] = useActionState(saveAgeBandAction, initial);
  const [choice, setChoice] = useState<string>("");

  return (
    <form action={formAction} className="space-y-5">
      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold text-lab-navy">
          Rentang usia Anda
        </legend>

        {(
          [
            {
              value: "under_18",
              title: "Di bawah 18 tahun",
              hint: "MVP tidak mendukung asesmen untuk usia ini",
            },
            {
              value: "18_45",
              title: "18–45 tahun",
              hint: "Segmen utama norma & insight karir",
            },
            {
              value: "46_plus",
              title: "46 tahun ke atas",
              hint: "Boleh mengikuti dengan disclaimer tambahan",
            },
          ] as const
        ).map((opt) => (
          <label
            key={opt.value}
            className={`lab-choice ${choice === opt.value ? "lab-choice-selected" : ""}`}
          >
            <input
              type="radio"
              name="age_band"
              value={opt.value}
              required
              onChange={() => setChoice(opt.value)}
              className="mt-1 shrink-0"
            />
            <span className="text-sm">
              <span className="font-medium text-lab-navy">{opt.title}</span>
              <span className="mt-0.5 block text-slate-500">{opt.hint}</span>
            </span>
          </label>
        ))}
      </fieldset>

      {choice === "46_plus" ? (
        <div className="space-y-3 rounded-xl border border-lab-warm/40 bg-orange-50 p-4 text-sm text-slate-700">
          <p>
            <strong>Disclaimer 46+:</strong> Norma internal IQ-Lab dan saran
            karir di fase awal dioptimalkan untuk usia 18–45. Hasil Anda tetap
            dapat digunakan untuk refleksi diri, tetapi kalibrasi norma &
            rekomendasi mungkin kurang optimal.
          </p>
          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              name="accept_46_disclaimer"
              className="mt-1"
            />
            <span>Saya memahami dan ingin melanjutkan.</span>
          </label>
        </div>
      ) : null}

      {state?.error ? (
        <p
          role="alert"
          className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-100"
        >
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="lab-btn-primary lab-btn-block w-full"
      >
        {pending ? "Menyimpan…" : "Lanjut ke dasbor"}
      </button>
    </form>
  );
}
