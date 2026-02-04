/*
📌 FILE: tailwind.config.js
🧠 Fungsi: Konfigurasi Tailwind + DaisyUI. content = file yang di-scan untuk class; theme.extend = warna (primary, accent) dan font; plugin DaisyUI dengan tema light.
🔄 Alur: Saat build/dev, Tailwind baca config → generate CSS untuk class yang dipakai di content. Theme dipakai oleh class bg-primary, text-accent, font-display, dll.
📦 Analogi: Seperti daftar palet warna dan font gedung: "primary = hijau ini", "accent = hijau muda ini"; semua ruangan pakai aturan itu.
*/

// ============================================
// FILE: tailwind.config.js
// DESKRIPSI: Konfigurasi TailwindCSS dengan DaisyUI - Modern Green Theme
// ============================================

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2d5016",
          light: "#4a7c2a",
          lighter: "#6b9a3e",
        },
        accent: {
          DEFAULT: "#a8d5ba",
          dark: "#7fb896",
          light: "#c4e5d1",
        },
        secondary: "#f5f5f5",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Playfair Display", "serif"],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          primary: "#2d5016",
          secondary: "#f5f5f5",
          accent: "#a8d5ba",
          neutral: "#3d4451",
          "base-100": "#ffffff",
          "base-200": "#f9fafb",
          "base-300": "#f3f4f6",
        },
      },
    ],
  },
};

/*
---------- RINGKASAN: content + theme.extend (colors, fontFamily) + plugins daisyui + daisyui.themes.
---------- ISTILAH: content = file yang di-scan (tree-shaking); theme.extend = tambah/override utility; require("daisyui") = plugin komponen.
---------- KESALAHAN PEMULA: Salah path content (misal tidak include src/) → class dari komponen tidak ter-generate. Menambah warna baru tapi lupa extend → tidak bisa pakai.
*/
