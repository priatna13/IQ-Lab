import Link from "next/link";
import { BrandLogo } from "@/components/ui/brand-logo";

const FOOTER_LINKS = [
  { href: "/faq", label: "FAQ" },
  { href: "/privasi", label: "Privasi" },
  { href: "/syarat", label: "Syarat" },
  { href: "/daftar", label: "Daftar" },
  { href: "/masuk", label: "Masuk" },
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-white/70 bg-white/75 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm">
      <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-8 sm:flex-row sm:items-start sm:justify-between sm:px-6 sm:py-10">
        <div className="max-w-sm space-y-3">
          <BrandLogo size="sm" href="/" compactWordmark />
          <p className="text-sm leading-relaxed text-slate-600">
            Asesmen multi-domain untuk pengembangan diri &amp; arah karir —
            fun, jujur, futuristik ringan.
          </p>
        </div>
        <nav
          className="grid grid-cols-2 gap-x-4 gap-y-1 sm:flex sm:flex-wrap sm:gap-x-1 sm:gap-y-1"
          aria-label="Tautan footer"
        >
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex min-h-11 items-center text-sm font-medium text-slate-600 hover:text-lab-teal sm:px-2"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <p className="mx-auto max-w-4xl px-4 pb-6 text-xs leading-relaxed text-slate-400 sm:px-6 sm:pb-8">
        © {new Date().getFullYear()} IQ-Lab · Bukan tes IST resmi · Bukan diagnosis
        klinis · Bukan sertifikasi rekrutmen
      </p>
    </footer>
  );
}
