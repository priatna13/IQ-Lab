import { redirect } from "next/navigation";
import { PageShell } from "@/components/ui/page-shell";
import { BrandLogo } from "@/components/ui/brand-logo";
import { AgeBandForm } from "@/components/auth/age-band-form";
import { getSessionUser } from "@/lib/auth/session";

export default async function AgeOnboardingPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/masuk?next=/onboarding/usia");
  }
  if (user.ageBand) {
    redirect("/dashboard");
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
          <AgeBandForm />
        </div>
      </div>
    </PageShell>
  );
}
