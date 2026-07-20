"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import type { PublicSkillRunnerView } from "@/domain/assessment/skill/types";
import {
  completeSkillAttemptAction,
  saveSkillResponseAction,
} from "@/app/actions/skill-assessment";

type Props = {
  initialView: PublicSkillRunnerView;
};

type SaveStatus = "idle" | "saving" | "saved" | "error";

function formatRemaining(ms: number): string {
  if (ms <= 0) return "0:00";
  const totalSec = Math.ceil(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function SkillRunner({ initialView }: Props) {
  const [view, setView] = useState(initialView);
  const [index, setIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [closing, startClose] = useTransition();
  const [nowMs, setNowMs] = useState(() => Date.parse(initialView.serverNow));
  const [clockLive, setClockLive] = useState(false);
  const savedFlashRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const endsAtMs = useMemo(() => Date.parse(view.endsAt), [view.endsAt]);

  useEffect(() => {
    setClockLive(true);
    setNowMs(Date.now());
    const id = window.setInterval(() => setNowMs(Date.now()), 250);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    return () => {
      if (savedFlashRef.current) clearTimeout(savedFlashRef.current);
    };
  }, []);

  const remaining = Math.max(0, endsAtMs - nowMs);
  const timedOut = remaining <= 0;
  const item = view.items[index];
  const answer = item ? view.responses[item.id] : undefined;
  const allAnswered = view.answeredCount >= view.itemCount;
  const progressPct = Math.round(
    (view.answeredCount / Math.max(1, view.itemCount)) * 100,
  );

  const flashSaved = useCallback(() => {
    setSaveStatus("saved");
    if (savedFlashRef.current) clearTimeout(savedFlashRef.current);
    savedFlashRef.current = setTimeout(() => setSaveStatus("idle"), 1400);
  }, []);

  const selectAnswer = useCallback(
    async (itemId: string, choiceId: string) => {
      if (view.status !== "in_progress") return;
      setError(null);
      setSaveStatus("saving");
      setView((v) => {
        const responses = { ...v.responses, [itemId]: choiceId };
        return {
          ...v,
          responses,
          answeredCount: Object.keys(responses).length,
        };
      });
      const res = await saveSkillResponseAction({
        skillAttemptId: view.skillAttemptId,
        itemId,
        answer: choiceId,
      });
      if (!res.ok) {
        setError(res.error);
        setSaveStatus("error");
        return;
      }
      flashSaved();
    },
    [view.skillAttemptId, view.status, flashSaved],
  );

  const finish = () => {
    startClose(async () => {
      setError(null);
      const res = await completeSkillAttemptAction(
        view.skillAttemptId,
        view.sourceAttemptId,
        view.fieldId,
      );
      if (!res.ok) setError(res.error);
    });
  };

  if (!item) {
    return (
      <p className="lab-card p-4 text-sm text-slate-600">Tidak ada soal.</p>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      <header className="lab-card relative overflow-hidden p-4 sm:p-5">
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-lab-mint/40 via-transparent to-lab-sky/15"
          aria-hidden
        />
        <div className="relative flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-lab-teal">
              {view.categoryLabel}
            </p>
            <h1 className="mt-1 text-lg font-bold text-lab-navy sm:text-xl">
              {view.fieldLabel}
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Soal {index + 1} dari {view.itemCount} · dijawab{" "}
              {view.answeredCount}/{view.itemCount}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div
              className={`rounded-xl px-3 py-2 text-center ring-1 ${
                timedOut
                  ? "bg-red-50 ring-red-100"
                  : remaining < 60_000
                    ? "bg-amber-50 ring-amber-100"
                    : "bg-white/80 ring-slate-100"
              }`}
            >
              <p className="text-[10px] font-semibold uppercase text-slate-500">
                Sisa waktu
              </p>
              <p
                className={`font-mono text-xl font-bold tabular-nums ${
                  timedOut || remaining < 60_000
                    ? "text-red-600"
                    : "text-lab-navy"
                }`}
              >
                {clockLive ? formatRemaining(remaining) : "—"}
              </p>
            </div>
            <p className="text-[10px] text-slate-500" aria-live="polite">
              {saveStatus === "saving"
                ? "Menyimpan…"
                : saveStatus === "saved"
                  ? "Tersimpan"
                  : saveStatus === "error"
                    ? "Gagal simpan"
                    : "\u00a0"}
            </p>
          </div>
        </div>

        <div className="relative mt-4">
          <div className="lab-progress-track">
            <div
              className="lab-progress-fill bg-gradient-to-r from-lab-teal to-lab-sky"
              style={{ width: `${Math.max(4, progressPct)}%` }}
            />
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {view.items.map((it, i) => {
              const answered = Boolean(view.responses[it.id]);
              const current = i === index;
              return (
                <button
                  key={it.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={`h-2.5 w-2.5 rounded-full transition ${
                    current
                      ? "scale-125 bg-lab-teal ring-2 ring-lab-teal/30"
                      : answered
                        ? "bg-lab-teal/70"
                        : "bg-slate-200"
                  }`}
                  aria-label={`Soal ${i + 1}${answered ? ", terjawab" : ""}`}
                />
              );
            })}
          </div>
        </div>
      </header>

      <p className="text-sm leading-relaxed text-slate-600">{view.instruction}</p>

      <section className="lab-card animate-fade-up p-5 sm:p-6">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          Pertanyaan {index + 1}
        </p>
        <p className="mt-2 whitespace-pre-wrap text-base font-medium leading-relaxed text-lab-navy">
          {item.prompt}
        </p>
        <ul className="mt-5 space-y-2.5">
          {item.choices.map((c) => {
            const selected = answer === c.id;
            return (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => selectAnswer(item.id, c.id)}
                  className={`lab-choice w-full text-left ${
                    selected ? "lab-choice-selected" : ""
                  }`}
                >
                  <span
                    className={`mr-2.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-bold uppercase ${
                      selected
                        ? "bg-lab-teal text-white"
                        : "bg-lab-mist text-lab-teal"
                    }`}
                  >
                    {c.id}
                  </span>
                  <span className="text-sm leading-snug text-slate-800">
                    {c.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="lab-btn-secondary"
          disabled={index === 0}
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
        >
          Sebelumnya
        </button>
        {index < view.itemCount - 1 ? (
          <button
            type="button"
            className="lab-btn-secondary"
            onClick={() => setIndex((i) => Math.min(view.itemCount - 1, i + 1))}
          >
            Berikutnya
          </button>
        ) : null}
        <button
          type="button"
          className="lab-btn-primary ml-auto"
          disabled={closing || !allAnswered}
          onClick={finish}
        >
          {closing ? "Menyimpan hasil…" : "Selesai & lihat hasil"}
        </button>
      </div>

      {!allAnswered ? (
        <p className="text-xs text-slate-500">
          Jawab semua {view.itemCount} soal sebelum menyelesaikan (
          {view.itemCount - view.answeredCount} tersisa).
        </p>
      ) : (
        <p className="text-xs font-medium text-lab-teal">
          Semua soal terjawab — Anda bisa menyelesaikan sesi.
        </p>
      )}

      {error ? (
        <p
          role="alert"
          className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-100"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
