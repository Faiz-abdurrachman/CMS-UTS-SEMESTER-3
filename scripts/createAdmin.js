// ============================================
// FILE: scripts/createAdmin.js
// DESKRIPSI: Script untuk membuat akun admin pertama
// CARA PAKAI: node scripts/createAdmin.js
// ============================================

const bcrypt = require("bcrypt");
const pool = require("../config/db");
require("dotenv").config();

// ============================================
// FUNGSI CREATE ADMIN
// ============================================

async function createAdmin() {
  try {
    // Input dari command line atau gunakan default
    const readline = require("readline");
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    // Fungsi untuk input
    const question = (query) =>
      new Promise((resolve) => rl.question(query, resolve));

    console.log("============================================");
    console.log("🔐 SETUP ADMIN ACCOUNT");
    console.log("============================================");
    console.log("");

    // Input data admin
    const name = await question("Masukkan nama admin: ");
    const email = await question("Masukkan email admin: ");
    const password = await question("Masukkan password admin: ");

    // Validasi
    if (!name || !email || !password) {
      console.error("❌ Error: Semua field harus diisi!");
      rl.close();
      process.exit(1);
    }

    // Cek apakah email sudah ada
    const [existingUsers] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      console.error("❌ Error: Email sudah terdaftar!");
      rl.close();
      process.exit(1);
    }

    // Hash password
    console.log("⏳ Mengenkripsi password...");
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert ke database
    console.log("⏳ Menyimpan ke database...");
    const [result] = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, "admin"]
    );

    console.log("");
    console.log("============================================");
    console.log("✅ ADMIN BERHASIL DIBUAT!");
    console.log("============================================");
    console.log(`ID: ${result.insertId}`);
    console.log(`Nama: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Role: admin`);
    console.log("");
    console.log(
      "💡 Sekarang kamu bisa login dengan email dan password tersebut"
    );
    console.log("   Pilih mode 'Admin' di halaman login");
    console.log("============================================");

    rl.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

// ============================================
// JALANKAN SCRIPT
// ============================================

createAdmin();

