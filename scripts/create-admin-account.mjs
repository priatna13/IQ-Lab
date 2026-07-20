/**
 * Create admin user (email/password) on InsForge auth.
 * Loads .env.local — does not print full secrets.
 *
 *   node scripts/create-admin-account.mjs
 */
import { createClient } from "@insforge/sdk";
import { readFileSync, appendFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

function loadEnv() {
  const p = path.join(root, ".env.local");
  if (!existsSync(p)) throw new Error("Missing .env.local");
  for (const line of readFileSync(p, "utf8").split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 0) continue;
    const k = t.slice(0, i).trim();
    let v = t.slice(i + 1).trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    if (!(k in process.env)) process.env[k] = v;
  }
}

const ADMIN_EMAIL = process.env.ADMIN_BOOTSTRAP_EMAIL || "admin@iqlab.app";
const ADMIN_PASSWORD =
  process.env.ADMIN_BOOTSTRAP_PASSWORD || "IQLab-Admin-2026!";
const ADMIN_NAME = "Admin IQ-Lab";

async function main() {
  loadEnv();
  const baseUrl = (process.env.NEXT_PUBLIC_INSFORGE_URL || "").replace(
    /\/$/,
    "",
  );
  const anonKey = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY || "";
  if (!baseUrl || !anonKey) throw new Error("Missing InsForge public env");

  const client = createClient({ baseUrl, anonKey });
  const { data: signed, error: signErr } = await client.auth.signUp({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    name: ADMIN_NAME,
  });

  if (signErr) {
    // Maybe already exists — try sign-in
    const { data: session, error: se } = await client.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });
    if (se) {
      console.error("signUp failed:", signErr.message);
      console.error("signIn failed:", se.message);
      console.error(
        "If user exists with another password, reset via InsForge dashboard or set ADMIN_BOOTSTRAP_PASSWORD.",
      );
      process.exit(1);
    }
    console.log("Admin already exists; sign-in OK.");
    console.log("userId:", session?.user?.id ?? "(session)");
  } else {
    const userId =
      signed && "user" in signed && signed.user
        ? signed.user.id
        : "(created)";
    console.log("Admin created:", userId);
  }

  // Ensure ADMIN_EMAILS in .env.local
  const envPath = path.join(root, ".env.local");
  const envRaw = readFileSync(envPath, "utf8");
  if (!/^ADMIN_EMAILS=/m.test(envRaw)) {
    appendFileSync(
      envPath,
      `\n# Admin portal allowlist\nADMIN_EMAILS=${ADMIN_EMAIL}\n`,
      "utf8",
    );
    console.log("Appended ADMIN_EMAILS to .env.local");
  } else if (!envRaw.toLowerCase().includes(ADMIN_EMAIL.toLowerCase())) {
    console.log(
      `Add ${ADMIN_EMAIL} to ADMIN_EMAILS in .env.local and deployment env.`,
    );
  }

  console.log("\n=== Admin credentials (store securely) ===");
  console.log("Email   :", ADMIN_EMAIL);
  console.log("Password:", ADMIN_PASSWORD);
  console.log("Portal  : /admin (after login)");
  console.log(
    "\nSet production:\n  npx @insforge/cli deployments env set ADMIN_EMAILS",
    ADMIN_EMAIL,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
