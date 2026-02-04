/*
📌 FILE: scripts/createAdmin.js

🧠 Fungsi file ini:
File ini adalah script CLI (command-line) untuk membuat satu user admin. Dijalankan sekali
dengan: node scripts/createAdmin.js atau npm run create-admin (dari folder backend). Script
meminta nama, email, dan password lewat terminal (readline), lalu cek email belum ada,
hash password dengan bcrypt, INSERT ke tabel users dengan role 'admin'. Bukan bagian dari
server HTTP; tidak dijalankan saat server jalan.

🔄 Alur singkat:
1. Buat interface readline (stdin/stdout).
2. Tanya nama, email, password (await question(...)).
3. Validasi tidak kosong; cek email belum ada di DB.
4. bcrypt.hash(password, 10) → INSERT users (name, email, hashedPassword, "admin").
5. Log sukses, rl.close(), process.exit(0). Error → process.exit(1).

📦 Analogi dunia nyata:
Seperti form sekali pakai di loket: petugas isi nama, email, password; sistem cek data,
simpan kartu admin, lalu selesai. Tidak perlu server nyala; ini "alat bantu setup" saja.
*/

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
    // readline = modul bawaan Node untuk baca input dari terminal
    const readline = require("readline");
    const rl = readline.createInterface({
      input: process.stdin,   // baca dari keyboard
      output: process.stdout, // tulis ke layar
    });

    // question jadi Promise agar bisa await; resolve dipanggil saat user tekan Enter
    const question = (query) =>
      new Promise((resolve) => rl.question(query, resolve));

    console.log("============================================");
    console.log("🔐 SETUP ADMIN ACCOUNT");
    console.log("============================================");
    console.log("");

    // await = tunggu user ketik lalu Enter; nilai kembalian = string yang diketik
    const name = await question("Masukkan nama admin: ");
    const email = await question("Masukkan email admin: ");
    const password = await question("Masukkan password admin: ");

    if (!name || !email || !password) {
      console.error("❌ Error: Semua field harus diisi!");
      rl.close();
      process.exit(1); // 1 = exit dengan kode error
    }

    // Cek email belum dipakai
    const [existingUsers] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      console.error("❌ Error: Email sudah terdaftar!");
      rl.close();
      process.exit(1);
    }

    console.log("⏳ Mengenkripsi password...");
    const hashedPassword = await bcrypt.hash(password, 10);

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
    process.exit(0); // 0 = sukses
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

// ============================================
// JALANKAN SCRIPT
// ============================================

createAdmin();

/*
---------- RINGKASAN ALUR FILE INI ----------
Jalankan script → tanya nama, email, password → validasi → cek email → hash → INSERT → log sukses → exit(0).

---------- ISTILAH YANG MUNCUL ----------
- readline: modul Node.js untuk input/output baris per baris di terminal.
- process.stdin / process.stdout: aliran input/output standar (keyboard, layar).
- process.exit(0/1): keluar dari proses; 0 = sukses, 1 = error (bisa dipakai oleh script lain yang memanggil).
- rl.question(query, cb): tampilkan query, panggil callback dengan jawaban; di sini dibungkus Promise agar bisa await.

---------- KESALAHAN UMUM PEMULA ----------
- Menjalankan script dari folder root tanpa cd backend → require("../config/db") gagal (path salah); jalankan dari backend.
- Lupa jalankan schema SQL dulu → tabel users tidak ada, INSERT error.
- Lupa set .env (DB_*) → pool tidak bisa konek, script error.
*/
