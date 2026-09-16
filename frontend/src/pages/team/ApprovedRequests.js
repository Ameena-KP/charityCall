import React, { useEffect, useState } from "react";
import TeamLayout from "../../layout/TeamLayout";
import { getApprovedRequests } from "../../services/teamService";

function ApprovedRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState("All");

  const categories = ["All", "Food", "Clothing", "Medicine", "Education", "Shelter", "Medical"];

  useEffect(() => {
    loadApproved();
  }, []);

  const loadApproved = async () => {
    try {
      setLoading(true);
      const res = await getApprovedRequests();
      if (res.success && res.requests) {
        setRequests(res.requests);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = requests.filter(
    (r) =>
      filterCategory === "All" ||
      (r.category && r.category.toLowerCase() === filterCategory.toLowerCase())
  );

  return (
    <TeamLayout
      title="Approved Charity Requests"
      subtitle="Published appeals that are actively receiving donor pledges"
    >
      <div className="content-card mb-4">
        <div className="content-card-body d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div className="d-flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`btn btn-sm ${
                  filterCategory === cat
                    ? "btn-primary-custom"
                    : "btn-outline-custom"
                }`}
                onClick={() => setFilterCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <span className="text-muted small">
            Total Active Appeals: <strong>{filtered.length}</strong>
          </span>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2 text-muted">Loading approved requests...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="content-card text-center py-5">
          <i className="bi bi-inbox text-muted" style={{ fontSize: "2.5rem" }}></i>
          <h5 className="mt-3 fw-bold">No Approved Requests Found</h5>
          <p className="text-muted">Approved requests will appear here once verified.</p>
        </div>
      ) : (
        <div className="content-card">
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Applicant</th>
                  <th>Appeal Title</th>
                  <th>Category</th>
                  <th>Required Items</th>
                  <th>Status</th>
                  <th>Proof</th>
                  <th>Published Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id}>
                    <td className="text-muted">#{r.id}</td>
                    <td>
                      <div className="fw-semibold">{r.user_name || "Applicant"}</div>
                      <small className="text-muted">{r.user_phone || r.user_email}</small>
                    </td>
                    <td>
                      <div className="fw-semibold text-primary">{r.title}</div>
                      <small className="text-muted d-block text-truncate" style={{ maxWidth: "240px" }}>
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
                        <span className="text-muted small">None specified</span>
                      )}
                    </td>
                    <td>
                      <span className="status-badge approved">
                        <i className="bi bi-check-circle-fill"></i> Approved
                      </span>
                    </td>
                    <td>
                      {r.document ? (
                        <a
                          href={`http://localhost:5000/uploads/${r.document}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-outline-secondary btn-sm"
                        >
                          <i className="bi bi-file-earmark-pdf"></i>
                        </a>
                      ) : (
                        <span className="text-muted small">None</span>
                      )}
                    </td>
                    <td>{new Date(r.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </TeamLayout>
  );
}

export default ApprovedRequests;
