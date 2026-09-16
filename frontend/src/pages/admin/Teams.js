import React, { useEffect, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import { getAllTeams, approveTeam, rejectTeam, deleteTeam } from "../../services/adminService";

function AdminTeams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      setLoading(true);
      const res = await getAllTeams();
      if (res.success && res.teams) {
        setTeams(res.teams);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id, name) => {
    if (!window.confirm(`Approve team registration for ${name}? They will be permitted to log in.`)) return;
    try {
      setActionId(id);
      await approveTeam(id);
      setTeams(teams.map((t) => (t.id === id ? { ...t, status: "Approved" } : t)));
    } catch (err) {
      alert("Failed to approve team member.");
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async (id, name) => {
    if (!window.confirm(`Reject team registration for ${name}?`)) return;
    try {
      setActionId(id);
      await rejectTeam(id);
      setTeams(teams.map((t) => (t.id === id ? { ...t, status: "Rejected" } : t)));
    } catch (err) {
      alert("Failed to reject team member.");
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Permanently remove team member ${name}?`)) return;
    try {
      setActionId(id);
      await deleteTeam(id);
      setTeams(teams.filter((t) => t.id !== id));
    } catch (err) {
      alert("Failed to delete team member.");
    } finally {
      setActionId(null);
    }
  };

  const pendingCount = teams.filter((t) => t.status === "Pending").length;

  const filtered = teams.filter(
    (t) => statusFilter === "All" || t.status === statusFilter
  );

  return (
    <AdminLayout
      title="Team Member Management"
      subtitle="Review pending volunteer registrations, grant system permissions, and manage verification staff"
    >
      {/* Alert if Pending Registrations */}
      {pendingCount > 0 && (
        <div className="alert alert-warning d-flex justify-content-between align-items-center mb-4 border-warning">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-person-fill-exclamation fs-4"></i>
            <div>
              <strong>Pending Approvals:</strong> You have <strong>{pendingCount}</strong> volunteer application(s) awaiting your decision.
            </div>
          </div>
          <button
            className="btn btn-sm btn-outline-dark"
            onClick={() => setStatusFilter("Pending")}
          >
            Show Pending Only
          </button>
        </div>
      )}

      <div className="content-card">
        <div className="content-card-header flex-wrap gap-2">
          <div className="d-flex align-items-center gap-2">
            <button
              className={`btn btn-sm ${statusFilter === "All" ? "btn-primary-custom" : "btn-outline-custom"}`}
              onClick={() => setStatusFilter("All")}
            >
              All ({teams.length})
            </button>
            <button
              className={`btn btn-sm ${statusFilter === "Pending" ? "btn-primary-custom" : "btn-outline-custom"}`}
              onClick={() => setStatusFilter("Pending")}
            >
              Pending ({pendingCount})
            </button>
            <button
              className={`btn btn-sm ${statusFilter === "Approved" ? "btn-primary-custom" : "btn-outline-custom"}`}
              onClick={() => setStatusFilter("Approved")}
            >
              Approved ({teams.filter((t) => t.status === "Approved").length})
            </button>
            <button
              className={`btn btn-sm ${statusFilter === "Rejected" ? "btn-primary-custom" : "btn-outline-custom"}`}
              onClick={() => setStatusFilter("Rejected")}
            >
              Rejected ({teams.filter((t) => t.status === "Rejected").length})
            </button>
          </div>

          <button
            className="btn btn-outline-custom btn-sm"
            onClick={loadTeams}
            disabled={loading}
          >
            <i className="bi bi-arrow-clockwise me-1"></i> Refresh
          </button>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-2 text-muted">Loading team members...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-person-badge text-muted" style={{ fontSize: "2.5rem" }}></i>
            <h5 className="mt-3 fw-bold">No Team Members Found</h5>
            <p className="text-muted">No team members match the selected filter.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Member Name</th>
                  <th>Official Email</th>
                  <th>Contact Phone</th>
                  <th>Approval Status</th>
                  <th>Applied On</th>
                  <th className="text-end">Administrative Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr key={t.id}>
                    <td className="text-muted">#{t.id}</td>
                    <td className="fw-semibold text-dark">{t.name}</td>
                    <td>{t.email}</td>
                    <td>{t.phone || "N/A"}</td>
                    <td>
                      <span
                        className={`status-badge ${
                          t.status === "Approved"
                            ? "approved"
                            : t.status === "Rejected"
                            ? "rejected"
                            : "pending"
                        }`}
                      >
                        <i
                          className={`bi ${
                            t.status === "Approved"
                              ? "bi-check-circle-fill"
                              : t.status === "Rejected"
                              ? "bi-x-circle-fill"
                              : "bi-hourglass-split"
                          }`}
                        ></i>{" "}
                        {t.status || "Pending"}
                      </span>
                    </td>
                    <td>{new Date(t.created_at).toLocaleDateString()}</td>
                    <td className="text-end">
                      <div className="d-inline-flex gap-1">
                        {t.status !== "Approved" && (
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => handleApprove(t.id, t.name)}
                            disabled={actionId === t.id}
                            title="Approve registration"
                          >
                            <i className="bi bi-check-lg me-1"></i> Approve
                          </button>
                        )}
                        {t.status !== "Rejected" && (
                          <button
                            className="btn btn-sm btn-warning text-dark"
                            onClick={() => handleReject(t.id, t.name)}
                            disabled={actionId === t.id}
                            title="Reject registration"
                          >
                            <i className="bi bi-x-lg me-1"></i> Reject
                          </button>
                        )}
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(t.id, t.name)}
                          disabled={actionId === t.id}
                          title="Delete member"
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

export default AdminTeams;