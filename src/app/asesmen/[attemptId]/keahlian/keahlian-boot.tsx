"use client";

/**
 * ZERO imports beyond React.
 * Heavy modules (server actions, field catalog, skill UI) load only after
 * browser mount via dynamic import — so production SSR never evaluates them.
 */
import { useEffect, useState, type ComponentType, type ReactNode } from "react";

const BUILD = "v3-zero-20260723";

type Props = {
  attemptId: string;
};

function Shell({
  attemptId,
  children,
}: {
  attemptId: string;
  children?: ReactNode;
}) {
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
      {children}
      <p
        style={{
          marginTop: 12,
          fontSize: 10,
          fontFamily: "monospace",
          color: "#94a3b8",
        }}
      >
        attemptId={attemptId || "(kosong)"} · build={BUILD}
      </p>
    </main>
  );
}

export function KeahlianBoot({ attemptId }: Props) {
  const id = typeof attemptId === "string" ? attemptId.trim() : "";
  const [ui, setUi] = useState<ReactNode>(null);
  const [bootError, setBootError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function boot() {
      if (!id || id.length < 8) {
        setBootError(`INVALID_ATTEMPT_ID: ${id}`);
        return;
      }
      try {
        const mod = await import(
          /* webpackChunkName: "keahlian-picker-v3" */
          "@/components/assessment/keahlian-picker-client"
        );
        if (cancelled) return;
        const Client = mod.KeahlianPickerClient as ComponentType<{
          attemptId: string;
        }>;
        setUi(<Client attemptId={id} />);
      } catch (err) {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : String(err);
        const stack = err instanceof Error ? err.stack : undefined;
        console.error("[KEAHLIAN_BOOT_V3_FAILED]", { id, message, stack });
        setBootError(
          `KEAHLIAN_BOOT_V3_FAILED: ${message}${
            stack ? `\n\n${stack.slice(0, 800)}` : ""
          }`,
        );
      }
    }

    void boot();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (bootError) {
    return (
      <Shell attemptId={id}>
        <p style={{ marginTop: 12, fontSize: 14, color: "#64748b" }}>
          Gagal memuat modul keahlian di browser (bukan Server Component).
        </p>
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
      </Shell>
    );
  }

  if (!ui) {
    return (
      <Shell attemptId={id}>
        <p style={{ marginTop: 12, fontSize: 14, color: "#64748b" }}>
          Menyiapkan antarmuka di browser…
        </p>
      </Shell>
    );
  }

  return <>{ui}</>;
}
