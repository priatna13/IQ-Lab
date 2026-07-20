import type { AdminAttemptDetail } from "@/lib/admin/participant-reports";
import { AbilityRadar } from "@/components/assessment/ability-radar";
import { getDomainVisual } from "@/domain/assessment/domain-visual";

export function AdminAttemptDetailView({
  detail,
}: {
  detail: AdminAttemptDetail;
}) {
  const a = detail.attempt;
  const profile = detail.abilityProfile;

  return (
    <div className="space-y-6">
      <section className="lab-card p-5 sm:p-6">
        <p className="lab-section-label">Ringkasan attempt</p>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase text-slate-500">
              Peserta
            </dt>
            <dd className="mt-0.5 font-medium text-lab-navy break-all">
              {a.participantName || a.participantEmail || a.participantId}
            </dd>
            {a.participantEmail ? (
              <dd className="text-xs text-slate-500">{a.participantEmail}</dd>
            ) : null}
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase text-slate-500">
              Attempt ID
            </dt>
            <dd className="mt-0.5 font-mono text-xs text-slate-700 break-all">
              {a.id}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase text-slate-500">
              Status
            </dt>
            <dd className="mt-0.5 font-medium text-lab-navy">{a.status}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase text-slate-500">
              Track
            </dt>
            <dd className="mt-0.5">{a.track}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase text-slate-500">
              Content version
            </dt>
            <dd className="mt-0.5 font-mono text-xs">{a.contentVersionId}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase text-slate-500">
              Primary
            </dt>
            <dd className="mt-0.5">{a.isPrimary ? "Ya" : "Tidak"}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase text-slate-500">
              Mulai
            </dt>
            <dd className="mt-0.5">
              {new Date(a.startedAt).toLocaleString("id-ID")}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase text-slate-500">
              Selesai
            </dt>
            <dd className="mt-0.5">
              {a.completedAt
                ? new Date(a.completedAt).toLocaleString("id-ID")
                : "—"}
            </dd>
          </div>
        </dl>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="lab-card p-5">
          <p className="text-xs font-semibold uppercase text-slate-500">
            Composite index
          </p>
          <p className="mt-2 font-mono text-4xl font-bold tabular-nums text-lab-navy">
            {detail.compositeIndex ?? "—"}
          </p>
        </div>
        <div className="lab-card p-5">
          <p className="text-xs font-semibold uppercase text-slate-500">
            Estimasi IQ
          </p>
          <p className="mt-2 font-mono text-4xl font-bold tabular-nums text-lab-teal">
            {detail.iqEstimate ?? "—"}
          </p>
          {detail.normVersion ? (
            <p className="mt-1 text-xs text-slate-500">
              Norma: {detail.normVersion}
            </p>
          ) : null}
        </div>
      </section>

      {profile.length > 0 ? (
        <section className="lab-card p-5 sm:p-6">
          <h2 className="text-lg font-bold text-lab-navy">
            Profil 9 domain + radar
          </h2>
          <div className="mt-6 grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:items-center">
            <AbilityRadar profile={profile} />
            <ul className="space-y-4">
              {profile.map((entry) => {
                const v = getDomainVisual(entry.domainId);
                return (
                  <li key={entry.domainId}>
                    <div className="mb-1 flex justify-between gap-2 text-sm">
                      <span className="font-medium text-lab-navy">
                        {entry.label}{" "}
                        <span className="text-xs text-slate-400">
                          ({v.shortLabel})
                        </span>
                      </span>
                      <span className="font-mono tabular-nums text-slate-600">
                        {entry.score} · {entry.rawCorrect}/{entry.rawTotal}
                      </span>
                    </div>
                    <div className="lab-progress-track">
                      <div
                        className={`lab-progress-fill bg-gradient-to-r ${v.accentBar}`}
                        style={{
                          width: `${Math.max(4, Math.min(100, entry.score))}%`,
                        }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      ) : (
        <section className="lab-card p-5 text-sm text-slate-600">
          Belum ada Result Snapshot (attempt belum completed atau gagal freeze).
        </section>
      )}

      <section className="lab-card p-5 sm:p-6">
        <h2 className="text-lg font-bold text-lab-navy">Domain sessions</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase text-slate-500">
                <th className="py-2 pr-3">#</th>
                <th className="py-2 pr-3">Domain</th>
                <th className="py-2 pr-3">Status</th>
                <th className="py-2 pr-3">Tutup</th>
                <th className="py-2 pr-3">Skor mentah</th>
                <th className="py-2">Waktu</th>
              </tr>
            </thead>
            <tbody>
              {detail.domainSessions.map((s) => {
                const v = getDomainVisual(s.domainId);
                return (
                  <tr
                    key={s.id}
                    className="border-b border-slate-50 text-slate-700"
                  >
                    <td className="py-2.5 pr-3 font-mono">{s.sequenceIndex}</td>
                    <td className="py-2.5 pr-3">
                      <span className={`font-medium ${v.accentText}`}>
                        {v.shortLabel}
                      </span>
                      <span className="mt-0.5 block text-xs text-slate-400">
                        {s.domainId}
                      </span>
                    </td>
                    <td className="py-2.5 pr-3">{s.status}</td>
                    <td className="py-2.5 pr-3">{s.closeReason ?? "—"}</td>
                    <td className="py-2.5 pr-3 font-mono tabular-nums">
                      {s.rawCorrect ?? "—"}/{s.rawTotal ?? "—"}
                    </td>
                    <td className="py-2.5 text-xs text-slate-500">
                      {new Date(s.startedAt).toLocaleString("id-ID")}
                      {s.closedAt
                        ? ` → ${new Date(s.closedAt).toLocaleString("id-ID")}`
                        : ""}
                    </td>
                  </tr>
                );
              })}
              {detail.domainSessions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-4 text-slate-500">
                    Belum ada domain session.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      {detail.rulePayload ? (
        <section className="lab-card p-5 sm:p-6">
          <h2 className="text-lg font-bold text-lab-navy">Rule payload</h2>
          <p className="mt-1 text-xs text-slate-500">
            {detail.rulePayload.version} · confidence{" "}
            {detail.rulePayload.confidence}
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {detail.rulePayload.clusters.map((c) => (
              <li
                key={c.id}
                className="rounded-xl border border-slate-100 bg-lab-mist/40 px-3 py-2"
              >
                <span className="font-semibold text-lab-navy">{c.label}</span>
                <span className="ml-2 font-mono text-lab-teal">
                  ~{c.fitScore}
                </span>
              </li>
            ))}
          </ul>
          {detail.rulePayload.skillPriorities.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {detail.rulePayload.skillPriorities.map((s) => (
                <span
                  key={s}
                  className="lab-badge bg-lab-mint/70 text-lab-teal-deep ring-1 ring-lab-teal/15"
                >
                  {s}
                </span>
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {detail.insightProse ? (
        <section className="lab-card p-5 sm:p-6 text-sm">
          <h2 className="font-bold text-lab-navy">Insight</h2>
          <p className="mt-3 leading-relaxed text-slate-700">
            {detail.insightProse}
          </p>
        </section>
      ) : null}

      {detail.actionPlanProse ? (
        <section className="lab-card p-5 sm:p-6 text-sm">
          <h2 className="font-bold text-lab-navy">Action plan</h2>
          <p className="mt-3 leading-relaxed text-slate-700">
            {detail.actionPlanProse}
          </p>
        </section>
      ) : null}
    </div>
  );
}
