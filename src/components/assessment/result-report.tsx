import type { PublicResultReport } from "@/domain/assessment";

const BAR_HUES = [
  "from-lab-teal to-lab-teal-deep",
  "from-lab-sky to-lab-teal",
  "from-lab-violet to-lab-teal",
  "from-lab-teal to-lab-sky",
  "from-lab-violet/90 to-lab-violet",
  "from-lab-teal-deep to-lab-navy-soft",
  "from-lab-sky to-lab-violet",
  "from-lab-teal to-emerald-600",
  "from-lab-navy-soft to-lab-teal",
];

export function ResultReport({ report }: { report: PublicResultReport }) {
  const payload = report.rulePayload;

  return (
    <div className="space-y-6 sm:space-y-8">
      <section className="lab-card animate-fade-up border-amber-200/80 bg-amber-50/90 p-4 text-sm text-slate-700 sm:p-5">
        <p className="lab-badge bg-white text-lab-warm ring-1 ring-amber-200">
          {report.labels.normBadge}
        </p>
        <p className="mt-3 leading-relaxed">{report.labels.disclaimer}</p>
      </section>

      <section className="grid animate-fade-up-1 gap-4 sm:grid-cols-2">
        <div className="lab-card relative overflow-hidden p-5">
          <div className="absolute inset-0 bg-gradient-to-br from-lab-mint/40 to-transparent" aria-hidden />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {report.labels.composite}
            </p>
            <p className="mt-2 font-mono text-4xl font-bold tabular-nums text-lab-navy sm:text-5xl">
              {report.compositeIndex}
            </p>
            <p className="mt-1 text-xs text-slate-500">Skala 1–100 (internal)</p>
          </div>
        </div>
        <div className="lab-card relative overflow-hidden p-5">
          <div className="absolute inset-0 bg-gradient-to-br from-lab-teal/10 to-lab-violet/10" aria-hidden />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {report.labels.iqEstimate}
            </p>
            <p className="mt-2 font-mono text-4xl font-bold tabular-nums text-lab-teal sm:text-5xl">
              {report.iqEstimate}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Norma: {report.normVersion}
            </p>
          </div>
        </div>
      </section>

      <section className="lab-card animate-fade-up-2 p-5 sm:p-6">
        <h2 className="text-lg font-bold text-lab-navy">
          Profil kemampuan (9 domain)
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Track:{" "}
          <span className="font-medium text-lab-teal">
            {report.track === "explore"
              ? "Jelajahi potensi"
              : "Rancang langkah karir"}
          </span>
        </p>
        <ul className="mt-6 space-y-5">
          {report.abilityProfile.map((entry, i) => (
            <li key={entry.domainId}>
              <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-2 text-sm">
                <span className="min-w-0 break-words font-medium text-lab-navy">
                  {entry.label}
                </span>
                <span className="shrink-0 font-mono tabular-nums text-slate-600">
                  {entry.score}
                  <span className="text-slate-400">
                    {" "}
                    · {entry.rawCorrect}/{entry.rawTotal}
                  </span>
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-100">
                <div
                  className={`h-full origin-left rounded-full bg-gradient-to-r ${BAR_HUES[i % BAR_HUES.length]} animate-bar-in`}
                  style={{
                    width: `${Math.max(4, Math.min(100, entry.score))}%`,
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      </section>

      {payload ? (
        <section className="lab-card animate-fade-up-3 p-5 sm:p-6">
          <h2 className="text-lg font-bold text-lab-navy">
            Klaster arah (rule engine)
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Versi {payload.version} · keyakinan peta: {payload.confidence}
          </p>
          <ul className="mt-4 space-y-3">
            {payload.clusters.map((c) => (
              <li
                key={c.id}
                className="rounded-xl border border-slate-100 bg-gradient-to-r from-lab-mist/80 to-white px-4 py-3 text-sm"
              >
                <div className="flex flex-wrap justify-between gap-2 font-semibold text-lab-navy">
                  <span className="break-words">{c.label}</span>
                  <span className="font-mono tabular-nums text-lab-teal">
                    ~{c.fitScore}
                  </span>
                </div>
                {c.supportingDomains.length > 0 ? (
                  <p className="mt-1 text-xs text-slate-500">
                    Didukung: {c.supportingDomains.join(", ")}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
          {payload.skillPriorities.length > 0 ? (
            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Prioritas skill
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {payload.skillPriorities.map((s) => (
                  <span
                    key={s}
                    className="lab-badge bg-lab-mint/70 text-lab-teal-deep ring-1 ring-lab-teal/15"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </section>
      ) : null}

      <section className="lab-card border-lab-warm/20 bg-gradient-to-br from-orange-50/90 to-white p-5 text-sm text-slate-700 sm:p-6">
        <h2 className="font-bold text-lab-navy">Insight</h2>
        <p className="mt-3 leading-relaxed">
          {report.insightProse ??
            "Insight belum tersedia pada snapshot ini."}
        </p>
      </section>

      <section className="lab-card p-5 text-sm text-slate-700 sm:p-6">
        <h2 className="font-bold text-lab-navy">Action plan</h2>
        <p className="mt-3 leading-relaxed">
          {report.actionPlanProse ??
            "Action plan belum tersedia pada snapshot ini."}
        </p>
      </section>

      <p className="text-xs text-slate-400">
        Dibekukan: {new Date(report.frozenAt).toLocaleString("id-ID")} · Content{" "}
        {report.contentVersionId}
      </p>
    </div>
  );
}
