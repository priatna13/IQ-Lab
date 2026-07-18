# Post-MVP follow-ups (dari MVP-COMPLETION-REPORT §8 + PRD §18)

**Status index:** `open` | `partial` | `done` | `wontfix` | `ops-only`  
**Sumber:** `docs/MVP-COMPLETION-REPORT.md` §8–§9, `PRD.md` §16 Fase 3 sisa + §18  
**Bukan ticket MVP 01–11** — pekerjaan hardening / ops / legal / konten lanjutan.

---

## Sudah tergerus sejak report (update 2026-07-18)

| Area report | Update |
|-------------|--------|
| Konten item placeholder | **Partial → largely done:** `cv_mvp_v2` shipped + key review; sisa = psikometrik lapangan & iterasi bank |
| ISSUES.md duplikat index MVP | **Done** (index dirapikan; frontier “MVP complete”) |
| Pin Content Version di docs §18 | **Partial:** pin aktif `cv_mvp_v2` (seed kode); masih bukan snapshot rows di DB |

---

## Backlog aktif (fokus di sini)

### A. Soft-launch ops (config, bukan fitur besar)

| ID | Item | Tipe | Status | Effort | Catatan |
|----|------|------|--------|--------|---------|
| A1 | **Google OAuth live** | ops | **partial** | S | Metadata: `oAuthProviders` includes **google** (+ github). Endpoint `/api/auth/oauth/google` responds (400 tanpa params = ada). **Uji browser** tombol Google di `/masuk` masih wajib |
| A2 | **LLM Insight production** | ops + code | **done (local)** | S | `npx @insforge/cli ai setup` menulis `OPENROUTER_API_KEY` ke `.env.local`; model `openai/gpt-4o-mini` di-set. Production host masih perlu secret yang sama |
| A3 | **Email verification / SMTP** | ops | open | M | Runbook A3; tetap `false` untuk soft-launch internal |
| A4 | **Hosting front final** | ops | open | M | Checklist deploy di runbook; keputusan host belum final |
| A5 | **Purge auth.users penuh** | research + code | open | M | Documented; product delete data OK tanpa purge platform |

### B. Konten & norma (kualitas produk)

| ID | Item | Tipe | Status | Effort | Catatan |
|----|------|------|--------|--------|---------|
| B1 | **Review psikometrik / pilot item** | human process | **partial** | L | Protokol + desk review + revisi P1 (`PILOT-B1.md`, `PILOT-LOG.md`); **pilot manusia live** masih open |
| B2 | **Microcopy final 9 Domain** | content | **done** | S | Label, shortBlurb, instruction BI; UI mulai/progress/runner |
| B3 | **Timer exact + grace** | product decision | open | S | Grace 30s fixed; timer per domain di specs — konfirmasi angka final |
| B4 | **Figural gambar / memori multi-fase** | feature | open | L | Saat ini teks/simbol + stimulus in-prompt |
| B5 | **Re-norm empiris** | data science | open | XL | Fase 4+; butuh Norm Samples + volume; Norm Version baru |

### C. Hardening NFR & legal

| ID | Item | Tipe | Status | Effort | Catatan |
|----|------|------|--------|--------|---------|
| C1 | **Lighthouse + a11y audit** | eng | **partial** | M | Skip link, landmarks, focus, form/runner a11y done; Lighthouse manual checklist di docs |
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

## Urutan rekomendasi (soft-launch internal dulu)

```
1. A1 Google OAuth     ─┐
2. A2 OpenRouter model ─┼─► soft-launch config
3. B2 + B3 microcopy/timer decision (cepat)
4. C3 ToS/Privasi minimal
5. C1 a11y/Lighthouse pass
6. C2 analytics ringan
7. A3/A4/A5 ops lanjutan
8. B1 pilot → B5 re-norm (panjang)
9. B4 figural/memori UI (opsional kualitas)
```

---

## Design system (visual)

| Item | Status |
|------|--------|
| Grill-locked UI direction + mobile plan | **`docs/DESIGN.md`** (source of truth) |
| Implement visual R1 | **done** (after `GO BUILD`) |
| Deploy | Waiting separate explicit approve |

## Non-goals tetap (Fase 4+ / PRD non-goals)

Monetisasi, share card, B2B HRD, coach portal, CAT penuh, proctoring ketat, multi-bahasa bank — **jangan masuk sprint soft-launch** kecuali PO mengubah scope.
