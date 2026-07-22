import { NextResponse, type NextRequest } from "next/server";
import {
  getResultSnapshotForAttempt,
} from "@/domain/assessment";
import { createServerAssessmentPorts } from "@/lib/assessment/ports-factory";
import { getSessionUser } from "@/lib/auth/session";
import { trackProductEvent } from "@/lib/analytics/track";
import { ensureReportPdfStored } from "@/lib/assessment/report-pdf-storage";

type Params = { params: Promise<{ attemptId: string }> };

/**
 * PDF download: loads frozen Result Snapshot only — never recomputes scores.
 * C4: first download stores PDF in InsForge Storage (pdf_url + pdf_key).
 */
export async function GET(_request: NextRequest, { params }: Params) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { attemptId } = await params;
  const ports = createServerAssessmentPorts();
  const attempt = await ports.attempts.findById(attemptId);
  if (!attempt || attempt.participantId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (attempt.status !== "completed") {
    return NextResponse.json(
      { error: "Attempt not completed" },
      { status: 400 },
    );
  }

  let snapshot;
  try {
    snapshot = await getResultSnapshotForAttempt(ports, {
      attemptId,
      participantId: user.id,
    });
  } catch {
    return NextResponse.json(
      { error: "Snapshot temporarily unavailable" },
      { status: 503 },
    );
  }
  if (!snapshot) {
    return NextResponse.json({ error: "Snapshot missing" }, { status: 404 });
  }

  const stored = await ensureReportPdfStored(snapshot);

  trackProductEvent(
    stored.fromCache ? "pdf_downloaded" : "pdf_stored",
    {
      attemptId,
      contentVersionId: snapshot.contentVersionId,
      stored: Boolean(stored.key),
    },
    { distinctId: user.id },
  );
  if (!stored.fromCache && stored.key) {
    trackProductEvent(
      "pdf_downloaded",
      { attemptId, firstStore: true },
      { distinctId: user.id },
    );
  }

  return new NextResponse(Buffer.from(stored.bytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="iq-lab-hasil-${attemptId}.pdf"`,
      "Cache-Control": "private, no-store",
      ...(stored.key ? { "X-IQ-Lab-Pdf-Key": stored.key } : {}),
    },
  });
}
