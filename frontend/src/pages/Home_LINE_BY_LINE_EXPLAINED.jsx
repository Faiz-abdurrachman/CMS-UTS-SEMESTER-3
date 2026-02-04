/*
📌 FILE: Home.jsx
🧠 Fungsi file ini:
Halaman pertama yang dilihat user (landing page). Menampilkan hero, kotak cari, dan tiga daftar:
barang hilang (lost), barang temuan (found), barang yang sudah selesai (resolved). Data diambil
dari backend sekali saat halaman dibuka, lalu difilter di browser sesuai pencarian.
🔄 Alur singkat:
1. Komponen Home di-mount → useEffect jalan sekali → fetchItems() panggil API GET /items.
2. Data items disimpan di state; loading diset false.
3. lostItems, foundItems, resolvedItems = filter dari items (tanpa mengubah data asli).
4. User ketik di search → searchQuery berubah → filterItems() memfilter daftar yang tampil.
5. Tampilan: hero, input search, tiga section (masing-masing tampil loading / kosong / atau kartu-kartu item).
📦 Analogi dunia nyata:
Seperti papan pengumuman di lobi: ada judul besar, kotak "cari pengumuman", lalu tiga kelompok
pengumuman (hilang, ditemukan, sudah selesai). Petugas sekali ambil semua data dari gudang (API),
lalu menata di papan; kalau orang cari kata, yang tampil hanya yang cocok.
*/

// ========== IMPOR ==========
// `import` = mengambil kode dari file/modul lain agar bisa dipakai di file ini
// `{ useState, useEffect }` = dua "hook" dari React: useState untuk simpan data yang bisa berubah, useEffect untuk jalankan sesuatu (misal fetch) saat komponen muncul
import { useState, useEffect } from "react";
// `Link` = komponen untuk navigasi di dalam aplikasi tanpa reload halaman (seperti tombol "pindah halaman")
import { Link } from "react-router-dom";
// `api` = objek yang dipakai untuk panggil backend (GET/POST dll); sudah di-set base URL dan token
import api from "../api";
// `CardItem` = komponen untuk menampilkan satu kartu item (gambar, nama, status, lokasi, dll)
import CardItem from "../components/CardItem";

// `export default function Home` = mendefinisikan komponen bernama Home dan mengekspornya sebagai default (bisa di-import sebagai Home)
// `function Home()` = fungsi tanpa parameter; komponen React = fungsi yang mengembalikan JSX (tampilan)
export default function Home() {
  // ---------- STATE (data yang bisa berubah dan memicu ulang render) ----------
  // `const` = deklarasi variabel yang nilainya tidak akan diganti (reference-nya)
  // `[items, setItems]` = "array destructuring": useState mengembalikan array 2 elemen; elemen pertama = nilai saat ini, kedua = fungsi untuk mengubah nilai
  // `useState([])` = state awal berupa array kosong []; items = daftar item dari API, setItems = fungsi untuk mengisi/update items
  const [items, setItems] = useState([]);
  // `useState(true)` = state loading awal true (artinya "sedang loading"); setLoading dipakai untuk ubah jadi false setelah data diterima
  const [loading, setLoading] = useState(true);
  // `useState("")` = state searchQuery awal string kosong; isinya teks yang user ketik di kotak cari; setSearchQuery untuk mengubahnya
  const [searchQuery, setSearchQuery] = useState("");

  // ---------- useEffect: jalankan fetch sekali saat komponen pertama kali tampil ----------
  // `useEffect` = hook React: jalankan fungsi yang kita tulis di dalamnya
  // `(() => { ... })` = fungsi tanpa nama (arrow function); isinya fetchItems()
  // `, []` = dependency array kosong: artinya "jalankan hanya sekali setelah komponen mount (pasang ke DOM)"
  useEffect(() => {
    // Panggil fungsi fetchItems (ambil data dari backend)
    fetchItems();
  }, []);

  // ---------- Fungsi fetchItems: ambil data dari API ----------
  // `const fetchItems` = mendeklarasikan variabel fetchItems
  // `= async () => { ... }` = variabel ini berisi fungsi async (boleh pakai await di dalamnya); () = tidak ada parameter
  const fetchItems = async () => {
    // `try { ... }` = blok "coba jalankan"; kalau ada error, lompat ke catch
    try {
      // `const response` = variabel untuk menyimpan hasil panggilan API
      // `await` = tunggu sampai promise selesai (request HTTP ke server); tanpa await kita dapat Promise, bukan data
      // `api.get("/items")` = kirim request GET ke URL baseURL + "/items" (misal http://localhost:5000/api/items)
      const response = await api.get("/items");
      // `response.data` = isi body response dari server (biasanya array of item)
      // `setItems(response.data)` = mengisi state items dengan data tersebut; React akan re-render komponen
      setItems(response.data);
    // `catch (err)` = kalau ada error (jaringan gagal, server error, dll), err berisi info error
    } catch (err) {
      // `console.error` = mencetak error ke konsol browser (untuk debugging)
      console.error("Error fetching items:", err);
    // `finally { ... }` = blok ini selalu dijalankan setelah try/catch (sukses atau gagal)
    } finally {
      // `setLoading(false)` = tandai loading selesai; tampilan akan berubah dari spinner ke daftar/kosong
      setLoading(false);
    }
  };

  // ---------- Filter: pecah items jadi tiga kelompok ----------
  // `const lostItems` = variabel yang isinya hasil filter
  // `items.filter(...)` = method array: buat array baru berisi hanya elemen yang memenuhi kondisi di dalam fungsi
  // `(item) => { ... }` = fungsi callback: dipanggil untuk setiap item; return true = item masuk hasil, false = tidak
  const lostItems = items.filter((item) => {
    // `return` = mengembalikan nilai (true/false) untuk menentukan item ikut atau tidak
    // `item.status === "lost"` = status item harus string "lost" (barang hilang)
    // `&&` = dan; kedua kondisi harus true
    // `!item.resolved_at` = resolved_at harus falsy (null/undefined) = belum diselesaikan
    return item.status === "lost" && !item.resolved_at;
  });

  // Sama seperti lostItems, tapi status "found" dan belum resolved
  const foundItems = items.filter((item) => {
    return item.status === "found" && !item.resolved_at;
  });

  // Barang yang sudah diselesaikan (resolved_at ada isinya)
  const resolvedItems = items.filter((item) => {
    return item.resolved_at !== null;
  });

  // ---------- Fungsi filterItems: filter daftar berdasarkan searchQuery ----------
  // `(itemList)` = parameter: satu array (bisa lostItems, foundItems, dll)
  // Mengembalikan array yang hanya berisi item yang nama/deskripsi/lokasinya mengandung teks searchQuery
  const filterItems = (itemList) => {
    // Kalau searchQuery kosong, kembalikan itemList utuh (tidak filter)
    if (!searchQuery) return itemList;
    // `toLowerCase()` = ubah teks jadi huruf kecil agar pencarian tidak case-sensitive
    const query = searchQuery.toLowerCase();
    // Filter itemList: hanya item yang nama/deskripsi/lokasi mengandung query
    return itemList.filter(
      (item) =>
        // `includes(query)` = cek apakah string mengandung substring query
        // `item.location?.toLowerCase()` = optional chaining: kalau location null/undefined, tidak error, hasil undefined
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.location?.toLowerCase().includes(query)
    );
  };

  // ---------- return: yang "dikembalikan" = yang ditampilkan di layar (JSX) ----------
  // `return (` = kembalikan satu nilai; kurung buka ( untuk bisa menulis JSX multi-baris
  return (
    // `<div>` = elemen HTML div (kotak pembungkus); di React disebut JSX
    // `className="..."` = atribut untuk memberi class CSS (Tailwind: min-h-screen = tinggi minimal layar, bg-white = background putih)
    <div className="min-h-screen bg-white">
      {/* Hero Section: bagian atas dengan gradient hijau dan teks besar */}
      {/* `<div>` = pembungkus section hero; className = background gradient dari primary ke primary-light, teks putih */}
      <div className="bg-gradient-to-br from-primary to-primary-light text-white">
        {/* Container: lebar maksimal + padding; py-16 = padding atas-bawah, sm:/lg: = responsif */}
        <div className="container mx-auto px-4 py-16 sm:py-20 lg:py-24">
          <div className="max-w-4xl mx-auto text-center">
            {/* `<h1>` = heading tingkat 1 (judul paling besar); teks di bawahnya ditampilkan di sini */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6 leading-tight text-accent">
              Lost something?
              {/* `<br />` = line break (baris baru); di JSX tag void pakai /> */}
              <br />
              We've got your back!
            </h1>
            {/* `<p>` = paragraf */}
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 font-light">
              Look for lost item, found item, and report them
            </p>
            {/* Pembungkus dua tombol/link */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {/* `<Link>` = komponen React Router; seperti <a> tapi tidak reload; to="/register" = saat diklik URL ke /register */}
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-8 py-4 bg-accent text-primary font-semibold rounded-lg hover:bg-accent-dark transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {/* Teks yang tampil di dalam link */}
                Find your stuff here →
              </Link>
              {/* Link ke halaman login */}
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-lg hover:bg-white/20 transition-all duration-200 font-semibold"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="container mx-auto px-4 -mt-8 mb-12">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            {/* `<input>` = kotak isian; type="text"; placeholder = teks abu-abu saat kosong; value = searchQuery (controlled); onChange = setiap ketik panggil setSearchQuery(e.target.value) */}
            <input
              type="text"
              placeholder="Search item by the name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 pl-14 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-200 text-gray-700 placeholder-gray-400 shadow-sm"
            />
            {/* Ikon kaca pembesar (SVG); diposisikan di dalam kotak search (absolute left-4) */}
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Content: tiga section Lost, Found, Resolved */}
      <div className="container mx-auto px-4 py-12 pb-20">
        {/* Lost Items Section */}
        // `<section>` = elemen semantik untuk satu bagian konten
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-12 bg-primary rounded-full"></div>
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-primary mb-1">
                Lost Personal Items
              </h2>
              {/* {filterItems(lostItems).length} = ekspresi JS di JSX = jumlah item setelah filter; "item"/"items" tergantung jumlah */}
              <p className="text-gray-600 text-sm sm:text-base">
                {filterItems(lostItems).length} item
                {filterItems(lostItems).length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <p className="text-gray-600 mb-8 max-w-3xl text-sm sm:text-base leading-relaxed">
            Items that belong to users and went missing. Reports are created by
            item owners who lost their personal belongings.
          </p>
          {/* Ternari: loading ? spinner : (kosong ? pesan kosong : grid kartu); loading ? = kalau true tampilkan spinner */}
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filterItems(lostItems).length === 0 ? (
            <div className="bg-gray-50 rounded-xl p-12 text-center border-2 border-dashed border-gray-200">
              <p className="text-gray-500 text-lg">
                {searchQuery
                  ? "No items found matching your search"
                  : "No lost items reported yet"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* filterItems(lostItems).map = untuk tiap item buat satu CardItem; key={item.id} wajib di list React; item={item} = kirim data ke CardItem */}
              {filterItems(lostItems).map((item) => (
                <CardItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>

        {/* Found Items Section - struktur sama seperti Lost */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-12 bg-accent rounded-full"></div>
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-primary mb-1">
                Found Items
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">
                {filterItems(foundItems).length} item
                {filterItems(foundItems).length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <p className="text-gray-600 mb-8 max-w-3xl text-sm sm:text-base leading-relaxed">
            Items found by others (not their property). Waiting for the original
            owner.
          </p>
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filterItems(foundItems).length === 0 ? (
            <div className="bg-gray-50 rounded-xl p-12 text-center border-2 border-dashed border-gray-200">
              <p className="text-gray-500 text-lg">
                {searchQuery
                  ? "No items found matching your search"
                  : "No found items reported yet"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterItems(foundItems).map((item) => (
                <CardItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>

        {/* Resolved Items - hanya tampil kalau resolvedItems.length > 0; && = short-circuit: kiri true maka render kanan */}
        {resolvedItems.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-12 bg-blue-500 rounded-full"></div>
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-primary mb-1">
                  Resolved Items
                </h2>
                <p className="text-gray-600 text-sm sm:text-base">
                  {resolvedItems.length} item
                  {resolvedItems.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <p className="text-gray-600 mb-8 max-w-3xl text-sm sm:text-base leading-relaxed">
              Items that have been marked by admin as found/returned to the
              owner.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resolvedItems.map((item) => (
                <CardItem key={item.id} item={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
// Kurung tutup } mengakhiri function Home

/*
========== 🔄 ALUR EKSEKUSI FILE (STEP BY STEP) ==========
1. Browser memuat halaman yang route-nya "/" → React merender komponen Home.
2. Saat Home pertama kali "mount" (dipasang ke DOM), useState mengisi items=[], loading=true, searchQuery="".
3. useEffect dengan [] jalan sekali: memanggil fetchItems().
4. fetchItems: api.get("/items") kirim request ke backend; saat response sampai, setItems(response.data) dan setLoading(false).
5. Karena state berubah, React me-render ulang Home. Sekarang items berisi data, loading false.
6. lostItems, foundItems, resolvedItems dihitung dari items (filter).
7. filterItems adalah fungsi; dipanggil setiap render dengan lostItems/foundItems untuk tampilan; hasilnya tergantung searchQuery.
8. User melihat hero, search bar, dan tiga section. Kalau user ketik di search, onChange memanggil setSearchQuery → state berubah → re-render → filterItems memfilter → daftar yang tampil berubah.

========== 🧠 RINGKASAN VERSI MANUSIA AWAM ==========
Halaman ini seperti "papan pengumuman" utama: ada judul besar, kotak cari, lalu tiga kelompok pengumuman (barang hilang, barang ditemukan, barang sudah selesai). Data diambil sekali dari "server" saat halaman dibuka. Kalau kamu ketik di kotak cari, daftar yang tampil hanya yang cocok dengan kata yang kamu ketik. Tidak ada kode yang menghapus data; hanya "menyaring" yang ditampilkan.

========== 📘 GLOSARIUM ISTILAH (FILE INI) ==========
- import: mengambil kode dari file lain agar bisa dipakai di sini.
- useState: hook React untuk menyimpan data yang bisa berubah; mengubahnya bikin React "gambar ulang" tampilan.
- useEffect: hook React untuk menjalankan sesuatu (misal fetch) saat komponen muncul atau saat dependency berubah.
- dependency array ([]): daftar di useEffect; kosong = jalankan sekali saat mount.
- async/await: cara menulis kode yang menunggu hasil (misal request ke server); await = tunggu sampai selesai.
- filter: method array yang mengembalikan array baru berisi hanya elemen yang memenuhi kondisi.
- map: method array yang mengembalikan array baru; setiap elemen diubah jadi hasil fungsi (di sini jadi komponen CardItem).
- JSX: sintaks mirip HTML di dalam JavaScript; className, onClick, dll. Dipakai untuk mendeskripsikan tampilan.
- controlled input: nilai input (value) diikat ke state; onChange mengupdate state sehingga nilai input selalu = state.
- key: atribut wajib di list React agar React bisa melacak elemen; biasanya id unik.

========== ⚠️ KESALAHAN UMUM PEMULA + CONTOH ==========
1. Lupa key di map: {items.map((item) => <CardItem item={item} />)} → React warning "key prop". Benar: <CardItem key={item.id} item={item} />.
2. Fetch di dalam render tanpa useEffect: menulis fetchItems() langsung di body function → setiap render panggil API lagi → loop tak berujung. Harus pakai useEffect dengan dependency [].
3. Salah dependency useEffect: menaruh [items] → setiap items berubah, fetchItems jalan lagi → request berulang. Untuk "sekali saat buka" pakai [].
4. Menulis resolvedItems dengan filter yang sama seperti foundItems: di kode asli resolvedItems = filter resolved_at !== null; jangan tertukar dengan lost/found.
*/
