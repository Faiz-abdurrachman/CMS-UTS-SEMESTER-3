/*
📌 FILE: postcss.config.js (versi dijelaskan baris per baris)
🧠 Fungsi file ini:
   Konfigurasi PostCSS: daftar plugin yang diproses (tailwindcss dan autoprefixer). PostCSS
   memproses CSS (misal file yang punya @tailwind) dan mengubahnya; Tailwind memakai @tailwind
   dan generate utility; autoprefixer menambah vendor prefix.
🔄 Alur singkat:
   1. Export default objek dengan properti plugins.
   2. plugins = { tailwindcss: {}, autoprefixer: {} } = pakai dua plugin dengan opsi kosong (default).
📦 Analogi dunia nyata:
   Seperti "rantai pengolahan": CSS kita lewatkan ke Tailwind (olah @tailwind jadi ribuan class)
   lalu ke Autoprefixer (tambah -webkit-, -moz- di mana perlu). Hasilnya satu file CSS siap pakai.
*/

// export default = mengekspor satu nilai (objek konfigurasi PostCSS)
export default {
  // plugins = objek yang berisi plugin PostCSS; key = nama plugin, value = opsi (bisa objek kosong)
  plugins: {
    // tailwindcss = plugin resmi Tailwind; memproses @tailwind base/components/utilities dan generate CSS
    tailwindcss: {},

    // autoprefixer = plugin yang menambah vendor prefix (misal -webkit-, -moz-) agar CSS jalan di browser lama
    autoprefixer: {},
  },
};

/*
🔄 Alur eksekusi file (step by step)
1. Saat build (Vite) atau saat tool memproses CSS, PostCSS dimuat.
2. PostCSS baca postcss.config.js → dapat plugins { tailwindcss, autoprefixer }.
3. Untuk setiap file CSS: pertama lewat tailwindcss (expand @tailwind, generate class), lalu lewat autoprefixer (tambah prefix).
4. Output CSS ditulis ke file atau dikonsumsi oleh Vite untuk bundle.

🧠 Ringkasan versi manusia awam
   "postcss.config.js itu daftar dua 'mesin': Tailwind (ubah @tailwind jadi banyak class) dan
   Autoprefixer (tambah awalan -webkit- dll agar cocok di berbagai browser). Keduanya dipakai
   saat CSS kita diolah."

📘 Glosarium
   - PostCSS: alat yang memproses CSS dengan plugin (transform, add prefix, dll).
   - tailwindcss (plugin): membaca @tailwind dan konfigurasi Tailwind, mengeluarkan CSS utility.
   - autoprefixer: menambah vendor prefix otomatis (misal flexbox untuk IE/Safari lama).
   - plugins: objek nama plugin → opsi; {} = opsi default.

⚠️ Kesalahan umum pemula + contoh
   - Menghapus tailwindcss dari plugins → @tailwind tidak diproses, class Tailwind tidak ada.
   - Urutan plugin penting: biasanya tailwindcss dulu, baru autoprefixer (Tailwind output perlu di-prefix).
   - PostCSS tidak terpasang atau tidak dipanggil oleh Vite → pastikan Vite memakai PostCSS untuk file .css (biasanya otomatis jika ada postcss.config.js).
*/
