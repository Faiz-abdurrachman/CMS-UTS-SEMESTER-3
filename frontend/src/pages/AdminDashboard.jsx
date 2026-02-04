// ============================================
// FILE: src/pages/AdminDashboard.jsx
// DESKRIPSI: Dashboard admin - Modern Clean Design
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
  const [activeTab, setActiveTab] = useState("items");
  const [filterStatus, setFilterStatus] = useState("all");
  const [user, setUser] = useState(null);

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
      if (parsedUser.role !== "admin") {
        toast.error("Access denied! Only admins can access this page.");
        navigate("/dashboard", { replace: true });
      } else {
        setUser(parsedUser);
      }
    } else {
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
      toast.error("Failed to load data");
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
        `Report ${status === "approved" ? "approved" : "rejected"}`
      );
      fetchData();
    } catch (err) {
      toast.error("Failed to update status");
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
      toast.success("Item marked as resolved");
      handleCloseResolveModal();
      fetchData();
    } catch (err) {
      toast.error("Failed to mark item as resolved");
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
      item.image
        ? `${import.meta.env.PROD ? "/api" : "http://localhost:5000"}/uploads/${
            item.image
          }`
        : null
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

      await api.put(`/admin/items/${editingItem.id}`, formData);

      toast.success("Item updated successfully");
      handleCloseEditModal();
      fetchData();
    } catch (err) {
      toast.error("Failed to update item");
    }
  };

  // ============================================
  // HANDLE DELETE
  // ============================================

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this report?")) {
      return;
    }

    try {
      await api.delete(`/admin/items/${itemId}`);
      toast.success("Report deleted successfully");
      fetchData();
    } catch (err) {
      toast.error("Failed to delete report");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      await api.delete(`/admin/users/${userId}`);
      toast.success("User deleted successfully");
      fetchData();
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  // Filter items berdasarkan validation status
  const filteredItems =
    filterStatus === "all"
      ? items
      : items.filter((item) => item.validation_status === filterStatus);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <SidebarAdmin activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 pl-16 sm:pl-6 lg:pl-8">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold text-primary mb-1 truncate">
                Admin Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">
                Manage all reports and users of the Lost & Found system
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-accent rounded-lg">
                <svg
                  className="w-4 h-4 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
                <span className="text-sm font-semibold text-primary">
                  Admin Mode
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {/* Statistics Cards */}
          {statistics && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Total Users
                </p>
                <p className="text-3xl font-display font-bold text-primary">
                  {statistics.totalUsers}
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Total Reports
                </p>
                <p className="text-3xl font-display font-bold text-gray-700">
                  {statistics.totalItems}
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Pending
                </p>
                <p className="text-3xl font-display font-bold text-orange-600">
                  {statistics.totalPending}
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Approved
                </p>
                <p className="text-3xl font-display font-bold text-green-600">
                  {statistics.totalApproved}
                </p>
              </div>
            </div>
          )}

          {/* Items Tab */}
          {activeTab === "items" && (
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-1 h-10 bg-primary rounded-full"></div>
                    <h2 className="text-2xl sm:text-3xl font-display font-bold text-primary">
                      Manage Reports
                    </h2>
                  </div>
                  <p className="text-gray-600 text-sm sm:text-base max-w-2xl">
                    Validate, approve, or reject reports from users. Admin can
                    CRUD all reports.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                  <Link
                    to="/report-lost"
                    className="px-3 sm:px-4 py-2 bg-accent text-primary rounded-lg font-semibold hover:bg-accent-dark transition-all duration-200 text-xs sm:text-sm shadow-sm hover:shadow-md text-center"
                  >
                    <span className="hidden sm:inline">Add Lost Report</span>
                    <span className="sm:hidden">Lost</span>
                  </Link>
                  <Link
                    to="/report-found"
                    className="px-3 sm:px-4 py-2 bg-accent text-primary rounded-lg font-semibold hover:bg-accent-dark transition-all duration-200 text-xs sm:text-sm shadow-sm hover:shadow-md text-center"
                  >
                    <span className="hidden sm:inline">Add Found Report</span>
                    <span className="sm:hidden">Found</span>
                  </Link>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex flex-wrap gap-2 mb-6">
                {["all", "pending", "approved", "rejected"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                      filterStatus === status
                        ? "bg-primary text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                    }`}
                  >
                    {status === "all"
                      ? "All"
                      : status === "pending"
                      ? "Pending"
                      : status === "approved"
                      ? "Approved"
                      : "Rejected"}
                  </button>
                ))}
              </div>

              {loading ? (
                <div className="flex justify-center py-16">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center border-2 border-dashed border-gray-200">
                  <p className="text-gray-500 text-lg">No reports</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                    >
                      <CardItem item={item} showDelete={false} />
                      <div className="p-4 pt-0 space-y-3">
                        {/* Validation Status Badge */}
                        <div>
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                              item.validation_status === "pending"
                                ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                                : item.validation_status === "approved"
                                ? "bg-green-100 text-green-700 border border-green-200"
                                : "bg-red-100 text-red-700 border border-red-200"
                            }`}
                          >
                            {item.validation_status === "pending"
                              ? "Pending"
                              : item.validation_status === "approved"
                              ? "Approved"
                              : "Rejected"}
                          </span>
                        </div>

                        {/* Resolved Status */}
                        {item.resolved_at && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <p className="text-sm font-semibold text-blue-800 mb-1">
                              Item Resolved
                            </p>
                            <p className="text-xs text-blue-600">
                              {new Date(item.resolved_at).toLocaleString(
                                "en-US"
                              )}
                            </p>
                            {item.resolved_note && (
                              <p className="text-xs text-blue-700 mt-2">
                                <strong>Note:</strong> {item.resolved_note}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Action Buttons */}
                        {item.validation_status === "pending" && (
                          <div className="flex gap-2">
                            <button
                              className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all duration-200 text-sm"
                              onClick={() =>
                                handleValidationStatus(item.id, "approved")
                              }
                            >
                              Approve
                            </button>
                            <button
                              className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all duration-200 text-sm"
                              onClick={() =>
                                handleValidationStatus(item.id, "rejected")
                              }
                            >
                              Reject
                            </button>
                          </div>
                        )}

                        {/* Mark as Resolved Button */}
                        {item.validation_status === "approved" &&
                          !item.resolved_at && (
                            <button
                              className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 text-sm"
                              onClick={() => handleOpenResolveModal(item.id)}
                            >
                              Mark as Resolved
                            </button>
                          )}

                        {/* Edit & Delete Buttons */}
                        <div className="flex gap-2 pt-2 border-t border-gray-100">
                          <button
                            className="flex-1 px-3 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-light transition-all duration-200 text-sm"
                            onClick={() => handleOpenEditModal(item)}
                          >
                            Edit
                          </button>
                          <button
                            className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all duration-200 text-sm"
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            Delete
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
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-10 bg-primary rounded-full"></div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-primary mb-1">
                    Manage Users
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base">
                    View and manage all registered users in the system
                  </p>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center py-16">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Role
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Registered Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                          <tr
                            key={user.id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {user.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {user.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {user.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                  user.role === "admin"
                                    ? "bg-primary text-white"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {user.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {new Date(user.created_at).toLocaleDateString(
                                "en-US"
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <button
                                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => handleDeleteUser(user.id)}
                                disabled={user.role === "admin"}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Modal Mark as Resolved */}
      {showResolveModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-display font-bold text-primary mb-4">
              Mark Item as Resolved
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              This item will be removed from the public dashboard within 24
              hours after being marked as resolved.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Note (Optional)
              </label>
              <textarea
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-200 text-gray-900 resize-none"
                rows="4"
                placeholder="e.g., Item returned to owner, Item collected at security office, etc."
                value={resolveNote}
                onChange={(e) => setResolveNote(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <button
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-200"
                onClick={handleCloseResolveModal}
              >
                Cancel
              </button>
              <button
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-light transition-all duration-200"
                onClick={handleMarkAsResolved}
              >
                Mark as Resolved
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Edit Item */}
      {showEditModal && editingItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 my-8 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-display font-bold text-primary mb-6">
              Edit Report
            </h3>

            <div className="space-y-4">
              {/* Item Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Item Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-200 text-gray-900"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-200 text-gray-900 resize-none"
                  rows="4"
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  required
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-200 text-gray-900"
                  value={editForm.location}
                  onChange={(e) =>
                    setEditForm({ ...editForm, location: e.target.value })
                  }
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-200 text-gray-900"
                  value={editForm.date_occured}
                  onChange={(e) =>
                    setEditForm({ ...editForm, date_occured: e.target.value })
                  }
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status
                </label>
                <select
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-200 text-gray-900"
                  value={editForm.status}
                  onChange={(e) =>
                    setEditForm({ ...editForm, status: e.target.value })
                  }
                >
                  <option value="lost">Lost</option>
                  <option value="found">Found</option>
                </select>
              </div>

              {/* Validation Status */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Validation Status
                </label>
                <select
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-200 text-gray-900"
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

              {/* Upload Image */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Item Photo (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleEditImageChange}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-200 text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-primary hover:file:bg-accent-dark file:cursor-pointer"
                />
                {editImagePreview && (
                  <div className="mt-3">
                    <img
                      src={editImagePreview}
                      alt="Preview"
                      className="max-w-xs rounded-lg border-2 border-gray-200 shadow-sm"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
              <button
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-200"
                onClick={handleCloseEditModal}
              >
                Cancel
              </button>
              <button
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-light transition-all duration-200"
                onClick={handleUpdateItem}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
