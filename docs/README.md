# HRIS Sederhana — Employee Management & Leave Request

> Aplikasi HRIS ringan untuk perusahaan kecil, fokus pada manajemen data karyawan dan pengajuan cuti. Dibangun sebagai proyek portfolio.

[Demo live] (akan diisi setelah deploy) · [Laporkan bug](../../issues)

<!-- TODO: tambahkan screenshot atau GIF demo aplikasi di sini -->

## Latar belakang

<!-- TODO: ringkas 2-3 kalimat dari bagian "Latar belakang masalah" di PRD-HRIS.md -->

## Fitur

- [ ] Manajemen data karyawan (CRUD) oleh admin
- [ ] Login dengan role admin dan karyawan
- [ ] Karyawan dapat mengajukan cuti
- [ ] Admin dapat menyetujui/menolak pengajuan cuti
- [ ] Riwayat pengajuan cuti

## Tech stack

- **Frontend:** React (Vite)
- **Backend:** Express.js (REST API)
- **ORM & Database:** Prisma + SQLite (development)
- **Autentikasi:** JWT (jsonwebtoken) + bcrypt untuk hashing password
- **Deployment:** <!-- TODO: isi setelah deploy, misal Vercel (frontend) + Railway (backend) -->

## Skema database

Lihat diagram ERD lengkap di [`docs/erd.md`](docs/erd.md) <!-- TODO: sesuaikan path -->

## Cara menjalankan secara lokal

```bash
# 1. Clone repository
git clone <url-repo-ini>
cd <nama-folder>

# 2. Setup backend
cd server
npm install
cp .env.example .env
npx prisma migrate dev
npm run dev          # berjalan di http://localhost:5000

# 3. Setup frontend (di terminal baru)
cd client
npm install
npm run dev           # berjalan di http://localhost:5173
```

## Struktur proyek

```
.
├── client/            # React (Vite) — frontend
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   └── api/        # fungsi fetch ke backend
│   └── ...
├── server/            # Express — backend REST API
│   ├── prisma/         # schema.prisma & migrations
│   ├── routes/
│   ├── controllers/
│   ├── middleware/      # auth check, role check
│   └── ...
└── README.md
```

## Dokumen terkait

- [PRD (Product Requirement Document)](PRD-HRIS.md)
- Skema database (ERD)
- Catatan keputusan teknis

## Tantangan & pembelajaran

<!-- TODO: isi di akhir proyek — tantangan teknis yang dihadapi dan cara mengatasinya -->

## Roadmap ke depan

- Modul absensi
- Modul payroll
- Notifikasi email otomatis

---

Dibuat oleh [nama kamu] sebagai proyek portfolio · [LinkedIn/portfolio link]