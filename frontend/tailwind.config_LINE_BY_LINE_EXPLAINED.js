/*
📌 FILE: tailwind.config.js (versi dijelaskan baris per baris)
🧠 Fungsi file ini:
   Konfigurasi Tailwind CSS: file mana yang di-scan untuk class (content), warna/font kustom
   (primary, accent, fontFamily), dan plugin DaisyUI dengan tema light.
🔄 Alur singkat:
   1. Export default objek config.
   2. content = path file yang di-scan (agar hanya class yang dipakai yang di-generate).
   3. theme.extend = warna primary/accent, fontFamily sans dan display.
   4. plugins = [daisyui]; daisyui.themes = tema light dengan warna.
📦 Analogi dunia nyata:
   Seperti "palet warna dan daftar font" proyek: kita tentukan warna utama (hijau), aksen,
   dan font (Inter, Playfair Display). Tailwind dan DaisyUI pakai ini untuk generate class.
*/

/** @type {import('tailwindcss').Config} */
// Baris di atas = JSDoc type hint (untuk IDE); memberitahu bahwa objek ini bertipe Config Tailwind

// export default = mengekspor satu nilai (objek konfigurasi)
export default {
  // content = array path/file yang akan di-scan Tailwind untuk menemukan class yang dipakai
  // Hanya class yang benar-benar muncul di file ini yang akan ada di CSS output (tree-shaking)
  // "./index.html" = file HTML root; "./src/**/*.{js,ts,jsx,tsx}" = semua file js/ts/jsx/tsx di src
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  // theme = kustomisasi tema Tailwind (warna, font, spacing, dll)
  theme: {
    // extend = menambah/mengoverride tanpa menghapus default Tailwind
    extend: {
      // colors = menambah nama warna kustom; bisa dipakai seperti bg-primary, text-accent
      colors: {
        // primary = warna utama (hijau gelap); DEFAULT = dipakai saat tulis "primary" saja
        primary: {
          DEFAULT: "#2d5016",
          light: "#4a7c2a",
          lighter: "#6b9a3e",
        },
        // accent = warna aksen (hijau muda untuk tombol, badge)
        accent: {
          DEFAULT: "#a8d5ba",
          dark: "#7fb896",
          light: "#c4e5d1",
        },
        // secondary = abu-abu sangat muda (background)
        secondary: "#f5f5f5",
      },
      // fontFamily = nama font; sans = untuk teks biasa; display = untuk heading
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Playfair Display", "serif"],
      },
    },
  },

  // plugins = array plugin Tailwind; require("daisyui") = load plugin DaisyUI (komponen UI)
  plugins: [require("daisyui")],

  // daisyui = konfigurasi khusus plugin DaisyUI (bukan bagian standar Tailwind)
  daisyui: {
    // themes = daftar tema; kita pakai satu tema bernama "light" dengan warna kustom
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
🔄 Alur eksekusi file (step by step)
1. Saat build (atau dev), Tailwind/PostCSS memuat file ini.
2. content dipakai untuk scan file → kumpulkan class (misal bg-primary, font-display) → generate CSS hanya untuk itu.
3. theme.extend dipakai: warna primary/accent/secondary dan fontFamily tersedia di utility class.
4. Plugin DaisyUI ditambahkan; tema "light" dipakai untuk komponen DaisyUI (btn, dropdown, dll).

🧠 Ringkasan versi manusia awam
   "tailwind.config.js itu aturan Tailwind: (1) cari class di index.html dan semua file di src,
   (2) tambah warna (primary hijau, accent hijau muda) dan font (Inter, Playfair Display),
   (3) pakai DaisyUI dengan satu tema light."

📘 Glosarium
   - content: path file yang di-scan Tailwind (tree-shaking: hanya class yang dipakai yang di-generate).
   - theme.extend: menambah/mengoverride tema tanpa mengganti default.
   - DEFAULT (dalam primary): nilai saat pakai "primary" saja (bg-primary = #2d5016).
   - DaisyUI: plugin Tailwind yang menambah komponen siap pakai (button, dropdown, modal, dll).
   - themes (daisyui): definisi tema (warna) untuk komponen DaisyUI.

⚠️ Kesalahan umum pemula + contoh
   - Lupa menambah path di content → class dari file baru tidak di-generate, tampilan "tidak ada style".
   - Salah eja nama warna (misal primery) → class tidak ada; pastikan sama dengan yang dipakai di JSX.
   - DaisyUI tidak terpasang (npm install) tapi plugins: [require("daisyui")] → error "Cannot find module 'daisyui'".
*/
