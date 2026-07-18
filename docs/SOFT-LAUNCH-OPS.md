# Soft-launch ops checklist (Track A)

**Tujuan:** menghidupkan config yang sudah di-support kode, tanpa fitur post-MVP baru.  
**Backlog:** [`.scratch/post-mvp-followups/BACKLOG.md`](../.scratch/post-mvp-followups/BACKLOG.md)  
**Readiness API:** `GET /api/ops/readiness` (tanpa secret; cek flag env saja)

---

## A1 — Google OAuth live

### Prasyarat kode (sudah ada)

- Tombol Google: `/masuk`, `/daftar` → `signInWithGoogleAction`
- Callback: `/api/auth/callback`
- Redirect allowlist: `insforge.toml` → `[auth].allowed_redirect_urls`

### Langkah operator

1. Buka **InsForge Dashboard → Auth → Methods / OAuth**.
2. Aktifkan **Google**.
3. Isi **Client ID** + **Client Secret** dari [Google Cloud Console](https://console.cloud.google.com/) (OAuth 2.0 Client, type Web).
4. Authorized redirect URI di Google Console harus mengarah ke callback InsForge (lihat URL yang ditampilkan dashboard InsForge untuk provider Google — biasanya host InsForge, bukan Next app).
5. Pastikan app redirect setelah OAuth ada di `allowed_redirect_urls`, minimal:
   - `https://<domain-app>/api/auth/callback`
   - `http://localhost:3000/api/auth/callback` (dev)
6. Terapkan config bila perlu: `npx @insforge/cli config plan` / `apply` (setelah edit `insforge.toml`).
7. Uji: `/daftar` → **Daftar dengan Google** → kembali ke app dengan session.

### Gagal?

- Error di UI `/masuk?error=...` biasanya: provider belum aktif, redirect URL mismatch, atau code verifier hilang.
- Fallback: email/password tetap jalan.

**Status kode:** ready  
**Status ops:** checklist operator (tidak bisa diselesaikan tanpa credentials Google di dashboard)

---

## A2 — LLM Insight (OpenRouter)

### Prasyarat kode (sudah ada)

- `OPENROUTER_API_KEY` → hybrid narrator memakai LLM
- Tanpa key → **template fallback** (Report tetap usable)
- Default model: `openai/gpt-4o-mini` (ADR 0016)

### Langkah operator

1. Buat key di [OpenRouter](https://openrouter.ai/).
2. Di `.env.local` (atau secret host production):

   ```bash
   OPENROUTER_API_KEY=sk-or-...
   OPENROUTER_CHAT_MODEL=openai/gpt-4o-mini
   ```

3. Restart server (`npm run dev` / redeploy).
4. Selesaikan 1 Attempt test → cek Result Snapshot: insight `source` LLM (bila field ter-expose) atau prose non-template.
5. Verifikasi flag: `GET /api/ops/readiness` → `openRouterConfigured: true`.

### Keputusan produk

| Field | Nilai soft-launch |
|-------|-------------------|
| Model default | `openai/gpt-4o-mini` |
| Fallback | Template dari Rule Payload (wajib tetap hidup) |
| Temperature | 0.4 (kode) |

**Status:** ready di kode; butuh key di env production.

---

## A3 — Email verification / SMTP

### Keadaan sekarang (`insforge.toml`)

```toml
require_email_verification = false
[auth.smtp]
enabled = false
```

Sengaja untuk MVP lokal tanpa SMTP.

### Sebelum production (rekomendasi)

1. Siapkan SMTP (provider email transactional) **atau** pakai jalur email platform InsForge bila tersedia di plan.
2. Isi `[auth.smtp]` (host, port, username, password via secret dashboard, sender).
3. Set `require_email_verification = true` jika product mengharuskan verifikasi sebelum asesmen.
4. `npx @insforge/cli config plan` → review → `apply`.
5. Uji: daftar email baru → terima kode/link → baru bisa full flow.

**Keputusan terbuka:** apakah soft-launch internal **wajib** verifikasi email? Default saran: **tidak** untuk cohort internal; **ya** untuk public launch.

---

## A4 — Hosting front final

| Opsi | Kapan |
|------|--------|
| **Vercel** (Next.js native) | Default praktis; set env `NEXT_PUBLIC_*` + server secrets |
| **InsForge Deployments** | Jika ingin satu platform dengan backend |

### Checklist deploy (Vercel-style)

1. Connect repo → build `npm run build`, output Next default.
2. Env production:
   - `NEXT_PUBLIC_INSFORGE_URL`
   - `NEXT_PUBLIC_INSFORGE_ANON_KEY`
   - `NEXT_PUBLIC_APP_URL=https://<domain>`
   - `INSFORGE_URL` / `INSFORGE_API_KEY`
   - `OPENROUTER_API_KEY` (opsional)
3. Tambah production URLs ke `insforge.toml` `allowed_redirect_urls` + Google Console.
4. Smoke: `/`, `/faq`, `/masuk`, OAuth, 1 domain runner.

**Keputusan:** belum di-hardcode di repo — pilih host saat first deploy.

---

## A5 — Purge `auth.users` penuh

### Perilaku saat ini

Account Deletion di app:

1. Hapus data asesmen teridentifikasi (Attempt, Response, Domain Session, Snapshot, Integrity).
2. **Norm Sample tetap** (ADR 0015).
3. `signOut` session.

### Belum

Hapus row identitas di `auth.users` platform InsForge (bergantung admin API / dashboard).

### Langkah lanjutan

1. Cek docs/SDK InsForge untuk `delete user` / admin user delete.
2. Jika ada: panggil dari server action deletion dengan `createAdminClient` + audit log.
3. Jika tidak: dokumentasikan “hapus data produk + sign-out; hapus akun platform via support/dashboard”.

**Status soft-launch:** acceptable — data asesmen sudah hilang; identitas login mungkin masih di auth store sampai purge platform.

---

## Urutan eksekusi operator (1 jam)

1. [ ] A2 set `OPENROUTER_API_KEY` (opsional tapi recommended)  
2. [ ] A1 aktifkan Google di InsForge + uji  
3. [ ] A4 pilih host + set `NEXT_PUBLIC_APP_URL` production  
4. [ ] Update `allowed_redirect_urls` production  
5. [ ] `GET /api/ops/readiness` hijau  
6. [ ] Smoke 1 user email: daftar → Age Band → Track → 1 Domain  
7. [ ] A3 tunda kecuali public launch  

---

## Verifikasi cepat

```bash
npm test
npm run typecheck
npm run dev
# browser: http://localhost:3000/api/ops/readiness
```
