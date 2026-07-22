import Link from "next/link";
import { PageShell } from "@/components/ui/page-shell";

type Props = {
  title?: string;
  code: string;
  message: string;
  detail?: string;
  nextPath?: string;
  showRetry?: boolean;
};

/**
 * Temporary diagnostic surface so we stop masking root causes as
 * "gangguan sementara". Safe for soft-launch; remove verbose detail later.
 */
export function AssessmentDiagnostic({
  title = "Tidak bisa memuat asesmen",
  code,
  message,
  detail,
  nextPath,
  showRetry = true,
}: Props) {
  return (
    <PageShell width="md" orbs="calm">
      <p className="lab-section-label">Diagnostik</p>
      <h1 className="mt-1 text-2xl font-bold text-lab-navy">{title}</h1>
      <p className="mt-2 text-sm text-slate-600">
        Pesan di bawah adalah error asli (bukan generic error boundary). Salin
        kode + pesan jika masih gagal.
      </p>
      <pre
        role="alert"
        className="mt-4 overflow-x-auto rounded-xl bg-slate-950 px-4 py-3 text-left text-xs leading-relaxed text-emerald-200 ring-1 ring-slate-800"
      >
        {`code: ${code}\n\n${message}${detail ? `\n\n--- detail ---\n${detail}` : ""}`}
      </pre>
      <div className="mt-4 flex flex-wrap gap-3">
        {showRetry && nextPath ? (
          <Link href={nextPath} className="lab-btn-primary">
            Coba lagi
          </Link>
        ) : null}
        <Link href="/dashboard" className="lab-btn-secondary">
          Ke dasbor
        </Link>
        <Link href="/masuk" className="lab-btn-ghost border border-slate-200">
          Masuk ulang
        </Link>
      </div>
    </PageShell>
  );
}
