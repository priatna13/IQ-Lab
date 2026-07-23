"use client";

import {
  Component,
  useCallback,
  useEffect,
  useState,
  type ErrorInfo,
  type ReactNode,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FIELD_CATEGORIES,
  FIELD_DEFS,
} from "@/domain/assessment/skill/field-catalog";
import type { FieldCategoryId, FieldId } from "@/domain/assessment/skill/types";
import {
  startSkillAttemptAction,
  abandonSkillAttemptAction,
  type StartSkillResult,
} from "@/app/actions/skill-assessment";
import type {
  KeahlianApiResponse,
  KeahlianViewDto,
} from "@/lib/assessment/keahlian-types";
import { useActionState, useMemo, useTransition } from "react";

type Props = {
  attemptId: string;
};

type LoadState =
  | { status: "loading" }
  | { status: "ok"; view: KeahlianViewDto }
  | {
      status: "error";
      code: string;
      message: string;
      detail?: string;
      httpStatus?: number;
    };

/** Catches render errors so segment error.tsx never shows opaque RSC digests. */
class LocalBoundary extends Component<
  { children: ReactNode; attemptId: string },
  { error: Error | null }
> {
  state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[KEAHLIAN_RENDER]", {
      attemptId: this.props.attemptId,
      message: error.message,
      stack: error.stack,
      componentStack: info.componentStack,
    });
  }

  render() {
    if (this.state.error) {
      const e = this.state.error;
      return (
        <Shell>
          <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
            Diagnostik
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            Gagal merender keahlian
          </h1>
          <pre className="mt-4 overflow-x-auto rounded-xl bg-slate-950 px-4 py-3 text-left text-xs text-emerald-200">
            {`code: CLIENT_RENDER_ERROR\nmessage: ${e.message}\n\n${(e.stack ?? "").slice(0, 600)}`}
          </pre>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              className="rounded-full bg-teal-600 px-4 py-2 text-sm font-semibold text-white"
              onClick={() => this.setState({ error: null })}
            >
              Coba lagi
            </button>
            <Link
              href="/dashboard"
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800"
            >
              Ke dasbor
            </Link>
          </div>
        </Shell>
      );
    }
    return this.props.children;
  }
}

function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto min-h-[70dvh] w-full max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
      {children}
    </div>
  );
}

function AbandonButton({
  skillAttemptId,
  sourceAttemptId,
}: {
  skillAttemptId: string;
  sourceAttemptId: string;
}) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      <button
        type="button"
        className="w-full rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 sm:w-auto"
        disabled={pending}
        onClick={() => {
          if (
            !window.confirm(
              "Batalkan asesmen keahlian ini? Jawaban belum selesai tidak akan disimpan sebagai hasil.",
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
              if (res && !res.ok) setError(res.error ?? "Gagal membatalkan");
            } catch {
              // redirect in progress
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

const initialStart: StartSkillResult = { ok: false };

function InlineFieldPicker({
  sourceAttemptId,
  recommendedFieldIds,
  completedFieldIds,
}: {
  sourceAttemptId: string;
  recommendedFieldIds: FieldId[];
  completedFieldIds: FieldId[];
}) {
  const [state, formAction, pending] = useActionState(
    startSkillAttemptAction,
    initialStart,
  );
  const [openCategory, setOpenCategory] = useState<FieldCategoryId | null>(
    () => {
      const rec = FIELD_DEFS.find((f) => recommendedFieldIds.includes(f.id));
      return rec?.categoryId ?? FIELD_CATEGORIES[0]?.id ?? null;
    },
  );
  const [selected, setSelected] = useState<FieldId | "">("");

  const recommendedSet = useMemo(
    () => new Set(recommendedFieldIds ?? []),
    [recommendedFieldIds],
  );
  const completedSet = useMemo(
    () => new Set(completedFieldIds ?? []),
    [completedFieldIds],
  );

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="sourceAttemptId" value={sourceAttemptId} />
      <input type="hidden" name="fieldId" value={selected} />

      {(recommendedFieldIds ?? []).length > 0 ? (
        <div className="rounded-2xl border border-teal-200 bg-teal-50/40 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-teal-800">
            Cocok dengan profil Anda
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {(recommendedFieldIds ?? []).map((id, i) => {
              const def = FIELD_DEFS.find((f) => f.id === id);
              if (!def) return null;
              const active = selected === id;
              return (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => {
                      setOpenCategory(def.categoryId);
                      setSelected(id);
                    }}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium ring-1 ${
                      active
                        ? "bg-teal-600 text-white ring-teal-600"
                        : "bg-white text-teal-800 ring-teal-200"
                    }`}
                  >
                    #{i + 1} {def.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      <div className="space-y-3">
        {FIELD_CATEGORIES.map((cat) => {
          const fields = FIELD_DEFS.filter((f) => f.categoryId === cat.id);
          const isOpen = openCategory === cat.id;
          return (
            <div
              key={cat.id}
              className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm"
            >
              <button
                type="button"
                className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
                onClick={() => setOpenCategory(isOpen ? null : cat.id)}
              >
                <span>
                  <span className="font-semibold text-slate-900">{cat.label}</span>
                  <span className="mt-0.5 block text-xs text-slate-500">
                    {cat.shortBlurb}
                  </span>
                </span>
                <span className="text-teal-700">{isOpen ? "▴" : "▾"}</span>
              </button>
              {isOpen ? (
                <ul className="space-y-2 border-t border-slate-100 px-3 py-3">
                  {fields.map((field) => {
                    const done = completedSet.has(field.id);
                    const rec = recommendedSet.has(field.id);
                    const active = selected === field.id;
                    return (
                      <li key={field.id}>
                        <label
                          className={`flex cursor-pointer gap-3 rounded-xl px-3 py-2 ring-1 ${
                            active
                              ? "bg-teal-50 ring-teal-300"
                              : "bg-slate-50 ring-slate-100"
                          } ${done ? "cursor-not-allowed opacity-60" : ""}`}
                        >
                          <input
                            type="radio"
                            name="field_select"
                            value={field.id}
                            disabled={done}
                            checked={active}
                            onChange={() => setSelected(field.id)}
                            className="mt-1"
                          />
                          <span className="text-sm">
                            <span className="font-medium text-slate-900">
                              {field.label}
                            </span>
                            <span className="mt-0.5 block text-xs text-slate-500">
                              {field.shortBlurb}
                            </span>
                            {rec ? (
                              <span className="mt-1 inline-block text-[10px] font-semibold text-teal-700">
                                Direkomendasikan
                              </span>
                            ) : null}
                            {done ? (
                              <span className="mt-1 inline-block text-[10px] font-semibold text-slate-500">
                                Sudah selesai
                              </span>
                            ) : null}
                          </span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </div>
          );
        })}
      </div>

      {state?.error ? (
        <p
          role="alert"
          className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={
          pending || !selected || completedSet.has(selected as FieldId)
        }
        className="w-full rounded-full bg-teal-600 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
      >
        {pending
          ? "Memulai…"
          : selected
            ? `Mulai: ${FIELD_DEFS.find((f) => f.id === selected)?.label ?? selected}`
            : "Pilih role dulu"}
      </button>
    </form>
  );
}

function KeahlianBody({ attemptId }: Props) {
  const router = useRouter();
  const nextPath = `/asesmen/${attemptId}/keahlian`;
  const [state, setState] = useState<LoadState>({ status: "loading" });

  const load = useCallback(async () => {
    setState({ status: "loading" });
    try {
      const res = await fetch(`/api/asesmen/${encodeURIComponent(attemptId)}/keahlian`, {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      const text = await res.text();
      let body: KeahlianApiResponse | null = null;
      try {
        body = text ? (JSON.parse(text) as KeahlianApiResponse) : null;
      } catch {
        setState({
          status: "error",
          code: "API_NON_JSON",
          message: `API_NON_JSON ${res.status}: ${text.slice(0, 400)}`,
          httpStatus: res.status,
        });
        return;
      }

      if (!body) {
        setState({
          status: "error",
          code: "API_EMPTY",
          message: `API_EMPTY status=${res.status}`,
          httpStatus: res.status,
        });
        return;
      }

      if (res.status === 401 || (!body.ok && body.kind === "unauthenticated")) {
        router.replace(`/masuk?next=${encodeURIComponent(nextPath)}`);
        return;
      }

      if (!body.ok && body.kind === "invalid_state" && body.redirectTo) {
        router.replace(body.redirectTo);
        return;
      }

      if (!body.ok) {
        setState({
          status: "error",
          code: body.code ?? "UNKNOWN",
          message: body.message ?? "Gagal memuat",
          detail: body.detail,
          httpStatus: res.status,
        });
        return;
      }

      setState({ status: "ok", view: body.view });
    } catch (err) {
      setState({
        status: "error",
        code: "CLIENT_FETCH_FAILED",
        message: err instanceof Error ? err.message : String(err),
      });
    }
  }, [attemptId, nextPath, router]);

  useEffect(() => {
    void load();
  }, [load]);

  if (state.status === "loading") {
    return (
      <Shell>
        <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
          Langkah lanjutan
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          Asesmen keahlian bidang
        </h1>
        <p className="mt-4 text-sm text-slate-600">Memuat data dari API…</p>
        <p className="mt-2 font-mono text-[10px] text-slate-400">
          attemptId={attemptId} · boot=v2-inline
        </p>
      </Shell>
    );
  }

  if (state.status === "error") {
    return (
      <Shell>
        <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
          Diagnostik
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          Tidak bisa memuat keahlian
        </h1>
        <pre
          role="alert"
          className="mt-4 overflow-x-auto rounded-xl bg-slate-950 px-4 py-3 text-left text-xs text-emerald-200"
        >
          {`http: ${state.httpStatus ?? "n/a"}
code: ${state.code}

${state.message}${state.detail ? `\n\n--- detail ---\n${state.detail}` : ""}`}
        </pre>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            className="rounded-full bg-teal-600 px-4 py-2 text-sm font-semibold text-white"
            onClick={() => void load()}
          >
            Coba lagi
          </button>
          <Link
            href="/dashboard"
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800"
          >
            Ke dasbor
          </Link>
          <Link
            href="/masuk"
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800"
          >
            Masuk ulang
          </Link>
        </div>
      </Shell>
    );
  }

  const { view } = state;
  const openSkill = view.openSkill;
  const userId = view.diagnostics?.userId ?? "";

  return (
    <Shell>
      <Link
        href={`/asesmen/${attemptId}/hasil`}
        className="text-sm font-semibold text-teal-700 hover:underline"
      >
        ← Kembali ke hasil asesmen
      </Link>
      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
          Langkah lanjutan
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
          Asesmen keahlian bidang
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Pilih kategori, lalu role/bidang pekerjaan.
        </p>
        <p className="mt-2 font-mono text-[10px] text-slate-400">
          session={userId ? `${userId.slice(0, 8)}…` : "?"} · via=api · boot=v2
        </p>
      </div>

      {view.openForThisSource && openSkill ? (
        <section className="mt-6 rounded-2xl border border-teal-200 bg-teal-50/50 p-4">
          <p className="text-xs font-semibold uppercase text-teal-800">
            Sesi keahlian berjalan
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-900">
            {openSkill.fieldLabel}
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Link
              href={`/asesmen/${attemptId}/keahlian/${openSkill.fieldId}/sesi?sid=${openSkill.id}`}
              className="rounded-full bg-teal-600 px-4 py-2 text-center text-sm font-semibold text-white"
            >
              Lanjutkan sesi
            </Link>
            <AbandonButton
              skillAttemptId={openSkill.id}
              sourceAttemptId={attemptId}
            />
          </div>
        </section>
      ) : null}

      {view.openOtherSource && openSkill ? (
        <section className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-slate-900">
            Ada sesi keahlian di hasil asesmen lain
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <Link
              href={`/asesmen/${openSkill.sourceAttemptId}/keahlian/${openSkill.fieldId}/sesi?sid=${openSkill.id}`}
              className="rounded-full bg-teal-600 px-4 py-2 text-center text-sm font-semibold text-white"
            >
              Lanjutkan di attempt itu
            </Link>
            <AbandonButton
              skillAttemptId={openSkill.id}
              sourceAttemptId={openSkill.sourceAttemptId}
            />
          </div>
        </section>
      ) : null}

      {(view.skillSnapshots ?? []).length > 0 ? (
        <section className="mt-6 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900">
            Hasil keahlian sebelumnya
          </h2>
          <ul className="mt-2 space-y-2 text-sm">
            {view.skillSnapshots.map((s) => (
              <li key={s.id} className="flex flex-wrap justify-between gap-2">
                <Link
                  href={`/asesmen/${attemptId}/keahlian/${s.fieldId}/hasil`}
                  className="font-medium text-teal-700 hover:underline"
                >
                  {s.fieldLabel}
                </Link>
                <span className="font-mono tabular-nums text-slate-600">
                  {s.score}/100
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="mt-8">
        {openSkill ? (
          <p className="mb-4 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600 ring-1 ring-slate-100">
            Pemilihan bidang baru dinonaktifkan sampai sesi terbuka selesai atau
            dibatalkan.
          </p>
        ) : (
          <InlineFieldPicker
            sourceAttemptId={attemptId}
            recommendedFieldIds={view.recommended ?? []}
            completedFieldIds={view.completedFieldIds ?? []}
          />
        )}
      </div>
    </Shell>
  );
}

/**
 * Single client entry for /keahlian — no dynamic import, no useParams,
 * local error boundary, API-only data. Server page only passes attemptId.
 */
export function KeahlianPickerClient({ attemptId }: Props) {
  const id = typeof attemptId === "string" ? attemptId.trim() : "";
  if (!id || id.length < 8) {
    return (
      <Shell>
        <h1 className="text-xl font-bold text-slate-900">Attempt tidak valid</h1>
        <p className="mt-2 text-sm text-slate-600">attemptId={String(attemptId)}</p>
        <Link href="/dashboard" className="mt-4 inline-block text-teal-700">
          Ke dasbor
        </Link>
      </Shell>
    );
  }

  return (
    <LocalBoundary attemptId={id}>
      <KeahlianBody attemptId={id} />
    </LocalBoundary>
  );
}
