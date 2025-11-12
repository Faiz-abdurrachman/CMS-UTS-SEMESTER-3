// ============================================
// FILE: src/components/Navbar.jsx
// DESKRIPSI: Komponen navbar dengan navigation links
// ============================================

import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  // Cek apakah user sudah login
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // ============================================
  // HANDLE LOGOUT
  // ============================================

  const handleLogout = () => {
    // Hapus token dan user dari localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Redirect ke home
    navigate("/");
  };

  return (
    <nav className="navbar bg-base-100 shadow-lg">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex-1">
          {/* Logo */}
          <Link
            to="/"
            className="btn btn-ghost text-lg sm:text-xl font-bold text-primary"
          >
            Lost & Found
          </Link>
        </div>
        <div className="flex-none">
          {/* Desktop Navigation */}
          <ul className="hidden md:flex menu menu-horizontal px-1 gap-2">
            <li>
              <Link to="/">Home</Link>
            </li>

            {token ? (
              <>
                {user?.role === "admin" ? (
                  // Menu untuk Admin
                  <>
                    <li>
                      <Link to="/admin" className="btn btn-primary btn-sm">
                        👑 Admin
                      </Link>
                    </li>
                    <li>
                      <div className="dropdown dropdown-end">
                        <div
                          tabIndex={0}
                          role="button"
                          className="btn btn-ghost btn-sm"
                        >
                          <span className="text-sm">
                            <span className="badge badge-warning mr-2">
                              Admin
                            </span>
                            <span className="hidden lg:inline">
                              {user?.name}
                            </span>
                          </span>
                        </div>
                        <ul
                          tabIndex={0}
                          className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
                        >
                          <li>
                            <Link to="/admin">Admin Dashboard</Link>
                          </li>
                          <li>
                            <Link to="/dashboard">Lihat Dashboard User</Link>
                          </li>
                          <li>
                            <button onClick={handleLogout}>Logout</button>
                          </li>
                        </ul>
                      </div>
                    </li>
                  </>
                ) : (
                  // Menu untuk User
                  <>
                    <li className="hidden lg:block">
                      <Link to="/dashboard">Dashboard</Link>
                    </li>
                    <li className="hidden lg:block">
                      <Link to="/my-reports">Laporan Saya</Link>
                    </li>
                    <li>
                      <Link to="/report-lost" className="btn btn-warning btn-sm">
                        📦 Hilang
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/report-found"
                        className="btn btn-success btn-sm"
                      >
                        ✅ Ditemukan
                      </Link>
                    </li>
                    <li>
                      <div className="dropdown dropdown-end">
                        <div
                          tabIndex={0}
                          role="button"
                          className="btn btn-ghost btn-sm"
                        >
                          <span className="text-sm">
                            <span className="hidden lg:inline">Halo, </span>
                            <span className="font-semibold">{user?.name}</span>
                          </span>
                        </div>
                        <ul
                          tabIndex={0}
                          className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
                        >
                          <li>
                            <Link to="/dashboard">Dashboard</Link>
                          </li>
                          <li>
                            <Link to="/my-reports">Laporan Saya</Link>
                          </li>
                          <li>
                            <button onClick={handleLogout}>Logout</button>
                          </li>
                        </ul>
                      </div>
                    </li>
                  </>
                )}
              </>
            ) : (
              <>
                <li>
                  <Link to="/login">Masuk</Link>
                </li>
                <li>
                  <Link to="/register" className="btn btn-primary btn-sm">
                    Daftar
                  </Link>
                </li>
              </>
            )}
          </ul>

          {/* Mobile Menu */}
          <div className="dropdown dropdown-end md:hidden">
            <div tabIndex={0} role="button" className="btn btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow mt-2"
            >
              <li>
                <Link to="/">Home</Link>
              </li>
              {token ? (
                <>
                  {user?.role === "admin" ? (
                    <>
                      <li>
                        <Link to="/admin">👑 Admin Panel</Link>
                      </li>
                      <li>
                        <Link to="/dashboard">Dashboard User</Link>
                      </li>
                      <li>
                        <button onClick={handleLogout}>Logout</button>
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <Link to="/dashboard">Dashboard</Link>
                      </li>
                      <li>
                        <Link to="/my-reports">Laporan Saya</Link>
                      </li>
                      <li>
                        <Link to="/report-lost">📦 Laporkan Hilang</Link>
                      </li>
                      <li>
                        <Link to="/report-found">✅ Laporkan Ditemukan</Link>
                      </li>
                      <li>
                        <button onClick={handleLogout}>Logout</button>
                      </li>
                    </>
                  )}
                </>
              ) : (
                <>
                  <li>
                    <Link to="/login">Masuk</Link>
                  </li>
                  <li>
                    <Link to="/register">Daftar</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
