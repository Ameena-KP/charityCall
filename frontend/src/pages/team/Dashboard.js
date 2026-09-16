import React, { useEffect, useState } from "react";
import TeamLayout from "../../layout/TeamLayout";
import {
  getPendingRequests,
  approveRequest,
  rejectRequest,
  updateCategory,
} from "../../services/teamService";

function TeamDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedReq, setSelectedReq] = useState(null); // For detail view modal

  const categories = ["Food", "Clothing", "Medicine", "Education", "Shelter", "Medical", "Other"];

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      setLoading(true);
      const res = await getPendingRequests();
      if (res.success && res.requests) {
        setRequests(res.requests);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id, currentCat) => {
    if (!window.confirm("Confirm verification and APPROVE this charity request? It will be published to donors.")) return;
    try {
      setActionLoading(id);
      await approveRequest(id, currentCat);
      setRequests(requests.filter((r) => r.id !== id));
      if (selectedReq?.id === id) setSelectedReq(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to approve request");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Are you sure you want to REJECT this charity request?")) return;
    try {
      setActionLoading(id);
      await rejectRequest(id);
      setRequests(requests.filter((r) => r.id !== id));
      if (selectedReq?.id === id) setSelectedReq(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to reject request");
    } finally {
      setActionLoading(null);
    }
  };

  const handleCategoryChange = async (id, newCat) => {
    try {
      await updateCategory(id, newCat);
      setRequests(
        requests.map((r) => (r.id === id ? { ...r, category: newCat } : r))
      );
    } catch (err) {
      alert("Failed to update category");
    }
  };

  return (
    <TeamLayout
      title="Verification Queue"
      subtitle="Examine applicant details, verify supporting documents, categorize, and approve genuine requests"
    >
      {/* Quick Summary Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="stat-card">
            <div className="stat-icon warning">
              <i className="bi bi-hourglass-split"></i>
            </div>
            <div>
              <div className="stat-value">{requests.length}</div>
              <p className="stat-label">Pending Verification</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="stat-card">
            <div className="stat-icon success">
              <i className="bi bi-shield-check"></i>
            </div>
            <div>
              <div className="stat-value">Zero-Fraud</div>
              <p className="stat-label">Document Mandate</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="stat-card">
            <div className="stat-icon primary">
              <i className="bi bi-tags-fill"></i>
            </div>
            <div>
              <div className="stat-value">6+</div>
              <p className="stat-label">Aid Categories</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="content-card">
        <div className="content-card-header">
          <h5 className="content-card-title">
            <i className="bi bi-list-check text-primary me-2"></i>
            Charity Requests Awaiting Verification ({requests.length})
          </h5>
          <button
            className="btn btn-outline-custom btn-sm"
            onClick={fetchPending}
            disabled={loading}
          >
            <i className="bi bi-arrow-clockwise me-1"></i> Refresh
          </button>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-2 text-muted">Loading pending requests...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-check2-circle text-success" style={{ fontSize: "3rem" }}></i>
            <h5 className="mt-3 fw-bold">All Caught Up!</h5>
            <p className="text-muted">There are no charity requests pending verification right now.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Applicant Details</th>
                  <th>Title & Description</th>
                  <th>Required Items</th>
                  <th>Categorize</th>
                  <th>Proof Document</th>
                  <th className="text-end">Verification Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => (
                  <tr key={r.id}>
                    <td className="text-muted">#{r.id}</td>

                    {/* Applicant details */}
                    <td>
                      <div className="fw-semibold">{r.user_name || "Applicant"}</div>
                      <small className="text-muted d-block">{r.user_email}</small>
                      <small className="text-muted d-block">
                        <i className="bi bi-telephone me-1"></i> {r.user_phone || "N/A"}
                      </small>
                    </td>

                    {/* Request info */}
                    <td style={{ maxWidth: "260px" }}>
                      <div className="fw-semibold text-primary">{r.title}</div>
                      <p
                        className="text-muted mb-0 small text-truncate"
                        style={{ maxWidth: "250px" }}
                        title={r.description}
                      >
                        {r.description}
                      </p>
                      <button
                        className="btn btn-link p-0 small text-decoration-none"
                        style={{ fontSize: "0.75rem" }}
                        onClick={() => setSelectedReq(r)}
                      >
                        View Full Details
                      </button>
                    </td>

                    {/* Required Items */}
                    <td>
                      {r.required_items ? (
                        <span className="badge bg-light text-dark border">
                          {r.required_items}
                        </span>
                      ) : (
                        <span className="text-muted small">Not specified</span>
                      )}
                    </td>

                    {/* Categorize */}
                    <td>
                      <select
                        className="form-select form-select-sm"
                        style={{ width: "120px" }}
                        value={r.category || "Food"}
                        onChange={(e) => handleCategoryChange(r.id, e.target.value)}
                      >
                        {categories.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Proof Document */}
                    <td>
                      {r.document ? (
                        <a
                          href={`http://localhost:5000/uploads/${r.document}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-sm btn-outline-primary"
                          title="Open attached verification document"
                        >
                          <i className="bi bi-file-earmark-pdf me-1"></i> View Proof
                        </a>
                      ) : (
                        <span className="text-muted small">No File</span>
                      )}
                    </td>

                    {/* Action buttons */}
                    <td className="text-end">
                      <div className="d-inline-flex gap-1">
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleApprove(r.id, r.category)}
                          disabled={actionLoading === r.id}
                        >
                          <i className="bi bi-check-lg me-1"></i> Approve
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleReject(r.id)}
                          disabled={actionLoading === r.id}
                        >
                          <i className="bi bi-x-lg me-1"></i> Reject
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

      {/* Details & Document Verification Modal */}
      {selectedReq && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(15, 23, 42, 0.6)" }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-dark text-white">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-shield-check me-2 text-primary"></i>
                  Verification Audit: #{selectedReq.id} - {selectedReq.title}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setSelectedReq(null)}
                ></button>
              </div>

              <div className="modal-body p-4">
                <div className="row g-4 mb-4">
                  <div className="col-md-6">
                    <div className="p-3 bg-light rounded border h-100">
                      <h6 className="fw-bold text-primary mb-3">
                        <i className="bi bi-person-bounding-box me-1"></i> Applicant Eligibility
                      </h6>
                      <p className="mb-1 small">
                        <strong>Name:</strong> {selectedReq.user_name}
                      </p>
                      <p className="mb-1 small">
                        <strong>Email:</strong> {selectedReq.user_email}
                      </p>
                      <p className="mb-1 small">
                        <strong>Phone:</strong> {selectedReq.user_phone || "Not provided"}
                      </p>
                      <p className="mb-1 small">
                        <strong>Address:</strong> {selectedReq.user_address || "Not provided"}
                      </p>
                      <p className="mb-0 small">
                        <strong>Account Status:</strong>{" "}
                        <span className="badge bg-success">{selectedReq.user_status || "Active"}</span>
                      </p>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="p-3 bg-light rounded border h-100">
                      <h6 className="fw-bold text-primary mb-3">
                        <i className="bi bi-info-circle me-1"></i> Request Particulars
                      </h6>
                      <p className="mb-1 small">
                        <strong>Category:</strong> {selectedReq.category}
                      </p>
                      <p className="mb-1 small">
                        <strong>Required Items:</strong> {selectedReq.required_items || "General"}
                      </p>
                      <p className="mb-0 small">
                        <strong>Submission Date:</strong>{" "}
                        {new Date(selectedReq.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h6 className="fw-bold text-dark mb-2">Statement of Need</h6>
                  <div className="p-3 bg-white rounded border" style={{ lineHeight: 1.6 }}>
                    {selectedReq.description}
                  </div>
                </div>

                <div>
                  <h6 className="fw-bold text-dark mb-2">Uploaded Verification Document</h6>
                  {selectedReq.document ? (
                    <div className="p-3 bg-light rounded border d-flex justify-content-between align-items-center">
                      <div>
                        <i className="bi bi-file-earmark-pdf-fill text-danger fs-4 me-2"></i>
                        <span className="fw-semibold">{selectedReq.document}</span>
                      </div>
                      <a
                        href={`http://localhost:5000/uploads/${selectedReq.document}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-primary-custom btn-sm"
                      >
                        <i className="bi bi-box-arrow-up-right me-1"></i> Open Document in New Window
                      </a>
                    </div>
                  ) : (
                    <div className="alert alert-warning small mb-0">
                      <i className="bi bi-exclamation-circle me-1"></i> No verification document was uploaded for this request.
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-footer bg-light">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setSelectedReq(null)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => handleReject(selectedReq.id)}
                >
                  Reject Request
                </button>
                <button
                  type="button"
                  className="btn btn-success btn-sm"
                  onClick={() => handleApprove(selectedReq.id, selectedReq.category)}
                >
                  Approve & Publish Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </TeamLayout>
  );
}

export default TeamDashboard;