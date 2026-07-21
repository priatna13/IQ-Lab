import Link from "next/link";
import { redirect } from "next/navigation";
import { PageShell } from "@/components/ui/page-shell";
import { BrandLogo } from "@/components/ui/brand-logo";
import { AuthForm } from "@/components/auth/auth-form";
import { GoogleButton } from "@/components/auth/google-button";
import { signInAction } from "@/app/actions/auth";
import { getSessionUser } from "@/lib/auth/session";
import { isAdminEmail } from "@/lib/auth/admin";
import { parseSafeNextPath } from "@/lib/auth/safe-next-path";

type Props = {
  searchParams: Promise<{ error?: string; next?: string }>;
};

export default async function SignInPage({ searchParams }: Props) {
  const params = await searchParams;
  const nextPath = parseSafeNextPath(params.next) ?? undefined;

  const user = await getSessionUser();
  if (user) {
    if (isAdminEmail(user.email) || nextPath?.startsWith("/admin")) {
      redirect(nextPath?.startsWith("/admin") ? nextPath : "/admin");
    }
    if (!user.ageBand) {
      redirect("/onboarding/usia");
    }
    // Honor safe ?next= after session restore (middleware deep-link to protected route).
    if (nextPath) {
      redirect(nextPath);
    }
    redirect("/dashboard");
  }

  const oauthError = params.error
    ? decodeURIComponent(params.error)
    : null;

  return (
    <PageShell width="sm" orbs="calm">
      <div className="animate-fade-up">
        <div className="mb-6 flex justify-center sm:justify-start">
          <BrandLogo size="md" href="/" />
        </div>
        <p className="lab-section-label">Selamat datang kembali</p>
        <h1 className="mt-2 text-2xl font-bold text-lab-navy sm:text-3xl">
          Masuk
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          {nextPath?.startsWith("/admin")
            ? "Masuk dengan akun admin untuk portal operator."
            : "Lanjutkan asesmen dan lihat hasil Anda."}
        </p>

        <div className="lab-card relative mt-8 space-y-6 p-5 sm:p-6">
          {oauthError ? (
            <p
              role="alert"
              className="rounded-xl bg-red-50 px-3 py-2.5 text-sm text-red-700 ring-1 ring-red-100"
            >
              {oauthError === "oauth_failed" ||
              oauthError === "exchange_failed" ||
              oauthError === "missing_verifier"
                ? "Login Google gagal. Coba lagi atau gunakan email."
                : oauthError}
            </p>
          ) : null}

          <GoogleButton label="Lanjut dengan Google" nextPath={nextPath} />

          <div className="relative text-center text-xs text-slate-600">
            <span className="relative z-10 bg-white px-2">atau email</span>
            <div className="absolute inset-x-0 top-1/2 -z-0 border-t border-slate-100" />
          </div>

          <AuthForm
            action={signInAction}
            submitLabel="Masuk"
            nextPath={nextPath}
          />
        </div>

        <p className="mt-6 text-center text-sm text-slate-600">
          Belum punya akun?{" "}
          <Link href="/daftar" className="font-semibold text-lab-teal hover:underline">
            Daftar
          </Link>
        </p>
      </div>
    </PageShell>
  );
}
