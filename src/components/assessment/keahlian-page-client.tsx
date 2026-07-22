"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FieldPicker } from "@/components/assessment/field-picker";
import { AbandonSkillButton } from "@/components/assessment/abandon-skill-button";
import { PageShell } from "@/components/ui/page-shell";
import type {
  KeahlianApiResponse,
  KeahlianViewDto,
} from "@/lib/assessment/keahlian-dto";

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

/**
 * Client-side loader: avoids production RSC digest masking.
 * Fetches /api/asesmen/:id/keahlian with credentials so cookies/JWT apply.
 */
export function KeahlianPageClient({ attemptId }: Props) {
  const router = useRouter();
  const nextPath = `/asesmen/${attemptId}/keahlian`;
  const [state, setState] = useState<LoadState>({ status: "loading" });

  const load = useCallback(async () => {
    setState({ status: "loading" });
    try {
      console.info("[ASSESSMENT] client fetch start", { attemptId });
      const res = await fetch(`/api/asesmen/${attemptId}/keahlian`, {
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
          message: `API_NON_JSON ${res.status}: ${text.slice(0, 500)}`,
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

      console.info("[ASSESSMENT] client fetch result", {
        httpStatus: res.status,
        ok: body.ok,
        kind: body.ok ? "ok" : body.kind,
        code: body.ok ? undefined : body.code,
      });

      if (res.status === 401 || (!body.ok && body.kind === "unauthenticated")) {
        router.replace(
          `/masuk?next=${encodeURIComponent(nextPath)}`,
        );
        return;
      }

      if (!body.ok && body.kind === "invalid_state" && body.redirectTo) {
        router.replace(body.redirectTo);
        return;
      }

      if (!body.ok) {
        setState({
          status: "error",
          code: body.code,
          message: body.message,
          detail: body.detail,
          httpStatus: res.status,
        });
        return;
      }

      setState({ status: "ok", view: body.view });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("[ASSESSMENT_FATAL] client", { attemptId, message });
      setState({
        status: "error",
        code: "CLIENT_FETCH_FAILED",
        message,
      });
    }
  }, [attemptId, nextPath, router]);

  useEffect(() => {
    void load();
  }, [load]);

  if (state.status === "loading") {
    return (
      <PageShell width="md" orbs="calm">
        <p className="lab-section-label">Langkah lanjutan</p>
        <h1 className="mt-1 text-2xl font-bold text-lab-navy">
          Asesmen keahlian bidang
        </h1>
        <p className="mt-4 text-sm text-slate-600">Memuat sesi &amp; data…</p>
      </PageShell>
    );
  }

  if (state.status === "error") {
    return (
      <PageShell width="md" orbs="calm">
        <p className="lab-section-label">Diagnostik</p>
        <h1 className="mt-1 text-2xl font-bold text-lab-navy">
          Tidak bisa memuat keahlian
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Error asli dari API (bukan digest RSC production). Salin teks di
          bawah.
        </p>
        <pre
          role="alert"
          className="mt-4 overflow-x-auto rounded-xl bg-slate-950 px-4 py-3 text-left text-xs leading-relaxed text-emerald-200 ring-1 ring-slate-800"
        >
          {`http: ${state.httpStatus ?? "n/a"}
code: ${state.code}

${state.message}${
            state.detail ? `\n\n--- detail ---\n${state.detail}` : ""
          }`}
        </pre>
        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" className="lab-btn-primary" onClick={() => void load()}>
            Coba lagi
          </button>
          <Link href="/dashboard" className="lab-btn-secondary">
            Ke dasbor
          </Link>
          <Link href="/masuk" className="lab-btn-ghost border border-slate-200">
            Masuk ulang
          </Link>
        </div>
      </PageShell>
    );
  }

  const { view } = state;
  const openSkill = view.openSkill;

  return (
    <PageShell width="md" orbs="calm">
      <Link
        href={`/asesmen/${attemptId}/hasil`}
        className="text-sm font-semibold text-lab-teal hover:underline"
      >
        ← Kembali ke hasil asesmen
      </Link>
      <div className="mt-4">
        <p className="lab-section-label">Langkah lanjutan</p>
        <h1 className="mt-1 text-2xl font-bold text-lab-navy sm:text-3xl">
          Asesmen keahlian bidang
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Pilih kategori, lalu role/bidang pekerjaan. Soal menyesuaikan dengan
          bidang yang Anda pilih. Rekomendasi disusun dari profil 9 domain Anda.
        </p>
        <p className="mt-2 font-mono text-[10px] text-slate-400">
          session={view.diagnostics.userId.slice(0, 8)}… refreshed=
          {view.diagnostics.refreshed ? "1" : "0"} via=api
        </p>
      </div>

      {view.openForThisSource && openSkill ? (
        <section className="mt-6 rounded-[1.25rem] border border-lab-teal/25 bg-gradient-to-br from-lab-mint/50 to-white p-4 sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-lab-teal-deep">
            Sesi keahlian berjalan
          </p>
          <p className="mt-1 text-sm font-semibold text-lab-navy">
            {openSkill.fieldLabel}
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            <Link
              href={`/asesmen/${attemptId}/keahlian/${openSkill.fieldId}/sesi?sid=${openSkill.id}`}
              className="lab-btn-primary"
            >
              Lanjutkan sesi
            </Link>
            <AbandonSkillButton
              skillAttemptId={openSkill.id}
              sourceAttemptId={attemptId}
            />
          </div>
        </section>
      ) : null}

      {view.openOtherSource && openSkill ? (
        <section className="mt-6 rounded-[1.25rem] border border-amber-200 bg-amber-50 p-4 sm:p-5">
          <p className="text-sm font-semibold text-lab-navy">
            Ada sesi keahlian di hasil asesmen lain
          </p>
          <p className="mt-1 text-xs text-slate-600">
            Bidang <strong>{openSkill.fieldLabel}</strong> masih terbuka pada
            attempt lain.
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            <Link
              href={`/asesmen/${openSkill.sourceAttemptId}/keahlian/${openSkill.fieldId}/sesi?sid=${openSkill.id}`}
              className="lab-btn-primary"
            >
              Lanjutkan di attempt itu
            </Link>
            <AbandonSkillButton
              skillAttemptId={openSkill.id}
              sourceAttemptId={openSkill.sourceAttemptId}
            />
          </div>
        </section>
      ) : null}

      {view.skillSnapshots.length > 0 ? (
        <section className="mt-6 lab-card p-4">
          <h2 className="text-sm font-bold text-lab-navy">
            Hasil keahlian sebelumnya
          </h2>
          <ul className="mt-2 space-y-2 text-sm">
            {view.skillSnapshots.map((s) => (
              <li key={s.id} className="flex flex-wrap justify-between gap-2">
                <Link
                  href={`/asesmen/${attemptId}/keahlian/${s.fieldId}/hasil`}
                  className="font-medium text-lab-teal hover:underline"
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
            Pemilihan bidang baru dinonaktifkan sampai sesi keahlian terbuka
            diselesaikan atau dibatalkan.
          </p>
        ) : (
          <FieldPicker
            sourceAttemptId={attemptId}
            recommendedFieldIds={view.recommended}
            completedFieldIds={view.completedFieldIds}
          />
        )}
      </div>
    </PageShell>
  );
}
