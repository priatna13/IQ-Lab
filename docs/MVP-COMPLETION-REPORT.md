# IQ-Lab — Laporan Penyelesaian MVP

**Tanggal laporan:** 2026-07-17  
**Sumber:** `PRD.md` v1.1, `.scratch/iq-lab-mvp/issues/*`, `CONTEXT.md`, `docs/adr/*`, git history  
**Status keseluruhan:** **MVP ticket set 01–11 selesai** (implementasi kode)

---

## 1. Ringkasan eksekutif

IQ-Lab MVP web telah diimplementasikan end-to-end sesuai PRD v1.1 dan domain model pasca grill-with-docs:

- Asesmen **9 Domain** hybrid (pause antar domain, timer server dalam domain)
- **Ability Profile**, **Composite Index**, **IQ Estimate** (norma sintetik sementara)
- **Insight karir hybrid** (Rule Payload + template / LLM opsional)
- **Report web + PDF** dari **Result Snapshot** imutabel
- Auth InsForge, retake 90 hari, Norm Sample anonim, integrity ringan, hapus data akun, FAQ metodologi

| Metrik | Nilai |
|--------|--------|
| Tickets MVP | **11 / 11 done** |
| Commits fitur (ticket 01–11) | 11 commits (`745f5fe` … `b35b2e1`) |
| Tes otomatis (saat ticket 11) | **41 tests** pass |
| Stack | Next.js 15 + InsForge (Postgres/Auth/RLS) + pdf-lib |

---

## 2. Status tickets (issue tracker lokal)

| # | Judul | Status | Commit utama |
|---|--------|--------|----------------|
| 01 | Foundation: app + InsForge + Assessment boundary harness | **done** | `745f5fe` |
| 02 | Landing, disclaimers, Auth & Age Band | **done** | `cae11fb` |
| 03 | Content Version seed + Create Open Attempt | **done** | `342afea` |
| 04 | Domain Session runner (timer, Response, Early Finish) | **done** | `9995a5e` |
| 05 | Nine Domains: order, pause/resume, abandon | **done** | `0a6bbfb` |
| 06 | Complete → Result Snapshot (skor + norma sintetik) | **done** | `bbb3218` |
| 07 | Insight hybrid (Rule Payload + LLM/fallback) | **done** | `a2f90f5` |
| 08 | PDF Report dari snapshot | **done** | `7fefa81` |
| 09 | Primary, Retake Policy, Norm Sample | **done** | `3057c27` |
| 10 | Integrity Events + Account Deletion | **done** | `01d2b97` |
| 11 | FAQ metodologi inspired-by | **done** | `b35b2e1` |

**Index:** `.scratch/iq-lab-mvp/ISSUES.md`  
**Spec:** `.scratch/iq-lab-mvp/spec.md`  
**Seam tes:** Assessment application boundary (`src/domain/assessment`)

---

## 3. Mapping ke goals PRD (bagian 3.1)

| Goal PRD | Status | Bukti singkat |
|----------|--------|----------------|
| 1. Assessment 9 Domain hybrid session | **Selesai** | Runner + urutan fixed + pause/resume + abandon |
| 2. Ability Profile, Composite Index, IQ Estimate (norma sementara) | **Selesai** | `completeAttempt` + `scoring.ts` + UI hasil |
| 3. Insight + action plan hybrid | **Selesai** | Rule engine + template; OpenRouter opsional |
| 4. Dua Track (`explore` \| `career`) | **Selesai** | Onboarding track; framing action plan beda |
| 5. Report web + PDF dari Result Snapshot | **Selesai** | `/hasil` + `/api/asesmen/[id]/pdf` |
| 6. Full gratis + Norm Sample agregat | **Selesai** | Tanpa paywall; `norm_samples` tanpa PII |
| 7. Branding/copy jujur (bukan IST/rekrutmen/klinis) | **Selesai** | Landing, disclaimer hasil/PDF, FAQ |

### Non-goals (sengaja tidak dibangun — sesuai PRD)

- IST berlisensi / item resmi  
- Klaim rekrutmen BUMN-CPNS / diagnosis klinis  
- B2B HRD, coach portal, share card, paywall  
- Proctoring ketat / auto-diskualifikasi  
- Multi-bahasa item bank, CAT penuh  

---

## 4. Requirement fungsional (FR) vs implementasi

| ID | Requirement | Status |
|----|-------------|--------|
| FR-01 | Daftar/masuk email+password & Google | **Selesai** (Google butuh Auth Methods di dashboard) |
| FR-02 | Account wajib sebelum Attempt | **Selesai** |
| FR-03 | Track `explore` \| `career` imutabel | **Selesai** |
| FR-04 | Age Band; blokir &lt;18; disclaimer 46+ | **Selesai** |
| FR-05 | Pin Content Version + Track; tolak open ganda / retake cooldown | **Selesai** |
| FR-06 | 9 Domain urutan Content Version | **Selesai** |
| FR-07 | Timer server + Grace Window | **Selesai** (grace 30s) |
| FR-08 | Navigasi domain + Response mutabel + autosave | **Selesai** |
| FR-09 | Early Finish hanya jika semua Item terjawab | **Selesai** |
| FR-10 | Timer close: kosong = salah | **Selesai** |
| FR-11 | Pause/resume antar Domain Session | **Selesai** |
| FR-12 | Abandon tanpa cooldown retake | **Selesai** |
| FR-13 | Skor domain + profil + indeks + IQ Estimate | **Selesai** |
| FR-14 | Rule Payload + Insight (LLM/fallback) per Track | **Selesai** |
| FR-15 | Result Snapshot imutabel; Report web + PDF | **Selesai** |
| FR-16 | Primary + retake 1×/90 hari | **Selesai** |
| FR-17 | Norm Sample Primary only, no PII, bucket usia | **Selesai** |
| FR-18 | Integrity Event blur/tab + peringatan | **Selesai** |
| FR-19 | FAQ + disclaimer inspired-by | **Selesai** |
| FR-20 | Account Deletion; Norm Sample tetap | **Selesai** (data asesmen + sign-out; purge `auth.users` penuh = batasan platform) |
| FR-21 | Landing value prop + CTA | **Selesai** |

---

## 5. Acceptance criteria MVP (PRD §19) — ceklis

| # | Kriteria | Status |
|---|----------|--------|
| 1 | Daftar (email/Google), pilih Track, create Attempt, 9 Domain, pause/resume, 1 Open Attempt | **Terpenuhi** |
| 2 | Early Finish hanya full answers; timer+grace partial tanpa auto-abandon Attempt | **Terpenuhi** |
| 3 | Response mutabel saat open; beku setelah close | **Terpenuhi** |
| 4 | Ability Profile + Composite + IQ Estimate server-side + disclaimer norma sementara | **Terpenuhi** |
| 5 | Insight dari Rule Payload + narasi/fallback per Track; di snapshot | **Terpenuhi** |
| 6 | Dashboard + PDF dari snapshot; RLS | **Terpenuhi** |
| 7 | Primary + retake 90 hari; Abandoned tidak cooldown | **Terpenuhi** |
| 8 | UI BI; disclaimer bukan IST resmi | **Terpenuhi** |
| 9 | Tidak ada correct_key di payload client | **Terpenuhi** |
| 10 | Account Deletion hapus data teridentifikasi | **Terpenuhi** (dengan catatan auth user platform) |

---

## 6. Artefak teknis yang sudah ada

### Aplikasi & domain
- `src/app/*` — landing, auth, dasbor, onboarding usia, asesmen, hasil, FAQ  
- `src/domain/assessment/*` — boundary (Attempt, Domain Session, complete, insight, PDF, retake, integrity, delete)  
- `src/lib/insforge/*`, `src/lib/assessment/*` — adapter InsForge  

### Database (InsForge migrations)
| Migrasi | Isi |
|---------|-----|
| `create-attempts` | Attempt + RLS + unique open |
| `create-domain-sessions-responses` | Domain Session + Response |
| `create-result-snapshots` | Result Snapshot imutabel |
| `create-norm-samples` | Norm Sample anonim (INSERT only user) |
| `create-integrity-events` | Integrity Event |

### Dokumen produk
| File | Peran |
|------|--------|
| `PRD.md` | Spec produk v1.1 |
| `CONTEXT.md` | Ubiquitous language |
| `docs/adr/0001`–`0015` | Keputusan arsitektur/domain |
| `.scratch/iq-lab-mvp/spec.md` | Spec agent-ready |
| `.scratch/iq-lab-mvp/issues/01`–`11` | Tickets (semua **done**) |

---

## 7. Yang sudah selesai — daftar fitur user-facing

1. **Landing** dengan value prop & disclaimer legal  
2. **Daftar / masuk** (email+password; Google OAuth jika dikonfigurasi di InsForge)  
3. **Onboarding Age Band** (&lt;18 diblokir; 46+ disclaimer)  
4. **Dasbor** (status Attempt, retake cooldown, hasil selesai, unduh PDF, hapus data)  
5. **Pilih Track** + konfirmasi imutabel  
6. **Asesmen 9 domain** berurutan, timer, navigasi soal, autosave  
7. **Early Finish** / tutup timer + grace  
8. **Pause & lanjut** antar domain; **batalkan Attempt**  
9. **Selesaikan & lihat hasil** — profil, indeks, estimasi IQ, klaster, insight, action plan  
10. **Unduh PDF** A4 dari snapshot  
11. **FAQ & metodologi** (`/faq`)  
12. **Peringatan integrity** (blur/tab) tanpa diskualifikasi  

---

## 8. Sisa / batasan (bukan “ticket open”, tapi follow-up)

| Area | Catatan |
|------|---------|
| **Konten item** | **v2 shipped** (`cv_mvp_v2`, 8 soal/domain original BI); masih butuh human review psikometrik & iterasi bank |
| **Google OAuth** | Kode siap; provider harus diaktifkan di dashboard InsForge |
| **LLM insight** | Template default; OpenRouter jika `OPENROUTER_API_KEY` di-set |
| **Email verification** | Dimatikan di `insforge.toml` untuk MVP lokal (tanpa SMTP) |
| **Purge auth.users penuh** | Hapus data asesmen + sign-out; hapus total identitas platform tergantung API InsForge |
| **PDF storage InsForge** | PDF digenerate on-demand (bukan simpan R2 permanen) — setara konten snapshot |
| **NFR performance/a11y** | Responsive dasar ada; audit Lighthouse/a11y formal belum |
| **Metrik produk** | Activation/completion analytics belum diinstrumentasi |
| **ToS/Privasi legal full** | Copy privasi di UI/FAQ; dokumen legal formal terpisah bisa ditambah |
| **ISSUES.md** | Ada baris duplikat status lama di index (perlu rapikan — status sumber kebenaran = file issue per nomor) |

### PRD §18 — keputusan terbuka (belum digaransi di build)

- Microcopy final 9 Domain  
- Detik timer exact / grace (grace di-set 30s)  
- Model OpenRouter konkret  
- Hosting front final  
- Representasi pin Content Version di DB (saat ini seed kode `cv_mvp_v1`)  

---

## 9. Kesimpulan

| Pertanyaan | Jawaban |
|------------|---------|
| Apakah semua ticket MVP selesai? | **Ya (01–11)** |
| Apakah goals & FR inti PRD terpenuhi? | **Ya** untuk scope MVP yang didefinisikan |
| Apakah siap soft-launch internal? | **Ya**, dengan item placeholder + OAuth/LLM/SMTP dikonfigurasi sesuai lingkungan |
| Apakah “selesai produk final”? | **Belum** — butuh konten soal ter-review, hardening ops, dan validasi pengguna nyata |

---

## 10. Referensi cepat

```
PRD:     PRD.md
Domain:  CONTEXT.md
ADR:     docs/adr/
Spec:    .scratch/iq-lab-mvp/spec.md
Tickets: .scratch/iq-lab-mvp/issues/
App:     npm run dev → http://localhost:3000
FAQ:     /faq
```

*Laporan ini merefleksikan keadaan repo pada 2026-07-17 setelah commit ticket 11.*
