// ============================================
// FILE: api/index.js
// DESKRIPSI: Entry point untuk Vercel Serverless Functions
// File ini akan dijalankan oleh Vercel sebagai serverless function
// ============================================

const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// Import routes
const authRoutes = require("../backend/routes/authRoutes");
const itemRoutes = require("../backend/routes/itemRoutes");
const adminRoutes = require("../backend/routes/adminRoutes");

// Inisialisasi aplikasi Express
const app = express();

// ============================================
// MIDDLEWARE
// ============================================

// CORS - Allow semua origin untuk Vercel deployment
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder untuk uploads
// Di Vercel, file uploads perlu disimpan di external storage (nanti)
app.use("/uploads", express.static(path.join(__dirname, "../backend/uploads")));

// ============================================
// ROUTES
// ============================================

// Health check
app.get("/", (req, res) => res.json({ message: "Lost & Found API running" }));

// API Routes
// Note: Vercel sudah handle prefix /api untuk serverless functions
// Jadi kita tidak perlu tambahkan /api lagi di sini
app.use("/auth", authRoutes);
app.use("/items", itemRoutes);
app.use("/admin", adminRoutes);

// ============================================
// ERROR HANDLING
// ============================================

app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Terjadi kesalahan pada server",
    error: process.env.NODE_ENV === "development" ? err : {},
  });
});

// Export untuk Vercel Serverless Functions
// Vercel akan otomatis wrap Express app sebagai serverless function
module.exports = app;
