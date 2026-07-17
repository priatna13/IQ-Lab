import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
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
    <>
      <SiteHeader />
      <main className="mx-auto max-w-lg px-6 py-12">
        <h1 className="text-2xl font-semibold text-lab-navy">
          Satu langkah lagi
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Rentang usia membantu kelayakan asesmen dan kalibrasi norma internal
          (tanpa data sensitif berlebih).
        </p>
        <div className="mt-8">
          <AgeBandForm />
        </div>
      </main>
    </>
  );
}
