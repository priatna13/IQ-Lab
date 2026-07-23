import Link from "next/link";
import type {
  DomainAlignmentKind,
  SkillResultSnapshot,
} from "@/domain/assessment/skill/types";

const ALIGNMENT_LABEL: Record<DomainAlignmentKind, string> = {
  selaras: "Selaras",
  potensi_belum_terampil: "Potensi · skill diasah",
  pengalaman_mengompensasi: "Pengalaman mengompensasi",
  perlu_penguatan_ganda: "Penguatan ganda",
};

type Props = {
  attemptId: string;
  snapshots: SkillResultSnapshot[];
};

/**
 * Compact skill results block on /hasil — full panel stays on /keahlian/.../hasil.
 */
export function SkillSummaryOnHasil({ attemptId, snapshots }: Props) {
  const sorted = [...snapshots].sort(
    (a, b) => b.frozenAt.getTime() - a.frozenAt.getTime(),
  );
  const hasResults = sorted.length > 0;

  return (
    <section className="lab-card relative mt-6 overflow-hidden border-lab-teal/20 p-5 sm:p-6">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-lab-mint/55 via-white/40 to-lab-sky/20"
        aria-hidden
      />
      <div className="relative">
        <p className="lab-section-label text-lab-teal-deep">Langkah lanjutan</p>
        <h2 className="mt-1 text-lg font-bold text-lab-navy sm:text-xl">
          Asesmen keahlian berdasarkan bidang kerja
        </h2>

        {hasResults ? (
          <>
            <p className="mt-2 max-w-prose text-sm leading-relaxed text-slate-600">
              Ringkasan keahlian yang sudah Anda selesaikan untuk asesmen 9
              domain ini. Detail alignment &amp; insight ada di halaman hasil
              keahlian.
            </p>
            <ul className="mt-4 space-y-2">
              {sorted.map((s) => (
                <li
                  key={s.id}
                  className="flex flex-col gap-2 rounded-xl bg-white/90 px-3 py-2.5 shadow-sm ring-1 ring-slate-100 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-lab-navy">
                      {s.fieldLabel}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {s.categoryLabel}
                      {" · "}
                      {ALIGNMENT_LABEL[s.domainAlignment.kind]}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="font-mono text-lg font-bold tabular-nums text-lab-teal">
                      {s.score}
                      <span className="text-xs font-normal text-slate-400">
                        /100
                      </span>
                    </span>
                    <Link
                      href={`/asesmen/${attemptId}/keahlian/${s.fieldId}/hasil`}
                      className="text-xs font-semibold text-lab-teal hover:underline"
                    >
                      Detail
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <a
                href={`/asesmen/${attemptId}/keahlian`}
                className="lab-btn-primary inline-flex"
              >
                Bidang lain / pilih ulang
              </a>
            </div>
          </>
        ) : (
          <>
            <p className="mt-2 max-w-prose text-sm leading-relaxed text-slate-600">
              Pilih kategori (mis. Teknologi), lalu role (Software, UI/UX,
              Data…). Soal menyesuaikan bidang dan digabung dengan profil 9
              domain Anda.
            </p>
            <ul className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
              <li className="lab-badge bg-white/90 ring-1 ring-lab-teal/15">
                5 kategori · 15 role
              </li>
              <li className="lab-badge bg-white/90 ring-1 ring-lab-teal/15">
                7 soal MCQ · ±12 mnt
              </li>
              <li className="lab-badge bg-white/90 ring-1 ring-lab-teal/15">
                Rekomendasi dari profil
              </li>
            </ul>
            <a
              href={`/asesmen/${attemptId}/keahlian`}
              className="lab-btn-primary mt-5 inline-flex"
            >
              Pilih bidang kerja
            </a>
          </>
        )}
      </div>
    </section>
  );
}
