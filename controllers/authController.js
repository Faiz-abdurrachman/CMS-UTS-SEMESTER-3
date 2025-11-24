// ============================================
// FILE: controllers/authController.js
// DESKRIPSI: Controller untuk handle logika autentikasi (register & login)
// ============================================

const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ============================================
// REGISTER USER
// ============================================

// Fungsi untuk register user baru
// req = request object (berisi data dari frontend)
// res = response object (untuk mengirim response ke frontend)
exports.register = async (req, res) => {
  try {
    // Ambil data dari request body
    // Frontend akan mengirim: { name, email, password }
    const { name, email, password, role } = req.body;

    // ============================================
    // PROTEKSI: JANGAN PERNAH TERIMA ROLE DARI REQUEST
    // ============================================

    // Jika ada role di request body, tolak (untuk keamanan)
    // Registrasi hanya untuk user biasa, admin dibuat manual
    if (role && role !== "user") {
      return res.status(403).json({
        message:
          "Forbidden: Cannot register as admin. Admin accounts are created manually.",
      });
    }

    // ============================================
    // VALIDASI INPUT
    // ============================================

    // Cek apakah semua field terisi
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // ============================================
    // CEK EMAIL SUDAH ADA
    // ============================================

    // Cek apakah email sudah terdaftar menggunakan model
    const emailExists = await User.emailExists(email);

    // Jika email sudah ada, kirim error
    if (emailExists) {
      return res.status(400).json({ message: "Email exists" });
    }

    // ============================================
    // HASH PASSWORD
    // ============================================

    // bcrypt.hash() akan mengenkripsi password
    // Salt rounds = 10 berarti kompleksitas enkripsi (semakin tinggi, semakin aman tapi lebih lambat)
    // JANGAN PERNAH simpan password dalam bentuk plain text!
    const hashedPassword = await bcrypt.hash(password, 10);

    // ============================================
    // SIMPAN KE DATABASE
    // ============================================

    // Insert user baru ke database menggunakan model
    // PASTIKAN role selalu "user" (tidak bisa diubah dari request)
    // Admin hanya bisa dibuat manual di database atau oleh admin yang sudah login
    const userId = await User.create(name, email, hashedPassword, "user");

    // ============================================
    // KIRIM RESPONSE SUKSES
    // ============================================

    res.status(201).json({
      message: "Registered",
      userId: userId,
    });
  } catch (err) {
    // Tangkap error dan kirim response error
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ============================================
// LOGIN USER
// ============================================

// Fungsi untuk login user
exports.login = async (req, res) => {
  try {
    // Ambil data dari request body
    const { email, password } = req.body;

    // ============================================
    // CEK USER DI DATABASE
    // ============================================

    // Cari user berdasarkan email menggunakan model
    const user = await User.findByEmail(email);

    // Jika user tidak ditemukan
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // ============================================
    // VERIFIKASI PASSWORD
    // ============================================

    // bcrypt.compare() membandingkan password plain text dengan hash
    // Return true jika cocok, false jika tidak
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // ============================================
    // GENERATE JWT TOKEN
    // ============================================

    // JWT (JSON Web Token) digunakan untuk autentikasi
    // Token ini akan dikirim ke frontend dan digunakan untuk request selanjutnya
    const token = jwt.sign(
      { id: user.id, role: user.role }, // Payload: id dan role user
      process.env.JWT_SECRET, // Secret key untuk sign token
      { expiresIn: "7d" } // Token berlaku selama 7 hari
    );

    // ============================================
    // KIRIM RESPONSE SUKSES
    // ============================================

    res.json({
      token: token, // Kirim token ke frontend
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
