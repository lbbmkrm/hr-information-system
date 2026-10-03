# Catatan untuk Melanjutkan Pekerjaan

Terakhir diperbarui: 28 September 2026

## Posisi saat ini

Frontend sudah memiliki `ProtectedRoute` untuk mewajibkan login dan membatasi route berdasarkan role, serta `GuestRoute` agar pengguna yang sudah login tidak kembali ke halaman login. Route `/employees` dan `/employees/add` dibatasi untuk `ADMIN` dan `HR`.

Perubahan tersebut masih ada di working tree dan belum di-commit. Saat catatan ini dibuat, `git status` menunjukkan perubahan pada:

- `client/src/contexts/AuthProvider.tsx`
- `client/src/pages/auth/Login.tsx`
- `client/src/routes/index.tsx`
- `client/src/components/GuestRoute.tsx` (file baru)
- `client/src/components/ProtectedRoute.tsx` (file baru)

Jangan menghapus atau menimpa perubahan lokal ini saat mulai lagi.

## Kesepakatan dan langkah berikutnya

Lanjutkan pembatasan untuk halaman detail dan edit employee agar pengalaman frontend mengikuti policy backend. Policy saat ini (`server/src/policies/employee.policy.ts`) mengizinkan:

- `ADMIN` dan `HR` melihat serta mengubah data employee mana pun.
- `EMPLOYEE` melihat serta mengubah hanya data employee yang terhubung ke akun miliknya.

Route `/employees/:id` dan `/employees/edit/:id` saat ini hanya dilindungi oleh autentikasi umum. Jangan membatasi kedua halaman hanya untuk `ADMIN`/`HR`, karena itu akan menutup akses karyawan ke datanya sendiri yang memang diizinkan backend. Periksa cara halaman memuat employee dan respons backend sebelum memilih UI guard: karyawan harus dapat membuka data miliknya, tetapi tidak boleh melihat atau mengedit data karyawan lain. Backend tetap menjadi otoritas keamanan; pembatasan frontend hanya untuk mengarahkan dan menyembunyikan aksi yang tidak relevan.

## File untuk diperiksa saat melanjutkan

1. `client/src/routes/index.tsx` — struktur dan role guard route.
2. `client/src/components/ProtectedRoute.tsx` — perilaku autentikasi dan role.
3. `client/src/pages/employees/EmployeeDetail.tsx` dan `EmployeeEdit.tsx` — pemuatan data serta kondisi tampilan.
4. `client/src/api/employeeApi.ts` dan route/service/policy employee di `server/src` — endpoint dan otorisasi berbasis kepemilikan.

Setelah implementasi, uji skenario `ADMIN`/`HR`, karyawan yang membuka data sendiri, dan karyawan yang mencoba membuka data karyawan lain. Pastikan perubahan lokal yang sudah ada tetap terjaga.

memutuskan untuk menggunakan aturan dari server,
server membuat error middleware,
optimasi pesan error dan penanganan per layer
selesai optimasi error handling backend
selanjutnya frontend menyesuaikan error dari backend
(1 okto) karena untuk membuka halaman list dari sebuah resource sudah menggunakan guard role artinya untuk role yang tidak diizinkan melihat list tetapi dapat melihat data nya perlu dari navigasi berbeda, kemudian beri pesan jika tidak berhasil membuka sebuah halaman

(3 okt) error handling frontend disamakan: tampilkan `response.data.message` dari backend bila tersedia, gunakan pesan fallback hanya jika pesan backend tidak ada. Helper bersama ada di `client/src/utils/getErrorMessage.ts`, dan sudah diterapkan pada halaman auth, employee, leave request, serta beberapa komponen/provider.

Kesepakatan akses: otorisasi sepenuhnya ditegakkan backend. Frontend hanya menyembunyikan navigasi/fitur yang tidak tersedia untuk role, dan menampilkan pesan backend bila akses atau request ditolak. `ProtectedRoute` hanya memastikan login; role-based visibility berada di UI.

Perubahan frontend yang ingin digabung mencakup proteksi route untuk pengguna login, `GuestRoute`, navigasi berbasis role, dan penampilan error API.