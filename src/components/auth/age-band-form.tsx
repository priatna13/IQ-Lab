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

        <label className="flex cursor-pointer gap-3 rounded-lg border border-slate-200 bg-white p-3">
          <input
            type="radio"
            name="age_band"
            value="under_18"
            required
            onChange={() => setChoice("under_18")}
          />
          <span className="text-sm">
            <span className="font-medium">Di bawah 18 tahun</span>
            <span className="block text-slate-500">
              MVP tidak mendukung asesmen untuk usia ini
            </span>
          </span>
        </label>

        <label className="flex cursor-pointer gap-3 rounded-lg border border-slate-200 bg-white p-3">
          <input
            type="radio"
            name="age_band"
            value="18_45"
            onChange={() => setChoice("18_45")}
          />
          <span className="text-sm">
            <span className="font-medium">18–45 tahun</span>
            <span className="block text-slate-500">
              Segmen utama norma & insight karir
            </span>
          </span>
        </label>

        <label className="flex cursor-pointer gap-3 rounded-lg border border-slate-200 bg-white p-3">
          <input
            type="radio"
            name="age_band"
            value="46_plus"
            onChange={() => setChoice("46_plus")}
          />
          <span className="text-sm">
            <span className="font-medium">46 tahun ke atas</span>
            <span className="block text-slate-500">
              Boleh mengikuti dengan disclaimer tambahan
            </span>
          </span>
        </label>
      </fieldset>

      {choice === "46_plus" ? (
        <div className="space-y-3 rounded-lg border border-lab-warm/40 bg-orange-50 p-4 text-sm text-slate-700">
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
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-lab-teal px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {pending ? "Menyimpan…" : "Lanjut ke dasbor"}
      </button>
    </form>
  );
}
