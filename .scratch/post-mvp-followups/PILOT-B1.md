# B1 — Protokol pilot internal (Item Bank v2)

**Tujuan:** menangkap soal membingungkan, kunci diragukan, atau microcopy sebelum soft-launch publik.  
**Bank aktif:** `cv_mvp_v2` (9 × 8 = 72 item)  
**Bukan:** kalibrasi IRT / re-norm empiris (itu B5).

---

## Siapa & berapa

| Peran | Jumlah saran | Catatan |
|-------|--------------|---------|
| Pilot internal | 3–8 orang | 18–45 (+ opsional 46+ dengan disclaimer) |
| Reviewer konten | 1–2 | Cek kunci + wording tanpa “mengerjakan penuh” |

Hindari orang yang sudah melihat file `content/v2/*` (bocoran kunci).

---

## Skrip singkat (ke peserta pilot)

> IQ-Lab adalah asesmen multi-domain untuk pengembangan diri, **bukan** tes IST resmi / rekrutmen / klinis.  
> Kerjakan jujur, tanpa kalkulator. Boleh jeda **antar** domain.  
> Setelah selesai, isi formulir umpan balik singkat (bukan skor “lulus/gagal”).

---

## Alur teknis

1. Akun baru (email) atau Google jika A1 OK.  
2. Age Band → Track (catat track yang dipilih).  
3. Selesaikan **minimal 3 domain** (ideal: full 9).  
4. Unduh PDF / lihat hasil — cek disclaimer terbaca.  
5. Isi form umpan balik (template di bawah).  
6. Reviewer rekap ke `PILOT-LOG.md` (salin baris temuan).

---

## Form umpan balik (salin per peserta)

```
Peserta: ________  Tanggal: ________  Track: explore / career
Device: desktop / mobile   Browser: ________
Domain diselesaikan: ___ / 9

1. Instruksi domain mana yang paling membingungkan?
2. Soal mana yang terasa ambigu / multi-kunci? (domain + nomor kira-kira)
3. Figural/spasial teks — cukup jelas? (1–5)
4. Memori (materi tetap di layar) — terasa adil? (1–5)
5. Timer — terlalu ketat / longgar di domain mana?
6. Waktu total terasa: <60 / 60–90 / >90 menit
7. Lainnya:
```

---

## Kriteria eskalasi → revisi bank

| Severity | Contoh | Aksi |
|----------|--------|------|
| **P0** | Kunci salah / 2 opsi sama benar | Hotfix item + catat di PILOT-LOG; pertimbangkan `cv_mvp_v3` jika sudah banyak attempt pin v2 |
| **P1** | Stem ambigu, opsi tumpang tindih | Revisi wording |
| **P2** | Microcopy domain kurang jelas | Touch `domain-specs.ts` (B2) |
| **P3** | Preferensi gaya / sulit subjektif | Backlog B4/B5 |

**Aturan pin:** Attempt lama tetap di Content Version yang di-pin. Perbaikan besar item → **Content Version baru**.

---

## Review desk (agent + manusia) — 2026-07-18

Lihat `PILOT-LOG.md` untuk temuan putaran 1 (desk review).

### Checklist reviewer (tanpa peserta)

- [ ] Tiap domain 8 item, 4 opsi, satu kunci  
- [ ] Distribusi kunci a–d seimbang  
- [ ] Tidak ada “Soal latihan MVP”  
- [ ] Instruksi domain BI jelas (B2)  
- [ ] Numerik dihitung ulang  
- [ ] Logika: hanya premis  

---

## Setelah pilot

1. Agregasi P0/P1 di `PILOT-LOG.md`  
2. Terapkan revisi di `content/v2/` atau bump v3  
3. `npm test` (key-balance + boundary)  
4. Update BACKLOG B1 status  
