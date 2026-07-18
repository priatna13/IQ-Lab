import Link from "next/link";
import { getSessionUser } from "@/lib/auth/session";
import { signOutAction } from "@/app/actions/auth";
import { BrandLogo } from "@/components/ui/brand-logo";

export async function SiteHeader() {
  const user = await getSessionUser();

  return (
    <header className="sticky top-0 z-40 border-b border-white/70 bg-white/90 pt-[env(safe-area-inset-top)] backdrop-blur-md supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between gap-2 px-4 sm:h-16 sm:gap-3 sm:px-6">
        <BrandLogo size="sm" compactWordmark priority />
        <nav
          className="flex shrink-0 items-center justify-end gap-0.5 sm:gap-1.5"
          aria-label="Navigasi utama"
        >
          <Link
            href="/faq"
            className="lab-btn-ghost min-h-11 px-2.5 text-sm sm:px-3"
          >
            FAQ
          </Link>
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="lab-btn-ghost min-h-11 px-2.5 text-sm sm:px-3"
              >
                Dasbor
              </Link>
              <form action={signOutAction} className="inline-flex">
                <button
                  type="submit"
                  className="lab-btn-secondary min-h-11 px-3 text-sm sm:px-4"
                >
                  Keluar
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/masuk"
                className="lab-btn-ghost min-h-11 px-2.5 text-sm sm:px-3"
              >
                Masuk
              </Link>
              <Link
                href="/daftar"
                className="lab-btn-primary min-h-11 px-3 text-sm sm:px-4"
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
