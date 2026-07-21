import { redirect } from "next/navigation";
import { PageShell } from "@/components/ui/page-shell";
import { BrandLogo } from "@/components/ui/brand-logo";
import { AgeBandForm } from "@/components/auth/age-band-form";
import { getSessionUser } from "@/lib/auth/session";
import { isAdminEmail } from "@/lib/auth/admin";
import { parseSafeNextPath } from "@/lib/auth/safe-next-path";

type Props = {
  searchParams: Promise<{ next?: string }>;
};

export default async function AgeOnboardingPage({ searchParams }: Props) {
  const params = await searchParams;
  const safeNext = parseSafeNextPath(params.next);

  const user = await getSessionUser();
  if (!user) {
    const login = new URLSearchParams({ next: "/onboarding/usia" });
    if (safeNext) login.set("next", safeNext);
    // Prefer deep-link destination if present; otherwise onboarding itself.
    redirect(
      safeNext
        ? `/masuk?next=${encodeURIComponent(safeNext)}`
        : "/masuk?next=/onboarding/usia",
    );
  }

  // Mirror email sign-in: admin portal does not require age band.
  if (isAdminEmail(user.email) && safeNext?.startsWith("/admin")) {
    redirect(safeNext);
  }
  if (isAdminEmail(user.email) && !user.ageBand && !safeNext) {
    redirect("/admin");
  }

  if (user.ageBand) {
    redirect(safeNext ?? "/dashboard");
  }

  return (
    <PageShell width="sm" orbs="calm" footer={false}>
      <div className="animate-fade-up">
        <BrandLogo size="md" href="/" />
        <p className="lab-section-label mt-6">Onboarding</p>
        <h1 className="mt-2 text-2xl font-bold text-lab-navy sm:text-3xl">
          Satu langkah lagi
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Rentang usia membantu kelayakan asesmen dan kalibrasi norma internal
          (tanpa data sensitif berlebih).
        </p>
        <div className="lab-card mt-8 p-5 sm:p-6">
          <AgeBandForm nextPath={safeNext ?? undefined} />
        </div>
      </div>
    </PageShell>
  );
}
