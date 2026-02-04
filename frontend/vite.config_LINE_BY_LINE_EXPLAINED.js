/*
📌 FILE: vite.config.js (versi dijelaskan baris per baris)
🧠 Fungsi file ini:
   Konfigurasi Vite: plugin React, port dev server, host, opsi buka browser, dan proxy /api
   ke backend (localhost:5000). Dipakai saat npm run dev dan saat build.
🔄 Alur singkat:
   1. Import defineConfig dari Vite dan plugin react.
   2. Export hasil defineConfig({ plugins, server: { port, host, open, proxy } }).
📦 Analogi dunia nyata:
   Seperti "pengaturan mesin": Vite butuh tahu pakai React (plugin), di port mana server dev
   jalan, dan kalau frontend minta /api, permintaan itu diteruskan ke backend.
*/

// import = mengambil dari modul
// defineConfig = fungsi dari Vite yang membantu autocomplete dan validasi tipe konfigurasi
import { defineConfig } from "vite";

// react = plugin Vite agar bisa compile JSX dan hot-reload untuk React
import react from "@vitejs/plugin-react";

// export default = mengekspor satu nilai utama (objek konfigurasi)
// defineConfig({ ... }) = meneruskan objek konfig ke Vite; Vite akan pakai ini saat dev/build
export default defineConfig({
  // plugins = array plugin; react() = panggil plugin React (mengaktifkan JSX, Fast Refresh, dll)
  plugins: [react()],

  // server = konfigurasi development server (hanya dipakai saat npm run dev)
  server: {
    // port = nomor port; 3000 = server dev frontend jalan di http://localhost:3000
    port: 3000,

    // host = alamat yang didengarkan; "0.0.0.0" = dengarkan semua interface (bisa akses dari HP/lan)
    host: "0.0.0.0",

    // open = true = saat dev server start, otomatis buka browser
    open: true,

    // proxy = meneruskan request tertentu ke server lain (di sini backend)
    proxy: {
      // "/api" = path yang akan di-proxy; request dari frontend ke /api/* akan dikirim ke target
      "/api": {
        // target = alamat backend (server Express di port 5000)
        target: "http://localhost:5000",
        // changeOrigin = ubah header Origin ke target (perlu untuk beberapa server)
        changeOrigin: true,
      },
    },
  },
});

/*
🔄 Alur eksekusi file (step by step)
1. Vite (atau npm run dev) memuat konfigurasi: import defineConfig dan react, lalu export defineConfig(...).
2. Saat dev: Vite pakai plugins ([react()]) untuk compile JSX; server { port, host, open, proxy } dipakai.
3. Request dari browser ke http://localhost:3000/api/items → Vite proxy meneruskan ke http://localhost:5000/api/items.
4. Saat build (npm run build): hanya plugins yang dipakai; server tidak dipakai.

🧠 Ringkasan versi manusia awam
   "vite.config.js itu pengaturan Vite: pakai plugin React, jalankan dev server di port 3000,
   buka browser otomatis, dan semua request ke /api diteruskan ke backend (port 5000)."

📘 Glosarium
   - Vite: build tool dan dev server (cepat, ES modules native).
   - defineConfig: helper agar konfig punya type hint (bukan wajib).
   - plugins: daftar plugin (React plugin = compile JSX, HMR).
   - proxy: forward request path tertentu ke server lain (menghindari CORS di dev).
   - changeOrigin: mengubah header Origin request ke target.

⚠️ Kesalahan umum pemula + contoh
   - Backend tidak jalan di 5000 tapi proxy tetap "localhost:5000" → request /api gagal; sesuaikan target.
   - Lupa plugins: [react()] → JSX tidak ter-compile, error "Unexpected token <".
   - Production: proxy ini hanya untuk dev; di production pastikan API di-serve dari domain yang sama atau CORS di backend di-set.
*/
