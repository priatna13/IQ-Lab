import { NextResponse, type NextRequest } from "next/server";
import {
  buildReportPdfBytes,
  getResultSnapshotForAttempt,
  toPublicResultReport,
} from "@/domain/assessment";
import { createServerAssessmentPorts } from "@/lib/assessment/ports-factory";
import { getSessionUser } from "@/lib/auth/session";

type Params = { params: Promise<{ attemptId: string }> };

/**
 * PDF download: loads frozen Result Snapshot only — never recomputes scores.
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

  const snapshot = await getResultSnapshotForAttempt(ports, {
    attemptId,
    participantId: user.id,
  });
  if (!snapshot) {
    return NextResponse.json({ error: "Snapshot missing" }, { status: 404 });
  }

  // Snapshot → public report DTO → PDF (no live scoring)
  const report = toPublicResultReport(snapshot);
  const bytes = await buildReportPdfBytes(report);

  return new NextResponse(Buffer.from(bytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="iq-lab-hasil-${attemptId}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}
