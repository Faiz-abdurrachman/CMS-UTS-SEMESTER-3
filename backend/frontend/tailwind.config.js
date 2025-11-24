// ============================================
// FILE: tailwind.config.js
// DESKRIPSI: Konfigurasi TailwindCSS dengan DaisyUI
// ============================================

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb", // Biru utama
        secondary: "#f3f4f6", // Abu muda
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          primary: "#2563eb",
          secondary: "#f3f4f6",
          accent: "#10b981",
          neutral: "#3d4451",
          "base-100": "#ffffff",
        },
      },
    ],
  },
};
