// ============================================
// FILE: src/components/Navbar.jsx
// DESKRIPSI: Komponen navbar dengan navigation links - Modern Design
// ============================================

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  // Logic user/logout sudah dihandle oleh AuthContext
  const handleLogout = () => {
    logout();
    navigate("/login"); // Optional: jika logout tidak redirect di context
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-display font-bold text-primary hover:text-primary-light transition-colors"
          >
            Found It!
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-gray-700 hover:text-primary transition-colors font-medium"
            >
              Home
            </Link>

            {user ? (
              <>
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

          {/* Mobile Menu Button */}
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
