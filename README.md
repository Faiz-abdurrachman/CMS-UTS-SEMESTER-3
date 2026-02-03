# CMS Lost & Found

**Platform Manajemen Barang Hilang dan Ditemukan Terpusat**

![Status](https://img.shields.io/badge/Status-Active-success)
![Node](https://img.shields.io/badge/Node-%3E%3D18-green)
![License](https://img.shields.io/badge/License-ISC-blue)

Aplikasi web *full-stack* yang dirancang untuk memfasilitasi pelaporan dan pencarian barang hilang di lingkungan komunitas atau institusi. Menggunakan arsitektur modern dengan pemisahan *concern* yang jelas antara Backend (Express.js) dan Frontend (React.js) dalam satu repositori (*Monorepo*).

---

## 📋 Daftar Isi

1. [Fitur Lengkap](#-fitur-lengkap)
2. [Teknologi](#-teknologi)
3. [Prasyarat Sistem](#-prasyarat-sistem)
4. [Instalasi dan Setup](#-instalasi-dan-setup)
5. [Setup Database (Detail)](#-setup-database-detail)
6. [Konfigurasi Environment](#-konfigurasi-environment)
7. [Panduan Penggunaan](#-panduan-penggunaan)
8. [Dokumentasi API](#-dokumentasi-api)
9. [Struktur Proyek](#-struktur-proyek)
10. [Troubleshooting](#-troubleshooting)

---

## 🚀 Fitur Lengkap

### Untuk Pengguna (User)
*   **Manajemen Akun**: Registrasi dan Login aman dengan enkripsi password.
*   **Pelaporan Barang**:
    *   Lapor Barang Hilang (*Lost Item*) dengan detail (Nama, Deskripsi, Lokasi, Tanggal).
    *   Lapor Barang Ditemukan (*Found Item*) untuk membantu pemilik asli.
    *   Unggah foto barang (mendukung format gambar umum).
*   **Dashboard Personal**: Memantau status laporan yang diajukan (Pending/Approved/Resolved).
*   **Pencarian & Filter**: Mencari barang berdasarkan kata kunci atau memfilter berdasarkan status.

### Untuk Administrator
*   **Dashboard Statistik**: Ringkasan jumlah pengguna, total barang, dan laporan yang butuh tindakan.
*   **Sistem Validasi**:
    *   Meninjau laporan masuk.
    *   Menyetujui (*Approve*) laporan yang valid agar muncul di publik.
    *   Menolak (*Reject*) laporan spam atau tidak layak.
*   **Manajemen Data**: Akses penuh untuk mengedit atau menghapus data barang dan pengguna jika diperlukan.
*   **Penyelesaian Kasus**: Menandai kasus sebagai selesai (*Resolved*) dengan catatan penyelesaian.

---

## 🛠 Teknologi

| Komponen | Teknologi | Keterangan |
| :--- | :--- | :--- |
| **Frontend** | React.js (Vite) | Library UI modern dan cepat |
| **Styling** | TailwindCSS + DaisyUI | Framework CSS utility-first |
| **Backend** | Node.js + Express | Runtime server-side JavaScript |
| **Database** | MySQL | Relational Database Management System |
| **Driver DB** | mysql2 (Pool) | Koneksi database efisien |
| **Auth** | JWT + bcrypt | JSON Web Token untuk sesi stateless |
| **Security** | Helmet, Rate Limit | Perlindungan header dan anti-spam |
| **Upload** | Multer | Middleware penanganan file multipart |

---

## 💻 Prasyarat Sistem

Sebelum instalasi, pastikan perangkat Anda memiliki:

1.  **Node.js**: Versi 18.x atau lebih baru.
2.  **MySQL Server**: Bisa dari XAMPP, Laragon, atau Docker.
3.  **Git**: Untuk manajemen versi source code.
4.  **Terminal/Command Prompt**: Untuk menjalankan perintah CLI.

---

## 📥 Instalasi dan Setup

### 1. Kloning Repositori
```bash
git clone https://github.com/Faiz-abdurrachman/CMS-UTS-SEMESTER-3.git
cd CMS-UTS-SEMESTER-3
```

### 2. Instalasi Dependensi
Jalankan perintah berikut di root folder untuk menginstal dependensi Backend dan Frontend sekaligus:

```bash
npm run install:all
```

> **Catatan**: Jika gagal, Anda bisa menginstal manual:
> *   `cd backend && npm install`
> *   `cd frontend && npm install`

---

## 🗄️ Setup Database (Detail)

Pilih salah satu metode yang sesuai dengan lingkungan pengembangan Anda.

### Opsi A: Menggunakan XAMPP / phpMyAdmin
1.  Buka **XAMPP Control Panel** dan start **Apache** & **MySQL**.
2.  Buka browser ke `http://localhost/phpmyadmin`.
3.  Buat database baru dengan nama `lostfound_db`.
4.  Pilih tab **Import**.
5.  Pilih file `backend/database/schema.sql`.
6.  Klik **Go** atau **Kirim**.

### Opsi B: Menggunakan Terminal / CLI
Pastikan mysql sudah ada di PATH sistem Anda.
```bash
mysql -u root -p -e "CREATE DATABASE lostfound_db"
mysql -u root -p lostfound_db < backend/database/schema.sql
```

### Membuat Akun Admin
Untuk keamanan, akun admin tidak dibuat secara otomatis. Gunakan script yang tersedia:

```bash
cd backend
npm run create-admin
```
Ikuti instruksi di layar untuk memasukkan nama, email, dan password admin.

---

## ⚙️ Konfigurasi Environment

Aplikasi membutuhkan konfigurasi variabel lingkungan agar berjalan dengan benar.

1.  Masuk ke folder backend: `cd backend`
2.  Salin template config: `cp .env.example .env`
3.  Edit file `.env` dan sesuaikan nilainya:

```ini
# Server Config
PORT=5000
NODE_ENV=development

# Database Config (Sesuaikan dengan setting XAMPP/Local Anda)
DB_HOST=localhost
DB_USER=root
# Kosongkan password jika menggunakan setting default XAMPP
DB_PASSWORD=
DB_NAME=lostfound_db

# Keamanan (Gunakan string acak yang panjang & rumit)
JWT_SECRET=rahasia_ini_harus_diganti_saat_production

# Upload & Frontend
UPLOAD_DIR=uploads
FRONTEND_URL=http://localhost:3000
```

---

## ▶️ Menjalankan Aplikasi

Kembali ke folder root (`CMS-UTS-SEMESTER-3`), lalu jalankan:

```bash
npm run dev
```

Perintah ini akan menjalankan:
1.  **Backend Server** di port 5000
2.  **Frontend Dev Server** di port 3000

Buka browser Anda di: **[http://localhost:3000](http://localhost:3000)**

---

## � Panduan Penggunaan

### Skenario Pengguna Biasa
1.  **Daftar Akun**: Klik "Sign Up" di pojok kanan atas, isi data diri.
2.  **Login**: Masuk menggunakan email/password.
3.  **Lapor Barang**:
    *   Klik tombol **"I just lost my stuff"** (Saya kehilangan barang) atau **"I found someone stuff"** (Saya menemukan barang).
    *   Isi formulir dengan lengkap.
    *   Unggah foto barang agar lebih mudah dikenali.
4.  **Lihat Status**: Buka menu **"My Reports"** di navbar untuk melihat apakah laporan Anda sudah disetujui admin.

### Skenario Administrator
1.  **Login Admin**: Di halaman Login, klik tab/tombol **"Admin"** (atau link khusus jika ada), lalu login.
2.  **Validasi**:
    *   Di Dashboard Admin, lihat tabel "Pending Reports".
    *   Klik **Approve** jika laporan valid/layak tayang.
    *   Klik **Reject** jika laporan tidak jelas/spam.
3.  **Manajemen**: Gunakan menu Admin Panel untuk menghapus user yang melanggar aturan atau mengupdate info barang.

---

## � Dokumentasi API

Base URL untuk Development: `http://localhost:5000/api`

### Endpoint Publik
*   `POST /auth/register`
    *   Body: `{ "name": "...", "email": "...", "password": "..." }`
*   `POST /auth/login`
    *   Body: `{ "email": "...", "password": "..." }`
*   `GET /items`
    *   Query Params: `?search=...&status=lost|found`

### Endpoint Terproteksi (Butuh Header Authorization)
Header: `Authorization: Bearer <token_jwt_anda>`

*   `GET /items/my-reports` - Mendapatkan history laporan user.
*   `POST /items/lost` - Upload laporan barang hilang (Form-Data).
*   `POST /items/found` - Upload laporan barang temuan (Form-Data).

### Endpoint Admin (Butuh Token Admin)
*   `GET /admin/statistics` - Data ringkasan dashboard.
*   `PUT /admin/items/:id/validate` - Update status validasi.
    *   Body: `{ "validation_status": "approved" }`

---

## ❓ Troubleshooting

**Masalah**: Error "Connect ECONNREFUSED 127.0.0.1:3306"
**Solusi**: Pastikan layanan MySQL (XAMPP/Laragon) sudah dinyalakan (Start).

**Masalah**: Gagal Login (Invalid Credentials) terus menerus.
**Solusi**: Pastikan password user di database sudah ter-hash (terenkripsi). Jangan insert user manual langsung via SQL tanpa hashing password. Gunakan fitur Register di web atau script `create-admin`.

**Masalah**: Gambar tidak muncul.
**Solusi**: Pastikan folder `backend/uploads` ada. Aplikasi akan mencoba menyajikan file statis dari folder tersebut.

---

## 📂 Struktur Direktori

```
CMS-UTS-SEMESTER-3/
├── api/                  # Vercel Entry Point
├── backend/              # Server-side Application
│   ├── config/           # Koneksi DB
│   ├── controllers/      # Logika Bisnis
│   ├── middleware/       # Autentikasi & Upload
│   ├── models/           # Query Database
│   ├── routes/           # Routing API
│   ├── database/         # Schema SQL
│   └── uploads/          # Folder Foto (Local Dev)
├── frontend/             # Client-side Application
│   ├── src/
│   │   ├── components/   # UI Komponen
│   │   ├── contexts/     # State Management (Auth)
│   │   ├── pages/        # Halaman Website
│   │   └── hooks/        # Custom React Hooks
└── vercel.json           # Konfigurasi Cloud
```

---

Dibuat untuk memenuhi tugas Praktikum Web CMS Semester 3.
Dokumentasi diperbarui: Februari 2026.
