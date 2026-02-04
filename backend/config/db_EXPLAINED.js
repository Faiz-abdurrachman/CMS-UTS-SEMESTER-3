/*
📌 FILE: config/db.js

🧠 Fungsi file ini:
File ini hanya satu tugas: membuat "kolam koneksi" (connection pool) ke database MySQL
dan mengekspornya. Siapa pun yang butuh baca/tulis database (model User, Item, controller, dll)
akan require file ini dan pakai pool.query(...) untuk menjalankan SQL. Pool dipakai
agar koneksi dipakai ulang, tidak buka-tutup tiap request.

🔄 Alur singkat:
1. Load dotenv agar process.env terisi (DB_HOST, DB_USER, dll).
2. Buat pool dengan mysql.createPool(...) sekali.
3. Export pool; file lain yang require ini dapat object yang sama.

📦 Analogi dunia nyata:
Seperti loket bank: pool = beberapa teller (koneksi). Nasabah (request) datang,
ambil satu teller yang kosong, selesai urusan lalu teller kembali ke "pool" untuk
dipakai nasabah lain. Tidak perlu buka loket baru tiap nasabah.
*/

// ============================================
// FILE: config/db.js
// DESKRIPSI: Konfigurasi koneksi database MySQL menggunakan mysql2/promise
// ============================================

// mysql2/promise = library MySQL yang mengembalikan Promise (bisa pakai await), bukan callback
const mysql = require("mysql2/promise");
// Isi process.env dari file .env sebelum createPool dipanggil
require("dotenv").config();

// ============================================
// KONFIGURASI CONNECTION POOL
// ============================================

// createPool = buat sekumpulan koneksi; satu koneksi dipakai untuk satu query lalu dikembalikan ke pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",       // Alamat server MySQL (localhost = di komputer ini)
  user: process.env.DB_USER || "root",            // Username login MySQL
  password: process.env.DB_PASSWORD || "",        // Password MySQL (kosong biasa dipakai di XAMPP default)
  database: process.env.DB_NAME || "lostfound_db", // Nama database yang dipakai
  waitForConnections: true,   // Kalau semua koneksi sibuk, tunggu sampai ada yang kosong
  connectionLimit: 10,       // Maksimal 10 koneksi dalam pool
  // SSL untuk database di cloud (PlanetScale, Railway, dll); aktif kalau DB_SSL=true
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
  connectTimeout: 10000,     // Timeout 10 detik untuk connect
  acquireTimeout: 10000,
  timeout: 10000,
});

// ============================================
// EXPORT
// ============================================

// Ekspor pool; file lain: const pool = require("../config/db"); lalu pool.query("SELECT ...")
module.exports = pool;

/*
---------- RINGKASAN ALUR FILE INI ----------
1. require mysql2/promise dan dotenv.
2. createPool sekali dengan opsi dari process.env (atau default).
3. module.exports = pool. Tidak ada "jalan" otomatis; pool dipakai saat file lain memanggil pool.query().

---------- ISTILAH YANG MUNCUL ----------
- Connection pool: kumpulan koneksi database yang dipakai bergantian; efisien untuk banyak request.
- Promise: nilai yang mewakili hasil nanti (async); dipakai dengan .then() atau await.
- process.env: objek berisi variabel lingkungan (dari .env atau sistem); DB_HOST, DB_USER, dll.
- module.exports: cara Node.js mengekspor nilai; yang require file ini dapat nilai tersebut.

---------- KESALAHAN UMUM PEMULA ----------
- Lupa jalankan dotenv.config() sebelum createPool → process.env kosong, koneksi gagal atau pakai nilai salah.
- Menjalankan createPool di dalam setiap request → boros, harusnya satu pool untuk seluruh aplikasi.
- Salah nama database atau user/password di .env → error "Access denied" atau "Unknown database".
*/
