// ============================================
// FILE: server.js
// DESKRIPSI: File utama server Express.js
// ============================================

// Import modul yang diperlukan
const express = require("express");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
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

// Security Middleware
app.use(helmet()); // Protects various HTTP headers

// Rate Limiting (Prevent Brute Force/Spam)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later",
});
app.use(limiter);

// CORS (Cross-Origin Resource Sharing)
// Memungkinkan frontend (port 3000) mengakses backend (port 5000)
// Tanpa ini, browser akan memblokir request dari origin berbeda
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000", // URL frontend React
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
// Cross-Origin-Resource-Policy: cross-origin agar gambar bisa ditampilkan di frontend (port 3000)
// tanpa ini, Helmet set CORP same-origin dan browser blokir gambar dari port 5000
app.use(
  "/uploads",
  (req, res, next) => {
    res.set("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  },
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

// Start server dan listen di port tertentu hanya jika dijalankan langsung
// Jika di-import (oleh Vercel api/index.js), jangan listen, tapi export app
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
    console.log(`📡 Siap menerima request dari frontend`);
  });
}

module.exports = app;
