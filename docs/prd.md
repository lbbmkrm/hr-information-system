# Product Requirement Document (PRD)
## Aplikasi HRIS Sederhana — Employee Management & Leave Request

**Status:** Draft
**Versi:** 0.1
**Dibuat oleh:** labib

---

## 1. Latar belakang masalah

Perusahaan kecil dan startup (di bawah 50 karyawan) umumnya belum menggunakan sistem HRIS karena dianggap terlalu mahal atau rumit untuk skala tim mereka. Akibatnya, pengelolaan data karyawan dan proses administrasi HR dilakukan secara manual dengan berbagai masalah berikut:

- **Data karyawan tidak terpusat** — tersebar di Excel, Google Sheets, atau chat WhatsApp, sehingga rawan data ganda dan sulit dicari dengan cepat.
- **Proses cuti tidak terlacak** — karyawan mengajukan cuti lewat chat pribadi ke atasan, sering terlewat atau tidak direspons, dan HR kesulitan menghitung sisa cuti karena tidak ada pencatatan otomatis.
- **Tidak ada histori yang bisa dilacak** — tidak ada catatan siapa yang menyetujui/menolak pengajuan dan kapan, sehingga menyulitkan audit di kemudian hari.
- **Sulit mendapat overview tim secara cepat** — HR harus bertanya manual ke tiap manajer untuk mengetahui status tim, memperlambat pengambilan keputusan.

## 2. Target pengguna

Aplikasi ini dirancang untuk **tim HR dan manajemen di perusahaan kecil/startup (< 50 karyawan)** yang membutuhkan sistem sederhana untuk mengelola data karyawan dan proses cuti tanpa kompleksitas HRIS enterprise.

### Peran pengguna (roles)

| Role | Deskripsi |
|---|---|
| **Admin/HR** | Mengelola data seluruh karyawan, meninjau dan menyetujui/menolak pengajuan cuti |
| **Karyawan (Employee)** | Melihat data diri sendiri, mengajukan cuti, memantau status pengajuan |

## 3. Tujuan produk

- Menyediakan satu sumber data terpusat untuk informasi karyawan
- Menyediakan alur pengajuan dan approval cuti yang terstruktur dan tercatat
- Memberikan visibilitas cepat bagi HR terhadap status tim (siapa sedang cuti, siapa yang butuh approval)

## 4. Ruang lingkup MVP (in scope)

### Modul 1: Employee Management
- Admin dapat menambah, melihat, mengubah, dan menghapus data karyawan (CRUD)
- Data karyawan meliputi: nama lengkap, posisi, departemen, tanggal bergabung
- Karyawan dapat login dan melihat data dirinya sendiri

### Modul 2: Leave Request
- Karyawan dapat mengajukan cuti dengan mengisi tanggal mulai, tanggal selesai, dan alasan
- Admin dapat melihat daftar pengajuan cuti dan menyetujui/menolak
- Karyawan dapat melihat status pengajuan cuti miliknya (pending/approved/rejected)
- Riwayat seluruh pengajuan cuti tersimpan dan bisa dilihat kembali

### Autentikasi
- Login dengan email dan password
- Pembatasan akses berdasarkan role (admin vs karyawan)

## 5. Di luar ruang lingkup MVP (out of scope)

Fitur berikut sengaja tidak dikerjakan di versi pertama, disimpan untuk pengembangan lanjutan:

- Payroll dan perhitungan gaji
- Absensi harian (check-in/check-out)
- Manajemen kinerja/evaluasi karyawan
- Notifikasi email otomatis
- Multi-perusahaan (multi-tenant)

## 6. Indikator keberhasilan (untuk portfolio)

Karena ini proyek portfolio tanpa pengguna nyata, "keberhasilan" diukur dari:

- Aplikasi dapat di-deploy dan diakses secara live (bukan hanya localhost)
- Kedua modul MVP berfungsi end-to-end tanpa bug kritis
- Kode terstruktur rapi dan terdokumentasi (README, ERD, catatan keputusan teknis)
- Alur kerja (admin dan karyawan) dapat didemokan dengan jelas dalam waktu singkat

## 7. Asumsi dan batasan

- Tidak menangani perhitungan hari cuti berdasarkan regulasi ketenagakerjaan tertentu (disederhanakan)
- Tidak ada integrasi dengan sistem eksternal (payroll, absensi fisik, dsb) di versi ini
- Dikembangkan dan dikelola oleh satu orang (solo developer)