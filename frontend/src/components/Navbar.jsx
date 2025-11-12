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
      <div className="container mx-auto px-4">
        <div className="flex-1">
          {/* Logo */}
          <Link to="/" className="btn btn-ghost text-xl font-bold text-primary">
            Lost & Found
          </Link>
        </div>
        <div className="flex-none">
          {/* Navigation Links */}
          <ul className="menu menu-horizontal px-1 gap-2">
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
                        👑 Admin Panel
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
                            {user?.name}
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
                    <li>
                      <Link to="/dashboard">Dashboard</Link>
                    </li>
                    <li>
                      <Link to="/my-reports">Laporan Saya</Link>
                    </li>
                    <li>
                      <Link to="/report-lost">Laporkan Hilang</Link>
                    </li>
                    <li>
                      <Link to="/report-found">Laporkan Ditemukan</Link>
                    </li>
                    <li>
                      <div className="dropdown dropdown-end">
                        <div
                          tabIndex={0}
                          role="button"
                          className="btn btn-ghost btn-sm"
                        >
                          <span className="text-sm">
                            Halo,{" "}
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
        </div>
      </div>
    </nav>
  );
}
