"use client";

import { useCallback, useRef, useState } from "react";
import type { PublicResultReport } from "@/domain/assessment";
import { toShareCardModel } from "@/domain/assessment/share-card-model";
import { BrandLogo } from "@/components/ui/brand-logo";

type Props = {
  report: PublicResultReport;
};

/**
 * Share card preview + export (DESIGN.md R3).
 * Safe-by-default: IQ off unless user toggles.
 * Canvas 2D export — no third-party share network.
 */
export function ShareCardPanel({ report }: Props) {
  const [includeIq, setIncludeIq] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const model = toShareCardModel(report, { includeIq });

  const drawCardToCanvas = useCallback(async (): Promise<HTMLCanvasElement> => {
    const W = 1080;
    const H = 1350;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas tidak tersedia");

    // Background
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, W, H);
    const grad = ctx.createLinearGradient(0, 0, W, H * 0.5);
    grad.addColorStop(0, "rgba(13, 148, 136, 0.12)");
    grad.addColorStop(0.5, "rgba(139, 92, 246, 0.08)");
    grad.addColorStop(1, "rgba(56, 189, 248, 0.06)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Card panel
    const pad = 64;
    roundRect(ctx, pad, pad, W - pad * 2, H - pad * 2, 40);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.strokeStyle = "rgba(226, 232, 240, 0.95)";
    ctx.lineWidth = 2;
    ctx.stroke();

    let y = pad + 72;
    const left = pad + 64;
    const maxW = W - pad * 2 - 128;

    ctx.fillStyle = "#0f2744";
    ctx.font = "700 36px system-ui, sans-serif";
    ctx.fillText(model.brand, left, y);
    y += 56;

    ctx.fillStyle = "#0d9488";
    ctx.font = "600 22px system-ui, sans-serif";
    ctx.fillText(model.normBadge, left, y);
    y += 64;

    ctx.fillStyle = "#0f2744";
    ctx.font = "700 52px system-ui, sans-serif";
    wrapText(ctx, model.title, left, y, maxW, 58);
    y += 90;

    // Track chip
    ctx.fillStyle = "rgba(204, 251, 241, 0.9)";
    roundRect(ctx, left, y - 28, 320, 48, 24);
    ctx.fill();
    ctx.fillStyle = "#0f766e";
    ctx.font = "600 24px system-ui, sans-serif";
    ctx.fillText(model.trackLabel, left + 24, y + 4);
    y += 80;

    // Composite
    ctx.fillStyle = "#64748b";
    ctx.font = "600 22px system-ui, sans-serif";
    ctx.fillText(model.compositeLabel.toUpperCase(), left, y);
    y += 70;
    ctx.fillStyle = "#0f2744";
    ctx.font = "700 120px ui-monospace, monospace";
    ctx.fillText(String(model.compositeIndex), left, y);
    y += 50;
    ctx.fillStyle = "#94a3b8";
    ctx.font = "400 22px system-ui, sans-serif";
    ctx.fillText("Skala 1–100 (internal)", left, y);
    y += 70;

    if (model.includeIq && model.iqEstimate != null) {
      ctx.fillStyle = "#0d9488";
      ctx.font = "600 22px system-ui, sans-serif";
      ctx.fillText(model.iqLabel, left, y);
      y += 56;
      ctx.fillStyle = "#0d9488";
      ctx.font = "700 72px ui-monospace, monospace";
      ctx.fillText(String(model.iqEstimate), left, y);
      y += 60;
    }

    if (model.clusters.length > 0) {
      ctx.fillStyle = "#0f2744";
      ctx.font = "700 28px system-ui, sans-serif";
      ctx.fillText("Klaster arah", left, y);
      y += 48;
      for (const c of model.clusters) {
        ctx.fillStyle = "#334155";
        ctx.font = "500 26px system-ui, sans-serif";
        const line = `· ${c.label}  ~${c.fitScore}`;
        ctx.fillText(truncate(ctx, line, maxW), left, y);
        y += 40;
      }
      y += 16;
    }

    if (model.strengths.length > 0) {
      ctx.fillStyle = "#0f2744";
      ctx.font = "700 28px system-ui, sans-serif";
      ctx.fillText("Kekuatan", left, y);
      y += 48;
      ctx.fillStyle = "#0f766e";
      ctx.font = "600 26px system-ui, sans-serif";
      ctx.fillText(model.strengths.join(" · "), left, y);
      y += 56;
    }

    // Footer disclaimer
    const footY = H - pad - 80;
    ctx.fillStyle = "#94a3b8";
    ctx.font = "500 20px system-ui, sans-serif";
    wrapText(ctx, model.disclaimer, left, footY, maxW, 28);

    return canvas;
  }, [model]);

  async function downloadPng() {
    setBusy(true);
    setStatus(null);
    try {
      const canvas = await drawCardToCanvas();
      const blob = await new Promise<Blob | null>((res) =>
        canvas.toBlob(res, "image/png"),
      );
      if (!blob) throw new Error("Gagal membuat PNG");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "iq-lab-profil.png";
      a.click();
      URL.revokeObjectURL(url);
      setStatus("PNG diunduh.");
    } catch {
      setStatus("Gagal mengunduh. Coba lagi.");
    } finally {
      setBusy(false);
    }
  }

  async function sharePng() {
    setBusy(true);
    setStatus(null);
    try {
      const canvas = await drawCardToCanvas();
      const blob = await new Promise<Blob | null>((res) =>
        canvas.toBlob(res, "image/png"),
      );
      if (!blob) throw new Error("Gagal membuat PNG");
      const file = new File([blob], "iq-lab-profil.png", { type: "image/png" });
      const nav = navigator as Navigator & {
        canShare?: (data: ShareData) => boolean;
        share?: (data: ShareData) => Promise<void>;
      };
      if (nav.share && nav.canShare?.({ files: [file] })) {
        await nav.share({
          files: [file],
          title: "IQ-Lab — profil kemampuan",
          text: "Profil kemampuan saya di IQ-Lab (bukan tes IST resmi).",
        });
        setStatus("Dibagikan.");
      } else {
        await downloadPng();
        setStatus("Perangkat tidak mendukung Share — PNG diunduh.");
      }
    } catch (e) {
      if (e instanceof Error && e.name === "AbortError") {
        setStatus(null);
      } else {
        setStatus("Gagal membagikan. Coba unduh PNG.");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="lab-card animate-fade-up space-y-5 p-5 sm:p-6">
      <div>
        <h2 className="text-lg font-bold text-lab-navy">Bagikan profil</h2>
        <p className="mt-1 text-sm text-slate-600">
          Kartu visual untuk unduh atau bagikan. Hanya Anda yang membagikan;
          IQ-Lab tidak memposting otomatis.
        </p>
      </div>

      {/* Preview — reserved aspect to avoid CLS */}
      <div
        ref={cardRef}
        className="relative mx-auto w-full max-w-[280px] overflow-hidden rounded-2xl border border-slate-100 bg-gradient-to-br from-lab-mist via-white to-lab-mint/40 shadow-soft"
        style={{ aspectRatio: "1080 / 1350" }}
        aria-hidden
      >
        <div className="flex h-full flex-col p-5">
          <BrandLogo
            size="sm"
            withWordmark
            href={null}
            className="origin-left scale-90"
          />
          <p className="mt-3 text-[10px] font-semibold uppercase tracking-wide text-lab-teal-deep">
            {model.normBadge}
          </p>
          <p className="mt-2 text-base font-bold leading-snug text-lab-navy">
            {model.title}
          </p>
          <span className="lab-badge mt-3 w-fit bg-lab-mint/80 text-lab-teal-deep ring-1 ring-lab-teal/15">
            {model.trackLabel}
          </span>
          <p className="mt-6 text-[10px] font-semibold uppercase text-slate-500">
            {model.compositeLabel}
          </p>
          <p className="font-mono text-4xl font-bold tabular-nums text-lab-navy">
            {model.compositeIndex}
          </p>
          {model.includeIq && model.iqEstimate != null ? (
            <p className="mt-2 font-mono text-2xl font-bold tabular-nums text-lab-teal">
              IQ ~{model.iqEstimate}
              <span className="ml-1 text-[10px] font-medium text-slate-500">
                estimasi
              </span>
            </p>
          ) : null}
          {model.clusters[0] ? (
            <p className="mt-4 line-clamp-2 text-xs text-slate-600">
              {model.clusters.map((c) => c.label).join(" · ")}
            </p>
          ) : null}
          <p className="mt-auto pt-4 text-[9px] leading-snug text-slate-400">
            {model.disclaimer}
          </p>
        </div>
      </div>

      <label className="flex min-h-11 cursor-pointer items-start gap-3 text-sm text-slate-700">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300 text-lab-teal focus:ring-lab-teal"
          checked={includeIq}
          onChange={(e) => setIncludeIq(e.target.checked)}
        />
        <span>
          <span className="font-medium text-lab-navy">
            Sertakan estimasi IQ
          </span>
          <span className="mt-0.5 block text-xs text-slate-500">
            Default mati. Angka adalah estimasi norma internal, bukan IQ resmi.
          </span>
        </span>
      </label>

      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          className="lab-btn-primary lab-btn-block min-h-11 cursor-pointer sm:flex-1"
          disabled={busy}
          onClick={() => void downloadPng()}
        >
          {busy ? "Menyiapkan…" : "Unduh PNG"}
        </button>
        <button
          type="button"
          className="lab-btn-secondary lab-btn-block min-h-11 cursor-pointer sm:flex-1"
          disabled={busy}
          onClick={() => void sharePng()}
        >
          Bagikan
        </button>
      </div>

      {status ? (
        <p role="status" className="text-sm text-slate-600" aria-live="polite">
          {status}
        </p>
      ) : null}
    </section>
  );
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const words = text.split(" ");
  let line = "";
  let yy = y;
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, yy);
      line = word;
      yy += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, yy);
}

function truncate(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let t = text;
  while (t.length > 0 && ctx.measureText(`${t}…`).width > maxWidth) {
    t = t.slice(0, -1);
  }
  return `${t}…`;
}
