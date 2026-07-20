# Post-MVP follow-ups (dari MVP-COMPLETION-REPORT §8 + PRD §18)

**Status index:** `open` | `partial` | `done` | `wontfix` | `ops-only`  
**Sumber:** `docs/MVP-COMPLETION-REPORT.md` §8–§9, `PRD.md` §16 Fase 3 sisa + §18  
**Bukan ticket MVP 01–11** — pekerjaan hardening / ops / legal / konten lanjutan.  
**Closeout soft-launch internal:** 2026-07-20 (P0–P6 technical + P5 prod smoke)

---

## Sudah tergerus sejak report (update 2026-07-18 → 2026-07-20)

| Area report | Update |
|-------------|--------|
| Konten item placeholder | **Partial → largely done:** `cv_mvp_v2` shipped + key review; sisa = psikometrik lapangan & iterasi bank |
| ISSUES.md duplikat index MVP | **Done** (index dirapikan; frontier “MVP complete”) |
| Pin Content Version di docs §18 | **Partial:** pin aktif `cv_mvp_v2` (seed kode); masih bukan snapshot rows di DB |
| Soft-launch A1–A4 + C1–C4 + P5/P6 | **Done** (lihat di bawah) |

---

## Backlog aktif (fokus di sini)

### A. Soft-launch ops (config, bukan fitur besar)

| ID | Item | Tipe | Status | Effort | Catatan |
|----|------|------|--------|--------|---------|
| A1 | **Google OAuth live** | ops | **done** 2026-07-20 | S | PKCE→Google untuk localhost + prod hosts; CTA prod OK; path ke consent page verified. Human account picker not automatable. Log: `P1-OAUTH-LOG.md` |
| A2 | **LLM Insight production** | ops + code | **done** 2026-07-19/20 | S | Local + prod readiness OpenRouter; live completeAttempt + LLM prose + prod `/hasil`/PDF. Log: `P2-INSIGHT-LOG.md`, `P5-PROD-SMOKE-LOG.md` |
| A3 | **Email verification / SMTP** | ops | open | M | Runbook A3; tetap `false` untuk soft-launch internal |
| A4 | **Hosting front final** | ops | **done** 2026-07-19 | M | **InsForge Deployments** → `https://iqlab.insforge.site` |
| A5 | **Purge auth.users penuh** | research + code | open | M | Documented; product delete data OK tanpa purge platform |

### B. Konten & norma (kualitas produk)

| ID | Item | Tipe | Status | Effort | Catatan |
|----|------|------|--------|--------|---------|
| B1 | **Review psikometrik / pilot item** | human process | **partial** | L | Desk review + **technical pilot 9/9 done**; multi-human qualitative 3–8 still open pre-public |
| B2 | **Microcopy final 9 Domain** | content | **done** | S | Label, shortBlurb, instruction BI; UI mulai/progress/runner |
| B3 | **Timer exact + grace** | product decision | open | S | Grace 30s fixed; timer per domain di specs — konfirmasi angka final |
| B4 | **Figural gambar / memori multi-fase** | feature | open | L | Saat ini teks/simbol + stimulus in-prompt |
| B5 | **Re-norm empiris** | data science | open | XL | Fase 4+; butuh Norm Samples + volume; Norm Version baru |

### C. Hardening NFR & legal

| ID | Item | Tipe | Status | Effort | Catatan |
|----|------|------|--------|--------|---------|
| C1 | **Lighthouse + a11y audit** | eng | **done** 2026-07-19 P3 | M | Mobile LH a11y **100** on `/`, `/masuk`, `/hasil`; contrast fix shipped. Log: `P3-A11Y-LOG.md` |
| C2 | **Analytics activation/completion** | eng | **done** | M | `trackProductEvent` + hooks; PostHog/webhook optional |
| C3 | **ToS + Privasi formal** | legal/content | **done** | M | `/privasi` + `/syarat` + footer, daftar, FAQ, landing, dasbor |
| C4 | **PDF storage permanen** | eng | **done** | M | Bucket `reports` + `pdf_url`/`pdf_key`; first download stores |

### D. Keputusan terbuka PRD §18 (belum digaransi)

| ID | Keputusan | Status |
|----|-----------|--------|
| D1 | Microcopy final 9 Domain | → B2 |
| D2 | Item count & timer/grace exact | → B3 |
| D3 | Model OpenRouter konkret | → A2 |
| D4 | Hosting front final | → A4 |
| D5 | Chart library (jika UI chart Ability Profile) | open |
| D6 | Representasi pin CV di DB (vs seed immutable) | open (seed cukup soft-launch) |
| D7 | Matriks Career Cluster v1 isi final | open (ruleset sudah ada; polish) |

---

## Urutan rekomendasi (post soft-launch)

```
1. Optional: 1× human Google login sanity di production
2. B1 multi-human qualitative (3–8) sebelum public
3. A3 SMTP jika public + email verification
4. B3 timer decision, B4 figural bila prioritas
5. B5 re-norm setelah volume Norm Samples
```

---

## Design system (visual)

| Item | Status |
|------|--------|
| Grill-locked UI direction + mobile plan | **`docs/DESIGN.md`** (source of truth) |
| Implement visual R1 | **done** |
| Deploy production | **live** `https://iqlab.insforge.site` |

## Non-goals tetap (Fase 4+ / PRD non-goals)

Monetisasi, share card, B2B HRD, coach portal, CAT penuh, proctoring ketat, multi-bahasa bank — **jangan masuk sprint soft-launch** kecuali PO mengubah scope.
