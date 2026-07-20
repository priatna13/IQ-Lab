import { createAdminClient } from "@insforge/sdk";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const envPath = path.join(root, ".env.local");
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
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

const baseUrl = (
  process.env.INSFORGE_URL ||
  process.env.NEXT_PUBLIC_INSFORGE_URL ||
  ""
).replace(/\/$/, "");
const apiKey = process.env.INSFORGE_API_KEY || "";
const c = createAdminClient({ baseUrl, apiKey });
const a = await c.database.from("attempts").select("id,status").limit(5);
console.log("attempts", a.error?.message || `ok ${a.data?.length ?? 0}`);
const s = await c.database
  .from("result_snapshots")
  .select("attempt_id,composite_index")
  .limit(3);
console.log("snaps", s.error?.message || `ok ${s.data?.length ?? 0}`);
const u = await c.database.rpc("admin_user_directory");
if (u.error) {
  console.log("users RPC", u.error.message);
} else {
  const rows = u.data ?? [];
  console.log("users RPC ok", rows.length);
  console.log(
    "sample",
    rows.slice(0, 3).map((r) => ({
      email: r.email,
      name: r.display_name,
    })),
  );
}
