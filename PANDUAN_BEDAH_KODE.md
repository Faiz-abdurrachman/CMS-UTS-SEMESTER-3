# Panduan Bedah Kode & Arsitektur Lengkap (Deep Dive)

Dokumen ini adalah **kitab suci** proyek ini. Kita akan membedah **SETIAP FILE** dari akar sampai daun terdalam. Penjelasan ini dirancang untuk orang yang **belajar dari nol**, menjelaskan logika, alasan keberadaan file, dan apa akibatnya jika file ini hilang.

---

## 🌳 Peta Struktur Proyek

```
.
├── api/                  # Jalur masuk untuk Vercel (Cloud)
│   └── index.js
├── backend/              # Otak Aplikasi (Server Logic)
│   ├── config/           # Konfigurasi Database
│   │   └── db.js
│   ├── controllers/      # Koki (Logika Bisnis)
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   └── itemController.js
│   ├── database/         # Cetak Biru Database
│   │   ├── create-admin.sql
│   │   └── schema.sql
│   ├── middleware/       # Satpam (Pengecekan)
│   │   ├── adminMiddleware.js
│   │   ├── authMiddleware.js
│   │   └── upload.js
│   ├── models/           # Kamus Data (Query SQL)
│   │   ├── Item.js
│   │   └── User.js
│   ├── routes/           # Resepsionis (Arah Jalan)
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   └── itemRoutes.js
│   ├── scripts/          # Alat Bantu
│   │   └── createAdmin.js
│   ├── .env.example      # Contoh Password Brankas
│   ├── package.json      # KTP Backend
│   └── server.js         # Jantung Server
├── frontend/             # Wajah Aplikasi (Tampilan)
│   ├── src/
│   │   ├── components/   # Potongan Lego UI
│   │   │   ├── CardItem.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── SidebarAdmin.jsx
│   │   ├── contexts/     # Gudang Data Melayang
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/        # Remote Control
│   │   │   └── useAuth.js
│   │   ├── pages/        # Halaman Website
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ... (Laporan Lain)
│   │   ├── api.js        # Tukang Pos (Axios)
│   │   ├── App.jsx       # Peta Navigasi
│   │   └── main.jsx      # Titik Awal React
│   └── ... (Config Vite)
├── .env.production.example
├── .gitignore
├── package.json          # KTP Proyek Utama
└── vercel.json           # Instruksi Cloud
```

---

## 1. 📂 Root Directory (Akar)

### 📄 `package.json`

- **Kegunaan**: Identitas utama proyek.
- **Buat Apa**: Mencatat daftar "alat" (dependencies) yang dipakai.
- **Kenapa Harus Ada**: Node.js butuh file ini untuk tau cara install dan start aplikasi.
- **Logika**:
  - `scripts`: Daftar perintah perintas. `npm run dev` sebenarnya menjalankan perintah panjang `concurrently "npm run dev:backend" ...`.
  - `dependencies`: Daftar paket yang wajib ada, misal `express` atau `react`.
- **Jika Hilang**: **FATAL ERROR**. Aplikasi tidak bisa diinstall (`npm install` gagal) dan tidak bisa jalan.

### 📄 `vercel.json`

- **Kegunaan**: Konfigurasi deployment ke Vercel.
- **Buat Apa**: Memberitahu Vercel bagaimana cara memproses request user.
- **Logika**:
  - `routes`: "Jika user buka `/api/*`, lempar ke folder `api/`. Jika buka yang lain, lempar ke `frontend`."
- **Jika Hilang**: Website berantakan saat di-online-kan (halaman 404 Not Found).

### 📄 `.gitignore`

- **Kegunaan**: Daftar file yang HARAM di-upload ke GitHub.
- **Buat Apa**: Mencegah file sampah (`node_modules`) dan file rahasia (`.env`) tersebar.
- **Jika Hilang**: File sampah 500MB ikut terupload, dan password database Anda bisa dicuri orang.

---

## 2. 📂 Folder `api/` (Layer Cloud)

### 📄 `api/index.js`

- **Kegunaan**: Pintu masuk Serverless Function.
- **Buat Apa**: Vercel tidak menjalankan server terus-menerus (mahal). Dia cuma nyala pas ada tamu. File ini yang menyambut tamu itu.
- **Logika**:
  - Dia memanggil (`require`) aplikasi express dari `backend/server.js`.
  - Tapi dia mematikan fungsi `app.listen` (biar gak bentrok port).
- **Jika Hilang**: API backend tidak akan jalan saat di-deploy ke Vercel.

---

## 3. 📂 Folder `backend/` (Otak Aplikasi)

### � `backend/server.js`

- **Kegunaan**: Jantung server. File pertama yang dieksekusi Node.js.
- **Logika Flow**:
  1.  `express()`: Siapkan aplikasi web.
  2.  `app.use(cors)`: Izinkan frontend (beda domain) buat ngomong sama backend.
  3.  `app.use(json)`: Izinkan baca data JSON yang dikirim user.
  4.  `app.use('/api/auth', authRoutes)`: Pasang papan penunjuk arah.
  5.  `app.listen(5000)`: Buka loket di port 5000.
- **Jika Hilang**: Tidak ada server. Aplikasi mati.

### 📂 `backend/config/`

#### 📄 `db.js`

- **Kegunaan**: Kabel telepon ke Database MySQL.
- **Logika**:
  - `createPool`: Membuat sekumpulan koneksi siap pakai.
  - Menggunakan variabel dari `.env` (`DB_HOST`, `DB_USER`, dll) agar password tidak ditulis langsung di sini (bahaya).
- **Jika Hilang**: Server jalan, tapi gak bisa simpan/baca data. Error database connection.

### 📂 `backend/models/`

#### 📄 `User.js` & `Item.js`

- **Kegunaan**: Kamus perintah SQL.
- **Buat Apa**: Memisahkan kode SQL dari logika server biar rapi.
- **Syntax**:
  - `findByEmail`: `SELECT * FROM users WHERE email = ?`
  - `create`: `INSERT INTO items (...) VALUES (...)`
  - Tanda `?` itu fitur keamanan (Prepared Statement) biar gak kena hack SQL Injection.

### 📂 `backend/controllers/` (Koki)

#### 📄 `authController.js`

- **Kegunaan**: Mengatur alur Register & Login.
- **Logika Login**:
  1.  Ambil `email` & `password` dari input user.
  2.  Cek di DB: Ada gak email ini?
  3.  Kalau ada, cek Password: `bcrypt.compare` (Bandingkan password input vs password acak di DB).
  4.  Kalau cocok, bikin JWT (Tiket Masuk).
  5.  Kirim Tiket ke user.

#### 📄 `itemController.js`

- **Kegunaan**: Mengatur Lapor Barang.
- **Logika Create Item**:
  1.  Cek input: Nama barang ada? Foto ada?
  2.  Panggil Model `Item.create`.
  3.  Kirim respon "Sukses lapor!".

### 📂 `backend/middleware/` (Satpam)

#### 📄 `authMiddleware.js`

- **Kegunaan**: Memeriksa tiket (JWT).
- **Logika**:
  - Setiap request dicek headernya: `Authorization: Bearer <TOKEN>`.
  - `jwt.verify`: Tiketnya asli gak? Dikeluarin sama server kita gak?
  - Kalau oke, tempel data user di `req.user`, lalu lanjut (`next()`).
  - Kalau gak oke, stop di sini, kirim Error 401.

#### � `upload.js`

- **Kegunaan**: Menangani file upload (Multer).
- **Logika**:
  - Terima file dari form.
  - Cek tipe file: Gambar (jpg/png) gak?
  - Simpan ke folder `backend/uploads`.
  - Ganti nama file jadi unik (biar gak nimpa file lain).

---

## 4. 📂 Folder `frontend/` (Wajah Aplikasi)

### � `frontend/src/main.jsx`

- **Kegunaan**: Titik awal React.
- **Logika**:
  - Cari elemen HTML dengan id `root` (`index.html`).
  - Tanam aplikasi React (`<App />`) di situ.
  - Pasang `AuthProvider` membungkus semuanya, biar data login bisa diakses di mana aja.

### 📄 `frontend/src/App.jsx`

- **Kegunaan**: Peta Navigasi (Router).
- **Logika**:
  - Fitur `ProtectedRoute`: Sebuah komponen penjaga.
  - Kalau User belum login -> Tendang ke `/login`.
  - Kalau User sudah login -> Boleh buka halaman Dashboard.

### 📄 `frontend/src/api.js`

- **Kegunaan**: Tukang Pos Pintar (Axios Config).
- **Fitur "Interceptor"**:
  - Setiap kali mau kirim surat (API Request), dia otomatis ngecek saku (LocalStorage).
  - Ada Token? Tempel di amplop suratnya (`Authorization` header).
  - Jadi kita gak perlu repot pasang token manual ratusan kali.

### 📂 `frontend/src/contexts/`

#### 📄 `AuthContext.jsx`

- **Kegunaan**: "Gudang Data Melayang" (Global State).
- **Kenapa Harus Ada**: Biar kita gak capek oper data `user` dari halaman Login -> App -> Navbar -> Sidebar (Prop Drilling).
- **Isi Gudang**:
  - `user`: Siapa yang lagi login?
  - `login()`: Fungsi buat masuk.
  - `logout()`: Fungsi buat keluar (hapus token).

### 📂 `frontend/src/hooks/`

#### 📄 `useAuth.js`

- **Kegunaan**: Remote Control buat Gudang Data tadi.
- **Isinya**: Cukup 1 baris `useContext(AuthContext)`.
- **Efeknya**: Di halaman manapun, kita tinggal tulis `const { user } = useAuth()` buat tau siapa yang login.

### 📂 `frontend/src/pages/`

#### 📄 `Login.jsx`

- **Logika**:
  - Ada form email & password.
  - Saat submit, panggil `api.post('/auth/login')`.
  - Dapat Token? Simpan ke LocalStorage.
  - Panggil `const { login } = useAuth()` biar satu aplikasi tau kita udah masuk.

#### 📄 `Dashboard.jsx`

- **Logika**:
  - Pas halaman dibuka (`useEffect`), panggil API `/items`.
  - Dapat data -> Tampilkan pakai komponen `CardItem`.

### 📂 `frontend/src/components/`

#### 📄 `Navbar.jsx`

- **Kecerdasan**:
  - Dia ngecek `useAuth()`.
  - `user` ada? Tampilkan nama user & tombol Logout.
  - `user` kosong? Tampilkan tombol Login.
  - `user.role === 'admin'`? Tampilkan menu Admin Panel.

#### 📄 `SidebarAdmin.jsx`

- **Kegunaan**: Menu samping khusus admin.
- **Logika**: Link navigasi ke Validasi Laporan, User List, dll.

---

## 5. Hubungan dengan Setup (Instalasi)

- Saat Anda jalankan `npm install`, dia membaca `package.json` di root, backend, dan frontend.
- Saat Anda jalankan `npm run dev`, dia menyalakan 2 terminal:
  1.  `backend/server.js` (Port 5000) -> Siap terima request.
  2.  `frontend` Vite Server (Port 3000) -> Siap tampilkan UI.
- Saat Anda setup Database, `backend/config/db.js` akan mencoba connect. Kalau file `.env` salah password, dia akan teriak error di terminal backend.

---

## Kesimpulan

Setiap file di sini ibarat organ tubuh.

- **Backend** = Otak & Jantung.
- **Frontend** = Wajah & Kulit.
- **Database** = Ingatan.
- **API/Axios** = Sistem Saraf yang menghubungkan semuanya.

Tidak ada file sampah. Semuanya punya peran vital agar aplikasi **Lost & Found** ini bisa berjalan lancar dan aman.
