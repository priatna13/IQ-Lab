"use client";

import { useActionState } from "react";
import type { AuthActionResult } from "@/app/actions/auth";

type Props = {
  action: (
    prev: AuthActionResult | null,
    formData: FormData,
  ) => Promise<AuthActionResult>;
  submitLabel: string;
  includeName?: boolean;
};

const initial: AuthActionResult = { ok: false };

export function AuthForm({ action, submitLabel, includeName }: Props) {
  const [state, formAction, pending] = useActionState(action, initial);

  return (
    <form action={formAction} className="space-y-4">
      {includeName ? (
        <label className="block space-y-1 text-sm">
          <span className="font-medium text-lab-navy">Nama (opsional)</span>
          <input
            name="name"
            type="text"
            autoComplete="name"
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
      ) : null}

      <label className="block space-y-1 text-sm">
        <span className="font-medium text-lab-navy">Email</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        />
      </label>

      <label className="block space-y-1 text-sm">
        <span className="font-medium text-lab-navy">Kata sandi</span>
        <input
          name="password"
          type="password"
          required
          minLength={6}
          autoComplete={includeName ? "new-password" : "current-password"}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        />
      </label>

      {state?.error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-lab-teal px-4 py-2.5 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-60"
      >
        {pending ? "Memproses…" : submitLabel}
      </button>
    </form>
  );
}
