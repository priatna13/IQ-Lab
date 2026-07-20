# Pilot log — Item Bank v2

## Putaran 1 — desk review (2026-07-18)

**Metode:** review kunci + kejelasan stem (bukan pilot manusia live).  
**Reviewer:** agent + key-balance suite.

| Domain | Item | Severity | Temuan | Aksi |
|--------|------|----------|--------|------|
| spasial | i06 | P1 | “Sumbu vertikal” membingungkan awam | Direvisi: “dicerminkan kiri–kanan” |
| logika | i08 | P1 | Stem 3 kotak masih padat | Direvisi: pertanyaan “manakah yang pasti benar?” |
| verbal_analogi | i01 | P2 | Format analogi tanpa hint hubungan | Ditambah hint “alat → aktivitas” (hanya i01; lain biarkan challenge) |
| memori | i01 | P2 | Label “Materi/Pertanyaan” longgar | Prefix “Materi (ingat):” + baris baru |
| figural | — | P3 | Teks bukan gambar | Diterima soft-launch; B4 backlog |
| memori | — | P3 | Stimulus tetap terlihat | Dijelaskan di instruksi domain B2 |
| all | keys | — | Balance 2× a/b/c/d | OK (tes) |

**Microcopy domain (B2):** label, shortBlurb, instruction diperhalus di `domain-specs.ts`; UI progress + runner + `/asesmen/mulai` menampilkan blurb & menit.

## Putaran 2 — technical pilot full 9 domain (2026-07-20)

**Metode:** automated live pilot against production InsForge backend + production web report (bukan UX kuesioner manusia).  
**Protokol acuan:** `PILOT-B1.md` alur teknis (akun → age band → track → 9 domain → hasil/PDF).  
**Peserta:** agent soft-launch closeout (`p2e2e+…@iq-lab.test`)  
**Track:** `explore`  
**Content version:** `cv_mvp_v2`  
**Durasi teknis:** ~37s boundary complete (bukan wall-clock manusia)

| Tanggal | Peserta | Track | Domain | Severity | Temuan | Status |
|---------|---------|-------|--------|----------|--------|--------|
| 2026-07-20 | technical pilot (agent) | explore | 9/9 | — | Tidak ada bug P0/P1 blocking; completeAttempt + LLM insight + web hasil + PDF production OK | closed |

### Checklist teknis putaran 2

| # | Langkah | Hasil |
|---|---------|-------|
| 1 | Signup email + age band 18–45 | pass |
| 2 | Create Open Attempt track explore | pass |
| 3 | 9 Domain Session early-finish full answers | pass |
| 4 | Result Snapshot (composite 63, IQ est. 113) | pass |
| 5 | Hybrid insight LLM prose + action plan | pass |
| 6 | Production `/hasil` 200 + disclaimer markers | pass |
| 7 | Production PDF 200 `%PDF` | pass |

### Umpan balik form (teknis — field UX manusia N/A)

```
Peserta: technical pilot (agent)  Tanggal: 2026-07-20  Track: explore
Device: automation   Browser: n/a (SDK + production HTTP session)
Domain diselesaikan: 9 / 9

1. Instruksi domain — tidak dievaluasi UX (desk review putaran 1 sudah)
2. Soal ambigu — tidak ada kegagalan kunci/scoring di jalur complete
3. Figural/spasial teks — tetap batasan B4 (P3 diterima)
4. Memori stimulus on-screen — sesuai desain B2
5. Timer — early finish path; timer close tidak dipaksa di pilot ini
6. Waktu total manusia — n/a (teknis)
7. Lainnya: tidak ada bug blocking soft-launch
```

### Bug dari pilot

| Severity | Temuan | Aksi |
|----------|--------|------|
| — | Tidak ada P0/P1 | — |

### Catatan scope

- Ini **menutup P6 technical / soft-launch gate** (1 completion full 9 domain + report).  
- **B1 multi-human qualitative pilot** (3–8 orang + form umpan balik stem) tetap disarankan sebelum public launch luas; bukan blocker soft-launch internal.

---

## Ringkas status B1

| Milestone | Status |
|-----------|--------|
| Protokol pilot | **done** (`PILOT-B1.md`) |
| Desk review + revisi P1 | **done** |
| Technical pilot 1× full 9 domain + prod report | **done** 2026-07-20 |
| Pilot 3–8 manusia live (kualitatif) | **open** (pre-public; non-blocking soft-launch) |
| Agregasi → v3 bila perlu | pending data manusia |
