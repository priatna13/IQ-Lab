/**
 * After P2 e2e: sign in pilot user, hit production dashboard / hasil / PDF.
 *   node .scratch/post-mvp-followups/run-prod-hasil-smoke.mjs
 */
import { createClient } from "@insforge/sdk";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");
const prodApp = "https://iqlab.insforge.site";

function loadEnvLocal() {
  const raw = readFileSync(path.join(root, ".env.local"), "utf8");
  for (const line of raw.split(/\r?\n/)) {
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

async function main() {
  loadEnvLocal();
  const e2e = JSON.parse(
    readFileSync(path.join(__dirname, "p2-e2e-result.json"), "utf8"),
  );
  const baseUrl = process.env.NEXT_PUBLIC_INSFORGE_URL.replace(/\/$/, "");
  const anonKey = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY;
  const client = createClient({ baseUrl, anonKey });

  const { data: session, error } = await client.auth.signInWithPassword({
    email: e2e.email,
    password: e2e.password,
  });
  if (error || !session?.accessToken) {
    throw new Error(`signin failed: ${error?.message}`);
  }

  const accessToken = session.accessToken;
  const refreshToken = session.refreshToken || "";
  const cookie = [
    `insforge_access_token=${accessToken}`,
    refreshToken ? `insforge_refresh_token=${refreshToken}` : "",
  ]
    .filter(Boolean)
    .join("; ");

  const headers = { Cookie: cookie };
  const attemptId = e2e.attemptId;

  const checks = {};
  for (const [name, url] of [
    ["dashboard", `${prodApp}/dashboard`],
    ["hasil", `${prodApp}/asesmen/${attemptId}/hasil`],
    ["pdf", `${prodApp}/api/asesmen/${attemptId}/pdf`],
    ["domainProgress", `${prodApp}/asesmen/${attemptId}`],
  ]) {
    const r = await fetch(url, { headers, redirect: "manual" });
    const loc = r.headers.get("location");
    let bodyHint = "";
    if (name === "hasil" && r.status === 200) {
      const html = await r.text();
      bodyHint = [
        html.includes("Estimasi") || html.includes("estimasi") ? "iq" : null,
        html.includes("insight") || html.includes("Insight") || html.length > 2000
          ? "content"
          : null,
        /disclaimer|bukan|IST|klinis/i.test(html) ? "disclaimer" : null,
      ]
        .filter(Boolean)
        .join(",");
    }
    if (name === "pdf") {
      const ct = r.headers.get("content-type") || "";
      bodyHint = ct;
      if (r.status === 200 && ct.includes("pdf")) {
        const buf = Buffer.from(await r.arrayBuffer());
        bodyHint += `;bytes=${buf.length};%PDF=${buf.slice(0, 4).toString() === "%PDF"}`;
      }
    }
    checks[name] = { status: r.status, location: loc, bodyHint };
    console.log(name, checks[name]);
  }

  // Unauthenticated protected route still redirects
  const unauth = await fetch(`${prodApp}/dashboard`, { redirect: "manual" });
  checks.dashboardUnauth = {
    status: unauth.status,
    location: unauth.headers.get("location"),
  };
  console.log("dashboardUnauth", checks.dashboardUnauth);

  const out = {
    ranAt: new Date().toISOString(),
    prodApp,
    userId: e2e.userId,
    attemptId,
    snapshotId: e2e.snapshotId,
    compositeIndex: e2e.compositeIndex,
    iqEstimate: e2e.iqEstimate,
    checks,
    pass:
      checks.dashboard.status === 200 &&
      checks.hasil.status === 200 &&
      checks.pdf.status === 200 &&
      (checks.pdf.bodyHint || "").includes("%PDF=true"),
  };

  writeFileSync(
    path.join(__dirname, "P5-PROD-SMOKE.json"),
    JSON.stringify(out, null, 2),
    "utf8",
  );
  console.log(out.pass ? "P5 PROD SMOKE PASS" : "P5 PROD SMOKE FAIL");
  if (!out.pass) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
