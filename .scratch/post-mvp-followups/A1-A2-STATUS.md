# Operator status A1 / A2 — 2026-07-18

## Commit

- Track A pack: `2c3e275` — soft-launch ops + readiness API

## CLI / project

| Item | Value |
|------|--------|
| CLI auth | OK (`whoami`) |
| Project | **iq-lab** (`6a6g33ic`, ap-southeast) |
| Backend health | diagnose OK (CPU/mem normal) |

## Env wiring (`.env.local`) — presence only

| Key | Status |
|-----|--------|
| `NEXT_PUBLIC_INSFORGE_URL` | set → `https://6a6g33ic.ap-southeast.insforge.app` |
| `INSFORGE_URL` | set (match public) |
| `NEXT_PUBLIC_INSFORGE_ANON_KEY` | set |
| `INSFORGE_API_KEY` | set |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` |
| `OPENROUTER_API_KEY` | **set** via `npx @insforge/cli ai setup` |
| `OPENROUTER_CHAT_MODEL` | **set** `openai/gpt-4o-mini` |

## A2 — OpenRouter

- [x] Key provisioned ke `.env.local` (server-only; jangan `NEXT_PUBLIC_*`)
- [x] Model default ADR 0016
- [x] Restart `npm run dev` (port **3000**) + `GET /api/ops/readiness` → `openRouterConfigured: true`, model `openai/gpt-4o-mini`
- [ ] Complete 1 Attempt test → insight mode LLM (atau fallback jika API gagal)
- [ ] Production: tambah `OPENROUTER_API_KEY` di host secrets

## A1 — Google OAuth

Metadata backend (`npx @insforge/cli metadata`):

```json
"oAuthProviders": ["github", "google"]
```

- SMTP: disabled  
- `requireEmailVerification`: false  
- Redirect allowlist: localhost:3000 + 127.0.0.1:3000 (callback, masuk, daftar, dashboard)

Probe: `GET https://6a6g33ic.ap-southeast.insforge.app/api/auth/oauth/google` → **400** (endpoint hidup; butuh flow OAuth penuh).

### Langkah uji browser (Anda)

1. `npm run dev` (restart setelah `ai setup`)
2. Buka `http://localhost:3000/masuk` → **Lanjut dengan Google**
3. Jika sukses → session + redirect dashboard/onboarding  
4. Jika gagal → baca `?error=` di URL; cek Google Cloud Client ID/Secret di **InsForge Dashboard → Auth → Methods**

CLI **tidak** menampilkan Client ID Google; konfigurasi credentials tetap di dashboard.

## Secrets list (nama saja)

Project secrets reserved: `API_KEY`, `ANON_KEY`, JWT_*, `INSFORGE_BASE_URL`, `VERCEL_WEBHOOK_SECRET`.  
Tidak ada secret bernama `OPENROUTER_*` di project secrets list (key OpenRouter ada di local env dari AI gateway setup).
