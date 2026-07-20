# P3 Accessibility / Lighthouse log — 2026-07-19

**Scope:** WORK-RECAP §9 P3  
**Deploy:** not performed  
**Tool:** Lighthouse 13.4.0 · Chrome headless · form-factor **mobile** 375×812

## Checklist

| Item | Status | Evidence |
|------|--------|----------|
| P3.1 Lighthouse mobile `/`, `/masuk`, `/hasil` | **pass** | After contrast fix: **a11y 100** all three |
| P3.2 Keyboard / markup audit | **pass** | skip-link, main landmark, labels, role=alert, runner a11y |
| P3.3 Catat skor + issues | **pass** | this log + `docs/A11Y-AND-ANALYTICS.md` |
| P3.4 BACKLOG C1 | **updated** → **done** (soft-launch) |

## Scores

### Before contrast fix (baseline)

| Page | A11y | Best practices | SEO | Perf (dev) |
|------|------|----------------|-----|------------|
| `/` home | **96** | 100 | 100 | 89* |
| `/masuk` | **96** | 100 | 100 | 88* |
| `/hasil` (auth cookie) | **96** | 100 | — | — |

\*Performance on `next dev` is indicative only — not production build.

**Only weighted a11y fail:** `color-contrast`

| Page | Element | Fix |
|------|---------|-----|
| home | `.lab-lift-card-step` teal `#0d9488` on white | → `#0f766e` (teal-deep) |
| masuk/daftar | “atau email” `text-slate-400` | → `text-slate-600` |
| hasil | norm badge `text-lab-warm` | → `text-amber-900` |

### After fix (v2)

| Page | A11y | Fails |
|------|------|-------|
| `/` | **100** | none |
| `/masuk` | **100** | none |
| `/hasil` | **100** | none |

Reports: `.scratch/post-mvp-followups/lighthouse/` (`home.report.*`, `masuk.report.*`, `hasil.report.*`, `*-v2` post-fix JSON).

## P3.2 Keyboard / structure audit

| Check | Status | Where |
|-------|--------|--------|
| `lang="id"` | OK | `layout.tsx` |
| Skip link → `#main-content` | OK | `layout.tsx` + `PageShell` |
| Landmark `main` + nav labels | OK | header “Navigasi utama”, footer “Tautan footer” |
| `:focus-visible` outline | OK | `globals.css` (2px lab-focus) |
| Auth labels + `htmlFor` | OK | `auth-form.tsx` |
| Auth error `role="alert"` | OK | auth-form, daftar OAuth, age-band, start-attempt |
| Touch targets ≥44px | OK | LH `target-size` pass; `min-h-11` pattern |
| Domain runner fieldset/legend/radiogroup | OK | `domain-runner.tsx` |
| Timer `aria-live` | OK | domain runner |
| Reduced motion | OK | `globals.css` + dock/fx overrides |

### Non-blocking residual (not LH fails)

| ID | Note | Priority |
|----|------|----------|
| P0-N1 | Landing lift cards are inert `<button type="button">` | low — prefer `div` later |
| P0-N2 | Dock item min-width 40px (height 44px OK; LH target-size still passed) | low |

## Code changes (this session)

- `src/app/globals.css` — lift card step color → teal-deep  
- `src/app/masuk/page.tsx`, `src/app/daftar/page.tsx` — divider text slate-600  
- `src/components/assessment/result-report.tsx` — badge amber-900  

## Soft-launch C1 conclusion

**No serious/critical a11y blockers.** Mobile Lighthouse Accessibility **100** on landing, auth, and results after contrast polish. Baseline code patterns (skip link, focus, labels, alerts, runner) remain in place.

Optional later: production-build Lighthouse for performance; decorative button markup cleanup.
