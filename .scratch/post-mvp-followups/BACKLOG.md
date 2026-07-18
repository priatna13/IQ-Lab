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
| A1 | **Google OAuth live** | ops | **ops-only** | S | Runbook di `docs/SOFT-LAUNCH-OPS.md`; kode + error UI ready; operator aktifkan di dashboard |
| A2 | **LLM Insight production** | ops + code | **partial** | S | ADR 0016 model default; readiness API; operator set `OPENROUTER_API_KEY` |
| A3 | **Email verification / SMTP** | ops | open | M | Runbook A3; tetap `false` untuk soft-launch internal |
| A4 | **Hosting front final** | ops | open | M | Checklist deploy di runbook; keputusan host belum final |
| A5 | **Purge auth.users penuh** | research + code | open | M | Documented; product delete data OK tanpa purge platform |

### B. Konten & norma (kualitas produk)

| ID | Item | Tipe | Status | Effort | Catatan |
|----|------|------|--------|--------|---------|
| B1 | **Review psikometrik / pilot item** | human process | open | L | Kunci sudah di-review logika; butuh data kesulitan/diskriminasi dari pilot |
| B2 | **Microcopy final 9 Domain** | content | open | S | Label/instruksi di `domain-specs.ts` — polish BI final |
| B3 | **Timer exact + grace** | product decision | open | S | Grace 30s fixed; timer per domain di specs — konfirmasi angka final |
| B4 | **Figural gambar / memori multi-fase** | feature | open | L | Saat ini teks/simbol + stimulus in-prompt |
| B5 | **Re-norm empiris** | data science | open | XL | Fase 4+; butuh Norm Samples + volume; Norm Version baru |

### C. Hardening NFR & legal

| ID | Item | Tipe | Status | Effort | Catatan |
|----|------|------|--------|--------|---------|
| C1 | **Lighthouse + a11y audit** | eng | open | M | NFR report; perbaiki blocker |
| C2 | **Analytics activation/completion** | eng | open | M | Instrument event: signup, start attempt, domain complete, complete attempt |
| C3 | **ToS + Privasi formal** | legal/content | open | M | Halaman `/kebijakan` atau `/syarat` + link footer |
| C4 | **PDF storage permanen (opsional)** | eng | open | M | On-demand OK secara setara snapshot; simpan R2 hanya jika perlu audit file |

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

## Non-goals tetap (Fase 4+ / PRD non-goals)

Monetisasi, share card, B2B HRD, coach portal, CAT penuh, proctoring ketat, multi-bahasa bank — **jangan masuk sprint soft-launch** kecuali PO mengubah scope.
