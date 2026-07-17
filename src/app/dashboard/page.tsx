import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { getSessionUser } from "@/lib/auth/session";
import { signOutAction } from "@/app/actions/auth";

export default async function DashboardPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/masuk?next=/dashboard");
  }
  if (!user.ageBand) {
    redirect("/onboarding/usia");
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-2xl font-semibold text-lab-navy">Dasbor</h1>
        <p className="mt-2 text-slate-600">
          Halo{user.name ? `, ${user.name}` : ""}
          {user.email ? (
            <>
              {" "}
              <span className="text-slate-400">({user.email})</span>
            </>
          ) : null}
        </p>

        <div className="mt-8 space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-slate-500">Rentang usia</dt>
              <dd className="font-medium text-lab-navy">
                {user.ageBand === "18_45"
                  ? "18–45 tahun"
                  : user.ageBand === "46_plus"
                    ? "46+ tahun"
                    : user.ageBand}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Status asesmen</dt>
              <dd className="font-medium text-lab-navy">
                Belum ada Attempt (menyusul ticket berikutnya)
              </dd>
            </div>
          </dl>

          {user.ageBand === "46_plus" ? (
            <p className="rounded-lg bg-orange-50 px-3 py-2 text-sm text-slate-700">
              Anda mendaftar dengan disclaimer 46+: norma & saran karir fase
              awal dioptimalkan untuk 18–45.
            </p>
          ) : null}

          <p className="text-sm text-slate-600">
            Pilih Track dan mulai asesmen 9 domain akan tersedia setelah
            Content Version & runner siap.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/"
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-lab-navy"
            >
              Beranda
            </Link>
            <form action={signOutAction}>
              <button
                type="submit"
                className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white"
              >
                Keluar
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
