import Link from "next/link";
import { getSessionUser } from "@/lib/auth/session";
import { signOutAction } from "@/app/actions/auth";
import { BrandLogo } from "@/components/ui/brand-logo";
import {
  IconDashboard,
  IconHelp,
  IconLogin,
  IconLogout,
  IconUserPlus,
} from "@/components/ui/icons";

export async function SiteHeader() {
  const user = await getSessionUser();

  return (
    <header className="sticky top-0 z-40 overflow-visible border-b border-white/70 bg-white/90 pt-[env(safe-area-inset-top)] backdrop-blur-md supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex min-h-14 max-w-4xl items-center justify-between gap-2 overflow-visible px-3 py-2 sm:min-h-16 sm:gap-3 sm:px-6 sm:py-2.5">
        <div className="flex min-w-0 shrink items-center">
          <BrandLogo size="sm" compactWordmark priority />
        </div>

        <nav className="lab-dock shrink-0" aria-label="Navigasi utama">
          <Link href="/faq" className="lab-dock-item">
            <IconHelp className="lab-dock-icon" />
            <span className="lab-dock-label">FAQ</span>
          </Link>

          {user ? (
            <>
              <Link href="/dashboard" className="lab-dock-item">
                <IconDashboard className="lab-dock-icon" />
                <span className="lab-dock-label">Dasbor</span>
              </Link>
              <form action={signOutAction} className="contents">
                <button type="submit" className="lab-dock-item">
                  <IconLogout className="lab-dock-icon" />
                  <span className="lab-dock-label">Keluar</span>
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/masuk" className="lab-dock-item">
                <IconLogin className="lab-dock-icon" />
                <span className="lab-dock-label">Masuk</span>
              </Link>
              <Link href="/daftar" className="lab-dock-item lab-dock-item--cta">
                <IconUserPlus className="lab-dock-icon" />
                <span className="lab-dock-label">Daftar</span>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
