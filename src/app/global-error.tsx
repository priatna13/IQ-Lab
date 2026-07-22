"use client";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

/**
 * Root fallback when layout itself fails.
 * Must include html/body — replaces root layout.
 */
export default function GlobalError({ error, reset }: Props) {
  return (
    <html lang="id">
      <body
        style={{
          margin: 0,
          fontFamily:
            'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
          background: "#f8fafc",
          color: "#0f2744",
        }}
      >
        <main
          style={{
            minHeight: "100dvh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            padding: "2rem",
            textAlign: "center",
          }}
        >
          <h1 style={{ fontSize: "1.5rem", margin: 0 }}>
            IQ-Lab mengalami gangguan
          </h1>
          <p style={{ maxWidth: 28 * 16, color: "#475569", margin: 0 }}>
            Muat ulang halaman. Jika berulang, hapus cookie untuk situs ini lalu
            buka lagi.
          </p>
          {error.digest ? (
            <p style={{ fontFamily: "monospace", fontSize: 12, color: "#94a3b8" }}>
              Kode: {error.digest}
            </p>
          ) : null}
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: 8,
              padding: "0.75rem 1.25rem",
              borderRadius: 999,
              border: "none",
              background: "#0d9488",
              color: "white",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Coba lagi
          </button>
        </main>
      </body>
    </html>
  );
}
