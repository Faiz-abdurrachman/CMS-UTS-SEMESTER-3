// ============================================
// FILE: server.js
// DESKRIPSI: File utama server Express.js
// ============================================

// Import modul yang diperlukan
const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// Import routes
const authRoutes = require("./routes/authRoutes");
const itemRoutes = require("./routes/itemRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Inisialisasi aplikasi Express
// express() membuat instance aplikasi Express yang akan menangani HTTP requests
const app = express();

// ============================================
// MIDDLEWARE
// ============================================

// CORS (Cross-Origin Resource Sharing)
// Memungkinkan frontend (port 3000) mengakses backend (port 5000)
// Tanpa ini, browser akan memblokir request dari origin berbeda
app.use(
  cors({
    origin: "http://localhost:3000", // URL frontend React
    credentials: true, // Izinkan cookies/credentials dikirim
  })
);

// express.json() - Middleware untuk parsing JSON
// Ketika frontend mengirim data JSON (misal: {username: "user", password: "pass"}),
// Express akan otomatis mengubahnya menjadi JavaScript object di req.body
// Tanpa ini, req.body akan undefined
app.use(express.json());

// express.urlencoded() - Middleware untuk parsing form data
// Berguna jika ada form yang dikirim dengan Content-Type: application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Static folder untuk uploads
// Memungkinkan akses file upload via URL: http://localhost:5000/uploads/filename.jpg
// path.join(__dirname, ...) membuat path absolut ke folder uploads
app.use(
  "/uploads",
  express.static(path.join(__dirname, process.env.UPLOAD_DIR || "uploads"))
);

// ============================================
// ROUTES
// ============================================

// Route untuk testing apakah server berjalan
// GET http://localhost:5000/
app.get("/", (req, res) => res.send("Lost & Found API running"));

// Route untuk autentikasi (register, login)
// Semua request ke /api/auth/* akan dihandle oleh authRoutes
app.use("/api/auth", authRoutes);

// Route untuk items (lost & found)
// Semua request ke /api/items/* akan dihandle oleh itemRoutes
app.use("/api/items", itemRoutes);

// Route untuk admin
// Semua request ke /api/admin/* akan dihandle oleh adminRoutes
app.use("/api/admin", adminRoutes);

// ============================================
// ERROR HANDLING MIDDLEWARE
// ============================================

// Middleware untuk menangani error yang tidak tertangkap
// Ini harus diletakkan di akhir, setelah semua routes
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Terjadi kesalahan pada server",
    error: process.env.NODE_ENV === "development" ? err : {},
  });
});

// ============================================
// SERVER LISTENING
// ============================================

// Ambil port dari environment variable atau gunakan default 5000
const PORT = process.env.PORT || 5000;

// Start server dan listen di port tertentu
// Callback function akan dipanggil ketika server berhasil start
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
  console.log(`📡 Siap menerima request dari frontend`);
});
