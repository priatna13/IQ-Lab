"use client";

import { useEffect } from "react";
import Link from "next/link";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

/**
 * Route-level recovery UI for unexpected server/render failures.
 */
export default function AppError({ error, reset }: Props) {
  useEffect(() => {
    console.error("[iq-lab] route error", error.digest ?? error.message);
  }, [error]);

  function clearSiteAndReload() {
    try {
      // Best-effort: drop cookies for this host so stale auth cannot loop.
      for (const part of document.cookie.split(";")) {
        const name = part.split("=")[0]?.trim();
        if (!name) continue;
        document.cookie = `${name}=; Max-Age=0; path=/`;
      }
    } catch {
      // ignore
    }
    window.location.href = "/";
  }

  return (
    <main className="mx-auto flex min-h-[70dvh] w-full max-w-lg flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-lab-teal">
        IQ-Lab
      </p>
      <h1 className="text-2xl font-bold text-lab-navy">
        Terjadi gangguan sementara
      </h1>
      <p className="text-sm leading-relaxed text-slate-600">
        Halaman gagal dimuat. Coba muat ulang. Jika berulang, reset sesi
        (hapus cookie) lalu masuk lagi.
      </p>
      {error.digest ? (
        <p className="font-mono text-xs text-slate-400">Kode: {error.digest}</p>
      ) : null}
      <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
        <button type="button" className="lab-btn-primary" onClick={reset}>
          Coba lagi
        </button>
        <Link href="/" className="lab-btn-secondary">
          Ke beranda
        </Link>
        <button
          type="button"
          className="lab-btn-ghost border border-slate-200"
          onClick={clearSiteAndReload}
        >
          Reset sesi &amp; beranda
        </button>
      </div>
    </main>
  );
}
