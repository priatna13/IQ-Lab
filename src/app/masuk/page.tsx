import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { AuthForm } from "@/components/auth/auth-form";
import { GoogleButton } from "@/components/auth/google-button";
import { signInAction } from "@/app/actions/auth";
import { getSessionUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function SignInPage({ searchParams }: Props) {
  const user = await getSessionUser();
  if (user) {
    redirect(user.ageBand ? "/dashboard" : "/onboarding/usia");
  }

  const params = await searchParams;
  const oauthError = params.error
    ? decodeURIComponent(params.error)
    : null;

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-md px-6 py-12">
        <h1 className="text-2xl font-semibold text-lab-navy">Masuk</h1>
        <p className="mt-2 text-sm text-slate-600">
          Lanjutkan asesmen dan lihat hasil Anda.
        </p>

        <div className="mt-8 space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          {oauthError ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {oauthError === "oauth_failed" ||
              oauthError === "exchange_failed" ||
              oauthError === "missing_verifier"
                ? "Login Google gagal. Coba lagi atau gunakan email."
                : oauthError}
            </p>
          ) : null}

          <GoogleButton label="Lanjut dengan Google" />

          <div className="relative text-center text-xs text-slate-400">
            <span className="bg-white px-2">atau email</span>
            <div className="absolute inset-x-0 top-1/2 -z-10 border-t border-slate-200" />
          </div>

          <AuthForm action={signInAction} submitLabel="Masuk" />
        </div>

        <p className="mt-6 text-center text-sm text-slate-600">
          Belum punya akun?{" "}
          <Link href="/daftar" className="font-semibold text-lab-teal">
            Daftar
          </Link>
        </p>
      </main>
    </>
  );
}
