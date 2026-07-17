import * as PDFLib from "pdf-lib";
import type { PublicResultReport } from "./result-types";

const { PDFDocument, StandardFonts, rgb } = PDFLib;

type PDFFont = Awaited<
  ReturnType<Awaited<ReturnType<typeof PDFDocument.create>>["embedFont"]>
>;
type PDFPage = ReturnType<
  Awaited<ReturnType<typeof PDFDocument.create>>["addPage"]
>;
type PDFDoc = Awaited<ReturnType<typeof PDFDocument.create>>;

const A4 = { width: 595.28, height: 841.89 };
const MARGIN = 50;
const LINE = 14;
const FOOTER_H = 48;

function wrapText(font: PDFFont, text: string, size: number, maxWidth: number): string[] {
  const words = text.replace(/\s+/g, " ").trim().split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const trial = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(trial, size) <= maxWidth) {
      current = trial;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines.length ? lines : [""];
}

type DrawCtx = {
  page: PDFPage;
  font: PDFFont;
  fontBold: PDFFont;
  y: number;
  doc: PDFDoc;
};

function ensureSpace(ctx: DrawCtx, needed: number): void {
  if (ctx.y - needed < MARGIN + FOOTER_H) {
    ctx.page = ctx.doc.addPage([A4.width, A4.height]);
    ctx.y = A4.height - MARGIN;
  }
}

function drawLines(
  ctx: DrawCtx,
  lines: string[],
  size: number,
  options?: { bold?: boolean; color?: ReturnType<typeof rgb> },
): void {
  const font = options?.bold ? ctx.fontBold : ctx.font;
  const color = options?.color ?? rgb(0.1, 0.15, 0.25);
  const maxW = A4.width - MARGIN * 2;
  for (const line of lines) {
    const wrapped = wrapText(font, line, size, maxW);
    for (const w of wrapped) {
      ensureSpace(ctx, LINE + 2);
      ctx.page.drawText(w, {
        x: MARGIN,
        y: ctx.y,
        size,
        font,
        color,
      });
      ctx.y -= LINE + 2;
    }
  }
}

/**
 * Build A4 PDF bytes strictly from PublicResultReport (snapshot DTO).
 * No scoring recompute. Same report input → content-equivalent output
 * (no wall-clock timestamps in body).
 */
export async function buildReportPdfBytes(
  report: PublicResultReport,
): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  // Stable metadata so regenerate is content-equivalent for same snapshot
  doc.setTitle(`IQ-Lab Hasil — ${report.attemptId}`);
  doc.setAuthor("IQ-Lab");
  doc.setSubject(report.normVersion);
  doc.setCreationDate(new Date(report.frozenAt));
  doc.setModificationDate(new Date(report.frozenAt));

  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  let page = doc.addPage([A4.width, A4.height]);
  const ctx: DrawCtx = {
    page,
    font,
    fontBold,
    y: A4.height - MARGIN,
    doc,
  };

  drawLines(ctx, ["IQ-Lab — Laporan Hasil Asesmen"], 16, { bold: true });
  ctx.y -= 6;
  drawLines(ctx, [report.labels.normBadge], 10, {
    color: rgb(0.55, 0.35, 0.1),
  });
  ctx.y -= 4;
  drawLines(ctx, [report.labels.disclaimer], 9, {
    color: rgb(0.3, 0.3, 0.3),
  });
  ctx.y -= 10;

  const trackLabel =
    report.track === "explore" ? "Jelajahi potensi" : "Rancang langkah karir";
  drawLines(
    ctx,
    [
      `Track: ${trackLabel}`,
      `${report.labels.composite}: ${report.compositeIndex} (skala 1–100)`,
      `${report.labels.iqEstimate}: ${report.iqEstimate}`,
      `Norma: ${report.normVersion}`,
      `Content Version: ${report.contentVersionId}`,
      `Dibekukan: ${report.frozenAt}`,
    ],
    10,
  );
  ctx.y -= 12;

  drawLines(ctx, ["Profil kemampuan (9 domain)"], 12, { bold: true });
  ctx.y -= 4;
  for (const d of report.abilityProfile) {
    drawLines(
      ctx,
      [`• ${d.label}: ${d.score}  (mentah ${d.rawCorrect}/${d.rawTotal})`],
      10,
    );
  }
  ctx.y -= 10;

  if (report.rulePayload) {
    drawLines(ctx, ["Klaster arah (rule engine)"], 12, { bold: true });
    ctx.y -= 4;
    drawLines(
      ctx,
      [`Versi ${report.rulePayload.version} · keyakinan: ${report.rulePayload.confidence}`],
      9,
      { color: rgb(0.4, 0.4, 0.4) },
    );
    for (const c of report.rulePayload.clusters) {
      drawLines(ctx, [`• ${c.label} — kecocokan ~${c.fitScore}`], 10);
    }
    if (report.rulePayload.skillPriorities.length) {
      ctx.y -= 4;
      drawLines(
        ctx,
        [`Prioritas skill: ${report.rulePayload.skillPriorities.join(", ")}`],
        10,
      );
    }
    ctx.y -= 10;
  }

  drawLines(ctx, ["Insight"], 12, { bold: true });
  ctx.y -= 4;
  drawLines(ctx, [report.insightProse ?? "—"], 10);
  ctx.y -= 10;

  drawLines(ctx, ["Action plan"], 12, { bold: true });
  ctx.y -= 4;
  drawLines(ctx, [report.actionPlanProse ?? "—"], 10);
  ctx.y -= 16;

  // Footer on every page
  const pages = doc.getPages();
  for (let i = 0; i < pages.length; i++) {
    const p = pages[i];
    const footer =
      "IQ-Lab · Bukan tes IST resmi · Bukan diagnosis klinis · Bukan sertifikasi rekrutmen · Hanya untuk pengembangan diri";
    const pageNo = `Halaman ${i + 1} dari ${pages.length}`;
    p.drawText(footer, {
      x: MARGIN,
      y: 28,
      size: 7,
      font,
      color: rgb(0.45, 0.45, 0.45),
      maxWidth: A4.width - MARGIN * 2 - 80,
    });
    p.drawText(pageNo, {
      x: A4.width - MARGIN - font.widthOfTextAtSize(pageNo, 8),
      y: 28,
      size: 8,
      font,
      color: rgb(0.45, 0.45, 0.45),
    });
  }

  return doc.save();
}
