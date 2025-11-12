// ============================================
// FILE: src/pages/AdminDashboard.jsx
// DESKRIPSI: Dashboard admin untuk mengelola semua laporan dan users
// ============================================

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
        <div className="flex-1 ml-64">
          {/* Admin Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
                  <p className="text-purple-100">
                    Kelola semua laporan dan pengguna sistem Lost & Found
                  </p>
                </div>
                <div className="text-right">
                  <div className="badge badge-lg badge-warning text-white">
                    👑 Admin Mode
                  </div>
                  <p className="text-sm text-purple-100 mt-2">{user?.name}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Statistics Cards */}
            {statistics && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-800 mb-2">
                      📋 Kelola Laporan
                    </h2>
                    <p className="text-gray-500">
                      Validasi, setujui, atau tolak laporan dari pengguna
                    </p>
                  </div>
                  <div className="tabs tabs-boxed">
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

                          {/* Action Buttons */}
                          {item.validation_status === "pending" && (
                            <div className="flex gap-2 mt-2">
                              <button
                                className="btn btn-success btn-sm flex-1"
                                onClick={() =>
                                  handleValidationStatus(item.id, "approved")
                                }
                              >
                                Setujui
                              </button>
                              <button
                                className="btn btn-error btn-sm flex-1"
                                onClick={() =>
                                  handleValidationStatus(item.id, "rejected")
                                }
                              >
                                Tolak
                              </button>
                            </div>
                          )}

                          <button
                            className="btn btn-error btn-sm mt-2 w-full"
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            Hapus
                          </button>
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
                  <h2 className="text-3xl font-bold text-slate-800 mb-2">
                    👥 Kelola Users
                  </h2>
                  <p className="text-gray-500">
                    Lihat dan kelola semua pengguna yang terdaftar di sistem
                  </p>
                </div>

                {loading ? (
                  <div className="flex justify-center py-12">
                    <span className="loading loading-spinner loading-lg"></span>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="table table-zebra w-full bg-base-100 shadow-xl">
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
    </div>
  );
}
