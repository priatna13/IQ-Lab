import { KeahlianPickerClient } from "@/components/assessment/keahlian-picker-client";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Props = {
  params: Promise<{ attemptId: string }>;
};

/**
 * Server shell only — no auth, no DB, no skill imports.
 * All data loading happens in the client via /api/asesmen/.../keahlian.
 * This keeps production free of opaque RSC digests on this route.
 */
export default async function KeahlianPickerPage({ params }: Props) {
  const { attemptId } = await params;
  return <KeahlianPickerClient attemptId={attemptId ?? ""} />;
}
