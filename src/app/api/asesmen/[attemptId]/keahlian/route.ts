import { NextResponse, type NextRequest } from "next/server";
import { loadKeahlianPage } from "@/lib/assessment/load-owned-assessment";
import { toKeahlianApiResponse } from "@/lib/assessment/keahlian-dto";

type Ctx = { params: Promise<{ attemptId: string }> };

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * JSON endpoint for keahlian picker.
 * Returns real error codes/messages (not Next production RSC digests).
 * Auth cookies must be sent: credentials: "include".
 */
export async function GET(_request: NextRequest, { params }: Ctx) {
  let attemptId = "unknown";
  try {
    const p = await params;
    attemptId = p.attemptId;
    console.info("[API keahlian] start", { attemptId });

    const result = await loadKeahlianPage(attemptId);
    console.info("[API keahlian] load result", {
      attemptId,
      kind: result.kind,
      code: "code" in result ? result.code : undefined,
    });

    const body = toKeahlianApiResponse(attemptId, result);

    if (!body.ok && body.kind === "unauthenticated") {
      return NextResponse.json(body, { status: 401 });
    }
    if (!body.ok && body.kind === "not_found") {
      return NextResponse.json(body, { status: 404 });
    }
    if (!body.ok && body.kind === "invalid_state") {
      return NextResponse.json(body, { status: 409 });
    }
    if (!body.ok) {
      return NextResponse.json(body, { status: 500 });
    }

    return NextResponse.json(body, {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error ? err.stack : undefined;
    console.error("[API keahlian] fatal", {
      attemptId,
      name: err instanceof Error ? err.name : "UnknownError",
      message,
      stack,
    });
    return NextResponse.json(
      {
        ok: false,
        kind: "error",
        code: "API_UNCAUGHT",
        message: `API_UNCAUGHT: ${message}`,
        detail: stack?.slice(0, 1200),
      },
      { status: 500 },
    );
  }
}
