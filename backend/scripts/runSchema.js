#!/usr/bin/env node
// ============================================
// Menjalankan schema.sql tanpa perlu CLI mysql.
// Pakai setelah MySQL/MariaDB server sudah jalan.
// Usage: cd backend && node scripts/runSchema.js
// ============================================

const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const schemaPath = path.join(__dirname, "..", "database", "schema.sql");

async function run() {
  const config = {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    multipleStatements: true,
    // Jangan set database dulu agar CREATE DATABASE dan USE bisa jalan
  };

  console.log("Menghubungkan ke MySQL di", config.host, "…");
  let conn;
  try {
    conn = await mysql.createConnection(config);
  } catch (err) {
    console.error("Gagal koneksi ke MySQL:", err.message);
    console.error("Pastikan MySQL/MariaDB sudah berjalan (systemctl start mysqld atau mariadb).");
    process.exit(1);
  }

  let sql = fs.readFileSync(schemaPath, "utf8");
  // Hapus komentar satu baris dan baris kosong berlebihan
  sql = sql.replace(/--[^\n]*/g, "").trim();
  const statements = sql
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  try {
    for (const stmt of statements) {
      await conn.query(stmt + ";");
    }
    console.log("Schema berhasil dijalankan. Database lostfound_db siap.");
  } catch (err) {
    console.error("Error menjalankan schema:", err.message);
    process.exit(1);
  } finally {
    await conn.end();
  }
}

run();
