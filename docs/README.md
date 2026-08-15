# HRIS Sederhana — Employee Management & Leave Request

Sebuah aplikasi HRIS (Human Resource Information System) sederhana untuk kebutuhan perusahaan kecil. Proyek ini dibuat sebagai portfolio dan saat ini masih dalam pengembangan (WIP). Fokus utamanya adalah manajemen data karyawan dan alur pengajuan cuti.

Status: ⚠️ Dalam pengembangan

Laporkan bug / diskusi: https://github.com/lbbmkrm/hr-information-system/issues

## Fitur utama
- Manajemen data karyawan (CRUD) — akses admin
- Autentikasi dengan role: admin dan karyawan
- Pengajuan cuti oleh karyawan
- Persetujuan/penolakan pengajuan cuti oleh admin
- Riwayat pengajuan cuti

Fitur yang direncanakan:
- Modul absensi
- Modul payroll
- Notifikasi email otomatis

## Teknologi
- Frontend: React (Vite), TypeScript
- Backend: Node.js + Express (REST API)
- ORM & Database: Prisma + SQLite (development)
- Autentikasi: JWT (jsonwebtoken) + bcrypt untuk hashing password

## Arsitektur & skema database
Dokumen perencanaan dan ERD tersedia di folder `docs/`:
- docs/PRD-HRIS.md
- docs/erd.md

## Menjalankan secara lokal (development)
1. Clone repository  
   git clone https://github.com/lbbmkrm/hr-information-system.git  
   cd hr-information-system

2. Backend  
   cd server  
   npm install  
   cp .env.example .env
   # sesuaikan .env bila perlu (DATABASE_URL, JWT_SECRET, dll.)
   npx prisma migrate dev
   npm run dev  
   # Default: http://localhost:5000

3. Frontend (terminal terpisah)  
   cd client  
   npm install  
   npm run dev  
   # Default: http://localhost:5173

Catatan:
- Untuk production, ganti SQLite dengan Postgres/MySQL dan perbarui `DATABASE_URL` di .env.
- Gunakan Postman/Insomnia untuk menguji endpoint API selama development.

## Struktur proyek (ringkasan)
.
├── client/            # React (Vite) — frontend  
│   ├── src/  
│   │   ├── pages/  
│   │   ├── components/  
│   │   └── api/       # panggilan ke backend  
├── server/            # Express — backend REST API  
│   ├── prisma/        # schema.prisma & migrations  
│   ├── routes/  
│   ├── controllers/  
│   └── middleware/    # auth, role-check, error handler  
└── docs/              # PRD, ERD, catatan teknis

## Kontribusi
Proyek ini bersifat personal/portfolio. Jika ingin berkontribusi:
1. Fork repo
2. Buat branch fitur: `feature/nama-fitur`
3. Buka PR dengan deskripsi perubahan dan screenshot (jika ada)

Aturan minimum:
- Gunakan TypeScript untuk kode baru
- Sertakan testing untuk logika bisnis penting (jika memungkinkan)
- Ikuti style/linting yang ada

## Catatan teknis & best practices
- Simpan secret (JWT, DB URL) di environment variables.
- Hash password menggunakan bcrypt.
- Terapkan role-based middleware untuk membatasi akses route.
- Untuk produksi, gunakan managed DB dan aktifkan mekanisme backup.

## Roadmap
- Lengkapi unit & integration tests
- Halaman admin: manajemen karyawan lanjutan
- Implementasi notifikasi email
- Setup CI/CD & deployment

## Screenshot / Demo
Tambahkan screenshot atau GIF demo di bagian atas README ketika sudah tersedia:
`![Screenshot](docs/screenshot.png)`

---
Kontak: lihat profil GitHub pemilik repositori untuk detail lebih lanjut.
