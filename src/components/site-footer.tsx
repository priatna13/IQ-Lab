import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-white/70 bg-white/70 backdrop-blur-sm">
      <div className="mx-auto flex max-w-4xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="font-semibold text-lab-navy">IQ-Lab</p>
          <p className="mt-1 text-sm text-slate-600">
            Pengembangan diri multi-domain — fun, jujur, futuristik ringan.
          </p>
        </div>
        <nav
          className="flex flex-wrap gap-x-4 gap-y-2 text-sm font-medium text-slate-600"
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
      <p className="mx-auto max-w-4xl px-4 pb-6 text-xs text-slate-400 sm:px-6">
        © {new Date().getFullYear()} IQ-Lab · Bukan tes IST resmi · Bukan diagnosis
        klinis · Bukan sertifikasi rekrutmen
      </p>
    </footer>
  );
}
