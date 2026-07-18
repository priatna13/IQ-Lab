# IQ-Lab — Rekap pekerjaan selesai

**Tanggal rekap:** 2026-07-18  
**Branch:** `main`  
**Scope:** MVP fungsional + soft-launch tracks + visual system (DESIGN.md) + polish animasi/mobile  

Dokumen ini merangkum apa yang **sudah selesai** di repo (bukan backlog). Sumber utama: commit history + `docs/DESIGN.md` + laporan MVP.

---

## 1. Ringkasan status

| Area | Status |
|------|--------|
| Domain Assessment (FR asesmen, attempt, skor, insight, PDF) | **Selesai** (MVP) |
| Item Bank Content Version **v2** (published) | **Selesai** |
| Soft-launch Track A (ops pack + readiness) | **Selesai** (deploy produksi = gate terpisah) |
| Track B1 pilot pack + B2 microcopy | **Selesai** |
| Track C1 a11y, C2 analytics, C3 legal, C4 PDF storage | **Selesai** |
| DESIGN.md R1 + depth + brand logo + animasi + mobile | **Selesai** (kode lokal) |
| Deploy production | **Belum** — butuh approve eksplisit pemilik |

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
11. *(commit rekap ini)* — docs: WORK-RECAP.md  

---

## 6. Yang sengaja belum / gate terpisah

- **Deploy production** (Vercel / host) — butuh **approve deploy** eksplisit  
- Lighthouse / visual QA operator checklist (375 / 390 / 768) — sebagian checklist di DESIGN.md masih manual  
- Pilot manusia B1 end-to-end di production  
- Radar chart, dark mode, particle — out of scope DESIGN.md  
- Domain runner “deep restyle” ekspresif (chrome calm sudah; bukan overhaul item UI)

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

*Update dokumen ini saat batch fitur besar selesai, sebelum soft-launch publik.*
