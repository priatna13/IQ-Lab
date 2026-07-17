# PRD — IQ-Lab

**Produk:** Platform asesmen multi-domain inspired-by kerangka Intelligence Structure Test (IST), untuk insight potensi diri & arah karir.  
**Status dokumen:** Draft **v1.1** (sync domain model pasca grill-with-docs)  
**Tanggal:** 2026-07-17  
**Bahasa produk (UI):** 100% Bahasa Indonesia  
**Bahasa domain (spec/kode):** lihat [`CONTEXT.md`](./CONTEXT.md)  
**Keputusan arsitektur/domain:** [`docs/adr/`](./docs/adr/)  

> **Gate implementasi:** Jangan mulai coding sampai Product Owner **approve** eksplisit setelah review PRD ini.

---

## 0. Sumber kebenaran & istilah

| Dokumen | Peran |
|---------|--------|
| **PRD.md** (ini) | Scope fitur, FR/NFR, acceptance, UX, non-goals |
| **CONTEXT.md** | Ubiquitous language — istilah kanonik wajib dipakai di PRD, desain, dan kode |
| **docs/adr/** | Keputusan sulit dibalik + alasan |

Istilah kanonik yang dipakai di dokumen ini (definisi penuh di `CONTEXT.md`):

**Participant**, **Account**, **Account Deletion**, **Age Band**, **Track**, **Assessment**, **Domain**, **Item**, **Item Bank**, **Content Version**, **Attempt** (`in_progress` / `completed` / `abandoned`), **Open Attempt**, **Completed Attempt**, **Abandoned Attempt**, **Primary Attempt**, **Domain Session**, **Early Finish**, **Grace Window**, **Response**, **Domain Navigation**, **Domain Score**, **Ability Profile**, **Composite Index**, **IQ Estimate**, **Norm Version**, **Norm Sample**, **Career Cluster**, **Rule Payload**, **Insight**, **Result Snapshot**, **Report**, **Score Correction**, **Integrity Event**, **Retake Policy**.

Persona pasar (A/B) **bukan** entitas runtime — runtime memakai **Track**.

---

## 1. Ringkasan eksekutif

IQ-Lab adalah website asesmen kognitif **multi-domain** yang membantu **Participant** memahami **Ability Profile** (kekuatan & kelemahan), lalu menerjemahkannya menjadi **Insight** pengembangan diri dan arah karir lewat **Report** (dashboard + PDF).

Produk **bukan** tes IST / IST 2000R berlisensi. Struktur 9 **Domain** terinspirasi kerangka multi-faktor, dengan **Item** original, penamaan IQ-Lab, dan disclaimer eksplisit.

**Nilai utama:** Ability Profile yang actionable (bukan sekadar satu angka) + action plan sesuai **Track** (`explore` vs `career`).

---

## 2. Problem statement

| Masalah | Dampak |
|--------|--------|
| Tes “IQ” generik di web sering hanya satu skor, minim insight karir | Participant tidak tahu *apa yang harus dikembangkan* |
| IST resmi relevan untuk karir di Indonesia, tetapi mahal, offline, dan berlisensi | Individu sulit akses mandiri untuk self-development |
| Banyak tes online overclaim (“setara rekrutmen / IQ resmi”) | Risiko hukum, etika, dan kepercayaan |
| Profesional & fresh grad butuh bahasa hasil yang beda | Satu Report generik terasa tidak personal |

**Peluang:** asesmen inspired-by multi-domain, legal-safe, full digital, Ability Profile + Composite Index + IQ Estimate, Insight berbasis Rule Payload + narasi AI terbatas.

---

## 3. Goals & non-goals

### 3.1 Goals (MVP)

1. Assessment **9 Domain** dengan hybrid session: pause antar Domain Session; timer server dalam Domain Session.
2. Menghasilkan **Ability Profile**, **Composite Index**, dan **IQ Estimate** (Norm Version sintetik / sementara).
3. **Insight** + action plan lewat engine hybrid (Rule Payload + LLM constrained + fallback).
4. Dua **Track** onboarding (`explore` | `career`); Item identik; framing & Insight beda.
5. **Report**: dashboard web + PDF dari **Result Snapshot**.
6. Full **gratis** (pre-revenue); kumpulkan **Norm Sample** agregat.
7. Branding & copy **jujur**: bukan IST resmi, bukan alat rekrutmen/klinis.

### 3.2 Non-goals (MVP)

- Lisensi, Item, atau norma IST / IST 2000R resmi.
- Klaim kesetaraan rekrutmen BUMN, CPNS, atau asesmen klinis.
- Dashboard B2B HRD / batch screening.
- Portal konselor/coach multi-klien.
- Share card sosial untuk pamer skor.
- Monetisasi / paywall.
- Item Bank raksasa / CAT penuh (MVP: set kecil per Domain).
- Proctoring ketat; auto-diskualifikasi dari Integrity Event.
- Multi-bahasa Item Bank.
- Ganti Track mid-Attempt atau reframe Track pada Completed Attempt.
- Regenerate Insight historis saat model/template membaik.
- Pengacakan urutan Domain per Attempt.
- Multi Open Attempt paralel.

---

## 4. Personas & Track

### 4.1 Persona A — Self-development / eksplorasi (pasar)

- Mahasiswa, fresh graduate, atau individu menjajaki jalur.
- Butuh: Ability Profile mudah dibaca, saran bidang, langkah belajar.
- Tone Report: eksploratif, mendukung.

### 4.2 Persona B — Profesional mid-career (pasar)

- Usia ~25–45 (inti), naik level / pindah jalur / skill gap.
- Butuh: Career Cluster, prioritas skill, action plan konkret.
- Tone Report: praktis, berorientasi langkah.

### 4.3 Track (runtime)

| Track ID | Label UI (draft) | Fokus action plan |
|----------|------------------|-------------------|
| `explore` | Jelajahi potensi | Eksplorasi bidang, belajar, portofolio/jurusan |
| `career` | Rancang langkah karir | Skill gap, prioritas training, arah role |

**Aturan domain (wajib):**

- Item Assessment **identik** antar Track.
- Track dipilih **saat Attempt dibuat** dan **imutabel** untuk Attempt itu.
- Mengganti Track = **Abandoned Attempt** (tanpa cooldown Retake) + Open Attempt baru jika Retake Policy mengizinkan.
- Tidak ada reframe Track pada Completed Attempt di MVP.

---

## 5. Posisi legal & etika (wajib)

### 5.1 Positioning

- Produk: asesmen pengembangan diri inspired-by kerangka multi-domain.
- **Bukan** produk, adaptasi resmi, atau substitusi IST 2000R.
- **Bukan** diagnosis psikologis/klinis.
- **Bukan** sertifikasi rekrutmen / promosi formal / CPNS-BUMN.

### 5.2 Copy & disclaimer (harus muncul)

| Lokasi | Isi minimal |
|--------|-------------|
| Landing / hero | Bukan tes IST resmi; untuk pengembangan diri |
| Sebelum mulai Attempt | Estimasi; kerjakan jujur; bukan rekrutmen |
| Report (hasil) | Norma internal sementara; IQ Estimate = estimasi |
| PDF | Footer disclaimer yang sama |
| FAQ | Terinspirasi kerangka multi-faktor vs bukan IST berlisensi |

### 5.3 Item content policy

- Semua Item **original** (AI draft + human review).
- Dilarang meniru Item/urutan/wording tes komersial berlisensi.
- Reviewer menolak Item yang terlalu mirip materi populer.

---

## 6. Lingkup Assessment

### 6.1 Sembilan Domain

Struktur setara konsep multi-faktor klasik; **nama tampilan = brand IQ-Lab**.

| # | Domain (draft internal) | Fokus kognitif (ringkas) |
|---|-------------------------|---------------------------|
| 1 | Pemahaman verbal | Kosakata, makna, pemahaman wacana singkat |
| 2 | Analogi verbal | Relasi kata / penalaran verbal |
| 3 | Operasi numerik | Hitung & kelancaran numerik |
| 4 | Deret / pola angka | Penalaran kuantitatif berpola |
| 5 | Figural / pola bentuk | Penalaran figural 2D |
| 6 | Spasial | Rotasi / relasi ruang |
| 7 | Memori | Ingatan jangka pendek / materi baru |
| 8 | Penalaran logis | Deduksi, aturan, silogisme ringan |
| 9 | Penilaian praktis / judgment | Penalaran situasional / opsi masuk akal |

> UI final tidak memakai trademark subtes IST resmi.

### 6.2 Item Bank & Content Version

- Generate: AI draft; quality gate: reviewer kompeten.
- Ukuran MVP: **8–12 Item/Domain** (angka final saat desain Item).
- Metadata Item (server): domain, difficulty, correct_key, active, id stabil, dll.
- **Content Version** memuat: Item Bank + **urutan Domain tetap (fixed sequence)**.
- Content Version **dipin pada Attempt create**; seluruh Domain Session Attempt memakai pin itu.
- Perbaikan Item/urutan = publish Content Version baru (tidak mengubah Open Attempt lama).
- Pengacakan urutan Domain per Attempt: **bukan MVP**.

### 6.3 Lifecycle Attempt

```
Account wajib → pilih Track + Age Band → create Attempt
  (pin Track + Content Version; status in_progress = Open Attempt)
→ Domain Sessions berurutan (fixed dalam Content Version)
→ pause diizinkan ANTAR Domain Session
→ setelah 9 Domain Session closed → skor + Rule Payload + Insight
→ Result Snapshot → status completed
→ Report (dashboard + PDF)
```

| Status Attempt | Arti |
|----------------|------|
| `in_progress` | **Open Attempt** — maks **satu** per Participant; resume ke sini |
| `completed` | Sembilan Domain selesai + Result Snapshot ada; memicu **Retake Policy** cooldown |
| `abandoned` | Dihentikan eksplisit sebelum lengkap; **tidak** cooldown retake; **bukan** Primary; **bukan** Norm Sample |

**Primary Attempt:** Completed Attempt **pertama** (`completed_at` earliest) — sumber Report utama + Norm Sample.

**Mulai Attempt baru ditolak jika:** sudah ada Open Attempt, atau Retake Policy cooldown aktif (setelah Completed dalam 90 hari).

### 6.4 Domain Session (hybrid timer)

| Aturan | Detail |
|--------|--------|
| Timer | **Server-authoritative**; client display only |
| Pause | Hanya **antar** Domain Session |
| Domain Navigation | Dalam session **terbuka**: maju/mundur antar Item domain itu |
| Response | Upsert ke server; **mutabel** sampai session close; dinilai **jawaban terakhir** per Item |
| Close path 1 — **Early Finish** | Diizinkan **hanya** jika semua Item domain punya Response di server |
| Close path 2 — **Timer + Grace Window** | Setelah `ends_at`, Grace Window (puluhan detik) hanya flush Response in-flight; lalu close; Item tanpa Response = kosong/salah |
| Setelah close | Response **beku**; Domain tidak dibuka lagi di MVP |
| Bank waktu | Sisa detik **tidak** dipindah ke Domain lain |
| Ulang Domain | Tidak (bukan retry domain) |

### 6.5 Durasi

- Target total Attempt: **~60–90+ menit**.
- UI jujur soal sisa Domain / estimasi, bukan “5 menit”.

### 6.6 Age Band

| Segmen | Kebijakan |
|--------|-----------|
| 18–45 | Inti norma empiris & copy karir |
| 46+ | Diizinkan + disclaimer; Norm Sample bucket terpisah (tidak campur norma inti v1) |
| &lt; 18 | Diblokir onboarding |

### 6.7 Retake Policy

- Maks **satu Completed Attempt / 90 hari** (dari `completed_at` Completed terkait).
- **Abandoned tidak** mengonsumsi kuota.
- Saat cooldown: Participant **boleh** lihat Report Completed/Primary sebelumnya; **tidak** boleh Open Attempt baru.
- Completed setelah cooldown **bukan** Primary dan **bukan** Norm Sample (Primary tetap yang pertama).

---

## 7. Skor, norma, Result Snapshot

### 7.1 Lapisan skor

| Konsep | Deskripsi | Label UI (draft) |
|--------|-----------|------------------|
| Raw (internal) | Benar/bobot per Domain saat Domain Session close | — |
| **Domain Score** | Skala terstandar per Domain | Skor per area |
| **Ability Profile** | Kumpulan Domain Score | Profil kemampuan |
| **Composite Index** | Agregat multi-domain | Indeks kemampuan umum |
| **IQ Estimate** | Transform ~ mean 100, SD 15 via Norm Version | **Estimasi IQ (norma internal IQ-Lab)** |

### 7.2 Norm Version & Norm Sample

- MVP hari-1: **Norm Version sintetik**; badge UI **“Estimasi · norma sementara”**.
- **Norm Sample** (tanpa PII): hanya dari **Primary Attempt Completed**; simpan aggregates + **Age Band** + Content Version (+ meta minim).
- Abandoned & Completed non-primary: **tidak** masuk Norm Sample.
- Norma inti empiris v1: bucket **18–45**; **46+** terpisah / tidak campur inti.
- Integrity Event **tidak** auto-exclude sample di MVP.
- Jangan overclaim persenil populasi Indonesia tanpa sampel memadai.

### 7.3 Result Snapshot (imutabel)

Saat Attempt → `completed`, sistem menulis **Result Snapshot** beku berisi minimal:

- Domain Scores, Ability Profile, Composite Index, IQ Estimate  
- Norm Version, Content Version, Track  
- Rule Payload (+ version ruleset)  
- Insight prose + action plan  
- Timestamp complete  

**Report** (dashboard/PDF) **hanya merender** Result Snapshot + disclaimer.  
PDF file boleh di-render ulang jika **konten setara snapshot**.  
Perbaikan model/template Insight **tidak** menulis ulang snapshot historis.  
**Score Correction:** proses luar-jalur (bukan fitur Participant) hanya untuk bug skor terbukti + audit.

### 7.4 Integritas teknis

| Kontrol | MVP |
|---------|-----|
| Kunci Item | Hanya server |
| Skor | Hanya server (saat Domain Session close + roll-up Attempt) |
| Timer / Grace Window | Server |
| Integrity Event (blur/tab) | Catat + peringatan UX; **tidak** auto-invalidasi Attempt |
| Proctoring ketat | Tidak |

---

## 8. Insight karir (engine hybrid)

### 8.1 Rule engine → Rule Payload (sumber kebenaran)

- Input: Ability Profile (+ Track, Age Band, tujuan singkat onboarding).
- Output terstruktur (**Rule Payload**):
  - 2–4 **Career Cluster**
  - Kekuatan & area kembangkan (Domain)
  - Prioritas skill (terbatas)
  - Flag confidence rendah bila profil datar / data lemah
- Matriks Domain → cluster = **konfigurasi ber-version**, bukan folklore di prompt.

### 8.2 LLM (penutur)

- Menulis narasi BI **hanya** dalam batasan Rule Payload.
- Dilarang: cluster/role di luar payload; klaim klinis; klaim lulus tes kerja.
- Prompt template berbeda per Track.
- Gagal LLM → fallback template dari Rule Payload (Report tetap usable).
- Output Insight masuk **Result Snapshot** (imutabel setelah complete).

### 8.3 Action plan (contoh elemen)

| Track | Elemen |
|-------|--------|
| `explore` | Area eksplorasi, belajar 30/60/90 hari, aktivitas (proyek, kuliah, bacaan) |
| `career` | Skill gap vs cluster, prioritas training, praktik/portofolio |

---

## 9. Pengalaman pengguna (UX)

### 9.1 Sitemap MVP

1. Landing — value prop, disclaimer, CTA  
2. Auth — daftar/masuk (email+password, Google)  
3. Onboarding — Track + Age Band + tujuan singkat (konfirmasi Track sebelum Domain 1)  
4. Dashboard Participant — Open Attempt / lanjut, riwayat Completed, unduh PDF, batalkan (abandon)  
5. Runner — instruksi Domain, timer, Item, navigasi dalam Domain, Early Finish, pause antar Domain  
6. Report — Ability Profile, Composite Index, IQ Estimate, Insight, action plan  
7. FAQ / Tentang — metodologi, batasan  
8. Privasi & syarat  

### 9.2 Report

- Dashboard web (wajib) + PDF (wajib), dari Result Snapshot.  
- Share card sosial: out of scope.

### 9.3 Visual / brand

- Lab ilmiah tenang (navy/teal, whitespace, chart bersih) + aksen hangat pada Insight/action plan.  
- Asset: `logo.jpg`.  
- Aksesibilitas dasar: kontras, focus, timer jelas.

---

## 10. Auth, data model, privasi

### 10.1 Auth

- **Account wajib** sebelum create Attempt.
- Email + password (verifikasi dianjurkan) + Google OAuth.
- Pola InsForge SSR untuk Next.js.

### 10.2 Data model (konseptual)

Nama tabel final saat migrasi; kolom ilustratif mengikuti konsep domain.

| Entitas / tabel (usulan) | Konsep domain | Isi inti |
|--------------------------|---------------|----------|
| `profiles` | Participant profile | account/user id, display_name, age_band, created_at |
| `content_versions` | Content Version | version id, published_at, domain_order JSON, notes |
| `items` | Item (per Content Version) | content_version_id, domain_id, body, correct_key (server-only path), difficulty, position |
| `career_rule_sets` | Ruleset versioned | version, matrix JSON |
| `attempts` | Attempt | participant_id, track, content_version_id, status, started_at, completed_at, abandoned_at, is_primary |
| `domain_sessions` | Domain Session | attempt_id, domain_id, sequence, status, ends_at, closed_at, close_reason (`early_finish` \| `timer`) |
| `responses` | Response | domain_session_id, item_id, answer, updated_at (upsert); frozen setelah session close |
| `integrity_events` | Integrity Event | attempt_id / session_id, type, ts, meta |
| `result_snapshots` | Result Snapshot | attempt_id, scores JSON, rule_payload, insight, norm_version, rule_set_version, content_version_id, track, frozen_at |
| `norm_samples` | Norm Sample | aggregates, age_band, content_version_id, primary_completed_at; **no PII / no account FK** |
| `report_artifacts` | Report file opsional | attempt_id, storage key PDF, generated_at |

**Invariant (wajib ditegakkan server/RLS/app):**

1. ≤ 1 row `attempts` dengan `status = in_progress` per Participant.  
2. Track & `content_version_id` imutabel setelah insert Attempt.  
3. Response mutasi hanya jika Domain Session masih open (sebelum close + dalam kebijakan Grace Window untuk in-flight).  
4. `is_primary` hanya pada Completed earliest; tidak pindah ke retake.  
5. Norm Sample insert hanya dari Primary Completed, tanpa PII.  
6. Participant hanya baca Attempt/Snapshot milik sendiri (RLS).

### 10.3 Privasi

- Report individual: **private** (RLS).  
- Norm Sample agregat: untuk sains norma; diinformasikan di ToS/Privasi (bukan dark pattern).  
- **Tidak menjual data.**  
- **Account Deletion:** hapus identitas + semua data teridentifikasi (Attempt, Response, Result Snapshot, Report files). Norm Sample yang sudah detached **tetap** (tanpa link Account). Mekanisme: extract-then-delete atau anonymize-in-place — hasil domain sama.  
- Published Norm Version tidak di-unwrite person-by-person saat delete.

---

## 11. Monetisasi

| Fase | Kebijakan |
|------|-----------|
| MVP | **Full gratis** — Profile, indeks, IQ Estimate, Insight, PDF |
| Nanti | TBD setelah validasi — di luar scope build awal |

---

## 12. Arsitektur & stack

| Lapisan | Pilihan |
|---------|---------|
| App | **Next.js** (App Router disarankan) |
| Data / Auth / Storage / AI | **InsForge** (Postgres+RLS, Auth, Storage, OpenRouter gateway) |
| Skor & rule engine | Server-only |

### 12.1 Prinsip teknis

- Kunci API & correct_key Item tidak pernah ke client.  
- Admin client hanya server.  
- `NEXT_PUBLIC_INSFORGE_*` = anon; secrets server terpisah.  

### 12.2 Runner (kontrak)

- Start Domain Session → server set `ends_at` (+ Grace Window policy).  
- Autosave/upsert Response per Item.  
- Close: Early Finish (all answered) **atau** timer+grace partial.  
- Skor Domain pada close; Attempt complete → Result Snapshot + optional Norm Sample.  
- Operasi idempotent untuk close/complete.

---

## 13. Requirement fungsional (FR)

| ID | Requirement | Prioritas |
|----|-------------|-----------|
| FR-01 | Participant daftar/masuk email+password dan Google | P0 |
| FR-02 | Account wajib sebelum create Attempt | P0 |
| FR-03 | Pilih Track `explore` \| `career` (imutabel per Attempt) | P0 |
| FR-04 | Age Band; blokir &lt;18; disclaimer 46+ | P0 |
| FR-05 | Create Attempt pin Content Version + Track; tolak jika Open Attempt ada atau cooldown retake | P0 |
| FR-06 | Sembilan Domain sesuai urutan Content Version | P0 |
| FR-07 | Domain Session timer server-authoritative + Grace Window | P0 |
| FR-08 | Domain Navigation + Response mutabel sampai close; autosave server | P0 |
| FR-09 | Early Finish hanya jika semua Item ber-Response | P0 |
| FR-10 | Timer close: Item tanpa Response = kosong/salah; Attempt tidak auto-abandon | P0 |
| FR-11 | Pause/resume antar Domain Session (satu Open Attempt) | P0 |
| FR-12 | Explicit abandon → Abandoned; tanpa cooldown retake | P0 |
| FR-13 | Setelah 9 Domain: Domain Scores, Ability Profile, Composite Index, IQ Estimate (Norm Version) | P0 |
| FR-14 | Rule Payload + Insight (LLM constrained atau fallback) sesuai Track | P0 |
| FR-15 | Persist Result Snapshot imutabel; Report dashboard + PDF dari snapshot | P0 |
| FR-16 | Primary = first Completed; Retake 1 complete / 90 hari | P0 |
| FR-17 | Norm Sample dari Primary Completed saja (no PII; Age Band; bucket 18–45 vs 46+) | P1 |
| FR-18 | Integrity Event blur/tab + peringatan; tidak auto-gagal | P1 |
| FR-19 | FAQ + disclaimer inspired-by / non-IST | P0 |
| FR-20 | Account Deletion hapus data teridentifikasi; Norm Sample detached tetap | P1 |
| FR-21 | Landing value prop + CTA | P0 |

---

## 14. Requirement non-fungsional (NFR)

| ID | Requirement |
|----|-------------|
| NFR-01 | Mobile responsive (runner usable di HP) |
| NFR-02 | Load runner &lt; ~3s target optimis pada koneksi wajar |
| NFR-03 | Tidak ada correct_key / kunci skor di payload client |
| NFR-04 | RLS: Participant A tidak baca Attempt B |
| NFR-05 | Log error server untuk gagal skor/Insight/snapshot |
| NFR-06 | UI 100% Bahasa Indonesia |
| NFR-07 | PDF legible A4 |
| NFR-08 | Aksesibilitas dasar (label, kontras, focus) |
| NFR-09 | Istilah domain di kode/skema selaras `CONTEXT.md` |

---

## 15. Metrik sukses (pre-revenue)

| Metrik | Definisi |
|--------|----------|
| Activation | % Account → create Attempt |
| Domain completion | % ≥1 Domain Session closed |
| Full completion | % Attempt → Completed |
| Time-to-complete | Distribusi durasi Completed |
| Resume rate | % Open Attempt yang akhirnya Completed |
| PDF download rate | % Completed → unduh PDF |
| Integrity signal rate | Integrity Event / session (observasi, bukan punishment) |
| Qualitative | Feedback “Insight berguna?” |

---

## 16. Roadmap fase

### Fase 0 — Fondasi
- Next.js + InsForge link  
- Auth email + Google  
- Skema + RLS (Attempt, Domain Session, Response, …)  
- Landing + disclaimer  

### Fase 1 — Assessment core
- Content Version + Item Bank MVP 9 Domain  
- Runner: timer, grace, navigasi, early finish, pause/resume, abandon  
- Scoring + Norm Version sintetik v1  

### Fase 2 — Insight & Report
- Career rule set v1 → Rule Payload  
- LLM + fallback → Insight  
- Result Snapshot + dashboard + PDF  
- Primary + Retake Policy  

### Fase 3 — Hardening
- Norm Sample pipeline  
- Integrity Event  
- Account Deletion  
- FAQ, observability, item stats  

### Fase 4+ (post-MVP)
- Re-norm empiris, bank lebih besar, monetisasi, share card, B2B/coach  

---

## 17. Risiko & mitigasi

| Risiko | Mitigasi |
|--------|----------|
| Klaim IST menyesatkan | Copy + FAQ + larangan trademark |
| Dropout tes panjang | Pause antar Domain; Open Attempt tunggal; estimasi jujur |
| IQ Estimate disalahpahami | Label estimasi + norma sementara di Report/PDF |
| Item AI jelek | Review gate; set kecil; Content Version baru |
| LLM mengarang | Rule Payload truth; fallback template |
| Curang ringan | Server score; Integrity Event; tone self-dev |
| Norma sintetik lemah | Badge; Norm Sample; refresh Norm Version |
| Scope creep konten | Cap 8–12 Item/Domain MVP |
| Hasil “berubah” setelah rilis model baru | Result Snapshot imutabel |

---

## 18. Keputusan terbuka (bukan re-grill produk/domain)

- Microcopy final 9 Domain (BI)  
- Exact item count & detik timer per Domain; lebar Grace Window (detik)  
- Isi matriks Career Cluster v1  
- Model OpenRouter konkret  
- Hosting front (InsForge Deployments vs Vercel)  
- Library chart & PDF  
- Representasi teknis pin Content Version (snapshot rows vs version FK + immutable items)  

---

## 19. Acceptance criteria MVP

MVP layak soft-release bila:

1. Participant daftar (email atau Google), pilih Track, create Attempt (pin Content Version), selesaikan **9 Domain** dengan pause/resume dan tepat satu Open Attempt.  
2. Early Finish hanya saat semua Item terjawab; timer+grace menghasilkan partial score tanpa membatalkan Attempt.  
3. Response mutabel dalam Domain Session terbuka; beku setelah close.  
4. Ability Profile + Composite Index + IQ Estimate dari **server**, disclaimer norma sementara.  
5. Insight dari Rule Payload + narasi (atau fallback) sesuai Track; tersimpan di Result Snapshot.  
6. Dashboard + PDF render snapshot; RLS lulus.  
7. Primary + retake 90 hari ditegakkan; Abandoned tidak memicu cooldown.  
8. UI BI; disclaimer bukan IST resmi.  
9. Tidak ada correct_key di network ke client.  
10. (P1) Account Deletion menghapus data teridentifikasi; tidak memutus privasi invariant Norm Sample.

---

## 20. Lampiran A — jejak keputusan grill produk

| # | Topik | Keputusan |
|---|--------|-----------|
| 1 | Legal | Inspired-by (bukan lisensi IST) |
| 2 | Persona pasar | A + B |
| 3 | Dual UX | Dua Track |
| 4 | Lingkup | Full 9 Domain |
| 5 | Sesi | Hybrid pause + timer dalam Domain |
| 6 | Hasil | Profile + indeks + IQ Estimate |
| 7 | Norma | Sintetik dulu |
| 8 | Insight | Hybrid rule + LLM |
| 9 | Monetisasi | Full gratis pre-revenue |
| 10 | Auth gate | Account sebelum Attempt |
| 11 | Bahasa UI | 100% BI |
| 12 | Item | AI + reviewer; set kecil |
| 13 | Report | Web + PDF |
| 14 | Usia | 18–45 fokus; 46+ disclaimer |
| 15 | Retake | 1× / 90 hari |
| 16 | Stack | Next.js + InsForge |
| 17 | Integritas | Ringan, server-authoritative |
| 18 | Login | Email/password + Google |
| 19 | Domain naming | Setara klasik + FAQ |
| 20 | Privasi | Agregat + Account Deletion |
| 21 | Visual | Lab tenang + aksen hangat |

---

## 21. Lampiran B — jejak keputusan domain (grill-with-docs)

| ADR | Keputusan |
|-----|-----------|
| 0001 | Inspired-by, not licensed IST |
| 0002 | Next.js + InsForge |
| 0003 | Attempt hybrid Domain Sessions |
| 0004 | Profile + Composite + IQ Estimate, synthetic norms |
| 0005 | Rule Payload truth; LLM narrates |
| 0006 | Single Open Attempt; only Completed cools retake |
| 0007 | Timer + Grace Window; missing Response = empty |
| 0008 | Track immutable per Attempt |
| 0009 | Response mutable until Domain Session closes |
| 0010 | Content Version pinned per Attempt |
| 0011 | Norm Sample = Primary Completed only; 18–45 core |
| 0012 | Result Snapshot immutable; Score Correction escape hatch |
| 0013 | Early Finish requires complete Responses |
| 0014 | Fixed Domain order per Content Version |
| 0015 | Account Deletion keeps detached Norm Samples |

---

*PRD v1.1 adalah sumber kebenaran **scope produk** yang sudah diselaraskan dengan domain model. Coding menunggu **approval eksplisit** Product Owner. Perubahan material → update PRD + CONTEXT/ADR terkait dulu.*
