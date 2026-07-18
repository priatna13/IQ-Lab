import Link from "next/link";
import { BrandLogo } from "@/components/ui/brand-logo";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-white/70 bg-white/75 backdrop-blur-sm">
      <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div className="max-w-sm space-y-3">
          <BrandLogo size="sm" href="/" />
          <p className="text-sm leading-relaxed text-slate-600">
            Asesmen multi-domain untuk pengembangan diri &amp; arah karir —
            fun, jujur, futuristik ringan.
          </p>
        </div>
        <nav
          className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-slate-600"
          aria-label="Tautan footer"
        >
          <Link href="/faq" className="hover:text-lab-teal">
            FAQ
          </Link>
          <Link href="/privasi" className="hover:text-lab-teal">
            Privasi
          </Link>
          <Link href="/syarat" className="hover:text-lab-teal">
            Syarat
          </Link>
          <Link href="/daftar" className="hover:text-lab-teal">
            Daftar
          </Link>
          <Link href="/masuk" className="hover:text-lab-teal">
            Masuk
          </Link>
        </nav>
      </div>
      <p className="mx-auto max-w-4xl px-4 pb-8 text-xs leading-relaxed text-slate-400 sm:px-6">
        © {new Date().getFullYear()} IQ-Lab · Bukan tes IST resmi · Bukan diagnosis
        klinis · Bukan sertifikasi rekrutmen
      </p>
    </footer>
  );
}
