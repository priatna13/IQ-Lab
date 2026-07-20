# C1 Accessibility · C2 Analytics · C4 PDF storage

## C1 — Accessibility (soft-launch baseline)

**Status (2026-07-19 / P3):** soft-launch **done** — mobile Lighthouse Accessibility **100** on `/`, `/masuk`, `/hasil` after contrast polish. Full log: `.scratch/post-mvp-followups/P3-A11Y-LOG.md`.

Implemented in app:

- Skip link → `#main-content`
- `lang="id"` on `<html>`
- Landmark `main` + header/footer `nav` labels
- `:focus-visible` outline
- Auth form: `label`/`htmlFor`, `role="alert"` on errors
- Domain runner: `fieldset`/`legend`, radiogroup, timer `aria-live`, status alerts
- Contrast polish: lift-card step teal-deep; “atau email” slate-600; norm badge amber-900

### Lighthouse results (mobile 375×812, 2026-07-19)

| Page | A11y (after fix) | Notes |
|------|------------------|--------|
| `/` | **100** | was 96 (step labels) |
| `/masuk` | **100** | was 96 (divider text) |
| `/hasil` (authed) | **100** | was 96 (norm badge) |

Best-practices **100** on sampled pages. Perf scores from `next dev` are not gate criteria — re-check after production build if needed.

### Manual Lighthouse checklist (operator re-run)

```bash
npm run build && npm run start
# Chrome DevTools → Lighthouse → Accessibility + Best Practices on:
# /  /faq  /masuk  /privasi  /syarat  /dashboard (logged in)  /hasil
```

Target soft-launch: fix any **serious/critical** a11y issues — **met**. Residual non-blocking: decorative lift cards as inert buttons (optional cleanup).

---

## C2 — Analytics events

| Event | When |
|-------|------|
| `signup_succeeded` | Email sign-up OK |
| `sign_in_succeeded` | Email sign-in OK |
| `attempt_started` | Open Attempt created |
| `domain_session_closed` | Early finish or timer close |
| `attempt_completed` | Result Snapshot frozen |
| `pdf_stored` / `pdf_downloaded` | PDF generate/store/download |
| `account_data_deleted` | Account assessment purge |

**No PII** in properties (no email, no answer text).

### Enable PostHog (optional)

```bash
# .env.local
POSTHOG_KEY=phc_...
# or NEXT_PUBLIC_POSTHOG_KEY for dual use
POSTHOG_HOST=https://us.i.posthog.com
```

Or webhook:

```bash
ANALYTICS_WEBHOOK_URL=https://your-collector.example/events
```

Without either, events only log in non-production (`console.info`).

Code: `src/lib/analytics/track.ts`

---

## C4 — PDF storage

- Bucket: **`reports`** (private)
- Path: `{participantId}/{attemptId}.pdf`
- Columns: `result_snapshots.pdf_url`, `pdf_key`
- First `GET /api/asesmen/:id/pdf` generates from snapshot, uploads, persists keys; always streams snapshot-derived bytes (content equivalence)

```bash
npx @insforge/cli storage create-bucket reports --private
npx @insforge/cli db migrations up --all
```
