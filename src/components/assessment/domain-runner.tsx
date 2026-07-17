"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { PublicDomainRunnerView } from "@/domain/assessment";
import {
  earlyFinishAction,
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

export function DomainRunner({ attemptId, initialView }: Props) {
  const router = useRouter();
  const [view, setView] = useState(initialView);
  const [index, setIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
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

  function selectAnswer(answer: string) {
    if (!item || view.session.status === "closed") return;
    setError(null);
    // Optimistic local update
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
      <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-lab-navy">
          Domain selesai: {view.domain.label}
        </h2>
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
          className="rounded-lg bg-lab-teal px-4 py-2 text-sm font-semibold text-white"
        >
          Kembali ke daftar domain
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <div>
          <p className="text-sm font-semibold text-lab-navy">
            {view.domain.label}
          </p>
          <p className="text-xs text-slate-500">
            {view.answeredCount}/{view.totalItems} dijawab · soal {index + 1}/
            {view.totalItems}
          </p>
        </div>
        <div className="text-right">
          <p
            className={`font-mono text-xl font-semibold ${
              remainingMs < 60_000 ? "text-red-600" : "text-lab-navy"
            }`}
          >
            {inGrace ? "Grace" : formatRemaining(remainingMs)}
          </p>
          <p className="text-xs text-slate-500">
            {inGrace
              ? "Hanya update jawaban yang sudah ada"
              : "Timer server (tampilan lokal)"}
          </p>
        </div>
      </div>

      <p className="text-sm text-slate-600">{view.domain.instruction}</p>

      {item ? (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-lab-navy">{item.prompt}</p>
          <div className="mt-4 space-y-2">
            {item.choices.map((choice) => (
              <label
                key={choice.id}
                className={`flex cursor-pointer gap-3 rounded-lg border px-3 py-2 text-sm ${
                  selected === choice.id
                    ? "border-lab-teal bg-teal-50"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <input
                  type="radio"
                  name={item.id}
                  value={choice.id}
                  checked={selected === choice.id}
                  onChange={() => selectAnswer(choice.id)}
                  disabled={pending && !inGrace && pastGrace}
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
        </div>
      ) : null}

      {error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <button
            type="button"
            disabled={index === 0}
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium disabled:opacity-40"
          >
            Sebelumnya
          </button>
          <button
            type="button"
            disabled={index >= view.items.length - 1}
            onClick={() =>
              setIndex((i) => Math.min(view.items.length - 1, i + 1))
            }
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium disabled:opacity-40"
          >
            Berikutnya
          </button>
        </div>

        <button
          type="button"
          disabled={!view.canEarlyFinish || pending}
          onClick={onEarlyFinish}
          className="rounded-lg bg-lab-navy px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
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
