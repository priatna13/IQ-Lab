# IQ-Lab — Soal Asesmen Keahlian Berdasarkan Bidang Kerja

Dokumen ini berisi kumpulan soal asesmen keahlian yang dapat digunakan **setelah** pengguna menyelesaikan asesmen multi-domain dan mendapatkan profil kekuatan mereka.

**Alur yang disarankan:**
1. User menyelesaikan 9 domain → mendapat profil + Estimasi.
2. Sistem merekomendasikan 1–3 bidang kerja yang paling sesuai dengan kekuatan domain.
3. User diarahkan ke paket soal keahlian spesifik bidang tersebut.
4. Hasil soal keahlian digabung dengan profil domain untuk memberikan insight yang lebih actionable.

---

## 1. IT / Software Developer / Programmer

**Domain yang paling relevan:** Logika, Pola, Numerik, Spasial, Memori

### Soal

**1.** Sebuah fungsi menerima array angka. Bagaimana cara paling efisien untuk mencari dua angka yang jumlahnya sama dengan target tertentu?
- A. Nested loop (O(n²))
- B. Sorting + Two Pointers
- C. Hash Map (O(n))
- D. Binary Search berulang

**2.** Apa output dari kode berikut?
```js
let a = [1, 2, 3];
let b = a;
b.push(4);
console.log(a);
```
- A. [1, 2, 3]
- B. [1, 2, 3, 4]
- C. Error
- D. undefined

**3.** Manakah yang merupakan contoh **time complexity** terbaik untuk mencari elemen dalam data yang sudah terurut?
- A. O(n)
- B. O(log n)
- C. O(n log n)
- D. O(1)

**4.** Dalam konteks database, apa perbedaan utama antara `INNER JOIN` dan `LEFT JOIN`?

**5.** Sebuah aplikasi mengalami memory leak. Langkah debugging pertama yang paling masuk akal adalah?
- A. Langsung menambah RAM server
- B. Mengecek apakah ada event listener atau subscription yang tidak di-unsubscribe
- C. Rewrite seluruh kode
- D. Mengganti framework

**6.** Apa yang dimaksud dengan “idempotent” dalam konteks API?

**7.** Manakah struktur data yang paling cocok untuk implementasi Undo/Redo?
- A. Queue
- B. Stack
- C. Linked List biasa
- D. Hash Table

---

## 2. Akuntansi & Finance

**Domain yang paling relevan:** Numerik, Logika, Memori, Praktis

### Soal

**1.** Sebuah perusahaan membeli aset senilai Rp120.000.000 dengan estimasi masa manfaat 5 tahun dan nilai sisa Rp20.000.000. Berapa beban depresiasi per tahun menggunakan metode garis lurus?

**2.** Apa perbedaan mendasar antara **Accrual Basis** dan **Cash Basis**?

**3.** Jurnal yang tepat saat perusahaan menerima pelunasan piutang sebesar Rp15.000.000 adalah:
- A. Debit Kas, Kredit Pendapatan
- B. Debit Kas, Kredit Piutang
- C. Debit Piutang, Kredit Kas
- D. Debit Beban, Kredit Kas

**4.** Current Ratio sebuah perusahaan adalah 1,8. Apa arti dari angka tersebut?

**5.** Sebuah transaksi pembelian barang secara kredit senilai Rp50.000.000 belum dicatat. Apa dampaknya terhadap laporan keuangan jika tidak dikoreksi?

**6.** Apa yang dimaksud dengan **Break Even Point**? Bagaimana cara menghitungnya secara sederhana?

**7.** Manakah yang termasuk dalam kategori **Aset Lancar**?
- A. Tanah
- B. Gedung
- C. Persediaan barang dagang
- D. Mesin produksi

---

## 3. Data Analyst / Business Intelligence

**Domain yang paling relevan:** Numerik, Pola, Logika, Praktis

### Soal

**1.** Dari data penjualan bulanan, kamu melihat tren naik di Q1–Q3 lalu turun drastis di Q4. Pertanyaan analisis pertama yang harus diajukan adalah?

**2.** Apa perbedaan antara **Correlation** dan **Causation**? Berikan contoh sederhana.

**3.** Kamu diminta membuat dashboard. Metrik mana yang lebih penting untuk ditampilkan di halaman utama?
- A. Semua data mentah
- B. KPI utama + tren + anomaly
- C. Hanya grafik yang indah
- D. Tabel lengkap tanpa filter

**4.** Sebuah query menghasilkan hasil yang sangat lambat. Langkah optimasi pertama yang paling masuk akal?

**5.** Apa arti dari outlier dalam dataset? Kapan outlier boleh dihapus dan kapan harus dipertahankan?

**6.** Jelaskan secara singkat perbedaan antara **SQL** dan **NoSQL** serta kapan lebih baik menggunakan salah satunya.

**7.** Kamu menemukan bahwa dua variabel memiliki korelasi 0,92. Apakah ini berarti salah satu menyebabkan yang lain? Jelaskan.

---

## 4. Digital Marketing / Performance Marketing

**Domain yang paling relevan:** Numerik, Logika, Praktis, Verbal

### Soal

**1.** Sebuah campaign memiliki:
- Spend: Rp10.000.000
- Hasil penjualan: Rp45.000.000
- Berapa ROAS-nya?

**2.** Apa perbedaan utama antara **CPC**, **CPM**, dan **CPA**?

**3.** CTR sebuah iklan turun signifikan dalam 3 hari terakhir. Apa saja kemungkinan penyebabnya? (Minimal 3)

**4.** Manakah yang lebih penting untuk dievaluasi dalam jangka panjang?
- A. CTR tinggi
- B. Conversion Rate + Customer Lifetime Value
- C. Jumlah like dan komentar
- D. Biaya iklan serendah mungkin

**5.** Apa yang dimaksud dengan **A/B Testing**? Berikan contoh penerapan di iklan digital.

**6.** Sebuah landing page memiliki bounce rate 78%. Apa langkah pertama yang sebaiknya dilakukan?

**7.** Jelaskan perbedaan antara **Remarketing** dan **Retargeting**.

---

## 5. UI/UX Designer

**Domain yang paling relevan:** Spasial, Figural, Pola, Praktis, Verbal

### Soal

**1.** Apa perbedaan fundamental antara **UI** dan **UX**?

**2.** Sebuah tombol CTA berwarna abu-abu muda di atas background putih. Masalah utama dari desain ini adalah?

**3.** Manakah prinsip yang dilanggar jika user harus mengisi formulir yang sangat panjang tanpa progress indicator?
- A. Consistency
- B. Visibility of system status
- C. Error prevention
- D. Aesthetic only

**4.** Apa yang dimaksud dengan **Fitts’s Law**? Bagaimana penerapannya dalam desain tombol?

**5.** Kamu diminta memperbaiki conversion rate sebuah halaman checkout. Dari sisi UX, apa saja yang biasanya menjadi penyebab utama user meninggalkan halaman?

**6.** Jelaskan perbedaan antara **User Flow** dan **User Journey**.

**7.** Mengapa white space (ruang kosong) penting dalam desain antarmuka?

---

## 6. Project Manager / Product Manager

**Domain yang paling relevan:** Logika, Praktis, Verbal, Memori

### Soal

**1.** Apa perbedaan utama antara **Waterfall** dan **Agile**?

**2.** Sebuah proyek mengalami delay karena satu tim saling menunggu hasil kerja tim lain. Istilah yang tepat untuk masalah ini adalah?
- A. Scope Creep
- B. Bottleneck / Dependency issue
- C. Resource Overallocation
- D. Poor communication saja

**3.** Apa yang dimaksud dengan **MVP** (Minimum Viable Product)? Mengapa penting?

**4.** Seorang stakeholder meminta fitur tambahan di tengah sprint. Bagaimana cara yang baik untuk menanganinya?

**5.** Manakah yang lebih baik sebagai indikator keberhasilan proyek?
- A. Semua task selesai tepat waktu
- B. Produk memberikan value yang diharapkan user/stakeholder
- C. Budget tidak terlampaui
- D. Tim terlihat sibuk

**6.** Apa fungsi utama dari **RACI Matrix**?

**7.** Jelaskan singkat apa itu **Risk Management** dalam pengelolaan proyek.

---

## 7. Human Resources / People Development

**Domain yang paling relevan:** Verbal, Praktis, Logika, Memori

### Soal

**1.** Apa perbedaan antara **Recruitment** dan **Selection**?

**2.** Seorang karyawan berkinerja tinggi tiba-tiba produktivitasnya menurun drastis. Langkah pertama yang paling tepat sebagai HR adalah?

**3.** Apa yang dimaksud dengan **Competency-Based Interview**?

**4.** Manakah yang termasuk dalam **Intrinsic Motivation**?
- A. Bonus tahunan
- B. Kenaikan gaji
- C. Rasa pencapaian dan pengakuan
- D. Tunjangan jabatan

**5.** Mengapa exit interview penting dilakukan?

**6.** Apa perbedaan antara **Training** dan **Development**?

**7.** Bagaimana cara mengukur efektivitas sebuah program pelatihan?

---

## 8. Pelatih / Coach (Olahraga atau Soft Skill)

**Domain yang paling relevan:** Praktis, Verbal, Logika, Memori, Spasial (untuk olahraga)

### Soal

**1.** Apa perbedaan utama antara **Coaching** dan **Mentoring**?

**2.** Seorang atlet/coachee mengalami plateau (stagnasi performa). Apa pendekatan yang biasanya dilakukan coach yang baik?

**3.** Mengapa penting membuat **tujuan yang SMART** dalam proses coaching?

**4.** Apa yang dimaksud dengan **Growth Mindset**? Bagaimana cara menumbuhkannya pada coachee?

**5.** Dalam sesi coaching, kapan coach sebaiknya lebih banyak bertanya daripada memberi instruksi langsung?

**6.** Seorang coachee terus mengulang kesalahan yang sama. Langkah apa yang sebaiknya diambil?

**7.** Bagaimana cara mengukur keberhasilan sebuah proses coaching?

---

## 9. Sales / Business Development

**Domain yang paling relevan:** Verbal, Praktis, Logika, Numerik

### Soal

**1.** Apa perbedaan antara **Feature** dan **Benefit** saat melakukan presentasi produk?

**2.** Seorang prospek bilang “Harganya terlalu mahal”. Respon yang paling baik adalah?

**3.** Apa yang dimaksud dengan **SPIN Selling**?

**4.** Mengapa follow-up penting dalam proses penjualan? Berapa kali idealnya melakukan follow-up?

**5.** Manakah yang lebih penting dalam jangka panjang?
- A. Closing sebanyak-banyaknya di bulan ini
- B. Membangun relationship dan trust
- C. Memberikan diskon besar
- D. Memaksa prospek segera memutuskan

**6.** Apa itu **Pipeline** dalam sales? Mengapa harus dikelola dengan baik?

**7.** Bagaimana cara menangani penolakan (objection handling) secara efektif?

---

## 10. Guru / Pendidikan / Educator

**Domain yang paling relevan:** Verbal, Praktis, Memori, Logika

### Soal

**1.** Apa perbedaan utama antara **Teaching** dan **Facilitating Learning**?

**2.** Seorang siswa terus-menerus mengganggu di kelas. Pendekatan mana yang biasanya lebih efektif dalam jangka panjang?
- A. Langsung menghukum di depan kelas
- B. Mencari tahu penyebab perilaku tersebut secara pribadi
- C. Mengabaikan saja
- D. Memberi hukuman tambahan tugas

**3.** Apa yang dimaksud dengan **Differentiated Instruction**? Mengapa penting?

**4.** Bagaimana cara mengukur apakah sebuah metode mengajar benar-benar efektif, selain dari nilai ujian?

**5.** Seorang siswa pintar tetapi sering tidak mengerjakan tugas. Apa kemungkinan penyebab dan bagaimana cara menanganinya?

**6.** Apa perbedaan antara **Assessment of Learning**, **Assessment for Learning**, dan **Assessment as Learning**?

**7.** Mengapa penting memberikan feedback yang spesifik dan actionable kepada siswa, bukan hanya nilai angka?

---

## 11. Content Creator / Penulis Konten / Kreator Digital

**Domain yang paling relevan:** Verbal, Praktis, Pola, Kreativitas (Figural/Pola)

### Soal

**1.** Apa perbedaan mendasar antara **konten yang viral** dan **konten yang membangun trust** jangka panjang?

**2.** Kamu diminta membuat konten untuk brand yang ingin meningkatkan awareness. Format mana yang biasanya lebih efektif di fase awal?
- A. Hard selling langsung
- B. Storytelling + value
- C. Hanya promo diskon
- D. Konten yang sangat formal

**3.** Apa yang dimaksud dengan **Hook** dalam konten? Berikan contoh hook yang kuat.

**4.** Mengapa konsistensi lebih penting daripada kesempurnaan dalam membangun personal branding sebagai content creator?

**5.** Sebuah konten mendapatkan banyak view tetapi engagement (like, comment, share) sangat rendah. Apa kemungkinan masalahnya?

**6.** Jelaskan perbedaan antara **Content Pillar** dan **Content Series**.

**7.** Bagaimana cara mengukur keberhasilan konten selain dari jumlah views dan followers?

---

## 12. Legal / Hukum

**Domain yang paling relevan:** Verbal, Logika, Memori, Praktis

### Soal

**1.** Apa perbedaan utama antara **Hukum Pidana** dan **Hukum Perdata**?

**2.** Sebuah perjanjian dibuat tanpa akta notaris. Apakah perjanjian tersebut otomatis tidak sah? Jelaskan.

**3.** Apa yang dimaksud dengan **Asas Praduga Tak Bersalah** (Presumption of Innocence)?

**4.** Dalam sebuah kontrak, terdapat klausul yang sangat merugikan salah satu pihak dan tidak pernah dijelaskan sebelumnya. Istilah hukum yang tepat untuk kondisi ini adalah?

**5.** Apa perbedaan antara **Mediasi**, **Arbitrase**, dan **Litigasi**?

**6.** Mengapa penting membaca seluruh isi kontrak sebelum menandatangani, termasuk bagian “syarat dan ketentuan” yang biasanya diabaikan?

**7.** Seorang klien meminta nasihat hukum untuk tindakan yang secara teknis legal tetapi secara etika meragukan. Bagaimana sikap yang seharusnya diambil oleh penasihat hukum?

---

## 13. Desain Grafis

**Domain yang paling relevan:** Figural, Spasial, Pola, Praktis

### Soal

**1.** Apa perbedaan utama antara **Raster** dan **Vector**? Kapan sebaiknya menggunakan masing-masing?

**2.** Sebuah desain terlihat “penuh” dan sulit dibaca. Prinsip desain mana yang kemungkinan besar dilanggar?
- A. Contrast
- B. Hierarchy
- C. White space / Negative space
- D. Alignment

**3.** Apa yang dimaksud dengan **Visual Hierarchy**? Mengapa penting dalam desain?

**4.** Kamu diminta membuat logo. Apa saja pertanyaan penting yang harus ditanyakan ke klien sebelum mulai mendesain?

**5.** Mengapa pemilihan tipografi sangat memengaruhi kesan sebuah desain? Berikan contoh.

**6.** Apa perbedaan antara **CMYK** dan **RGB**? Kapan masing-masing digunakan?

**7.** Sebuah desain terlihat bagus di layar tetapi buruk saat dicetak. Apa kemungkinan penyebab utamanya?

---

## 14. Customer Service / Customer Success

**Domain yang paling relevan:** Verbal, Praktis, Memori, Logika

### Soal

**1.** Apa perbedaan antara **Customer Service** dan **Customer Success**?

**2.** Seorang pelanggan marah karena masalah yang sebenarnya disebabkan oleh kesalahan mereka sendiri. Bagaimana cara merespons yang baik?

**3.** Apa yang dimaksud dengan **Empathy** dalam menangani pelanggan? Bagaimana cara menunjukkannya tanpa terdengar pura-pura?

**4.** Manakah yang lebih penting dalam jangka panjang?
- A. Menyelesaikan tiket secepat mungkin
- B. Menyelesaikan masalah pelanggan secara tuntas + menjaga hubungan
- C. Memberikan kompensasi besar setiap ada komplain
- D. Mengalihkan ke atasan terus-menerus

**5.** Mengapa penting mencatat riwayat interaksi dengan pelanggan?

**6.** Apa yang dimaksud dengan **First Contact Resolution**? Mengapa metrik ini penting?

**7.** Bagaimana cara menangani pelanggan yang meminta sesuatu di luar kebijakan perusahaan?

---

## 15. Operations / Supply Chain / Logistik

**Domain yang paling relevan:** Numerik, Logika, Praktis, Pola

### Soal

**1.** Apa yang dimaksud dengan **Supply Chain**? Sebutkan minimal 4 komponen utamanya.

**2.** Sebuah gudang sering kehabisan stok barang yang laris dan kelebihan stok barang yang sepi. Masalah utama yang terjadi adalah?

**3.** Apa perbedaan antara **FIFO** dan **FEFO**? Kapan masing-masing lebih tepat digunakan?

**4.** Mengapa lead time penting untuk dikelola dalam operasional?

**5.** Apa yang dimaksud dengan **Bottleneck** dalam proses operasional? Bagaimana cara mengidentifikasinya?

**6.** Sebuah proses memiliki banyak tahapan manual yang berulang. Pendekatan apa yang biasanya diambil untuk meningkatkannya?

**7.** Bagaimana cara mengukur efisiensi sebuah proses operasional secara sederhana?

---

## Catatan Implementasi untuk IQ-Lab

1. **Rekomendasi Bidang**  
   Berdasarkan skor domain tertinggi, sistem merekomendasikan 1–3 bidang di atas.

2. **Jumlah Soal**  
   Disarankan 6–10 soal per bidang (campuran pilihan ganda + uraian singkat).

3. **Penilaian**  
   - Pilihan ganda: objektif
   - Uraian: bisa dinilai dengan rubrik sederhana atau AI scoring + review manual di fase awal

4. **Output yang Diharapkan**  
   Setelah selesai, user mendapat:
   - Skor keahlian bidang tersebut
   - Kesesuaian antara profil domain vs performa di soal keahlian
   - Rekomendasi langkah pengembangan (belajar apa selanjutnya)

5. **Pengembangan Selanjutnya**  
   - Buat versi kesulitan berbeda (Junior / Mid / Senior)
   - Tambah bidang lain sesuai kebutuhan (misalnya Healthcare, Research, Finance Specialist, dll.)
   - Kembangkan bank soal yang lebih besar per bidang

---

**Dokumen ini siap digunakan sebagai dasar pembuatan bank soal keahlian di IQ-Lab.**
**Total bidang saat ini: 15**
