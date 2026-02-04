/*
📌 FILE: vite.config.js
🧠 Fungsi: Konfigurasi Vite (dev server + build). Plugin React agar JSX jalan; server port 3000, proxy /api ke backend 5000.
🔄 Alur: npm run dev → Vite baca config → dev server di 3000, request /api di-forward ke 5000. npm run build → bundle untuk production.
📦 Analogi: Seperti pengaturan "penerima tamu": tamu (request) ke /api disambungkan ke ruang backend (port 5000).
*/

// ============================================
// FILE: vite.config.js
// DESKRIPSI: Konfigurasi Vite (build tool untuk React)
// ============================================

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: "0.0.0.0",
    open: true,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});

/*
---------- RINGKASAN: defineConfig + plugins react + server port/proxy. ISTILAH: proxy = forward request; changeOrigin = ubah header Host.
---------- KESALAHAN PEMULA: Salah target proxy (misal port 5001) → API request 404 atau salah server.
*/
