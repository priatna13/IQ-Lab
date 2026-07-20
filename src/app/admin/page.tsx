import Link from "next/link";
import { redirect } from "next/navigation";
import { PageShell } from "@/components/ui/page-shell";
import { getAdminSessionUser } from "@/lib/auth/admin";
import { listAdminAttempts } from "@/lib/admin/participant-reports";
import { signOutAction } from "@/app/actions/auth";

export default async function AdminHomePage() {
  const admin = await getAdminSessionUser();
  if (!admin) {
    redirect("/masuk?next=/admin");
  }

  let rows: Awaited<ReturnType<typeof listAdminAttempts>> = [];
  let loadError: string | null = null;
  try {
    rows = await listAdminAttempts();
  } catch (e) {
    loadError =
      e instanceof Error ? e.message : "Gagal memuat data admin.";
  }

  return (
    <PageShell width="2xl" orbs="calm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="lab-section-label">Portal admin</p>
          <h1 className="mt-1 text-2xl font-bold text-lab-navy sm:text-3xl">
            Data peserta &amp; hasil
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Login sebagai {admin.email}. Lihat attempt, skor domain, radar, dan
            insight.
          </p>
        </div>
        <form action={signOutAction}>
          <button type="submit" className="lab-btn-secondary min-h-11">
            Keluar admin
          </button>
        </form>
      </div>

      {loadError ? (
        <p role="alert" className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {loadError}
        </p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-soft">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-lab-mist/50 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3">Nama</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Track</th>
                <th className="px-4 py-3">Composite</th>
                <th className="px-4 py-3">IQ est.</th>
                <th className="px-4 py-3">Mulai</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-slate-50 hover:bg-lab-mist/30"
                >
                  <td className="px-4 py-3">
                    <span className="font-medium text-lab-navy">
                      {r.participantName || "—"}
                    </span>
                    <span className="mt-0.5 block font-mono text-[11px] text-slate-400">
                      {r.participantId.slice(0, 13)}…
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700 break-all">
                    {r.participantEmail || (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        r.status === "completed"
                          ? "font-medium text-lab-teal-deep"
                          : r.status === "abandoned"
                            ? "text-slate-500"
                            : "text-amber-800"
                      }
                    >
                      {r.status}
                    </span>
                    {r.isPrimary ? (
                      <span className="ml-1 text-[10px] font-semibold uppercase text-lab-violet">
                        primary
                      </span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">{r.track}</td>
                  <td className="px-4 py-3 font-mono tabular-nums">
                    {r.compositeIndex ?? "—"}
                  </td>
                  <td className="px-4 py-3 font-mono tabular-nums">
                    {r.iqEstimate ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {new Date(r.startedAt).toLocaleString("id-ID")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/attempt/${r.id}`}
                      className="font-semibold text-lab-teal hover:underline"
                    >
                      Detail
                    </Link>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && !loadError ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-10 text-center text-slate-500"
                  >
                    Belum ada attempt.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      )}
    </PageShell>
  );
}
