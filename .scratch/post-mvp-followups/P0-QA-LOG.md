# P0 Visual QA + smoke log — 2026-07-19

**Scope:** WORK-RECAP §9 P0  
**Deploy:** not performed (no approve)

## Results

| Item | Status | Evidence |
|------|--------|----------|
| P0.1 Mobile overflow (code + HTML) | **pass (static)** | `overflow-x: clip` / `overflow-x-clip` on html, body, `PageShell`; public routes `/`, `/masuk`, `/daftar`, `/faq` return 200 with clip markers. **Manual DevTools 375/390 still recommended for eyeball.** |
| P0.2 Auth + attempt smoke | **pass (API + cookie)** | Signup → signin → age_band → dashboard → mulai → open attempt → domain runner `verbal_pemahaman` 200 with choices/timer UI. |
| P0.3 Animations present | **pass (markup/CSS)** | `lab-wordmark` / wave keyframes, `lab-dock`, `fx-59`, `fx-9` + `lab-lift-card`; reduced-motion overrides in `globals.css`. |
| P0.4 Tests + types | **pass** | Vitest **55/55**; `tsc --noEmit` exit 0. |
| P0.5 Bug list | see below | Non-blocking only |

## Readiness (`GET /api/ops/readiness`)

- `ok: true`
- `publishedContentVersion: cv_mvp_v2`
- `openRouterConfigured: true` (`openai/gpt-4o-mini`)
- `analyticsConfigured: false` (optional)

## Public route smoke

| Route | Status |
|-------|--------|
| `/` | 200 |
| `/masuk` | 200 |
| `/daftar` | 200 |
| `/faq` | 200 |
| `/privasi` | 200 |
| `/syarat` | 200 |
| `/dashboard` (anon) | 307 → `/masuk?next=/dashboard` |
| `/api/ops/readiness` | 200 |

## Auth / assessment smoke (local backend)

1. `POST /api/auth/users` + `POST /api/auth/sessions` (InsForge) — OK  
2. Cookie `insforge_access_token` on app — `/onboarding/usia` 200  
3. `PATCH /api/auth/profiles/current` `{ profile: { age_band: "18_45" } }` — OK  
4. `/dashboard`, `/asesmen/mulai` — 200  
5. Attempt row `cv_mvp_v2` + track `explore` — OK  
6. `/asesmen/{id}` — 200, link domain `verbal_pemahaman`  
7. Domain page auto-starts session — runner 200 (`lab-choice`, soal, Early/grace)

## Non-blocking findings (P0.5)

| ID | Severity | Note | Action |
|----|----------|------|--------|
| P0-N1 | low | Lift cards on landing are `<button type="button">` without action (decorative). Prefer `<div>` / article for a11y. | Optional fix P3/P7 |
| P0-N2 | low | `.lab-dock-item` `min-width: 2.5rem` (40px) &lt; 44px target; `min-height` already 2.75rem. | Optional C1 polish |
| P0-N3 | info | Full pixel QA at 375×812 / 390×844 still needs human DevTools (no headed browser in agent session). | Operator 2 min |
| P0-N4 | info | Analytics not configured — expected soft-launch optional. | A/C2 optional |

**No P0 blockers** for soft-launch local readiness.

## Next (WORK-RECAP §9)

- **P1** Google OAuth browser E2E  
- **P2** Complete 1 full attempt → insight LLM check (key already local)  
- **Deploy** still gated on explicit approve
