import Link from "next/link";
import { PageShell } from "@/components/ui/page-shell";

/**
 * Friendly 404 when attempt is missing, hidden by RLS, or not owned by session.
 * Prefer this over an unhandled server exception (E352).
 */
export default function AttemptNotFound() {
  return (
    <PageShell width="sm" orbs="calm">
      <p className="lab-section-label">Asesmen</p>
      <h1 className="mt-1 text-2xl font-bold text-lab-navy">
        Asesmen tidak ditemukan
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">
        Data tidak ada, atau akun yang sedang masuk bukan pemilik asesmen ini.
        Masuk dengan akun yang mengerjakan asesmen, lalu buka lagi dari dasbor.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/dashboard" className="lab-btn-primary">
          Ke dasbor
        </Link>
        <Link href="/masuk" className="lab-btn-secondary">
          Masuk ulang
        </Link>
      </div>
    </PageShell>
  );
}
