"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { PublicDomainRunnerView } from "@/domain/assessment";
import {
  earlyFinishAction,
  recordIntegrityEventAction,
  refreshRunnerViewAction,
  saveResponseAction,
  syncTimerCloseAction,
} from "@/app/actions/assessment";

type Props = {
  attemptId: string;
  initialView: PublicDomainRunnerView;
};

function formatRemaining(ms: number): string {
  if (ms <= 0) return "0:00";
  const totalSec = Math.ceil(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/** Calm focus chrome for domain runner (DESIGN.md R2 / motion.calm). */
export function DomainRunner({ attemptId, initialView }: Props) {
  const router = useRouter();
  const [view, setView] = useState(initialView);
  const [index, setIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [integrityWarning, setIntegrityWarning] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [nowMs, setNowMs] = useState(() => Date.now());

  const endsAtMs = useMemo(
    () => Date.parse(view.session.endsAt),
    [view.session.endsAt],
  );
  const graceEndsAtMs = useMemo(
    () => Date.parse(view.session.graceEndsAt),
    [view.session.graceEndsAt],
  );

  useEffect(() => {
    const id = window.setInterval(() => setNowMs(Date.now()), 250);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (view.session.status === "closed") return;

    const log = (type: "blur" | "visibility_hidden" | "focus_return") => {
      void recordIntegrityEventAction({
        attemptId,
        domainSessionId: view.session.id,
        type,
      });
    };

    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        setIntegrityWarning(
          "Anda meninggalkan tab asesmen. Kerjakan dengan jujur — sinyal ini dicatat untuk kualitas data, bukan diskualifikasi otomatis.",
        );
        log("visibility_hidden");
      } else {
        log("focus_return");
      }
    };

    const onBlur = () => {
      setIntegrityWarning(
        "Jendela asesmen kehilangan fokus. Tetap di halaman ini selama domain berlangsung.",
      );
      log("blur");
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("blur", onBlur);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("blur", onBlur);
    };
  }, [attemptId, view.session.id, view.session.status]);

  const remainingMs = endsAtMs - nowMs;
  const inGrace = nowMs >= endsAtMs && nowMs < graceEndsAtMs;
  const pastGrace = nowMs >= graceEndsAtMs;

  const refresh = useCallback(async () => {
    const result = await refreshRunnerViewAction(view.session.id);
    if (result.ok) setView(result.view);
  }, [view.session.id]);

  useEffect(() => {
    if (view.session.status === "closed") return;
    if (!pastGrace) return;

    startTransition(async () => {
      const result = await syncTimerCloseAction(view.session.id);
      if (result.ok) {
        setView(result.view);
      }
    });
  }, [pastGrace, view.session.id, view.session.status]);

  const item = view.items[index];
  const selected = item ? view.responses[item.id] : undefined;
  const answerProgress = Math.round(
    (view.answeredCount / Math.max(1, view.totalItems)) * 100,
  );

  function selectAnswer(answer: string) {
    if (!item || view.session.status === "closed") return;
    setError(null);
    setView((v) => ({
      ...v,
      responses: { ...v.responses, [item.id]: answer },
      answeredCount: Object.keys({ ...v.responses, [item.id]: answer }).length,
      canEarlyFinish:
        Object.keys({ ...v.responses, [item.id]: answer }).length ===
        v.totalItems,
    }));

    startTransition(async () => {
      const result = await saveResponseAction({
        sessionId: view.session.id,
        itemId: item.id,
        answer,
      });
      if (!result.ok) {
        setError(result.error);
        await refresh();
        return;
      }
      await refresh();
    });
  }

  function onEarlyFinish() {
    setError(null);
    startTransition(async () => {
      const result = await earlyFinishAction(view.session.id);
      if (!result.ok) {
        setError(result.error);
        await refresh();
        return;
      }
      router.push(`/asesmen/${attemptId}`);
      router.refresh();
    });
  }

  if (view.session.status === "closed") {
    return (
      <div className="lab-card space-y-4 p-6">
        <p className="lab-badge bg-lab-mint/70 text-lab-teal-deep ring-1 ring-lab-teal/15">
          Domain selesai
        </p>
        <h2 className="text-lg font-bold text-lab-navy">{view.domain.label}</h2>
        <p className="text-sm text-slate-600">
          Alasan tutup:{" "}
          <strong>
            {view.session.closeReason === "early_finish"
              ? "Selesai lebih awal"
              : "Waktu habis"}
          </strong>
        </p>
        <p className="text-sm text-slate-600">
          Skor mentah (internal): {view.session.rawCorrect ?? "—"} /{" "}
          {view.session.rawTotal ?? "—"} benar. Jawaban sudah dibekukan.
        </p>
        <button
          type="button"
          onClick={() => {
            router.push(`/asesmen/${attemptId}`);
            router.refresh();
          }}
          className="lab-btn-primary"
        >
          Kembali ke daftar domain
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Calm chrome header */}
      <div className="lab-card px-4 py-3 sm:px-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-bold text-lab-navy">{view.domain.label}</p>
            {view.domain.shortBlurb ? (
              <p className="text-xs text-slate-500">{view.domain.shortBlurb}</p>
            ) : null}
            <p className="mt-1 text-xs text-slate-500">
              {view.answeredCount}/{view.totalItems} dijawab · soal {index + 1}/
              {view.totalItems} · batas ±
              {Math.round(view.domain.timeLimitSeconds / 60)} mnt
            </p>
          </div>
          <div className="text-right">
            <p
              className={`font-mono text-2xl font-semibold tabular-nums ${
                remainingMs < 60_000 ? "text-red-600" : "text-lab-navy"
              }`}
              role="timer"
              aria-live="polite"
              aria-atomic="true"
              aria-label={
                inGrace
                  ? "Jendela grace aktif"
                  : `Sisa waktu ${formatRemaining(remainingMs)}`
              }
            >
              {inGrace ? "Grace" : formatRemaining(remainingMs)}
            </p>
            <p className="text-xs text-slate-500">
              {inGrace
                ? "Hanya perbarui jawaban yang sudah tersimpan"
                : "Sisa waktu (server)"}
            </p>
          </div>
        </div>
        <div className="lab-progress-track mt-3">
          <div
            className="lab-progress-fill"
            style={{ width: `${Math.max(3, answerProgress)}%` }}
          />
        </div>
      </div>

      <div className="rounded-xl border border-slate-100 bg-lab-mist/50 px-4 py-3 text-sm text-slate-700">
        <p className="font-medium text-lab-navy" id="domain-instruction-title">
          Petunjuk domain
        </p>
        <p className="mt-1" id="domain-instruction">
          {view.domain.instruction}
        </p>
      </div>

      {item ? (
        <fieldset
          className="lab-card p-5"
          aria-describedby="domain-instruction"
        >
          <legend className="text-sm font-medium leading-relaxed text-lab-navy">
            Soal {index + 1} dari {view.totalItems}: {item.prompt}
          </legend>
          <div
            className="mt-4 space-y-2"
            role="radiogroup"
            aria-label="Pilihan jawaban"
          >
            {item.choices.map((choice) => (
              <label
                key={choice.id}
                className={`lab-choice min-h-11 items-center ${
                  selected === choice.id ? "lab-choice-selected" : ""
                }`}
              >
                <input
                  type="radio"
                  name={item.id}
                  value={choice.id}
                  checked={selected === choice.id}
                  onChange={() => selectAnswer(choice.id)}
                  disabled={pending && !inGrace && pastGrace}
                  className="shrink-0"
                />
                <span>
                  <span className="font-semibold uppercase text-slate-400">
                    {choice.id}.
                  </span>{" "}
                  {choice.label}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}

      {integrityWarning ? (
        <p
          role="status"
          className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950"
        >
          {integrityWarning}
          <button
            type="button"
            className="ml-2 font-medium underline"
            onClick={() => setIntegrityWarning(null)}
          >
            Tutup
          </button>
        </p>
      ) : null}

      {error ? (
        <p
          role="alert"
          className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-100"
        >
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <button
            type="button"
            disabled={index === 0}
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            className="lab-btn-secondary !min-h-10 !px-3 text-sm disabled:opacity-40"
          >
            Sebelumnya
          </button>
          <button
            type="button"
            disabled={index >= view.items.length - 1}
            onClick={() =>
              setIndex((i) => Math.min(view.items.length - 1, i + 1))
            }
            className="lab-btn-secondary !min-h-10 !px-3 text-sm disabled:opacity-40"
          >
            Berikutnya
          </button>
        </div>

        <button
          type="button"
          disabled={!view.canEarlyFinish || pending}
          onClick={onEarlyFinish}
          className="lab-btn-navy"
        >
          Selesai domain
        </button>
      </div>

      <p className="text-xs text-slate-500">
        Jawaban tersimpan otomatis ke server. Setelah domain ditutup, jawaban
        dibekukan. Item tanpa jawaban saat waktu habis dihitung kosong/salah.
      </p>
    </div>
  );
}
