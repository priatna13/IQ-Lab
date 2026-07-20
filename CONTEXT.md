# IQ-Lab

Asesmen kognitif multi-domain untuk pengembangan diri dan arah karir. Bahasa di dokumen ini adalah ubiquitous language produk — dipakai di PRD, kode, dan UI (UI tetap Bahasa Indonesia; istilah English di sini adalah nama konsep kanonik).

## Language

### Identitas & akses

**Participant**:
Orang yang mendaftar dan mengerjakan asesmen untuk dirinya sendiri.
_Avoid_: User (terlalu generik di diskusi domain), Customer, Client, Peserta-as-role-system

**Account**:
Identitas autentikasi Participant (email/password atau Google OAuth) yang wajib ada sebelum asesmen dimulai.
_Avoid_: Profile-as-login, Member

**Account Deletion**:
Proses menghapus identitas Account dan semua data teridentifikasi milik Participant (Attempt, Response, Result Snapshot, Skill Attempt / Skill Result Snapshot, Report files, dll.). Norm Sample yang sudah terpisah/agregat **tetap** untuk sains norma dan **bukan** lagi milik Participant (tidak ada link Account/PII). Mekanisme teknis boleh cascade delete + extract, atau anonymize-in-place; hasil domain sama.
_Avoid_: Full erasure of published norm statistics, Refuse delete if completed

**Age Band**:
Kelompok usia Participant yang menentukan kelayakan dan disclaimer (di bawah 18 ditolak; 18–45 inti; 46+ diizinkan dengan disclaimer).
_Avoid_: Age group longgar tanpa policy

### Arah asesmen

**Track**:
Jalur framing onboarding dan laporan (`explore` = Jelajahi potensi, `career` = Rancang langkah karir). Item asesmen sama; yang berbeda framing, action plan, dan narasi. **Dipilih saat Attempt dibuat dan imutabel** untuk Attempt itu; mengganti track berarti Abandoned Attempt lalu Open Attempt baru (jika Retake Policy mengizinkan).
_Avoid_: Persona (persona = segmen pasar, bukan entitas runtime), Mode, Path, Program, Reframe-in-place (bukan MVP)

**Assessment**:
Produk asesmen multi-domain IQ-Lab secara keseluruhan (kerangka 9 Domain + aturan skor), bukan satu kali pengerjaan.
_Avoid_: Test (membingungkan dengan “ujian resmi”), IST, IQ test sebagai nama produk formal

### Struktur konten

**Domain**:
Satu area kemampuan dalam profil multi-faktor (sembilan area setara konsep asesmen struktur klasik; label tampilan milik IQ-Lab).
_Avoid_: Subtest (istilah tes berlisensi), Category longgar, menyamakan Domain dengan Field skill (Field = lapisan keahlian pasca-asesmen, bukan Domain ke-10)

**Item**:
Satu soal dalam Domain, original IQ-Lab, punya kunci dan metadata kesulitan.
_Avoid_: Question di model domain (boleh di copy UI: “soal”), Problem

**Item Bank**:
Kumpulan Item per Domain yang ber-versioning; MVP memakai set kecil per Domain.
_Avoid_: Question pool tanpa versioning

**Content Version**:
Versi Item Bank **dan urutan Domain** yang dipin pada saat Attempt dibuat dan dipakai seluruh Domain Session Attempt itu. Dalam satu Content Version urutan Domain **tetap** (fixed sequence). Perbaikan item/urutan hanya lewat Content Version baru; tidak mengubah Open Attempt yang sudah pin versi lama. Pengacakan urutan per Attempt bukan MVP.
_Avoid_: Live bank mid-attempt, Mixed-version attempt, Participant-chosen domain order

### Pengerjaan

**Attempt**:
Satu siklus pengerjaan Assessment oleh satu Participant, terikat **satu Track tetap** dan **satu Content Version** (pin saat create). Status kanonik: `in_progress` | `completed` | `abandoned`. Insight dan Report mengikuti Track Attempt; tidak ada ganti track di tengah atau reframe track pada Completed Attempt di MVP.
_Avoid_: Session (dipakai lebih sempit), Test run, Exam

**Open Attempt**:
Attempt berstatus `in_progress`. Paling banyak **satu** Open Attempt per Participant; resume selalu ke Attempt itu, bukan membuat Attempt baru.
_Avoid_: Active test longgar, Draft attempt

**Completed Attempt**:
Attempt yang Domain Sessions-nya sembilan-sembilan selesai dan skor + Insight sudah dihasilkan. Hanya Completed Attempt yang memicu cooldown Retake Policy.
_Avoid_: Finished-as-partial, Submitted tanpa sembilan Domain

**Abandoned Attempt**:
Attempt yang dihentikan eksplisit oleh Participant sebelum sembilan Domain selesai. Tidak menghasilkan Report lengkap; **tidak** memicu cooldown retake; Response yang sudah ada boleh tetap tersimpan untuk audit/internal, bukan sebagai Primary.
_Avoid_: Failed, Invalidated, Disqualified

**Primary Attempt**:
Completed Attempt **pertama** (by completed_at) milik Participant; sumber skor, Insight, dan kontribusi norma individu yang ditampilkan sebagai hasil utama.
_Avoid_: Best attempt, Official score (terkesan sertifikasi)

**Domain Session**:
Pengerjaan satu Domain di dalam sebuah Attempt; timer **server-authoritative**. Pause diizinkan **antar** Domain Session. Session ditutup lewat: (1) **Early Finish** — hanya jika setiap Item domain sudah punya Response di server, atau (2) **timer + Grace Window** — partial diizinkan, Item tanpa Response = kosong/salah. Sisa waktu tidak ditabung ke domain lain. Tidak mengulang Domain; tidak auto-abandon Attempt.
_Avoid_: Subtest session, Round, Expired-as-retry-domain, Bank waktu antar domain

**Early Finish**:
Aksi Participant menutup Domain Session sebelum `ends_at`, diizinkan **hanya** bila semua Item pada domain itu sudah ber-Response di server. Setelah itu Response beku seperti penutupan lainnya.
_Avoid_: Early finish with blanks, Skip domain empty

**Grace Window**:
Selang pendek setelah `ends_at` Domain Session (order of tens of seconds) hanya untuk menampung Response yang masih in-flight di jaringan; bukan perpanjangan waktu mengerjakan Item baru.
_Avoid_: Extra time, Bonus minutes, Full retake window

**Response**:
Jawaban Participant untuk satu Item dalam Domain Session; di-persist ke server (autosave / update) dan **boleh diubah** selama Domain Session masih terbuka dan timer+grace belum menutup session. Yang dinilai adalah **jawaban terakhir** per Item yang diterima server saat Domain Session close. Setelah close, Response **beku** (immutable).
_Avoid_: Answer-as-entity-name di kode campuran, One-way commit per item (bukan MVP), Submission sebagai entitas terpisah

**Domain Navigation**:
Di dalam Domain Session yang terbuka, Participant boleh berpindah antar Item domain itu (maju/mundur) sampai session ditutup. Tidak berlaku lintas Domain (Domain yang sudah closed tidak dibuka lagi di MVP).
_Avoid_: Cross-domain review mid-attempt, Post-close edit

### Hasil

**Domain Score**:
Skor terstandar untuk satu Domain pada sebuah Attempt.
_Avoid_: IQ per subtest, Grade

**Ability Profile**:
Kumpulan Domain Score yang membentuk gambaran kekuatan dan kelemahan.
_Avoid_: Radar saja sebagai konsep, Report (report = artefak penyajian)

**Composite Index**:
Indeks agregat multi-domain (bukan label “IQ”).
_Avoid_: General IQ, Total score tanpa definisi

**IQ Estimate**:
Estimasi setara skala IQ dari norma internal IQ-Lab; selalu berstatus estimasi / norma sementara sampai re-norm empiris.
_Avoid_: IQ score, Official IQ, Full Scale IQ

**Norm Version**:
Versi parameter norma yang dipakai men-transform raw score menjadi Domain Score, Composite Index, dan IQ Estimate.
_Avoid_: Benchmark generik

**Norm Sample**:
Unit data agregat (tanpa PII) untuk menyusun/memperbarui norma empiris: diambil **hanya dari Primary Attempt yang Completed**. Menyimpan raw/domain aggregates + **Age Band** + Content Version (+ metadata minim). Abandoned dan Completed non-primary tidak masuk sample. Norma inti v1 empiris memakai bucket **18–45**; **46+** disimpan terpisah dan tidak mencampur norma inti (atau diabaikan untuk v1 empiris).
_Avoid_: All attempts in norms, PII in norm tables, Auto-exclude by integrity threshold (bukan MVP)

### Insight karir

**Career Cluster**:
Kelompok bidang/arah kerja yang diusulkan rule engine dari Ability Profile.
_Avoid_: Job title pasti, Jabatan recommended sebagai fakta

**Rule Payload**:
Keluaran terstruktur rule engine (cluster, kekuatan, area kembangkan, prioritas skill) sebelum dinarasikan.
_Avoid_: AI opinion, Prompt output mentah sebagai truth

**Insight**:
Narasi dan action plan yang disajikan ke Participant; dibangun dari Rule Payload + (opsional) narasi LLM terbatasi, dengan fallback template. Pada Completed Attempt, Insight **di-snapshot dan imutabel** di MVP (bukan regenerate otomatis saat model/template membaik).
_Avoid_: Diagnosis, Rekomendasi klinis, Hasil psikotes resmi, Live-refresh narrative

**Result Snapshot**:
Rekaman beku saat Attempt completed: Domain Scores, Ability Profile, Composite Index, IQ Estimate, Norm Version, Rule Payload (+ version), Insight prose, Track, Content Version. Sumber kebenaran dashboard dan PDF. **Tidak** memuat skor Skill Assessment (lapisan terpisah).
_Avoid_: Live recompute on view, Mutable historical scores

**Report**:
Artefak penyajian (dashboard dan/atau PDF) yang **hanya merender** Result Snapshot + disclaimer. PDF boleh di-generate ulang sebagai file, selama isinya setara snapshot. Ringkasan keahlian di UI `/hasil` merender Skill Result Snapshot terpisah, bukan bagian PDF kognitif MVP.
_Avoid_: Certificate, Sertifikat, Re-scored report as default

**Score Correction**:
Proses luar-jalur (bukan fitur Participant) untuk memperbaiki Result Snapshot hanya bila ada bug perhitungan terbukti; bukan untuk “insight lebih bagus” atau Norma baru.
_Avoid_: User-facing rescore, Silent rewrite without audit

### Keahlian bidang (lapisan paralel)

**Skill Assessment**:
Lapisan opsional **setelah** Completed Attempt 9 domain: Participant memilih Field kerja, mengerjakan paket MCQ keahlian, mendapat skor + Domain Alignment vs Ability Profile beku. Tidak mengubah Composite Index, IQ Estimate, atau Norm Sample.
_Avoid_: Domain ke-10, Job certification, Certified skill score

**Field** / **Field Category**:
Role/bidang kerja (15 Field dalam 5 kategori: mis. Teknologi & Produk, Bisnis & Keuangan). Dipilih Participant; rekomendasi dari profil bersifat saran, bukan paksaan.
_Avoid_: Job title pastikan lolos rekrutmen, Domain id sebagai nama field

**Skill Content Version**:
Versi bank soal keahlian (pack per Field) yang dipin pada Skill Attempt; independen dari Content Version asesmen 9 domain.
_Avoid_: Live edit pack mid skill-attempt

**Skill Attempt**:
Satu siklus pengerjaan pack keahlian untuk satu Field, terikat `source_attempt_id` ke Completed Attempt kognitif. Status: `in_progress` | `completed` | `abandoned`. Boleh beberapa Field per source Attempt.
_Avoid_: Mixing skill items into Domain Session, Skill as retake of cognitive Attempt

**Skill Result Snapshot**:
Rekaman beku skor keahlian, Domain Alignment, dan insight prose skill saat Skill Attempt completed. Sumber kebenaran halaman hasil keahlian dan ringkasan di `/hasil`.
_Avoid_: Merging into cognitive Result Snapshot, Live re-score on view

**Domain Alignment**:
Perbandingan skor skill vs rata-rata Domain terkait Field (dari Ability Profile beku): mis. selaras, potensi belum terampil, pengalaman mengompensasi, perlu penguatan ganda.
_Avoid_: Clinical diagnosis, Hire/no-hire signal

### Integritas & kebijakan

**Integrity Event**:
Catatan perilaku sesi yang relevan (mis. blur/tab switch) untuk kualitas data; tidak otomatis membatalkan Attempt di MVP.
_Avoid_: Cheat flag as disqualification, Proctoring incident

**Retake Policy**:
Aturan jarak antar **Completed Attempt** (MVP: paling banyak satu completion per 90 hari). Abandoned tidak mengonsumsi kuota. Saat cooldown aktif, Participant tetap dapat melihat Report Primary/Completed sebelumnya; tidak boleh memulai Open Attempt baru. Completed setelah cooldown **bukan** Primary dan **bukan** Norm Sample.
_Avoid_: Unlimited practice as scored attempt
