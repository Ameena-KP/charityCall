import React, { useEffect, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import { getAllUsers, blockUser, unblockUser, deleteUser } from "../../services/adminService";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionId, setActionId] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await getAllUsers();
      if (res.success && res.users) {
        setUsers(res.users);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlock = async (user) => {
    const isCurrentlyBlocked = user.status === "Blocked";
    const confirmMsg = isCurrentlyBlocked
      ? `Are you sure you want to UNBLOCK user ${user.name}? They will be able to log in again.`
      : `Are you sure you want to BLOCK user ${user.name}? They will be immediately prevented from logging in.`;

    if (!window.confirm(confirmMsg)) return;

    try {
      setActionId(user.id);
      if (isCurrentlyBlocked) {
        await unblockUser(user.id);
        setUsers(
          users.map((u) => (u.id === user.id ? { ...u, status: "Active" } : u))
        );
      } else {
        await blockUser(user.id);
        setUsers(
          users.map((u) => (u.id === user.id ? { ...u, status: "Blocked" } : u))
        );
      }
    } catch (err) {
      alert("Failed to update user status.");
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to permanently DELETE user ${name}? This action cannot be undone.`)) return;

    try {
      setActionId(id);
      await deleteUser(id);
      setUsers(users.filter((u) => u.id !== id));
    } catch (err) {
      alert("Failed to delete user.");
    } finally {
      setActionId(null);
    }
  };

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.phone && u.phone.includes(search))
  );

  return (
    <AdminLayout
      title="User Management"
      subtitle="Supervise registered donors and beneficiaries, manage account statuses, and block/unblock users"
    >
      <div className="content-card">
        <div className="content-card-header flex-wrap gap-2">
          <div className="d-flex align-items-center gap-3">
            <h5 className="content-card-title">All Registered Users ({users.length})</h5>
          </div>

          <div className="d-flex gap-2">
            <div className="input-group input-group-sm" style={{ width: "250px" }}>
              <span className="input-group-text bg-light">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search name, email, phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button
              className="btn btn-outline-custom btn-sm"
              onClick={loadUsers}
              disabled={loading}
            >
              <i className="bi bi-arrow-clockwise"></i>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-2 text-muted">Loading users...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-people text-muted" style={{ fontSize: "2.5rem" }}></i>
            <h5 className="mt-3 fw-bold">No Users Found</h5>
            <p className="text-muted">No users match your filter criteria.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Status</th>
                  <th>Registration Date</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id}>
                    <td className="text-muted">#{u.id}</td>
                    <td className="fw-semibold text-dark">{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.phone || "N/A"}</td>
                    <td style={{ maxWidth: "200px" }}>
                      <span className="text-truncate d-block" title={u.address}>
                        {u.address || "N/A"}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`status-badge ${
                          u.status === "Blocked" ? "blocked" : "active"
                        }`}
                      >
                        <i
                          className={`bi ${
                            u.status === "Blocked"
                              ? "bi-slash-circle-fill"
                              : "bi-check-circle-fill"
                          }`}
                        ></i>{" "}
                        {u.status || "Active"}
                      </span>
                    </td>
                    <td>{new Date(u.created_at).toLocaleDateString()}</td>
                    <td className="text-end">
                      <div className="d-inline-flex gap-2">
                        <button
                          className={`btn btn-sm ${
                            u.status === "Blocked"
                              ? "btn-outline-success"
                              : "btn-outline-warning"
                          }`}
                          onClick={() => handleToggleBlock(u)}
                          disabled={actionId === u.id}
                          title={u.status === "Blocked" ? "Unblock this user" : "Block this user"}
                        >
                          <i
                            className={`bi ${
                              u.status === "Blocked"
                                ? "bi-unlock-fill me-1"
                                : "bi-lock-fill me-1"
                            }`}
                          ></i>
                          {u.status === "Blocked" ? "Unblock" : "Block"}
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDelete(u.id, u.name)}
                          disabled={actionId === u.id}
                          title="Permanently remove user"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminUsers;