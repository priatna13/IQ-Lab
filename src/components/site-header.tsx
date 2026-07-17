import Link from "next/link";
import { getSessionUser } from "@/lib/auth/session";
import { signOutAction } from "@/app/actions/auth";

export async function SiteHeader() {
  const user = await getSessionUser();

  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="font-semibold text-lab-navy">
          IQ-Lab
        </Link>
        <nav className="flex items-center gap-3 text-sm">
          <Link href="/faq" className="text-slate-600 hover:text-lab-navy">
            FAQ
          </Link>
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="text-slate-600 hover:text-lab-navy"
              >
                Dasbor
              </Link>
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="rounded-lg border border-slate-300 px-3 py-1.5 font-medium text-lab-navy hover:bg-slate-50"
                >
                  Keluar
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/masuk"
                className="text-slate-600 hover:text-lab-navy"
              >
                Masuk
              </Link>
              <Link
                href="/daftar"
                className="rounded-lg bg-lab-teal px-3 py-1.5 font-semibold text-white"
              >
                Daftar
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
