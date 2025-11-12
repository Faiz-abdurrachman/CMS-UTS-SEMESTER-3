// ============================================
// FILE: routes/authRoutes.js
// DESKRIPSI: Routes untuk endpoint autentikasi
// ============================================

const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/authController");

// ============================================
// ROUTE DEFINITIONS
// ============================================

// POST /api/auth/register
// Endpoint untuk registrasi user baru
// Frontend akan POST ke: http://localhost:5000/api/auth/register
router.post("/register", ctrl.register);

// POST /api/auth/login
// Endpoint untuk login user
// Frontend akan POST ke: http://localhost:5000/api/auth/login
router.post("/login", ctrl.login);

// ============================================
// EXPORT ROUTER
// ============================================

module.exports = router;
