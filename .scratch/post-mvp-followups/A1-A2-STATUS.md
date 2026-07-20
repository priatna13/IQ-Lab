# Operator status A1 / A2 — updated 2026-07-20

## Commit

- Track A pack: `2c3e275` — soft-launch ops + readiness API
- Production: `https://iqlab.insforge.site` (InsForge Deployments)

## CLI / project

| Item | Value |
|------|--------|
| Project | **iq-lab** (`6a6g33ic`, ap-southeast) |
| Frontend canonical | `https://iqlab.insforge.site` |
| Backend | `https://6a6g33ic.ap-southeast.insforge.app` |

## Env wiring (`.env.local`) — presence only

| Key | Status |
|-----|--------|
| `NEXT_PUBLIC_INSFORGE_URL` | set → backend |
| `INSFORGE_URL` | set (match public) |
| `NEXT_PUBLIC_INSFORGE_ANON_KEY` | set |
| `INSFORGE_API_KEY` | set |
| `NEXT_PUBLIC_APP_URL` | local and/or prod host |
| `OPENROUTER_API_KEY` | **set** |
| `OPENROUTER_CHAT_MODEL` | **set** `openai/gpt-4o-mini` |

## A2 — OpenRouter (**done**)

- [x] Key provisioned (server-only)
- [x] Model default ADR 0016 (`openai/gpt-4o-mini`)
- [x] Local readiness `openRouterConfigured: true`
- [x] Production readiness `openRouterConfigured: true` (2026-07-20)
- [x] Complete Attempt → LLM prose on production `/hasil` **200** + PDF **200**

Log: [`P2-INSIGHT-LOG.md`](./P2-INSIGHT-LOG.md), [`P5-PROD-SMOKE-LOG.md`](./P5-PROD-SMOKE-LOG.md)

## A1 — Google OAuth (**done** soft-launch)

| Check | Result |
|-------|--------|
| Provider listed | `google` (+ github) |
| PKCE start → authUrl | **200** for localhost + both prod hosts |
| Google hosted flow | responds (302 chain, no invalid_client / redirect mismatch observed) |
| Allowlist | localhost + `iqlab.insforge.site` + `6a6g33ic.insforge.site` |
| App CTAs production | `/masuk`, `/daftar` Google buttons present |
| Callback errors | 307 → `/masuk?error=…` |
| Interactive Google consent | not automatable; optional human sanity |

Full log: [`P1-OAUTH-LOG.md`](./P1-OAUTH-LOG.md)

### Optional human sanity (non-blocking)

1. Open `https://iqlab.insforge.site/masuk` → **Lanjut dengan Google**
2. Expect → onboarding or dashboard

Email path is fully verified E2E for soft-launch (P5/P6).

## Secrets list (nama saja)

Project secrets reserved: `API_KEY`, `ANON_KEY`, JWT_*, `INSFORGE_BASE_URL`, `VERCEL_WEBHOOK_SECRET`.  
OpenRouter key lives in deployment env / local `.env.local` (never commit).
