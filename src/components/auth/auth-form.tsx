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
  const errorId = "auth-form-error";

  return (
    <form action={formAction} className="space-y-4" noValidate>
      {includeName ? (
        <div className="space-y-1.5 text-sm">
          <label htmlFor="auth-name" className="font-medium text-lab-navy">
            Nama (opsional)
          </label>
          <input
            id="auth-name"
            name="name"
            type="text"
            autoComplete="name"
            className="lab-input"
          />
        </div>
      ) : null}

      <div className="space-y-1.5 text-sm">
        <label htmlFor="auth-email" className="font-medium text-lab-navy">
          Email
        </label>
        <input
          id="auth-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          aria-invalid={state?.error ? true : undefined}
          aria-describedby={state?.error ? errorId : undefined}
          className="lab-input"
        />
      </div>

      <div className="space-y-1.5 text-sm">
        <label htmlFor="auth-password" className="font-medium text-lab-navy">
          Kata sandi
        </label>
        <input
          id="auth-password"
          name="password"
          type="password"
          required
          minLength={6}
          autoComplete={includeName ? "new-password" : "current-password"}
          aria-invalid={state?.error ? true : undefined}
          aria-describedby={state?.error ? errorId : undefined}
          className="lab-input"
        />
      </div>

      {state?.error ? (
        <p
          id={errorId}
          role="alert"
          className="rounded-xl bg-red-50 px-3 py-2.5 text-sm text-red-700 ring-1 ring-red-100"
        >
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        aria-busy={pending}
        className="lab-btn-primary w-full"
      >
        {pending ? "Memproses…" : submitLabel}
      </button>
    </form>
  );
}
