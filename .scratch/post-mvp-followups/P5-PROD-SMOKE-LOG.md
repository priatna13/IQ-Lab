# P5 production smoke — 2026-07-20

**Canonical app:** `https://iqlab.insforge.site`  
**Backend:** `https://6a6g33ic.ap-southeast.insforge.app`  
**Verdict:** **PASS**

## Public routes

| Route | Status |
|-------|--------|
| `/` | 200 |
| `/masuk` | 200 |
| `/daftar` | 200 |
| `/faq` | 200 |
| `/privasi` | 200 |
| `/syarat` | 200 |
| `/dashboard` (no session) | 307 → `/masuk?next=/dashboard` |

## Readiness

`GET /api/ops/readiness` → **200** `ok: true`

| Check | Value |
|-------|--------|
| Content version | `cv_mvp_v2` |
| OpenRouter | configured (`openai/gpt-4o-mini`) |
| PDF bucket | `reports` |
| App URL / keys | configured |

## Authenticated flow (email)

1. Sign up new user via InsForge SDK → age band `18_45` → session cookies  
2. `GET /dashboard` with `insforge_access_token` → **200**  
3. `GET /asesmen/mulai` → **200**  
4. Full **9 domain** complete (live e2e, same backend) → Result Snapshot  
5. Production web report + PDF:

| Check | Result |
|-------|--------|
| `/asesmen/{id}/hasil` | **200** (IQ + content + disclaimer markers) |
| `/api/asesmen/{id}/pdf` | **200** `application/pdf` (~3.6 KB, `%PDF` magic) |
| Completed attempt root | 307 → `/hasil` |

Artifact (no secrets): `P5-PROD-SMOKE.json`

## Residual

- Interactive Google account picker still requires a real human Google login (see A1 / P1).  
- Email path is the verified soft-launch E2E auth path on production.
