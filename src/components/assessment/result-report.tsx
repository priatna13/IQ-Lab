import type { PublicResultReport } from "@/domain/assessment";

export function ResultReport({ report }: { report: PublicResultReport }) {
  const maxScore = Math.max(
    ...report.abilityProfile.map((d) => d.score),
    1,
  );

  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-slate-700">
        <p className="font-semibold text-lab-navy">{report.labels.normBadge}</p>
        <p className="mt-2">{report.labels.disclaimer}</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {report.labels.composite}
          </p>
          <p className="mt-2 text-4xl font-semibold text-lab-navy">
            {report.compositeIndex}
          </p>
          <p className="mt-1 text-xs text-slate-500">Skala 1–100 (internal)</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {report.labels.iqEstimate}
          </p>
          <p className="mt-2 text-4xl font-semibold text-lab-teal">
            {report.iqEstimate}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Norma: {report.normVersion}
          </p>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-lab-navy">
          Profil kemampuan (9 domain)
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Track:{" "}
          {report.track === "explore"
            ? "Jelajahi potensi"
            : "Rancang langkah karir"}
        </p>
        <ul className="mt-6 space-y-4">
          {report.abilityProfile.map((entry) => (
            <li key={entry.domainId}>
              <div className="mb-1 flex justify-between gap-2 text-sm">
                <span className="font-medium text-lab-navy">{entry.label}</span>
                <span className="tabular-nums text-slate-600">
                  {entry.score}
                  <span className="text-slate-400">
                    {" "}
                    · {entry.rawCorrect}/{entry.rawTotal}
                  </span>
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-lab-teal"
                  style={{ width: `${(entry.score / maxScore) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-600">
        <p className="font-medium text-lab-navy">Insight karir</p>
        <p className="mt-2">
          Narasi klaster karir & action plan (rule + LLM) menyusul di ticket
          berikutnya. Snapshot skor sudah dibekukan dan tidak dihitung ulang.
        </p>
      </section>

      <p className="text-xs text-slate-400">
        Dibekukan: {new Date(report.frozenAt).toLocaleString("id-ID")} · Content{" "}
        {report.contentVersionId}
      </p>
    </div>
  );
}
