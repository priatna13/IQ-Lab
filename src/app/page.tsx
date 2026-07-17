import { getInsForgePublicConfig } from "@/lib/insforge/public-config";

export default function HomePage() {
  const insforge = getInsForgePublicConfig();

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-8 px-6 py-16">
      <header className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-wide text-lab-teal">
          IQ-Lab
        </p>
        <h1 className="text-4xl font-semibold text-lab-navy">
          Asesmen multi-domain untuk potensi & karir
        </h1>
        <p className="text-lg text-slate-600">
          Profil kekuatan dan kelemahan kognitif untuk pengembangan diri —{" "}
          <strong>bukan</strong> tes IST resmi,{" "}
          <strong>bukan</strong> alat rekrutmen atau diagnosis klinis.
        </p>
      </header>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-lab-navy">Status backend</h2>
        <dl className="mt-3 space-y-2 text-sm text-slate-600">
          <div className="flex justify-between gap-4">
            <dt>InsForge (public config)</dt>
            <dd className="font-medium text-lab-teal">
              {insforge.isConfigured ? "terkonfigurasi" : "belum diisi"}
            </dd>
          </div>
          {insforge.isConfigured ? (
            <div className="flex justify-between gap-4">
              <dt>URL</dt>
              <dd className="truncate font-mono text-xs text-slate-500">
                {insforge.url}
              </dd>
            </div>
          ) : null}
        </dl>
        <p className="mt-4 text-xs text-slate-500">
          Kunci admin tidak pernah dikirim ke browser. Variabel publik:{" "}
          <code className="rounded bg-slate-100 px-1">
            NEXT_PUBLIC_INSFORGE_*
          </code>
        </p>
      </section>

      <p className="text-sm text-slate-500">
        Fondasi MVP — Assessment application boundary siap diuji. Auth &
        asesmen menyusul ticket berikutnya.
      </p>
    </main>
  );
}
