"use client";

import { useEffect } from "react";

const BUILD = "v3-zero-20260723";

/**
 * Last-resort segment boundary.
 * If you still see digest here after hard refresh, the failure is outside
 * the picker client (nested sesi/hasil, or deploy cache).
 */
export default function KeahlianSegmentError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[KEAHLIAN_SEGMENT_ERROR]", {
      build: BUILD,
      name: error.name,
      message: error.message,
      digest: error.digest,
      stack: error.stack,
    });
  }, [error]);

  return (
    <main
      style={{
        margin: "0 auto",
        maxWidth: 560,
        padding: "3rem 1rem",
        fontFamily: "system-ui, sans-serif",
        color: "#0f2744",
        textAlign: "center",
      }}
    >
      <p style={{ fontSize: 12, fontWeight: 600, color: "#0d9488" }}>
        IQ-Lab · Keahlian · {BUILD}
      </p>
      <h1 style={{ fontSize: 22, marginTop: 8 }}>Gagal memuat keahlian</h1>
      <p style={{ marginTop: 8, fontSize: 14, color: "#64748b" }}>
        Boundary v3. Hard refresh (Ctrl+Shift+R). Jika{" "}
        <code style={{ fontSize: 11 }}>build={BUILD}</code> tidak muncul di
        halaman normal, cache/deploy belum update.
      </p>
      <pre
        style={{
          marginTop: 16,
          padding: 12,
          borderRadius: 12,
          background: "#0f172a",
          color: "#fcd34d",
          fontSize: 11,
          textAlign: "left",
          whiteSpace: "pre-wrap",
          overflow: "auto",
        }}
      >
        {`build: ${BUILD}
name: ${error.name}
message: ${error.message}
digest: ${error.digest ?? "(none)"}
route: /asesmen/[attemptId]/keahlian/*`}
      </pre>
      <div
        style={{
          marginTop: 16,
          display: "flex",
          gap: 12,
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <button
          type="button"
          onClick={reset}
          style={{
            padding: "10px 16px",
            borderRadius: 999,
            border: "none",
            background: "#0d9488",
            color: "#fff",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Coba lagi
        </button>
        <a
          href="/dashboard"
          style={{
            padding: "10px 16px",
            borderRadius: 999,
            border: "1px solid #cbd5e1",
            color: "#0f2744",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          Dasbor
        </a>
        <a
          href="/masuk"
          style={{
            padding: "10px 16px",
            borderRadius: 999,
            border: "1px solid #cbd5e1",
            color: "#0f2744",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          Masuk ulang
        </a>
      </div>
    </main>
  );
}
