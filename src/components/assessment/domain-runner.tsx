"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";
import type { PublicDomainRunnerView } from "@/domain/assessment";
import {
  applyOptimisticAnswer,
  isSaveStillCurrent,
  mergeServerResponsesWithPending,
} from "@/domain/assessment/response-save-coordinator";
import { getDomainVisual } from "@/domain/assessment/domain-visual";
import {
  earlyFinishAction,
  recordIntegrityEventAction,
  refreshRunnerViewAction,
  saveResponseAction,
  saveResponsesBatchAction,
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

type SaveStatus = "idle" | "saving" | "saved" | "error";

/** Calm focus chrome for domain runner (DESIGN.md R2 / motion.calm). */
export function DomainRunner({ attemptId, initialView }: Props) {
  const router = useRouter();
  const [view, setView] = useState(initialView);
  const [index, setIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [integrityWarning, setIntegrityWarning] = useState<string | null>(null);
  const [closing, startCloseTransition] = useTransition();
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [celebrating, setCelebrating] = useState(false);
  /**
   * SSR + first client paint must share the same clock snapshot (view.serverNow).
   * Live Date.now() only after mount — avoids hydration mismatch on the timer text.
   */
  const [nowMs, setNowMs] = useState(() => Date.parse(initialView.serverNow));
  const [clockLive, setClockLive] = useState(false);
  const domainVisual = getDomainVisual(view.domain.id);

  /** Latest answer the user intends per item (wins over in-flight older saves). */
  const latestIntendedRef = useRef<Record<string, string>>({
    ...initialView.responses,
  });
  /** Item ids with an in-flight save request. */
  const inFlightRef = useRef<Set<string>>(new Set());
  /** Outstanding save requests per item (supports rapid re-select). */
  const inFlightDepthRef = useRef<Map<string, number>>(new Map());
  const inFlightCountRef = useRef(0);
  const savedFlashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timerCloseStartedRef = useRef(false);
  /** Debounce network save per item so rapid re-selects only hit the server once. */
  const saveDebounceRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map(),
  );

  const SAVE_DEBOUNCE_MS = 140;

  const endsAtMs = useMemo(
    () => Date.parse(view.session.endsAt),
    [view.session.endsAt],
  );
  const graceEndsAtMs = useMemo(
    () => Date.parse(view.session.graceEndsAt),
    [view.session.graceEndsAt],
  );

  useEffect(() => {
    setClockLive(true);
    setNowMs(Date.now());
    const id = window.setInterval(() => setNowMs(Date.now()), 250);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (clockLive) return;
    setNowMs(Date.parse(view.serverNow));
  }, [view.serverNow, clockLive]);

  useEffect(() => {
    return () => {
      if (savedFlashTimerRef.current) clearTimeout(savedFlashTimerRef.current);
      for (const t of saveDebounceRef.current.values()) clearTimeout(t);
      saveDebounceRef.current.clear();
    };
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

  const applyServerViewPreservingInFlight = useCallback(
    (serverView: PublicDomainRunnerView) => {
      const mergedResponses = mergeServerResponsesWithPending(
        serverView.responses,
        latestIntendedRef.current,
        inFlightRef.current,
      );
      const answeredCount = Object.keys(mergedResponses).length;
      setView({
        ...serverView,
        responses: mergedResponses,
        answeredCount,
        canEarlyFinish:
          serverView.session.status === "in_progress" &&
          answeredCount === serverView.totalItems,
      });
    },
    [],
  );

  const refresh = useCallback(async () => {
    const result = await refreshRunnerViewAction(view.session.id);
    if (result.ok) applyServerViewPreservingInFlight(result.view);
  }, [view.session.id, applyServerViewPreservingInFlight]);

  useEffect(() => {
    if (view.session.status === "closed") {
      timerCloseStartedRef.current = false;
      return;
    }
    if (!pastGrace) return;
    if (timerCloseStartedRef.current) return;
    timerCloseStartedRef.current = true;

    startCloseTransition(async () => {
      const result = await syncTimerCloseAction(view.session.id);
      if (result.ok) {
        applyServerViewPreservingInFlight(result.view);
        if (result.view.session.status !== "closed") {
          // Server clock not past grace yet — allow a later retry.
          timerCloseStartedRef.current = false;
        }
      } else {
        timerCloseStartedRef.current = false;
      }
    });
  }, [
    pastGrace,
    view.session.id,
    view.session.status,
    applyServerViewPreservingInFlight,
  ]);

  const item = view.items[index];
  const selected = item ? view.responses[item.id] : undefined;
  const answerProgress = Math.round(
    (view.answeredCount / Math.max(1, view.totalItems)) * 100,
  );

  function recomputeInFlightCount() {
    let total = 0;
    for (const n of inFlightDepthRef.current.values()) total += n;
    inFlightCountRef.current = total;
    inFlightRef.current = new Set(inFlightDepthRef.current.keys());
    return total;
  }

  function markInFlight(itemId: string, active: boolean) {
    const depth = inFlightDepthRef.current.get(itemId) ?? 0;
    if (active) {
      inFlightDepthRef.current.set(itemId, depth + 1);
    } else if (depth <= 1) {
      inFlightDepthRef.current.delete(itemId);
    } else {
      inFlightDepthRef.current.set(itemId, depth - 1);
    }
    const total = recomputeInFlightCount();
    if (total > 0) {
      setSaveStatus("saving");
    }
  }

  function flashSaved() {
    if (inFlightCountRef.current > 0) {
      setSaveStatus("saving");
      return;
    }
    setSaveStatus("saved");
    if (savedFlashTimerRef.current) clearTimeout(savedFlashTimerRef.current);
    savedFlashTimerRef.current = setTimeout(() => {
      if (inFlightCountRef.current === 0) setSaveStatus("idle");
    }, 1500);
  }

  function clearSaveDebounce(itemId?: string) {
    if (itemId) {
      const t = saveDebounceRef.current.get(itemId);
      if (t) clearTimeout(t);
      saveDebounceRef.current.delete(itemId);
      return;
    }
    for (const t of saveDebounceRef.current.values()) clearTimeout(t);
    saveDebounceRef.current.clear();
  }

  async function persistAnswerToServer(
    sessionId: string,
    itemId: string,
    answer: string,
  ) {
    if (!isSaveStillCurrent(latestIntendedRef.current, itemId, answer)) {
      return;
    }
    markInFlight(itemId, true);
    let failed = false;
    try {
      const result = await saveResponseAction({
        sessionId,
        itemId,
        answer,
      });

      if (!isSaveStillCurrent(latestIntendedRef.current, itemId, answer)) {
        return;
      }

      if (!result.ok) {
        failed = true;
        setError(result.error);
        setSaveStatus("error");
        // Keep optimistic answer; "Selesai domain" will flush again.
        return;
      }
    } catch {
      if (!isSaveStillCurrent(latestIntendedRef.current, itemId, answer)) {
        return;
      }
      failed = true;
      setError("Gagal menyimpan jawaban. Coba pilih lagi.");
      setSaveStatus("error");
    } finally {
      markInFlight(itemId, false);
      if (
        !failed &&
        isSaveStillCurrent(latestIntendedRef.current, itemId, answer) &&
        inFlightCountRef.current === 0
      ) {
        flashSaved();
      } else if (failed && inFlightCountRef.current === 0) {
        setSaveStatus("error");
      }
    }
  }

  function selectAnswer(answer: string) {
    if (!item || view.session.status === "closed") return;
    setError(null);

    const itemId = item.id;
    const sessionId = view.session.id;

    latestIntendedRef.current[itemId] = answer;
    const optimistic = applyOptimisticAnswer(
      view.totalItems,
      // Use latest map so concurrent items don't clobber each other via stale closure
      { ...latestIntendedRef.current },
      itemId,
      answer,
    );
    // Keep latestIntended in sync with full map keys
    latestIntendedRef.current = { ...optimistic.responses };

    setView((v) => ({
      ...v,
      responses: optimistic.responses,
      answeredCount: optimistic.answeredCount,
      canEarlyFinish: optimistic.canEarlyFinish,
    }));

    // Debounce network: UI feels instant; last choice within 140ms is saved once.
    clearSaveDebounce(itemId);
    setSaveStatus((s) => (s === "error" ? "idle" : s));
    const timer = setTimeout(() => {
      saveDebounceRef.current.delete(itemId);
      const latest = latestIntendedRef.current[itemId];
      if (!latest) return;
      void persistAnswerToServer(sessionId, itemId, latest);
    }, SAVE_DEBOUNCE_MS);
    saveDebounceRef.current.set(itemId, timer);
  }

  async function waitForInFlightSaves(timeoutMs = 12_000) {
    const start = Date.now();
    while (inFlightCountRef.current > 0 && Date.now() - start < timeoutMs) {
      await new Promise((r) => setTimeout(r, 50));
    }
  }

  async function waitForDebouncedSaves(timeoutMs = 2_000) {
    const start = Date.now();
    while (
      saveDebounceRef.current.size > 0 &&
      Date.now() - start < timeoutMs
    ) {
      await new Promise((r) => setTimeout(r, 30));
    }
  }

  /** Ensure every optimistic answer is on the server before closing the domain. */
  async function flushIntendedAnswersToServer(): Promise<boolean> {
    // Cancel pending debounces — batch write is the source of truth for finish.
    clearSaveDebounce();
    const answers = Object.entries(latestIntendedRef.current).map(
      ([itemId, answer]) => ({ itemId, answer }),
    );
    if (answers.length === 0) return true;
    setSaveStatus("saving");
    const batch = await saveResponsesBatchAction({
      sessionId: view.session.id,
      answers,
    });
    if (!batch.ok) {
      setError(batch.error);
      setSaveStatus("error");
      return false;
    }
    flashSaved();
    return true;
  }

  function onEarlyFinish() {
    setError(null);
    startCloseTransition(async () => {
      clearSaveDebounce();
      await waitForDebouncedSaves(500);
      await waitForInFlightSaves(4_000);
      // Final flush: one multi-row upsert for all intended answers
      let flushed = await flushIntendedAnswersToServer();
      if (!flushed) {
        await waitForInFlightSaves(2_000);
        flushed = await flushIntendedAnswersToServer();
        if (!flushed) return;
      }
      await waitForInFlightSaves(3_000);

      let result = await earlyFinishAction(view.session.id);
      if (!result.ok) {
        // Retry once after another flush (server may have lagged behind UI)
        await waitForInFlightSaves(2_000);
        const retryFlush = await flushIntendedAnswersToServer();
        if (retryFlush) {
          result = await earlyFinishAction(view.session.id);
        }
      }
      if (!result.ok) {
        setError(result.error);
        await refresh();
        return;
      }
      // Brief success moment (expressive calm) after saves flushed
      setCelebrating(true);
      const reduce =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      await new Promise((r) => setTimeout(r, reduce ? 200 : 900));
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

  const saveStatusLabel =
    saveStatus === "saving"
      ? "Menyimpan…"
      : saveStatus === "saved"
        ? "Tersimpan"
        : saveStatus === "error"
          ? "Gagal simpan — coba lagi"
          : null;

  const timerUrgent = remainingMs < 30_000 && remainingMs > 0 && !inGrace;

  if (celebrating) {
    return (
      <div
        className="lab-card flex flex-col items-center gap-3 p-10 text-center"
        role="status"
        aria-live="polite"
      >
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${domainVisual.accentBar} text-2xl font-bold text-white shadow-soft`}
          aria-hidden
        >
          ✓
        </div>
        <h2 className="text-lg font-bold text-lab-navy">Domain selesai</h2>
        <p className="text-sm text-slate-600">{view.domain.label}</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Expressive-calm chrome (DESIGN.md R3) — logic unchanged */}
      <div className="lab-card overflow-hidden px-3 py-3 sm:px-5">
        <div
          className={`-mx-3 -mt-3 mb-3 h-1.5 bg-gradient-to-r sm:-mx-5 ${domainVisual.accentBar}`}
          aria-hidden
        />
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-lab-navy break-words">
              {view.domain.label}
            </p>
            {view.domain.shortBlurb ? (
              <p className="text-xs text-slate-500 break-words">
                {view.domain.shortBlurb}
              </p>
            ) : null}
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span>
                {view.answeredCount}/{view.totalItems} dijawab · soal{" "}
                {index + 1}/{view.totalItems} · ±
                {Math.round(view.domain.timeLimitSeconds / 60)} mnt
              </span>
              {saveStatusLabel ? (
                <span
                  className={`lab-save-pill ${
                    saveStatus === "error"
                      ? "lab-save-pill--error"
                      : saveStatus === "saved"
                        ? "lab-save-pill--ok"
                        : "lab-save-pill--busy"
                  }`}
                  aria-live="polite"
                >
                  {saveStatusLabel}
                </span>
              ) : null}
            </div>
          </div>
          <div className="shrink-0 text-right">
            <p
              className={`font-mono text-xl font-semibold tabular-nums sm:text-2xl ${
                remainingMs < 60_000 ? "text-red-600" : "text-lab-navy"
              } ${timerUrgent ? "lab-timer-urgent" : ""}`}
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
            <p className="max-w-[9rem] text-xs text-slate-500 sm:max-w-none">
              {inGrace
                ? "Hanya perbarui jawaban tersimpan"
                : "Sisa waktu (server)"}
            </p>
          </div>
        </div>
        <div className="lab-progress-track mt-3">
          <div
            className={`lab-progress-fill bg-gradient-to-r ${domainVisual.accentBar}`}
            style={{ width: `${Math.max(3, answerProgress)}%` }}
          />
        </div>
      </div>

      <div
        className={`rounded-xl border border-slate-100 px-4 py-3 text-sm text-slate-700 ${domainVisual.accentSoft}`}
      >
        <p className="font-medium text-lab-navy" id="domain-instruction-title">
          Petunjuk domain
        </p>
        <p className="mt-1" id="domain-instruction">
          {view.domain.instruction}
        </p>
      </div>

      {item ? (
        <fieldset
          key={item.id}
          className="lab-card lab-runner-item p-5"
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
                className={`lab-choice min-h-11 cursor-pointer items-center ${
                  selected === choice.id ? "lab-choice-selected" : ""
                }`}
              >
                <input
                  type="radio"
                  name={item.id}
                  value={choice.id}
                  checked={selected === choice.id}
                  onChange={() => selectAnswer(choice.id)}
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

      <div className="lab-actions sm:justify-between">
        <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto">
          <button
            type="button"
            disabled={index === 0}
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            className="lab-btn-secondary min-h-11 disabled:opacity-40"
          >
            Sebelumnya
          </button>
          <button
            type="button"
            disabled={index >= view.items.length - 1}
            onClick={() =>
              setIndex((i) => Math.min(view.items.length - 1, i + 1))
            }
            className="lab-btn-secondary min-h-11 disabled:opacity-40"
          >
            Berikutnya
          </button>
        </div>

        <button
          type="button"
          disabled={!view.canEarlyFinish || closing}
          onClick={onEarlyFinish}
          className="lab-btn-navy lab-btn-block"
        >
          {closing
            ? "Menyimpan & menutup…"
            : saveStatus === "saving"
              ? "Selesai domain (menyimpan…)"
              : "Selesai domain"}
        </button>
      </div>

      <p className="text-xs text-slate-500">
        Jawaban tersimpan otomatis ke server. Jawab semua soal, lalu tekan{" "}
        <strong>Selesai domain</strong> untuk lanjut. Setelah domain ditutup,
        jawaban dibekukan. Item tanpa jawaban saat waktu habis dihitung
        kosong/salah.
      </p>
    </div>
  );
}
