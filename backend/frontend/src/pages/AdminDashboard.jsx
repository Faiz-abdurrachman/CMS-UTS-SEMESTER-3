// ============================================
// FILE: src/pages/AdminDashboard.jsx
// DESKRIPSI: Dashboard admin untuk mengelola semua laporan dan users
// ============================================

import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import SidebarAdmin from "../components/SidebarAdmin";
import CardItem from "../components/CardItem";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const navigate = useNavigate();

  // State untuk data
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("items"); // 'items' atau 'users'
  const [filterStatus, setFilterStatus] = useState("all"); // 'all', 'pending', 'approved', 'rejected'

  // State untuk modal mark as resolved
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [resolveNote, setResolveNote] = useState("");

  // State untuk modal edit item
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    location: "",
    date_occured: "",
    status: "lost",
    validation_status: "pending",
  });
  const [editImageFile, setEditImageFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);

  // ============================================
  // PROTEKSI ADMIN ONLY
  // ============================================

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      // Jika user bukan admin, redirect ke dashboard user
      if (parsedUser.role !== "admin") {
        toast.error(
          "Akses ditolak! Hanya admin yang bisa mengakses halaman ini."
        );
        navigate("/dashboard", { replace: true });
      }
    } else {
      // Jika tidak ada user data, redirect ke login
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  // ============================================
  // FETCH DATA
  // ============================================

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [itemsRes, usersRes, statsRes] = await Promise.all([
        api.get("/admin/items"),
        api.get("/admin/users"),
        api.get("/admin/statistics"),
      ]);
      setItems(itemsRes.data);
      setUsers(usersRes.data);
      setStatistics(statsRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      toast.error("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // HANDLE VALIDATION STATUS
  // ============================================

  const handleValidationStatus = async (itemId, status) => {
    try {
      await api.put(`/admin/items/${itemId}/validate`, {
        validation_status: status,
      });
      toast.success(
        `Laporan ${status === "approved" ? "disetujui" : "ditolak"}`
      );
      fetchData(); // Refresh data
    } catch (err) {
      toast.error("Gagal mengupdate status");
    }
  };

  // ============================================
  // HANDLE MARK AS RESOLVED
  // ============================================

  const handleOpenResolveModal = (itemId) => {
    setSelectedItemId(itemId);
    setResolveNote("");
    setShowResolveModal(true);
  };

  const handleCloseResolveModal = () => {
    setShowResolveModal(false);
    setSelectedItemId(null);
    setResolveNote("");
  };

  const handleMarkAsResolved = async () => {
    if (!selectedItemId) return;

    try {
      await api.put(`/admin/items/${selectedItemId}/resolve`, {
        resolved_note: resolveNote || null,
      });
      toast.success("Barang ditandai sebagai sudah ketemu");
      handleCloseResolveModal();
      fetchData(); // Refresh data
    } catch (err) {
      toast.error("Gagal menandai barang sebagai sudah ketemu");
    }
  };

  // ============================================
  // HANDLE EDIT ITEM
  // ============================================

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setEditForm({
      name: item.name || "",
      description: item.description || "",
      location: item.location || "",
      date_occured: item.date_occured || "",
      status: item.status || "lost",
      validation_status: item.validation_status || "pending",
    });
    setEditImageFile(null);
    setEditImagePreview(
      item.image ? `http://localhost:5000/uploads/${item.image}` : null
    );
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingItem(null);
    setEditForm({
      name: "",
      description: "",
      location: "",
      date_occured: "",
      status: "lost",
      validation_status: "pending",
    });
    setEditImageFile(null);
    setEditImagePreview(null);
  };

  const handleEditImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error("Ukuran file maksimal 5MB");
        return;
      }
      setEditImageFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditImagePreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpdateItem = async () => {
    if (!editingItem) return;

    try {
      const formData = new FormData();
      formData.append("name", editForm.name);
      formData.append("description", editForm.description);
      formData.append("location", editForm.location);
      formData.append("date_occured", editForm.date_occured);
      formData.append("status", editForm.status);
      formData.append("validation_status", editForm.validation_status);

      if (editImageFile) {
        formData.append("image", editImageFile);
      }

      await api.put(`/admin/items/${editingItem.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Item berhasil diupdate");
      handleCloseEditModal();
      fetchData();
    } catch (err) {
      toast.error("Gagal mengupdate item");
    }
  };

  // ============================================
  // HANDLE DELETE
  // ============================================

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm("Yakin ingin menghapus laporan ini?")) {
      return;
    }

    try {
      await api.delete(`/admin/items/${itemId}`);
      toast.success("Laporan berhasil dihapus");
      fetchData(); // Refresh data
    } catch (err) {
      toast.error("Gagal menghapus laporan");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Yakin ingin menghapus user ini?")) {
      return;
    }

    try {
      await api.delete(`/admin/users/${userId}`);
      toast.success("User berhasil dihapus");
      fetchData(); // Refresh data
    } catch (err) {
      toast.error("Gagal menghapus user");
    }
  };

  // Filter items berdasarkan validation status
  const filteredItems =
    filterStatus === "all"
      ? items
      : items.filter((item) => item.validation_status === filterStatus);

  // Ambil user dari localStorage
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="flex">
        {/* Sidebar */}
        <SidebarAdmin activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Content */}
        <div className="flex-1 md:ml-64">
          {/* Admin Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg">
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                    Admin Dashboard
                  </h1>
                  <p className="text-sm sm:text-base text-purple-100">
                    Kelola semua laporan dan pengguna sistem Lost & Found
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <div className="badge badge-lg badge-warning text-white">
                    👑 Admin Mode
                  </div>
                  <p className="text-xs sm:text-sm text-purple-100 mt-2">
                    {user?.name}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 lg:p-8">
            {/* Statistics Cards */}
            {statistics && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
                <div className="stat bg-base-100 rounded-lg shadow-lg">
                  <div className="stat-title">Total Users</div>
                  <div className="stat-value text-primary">
                    {statistics.totalUsers}
                  </div>
                </div>
                <div className="stat bg-base-100 rounded-lg shadow-lg">
                  <div className="stat-title">Total Laporan</div>
                  <div className="stat-value text-secondary">
                    {statistics.totalItems}
                  </div>
                </div>
                <div className="stat bg-base-100 rounded-lg shadow-lg">
                  <div className="stat-title">Pending</div>
                  <div className="stat-value text-warning">
                    {statistics.totalPending}
                  </div>
                </div>
                <div className="stat bg-base-100 rounded-lg shadow-lg">
                  <div className="stat-title">Approved</div>
                  <div className="stat-value text-success">
                    {statistics.totalApproved}
                  </div>
                </div>
              </div>
            )}

            {/* Items Tab */}
            {activeTab === "items" && (
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 mb-2">
                      📋 Kelola Laporan
                    </h2>
                    <p className="text-sm sm:text-base text-gray-500">
                      Validasi, setujui, atau tolak laporan dari pengguna. Admin
                      bisa CRUD semua laporan.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center w-full sm:w-auto">
                    <Link
                      to="/report-lost"
                      className="btn btn-warning btn-sm gap-2 text-xs sm:text-sm"
                    >
                      <span>📦</span>{" "}
                      <span className="hidden sm:inline">Tambah Laporan Hilang</span>
                      <span className="sm:hidden">Hilang</span>
                    </Link>
                    <Link
                      to="/report-found"
                      className="btn btn-success btn-sm gap-2 text-xs sm:text-sm"
                    >
                      <span>✅</span>{" "}
                      <span className="hidden sm:inline">Tambah Laporan Ditemukan</span>
                      <span className="sm:hidden">Ditemukan</span>
                    </Link>
                    <div className="tabs tabs-boxed text-xs sm:text-sm">
                      <button
                        className={`tab ${
                          filterStatus === "all" ? "tab-active" : ""
                        }`}
                        onClick={() => setFilterStatus("all")}
                      >
                        Semua
                      </button>
                      <button
                        className={`tab ${
                          filterStatus === "pending" ? "tab-active" : ""
                        }`}
                        onClick={() => setFilterStatus("pending")}
                      >
                        Pending
                      </button>
                      <button
                        className={`tab ${
                          filterStatus === "approved" ? "tab-active" : ""
                        }`}
                        onClick={() => setFilterStatus("approved")}
                      >
                        Approved
                      </button>
                      <button
                        className={`tab ${
                          filterStatus === "rejected" ? "tab-active" : ""
                        }`}
                        onClick={() => setFilterStatus("rejected")}
                      >
                        Rejected
                      </button>
                    </div>
                  </div>
                </div>

                {loading ? (
                  <div className="flex justify-center py-12">
                    <span className="loading loading-spinner loading-lg"></span>
                  </div>
                ) : filteredItems.length === 0 ? (
                  <div className="card bg-base-100 shadow-xl">
                    <div className="card-body text-center py-12">
                      <p className="text-gray-500">Tidak ada laporan</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems.map((item) => (
                      <div key={item.id} className="card bg-base-100 shadow-xl">
                        <CardItem item={item} showDelete={false} />
                        <div className="card-body pt-0">
                          {/* Validation Status Badge */}
                          <div className="flex gap-2 mb-2">
                            <span
                              className={`badge ${
                                item.validation_status === "pending"
                                  ? "badge-warning"
                                  : item.validation_status === "approved"
                                  ? "badge-success"
                                  : "badge-error"
                              }`}
                            >
                              {item.validation_status === "pending" &&
                                "⏳ Pending"}
                              {item.validation_status === "approved" &&
                                "✅ Approved"}
                              {item.validation_status === "rejected" &&
                                "❌ Rejected"}
                            </span>
                          </div>

                          {/* Resolved Status */}
                          {item.resolved_at && (
                            <div className="alert alert-info mb-2">
                              <div>
                                <div className="font-semibold">
                                  ✅ Barang Sudah Ketemu
                                </div>
                                <div className="text-xs">
                                  {new Date(item.resolved_at).toLocaleString(
                                    "id-ID"
                                  )}
                                </div>
                                {item.resolved_note && (
                                  <div className="text-xs mt-1">
                                    <strong>Keterangan:</strong>{" "}
                                    {item.resolved_note}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Action Buttons */}
                          {item.validation_status === "pending" && (
                            <div className="flex flex-col sm:flex-row gap-2 mt-2">
                              <button
                                className="btn btn-success btn-sm flex-1 text-xs sm:text-sm"
                                onClick={() =>
                                  handleValidationStatus(item.id, "approved")
                                }
                              >
                                Setujui
                              </button>
                              <button
                                className="btn btn-error btn-sm flex-1 text-xs sm:text-sm"
                                onClick={() =>
                                  handleValidationStatus(item.id, "rejected")
                                }
                              >
                                Tolak
                              </button>
                            </div>
                          )}

                          {/* Mark as Resolved Button (hanya untuk approved items yang belum resolved) */}
                          {item.validation_status === "approved" &&
                            !item.resolved_at && (
                              <button
                                className="btn btn-info btn-sm mt-2 w-full"
                                onClick={() => handleOpenResolveModal(item.id)}
                              >
                                ✅ Tandai Sudah Ketemu
                              </button>
                            )}

                          {/* Action Buttons */}
                          <div className="flex flex-col sm:flex-row gap-2 mt-2">
                            <button
                              className="btn btn-primary btn-sm flex-1 text-xs sm:text-sm"
                              onClick={() => handleOpenEditModal(item)}
                            >
                              ✏️ Edit
                            </button>
                            <button
                              className="btn btn-error btn-sm flex-1 text-xs sm:text-sm"
                              onClick={() => handleDeleteItem(item.id)}
                            >
                              🗑️ Hapus
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Users Tab */}
            {activeTab === "users" && (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 mb-2">
                    👥 Kelola Users
                  </h2>
                  <p className="text-sm sm:text-base text-gray-500">
                    Lihat dan kelola semua pengguna yang terdaftar di sistem
                  </p>
                </div>

                {loading ? (
                  <div className="flex justify-center py-12">
                    <span className="loading loading-spinner loading-lg"></span>
                  </div>
                ) : (
                  <div className="overflow-x-auto -mx-4 sm:mx-0">
                    <table className="table table-zebra w-full bg-base-100 shadow-xl text-xs sm:text-sm">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Nama</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Tanggal Daftar</th>
                          <th>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                              <span
                                className={`badge ${
                                  user.role === "admin"
                                    ? "badge-primary"
                                    : "badge-secondary"
                                }`}
                              >
                                {user.role}
                              </span>
                            </td>
                            <td>
                              {new Date(user.created_at).toLocaleDateString(
                                "id-ID"
                              )}
                            </td>
                            <td>
                              <button
                                className="btn btn-error btn-sm"
                                onClick={() => handleDeleteUser(user.id)}
                                disabled={user.role === "admin"}
                              >
                                Hapus
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Mark as Resolved */}
      {showResolveModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">
              ✅ Tandai Barang Sudah Ketemu
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Barang ini akan hilang dari dashboard public dalam 24 jam setelah
              ditandai sebagai sudah ketemu.
            </p>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Keterangan (Opsional)</span>
              </label>
              <textarea
                className="textarea textarea-bordered h-24"
                placeholder="Contoh: Barang sudah dikembalikan ke pemilik, Barang sudah diambil di kantor keamanan, dll."
                value={resolveNote}
                onChange={(e) => setResolveNote(e.target.value)}
              />
            </div>
            <div className="modal-action">
              <button
                className="btn btn-ghost"
                onClick={handleCloseResolveModal}
              >
                Batal
              </button>
              <button className="btn btn-info" onClick={handleMarkAsResolved}>
                Tandai Sudah Ketemu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Edit Item */}
      {showEditModal && editingItem && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl w-11/12 max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-lg mb-4">✏️ Edit Laporan</h3>

            <div className="space-y-4">
              {/* Nama Barang */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Nama Barang *</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  required
                />
              </div>

              {/* Deskripsi */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Deskripsi *</span>
                </label>
                <textarea
                  className="textarea textarea-bordered h-24"
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  required
                />
              </div>

              {/* Lokasi */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Lokasi</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={editForm.location}
                  onChange={(e) =>
                    setEditForm({ ...editForm, location: e.target.value })
                  }
                />
              </div>

              {/* Tanggal */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Tanggal</span>
                </label>
                <input
                  type="date"
                  className="input input-bordered"
                  value={editForm.date_occured}
                  onChange={(e) =>
                    setEditForm({ ...editForm, date_occured: e.target.value })
                  }
                />
              </div>

              {/* Status */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Status</span>
                </label>
                <select
                  className="select select-bordered"
                  value={editForm.status}
                  onChange={(e) =>
                    setEditForm({ ...editForm, status: e.target.value })
                  }
                >
                  <option value="lost">Hilang</option>
                  <option value="found">Ditemukan</option>
                </select>
              </div>

              {/* Validation Status */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Status Validasi</span>
                </label>
                <select
                  className="select select-bordered"
                  value={editForm.validation_status}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      validation_status: e.target.value,
                    })
                  }
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {/* Upload Gambar */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Foto Barang (Opsional)</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleEditImageChange}
                  className="file-input file-input-bordered"
                />
                {editImagePreview && (
                  <div className="mt-2">
                    <img
                      src={editImagePreview}
                      alt="Preview"
                      className="max-w-xs rounded-lg border border-gray-300"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="modal-action">
              <button className="btn btn-ghost" onClick={handleCloseEditModal}>
                Batal
              </button>
              <button className="btn btn-primary" onClick={handleUpdateItem}>
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
