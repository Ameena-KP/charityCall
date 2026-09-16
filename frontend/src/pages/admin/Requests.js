import React, { useEffect, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import { getAllRequestsAdmin, deleteRequest } from "../../services/charityService";

function AdminRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const categories = ["All", "Food", "Clothing", "Medicine", "Education", "Shelter", "Medical", "Other"];
  const statuses = ["All", "Pending", "Approved", "Rejected"];

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const res = await getAllRequestsAdmin();
      if (res.success && res.requests) {
        setRequests(res.requests);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Permanently delete charity request: "${title}"?`)) return;
    try {
      setDeletingId(id);
      await deleteRequest(id);
      setRequests(requests.filter((r) => r.id !== id));
    } catch (err) {
      alert("Failed to delete charity request.");
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = requests.filter((r) => {
    const matchStatus = statusFilter === "All" || r.status === statusFilter;
    const matchCat =
      categoryFilter === "All" ||
      (r.category && r.category.toLowerCase() === categoryFilter.toLowerCase());
    const matchSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase()) ||
      (r.user_name && r.user_name.toLowerCase().includes(search.toLowerCase()));
    return matchStatus && matchCat && matchSearch;
  });

  return (
    <AdminLayout
      title="Charity Requests Oversight"
      subtitle="View, monitor, filter, and audit all charity requests submitted to the system"
    >
      <div className="content-card mb-4">
        <div className="content-card-body">
          <div className="row g-3 align-items-center">
            <div className="col-md-4">
              <label className="form-label small fw-semibold text-muted mb-1">Status Filter</label>
              <div className="d-flex gap-1">
                {statuses.map((s) => (
                  <button
                    key={s}
                    className={`btn btn-sm ${
                      statusFilter === s ? "btn-primary-custom" : "btn-outline-custom"
                    }`}
                    onClick={() => setStatusFilter(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="col-md-4">
              <label className="form-label small fw-semibold text-muted mb-1">Category Filter</label>
              <select
                className="form-select form-select-sm"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label small fw-semibold text-muted mb-1">Search Appeals</label>
              <div className="input-group input-group-sm">
                <span className="input-group-text bg-light">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search title, applicant..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="content-card">
        <div className="content-card-header flex-wrap gap-2">
          <h5 className="content-card-title">All Appeals ({filtered.length})</h5>
          <button
            className="btn btn-outline-custom btn-sm"
            onClick={loadRequests}
            disabled={loading}
          >
            <i className="bi bi-arrow-clockwise me-1"></i> Refresh
          </button>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-2 text-muted">Loading requests...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-inbox text-muted" style={{ fontSize: "2.5rem" }}></i>
            <h5 className="mt-3 fw-bold">No Requests Found</h5>
            <p className="text-muted">No appeals match your filter criteria.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Applicant</th>
                  <th>Title & Description</th>
                  <th>Category</th>
                  <th>Required Items</th>
                  <th>Status</th>
                  <th>Proof</th>
                  <th>Date</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id}>
                    <td className="text-muted">#{r.id}</td>
                    <td>
                      <div className="fw-semibold text-dark">{r.user_name || "User"}</div>
                      <small className="text-muted">{r.user_email}</small>
                    </td>
                    <td style={{ maxWidth: "240px" }}>
                      <div className="fw-semibold text-primary">{r.title}</div>
                      <small className="text-muted text-truncate d-block" title={r.description}>
                        {r.description}
                      </small>
                    </td>
                    <td>
                      <span className="category-tag">{r.category}</span>
                    </td>
                    <td>
                      {r.required_items ? (
                        <span className="badge bg-light text-dark border">
                          {r.required_items}
                        </span>
                      ) : (
                        <span className="text-muted small">None</span>
                      )}
                    </td>
                    <td>
                      <span
                        className={`status-badge ${
                          r.status === "Approved"
                            ? "approved"
                            : r.status === "Rejected"
                            ? "rejected"
                            : "pending"
                        }`}
                      >
                        <i
                          className={`bi ${
                            r.status === "Approved"
                              ? "bi-check-circle-fill"
                              : r.status === "Rejected"
                              ? "bi-x-circle-fill"
                              : "bi-hourglass-split"
                          }`}
                        ></i>{" "}
                        {r.status}
                      </span>
                    </td>
                    <td>
                      {r.document ? (
                        <a
                          href={`http://localhost:5000/uploads/${r.document}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-outline-secondary btn-sm"
                          title="View proof file"
                        >
                          <i className="bi bi-file-earmark-pdf"></i>
                        </a>
                      ) : (
                        <span className="text-muted small">None</span>
                      )}
                    </td>
                    <td>{new Date(r.created_at).toLocaleDateString()}</td>
                    <td className="text-end">
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDelete(r.id, r.title)}
                        disabled={deletingId === r.id}
                        title="Delete request"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
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

export default AdminRequests;
