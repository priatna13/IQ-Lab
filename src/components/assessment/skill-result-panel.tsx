import type {
  DomainAlignmentKind,
  PublicSkillResult,
} from "@/domain/assessment/skill/types";

const ALIGNMENT_LABEL: Record<DomainAlignmentKind, string> = {
  selaras: "Selaras",
  potensi_belum_terampil: "Potensi kognitif · skill perlu diasah",
  pengalaman_mengompensasi: "Pengalaman mengompensasi",
  perlu_penguatan_ganda: "Perlu penguatan ganda",
};

const ALIGNMENT_TONE: Record<DomainAlignmentKind, string> = {
  selaras: "bg-lab-mint/60 text-lab-teal-deep ring-lab-teal/20",
  potensi_belum_terampil: "bg-amber-50 text-amber-900 ring-amber-200/80",
  pengalaman_mengompensasi: "bg-lab-sky/20 text-lab-navy ring-lab-sky/30",
  perlu_penguatan_ganda: "bg-slate-100 text-slate-700 ring-slate-200",
};

function scoreBand(score: number): string {
  if (score >= 80) return "Kuat";
  if (score >= 60) return "Cukup solid";
  if (score >= 40) return "Perlu penguatan";
  return "Fondasi awal";
}

export function SkillResultPanel({ result }: { result: PublicSkillResult }) {
  const kind = result.domainAlignment.kind;
  const barWidth = Math.max(4, Math.min(100, result.score));

  return (
    <div className="space-y-5 sm:space-y-6">
      <section className="lab-card border-amber-200/80 bg-amber-50/90 p-4 text-sm text-slate-700 sm:p-5">
        <p className="lab-badge bg-white text-amber-900 ring-1 ring-amber-200">
          Pengembangan diri
        </p>
        <p className="mt-3 leading-relaxed">{result.disclaimer}</p>
      </section>

      <section className="lab-card relative overflow-hidden p-5 sm:p-6">
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-lab-mint/45 via-transparent to-lab-violet/10"
          aria-hidden
        />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-wide text-lab-teal">
            {result.categoryLabel}
          </p>
          <h2 className="mt-1 text-xl font-bold text-lab-navy sm:text-2xl">
            {result.fieldLabel}
          </h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-[auto_1fr] sm:items-end">
            <div>
              <p className="font-mono text-5xl font-bold tabular-nums text-lab-teal sm:text-6xl">
                {result.score}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                dari 100 · {scoreBand(result.score)}
              </p>
            </div>
            <div className="sm:pb-1">
              <div className="mb-1.5 flex justify-between text-xs text-slate-500">
                <span>
                  Benar {result.rawCorrect}/{result.rawTotal}
                </span>
                <span className="font-mono tabular-nums">{result.score}%</span>
              </div>
              <div className="lab-progress-track h-2.5">
                <div
                  className="lab-progress-fill h-2.5 bg-gradient-to-r from-lab-teal to-lab-sky"
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="lab-card p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h3 className="font-bold text-lab-navy">
            Kesesuaian dengan profil domain
          </h3>
          <span
            className={`lab-badge ring-1 ${ALIGNMENT_TONE[kind]}`}
          >
            {ALIGNMENT_LABEL[kind]}
          </span>
        </div>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-lab-mist/80 px-3 py-2.5">
            <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Rata-rata domain terkait
            </dt>
            <dd className="mt-0.5 font-mono text-2xl font-bold tabular-nums text-lab-navy">
              {result.domainAlignment.relevantDomainAvg}
            </dd>
          </div>
          <div className="rounded-xl bg-lab-mist/80 px-3 py-2.5">
            <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Skor keahlian bidang
            </dt>
            <dd className="mt-0.5 font-mono text-2xl font-bold tabular-nums text-lab-teal">
              {result.domainAlignment.skillScore}
            </dd>
          </div>
        </dl>
        <p className="mt-4 text-sm leading-relaxed text-slate-700">
          {result.domainAlignment.summary}
        </p>
      </section>

      <section className="lab-card border-lab-warm/15 bg-gradient-to-br from-orange-50/80 to-white p-5 sm:p-6">
        <h3 className="font-bold text-lab-navy">Insight keahlian</h3>
        <p className="mt-3 text-sm leading-relaxed text-slate-700">
          {result.insightProse}
        </p>
      </section>
    </div>
  );
}
