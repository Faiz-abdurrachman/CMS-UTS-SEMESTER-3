/*
📌 FILE: SidebarAdmin.jsx (versi dijelaskan baris per baris)
🧠 Fungsi file ini:
   Sidebar untuk halaman admin: judul "Found It! Admin Panel", dua tombol navigasi (Manage Reports, Manage Users),
   dan info user (nama, email) di bawah. Di mobile: sidebar disembunyikan default, tombol toggle + overlay;
   di desktop (lg) sidebar selalu terlihat.
🔄 Alur singkat:
   1. Props: activeTab, setActiveTab (dari parent untuk tab aktif).
   2. State: isOpen (mobile menu buka/tutup), user (dari localStorage, untuk tampil nama/email).
   3. useEffect: baca user dari localStorage, setUser.
   4. Return: tombol toggle (mobile); overlay jika isOpen; aside sidebar dengan nav (items, users) dan blok user info.
📦 Analogi dunia nyata:
   Seperti menu samping di dashboard admin: dua pilihan "Manage Reports" dan "Manage Users", dan di bawah nama admin. Di HP ada tombol hamburger untuk buka/tutup menu.
*/

// import useState (state) dan useEffect (efek samping) dari React
import { useState, useEffect } from "react";

// export default = ekspor utama; function SidebarAdmin({ activeTab, setActiveTab }) = komponen dengan dua props
// activeTab = string tab yang aktif ("items" atau "users"); setActiveTab = fungsi untuk mengubah tab (dipanggil parent)
export default function SidebarAdmin({ activeTab, setActiveTab }) {
  // useState(false) = state boolean; isOpen = apakah menu mobile terbuka; setIsOpen = setter
  const [isOpen, setIsOpen] = useState(false);

  // user = state untuk data user (nama, email); awal null; diisi dari localStorage di useEffect
  const [user, setUser] = useState(null);

  // useEffect dengan dependency [] = jalankan sekali setelah mount
  useEffect(() => {
    // localStorage.getItem("user") = string JSON yang disimpan saat login (atau null)
    const userData = localStorage.getItem("user");
    if (userData) {
      // JSON.parse = ubah string JSON jadi objek; setUser = isi state user
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    // Fragment <> </> = bungkus beberapa elemen tanpa menambah elemen DOM
    <>
      {/* Tombol toggle menu: hanya tampil di mobile (lg:hidden); fixed top-left; klik ubah isOpen */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-primary text-white rounded-lg shadow-lg hover:bg-primary-light transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Overlay: hanya di mobile (lg:hidden); tampil jika isOpen; klik tutup menu */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar: fixed di mobile (inset-y-0 left-0), static di lg; lebar w-64; transform translate untuk slide in/out */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-primary text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Title */}
          <div className="p-6 border-b border-white/10">
            <h1 className="text-2xl font-display font-bold">Found It!</h1>
            <p className="text-xs text-white/60 mt-1">Admin Panel</p>
          </div>

          {/* Navigation: dua tombol; aktif sesuai activeTab */}
          <nav className="flex-1 p-4 space-y-2">
            <button
              onClick={() => {
                setActiveTab("items");
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeTab === "items"
                  ? "bg-accent text-primary"
                  : "hover:bg-white/10 text-white/80"
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span className="font-medium">Manage Reports</span>
            </button>
            <button
              onClick={() => {
                setActiveTab("users");
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeTab === "users"
                  ? "bg-accent text-primary"
                  : "hover:bg-white/10 text-white/80"
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <span className="font-medium">Manage Users</span>
            </button>
          </nav>

          {/* User Info: avatar inisial + nama + email */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-primary font-semibold">
                {user?.name?.charAt(0).toUpperCase() || "A"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.name || "Admin"}
                </p>
                <p className="text-xs text-white/60 truncate">
                  {user?.email || ""}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

/*
🔄 Alur eksekusi file (step by step)
1. SidebarAdmin di-render dengan props activeTab dan setActiveTab.
2. State isOpen (false) dan user (null); useEffect jalan sekali, baca localStorage "user", setUser jika ada.
3. Return: tombol toggle (mobile); overlay conditional (isOpen); aside dengan class yang mengontrol posisi (translate) berdasarkan isOpen dan breakpoint lg. Di dalam aside: judul, nav dua tombol (onClick set activeTab + tutup menu di mobile), blok user (nama, email; inisial dari user?.name).
4. Klik tombol nav → setActiveTab("items") atau ("users") + setIsOpen(false) → parent (AdminDashboard) ganti konten; di mobile menu tertutup.

🧠 Ringkasan versi manusia awam
   "SidebarAdmin itu menu samping di halaman admin: judul Found It!, dua pilihan Manage Reports dan Manage Users,
   dan di bawah nama + email admin. Di HP ada tombol untuk buka/tutup menu dan overlay gelap. Parent mengatur
   tab mana yang aktif lewat activeTab dan setActiveTab."

📘 Glosarium
   - activeTab / setActiveTab: state di parent (AdminDashboard) yang mengontrol tab mana yang tampil.
   - isOpen: state lokal untuk menu mobile (buka/tutup).
   - Fragment (<> </>): tidak menambah node DOM.
   - fixed / static: fixed = posisi relatif viewport; lg:static = di layar besar jadi normal flow.
   - translate-x: transform CSS untuk geser horizontal; -translate-x-full = geser keluar kiri.
   - charAt(0).toUpperCase(): ambil huruf pertama nama dan kapitalkan (untuk inisial avatar).

⚠️ Kesalahan umum pemula + contoh
   - Lupa setIsOpen(false) saat klik nav di mobile → menu tetap terbuka setelah pilih tab.
   - user?.name?.charAt(0) tanpa fallback → jika user null, tetap aman; || "A" untuk inisial default.
   - Sidebar dipakai di luar halaman admin → pastikan hanya di-render di route /admin (ProtectedRoute requireAdmin).
*/
