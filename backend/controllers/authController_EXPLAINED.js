/*
📌 FILE: controllers/authController.js

🧠 Fungsi file ini:
File ini menangani dua aksi: (1) Register = daftar user baru: cek email belum dipakai,
hash password, simpan ke database dengan role "user"; (2) Login = cek email + password,
kalau cocok buat JWT token dan kirim token + data user ke frontend. Semua dipanggil
lewat route POST /api/auth/register dan POST /api/auth/login.

🔄 Alur singkat:
1. Register: ambil name, email, password dari req.body → tolak kalau ada role selain "user" →
   validasi wajib → cek email sudah ada → hash password → User.create → response 201.
2. Login: ambil email, password → cari user by email → bandingkan password (bcrypt) →
   buat token JWT → response 200 + token + user (tanpa password).

📦 Analogi dunia nyata:
Seperti petugas pendaftaran dan petugas loket: register = daftar kartu anggota (cek data,
simpan dengan password yang di-amankan); login = tunjuk kartu (cek identitas), dapat
"stempel" (token) untuk dipakai masuk ruang lain.
*/

// ============================================
// FILE: controllers/authController.js
// DESKRIPSI: Controller untuk handle logika autentikasi (register & login)
// ============================================

// Model User = fungsi query ke tabel users (findByEmail, create, emailExists)
const User = require("../models/User");
// bcrypt = library untuk hash password (encode) dan bandingkan password dengan hash
const bcrypt = require("bcrypt");
// jwt = library untuk membuat dan memverifikasi token JWT
const jwt = require("jsonwebtoken");

// ============================================
// REGISTER USER
// ============================================

// exports.register = fungsi yang diekspor; async = boleh pakai await di dalam
// req = object request (body, params, headers); res = object response (status, json, send)
exports.register = async (req, res) => {
  try {
    // 1️⃣ Ambil data dari body request (frontend kirim JSON: name, email, password)
    const { name, email, password, role } = req.body;

    // ============================================
    // PROTEKSI: JANGAN PERNAH TERIMA ROLE DARI REQUEST
    // ============================================

    // Kalau client kirim role dan bukan "user" (misal "admin"), tolak: keamanan agar tidak bisa daftar jadi admin
    if (role && role !== "user") {
      return res.status(403).json({
        message:
          "Forbidden: Cannot register as admin. Admin accounts are created manually.",
      });
    }

    // ============================================
    // VALIDASI INPUT
    // ============================================

    // 400 = Bad Request; return menghentikan fungsi dan kirim response
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // ============================================
    // CEK EMAIL SUDAH ADA
    // ============================================

    // await = tunggu Promise selesai; emailExists mengembalikan true/false
    const emailExists = await User.emailExists(email);

    if (emailExists) {
      return res.status(400).json({ message: "Email exists" });
    }

    // ============================================
    // HASH PASSWORD
    // ============================================

    // bcrypt.hash(plainPassword, 10) = ubah password jadi string acak (hash); 10 = tingkat kesulitan
    const hashedPassword = await bcrypt.hash(password, 10);

    // ============================================
    // SIMPAN KE DATABASE
    // ============================================

    // User.create mengembalikan insertId (id user baru); role dipaksa "user"
    const userId = await User.create(name, email, hashedPassword, "user");

    // ============================================
    // KIRIM RESPONSE SUKSES
    // ============================================

    // 201 = Created; res.json = kirim response body format JSON
    res.status(201).json({
      message: "Registered",
      userId: userId,
    });
  } catch (err) {
    // Tangkap error tak terduga (misal DB down); 500 = Server Error
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ============================================
// LOGIN USER
// ============================================

// Login: terima email + password, cek di DB, kalau cocok kasih token
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ============================================
    // CEK USER DI DATABASE
    // ============================================

    // findByEmail mengembalikan satu object user atau null
    const user = await User.findByEmail(email);

    if (!user) {
      // Pesan sama untuk "email salah" dan "password salah" agar tidak bocor info
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // ============================================
    // VERIFIKASI PASSWORD
    // ============================================

    // bcrypt.compare = bandingkan password plain dengan hash di DB; return true/false
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // ============================================
    // GENERATE JWT TOKEN
    // ============================================

    // jwt.sign(payload, secret, options) = buat token berisi id & role, ditandatangani dengan JWT_SECRET, berlaku 7 hari
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ============================================
    // KIRIM RESPONSE SUKSES
    // ============================================

    // Jangan kirim password ke client; hanya id, name, email, role
    res.json({
      token: token,
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

/*
---------- RINGKASAN ALUR FILE INI ----------
Register: validasi → cek email → hash password → User.create("user") → 201 + userId.
Login: findByEmail → bcrypt.compare → jwt.sign → 200 + token + user (tanpa password).

---------- ISTILAH YANG MUNCUL ----------
- req.body: isi body request (setelah di-parse middleware express.json()).
- res.status(kode).json(obj): kirim response HTTP dengan kode status dan body JSON.
- Hash: hasil enkripsi satu arah; password tidak disimpan mentah.
- JWT: token berisi payload (id, role) yang ditandatangani; client kirim di header Authorization.
- exports.nama: cara Node.js mengekspor fungsi agar bisa require di file lain.

---------- KESALAHAN UMUM PEMULA ----------
- Menyimpan password plain text (tanpa bcrypt) → bahaya keamanan.
- Menerima role dari req.body dan menyimpan ke DB → user bisa daftar jadi admin.
- Mengirim object user lengkap (termasuk password) di response login → kebocoran data.
- Lupa await pada User.findByEmail / bcrypt.compare → dapat Promise, bukan nilai, logic salah.
*/
