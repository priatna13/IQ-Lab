"use client";

import { useState, useTransition } from "react";
import { deleteAccountAction } from "@/app/actions/auth";

export function DeleteAccountButton() {
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
      >
        Hapus data akun
      </button>
    );
  }

  return (
    <div className="space-y-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-950">
      <p>
        Hapus <strong>semua data asesmen teridentifikasi</strong> (Attempt,
        jawaban, hasil) dan keluar dari sesi? Tindakan ini tidak bisa dibatalkan.
      </p>
      <p className="text-xs text-red-900/80">
        Sampel norma agregat anonim (tanpa identitas) dapat tetap disimpan untuk
        perbaikan norma internal — sesuai kebijakan privasi.
      </p>
      {error ? <p className="text-red-700">{error}</p> : null}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={pending}
          onClick={() => {
            setError(null);
            startTransition(async () => {
              const result = await deleteAccountAction();
              if (result && !result.ok) setError(result.error ?? "Gagal");
            });
          }}
          className="rounded-lg bg-red-700 px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {pending ? "Menghapus…" : "Ya, hapus data saya"}
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => setConfirming(false)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-lab-navy"
        >
          Batal
        </button>
      </div>
    </div>
  );
}
