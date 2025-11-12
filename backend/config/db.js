// ============================================
// FILE: config/db.js
// DESKRIPSI: Konfigurasi koneksi database MySQL menggunakan mysql2/promise
// ============================================

const mysql = require("mysql2/promise");
require("dotenv").config();

// ============================================
// KONFIGURASI CONNECTION POOL
// ============================================

// Membuat connection pool dengan mysql2/promise
// mysql2/promise langsung mengembalikan Promise, tidak perlu .promise()
// Pool lebih stabil karena reuse koneksi yang sudah ada
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost", // Host database
  user: process.env.DB_USER || "root", // Username MySQL
  password: process.env.DB_PASSWORD || "", // Password MySQL
  database: process.env.DB_NAME || "lostfound_db", // Nama database
  waitForConnections: true, // Tunggu jika semua koneksi sedang digunakan
  connectionLimit: 10, // Maksimal 10 koneksi dalam pool
});

// ============================================
// EXPORT
// ============================================

// Export pool langsung (sudah Promise-based)
module.exports = pool;
