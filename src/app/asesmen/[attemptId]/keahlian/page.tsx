import { KeahlianBoot } from "./keahlian-boot";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Props = {
  params: Promise<{ attemptId: string }>;
};

/**
 * Server shell: only resolves params + renders KeahlianBoot.
 * KeahlianBoot imports nothing but React; skill UI loads after mount.
 * This is the only pattern that reliably avoids production RSC digests
 * when the client module graph includes Server Actions.
 */
export default async function KeahlianPickerPage({ params }: Props) {
  let attemptId = "";
  try {
    const p = await params;
    attemptId = typeof p?.attemptId === "string" ? p.attemptId : "";
  } catch (err) {
    console.error("[KEAHLIAN_PAGE] params failed", err);
  }
  return <KeahlianBoot attemptId={attemptId} />;
}
