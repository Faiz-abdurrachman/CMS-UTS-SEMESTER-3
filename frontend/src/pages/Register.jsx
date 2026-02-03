// ============================================
// FILE: src/pages/Register.jsx
// DESKRIPSI: Halaman registrasi user baru - Modern Design
// ============================================

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  // State untuk form data
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  // State untuk error dan loading
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ============================================
  // HANDLE SUBMIT
  // ============================================

  const submit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      setError("All fields are required!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await register(form.name, form.email, form.password);
      
      if (result.success) {
        toast.success(result.message || "Registration successful!");
        // Jika auto login di context sukses, arahkan ke dashboard/home
        // Jika context hanya register, arahkan ke login
        // Di AuthContext kita implementasikan auto login jika register sukses
         navigate("/dashboard");
      } else {
        setError(result.message);
        toast.error(result.message);
      }
    } catch (err) {
      setError("An unexpected error occurred");
      toast.error("An unexpected error occurred");
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
            Let's find
            <br />
            your stuff
            <br />
            back!
          </h1>
          <p className="text-white/90 text-lg">
            Join our community and help others find their lost items
          </p>
        </div>
      </div>

      {/* Right Section - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-display font-bold text-primary mb-2">
              Create Account
            </h2>
            <p className="text-gray-600 text-sm">
              Sign up as User to use Lost & Found services
            </p>
          </div>

          <form onSubmit={submit} className="space-y-5">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-200 text-gray-900 placeholder-gray-400"
                required
              />
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-200 text-gray-900 placeholder-gray-400"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Create a password"
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

            {/* Info Box */}
            <div className="bg-blue-50 border-l-4 border-accent p-4 rounded-r-lg">
              <p className="text-xs text-gray-700 text-left">
                <strong>Note:</strong> Registration is for regular users only.
                Admin accounts are created manually by system administrators for
                security.
              </p>
            </div>

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
              {loading ? "Creating account..." : "Sign Up →"}
            </button>

            {/* Link ke Login */}
            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-accent-dark font-semibold hover:text-primary transition-colors"
              >
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
