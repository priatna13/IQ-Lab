import {
  buildReportPdfBytes,
  toPublicResultReport,
  type ResultSnapshot,
} from "@/domain/assessment";
import { createInsForgeServerClient } from "@/lib/insforge/server";

/** Private bucket for assessment PDF reports (C4). */
export const REPORT_PDF_BUCKET = "reports";

export type StoredPdf = {
  url: string;
  key: string;
  bytes: Uint8Array;
  fromCache: boolean;
};

/**
 * Ensure a PDF exists in InsForge Storage for this snapshot.
 * Content is always derived from the frozen Result Snapshot (never live rescoring).
 * Persists pdf_url + pdf_key on the snapshot row.
 */
export async function ensureReportPdfStored(
  snapshot: ResultSnapshot,
): Promise<StoredPdf> {
  const report = toPublicResultReport(snapshot);
  const key =
    snapshot.pdfKey ??
    `${snapshot.participantId}/${snapshot.attemptId}.pdf`;

  if (snapshot.pdfKey && snapshot.pdfUrl) {
    // Prefer regenerating bytes from snapshot for download integrity;
    // storage copy is the durable archive.
    const bytes = await buildReportPdfBytes(report);
    return {
      url: snapshot.pdfUrl,
      key: snapshot.pdfKey,
      bytes,
      fromCache: true,
    };
  }

  const bytes = await buildReportPdfBytes(report);
  const client = await createInsForgeServerClient();

  // SDK accepts Blob/File; copy to ArrayBuffer-backed Blob
  const ab = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(ab).set(bytes);
  const blob = new Blob([ab], { type: "application/pdf" });

  const { data: upload, error: uploadError } = await client.storage
    .from(REPORT_PDF_BUCKET)
    .upload(key, blob);

  if (uploadError || !upload?.url || !upload?.key) {
    // Fall back to on-demand only (no throw — download still works)
    console.error("[pdf-storage] upload failed", uploadError?.message);
    return {
      url: "",
      key: "",
      bytes,
      fromCache: false,
    };
  }

  const pdfUrl = upload.url as string;
  const pdfKey = upload.key as string;

  const { error: updateError } = await client.database
    .from("result_snapshots")
    .update({ pdf_url: pdfUrl, pdf_key: pdfKey })
    .eq("id", snapshot.id)
    .eq("participant_id", snapshot.participantId);

  if (updateError) {
    console.error("[pdf-storage] snapshot update failed", updateError.message);
  }

  return { url: pdfUrl, key: pdfKey, bytes, fromCache: false };
}

export async function removeReportPdfsForParticipant(
  participantId: string,
  keys: string[],
): Promise<void> {
  if (keys.length === 0) return;
  try {
    const client = await createInsForgeServerClient();
    for (const key of keys) {
      if (!key) continue;
      await client.storage.from(REPORT_PDF_BUCKET).remove(key);
    }
  } catch (err) {
    console.error("[pdf-storage] remove failed", err);
  }
  void participantId;
}
