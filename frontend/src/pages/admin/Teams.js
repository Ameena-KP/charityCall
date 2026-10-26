import React, { useEffect, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import { getAllTeams, approveTeam, rejectTeam, deleteTeam } from "../../services/adminService";

function AdminTeams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);

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
    if (!window.confirm(`Approve volunteer registration for ${name}? They will be permitted to log in.`)) return;
    try {
      setActionId(id);
      await approveTeam(id);
      setTeams(teams.map((t) => (t.id === id ? { ...t, status: "Approved" } : t)));
      if (selectedVolunteer && selectedVolunteer.id === id) {
        setSelectedVolunteer((prev) => (prev ? { ...prev, status: "Approved" } : null));
      }
    } catch (err) {
      alert("Failed to approve volunteer.");
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async (id, name) => {
    if (!window.confirm(`Reject volunteer registration for ${name}?`)) return;
    try {
      setActionId(id);
      await rejectTeam(id);
      setTeams(teams.map((t) => (t.id === id ? { ...t, status: "Rejected" } : t)));
      if (selectedVolunteer && selectedVolunteer.id === id) {
        setSelectedVolunteer((prev) => (prev ? { ...prev, status: "Rejected" } : null));
      }
    } catch (err) {
      alert("Failed to reject volunteer.");
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Permanently remove volunteer ${name}?`)) return;
    try {
      setActionId(id);
      await deleteTeam(id);
      setTeams(teams.filter((t) => t.id !== id));
      if (selectedVolunteer && selectedVolunteer.id === id) {
        setSelectedVolunteer(null);
      }
    } catch (err) {
      alert("Failed to delete volunteer.");
    } finally {
      setActionId(null);
    }
  };

  const pendingCount = teams.filter((t) => t.status === "Pending").length;

  const filtered = teams.filter(
    (t) => statusFilter === "All" || t.status === statusFilter
  );

  const getFileUrl = (filename) => {
    if (!filename) return null;
    return `http://localhost:5000/uploads/${filename}`;
  };

  const isPdf = (filename) => {
    if (!filename) return false;
    return filename.toLowerCase().endsWith(".pdf");
  };

  return (
    <AdminLayout
      title="Volunteer Management"
      subtitle="Review volunteer registrations, inspect submitted ID proof documents, and grant or revoke system verification access"
    >
      {/* Alert if Pending Registrations */}
      {pendingCount > 0 && (
        <div className="alert alert-warning d-flex justify-content-between align-items-center mb-4 border-warning shadow-sm">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-person-fill-exclamation fs-4 text-warning"></i>
            <div>
              <strong>Pending Approvals:</strong> You have <strong>{pendingCount}</strong> volunteer application(s) with ID documents awaiting your review.
            </div>
          </div>
          <button
            className="btn btn-sm btn-dark"
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
            <p className="mt-2 text-muted">Loading volunteers...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-person-badge text-muted" style={{ fontSize: "2.5rem" }}></i>
            <h5 className="mt-3 fw-bold">No Volunteers Found</h5>
            <p className="text-muted">No volunteers match the selected filter.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Volunteer Name</th>
                  <th>Official Email</th>
                  <th>Contact Phone</th>
                  <th>ID Proof Document</th>
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
                      {t.id_document ? (
                        <div className="d-flex align-items-center gap-1">
                          <button
                            className="btn btn-sm btn-outline-primary py-1 px-2"
                            onClick={() => setSelectedVolunteer(t)}
                            title="Inspect ID proof document"
                          >
                            <i className="bi bi-file-earmark-person-fill me-1"></i> View ID
                          </button>
                          <a
                            href={getFileUrl(t.id_document)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-light border py-1 px-2 text-muted"
                            title="Open document in new tab"
                          >
                            <i className="bi bi-box-arrow-up-right"></i>
                          </a>
                        </div>
                      ) : (
                        <span className="badge bg-secondary-subtle text-secondary border">
                          No ID Uploaded
                        </span>
                      )}
                    </td>
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

      {/* Volunteer ID Document Inspection Modal */}
      {selectedVolunteer && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(15, 23, 42, 0.75)", zIndex: 1055 }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-dark text-white">
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-shield-check text-primary fs-4"></i>
                  <div>
                    <h5 className="modal-title mb-0 fw-bold">
                      Volunteer ID Verification & Inspection
                    </h5>
                    <small className="text-light opacity-75">
                      Applicant: {selectedVolunteer.name} (ID: #{selectedVolunteer.id})
                    </small>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setSelectedVolunteer(null)}
                ></button>
              </div>

              <div className="modal-body p-4">
                {/* Volunteer Details Grid */}
                <div className="row g-3 p-3 bg-light rounded-3 mb-4 border">
                  <div className="col-sm-6 col-md-4">
                    <small className="text-muted d-block">Volunteer Name</small>
                    <strong className="text-dark">{selectedVolunteer.name}</strong>
                  </div>
                  <div className="col-sm-6 col-md-4">
                    <small className="text-muted d-block">Official Email</small>
                    <span className="text-dark">{selectedVolunteer.email}</span>
                  </div>
                  <div className="col-sm-6 col-md-4">
                    <small className="text-muted d-block">Contact Phone</small>
                    <strong className="text-dark">{selectedVolunteer.phone || "N/A"}</strong>
                  </div>
                  <div className="col-sm-6 col-md-4">
                    <small className="text-muted d-block">Applied On</small>
                    <span className="text-dark">{new Date(selectedVolunteer.created_at).toLocaleString()}</span>
                  </div>
                  <div className="col-sm-6 col-md-4">
                    <small className="text-muted d-block">Approval Status</small>
                    <span
                      className={`badge ${
                        selectedVolunteer.status === "Approved"
                          ? "bg-success"
                          : selectedVolunteer.status === "Rejected"
                          ? "bg-danger"
                          : "bg-warning text-dark"
                      }`}
                    >
                      {selectedVolunteer.status || "Pending"}
                    </span>
                  </div>
                  <div className="col-sm-6 col-md-4 d-flex align-items-end">
                    {selectedVolunteer.id_document && (
                      <a
                        href={getFileUrl(selectedVolunteer.id_document)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline-dark w-100"
                      >
                        <i className="bi bi-box-arrow-up-right me-1"></i> Open in New Tab
                      </a>
                    )}
                  </div>
                </div>

                {/* ID Document Preview Container */}
                <div className="border rounded-3 p-3 bg-white">
                  <h6 className="fw-semibold mb-3 d-flex align-items-center gap-2">
                    <i className="bi bi-file-earmark-person text-primary"></i>
                    Uploaded ID Document: <span className="text-muted font-monospace small">{selectedVolunteer.id_document || "None"}</span>
                  </h6>

                  {selectedVolunteer.id_document ? (
                    isPdf(selectedVolunteer.id_document) ? (
                      <div style={{ height: "480px" }}>
                        <iframe
                          src={getFileUrl(selectedVolunteer.id_document)}
                          width="100%"
                          height="100%"
                          title="Volunteer ID Document"
                          className="rounded border"
                        />
                      </div>
                    ) : (
                      <div className="text-center p-2 bg-light rounded border" style={{ maxHeight: "480px", overflow: "auto" }}>
                        <img
                          src={getFileUrl(selectedVolunteer.id_document)}
                          alt="Volunteer ID Document"
                          className="img-fluid rounded shadow-sm"
                          style={{ maxHeight: "450px", objectFit: "contain" }}
                        />
                      </div>
                    )
                  ) : (
                    <div className="text-center py-5 text-muted">
                      <i className="bi bi-file-earmark-x fs-1"></i>
                      <p className="mt-2 mb-0">No ID proof document was attached with this registration.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-footer bg-light justify-content-between">
                <span className="small text-muted">
                  Verify the authenticity of the ID document before granting access.
                </span>
                <div className="d-flex gap-2">
                  {selectedVolunteer.status !== "Approved" && (
                    <button
                      className="btn btn-success"
                      onClick={() => handleApprove(selectedVolunteer.id, selectedVolunteer.name)}
                      disabled={actionId === selectedVolunteer.id}
                    >
                      <i className="bi bi-check-circle-fill me-1"></i> Approve Volunteer
                    </button>
                  )}
                  {selectedVolunteer.status !== "Rejected" && (
                    <button
                      className="btn btn-warning text-dark"
                      onClick={() => handleReject(selectedVolunteer.id, selectedVolunteer.name)}
                      disabled={actionId === selectedVolunteer.id}
                    >
                      <i className="bi bi-x-circle-fill me-1"></i> Reject Registration
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setSelectedVolunteer(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminTeams;
