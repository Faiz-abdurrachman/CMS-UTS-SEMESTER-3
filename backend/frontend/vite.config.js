// ============================================
// FILE: vite.config.js
// DESKRIPSI: Konfigurasi Vite (build tool untuk React)
// ============================================

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()], // Plugin untuk support React JSX
  server: {
    port: 3000, // Port untuk development server
    open: true, // Otomatis buka browser saat dev server start
    proxy: {
      // Proxy untuk API requests
      // Semua request ke /api akan di-forward ke backend (port 5000)
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
