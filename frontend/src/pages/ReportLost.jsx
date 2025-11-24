// ============================================
// FILE: src/pages/ReportLost.jsx
// DESKRIPSI: Halaman untuk melaporkan barang hilang - Modern Design
// ============================================

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import toast from "react-hot-toast";

export default function ReportLost() {
  const navigate = useNavigate();

  // State untuk form data
  const [form, setForm] = useState({
    name: "",
    description: "",
    location: "",
    date_occured: "",
  });

  // State untuk file gambar
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // State untuk error dan loading
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ============================================
  // HANDLE IMAGE CHANGE
  // ============================================

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("File size must not exceed 5MB");
        return;
      }

      setFile(selectedFile);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  // ============================================
  // HANDLE SUBMIT
  // ============================================

  const submit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.description) {
      setError("Item name and description are required!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = new FormData();

      Object.keys(form).forEach((key) => {
        if (form[key]) {
          data.append(key, form[key]);
        }
      });

      data.append("status", "lost");

      if (file) {
        data.append("image", file);
      }

      await api.post("/items/lost", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Report submitted successfully!");
      navigate("/dashboard");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "An error occurred. Please try again!";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 lg:p-10">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-primary mb-3">
              Report Lost Item
            </h1>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Report your personal item that went missing. Your report will be
              validated by admin before appearing on the public dashboard.
            </p>
          </div>

          <form onSubmit={submit} className="space-y-6">
            {/* Nama Barang */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Item Name <span className="text-red-500">*</span>
              </label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g., Black Wallet, Motorcycle Key"
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-200 text-gray-900 placeholder-gray-400"
                required
              />
            </div>

            {/* Deskripsi */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Describe the item details, characteristics, etc."
                rows="5"
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-200 text-gray-900 placeholder-gray-400 resize-none"
                required
              />
            </div>

            {/* Lokasi */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Last Known Location
              </label>
              <input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="e.g., Campus Parking, Room 101"
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-200 text-gray-900 placeholder-gray-400"
              />
              <p className="text-xs text-gray-500 mt-2">
                Location where you last saw this item
              </p>
            </div>

            {/* Tanggal */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Date Lost
              </label>
              <input
                type="date"
                value={form.date_occured}
                onChange={(e) =>
                  setForm({ ...form, date_occured: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-200 text-gray-900"
              />
            </div>

            {/* Upload Gambar */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Item Photo (Optional)
              </label>
              <div className="space-y-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-200 text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-primary hover:file:bg-accent-dark file:cursor-pointer"
                />
                {imagePreview && (
                  <div className="mt-3">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-w-xs rounded-lg border-2 border-gray-200 shadow-sm"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-accent text-primary hover:bg-accent-dark shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                }`}
              >
                {loading ? "Submitting..." : "Submit Report"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
