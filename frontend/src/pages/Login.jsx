// ============================================
// FILE: src/pages/Login.jsx
// DESKRIPSI: Halaman login user - Modern Split-Screen Design
// ============================================

import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import toast from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();

  // ============================================
  // CEK JIKA SUDAH LOGIN
  // ============================================

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (token && user) {
      if (user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [navigate]);

  // State untuk form data
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // State untuk memilih mode login (user atau admin)
  const [loginMode, setLoginMode] = useState("user");

  // State untuk error dan loading
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ============================================
  // HANDLE SUBMIT
  // ============================================

  const submit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError("Email and password are required!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/login", form);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        const userRole = response.data.user.role;

        if (loginMode === "admin" && userRole !== "admin") {
          setError("This email is not an admin account! Please login as User.");
          toast.error("This email is not an admin account!");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          return;
        }

        if (loginMode === "user" && userRole === "admin") {
          setError("This is an admin account! Please select 'Login as Admin'.");
          toast.error("This is an admin account! Select Admin mode.");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          return;
        }

        if (userRole === "admin") {
          toast.success("Login successful! Welcome Admin");
          navigate("/admin", { replace: true });
        } else {
          toast.success("Login successful! Welcome");
          navigate("/dashboard", { replace: true });
        }
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Email or password is incorrect!";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Section - Decorative Text */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-primary-light items-center justify-center p-12">
        <div className="max-w-md">
          <h1 className="text-5xl sm:text-6xl font-display font-bold text-white mb-6 leading-tight">
            {loginMode === "admin" ? (
              <>
                Let's
                <br />
                manage!
              </>
            ) : (
              <>
                Let's find
                <br />
                your stuff
                <br />
                back!
              </>
            )}
          </h1>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mode Toggle */}
          <div className="mb-8">
            <p className="text-sm text-gray-600 mb-3">
              Sign in as {loginMode === "admin" ? "Admin" : "User"}
            </p>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setLoginMode("user")}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                  loginMode === "user"
                    ? "bg-accent text-primary"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                User
              </button>
              <button
                type="button"
                onClick={() => setLoginMode("admin")}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                  loginMode === "admin"
                    ? "bg-accent text-primary"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          <form onSubmit={submit} className="space-y-6">
            {/* Email Input */}
            <div>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Username"
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-200 text-gray-900 placeholder-gray-400"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Password"
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-200 text-gray-900 placeholder-gray-400"
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-accent text-primary hover:bg-accent-dark shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              }`}
            >
              {loading ? "Signing in..." : "Sign In →"}
            </button>

            {/* Link ke Register (hanya untuk User) */}
            {loginMode === "user" && (
              <p className="text-center text-sm text-gray-600">
                Didn't have an account yet?{" "}
                <Link
                  to="/register"
                  className="text-accent-dark font-semibold hover:text-primary transition-colors"
                >
                  Let's Sign Up first
                </Link>
              </p>
            )}

            {/* Info untuk Admin */}
            {loginMode === "admin" && (
              <p className="text-center text-xs text-gray-500">
                Not an admin?{" "}
                <button
                  type="button"
                  onClick={() => setLoginMode("user")}
                  className="text-accent-dark font-semibold hover:text-primary transition-colors"
                >
                  Sign in as User here
                </button>
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
