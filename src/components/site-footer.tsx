import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-4xl flex-col gap-3 px-6 py-8 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} IQ-Lab · Pengembangan diri multi-domain
        </p>
        <nav className="flex flex-wrap gap-4" aria-label="Tautan footer">
          <Link href="/faq" className="hover:text-lab-navy hover:underline">
            FAQ & metodologi
          </Link>
          <Link href="/privasi" className="hover:text-lab-navy hover:underline">
            Privasi
          </Link>
          <Link href="/syarat" className="hover:text-lab-navy hover:underline">
            Syarat
          </Link>
          <Link href="/daftar" className="hover:text-lab-navy hover:underline">
            Daftar
          </Link>
          <Link href="/masuk" className="hover:text-lab-navy hover:underline">
            Masuk
          </Link>
        </nav>
      </div>
      <p className="mx-auto max-w-4xl px-6 pb-6 text-xs text-slate-400">
        Bukan tes IST resmi · Bukan diagnosis klinis · Bukan sertifikasi
        rekrutmen
      </p>
    </footer>
  );
}
