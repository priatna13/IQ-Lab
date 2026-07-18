import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AuthForm } from "@/components/auth/auth-form";
import { GoogleButton } from "@/components/auth/google-button";
import { MeshOrbs } from "@/components/ui/mesh-orbs";
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
      <main
        id="main-content"
        className="relative mx-auto w-full max-w-md flex-1 overflow-hidden px-4 py-10 sm:px-6 sm:py-12"
      >
        <MeshOrbs calm />
        <div className="relative animate-fade-up">
          <p className="lab-section-label">Mulai perjalanan</p>
          <h1 className="mt-2 text-2xl font-bold text-lab-navy sm:text-3xl">
            Buat akun
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Gratis. Account wajib sebelum memulai asesmen.
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
                  ? "Daftar Google gagal. Coba lagi atau gunakan email. Pastikan Google OAuth aktif di InsForge."
                  : oauthError}
              </p>
            ) : null}

            <GoogleButton label="Daftar dengan Google" />

            <div className="relative text-center text-xs text-slate-400">
              <span className="relative z-10 bg-white px-2">atau email</span>
              <div className="absolute inset-x-0 top-1/2 -z-0 border-t border-slate-100" />
            </div>

            <AuthForm action={signUpAction} submitLabel="Daftar" includeName />
          </div>

          <p className="mt-4 text-xs leading-relaxed text-slate-500">
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
            <Link href="/masuk" className="font-semibold text-lab-teal hover:underline">
              Masuk
            </Link>
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
