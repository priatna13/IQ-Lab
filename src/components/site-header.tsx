import Link from "next/link";
import { getSessionUser } from "@/lib/auth/session";
import { signOutAction } from "@/app/actions/auth";

export async function SiteHeader() {
  const user = await getSessionUser();

  return (
    <header className="sticky top-0 z-40 border-b border-white/60 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
        <Link
          href="/"
          className="group flex items-center gap-2 font-bold tracking-tight text-lab-navy"
          aria-label="IQ-Lab beranda"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-lab-teal to-lab-violet text-xs font-bold text-white shadow-soft transition group-hover:shadow-lift">
            IQ
          </span>
          <span className="text-base sm:text-lg">IQ-Lab</span>
        </Link>
        <nav
          className="flex flex-wrap items-center justify-end gap-1 sm:gap-2"
          aria-label="Navigasi utama"
        >
          <Link href="/faq" className="lab-btn-ghost text-xs sm:text-sm">
            FAQ
          </Link>
          {user ? (
            <>
              <Link href="/dashboard" className="lab-btn-ghost text-xs sm:text-sm">
                Dasbor
              </Link>
              <form action={signOutAction}>
                <button type="submit" className="lab-btn-secondary !min-h-9 !px-3 !py-1.5 text-xs sm:text-sm">
                  Keluar
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/masuk" className="lab-btn-ghost text-xs sm:text-sm">
                Masuk
              </Link>
              <Link
                href="/daftar"
                className="lab-btn-primary !min-h-9 !px-3 !py-1.5 text-xs sm:text-sm"
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
