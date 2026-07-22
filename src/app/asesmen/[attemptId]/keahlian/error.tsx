"use client";

/**
 * Segment error boundary for /keahlian only.
 * Inline styles only — no design-system classes that could fail to resolve.
 */
export default function KeahlianSegmentError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
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
      <p style={{ fontSize: 12, fontWeight: 600, color: "#0d9488" }}>IQ-Lab · Keahlian</p>
      <h1 style={{ fontSize: 22, marginTop: 8 }}>Segment error</h1>
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
        {`name: ${error.name}
message: ${error.message}
digest: ${error.digest ?? "(none)"}`}
      </pre>
      <div style={{ marginTop: 16, display: "flex", gap: 12, justifyContent: "center" }}>
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
      </div>
    </main>
  );
}
