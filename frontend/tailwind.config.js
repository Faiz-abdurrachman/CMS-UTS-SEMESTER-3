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
        // Modern Green Color Scheme
        primary: {
          DEFAULT: "#2d5016", // Dark green for text/headings
          light: "#4a7c2a", // Medium green
          lighter: "#6b9a3e", // Light green
        },
        accent: {
          DEFAULT: "#a8d5ba", // Light green for buttons/accents
          dark: "#7fb896", // Darker accent
          light: "#c4e5d1", // Lighter accent
        },
        secondary: "#f5f5f5", // Light gray background
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Playfair Display", "serif"], // Elegant serif for headings
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
