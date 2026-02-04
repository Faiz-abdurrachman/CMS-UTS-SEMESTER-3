# Product Requirements Document (PRD)
## CMS Lost & Found — Platform Manajemen Barang Hilang dan Ditemukan

**Versi:** 1.0  
**Tanggal:** Februari 2026  
**Status:** Final

---

## 1. Ringkasan Produk

### 1.1 Nama Produk
CMS Lost & Found (Content Management System untuk Barang Hilang dan Ditemukan).

### 1.2 Deskripsi
Aplikasi web full-stack yang memfasilitasi pelaporan, pencarian, dan pengelolaan barang hilang serta barang ditemukan dalam satu lingkungan (kampus, institusi, atau komunitas). Pengguna dapat mendaftar, login, melaporkan barang hilang atau ditemukan, serta melihat dashboard. Administrator memvalidasi laporan (approve/reject), menandai kasus selesai (resolved), dan mengelola data laporan serta pengguna.

### 1.3 Tujuan Produk
- Memberikan satu titik pusat untuk pelaporan dan pencarian barang hilang/ditemukan.
- Memastikan hanya laporan yang divalidasi admin yang tampil di dashboard publik.
- Memisahkan peran pengguna biasa (user) dan administrator (admin) dengan autentikasi dan otorisasi yang jelas.
- Mendukung deployment ke cloud (Vercel + MySQL) dengan arsitektur monorepo.

### 1.4 Stakeholder
- **Pengguna akhir (User):** anggota komunitas yang kehilangan barang atau menemukan barang orang lain.
- **Administrator (Admin):** pengelola sistem yang memvalidasi laporan dan mengelola data.
- **Pengembang:** tim development yang memelihara dan mengembangkan aplikasi.

---

## 2. Persona Pengguna

### 2.1 User (Pengguna Biasa)
- Ingin melaporkan barang hilang atau barang ditemukan.
- Ingin melihat daftar barang hilang/ditemukan yang sudah disetujui.
- Ingin melacak status laporan sendiri (pending, approved, rejected, resolved).
- Membutuhkan akun (registrasi) dan login untuk membuat laporan dan melihat "My Reports".

### 2.2 Admin (Administrator)
- Memvalidasi laporan masuk (approve/reject).
- Menandai kasus selesai (resolved) dengan catatan opsional.
- Mengedit atau menghapus laporan; melihat dan menghapus pengguna (kecuali akun admin).
- Membutuhkan akun admin yang dibuat lewat script (bukan registrasi publik).
- Mengakses dashboard statistik (jumlah user, total laporan, pending, approved).

---

## 3. Persyaratan Fungsional

### 3.1 Autentikasi dan Otorisasi

| ID | Persyaratan | Prioritas | Catatan |
|----|-------------|-----------|---------|
| A1 | Sistem menyediakan registrasi pengguna dengan nama, email, dan password. | Wajib | Hanya role `user`. Password di-hash (bcrypt). |
| A2 | Sistem menyediakan login dengan email dan password; mengembalikan JWT. | Wajib | Token disimpan di client (localStorage) dan dikirim di header Authorization. |
| A3 | Akun admin tidak dapat dibuat via registrasi; hanya via script `createAdmin`. | Wajib | Keamanan: admin dibuat manual. |
| A4 | Endpoint yang memerlukan login memvalidasi JWT; endpoint admin memvalidasi role `admin`. | Wajib | Middleware `authenticate` dan `isAdmin`. |
| A5 | Setelah login, pengguna diarahkan ke dashboard; admin dapat mengakses panel admin. | Wajib | Redirect berdasarkan role. |

### 3.2 Laporan Barang (Items)

| ID | Persyaratan | Prioritas | Catatan |
|----|-------------|-----------|---------|
| I1 | Pengguna yang login dapat membuat laporan barang hilang (lost). | Wajib | Field: name, description, location (opsional), date_occured (opsional), image (opsional). Status = lost. |
| I2 | Pengguna yang login dapat membuat laporan barang ditemukan (found). | Wajib | Field sama; status = found. |
| I3 | Upload gambar opsional; maksimal 5MB; format gambar umum. | Wajib | Multer, validasi ukuran di backend dan frontend. |
| I4 | Laporan baru berstatus validasi `pending` hingga admin approve/reject. | Wajib | validation_status: pending | approved | rejected. |
| I5 | Hanya item dengan validation_status = approved yang tampil di dashboard publik. | Wajib | Item rejected/pending tidak ditampilkan ke publik. |
| I6 | Item yang sudah di-mark resolved tidak tampil di dashboard publik (atau tampil di section "Resolved" tergantung kebijakan). | Wajib | resolved_at di-set; logic tampil di frontend/backend. |
| I7 | Pengguna dapat melihat daftar laporan sendiri (My Reports) terlepas status validasi. | Wajib | Endpoint GET /items/my-reports (protected). |
| I8 | Dashboard publik mendukung pencarian/filter (nama, deskripsi, lokasi). | Wajib | GET /items dengan query search, status. |

### 3.3 Fitur Admin

| ID | Persyaratan | Prioritas | Catatan |
|----|-------------|-----------|---------|
| AD1 | Admin dapat melihat statistik: total user, total item, pending, approved. | Wajib | GET /admin/statistics. |
| AD2 | Admin dapat melihat semua laporan dan filter berdasarkan validation_status. | Wajib | GET /admin/items. |
| AD3 | Admin dapat approve atau reject laporan (update validation_status). | Wajib | PUT /admin/items/:id/validate. |
| AD4 | Admin dapat menandai item sebagai resolved dengan catatan opsional. | Wajib | PUT /admin/items/:id/resolve. |
| AD5 | Admin dapat mengedit item (nama, deskripsi, lokasi, tanggal, status lost/found, validation_status, gambar). | Wajib | PUT /admin/items/:id dengan FormData. |
| AD6 | Admin dapat menghapus item. | Wajib | DELETE /admin/items/:id. |
| AD7 | Admin dapat melihat daftar semua pengguna. | Wajib | GET /admin/users. |
| AD8 | Admin dapat menghapus pengguna; akun admin tidak dapat dihapus. | Wajib | DELETE /admin/users/:id; validasi role di backend. |

### 3.4 Antarmuka Pengguna (Frontend)

| ID | Persyaratan | Prioritas | Catatan |
|----|-------------|-----------|---------|
| U1 | Halaman beranda (Home) menampilkan daftar barang hilang dan ditemukan yang approved. | Wajib | Public. |
| U2 | Halaman login dan registrasi; setelah login redirect sesuai role. | Wajib | Toggle User/Admin di login (hanya mengubah teks; credential tetap sama). |
| U3 | Halaman dashboard pengguna: section Lost, Found, Resolved; tombol lapor; pencarian. | Wajib | Protected (user). |
| U4 | Halaman My Reports: daftar laporan sendiri (lost dan found). | Wajib | Protected (user). |
| U5 | Halaman Report Lost dan Report Found: form dengan validasi (nama dan deskripsi wajib). | Wajib | Protected (user). |
| U6 | Halaman Admin Dashboard: statistik, tab Manage Reports (filter, approve/reject, resolve, edit, delete), tab Manage Users (tabel, delete). | Wajib | Protected (admin). |
| U7 | Navbar menampilkan link sesuai status login dan role (Home, Dashboard, My Reports, Admin Panel, Logout, atau Sign In / Sign Up). | Wajib | Responsif; menu mobile. |
| U8 | Notifikasi sukses/error (toast) untuk aksi seperti login, submit laporan, approve, dll. | Wajib | react-hot-toast. |

---

## 4. Persyaratan Non-Fungsional

### 4.1 Keamanan
- Password disimpan dalam bentuk hash (bcrypt).
- API yang memerlukan auth memakai JWT; token dikirim via header `Authorization: Bearer <token>`.
- Role admin dicek di backend untuk semua endpoint `/admin/*`.
- CORS dikonfigurasi (FRONTEND_URL) agar hanya origin yang diizinkan yang dapat memanggil API.
- Helmet dan rate limiting dipakai untuk mengurangi risiko serangan umum.

### 4.2 Kinerja
- Koneksi database memakai connection pool (mysql2).
- Rate limit: 100 request per 15 menit per IP (konfigurasi default).
- Upload file dibatasi 5MB.

### 4.3 Ketersediaan dan Deployment
- Aplikasi dapat dijalankan lokal (Node.js + MySQL) atau di-deploy ke Vercel (frontend static + API serverless).
- Database production: MySQL di cloud (PlanetScale, Railway, atau penyedia lain); schema dan env harus konsisten.

### 4.4 Maintainability
- Monorepo: frontend (React, Vite) dan backend (Express) dalam satu repositori.
- Backend terstruktur: config, controllers, middleware, models, routes, database (schema, script).
- Entry point Vercel (`api/index.js`) hanya me-load backend server; tidak duplikasi logic.

---

## 5. Model Data

### 5.1 Tabel `users`
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | INT, PK, AUTO_INCREMENT | Identifier unik. |
| name | VARCHAR(100), NOT NULL | Nama lengkap. |
| email | VARCHAR(100), NOT NULL, UNIQUE | Email untuk login. |
| password | VARCHAR(255), NOT NULL | Password ter-hash (bcrypt). |
| role | VARCHAR(20), DEFAULT 'user' | Nilai: `user` atau `admin`. |
| created_at | TIMESTAMP | Waktu pembuatan. |
| updated_at | TIMESTAMP | Waktu update terakhir. |

### 5.2 Tabel `items`
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | INT, PK, AUTO_INCREMENT | Identifier unik. |
| user_id | INT, NOT NULL, FK(users.id) | Pembuat laporan. |
| name | VARCHAR(200), NOT NULL | Nama barang. |
| description | TEXT | Deskripsi. |
| location | VARCHAR(200) | Lokasi kehilangan/penemuan. |
| date_occured | DATE | Tanggal kejadian. |
| image | VARCHAR(255) | Nama file gambar (path relatif). |
| status | VARCHAR(20), DEFAULT 'lost' | `lost` atau `found`. |
| validation_status | VARCHAR(20), DEFAULT 'pending' | `pending`, `approved`, `rejected`. |
| resolved_at | TIMESTAMP NULL | Waktu ditandai selesai. |
| resolved_note | TEXT NULL | Catatan penyelesaian. |
| created_at | TIMESTAMP | Waktu pembuatan. |
| updated_at | TIMESTAMP | Waktu update terakhir. |

Index: email (users), status, validation_status, user_id, created_at, resolved_at (items).

---

## 6. Spesifikasi API (Ringkas)

**Base URL:** `/api` (prefix untuk semua route di bawah).

### 6.1 Auth (Publik)
- `POST /auth/register` — Body: `{ name, email, password }`. Response: success atau pesan error.
- `POST /auth/login` — Body: `{ email, password }`. Response: `{ token, user }` atau error.

### 6.2 Items
- `GET /items` — Publik. Query opsional: `search`, `status`. Mengembalikan item yang approved dan (jika ada aturan) belum expired resolved.
- `GET /items/:id` — Publik. Satu item by ID.
- `GET /items/my-reports` — Protected. Daftar item milik user yang login.
- `POST /items/lost` — Protected. FormData: name, description, location, date_occured, image (opsional). Status = lost.
- `POST /items/found` — Protected. FormData sama; status = found.
- `PUT /items/:id` — Protected. Update item (pemilik atau kebijakan yang berlaku).
- `DELETE /items/:id` — Protected. Hapus item (pemilik atau admin).

### 6.3 Admin (Semua memerlukan auth + role admin)
- `GET /admin/statistics` — Ringkasan: totalUsers, totalItems, totalPending, totalApproved (dan sejenisnya).
- `GET /admin/items` — Semua item.
- `GET /admin/users` — Semua user.
- `PUT /admin/items/:id/validate` — Body: `{ validation_status: "approved" | "rejected" }`.
- `PUT /admin/items/:id/resolve` — Body: `{ resolved_note?: string }`.
- `PUT /admin/items/:id` — Update item (FormData).
- `DELETE /admin/items/:id` — Hapus item.
- `DELETE /admin/users/:id` — Hapus user (admin tidak boleh dihapus).

Header untuk endpoint protected: `Authorization: Bearer <JWT>`.

---

## 7. User Stories (Ringkas)

- Sebagai **pengguna**, saya ingin mendaftar dan login agar bisa membuat laporan dan melihat laporan sendiri.
- Sebagai **pengguna**, saya ingin melaporkan barang hilang atau ditemukan beserta foto (opsional) agar orang lain bisa melihat setelah admin menyetujui.
- Sebagai **pengguna**, saya ingin melihat dashboard barang hilang/ditemukan yang disetujui dan mencari berdasarkan kata kunci.
- Sebagai **pengguna**, saya ingin melihat daftar laporan saya dan statusnya (pending/approved/rejected/resolved).
- Sebagai **admin**, saya ingin login ke panel admin dan melihat statistik serta daftar laporan untuk memvalidasi.
- Sebagai **admin**, saya ingin menyetujui atau menolak laporan dan menandai kasus selesai dengan catatan.
- Sebagai **admin**, saya ingin mengedit atau menghapus laporan dan mengelola pengguna (kecuali menghapus admin).

---

## 8. Kriteria Penerimaan (Contoh)

- Registrasi berhasil menyimpan user dengan password ter-hash dan role `user`.
- Login dengan kredensial benar mengembalikan JWT dan data user; role admin mengarahkan ke panel admin.
- Laporan baru memiliki validation_status `pending` dan hanya tampil di My Reports; setelah approve tampil di dashboard publik.
- Admin tidak dapat dihapus melalui UI/API; endpoint delete user mengembalikan error atau tidak mengubah data untuk role admin.
- Upload gambar maksimal 5MB; file disimpan dengan nama unik dan path tersedia untuk ditampilkan (atau URL jika pakai storage eksternal).
- Respons UI dapat digunakan di desktop dan mobile (navbar/footer responsif).

---

## 9. Batasan dan Asumsi

- Admin hanya dibuat lewat script; tidak ada fitur "request admin" dari UI.
- Upload file di environment serverless (Vercel) tidak persistent; untuk production penuh disarankan storage eksternal (S3, Cloudinary, Vercel Blob).
- Satu gambar per item; tidak ada multiple attachment.
- Bahasa antarmuka: Indonesia/Inggris sesuai konten yang ditulis di frontend; tidak ada multi-language framework di PRD ini.
- Notifikasi real-time (WebSocket) tidak termasuk dalam scope versi ini.

---

## 10. Glosarium

| Istilah | Definisi |
|---------|----------|
| JWT | JSON Web Token; digunakan untuk autentikasi stateless. |
| validation_status | Status validasi laporan: pending, approved, rejected. |
| resolved | Kasus ditandai selesai (resolved_at di-set); optional resolved_note. |
| Monorepo | Satu repositori berisi lebih dari satu aplikasi (frontend + backend). |
| Serverless | Model deployment di mana backend dijalankan sebagai function per request (mis. Vercel). |

---

## 11. Riwayat Revisi

| Versi | Tanggal | Perubahan |
|-------|---------|-----------|
| 1.0 | Februari 2026 | Dokumen PRD awal berdasarkan implementasi CMS Lost & Found. |
