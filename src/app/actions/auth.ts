"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import {
  createInsForgeAuthActions,
  createInsForgeServerClient,
} from "@/lib/insforge/server";
import {
  AGE_BAND_PROFILE_KEY,
  evaluateAgeBand,
  type AgeBandChoice,
} from "@/domain/participant/age-band";

function appOrigin(): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    "http://localhost:3000"
  );
}

export type AuthActionResult = {
  ok: boolean;
  error?: string;
  needAgeBand?: boolean;
};

export async function signUpAction(
  _prev: AuthActionResult | null,
  formData: FormData,
): Promise<AuthActionResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const name = String(formData.get("name") ?? "").trim();

  if (!email || !password) {
    return { ok: false, error: "Email dan kata sandi wajib diisi." };
  }

  const auth = await createInsForgeAuthActions();
  const { data, error } = await auth.signUp({
    email,
    password,
    name: name || undefined,
  });

  if (error) {
    return {
      ok: false,
      error: error.message ?? "Gagal mendaftar. Coba lagi.",
    };
  }

  if (data && "requireEmailVerification" in data && data.requireEmailVerification) {
    return {
      ok: false,
      error:
        "Email perlu diverifikasi. Cek kotak masuk Anda, lalu masuk setelah verifikasi.",
    };
  }

  redirect("/onboarding/usia");
}

export async function signInAction(
  _prev: AuthActionResult | null,
  formData: FormData,
): Promise<AuthActionResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { ok: false, error: "Email dan kata sandi wajib diisi." };
  }

  const auth = await createInsForgeAuthActions();
  const { data, error } = await auth.signInWithPassword({ email, password });

  if (error || !data?.user) {
    return {
      ok: false,
      error: error?.message ?? "Email atau kata sandi salah.",
    };
  }

  const client = await createInsForgeServerClient();
  const { data: profileData } = await client.auth.getProfile(data.user.id);
  const ageBand = profileData
    ? (profileData as Record<string, unknown>)[AGE_BAND_PROFILE_KEY]
    : null;

  if (!ageBand) {
    redirect("/onboarding/usia");
  }

  redirect("/dashboard");
}

export async function signOutAction(): Promise<void> {
  const auth = await createInsForgeAuthActions();
  await auth.signOut();
  redirect("/");
}

export async function signInWithGoogleAction(): Promise<void> {
  const cookieStore = await cookies();
  const auth = await createInsForgeAuthActions();
  const { data, error } = await auth.signInWithOAuth("google", {
    redirectTo: `${appOrigin()}/api/auth/callback`,
    skipBrowserRedirect: true,
    additionalParams: { prompt: "select_account" },
  });

  if (error || !data?.url || !data.codeVerifier) {
    redirect(
      `/masuk?error=${encodeURIComponent(error?.message ?? "OAuth Google gagal. Pastikan Google diaktifkan di dashboard InsForge.")}`,
    );
  }

  cookieStore.set("insforge_code_verifier", data.codeVerifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });

  redirect(data.url);
}

export async function saveAgeBandAction(
  _prev: AuthActionResult | null,
  formData: FormData,
): Promise<AuthActionResult> {
  const raw = String(formData.get("age_band") ?? "") as AgeBandChoice;
  const acceptedDisclaimer = formData.get("accept_46_disclaimer") === "on";

  if (raw !== "under_18" && raw !== "18_45" && raw !== "46_plus") {
    return { ok: false, error: "Pilih rentang usia." };
  }

  const gate = evaluateAgeBand(raw);

  if (gate.status === "blocked") {
    return {
      ok: false,
      error:
        "IQ-Lab MVP hanya untuk usia 18 tahun ke atas. Terima kasih atas minat Anda.",
    };
  }

  if (gate.status === "allowed_with_disclaimer" && !acceptedDisclaimer) {
    return {
      ok: false,
      error:
        "Untuk usia 46+, Anda perlu menyetujui disclaimer norma & saran karir.",
    };
  }

  const client = await createInsForgeServerClient();
  const { data: userData, error: userError } =
    await client.auth.getCurrentUser();

  if (userError || !userData?.user) {
    return { ok: false, error: "Sesi tidak valid. Silakan masuk lagi." };
  }

  const { error } = await client.auth.setProfile({
    [AGE_BAND_PROFILE_KEY]: gate.ageBand,
  });

  if (error) {
    return {
      ok: false,
      error: error.message ?? "Gagal menyimpan rentang usia.",
    };
  }

  redirect("/dashboard");
}
