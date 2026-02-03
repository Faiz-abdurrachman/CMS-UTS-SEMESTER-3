// ============================================
// FILE: api/index.js
// DESKRIPSI: Entry point untuk Vercel Serverless Functions
// ============================================

// Reuse konfigurasi server.js yang sudah lengkap (middleware, routes, dll)
// Ini menghindari duplikasi kode dan inkonsistensi
const app = require("../backend/server");

// Export app untuk Vercel
module.exports = app;
