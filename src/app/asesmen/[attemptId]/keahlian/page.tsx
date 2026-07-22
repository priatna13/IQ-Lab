"use client";

/**
 * ZERO static imports of app UI (PageShell, FieldPicker, InsForge, etc.).
 * Heavy modules load only after browser mount via dynamic import().
 * This prevents production RSC digest E352 on this route: SSR only paints
 * plain HTML with inline styles.
 */
import { useEffect, useState, type ReactNode } from "react";
import { useParams } from "next/navigation";

export default function KeahlianPickerPage() {
  const params = useParams();
  const raw = params?.attemptId;
  const attemptId = Array.isArray(raw) ? String(raw[0] ?? "") : String(raw ?? "");

  const [ui, setUi] = useState<ReactNode>(null);
  const [bootError, setBootError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function boot() {
      if (!attemptId || attemptId.length < 8) {
        setBootError(`INVALID_ATTEMPT_ID: ${attemptId}`);
        return;
      }
      try {
        const mod = await import(
          /* webpackChunkName: "keahlian-page-client" */
          "@/components/assessment/keahlian-page-client"
        );
        if (cancelled) return;
        const Client = mod.KeahlianPageClient;
        setUi(<Client attemptId={attemptId} />);
      } catch (err) {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : String(err);
        const stack = err instanceof Error ? err.stack : undefined;
        console.error("[KEAHLIAN_MODULE_LOAD_FAILED]", { attemptId, message, stack });
        setBootError(
          `KEAHLIAN_MODULE_LOAD_FAILED: ${message}${stack ? `\n\n${stack.slice(0, 800)}` : ""}`,
        );
      }
    }

    void boot();
    return () => {
      cancelled = true;
    };
  }, [attemptId]);

  if (bootError) {
    return (
      <main
        style={{
          margin: "0 auto",
          maxWidth: 560,
          padding: "3rem 1rem",
          fontFamily: "system-ui, sans-serif",
          color: "#0f2744",
        }}
      >
        <p style={{ fontSize: 12, fontWeight: 600, color: "#0d9488" }}>IQ-Lab</p>
        <h1 style={{ fontSize: 22, marginTop: 8 }}>Gagal memuat modul keahlian</h1>
        <pre
          style={{
            marginTop: 16,
            padding: 12,
            borderRadius: 12,
            background: "#0f172a",
            color: "#6ee7b7",
            fontSize: 11,
            whiteSpace: "pre-wrap",
            overflow: "auto",
          }}
        >
          {bootError}
        </pre>
        <p style={{ marginTop: 16, fontSize: 14 }}>
          <a href="/dashboard" style={{ color: "#0d9488", fontWeight: 600 }}>
            Ke dasbor
          </a>
          {" · "}
          <a href="/masuk" style={{ color: "#0d9488", fontWeight: 600 }}>
            Masuk ulang
          </a>
        </p>
      </main>
    );
  }

  if (!ui) {
    return (
      <main
        style={{
          margin: "0 auto",
          maxWidth: 560,
          padding: "3rem 1rem",
          fontFamily: "system-ui, sans-serif",
          color: "#0f2744",
        }}
      >
        <p
          style={{
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "#0d9488",
          }}
        >
          Langkah lanjutan
        </p>
        <h1 style={{ fontSize: 24, marginTop: 8, fontWeight: 700 }}>
          Asesmen keahlian bidang
        </h1>
        <p style={{ marginTop: 12, fontSize: 14, color: "#64748b" }}>
          Menyiapkan antarmuka di browser…
        </p>
        <p style={{ marginTop: 8, fontSize: 10, fontFamily: "monospace", color: "#94a3b8" }}>
          attemptId={attemptId || "(kosong)"} · mode=client-only-boot
        </p>
      </main>
    );
  }

  return <>{ui}</>;
}
