import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { AuthForm } from "@/components/auth/auth-form";
import { GoogleButton } from "@/components/auth/google-button";
import { signUpAction } from "@/app/actions/auth";
import { getSessionUser } from "@/lib/auth/session";

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function SignUpPage({ searchParams }: Props) {
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
      <main id="main-content" className="mx-auto max-w-md px-6 py-12">
        <h1 className="text-2xl font-semibold text-lab-navy">Buat akun</h1>
        <p className="mt-2 text-sm text-slate-600">
          Gratis. Account wajib sebelum memulai asesmen.
        </p>

        <div className="mt-8 space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          {oauthError ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {oauthError === "oauth_failed" ||
              oauthError === "exchange_failed" ||
              oauthError === "missing_verifier"
                ? "Daftar Google gagal. Coba lagi atau gunakan email. Pastikan Google OAuth aktif di InsForge."
                : oauthError}
            </p>
          ) : null}

          <GoogleButton label="Daftar dengan Google" />

          <div className="relative text-center text-xs text-slate-400">
            <span className="bg-white px-2">atau email</span>
            <div className="absolute inset-x-0 top-1/2 -z-10 border-t border-slate-200" />
          </div>

          <AuthForm
            action={signUpAction}
            submitLabel="Daftar"
            includeName
          />
        </div>

        <p className="mt-4 text-xs text-slate-500">
          Dengan mendaftar, Anda menyetujui{" "}
          <Link href="/syarat" className="font-medium text-lab-teal hover:underline">
            Syarat Penggunaan
          </Link>{" "}
          dan{" "}
          <Link href="/privasi" className="font-medium text-lab-teal hover:underline">
            Kebijakan Privasi
          </Link>
          , serta memahami IQ-Lab bukan tes IST resmi dan bukan alat
          rekrutmen/klinis.
        </p>

        <p className="mt-6 text-center text-sm text-slate-600">
          Sudah punya akun?{" "}
          <Link href="/masuk" className="font-semibold text-lab-teal">
            Masuk
          </Link>
        </p>
      </main>
    </>
  );
}
