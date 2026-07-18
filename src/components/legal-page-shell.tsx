import type { ReactNode } from "react";
import Link from "next/link";
import { PageShell } from "@/components/ui/page-shell";

type Props = {
  title: string;
  description: string;
  updated: string;
  children: ReactNode;
};

export function LegalPageShell({
  title,
  description,
  updated,
  children,
}: Props) {
  return (
    <PageShell width="lg" orbs="calm">
      <p className="lab-section-label">Kebijakan produk</p>
      <h1 className="mt-2 text-3xl font-bold text-lab-navy">{title}</h1>
      <p className="mt-3 text-slate-600">{description}</p>
      <p className="mt-2 text-xs text-slate-400">
        Terakhir diperbarui: {updated} · Bahasa: Indonesia
      </p>

      <div className="mt-4 flex flex-wrap gap-3 text-sm">
        <Link href="/privasi" className="font-medium text-lab-teal hover:underline">
          Kebijakan Privasi
        </Link>
        <span className="text-slate-300">·</span>
        <Link href="/syarat" className="font-medium text-lab-teal hover:underline">
          Syarat Penggunaan
        </Link>
        <span className="text-slate-300">·</span>
        <Link href="/faq" className="font-medium text-lab-teal hover:underline">
          FAQ & metodologi
        </Link>
      </div>

      <div className="prose-legal lab-card mt-8 space-y-8 p-5 text-sm leading-relaxed text-slate-700 sm:p-6">
        {children}
      </div>

      <p className="mt-8 rounded-[1.25rem] border border-amber-200 bg-amber-50 p-4 text-xs text-slate-600">
        Dokumen ini adalah kebijakan produk soft-launch IQ-Lab. Bukan nasihat
        hukum formal. Untuk pertanyaan data: gunakan kontak di dasbor atau
        saluran yang diumumkan operator proyek.
      </p>
    </PageShell>
  );
}

export function LegalSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-lg font-semibold text-lab-navy">{title}</h2>
      <div className="mt-2 space-y-2">{children}</div>
    </section>
  );
}
