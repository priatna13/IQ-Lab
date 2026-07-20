# IQ-Lab — Rekap pekerjaan selesai

**Tanggal rekap:** 2026-07-20  
**Branch:** `main`  
**Scope:** MVP fungsional + soft-launch tracks + visual system (DESIGN.md) + soft-launch closeout  
**Plan aktif:** §9 — **P0–P7 soft-launch internal closeout selesai** (2026-07-20)

Dokumen ini merangkum apa yang **sudah selesai** di repo. Sumber: commit history, `docs/DESIGN.md`, backlog post-MVP, soft-launch ops, closeout logs.

---

## 1. Ringkasan status

| Area | Status |
|------|--------|
| Domain Assessment (FR asesmen, attempt, skor, insight, PDF) | **Selesai** (MVP) |
| Item Bank Content Version **v2** (published) | **Selesai** |
| Soft-launch Track A (ops pack + readiness) | **Selesai** |
| Track B1 technical pilot + B2 microcopy | **Selesai** (multi-human qualitative = post soft-launch) |
| Track C1 a11y, C2 analytics, C3 legal, C4 PDF storage | **Selesai** |
| DESIGN.md R1 + depth + brand logo + animasi + mobile | **Selesai** |
| P0 Visual QA + smoke (WORK-RECAP §9) | **Selesai** 2026-07-19 — `P0-QA-LOG.md` |
| P1 Google OAuth | **Selesai** 2026-07-20 — path to Google consent local+prod; `P1-OAUTH-LOG.md` |
| P2 OpenRouter insight | **Selesai** 2026-07-19/20 — `P2-INSIGHT-LOG.md` |
| P3 A11y / Lighthouse | **Selesai** 2026-07-19 — mobile a11y 100; `P3-A11Y-LOG.md` |
| P4 Hosting | **Selesai** — InsForge Deployments |
| P5 Deploy + production smoke | **Selesai** 2026-07-20 — `P5-PROD-SMOKE-LOG.md` |
| P6 Technical pilot 9 domain | **Selesai** 2026-07-20 — `PILOT-LOG.md` putaran 2 |
| Deploy production | **Live** — `https://iqlab.insforge.site` |

---

## 2. MVP fungsional (Assessment boundary)

Sudah diimplementasikan sebelumnya dan tetap jadi fondasi produk:

- Auth (email + Google OAuth), onboarding rentang usia, account deletion
- Attempt lifecycle: single open attempt, track immutable, content version pin
- Domain Session: timer, grace, responses, early finish, integrity events
- Multi-domain sequence, pause/resume, abandon
- Complete attempt → **Result Snapshot** immutable (profil 9 domain, indeks, estimasi IQ)
- Hybrid career insight (rule payload + template/LLM)
- Primary + retake cooldown 90 hari + Norm Sample (primary completed only)
- Laporan web hasil + unduh **PDF**
- FAQ metodologi, footer, disclaimers “bukan IST / bukan rekrutmen / bukan klinis”

---

## 3. Soft-launch & post-MVP tracks

| Track | Isi | Status |
|-------|-----|--------|
| **A** | Soft-launch ops pack, readiness API (`/api/ops/readiness`), checklist operator | Selesai |
| **A1/A2** | Cek CLI/operator (Google OAuth browser manual tetap operator) | Tercatat |
| **B1** | Internal pilot pack | Selesai |
| **B2** | Domain microcopy (label, blurb, instruction) | Selesai |
| **C1** | A11y baseline (skip link, focus-visible, touch targets, reduced motion) | Selesai |
| **C2** | Product analytics tanpa PII | Selesai |
| **C3** | `/privasi` + `/syarat` | Selesai |
| **C4** | PDF report storage (bucket private + migration snapshot) | Selesai |

---

## 4. Visual system & UI (DESIGN.md)

### 4.1 Design context

- `docs/DESIGN.md` — source of truth visual (grill locked, light-first, Plus Jakarta, soft neon, calm motion)
- Governance: **tidak deploy** tanpa approve; visual mengikuti DESIGN.md

### 4.2 Implementasi visual R1 + depth

| Item | Detail |
|------|--------|
| Tokens | Tailwind `lab.*`, CSS variables, soft shadow/glow, Plus Jakarta Sans |
| Primitives | `PageShell`, `BrandLogo`, `MeshOrbs`, utility `.lab-card` / `.lab-btn-*` / `.lab-input` / `.lab-choice` |
| Surfaces | Landing, auth (masuk/daftar), dashboard, hasil, FAQ, legal shell |
| Runner chrome | Progress domain + calm domain runner (touch targets, progress bar) |
| Mulai / onboarding | Skin token konsisten |

### 4.3 Brand logo

| Item | Detail |
|------|--------|
| Aset | `logo.jpg` → `public/brand/logo.png` (background transparan) |
| Penggunaan | Header, footer, auth, hero panel, favicon |
| Chrome | Tanpa kotak putih/shadow di mark; logo saja, diperbesar |

### 4.4 Animasi & interaksi (pure CSS)

| Elemen | Efek | Catatan |
|--------|------|---------|
| Wordmark **IQ-Lab** | Wave per huruf ~1.5s, lift + tint teal, delay −0.09s | Reduced motion off |
| Nav **FAQ / Masuk / Daftar** (+ Dasbor/Keluar) | Contextual dock `:has()` — rise/scale + tetangga | Hover fine-pointer; mobile `:active` |
| **Mulai gratis** / **Sudah punya akun** | Brutalist `btn fx-59` hard-shadow press | JetBrains Mono; token recolour |
| 6 kartu landing (9 domain, dua jalur, gratis MVP, 3 alur) | Lift `btn fx-9` `translateY(-4px)` + soft shadow | Multi-line card layout |

### 4.5 Mobile-first consistency

| Item | Detail |
|------|--------|
| Overflow | `overflow-x: clip` html/body/shell |
| Touch | Target ≥ 44px; CTA full-width di mobile |
| Grid | 1 kolom base → multi-kolom dari `md` |
| Dock / wave / lift | Scale lift lebih kecil di HP; hover sticky dihindari (`hover: hover`) |
| iOS | `background-attachment: scroll` di mobile; input `text-base` anti-zoom |
| Header | Compact, wordmark sembunyi &lt;380px, dock tidak overflow |

### 4.6 Bugfix terkait UI

| Commit (singkat) | Isi |
|------------------|-----|
| `7d77c49` | Perbaiki `@apply` PostCSS (`rounded-2.5xl`, `to-lab-teal-deep`) → hilangkan 500 Internal Server Error |
| Mobile polish | Dock, CTA, lift cards, shell |

---

## 5. Commit history (jalur visual terbaru)

Urutan mendekati head `main` (rekap UI):

1. `8eff69e` — feat(ui): light-first futuristic visual system R1  
2. `7d77c49` — fix(ui): unbreak globals.css @apply  
3. `fdc6d1a` — feat(ui): full DESIGN.md pass + brand logo + shell  
4. `4e61a7f` — fix(ui): transparent brand mark, larger logo  
5. `675f913` — fix(ui): mobile-first consistency shell/surfaces  
6. `77f71c1` — feat(ui): wave animation wordmark IQ-Lab  
7. `5dc8c12` — feat(ui): contextual dock FAQ/Masuk/Daftar  
8. `60bee99` — feat(ui): brutalist fx-59 Mulai gratis / Sudah punya akun  
9. `66a9c8c` — feat(ui): Lift fx-9 kartu fitur & alur  
10. `da87064` — fix(ui): mobile polish dock, lift, brutalist CTAs  
11. `aaddd13` — docs: WORK-RECAP.md  
12. *(plan besok di rekap ini)*  

---

## 6. Yang sengaja belum / gate terpisah

- Multi-human qualitative pilot B1 (3–8 orang) sebelum **public** launch  
- A3 email verification / SMTP (sengaja off soft-launch internal)  
- A5 purge `auth.users` platform  
- B3 timer/grace final decision; B4 figural/memori multi-fase; B5 re-norm empiris  
- Radar chart, dark mode, particle — out of scope DESIGN.md  
- Domain runner “deep restyle” ekspresif (chrome calm sudah; bukan overhaul item UI)  
- Optional: 1× human Google login personal sanity di production

---

## 7. Cara verifikasi lokal

```bash
npm run dev -- -p 3000
```

| Route | Cek |
|-------|-----|
| `/` | Logo, wave wordmark, dock, CTA brutalist, 6 kartu lift |
| `/masuk`, `/daftar` | Auth calm + logo |
| `/dashboard` | State attempt (auth required) |
| `/faq`, `/privasi`, `/syarat` | Legal/FAQ token skin |
| DevTools 375×812 | Tidak horizontal scroll; CTA full-width |

Tests (domain): `npm test` — target ~55 pass (terakhir dicatat lulus di sesi visual).

---

## 8. File kunci

| Path | Peran |
|------|--------|
| `docs/DESIGN.md` | Spec visual |
| `docs/WORK-RECAP.md` | Rekap ini |
| `docs/MVP-COMPLETION-REPORT.md` | MVP fungsional |
| `docs/SOFT-LAUNCH-OPS.md` | Ops A |
| `public/brand/logo.png` | Brand mark |
| `src/components/ui/page-shell.tsx` | Chrome halaman |
| `src/components/ui/brand-logo.tsx` | Logo + wave wordmark |
| `src/app/globals.css` | Tokens, dock, btn fx-59/fx-9, mobile |
| `src/components/site-header.tsx` | Dock nav |
| `src/app/page.tsx` | Landing |

---

## 9. Plan kerja besok

**Tujuan sesi:** bawa IQ-Lab dari “siap di lokal + UI lengkap” ke **siap soft-launch internal** (bisa dipakai pilot), tanpa fitur Fase 4+.

**Prinsip:**  
1. Ops & QA dulu, fitur baru belakangan.  
2. **Deploy hanya setelah** kamu bilang **approve deploy + host**.  
3. Visual R2 runner ekspresif **tidak** default — hanya jika ada bug/UX blocker.

### 9.1 Urutan prioritas (disarankan)

```
P0  Visual QA mobile + smoke full flow (lokal)
P1  A1 Google OAuth — uji browser end-to-end
P2  A2 OpenRouter — pastikan insight LLM (atau template) di env yang dipakai
P3  C1 Lighthouse / a11y checklist operator (landing, auth, hasil)
P4  Keputusan A4 host (Vercel vs opsi lain) + siapkan env production
P5  Approve deploy (gate eksplisit) → deploy + readiness production
P6  B1 pilot manusia singkat (1–2 orang) + catat di PILOT-LOG
P7  Bugfix dari pilot / Lighthouse (hanya yang blocking)
```

### 9.2 Checklist detail

#### P0 — Visual QA + smoke (code + browser) · ~45–90 mnt ✅ 2026-07-19

| # | Tugas | Done? |
|---|--------|-------|
| P0.1 | DevTools **375×812** + **390×844**: landing, masuk, daftar, FAQ — no horizontal scroll | [x] static pass (`overflow-x-clip`); eyeball DevTools optional |
| P0.2 | Smoke auth email: daftar → usia → dasbor → mulai attempt (1 domain cukup) | [x] InsForge signup/session + cookie app flow → domain runner |
| P0.3 | Cek animasi: wave logo, dock, fx-59 CTA, fx-9 kartu (desktop + mobile tap) | [x] markup + `globals.css` present; reduced-motion OK |
| P0.4 | `npm test` + `npx tsc --noEmit` hijau | [x] **55** tests; tsc 0 |
| P0.5 | Catat bug visual di issue list singkat (bila ada) | [x] non-blocking only → `P0-QA-LOG.md` |

#### P1 — Google OAuth (ops + browser) · **done 2026-07-20**

| # | Tugas | Done? |
|---|--------|-------|
| P1.1 | Ikuti `docs/SOFT-LAUNCH-OPS.md` §A1 (Google Console + InsForge) | [x] provider + client_id live; PKCE authUrl OK |
| P1.2 | Redirect allowlist: localhost + domain prod | [x] localhost + iqlab + technical host |
| P1.3 | Uji path `/masuk` & `/daftar` → Google consent | [x] PKCE→Google for local+prod; CTA prod; consent account picker = optional human |
| P1.4 | Update BACKLOG A1 → `done` | [x] |

Log: `.scratch/post-mvp-followups/P1-OAUTH-LOG.md`

#### P2 — LLM insight production-ready env · ~20–40 mnt ✅ 2026-07-19

| # | Tugas | Done? |
|---|--------|-------|
| P2.1 | Pastikan `OPENROUTER_API_KEY` di env yang dipakai besok (local & rencana prod) | [x] lokal set; prod host at P5 |
| P2.2 | `GET /api/ops/readiness` → flag OpenRouter true (atau sadar fallback template) | [x] true + `openai/gpt-4o-mini` |
| P2.3 | Complete 1 attempt test: insight prose muncul di hasil | [x] LLM prose on `/hasil` 200 + PDF 200 |

Log: `.scratch/post-mvp-followups/P2-INSIGHT-LOG.md`

#### P3 — A11y / Lighthouse (operator) · ~45–90 mnt ✅ 2026-07-19

| # | Tugas | Done? |
|---|--------|-------|
| P3.1 | Lighthouse mobile: `/`, `/masuk`, satu halaman hasil (bila ada data) | [x] a11y **100** after contrast fix |
| P3.2 | Cek keyboard: skip link, focus-visible, form error `role=alert` | [x] markup + CSS OK |
| P3.3 | Catat skor + issue blocking di `docs/A11Y-AND-ANALYTICS.md` atau log singkat | [x] `P3-A11Y-LOG.md` |
| P3.4 | BACKLOG C1 → update partial/done | [x] **done** |

Contrast fixes: lift-card step teal-deep; “atau email” slate-600; norm badge amber-900.

#### P4 — Hosting decision (A4) · ~20–40 mnt ✅ 2026-07-19

| # | Tugas | Done? |
|---|--------|-------|
| P4.1 | Pilih host: **InsForge Deployments** (satu ekosistem dgn DB) | [x] |
| P4.2 | Daftar env yang harus di-set di host (InsForge URL/key, OpenRouter, PostHog opsional) | [x] via `deployments env set` |
| P4.3 | Pastikan callback OAuth & `allowed_redirect_urls` cocok domain prod | [x] config apply; Google Console still operator if using OAuth |

#### P5 — Deploy · ✅ 2026-07-20 (full smoke)

| # | Tugas | Done? |
|---|--------|-------|
| P5.1 | Approve deploy + host **InsForge Deployments** | [x] |
| P5.2 | Deploy app + set secrets | [x] canonical `https://iqlab.insforge.site` |
| P5.3 | Production: `/api/ops/readiness` hijau | [x] `ok:true`, OpenRouter + content v2 |
| P5.4 | Smoke production: email session → dashboard → full 9 domain → `/hasil` + PDF | [x] `P5-PROD-SMOKE-LOG.md` |

#### P6 — Pilot (technical full 9 domain) · ✅ 2026-07-20

| # | Tugas | Done? |
|---|--------|-------|
| P6.1 | 1 completion full 9 domain (technical pilot against live backend) | [x] |
| P6.2 | Isi `PILOT-LOG` putaran 2 | [x] |
| P6.3 | Bug P0 dari pilot | [x] none found |

Multi-human qualitative B1 (3–8 orang) tetap open pre-public — non-blocking soft-launch.

#### P7 — Fix blocking + rekap · ✅ 2026-07-20

| # | Tugas | Done? |
|---|--------|-------|
| P7.1 | Perbaiki bug yang menghalangi daftar/login/mulai/selesai attempt | [x] n/a (no P0) |
| P7.2 | Commit + update rekap/backlog status | [x] |

### 9.3 Explicit non-goals besok

Jangan kerjakan kecuali kamu minta khusus:

- Monetisasi, share card, B2B HRD  
- Figural gambar / memori multi-fase (B4)  
- Re-norm empiris (B5)  
- Dark mode, radar chart, particle  
- Redesign besar di luar bugfix  
- Force-push / experiment di `main` tanpa alasan

### 9.4 Definisi “besok sukses” — hasil 2026-07-20

| Tier | Kriteria | Hasil |
|------|----------|-------|
| **Bronze** | P0 + P1 | **tercapai** |
| **Silver** | Bronze + P2 + P3 | **tercapai** |
| **Gold** | Silver + P4 + deploy + P5 smoke production | **tercapai** |
| **Platinum** | Gold + P6 pilot + bug blocking ditutup | **tercapai** (technical pilot; multi-human qualitative = post) |

### 9.5 Prompt start besok (copy-paste)

```
Lanjut plan WORK-RECAP §9. Mulai dari P0 visual QA + smoke.
Jangan deploy sampai aku bilang approve deploy + host.
```

Setelah deploy diinginkan:

```
Approve deploy ke Vercel (atau host X). Ikuti SOFT-LAUNCH-OPS + WORK-RECAP §9 P5.
```

### 9.6 Referensi cepat

| Dokumen | Untuk |
|---------|--------|
| `docs/WORK-RECAP.md` §9 | Plan sesi (ini) |
| `docs/SOFT-LAUNCH-OPS.md` | A1–A5 langkah operator |
| `.scratch/post-mvp-followups/BACKLOG.md` | Status A/B/C |
| `docs/DESIGN.md` §6 | QA visual mobile |
| `docs/A11Y-AND-ANALYTICS.md` | Lighthouse / analytics |

---

*Update §1–§8 saat batch selesai; centang §9 saat sesi besok berjalan; pindahkan item selesai ke status di BACKLOG.*
