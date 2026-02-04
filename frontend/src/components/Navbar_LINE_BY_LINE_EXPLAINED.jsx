/*
📌 FILE: Navbar.jsx (versi dijelaskan baris per baris)
🧠 Fungsi file ini:
   Komponen navbar (bar di atas): logo "Found It!" (link ke home), link navigasi (Home, Dashboard, My Reports, Admin Panel),
   dan tombol Sign In / Sign Up atau nama user + Logout tergantung state auth (user ada atau tidak, role admin atau user).
   Di mobile: menu dropdown (daisyUI dropdown).
🔄 Alur singkat:
   1. Import Link, useNavigate dari react-router-dom; useAuth dari hooks.
   2. navigate = useNavigate(); user, logout = useAuth(); handleLogout panggil logout lalu navigate("/login").
   3. Return nav: logo Link; desktop (hidden di mobile): link + conditional user ? (admin vs user) : (Sign In, Sign Up); mobile: dropdown dengan link sama.
📦 Analogi dunia nyata:
   Seperti papan navigasi di lobi: nama toko (kembali ke lobi), lalu tombol "Dashboard", "My Reports", atau "Admin Panel" + nama user + Logout kalau sudah login; kalau belum, "Sign In" dan "Sign Up".
*/

// import Link (untuk navigasi tanpa reload) dan useNavigate (untuk redirect programatik) dari react-router-dom
import { Link, useNavigate } from "react-router-dom";

// import hook useAuth untuk mengakses user dan logout dari AuthContext
import { useAuth } from "../hooks/useAuth";

// export default = satu ekspor utama; function Navbar() = komponen tanpa props
export default function Navbar() {
  // useNavigate() = hook yang mengembalikan fungsi navigate; navigate(path) = pindah ke URL path
  const navigate = useNavigate();

  // useAuth() = mengembalikan objek dari AuthContext; kita ambil user (objek atau null) dan fungsi logout
  const { user, logout } = useAuth();

  // handleLogout = fungsi yang dipanggil saat tombol Logout diklik; panggil logout() (hapus token, redirect di context), lalu navigate ke /login (backup jika context tidak redirect)
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo: Link ke home (/) dengan teks "Found It!" */}
          <Link
            to="/"
            className="text-2xl font-display font-bold text-primary hover:text-primary-light transition-colors"
          >
            Found It!
          </Link>

          {/* Desktop: tampil di md ke atas (hidden di mobile); gap-6 antara item */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-gray-700 hover:text-primary transition-colors font-medium"
            >
              Home
            </Link>

            {/* user ? (...) : (...) = jika user ada tampilkan blok pertama, else blok kedua (Sign In / Sign Up) */}
            {user ? (
              <>
                {/* user?.role === "admin" = optional chaining: cek role hanya jika user ada; tampilkan link Admin + nama + Logout */}
                {user?.role === "admin" ? (
                  <>
                    <Link
                      to="/admin"
                      className="px-4 py-2 bg-accent text-primary rounded-lg font-semibold hover:bg-accent-dark transition-all duration-200"
                    >
                      Admin Panel
                    </Link>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {user?.name}
                        </p>
                        <p className="text-xs text-gray-500">Admin</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="px-4 py-2 text-gray-700 hover:text-primary transition-colors font-medium"
                      >
                        Logout
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <Link
                      to="/dashboard"
                      className="text-gray-700 hover:text-primary transition-colors font-medium"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/my-reports"
                      className="text-gray-700 hover:text-primary transition-colors font-medium"
                    >
                      My Reports
                    </Link>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {user?.name}
                        </p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="px-4 py-2 text-gray-700 hover:text-primary transition-colors font-medium"
                      >
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary transition-colors font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-accent text-primary rounded-lg font-semibold hover:bg-accent-dark transition-all duration-200"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile: tampil hanya di md:hidden; dropdown (daisyUI) berisi link yang sama */}
          <div className="md:hidden">
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-white rounded-lg shadow-lg w-52 p-2 border border-gray-200 mt-2"
              >
                <li>
                  <Link to="/" className="text-gray-700">
                    Home
                  </Link>
                </li>
                {user ? (
                  <>
                    {user?.role === "admin" ? (
                      <>
                        <li>
                          <Link to="/admin" className="text-gray-700">
                            Admin Panel
                          </Link>
                        </li>
                        <li>
                          <button
                            onClick={handleLogout}
                            className="text-gray-700"
                          >
                            Logout
                          </button>
                        </li>
                      </>
                    ) : (
                      <>
                        <li>
                          <Link to="/dashboard" className="text-gray-700">
                            Dashboard
                          </Link>
                        </li>
                        <li>
                          <Link to="/my-reports" className="text-gray-700">
                            My Reports
                          </Link>
                        </li>
                        <li>
                          <button
                            onClick={handleLogout}
                            className="text-gray-700"
                          >
                            Logout
                          </button>
                        </li>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <li>
                      <Link to="/login" className="text-gray-700">
                        Sign In
                      </Link>
                    </li>
                    <li>
                      <Link to="/register" className="text-gray-700">
                        Sign Up
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

/*
🔄 Alur eksekusi file (step by step)
1. Navbar di-render; useNavigate() dan useAuth() dipanggil (harus di dalam Router dan AuthProvider).
2. handleLogout didefinisikan: saat dipanggil, logout() (dari context) dan navigate("/login").
3. Return nav: logo Link ke "/"; di desktop (hidden di mobile) tampil Home + conditional: kalau user ada, tampil Admin Panel atau Dashboard+My Reports + nama + Logout; kalau tidak, Sign In + Sign Up. Di mobile, dropdown dengan item yang sama.
4. Klik Logout → handleLogout → logout() (clear token, redirect) + navigate("/login").

🧠 Ringkasan versi manusia awam
   "Navbar itu bar di atas: logo 'Found It!' ke home, lalu link Home. Kalau sudah login: admin dapat link Admin Panel + nama + Logout; user biasa dapat Dashboard, My Reports, nama, Logout. Kalau belum login: Sign In dan Sign Up. Di HP pakai menu hamburger dengan isi yang sama."

📘 Glosarium
   - Link: komponen react-router untuk navigasi tanpa reload halaman (SPA).
   - useNavigate: hook untuk redirect programatik (navigate(path)).
   - useAuth: hook untuk user dan logout dari AuthContext.
   - optional chaining (user?.role): aman jika user null.
   - Fragment (<> </>): membungkus beberapa elemen tanpa menambah node DOM.
   - dropdown (daisyUI): komponen menu yang buka/tutup dengan klik.

⚠️ Kesalahan umum pemula + contoh
   - Memakai <a href="/"> instead of <Link to="/"> → akan reload penuh, state React hilang.
   - Memakai useAuth() di luar AuthProvider → error "useContext cannot find provider".
   - Lupa handle user null → user?.name aman; user.name bisa error kalau user null.
*/
