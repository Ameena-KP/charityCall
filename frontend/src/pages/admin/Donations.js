import React, { useEffect, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import { getAllDonations } from "../../services/donationService";

function AdminDonations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadDonations();
  }, []);

  const loadDonations = async () => {
    try {
      setLoading(true);
      const res = await getAllDonations();
      if (res.success && res.donations) {
        setDonations(res.donations);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = donations.filter((d) => {
    const matchStatus = statusFilter === "All" || d.donation_status === statusFilter;
    const matchSearch =
      (d.donor_name && d.donor_name.toLowerCase().includes(search.toLowerCase())) ||
      (d.title && d.title.toLowerCase().includes(search.toLowerCase())) ||
      (d.item_name && d.item_name.toLowerCase().includes(search.toLowerCase()));
    return matchStatus && matchSearch;
  });

  return (
    <AdminLayout
      title="Monitor Donations"
      subtitle="Complete audit trail of all items pledged by donors across the platform"
    >
      {/* Filters Card */}
      <div className="content-card mb-4">
        <div className="content-card-body d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div className="d-flex gap-2">
            {["All", "Pending", "Completed"].map((s) => (
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

          <div className="input-group input-group-sm" style={{ width: "260px" }}>
            <span className="input-group-text bg-light">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search donor, item, appeal..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="content-card">
        <div className="content-card-header flex-wrap gap-2">
          <h5 className="content-card-title">All Donation Records ({filtered.length})</h5>
          <button
            className="btn btn-outline-custom btn-sm"
            onClick={loadDonations}
            disabled={loading}
          >
            <i className="bi bi-arrow-clockwise me-1"></i> Refresh
          </button>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-2 text-muted">Loading donation logs...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-box2 text-muted" style={{ fontSize: "2.5rem" }}></i>
            <h5 className="mt-3 fw-bold">No Donations Found</h5>
            <p className="text-muted">No records match your selected criteria.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Donor Info</th>
                  <th>Appeal Title</th>
                  <th>Item Pledged</th>
                  <th>Quantity</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Date Pledged</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d) => (
                  <tr key={d.id}>
                    <td className="text-muted">#{d.id}</td>
                    <td>
                      <div className="fw-semibold text-dark">{d.donor_name || "User"}</div>
                      <small className="text-muted d-block">{d.donor_email}</small>
                      <small className="text-muted">{d.donor_phone}</small>
                    </td>
                    <td>
                      <div className="fw-semibold text-primary">{d.title}</div>
                    </td>
                    <td>
                      <strong>{d.item_name}</strong>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border px-2 py-1">
                        {d.quantity} units
                      </span>
                    </td>
                    <td>
                      <span className="category-tag">{d.category || "General"}</span>
                    </td>
                    <td>
                      <span
                        className={`status-badge ${
                          d.donation_status === "Completed" ? "completed" : "pending"
                        }`}
                      >
                        <i
                          className={`bi ${
                            d.donation_status === "Completed"
                              ? "bi-check-circle-fill"
                              : "bi-clock-history"
                          }`}
                        ></i>{" "}
                        {d.donation_status}
                      </span>
                    </td>
                    <td>{new Date(d.donated_at).toLocaleDateString()}</td>
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

export default AdminDonations;
