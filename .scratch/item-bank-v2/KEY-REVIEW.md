# Human review — kunci & item `cv_mvp_v2`

**Tanggal:** 2026-07-18  
**Scope:** 9 Domain × 8 Item (72)

## Ringkasan temuan

| Severity | Temuan | Tindakan |
|----------|--------|----------|
| **Kritis** | Domain `praktis`: **semua** `correctKey = b` (bisa digaming) | Acak ulang posisi pilihan |
| **Kritis** | Domain `spasial`: 7/8 kunci di `b` | Acak ulang |
| **Tinggi** | Beberapa domain hampir tanpa kunci `a`/`d` | Redistribusi pilihan |
| **Tinggi** | `logika` i06: puzzle 3 kotak **tidak lengkap** → ambigu | Ganti item |
| **Sedang** | `figural` i05: klaim “rotasi” N↔Z lemah | Ubah stem “bergantian” |
| **Sedang** | `figural` i07: notasi grid membingungkan | Perjelas stem |
| **Sedang** | `spasial` i01: “sisi depan” tautologis/lemah | Ganti item |
| **Sedang** | `spasial` i08: lipat kertas terlalu samar | Ganti item konkret |
| **Rendah** | `verbal_analogi` i04: “Hasil/pelaksanaan” longgar | Perketat pilihan |
| **Rendah** | `verbal_pemahaman` i01: “Hemat daya guna” kaku | Perhalus sinomin |

## Verifikasi numerik (kunci lama)

| Domain | Item | Hitung | Key | OK? |
|--------|------|--------|-----|-----|
| numerik_operasi | 01–08 | 42,12,50,60,60k,10,30k,60L | b,c,b,c,c,b,c,c | ✓ math |
| numerik_pola | 01–08 | +2,×2,+3..,+1 Fibonacci, kuadrat, +1..+5, −3/+4 | … | ✓ math |
| logika | 02 | modus tollens | b | ✓ |
| logika | 08 | D-A-B-C | a | ✓ |
| spasial | 02 | ↑ +90° CW = → | b | ✓ |
| spasial | 05 | hadap utara → timur di kanan | b | ✓ |

## Distribusi kunci (sebelum revisi)

| Domain | a | b | c | d |
|--------|---|---|---|---|
| verbal_pemahaman | 2 | 4 | 2 | 0 |
| verbal_analogi | 3 | 5 | 0 | 0 |
| numerik_operasi | 0 | 3 | 5 | 0 |
| numerik_pola | 0 | 2 | 5 | 1 |
| figural | 2 | 5 | 1 | 0 |
| spasial | 0 | **7** | 1 | 0 |
| memori | 0 | 3 | 5 | 0 |
| logika | 3 | 5 | 0 | 0 |
| praktis | 0 | **8** | 0 | 0 |

**Target setelah revisi:** tiap domain ~2 per opsi (a/b/c/d), deviasi ≤1.

## Setelah revisi

| Domain | Perubahan utama |
|--------|-----------------|
| verbal_pemahaman | Sinonim efisien diperjelas; kunci seimbang a–d |
| verbal_analogi | “Hasil/pelaksanaan” → “Implementasi / pelaksanaan”; kunci seimbang |
| numerik_operasi | Math OK; pilihan diacak ke a–d |
| numerik_pola | Petunjuk pola di stem (kurangi multi-kunci); kunci seimbang |
| figural | i05 “rotasi” → bergantian; i07 baris diperjelas |
| spasial | i01 diganti (panah/rotasi); i05 meja+arah; i06 cermin `b`→`d`; i08 lipat 1× = 2 lubang |
| memori | Variasi pertanyaan; i08 urutan rak eksplisit |
| logika | Puzzle kotak disederhanakan (hanya “bukan hanya apel”); kunci seimbang |
| praktis | **Tidak lagi semua-b**; kunci 2× a/b/c/d |

**Distribusi kunci per domain sekarang:** `{ a: 2, b: 2, c: 2, d: 2 }` (dijaga tes `key-balance.test.ts`).

## Status

- [x] Review selesai  
- [x] Revisi diterapkan di `src/domain/assessment/content/v2/*`  
- [x] Tes distribusi kunci ditambahkan (51 tests pass)  
